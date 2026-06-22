"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/Card";
import { formatRupiah } from "@/lib/utils";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

/**
 * Kartu ringkasan keuangan: Total Saldo, Pemasukan Bulan Ini, Pengeluaran Bulan Ini.
 * Data otomatis update real-time dari Convex.
 */
export function SummaryCards() {
  const summary = useQuery(api.transactions.getSummary) as
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
          <div key={i} className="nb-card animate-pulse bg-gray-200 p-6">
            <div className="h-4 w-24 rounded bg-gray-300" />
            <div className="mt-3 h-8 w-32 rounded bg-gray-300" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Total Saldo */}
      <Card color="yellow">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-3 border-black bg-white">
            <Wallet className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold opacity-70">Total Saldo</p>
            <p className="text-2xl font-extrabold">
              {formatRupiah(summary.totalBalance)}
            </p>
          </div>
        </div>
      </Card>

      {/* Pemasukan Bulan Ini */}
      <Card color="green">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-3 border-black bg-white">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold opacity-70">Pemasukan Bulan Ini</p>
            <p className="text-2xl font-extrabold">
              {formatRupiah(summary.monthlyIncome)}
            </p>
          </div>
        </div>
      </Card>

      {/* Pengeluaran Bulan Ini */}
      <Card color="pink">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border-3 border-black bg-white">
            <TrendingDown className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-bold text-white opacity-80">
              Pengeluaran Bulan Ini
            </p>
            <p className="text-2xl font-extrabold text-white">
              {formatRupiah(summary.monthlyExpense)}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
