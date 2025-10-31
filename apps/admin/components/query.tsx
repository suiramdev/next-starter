"use client";

import { ZeroProvider } from "@repo/zero";

type QueryProviderProps = {
  children: React.ReactNode;
};

export function QueryProvider({ children }: QueryProviderProps) {
  return <ZeroProvider>{children}</ZeroProvider>;
}
