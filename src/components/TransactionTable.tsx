"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import { formatRupiah, formatDateShort } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

// Tipe data transaksi dari Convex
type Transaction = {
  _id: string;
  userId: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: number;
  createdAt: number;
};

interface TransactionTableProps {
  onEdit?: (transaction: {
    id: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    description: string;
    date: number;
  }) => void;
}

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

/**
 * Tabel riwayat transaksi dengan filter bulan dan tipe, serta aksi edit/hapus.
 */
export function TransactionTable({ onEdit }: TransactionTableProps) {
  const allTransactions = useQuery(api.transactions.list) as Transaction[] | undefined;
  const removeTransaction = useMutation(api.transactions.remove);

  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth().toString());
  const [filterYear, setFilterYear] = useState(now.getFullYear().toString());
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");

  // Filter transaksi berdasarkan bulan, tahun, dan tipe
  const transactions = allTransactions?.filter((t) => {
    const d = new Date(t.date);
    const matchMonth = d.getMonth() === parseInt(filterMonth);
    const matchYear = d.getFullYear() === parseInt(filterYear);
    const matchType = filterType === "all" || t.type === filterType;
    return matchMonth && matchYear && matchType;
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("Yakin ingin menghapus transaksi ini?")) {
      await removeTransaction({ id: id as never });
    }
  };

  // Opsi filter bulan & tahun
  const monthOptions = MONTHS.map((m, i) => ({ value: i.toString(), label: m }));
  const currentYear = now.getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    value: (currentYear - 2 + i).toString(),
    label: (currentYear - 2 + i).toString(),
  }));

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-3">
        <Select
          label="Bulan"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          options={monthOptions}
        />
        <Select
          label="Tahun"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          options={yearOptions}
        />
        <Select
          label="Tipe"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as "all" | "income" | "expense")}
          options={[
            { value: "all", label: "Semua" },
            { value: "income", label: "Pemasukan" },
            { value: "expense", label: "Pengeluaran" },
          ]}
        />
      </div>

      {/* Tabel Transaksi */}
      {!transactions ? (
        <div className="nb-card flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="nb-card flex flex-col items-center justify-center p-12 text-center">
          <p className="text-lg font-bold">Belum ada transaksi</p>
          <p className="text-sm opacity-60">
            Tambahkan transaksi pertamamu!
          </p>
        </div>
      ) : (
        <div className="nb-card overflow-hidden p-0">
          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b-3 border-black bg-nb-gray">
                  <th className="px-4 py-3 text-left text-sm font-extrabold">Tanggal</th>
                  <th className="px-4 py-3 text-left text-sm font-extrabold">Keterangan</th>
                  <th className="px-4 py-3 text-left text-sm font-extrabold">Kategori</th>
                  <th className="px-4 py-3 text-left text-sm font-extrabold">Tipe</th>
                  <th className="px-4 py-3 text-right text-sm font-extrabold">Nominal</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b-2 border-black/10 last:border-b-0 hover:bg-nb-gray/50"
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatDateShort(t.date)}
                    </td>
                    <td className="px-4 py-3 text-sm">{t.description}</td>
                    <td className="px-4 py-3">
                      <Badge>{t.category}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={t.type}>
                        {t.type === "income" ? "Masuk" : "Keluar"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold">
                      {formatRupiah(t.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() =>
                            onEdit?.({
                              id: t._id,
                              amount: t.amount,
                              type: t.type,
                              category: t.category,
                              description: t.description,
                              date: t.date,
                            })
                          }
                          className="nb-btn bg-nb-cyan p-2"
                          title="Edit"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="nb-btn bg-nb-pink p-2"
                          title="Hapus"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-white" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="flex flex-col md:hidden">
            {transactions.map((t) => (
              <div
                key={t._id}
                className="flex items-center justify-between border-b-2 border-black/10 p-4 last:border-b-0"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-bold">{t.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={t.type}>
                      {t.type === "income" ? "Masuk" : "Keluar"}
                    </Badge>
                    <Badge>{t.category}</Badge>
                  </div>
                  <p className="text-xs opacity-60">{formatDateShort(t.date)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className="font-extrabold">{formatRupiah(t.amount)}</p>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        onEdit?.({
                          id: t._id,
                          amount: t.amount,
                          type: t.type,
                          category: t.category,
                          description: t.description,
                          date: t.date,
                        })
                      }
                      className="nb-btn bg-nb-cyan p-1.5"
                    >
                      <Pencil className="h-3 w-3" />
                    </button>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="nb-btn bg-nb-pink p-1.5"
                    >
                      <Trash2 className="h-3 w-3 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
