"use client";

import { MonthlyGoals } from "@/components/MonthlyGoals";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { formatRupiah } from "@/lib/utils";
import { Target, TrendingUp, TrendingDown, PiggyBank, Calendar } from "lucide-react";

// Tipe goal dari list
type GoalListItem = {
  _id: string;
  month: number;
  year: number;
  incomeTarget: number;
  expenseLimit: number;
  savingsTarget: number;
};

const MONTH_NAMES = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const CARD_COLORS: Array<"yellow" | "green" | "cyan" | "pink" | "orange" | "purple"> = [
  "yellow", "green", "cyan", "pink", "orange", "purple",
];

/**
 * Halaman Goals - fitur terpisah untuk mengelola target bulanan.
 * Dengan animasi dan visual yang lebih menarik.
 */
export default function GoalsPage() {
  const allGoals = useQuery(api.goals.list) as GoalListItem[] | undefined;

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="nb-fade-in">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-3 border-black bg-nb-pink shadow-nb-sm">
            <Target className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">
              <span className="nb-gradient-text">Set Goal Bulanan</span>
            </h1>
            <p className="opacity-60">Tetapkan target keuanganmu dan pantau progresnya setiap bulan</p>
          </div>
        </div>
      </div>

      {/* Main Goal Setter */}
      <div className="nb-fade-in nb-delay-1">
        <MonthlyGoals />
      </div>

      {/* History of past goals */}
      {allGoals && allGoals.length > 0 && (
        <div className="nb-fade-in nb-delay-2 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-nb-purple" />
            <h2 className="text-xl font-extrabold">Riwayat Goal</h2>
            <span className="nb-badge bg-nb-gray text-nb-dark">{allGoals.length} goal</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {allGoals.map((g, idx) => (
              <Card
                key={g._id}
                color={CARD_COLORS[idx % CARD_COLORS.length]}
                interactive
                className={`nb-fade-in nb-delay-${Math.min(idx + 1, 5)} relative overflow-hidden`}
              >
                {/* Decorative circle */}
                <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/15" />

                <div className="relative">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-white">
                      <Target className="h-4 w-4" />
                    </div>
                    <p className="text-sm font-bold">{MONTH_NAMES[g.month]} {g.year}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 rounded-lg bg-white/60 px-2.5 py-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-green-600" />
                      <p className="text-xs">Income: <span className="font-bold">{formatRupiah(g.incomeTarget)}</span></p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/60 px-2.5 py-1.5">
                      <TrendingDown className="h-3.5 w-3.5 text-red-500" />
                      <p className="text-xs">Batas: <span className="font-bold">{formatRupiah(g.expenseLimit)}</span></p>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg bg-white/60 px-2.5 py-1.5">
                      <PiggyBank className="h-3.5 w-3.5 text-blue-500" />
                      <p className="text-xs">Tabungan: <span className="font-bold">{formatRupiah(g.savingsTarget)}</span></p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
