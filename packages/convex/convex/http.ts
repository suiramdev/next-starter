import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./domains/auth/setup";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

export default http;
