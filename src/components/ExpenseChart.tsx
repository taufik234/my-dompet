"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { formatRupiah } from "@/lib/utils";

// Warna untuk setiap kategori pie chart
const COLORS = [
  "#FF6B9D", "#00D9FF", "#7CFF6B", "#FFE156",
  "#FFA63E", "#C77DFF", "#FF9F9F", "#95E1D3",
  "#F38181", "#AA96DA",
];

/**
 * Pie chart untuk melihat persentase pengeluaran berdasarkan kategori.
 * Data diambil real-time dari Convex.
 */
export function ExpenseChart() {
  const data = useQuery(api.transactions.getExpenseByCategory) as
    | { category: string; total: number }[]
    | undefined;

  if (!data) {
    return (
      <div className="nb-card flex items-center justify-center p-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="nb-card flex flex-col items-center justify-center p-12 text-center">
        <p className="text-lg font-bold">Belum ada data pengeluaran</p>
        <p className="text-sm opacity-60">
          Tambahkan transaksi pengeluaran untuk melihat grafik
        </p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    value: item.total,
  }));

  return (
    <div className="nb-card p-6">
      <h3 className="mb-4 text-lg font-extrabold">Pengeluaran per Kategori</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={90}
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
  );
}
