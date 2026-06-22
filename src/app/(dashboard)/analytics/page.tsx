"use client";

import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card } from "@/components/ui/Card";
import { ExpenseChart } from "@/components/ExpenseChart";
import { formatRupiah } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import { Select } from "@/components/ui/Select";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Percent,
  BarChart3,
} from "lucide-react";

/**
 * Halaman Analitik.
 * Menampilkan pie chart pengeluaran per kategori dan bar chart perbandingan bulanan.
 * Dengan visual yang lebih dinamis dan interaktif.
 */
export default function AnalyticsPage() {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear.toString());

  const monthlyData = useQuery(api.transactions.getMonthlyComparison, {
    year: parseInt(selectedYear),
  });
  const summary = useQuery(api.transactions.getSummary);

  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - 2 + i).toString(),
    label: (currentYear - 2 + i).toString(),
  }));

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="nb-fade-in flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-3 border-black bg-nb-cyan shadow-nb-sm">
          <BarChart3 className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold">
            <span className="nb-gradient-text">Analitik Keuangan</span>
          </h1>
          <p className="opacity-60">Visualisasi pemasukan dan pengeluaranmu</p>
        </div>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card color="green" interactive className="nb-fade-in nb-delay-1 relative overflow-hidden">
            <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/15" />
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-sm font-bold opacity-70">Total Pemasukan</p>
            </div>
            <p className="mt-1 text-xl font-extrabold">
              {formatRupiah(summary.totalIncome)}
            </p>
          </Card>
          <Card color="pink" interactive className="nb-fade-in nb-delay-2 relative overflow-hidden">
            <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/15" />
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white">
                <TrendingDown className="h-4 w-4 text-red-500" />
              </div>
              <p className="text-sm font-bold opacity-70">Total Pengeluaran</p>
            </div>
            <p className="mt-1 text-xl font-extrabold">
              {formatRupiah(summary.totalExpense)}
            </p>
          </Card>
          <Card color="yellow" interactive className="nb-fade-in nb-delay-3 relative overflow-hidden">
            <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/15" />
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white">
                <Wallet className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold opacity-70">Saldo</p>
            </div>
            <p className="mt-1 text-xl font-extrabold">
              {formatRupiah(summary.totalBalance)}
            </p>
          </Card>
          <Card color="cyan" interactive className="nb-fade-in nb-delay-4 relative overflow-hidden">
            <div className="absolute -right-3 -top-3 h-12 w-12 rounded-full bg-white/15" />
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-black bg-white">
                <Percent className="h-4 w-4" />
              </div>
              <p className="text-sm font-bold opacity-70">Rasio Tabungan</p>
            </div>
            <p className="mt-1 text-xl font-extrabold">
              {summary.totalIncome > 0
                ? `${Math.round(
                    ((summary.totalIncome - summary.totalExpense) /
                      summary.totalIncome) *
                      100
                  )}%`
                : "0%"}
            </p>
          </Card>
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Pie Chart - Pengeluaran per Kategori */}
        <div className="nb-fade-in nb-delay-2">
          <ExpenseChart />
        </div>

        {/* Bar Chart - Perbandingan Bulanan */}
        <div className="nb-fade-in nb-delay-3">
          <Card color="white" className="relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-nb-yellow/10" />
            <div className="relative mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-nb-yellow">
                  <BarChart3 className="h-4 w-4" />
                </div>
                <h3 className="text-lg font-extrabold">Income vs Expense</h3>
              </div>
              <Select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                options={yearOptions}
              />
            </div>
            {!monthlyData ? (
              <div className="nb-shimmer flex h-64 items-center justify-center rounded-xl">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
              </div>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000020" />
                    <XAxis dataKey="monthName" tick={{ fontWeight: "bold" }} />
                    <YAxis
                      tick={{ fontWeight: "bold" }}
                      tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`}
                    />
                    <Tooltip
                      formatter={(value) => formatRupiah(Number(value))}
                      contentStyle={{
                        border: "3px solid #000",
                        borderRadius: "12px",
                        fontWeight: "bold",
                        boxShadow: "4px 4px 0px #000",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="income"
                      name="Pemasukan"
                      fill="#7CFF6B"
                      stroke="#000"
                      strokeWidth={2}
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="expense"
                      name="Pengeluaran"
                      fill="#FF6B9D"
                      stroke="#000"
                      strokeWidth={2}
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
