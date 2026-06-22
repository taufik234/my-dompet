"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatRupiah } from "@/lib/utils";
import { PieChart as PieChartIcon } from "lucide-react";

// Warna untuk setiap kategori pie chart
const COLORS = [
  "#FF6B9D", "#00D9FF", "#7CFF6B", "#FFE156",
  "#FFA63E", "#C77DFF", "#FF9F9F", "#95E1D3",
  "#F38181", "#AA96DA",
];

/**
 * Pie chart untuk melihat persentase pengeluaran berdasarkan kategori.
 * Data diambil real-time dari Convex. Dengan dekoratif visual.
 */
export function ExpenseChart() {
  const data = useQuery(api.transactions.getExpenseByCategory) as
    | { category: string; total: number }[]
    | undefined;

  if (!data) {
    return (
      <div className="nb-card nb-shimmer flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="nb-card flex flex-col items-center justify-center p-12 text-center relative overflow-hidden">
        <div className="nb-stripes absolute inset-0 pointer-events-none" />
        <div className="relative">
          <div className="nb-float mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-black bg-nb-cyan">
            <PieChartIcon className="h-10 w-10" />
          </div>
          <p className="text-lg font-bold">Belum ada data pengeluaran</p>
          <p className="text-sm opacity-60">
            Tambahkan transaksi pengeluaran untuk melihat grafik
          </p>
        </div>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  return (
    <div className="nb-card relative overflow-hidden p-6">
      {/* Decorative corner accent */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-nb-cyan/10" />
      <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-nb-pink/10" />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-nb-cyan">
            <PieChartIcon className="h-4 w-4" />
          </div>
          <h3 className="text-lg font-extrabold">Pengeluaran per Kategori</h3>
        </div>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={40}
                dataKey="value"
                stroke="#000"
                strokeWidth={2}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
              >
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
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
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
