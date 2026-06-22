"use client";

import { SignIn, useAuth } from "@clerk/nextjs";
import { Navbar } from "@/components/Navbar";
import { DashboardContent } from "@/components/DashboardContent";
import { Wallet, TrendingUp, PieChart, Shield, Sparkles, Target, ArrowRight } from "lucide-react";

/**
 * Root page - menampilkan:
 * - Landing page + SignIn form jika belum login
 * - Dashboard jika sudah login
 * Landing page memiliki elemen dekoratif dan animasi untuk visual yang menarik.
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
      <div className="flex min-h-screen flex-col bg-nb-bg lg:flex-row">
        <Navbar />
        <main className="flex-1 overflow-y-auto px-4 py-8 pb-20 lg:pb-8 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <DashboardContent />
          </div>
        </main>
      </div>
    );
  }

  // Belum login -> tampilkan Landing Page + Sign In
  return (
    <div className="relative min-h-screen overflow-hidden bg-nb-bg">
      {/* Floating Decorative Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="nb-float absolute -top-10 left-[10%] h-32 w-32 rounded-full bg-nb-yellow/30 blur-3xl" style={{ animationDelay: "0s" }} />
        <div className="nb-float absolute top-[20%] right-[15%] h-40 w-40 rounded-full bg-nb-pink/20 blur-3xl" style={{ animationDelay: "1s" }} />
        <div className="nb-float absolute bottom-[30%] left-[5%] h-36 w-36 rounded-full bg-nb-cyan/20 blur-3xl" style={{ animationDelay: "2s" }} />
        <div className="nb-float absolute bottom-[10%] right-[10%] h-28 w-28 rounded-full bg-nb-green/20 blur-3xl" style={{ animationDelay: "0.5s" }} />
        {/* Dot pattern overlay */}
        <div className="nb-dots-pattern absolute inset-0 opacity-20" />
      </div>

      {/* Navbar */}
      <nav className="relative border-b-4 border-black bg-nb-yellow px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border-3 border-black bg-white shadow-nb-sm transition-transform hover:rotate-12">
            <Wallet className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold tracking-tight">DompetKu</span>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative mx-auto max-w-7xl px-4 py-16">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left: Hero Text */}
          <div className="nb-fade-in flex flex-col gap-6">
            <div className="nb-pop-in nb-card inline-flex w-fit items-center gap-2 bg-nb-cyan px-4 py-2">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-bold">Aman & Real-time</span>
              <Sparkles className="h-3.5 w-3.5 nb-wiggle" />
            </div>

            <h1 className="text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
              Kelola Uangmu
              <br />
              <span className="relative inline-block">
                <span className="relative z-10">Dengan Mudah!</span>
                <span className="absolute bottom-1 left-0 z-0 h-4 w-full bg-nb-yellow opacity-60" />
              </span>
            </h1>

            <p className="max-w-md text-lg opacity-70">
              DompetKu adalah aplikasi catatan keuangan pribadi yang membantumu
              melacak pemasukan, pengeluaran, dan mencapai tujuan finansialmu.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-3">
              <div className="nb-slide-in nb-delay-1 flex items-center gap-3 rounded-xl border-3 border-black bg-white/60 p-3 transition-all hover:bg-white hover:shadow-nb-sm">
                <div className="nb-card flex h-10 w-10 items-center justify-center bg-nb-green p-0">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <span className="font-bold">Pantau saldo secara real-time</span>
              </div>
              <div className="nb-slide-in nb-delay-2 flex items-center gap-3 rounded-xl border-3 border-black bg-white/60 p-3 transition-all hover:bg-white hover:shadow-nb-sm">
                <div className="nb-card flex h-10 w-10 items-center justify-center bg-nb-pink p-0">
                  <PieChart className="h-5 w-5 text-white" />
                </div>
                <span className="font-bold">
                  Lihat pengeluaran per kategori dengan grafik
                </span>
              </div>
              <div className="nb-slide-in nb-delay-3 flex items-center gap-3 rounded-xl border-3 border-black bg-white/60 p-3 transition-all hover:bg-white hover:shadow-nb-sm">
                <div className="nb-card flex h-10 w-10 items-center justify-center bg-nb-yellow p-0">
                  <Target className="h-5 w-5" />
                </div>
                <span className="font-bold">
                  Tetapkan & capai tujuan finansial bulanan
                </span>
              </div>
            </div>
          </div>

          {/* Right: Sign In Form */}
          <div className="nb-pop-in nb-delay-2 flex justify-center">
            <div className="nb-card relative overflow-hidden bg-white p-8">
              {/* Decorative accents */}
              <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-nb-yellow/30" />
              <div className="absolute -bottom-3 -left-3 h-12 w-12 rounded-full bg-nb-cyan/30" />

              <div className="relative">
                <h2 className="mb-2 text-center text-2xl font-extrabold">
                  Masuk Sekarang
                </h2>
                <p className="mb-6 text-center text-sm opacity-60">
                  Mulai kelola keuanganmu hari ini
                </p>
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
                <div className="mt-4 flex items-center justify-center gap-1 text-sm opacity-50">
                  <span>Belum punya akun?</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
