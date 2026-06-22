"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Wallet,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { href: "/analytics", label: "Analitik", icon: PieChart },
];

/**
 * Sidebar navigasi dengan gaya Neobrutalism.
 * - Desktop: sidebar tetap di kiri
 * - Mobile: hamburger menu yang bisa dibuka/tutup
 */
export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="sticky top-0 z-50 flex items-center justify-between border-b-4 border-black bg-nb-yellow px-4 py-3 lg:hidden">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border-3 border-black bg-white shadow-nb-sm">
            <Wallet className="h-4 w-4" />
          </div>
          <span className="text-lg font-extrabold tracking-tight">DompetKu</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="nb-btn bg-white p-2"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 top-[60px] z-40 bg-black/30 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div
            className="border-b-4 border-black bg-nb-yellow p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-xl border-3 border-black px-4 py-3 text-sm font-bold transition-all ${
                      isActive
                        ? "bg-white shadow-nb-sm translate-x-[2px] translate-y-[2px]"
                        : "bg-nb-yellow hover:bg-white hover:shadow-nb-sm"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
              <div className="mt-2 flex items-center gap-3 rounded-xl border-3 border-black bg-white px-4 py-3">
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
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 flex-shrink-0 border-r-4 border-black bg-nb-yellow lg:flex lg:flex-col">
        {/* Logo */}
        <div className="border-b-4 border-black p-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-3 border-black bg-white shadow-nb-sm">
              <Wallet className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">
              DompetKu
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-1 flex-col gap-2 p-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl border-3 border-black px-4 py-3 text-sm font-bold transition-all ${
                  isActive
                    ? "bg-white shadow-nb-sm translate-x-[2px] translate-y-[2px]"
                    : "bg-nb-yellow hover:bg-white hover:shadow-nb-sm"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="border-t-4 border-black p-4">
          <div className="flex items-center gap-3 rounded-xl border-3 border-black bg-white px-4 py-3">
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
