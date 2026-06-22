"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { formatRupiah } from "@/lib/utils";
import { Plus, Trash2, Wallet, X, CreditCard } from "lucide-react";

// Tipe wallet dari Convex
type WalletData = {
  _id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  balance: number;
  createdAt: number;
};

const WALLET_COLORS = [
  { value: "nb-yellow", label: "Kuning" },
  { value: "nb-green", label: "Hijau" },
  { value: "nb-cyan", label: "Cyan" },
  { value: "nb-pink", label: "Pink" },
  { value: "nb-purple", label: "Ungu" },
];

const WALLET_ICONS = ["💰", "🏦", "💳", "🐖", "📱", "💵", "🪙", "💎"];

/**
 * Komponen untuk menampilkan daftar dompet dengan saldo masing-masing.
 * Mendukung tambah dan hapus dompet. Dengan efek hover interaktif.
 */
export function WalletManager() {
  const wallets = useQuery(api.wallets.list) as WalletData[] | undefined;
  const createWallet = useMutation(api.wallets.create);
  const removeWallet = useMutation(api.wallets.remove);
  const grandTotal = useQuery(api.wallets.getGrandTotal) as
    | { totalBalance: number; monthlyIncome: number; monthlyExpense: number }
    | undefined;

  const [showForm, setShowForm] = useState(false);
  const [walletName, setWalletName] = useState("");
  const [walletIcon, setWalletIcon] = useState("💰");
  const [walletColor, setWalletColor] = useState("nb-yellow");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletName.trim()) return;

    setIsCreating(true);
    try {
      await createWallet({
        name: walletName.trim(),
        icon: walletIcon,
        color: walletColor,
      });
      setWalletName("");
      setWalletIcon("💰");
      setShowForm(false);
    } catch (error) {
      console.error("Gagal membuat dompet:", error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Yakin ingin menghapus dompet "${name}" beserta semua transaksinya?`)) {
      await removeWallet({ id: id as never });
    }
  };

  if (!wallets || !grandTotal) {
    return (
      <div className="nb-card nb-shimmer p-6">
        <div className="h-6 w-40 rounded bg-gray-200" />
        <div className="mt-4 h-20 rounded bg-gray-200" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-nb-purple" />
          <h2 className="text-xl font-extrabold">Dompet Saya</h2>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowForm(!showForm)}
          className="!py-2 !px-3"
        >
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {!showForm && <span className="hidden sm:inline">Dompet Baru</span>}
        </Button>
      </div>

      {/* Grand Total Card - with decorative pattern */}
      <Card color="yellow" interactive className="relative overflow-hidden">
        <div className="nb-stripes absolute inset-0 pointer-events-none" />
        <div className="relative flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border-3 border-black bg-white shadow-nb-sm">
            <Wallet className="h-7 w-7" />
          </div>
          <div>
            <p className="text-sm font-bold opacity-70">Total Seluruh Dompet</p>
            <p className="text-3xl font-extrabold tracking-tight">
              {formatRupiah(grandTotal.totalBalance)}
            </p>
          </div>
        </div>
      </Card>

      {/* Wallet Cards */}
      {wallets.length === 0 ? (
        <div className="nb-card bg-gray-100 p-8 text-center">
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl border-3 border-black bg-white nb-float">
            <Wallet className="h-8 w-8 opacity-40" />
          </div>
          <p className="text-lg font-bold">Belum ada dompet</p>
          <p className="text-sm opacity-60">Buat dompet pertamamu untuk mulai mencatat!</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {wallets.map((wallet, idx) => (
            <Card
              key={wallet._id}
              color={wallet.color as "yellow" | "green" | "cyan" | "pink"}
              interactive
              className={`nb-fade-in nb-delay-${Math.min(idx + 1, 5)} relative overflow-hidden`}
            >
              {/* Decorative circle */}
              <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-white/15" />

              <div className="relative flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border-3 border-black bg-white shadow-nb-sm nb-float" style={{ animationDelay: `${idx * 0.3}s` }}>
                    <span className="text-2xl">{wallet.icon}</span>
                  </div>
                  <div>
                    <p className="font-bold">{wallet.name}</p>
                    <p className="text-lg font-extrabold">
                      {formatRupiah(wallet.balance)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(wallet._id, wallet.name)}
                  className="nb-btn bg-white/80 p-1.5 hover:bg-nb-pink group"
                  title="Hapus dompet"
                >
                  <Trash2 className="h-3.5 w-3.5 transition-colors group-hover:text-white" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create Wallet Form */}
      {showForm && (
        <div className="nb-pop-in">
          <Card color="white" className="mx-auto w-full max-w-md">
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-black bg-nb-cyan">
                  <Plus className="h-4 w-4" />
                </div>
                <h3 className="font-extrabold">Buat Dompet Baru</h3>
              </div>

              <Input
                label="Nama Dompet"
                type="text"
                placeholder="Contoh: BCA, Dompet Utama, Tabungan"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                required
              />

              {/* Icon Picker */}
              <div>
                <label className="mb-1.5 block text-sm font-bold">Ikon</label>
                <div className="flex flex-wrap gap-2">
                  {WALLET_ICONS.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setWalletIcon(icon)}
                      className={`flex h-11 w-11 items-center justify-center rounded-xl border-3 border-black text-lg transition-all duration-200 ${
                        walletIcon === icon
                          ? "bg-nb-yellow shadow-nb-sm translate-x-[2px] translate-y-[2px] scale-110"
                          : "bg-white hover:bg-gray-50 hover:scale-105"
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Picker */}
              <div>
                <label className="mb-1.5 block text-sm font-bold">Warna</label>
                <div className="flex flex-wrap gap-2">
                  {WALLET_COLORS.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setWalletColor(c.value)}
                      className={`h-11 w-11 rounded-xl border-3 border-black transition-all duration-200 ${c.value} ${
                        walletColor === c.value
                          ? "shadow-nb-sm translate-x-[2px] translate-y-[2px] scale-110 ring-2 ring-offset-2 ring-black"
                          : "hover:shadow-nb-sm hover:scale-105"
                      }`}
                      title={c.label}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button type="submit" variant="primary" disabled={isCreating || !walletName.trim()}>
                  {isCreating ? "Membuat..." : "Buat Dompet"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowForm(false)}
                >
                  Batal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
