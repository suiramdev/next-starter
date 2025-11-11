import { NextRequest, NextResponse } from "next/server";
import * as queries from "../queries";
import { withValidation, ReadonlyJSONValue } from "@rocicorp/zero";
import { handleGetQueriesRequest, PushProcessor } from "../server";
import { zeroDb } from "../server";
import { schema } from "../schema";
import { AuthData } from "../client";
import { createMutators } from "../mutators";

const validated = Object.fromEntries(
  Object.values(queries).map((q) => [q.queryName, withValidation(q)])
);

export function getQuery(
  authData: { userId: string },
  name: string,
  args: readonly ReadonlyJSONValue[]
) {
  const q = validated[name];
  if (!q) {
    throw new Error(`No such query: ${name}`);
  }

  return {
    // Pass authData to both auth'd and unauth'd queries
    // For syncedQuery, this will be ignored
    // For syncedQueryWithContext, this will be used as the context
    query: q(authData, ...args),
  };
}

export function getQueriesHandler(
  getAuthData: (request: NextRequest) => Promise<AuthData>
) {
  return async (req: NextRequest) => {
    try {
      const authData = await getAuthData(req);

      const result = await handleGetQueriesRequest(
        (name, args) => getQuery(authData, name, args),
        schema,
        req
      );

      return NextResponse.json(result);
    } catch (error) {
      console.error("Error handling get-queries request:", error);
      return NextResponse.json(
        {
          error:
            error instanceof Error ? error.message : "Internal server error",
        },
        { status: 500 }
      );
    }
  };
}

/**
 * Push handler for Zero mutations.
 * This handler processes mutations from Zero clients and applies them to the database.
 */
export function mutateHandler(getAuthData: () => Promise<AuthData>) {
  return async (req: NextRequest) => {
    try {
      const authData = await getAuthData();

      // Create the push processor
      const processor = new PushProcessor(zeroDb);

      // Get query parameters and body
      const url = new URL(req.url);
      const queryParams = Object.fromEntries(url.searchParams.entries());
      const body = await req.json();

      // Create mutators (client mutators for code sharing, server mutators for server-specific logic)
      const mutators = createMutators(authData);

      // Process the mutations
      const result = await processor.process(mutators, queryParams, body);

      return NextResponse.json(result);
    } catch (error) {
      console.error("Error processing Zero push request:", error);

      // Return appropriate error response
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  };
}
