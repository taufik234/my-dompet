"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ReactNode } from "react";

// Inisialisasi Convex client dengan URL dari environment variable
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Provider wrapper yang menggabungkan Clerk (autentikasi) dan Convex (database real-time).
 * Semua komponen di dalam ini bisa menggunakan useQuery, useMutation, dan useAuth.
 */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
