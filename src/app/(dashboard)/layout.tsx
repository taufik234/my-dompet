"use client";

import { Navbar } from "@/components/Navbar";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * Layout untuk halaman dashboard yang memerlukan autentikasi.
 * Otomatis redirect ke landing page jika user belum login.
 */
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push("/sign-in");
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nb-bg">
        <div className="nb-card bg-nb-yellow p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
          <p className="text-lg font-bold">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-nb-bg">
      <Navbar />
      <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
