"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Wallet,
  Target,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, color: "bg-nb-yellow" },
  { href: "/transactions", label: "Transaksi", icon: ArrowLeftRight, color: "bg-nb-green" },
  { href: "/analytics", label: "Analitik", icon: PieChart, color: "bg-nb-cyan" },
  { href: "/goals", label: "Goals", icon: Target, color: "bg-nb-pink" },
];

/**
 * Navigasi dengan gaya Neobrutalism.
 * - Desktop: sidebar di kiri dengan efek hover dinamis
 * - Mobile: bottom navigation bar dengan indikator aktif
 */
export function Navbar() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Top Bar (Logo only) */}
      <div className="sticky top-0 z-50 flex w-full items-center border-b-4 border-black bg-nb-yellow px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border-3 border-black bg-white shadow-nb-sm transition-transform hover:rotate-12">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">DompetKu</span>
        </Link>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around border-t-4 border-black bg-nb-yellow px-1.5 py-2 lg:hidden">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl border-3 border-black px-1 py-1.5 text-xs font-bold transition-all duration-200 ${
                isActive
                  ? `${item.color} shadow-nb-sm -translate-y-1.5 scale-105`
                  : "bg-nb-yellow hover:bg-white/60 active:translate-y-0 active:shadow-none"
              }`}
            >
              <div className={`rounded-lg p-1 transition-transform duration-200 ${isActive ? "scale-110" : ""}`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`transition-all ${isActive ? "opacity-100" : "opacity-70"}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-0.5 h-1 w-6 rounded-full bg-black" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 h-screen w-64 flex-shrink-0 border-r-4 border-black bg-nb-yellow lg:flex lg:flex-col max-lg:hidden">
        {/* Decorative dot pattern background */}
        <div className="nb-dots-pattern pointer-events-none absolute inset-0 opacity-30" />

        {/* Logo */}
        <div className="relative border-b-4 border-black p-5">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-3 border-black bg-white shadow-nb-sm transition-transform duration-200 group-hover:rotate-6 group-hover:scale-105">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight transition-colors group-hover:text-nb-dark/80">
              DompetKu
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="relative flex flex-1 flex-col gap-2 p-4">
          {navItems.map((item, idx) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl border-3 border-black px-4 py-3 text-sm font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-white shadow-nb-sm translate-x-[2px] translate-y-[2px]"
                    : "bg-nb-yellow hover:bg-white hover:shadow-nb-sm hover:-translate-y-0.5"
                }`}
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {/* Color accent bar */}
                <div className={`absolute inset-y-2 -left-[3px] w-1.5 rounded-r-full transition-all duration-200 ${
                  isActive ? `${item.color} scale-y-100` : `${item.color} scale-y-0 group-hover:scale-y-100`
                }`} />

                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black transition-all duration-200 ${
                  isActive ? item.color : "bg-white group-hover:" + item.color
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
                <span>{item.label}</span>

                {isActive && (
                  <div className="ml-auto h-2 w-2 rounded-full bg-nb-dark animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="relative border-t-4 border-black p-4">
          <div className="flex items-center gap-3 rounded-xl border-3 border-black bg-white px-4 py-3 transition-all duration-200 hover:shadow-nb-sm hover:-translate-y-0.5">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 border-2 border-black rounded-lg",
                },
              }}
            />
            <span className="text-sm font-bold">Akun Saya</span>
          </div>
        </div>
      </aside>
    </>
  );
}
