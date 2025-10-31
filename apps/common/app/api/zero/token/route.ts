import { generateZeroToken } from "@repo/auth/helpers/zero/token";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * API route handler for Zero token generation.
 * This endpoint generates a JWT token for Zero authentication.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = await generateZeroToken(cookieStore);

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({ token });
  } catch (error) {
    console.error("Error generating Zero token:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
