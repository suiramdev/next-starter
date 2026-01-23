import type { NextConfig } from "next";
import { basePath } from "./lib/constants";

const nextConfig: NextConfig = {
	basePath,
	transpilePackages: ["@repo/convex"],
};

export default nextConfig;
