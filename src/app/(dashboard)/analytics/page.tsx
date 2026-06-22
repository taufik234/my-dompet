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

/**
 * Halaman Analitik.
 * Menampilkan pie chart pengeluaran per kategori dan bar chart perbandingan bulanan.
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
      <div>
        <h1 className="text-3xl font-extrabold">Analitik Keuangan</h1>
        <p className="opacity-60">Visualisasi pemasukan dan pengeluaranmu</p>
      </div>

      {/* Summary Stats */}
      {summary && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card color="green">
            <p className="text-sm font-bold opacity-70">Total Pemasukan</p>
            <p className="text-xl font-extrabold">
              {formatRupiah(summary.totalIncome)}
            </p>
          </Card>
          <Card color="pink">
            <p className="text-sm font-bold text-white/80">Total Pengeluaran</p>
            <p className="text-xl font-extrabold text-white">
              {formatRupiah(summary.totalExpense)}
            </p>
          </Card>
          <Card color="yellow">
            <p className="text-sm font-bold opacity-70">Saldo</p>
            <p className="text-xl font-extrabold">
              {formatRupiah(summary.totalBalance)}
            </p>
          </Card>
          <Card color="cyan">
            <p className="text-sm font-bold opacity-70">Rasio Tabungan</p>
            <p className="text-xl font-extrabold">
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
        <ExpenseChart />

        {/* Bar Chart - Perbandingan Bulanan */}
        <Card color="white">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-extrabold">Income vs Expense</h3>
            <Select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              options={yearOptions}
            />
          </div>
          {!monthlyData ? (
            <div className="flex h-64 items-center justify-center">
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
  );
}
