"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/Card";
import { formatRupiah } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight, Coins } from "lucide-react";

/**
 * Kartu ringkasan keuangan: Total Saldo (seluruh dompet), Pemasukan Bulan Ini, Pengeluaran Bulan Ini.
 * Data otomatis update real-time dari Convex.
 * Menggunakan staggered animation dan dekoratif visual untuk tampilan lebih menarik.
 */
export function SummaryCards() {
  const summary = useQuery(api.wallets.getGrandTotal) as
    | {
        totalBalance: number;
        monthlyIncome: number;
        monthlyExpense: number;
        totalIncome: number;
        totalExpense: number;
      }
    | undefined;

  if (!summary) {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="nb-card nb-shimmer p-6">
            <div className="h-4 w-24 rounded bg-gray-200" />
            <div className="mt-3 h-8 w-32 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Total Saldo - Hero Card with larger treatment */}
      <Card color="yellow" interactive className="nb-fade-in nb-delay-1 relative overflow-hidden sm:col-span-3 lg:col-span-1">
        {/* Decorative corner element */}
        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full border-4 border-black/10 bg-white/20" />
        <div className="absolute -bottom-2 -right-2 h-16 w-16 rounded-full border-4 border-black/5 bg-white/10" />

        <div className="relative flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-3 border-black bg-white shadow-nb-sm">
                <Wallet className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold opacity-70">Total Seluruh Dompet</p>
            </div>
            <p className="text-3xl font-extrabold tracking-tight">
              {formatRupiah(summary.totalBalance)}
            </p>
            <div className="flex items-center gap-1 text-xs font-bold">
              <Coins className="h-3.5 w-3.5 opacity-50" />
              <span className="opacity-50">Semua dompet digabung</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Pemasukan Bulan Ini */}
      <Card color="green" interactive className="nb-fade-in nb-delay-2 relative overflow-hidden">
        {/* Decorative stripe accent */}
        <div className="absolute inset-y-0 left-0 w-2 bg-black/10" />

        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-3 border-black bg-white shadow-nb-sm">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold opacity-70">Pemasukan</p>
            </div>
            <p className="text-2xl font-extrabold">
              {formatRupiah(summary.monthlyIncome)}
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white/80">
            <ArrowUpRight className="h-4 w-4 text-green-700" />
          </div>
        </div>
        <p className="mt-1 text-xs font-bold opacity-50">Bulan ini</p>
      </Card>

      {/* Pengeluaran Bulan Ini */}
      <Card color="pink" interactive className="nb-fade-in nb-delay-3 relative overflow-hidden">
        {/* Decorative stripe accent */}
        <div className="absolute inset-y-0 left-0 w-2 bg-black/10" />

        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border-3 border-black bg-white shadow-nb-sm">
                <TrendingDown className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold opacity-70">Pengeluaran</p>
            </div>
            <p className="text-2xl font-extrabold">
              {formatRupiah(summary.monthlyExpense)}
            </p>
          </div>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white/80">
            <ArrowDownRight className="h-4 w-4 text-white" />
          </div>
        </div>
        <p className="mt-1 text-xs font-bold opacity-50">Bulan ini</p>
      </Card>
    </div>
  );
}
