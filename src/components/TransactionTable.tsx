"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Select } from "./ui/Select";
import { formatRupiah, formatDateShort } from "@/lib/utils";
import { Pencil, Trash2, Receipt, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useState } from "react";

// Tipe data transaksi dari Convex
type Transaction = {
  _id: string;
  userId: string;
  walletId?: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  description: string;
  date: number;
  createdAt: number;
};

// Tipe wallet
type WalletData = {
  _id: string;
  name: string;
  icon: string;
  color: string;
  balance: number;
};

interface TransactionTableProps {
  onEdit?: (transaction: {
    id: string;
    walletId?: string;
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
 * Tabel riwayat transaksi dengan filter bulan, tipe, dompet, serta aksi edit/hapus.
 * Dengan animasi baris dan visual indicator untuk tipe transaksi.
 */
export function TransactionTable({ onEdit }: TransactionTableProps) {
  const allTransactions = useQuery(api.transactions.list, {}) as Transaction[] | undefined;
  const removeTransaction = useMutation(api.transactions.remove);
  const wallets = useQuery(api.wallets.list) as WalletData[] | undefined;

  const now = new Date();
  const [filterMonth, setFilterMonth] = useState(now.getMonth().toString());
  const [filterYear, setFilterYear] = useState(now.getFullYear().toString());
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterWallet, setFilterWallet] = useState("all");

  // Buat map walletId -> wallet info
  const walletMap = new Map(wallets?.map((w) => [w._id, w]) ?? []);

  // Filter transaksi berdasarkan bulan, tahun, tipe, dan dompet
  const transactions = allTransactions?.filter((t) => {
    const d = new Date(t.date);
    const matchMonth = d.getMonth() === parseInt(filterMonth);
    const matchYear = d.getFullYear() === parseInt(filterYear);
    const matchType = filterType === "all" || t.type === filterType;
    const matchWallet = filterWallet === "all" || t.walletId === filterWallet;
    return matchMonth && matchYear && matchType && matchWallet;
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
      <div className="nb-card flex flex-wrap items-end gap-3 bg-white p-3">
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
        <Select
          label="Dompet"
          value={filterWallet}
          onChange={(e) => setFilterWallet(e.target.value)}
          options={[
            { value: "all", label: "Semua Dompet" },
            ...(wallets?.map((w) => ({ value: w._id, label: `${w.icon} ${w.name}` })) ?? []),
          ]}
        />
      </div>

      {/* Tabel Transaksi */}
      {!transactions ? (
        <div className="nb-card nb-shimmer flex items-center justify-center p-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
        </div>
      ) : transactions.length === 0 ? (
        <div className="nb-card flex flex-col items-center justify-center p-12 text-center">
          <div className="nb-float mb-4 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-black bg-nb-yellow">
            <Receipt className="h-10 w-10 opacity-60" />
          </div>
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
                <tr className="border-b-3 border-black bg-nb-dark text-white">
                  <th className="px-4 py-3 text-left text-sm font-extrabold">Tanggal</th>
                  <th className="px-4 py-3 text-left text-sm font-extrabold">Keterangan</th>
                  <th className="px-4 py-3 text-left text-sm font-extrabold">Kategori</th>
                  <th className="px-4 py-3 text-left text-sm font-extrabold">Dompet</th>
                  <th className="px-4 py-3 text-left text-sm font-extrabold">Tipe</th>
                  <th className="px-4 py-3 text-right text-sm font-extrabold">Nominal</th>
                  <th className="px-4 py-3 text-center text-sm font-extrabold">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, idx) => (
                  <tr
                    key={t._id}
                    className="group border-b-2 border-black/10 last:border-b-0 hover:bg-nb-gray/50 transition-colors duration-150"
                    style={{ animationDelay: `${Math.min(idx * 0.03, 0.5)}s` }}
                  >
                    <td className="px-4 py-3 text-sm font-medium">
                      {formatDateShort(t.date)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {t.type === "income" ? (
                          <ArrowUpCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <ArrowDownCircle className="h-4 w-4 text-nb-pink flex-shrink-0" />
                        )}
                        <span className="text-sm font-medium">{t.description}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge>{t.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {t.walletId && walletMap.get(t.walletId) ? (
                        <span className="inline-flex items-center gap-1">
                          <span>{walletMap.get(t.walletId)!.icon}</span>
                          <span className="font-medium">{walletMap.get(t.walletId)!.name}</span>
                        </span>
                      ) : (
                        <span className="opacity-40">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={t.type}>
                        {t.type === "income" ? "Masuk" : "Keluar"}
                      </Badge>
                    </td>
                    <td className={`px-4 py-3 text-right text-sm font-bold ${
                      t.type === "income" ? "text-green-700" : "text-nb-pink"
                    }`}>
                      {t.type === "income" ? "+" : "-"}{formatRupiah(t.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            onEdit?.({
                              id: t._id,
                              walletId: t.walletId,
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
            {transactions.map((t, idx) => (
              <div
                key={t._id}
                className={`relative flex items-center justify-between border-b-2 border-black/10 p-4 last:border-b-0 transition-all duration-150 hover:bg-nb-gray/30 ${
                  t.type === "income" ? "border-l-4 border-l-nb-green" : "border-l-4 border-l-nb-pink"
                }`}
                style={{ animationDelay: `${Math.min(idx * 0.03, 0.5)}s` }}
              >
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    {t.type === "income" ? (
                      <ArrowUpCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-nb-pink flex-shrink-0" />
                    )}
                    <p className="font-bold">{t.description}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant={t.type}>
                      {t.type === "income" ? "Masuk" : "Keluar"}
                    </Badge>
                    <Badge>{t.category}</Badge>
                    {t.walletId && walletMap.get(t.walletId) && (
                      <span className="text-xs font-medium">
                        {walletMap.get(t.walletId)!.icon} {walletMap.get(t.walletId)!.name}
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-60">{formatDateShort(t.date)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <p className={`font-extrabold ${t.type === "income" ? "text-green-700" : "text-nb-pink"}`}>
                    {t.type === "income" ? "+" : "-"}{formatRupiah(t.amount)}
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() =>
                        onEdit?.({
                          id: t._id,
                          walletId: t.walletId,
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
