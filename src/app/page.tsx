"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { DashboardContent } from "@/components/DashboardContent";
import { Wallet, TrendingUp, PieChart, Shield } from "lucide-react";

/**
 * Root page - menampilkan:
 * - Landing page + SignIn form jika belum login
 * - Dashboard jika sudah login
 */
export default function HomePage() {
  const { isSignedIn, isLoaded } = useAuth();

  // Loading state
  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-nb-bg">
        <div className="nb-card bg-nb-yellow p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
          <p className="text-lg font-bold">Memuat...</p>
        </div>
      </div>
    );
  }

  // Sudah login -> tampilkan Dashboard
  if (isSignedIn) {
    return (
      <div className="flex min-h-screen bg-nb-bg">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 py-8 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <DashboardContent />
          </div>
        </main>
      </div>
    );
  }

  // Belum login -> tampilkan Landing Page + Sign In
  return (
    <div className="min-h-screen bg-nb-bg">
      {/* Navbar */}
      <nav className="border-b-4 border-black bg-nb-yellow px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-3 border-black bg-white shadow-nb-sm">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">DompetKu</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Hero Text */}
          <div className="flex flex-col gap-6">
            <div className="nb-card inline-flex w-fit items-center gap-2 bg-nb-cyan px-4 py-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-bold">Aman & Real-time</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Kelola Uangmu
              <br />
              <span className="bg-nb-yellow px-2">Dengan Mudah!</span>
            </h1>

            <p className="max-w-md text-lg opacity-70">
              DompetKu adalah aplikasi catatan keuangan pribadi yang membantumu
              melacak pemasukan, pengeluaran, dan mencapai tujuan finansialmu.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="nb-card flex h-10 w-10 items-center justify-center bg-nb-green p-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="font-bold">Pantau saldo secara real-time</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="nb-card flex h-10 w-10 items-center justify-center bg-nb-pink p-0">
                  <PieChart className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">
                  Lihat pengeluaran per kategori dengan grafik
                </span>
              </div>
            </div>
          </div>

          {/* Right: Sign In Form */}
          <div className="flex justify-center">
            <div className="nb-card bg-white p-8">
              <h2 className="mb-6 text-center text-2xl font-extrabold">
                Masuk Sekarang
              </h2>
              <SignIn
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none border-none",
                    formButtonPrimary:
                      "nb-btn bg-nb-yellow text-nb-dark border-3 border-black",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
