"use client";

import { useState } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionTable } from "@/components/TransactionTable";
import { WalletManager } from "@/components/WalletManager";
import { ExpenseChart } from "@/components/ExpenseChart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, Sparkles } from "lucide-react";

/**
 * Konten Dashboard utama.
 * Menampilkan ringkasan keuangan, dompet, form tambah transaksi, chart, dan riwayat.
 * Dengan animasi masuk dan tata letak yang lebih dinamis.
 */
export function DashboardContent() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
    walletId?: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    description: string;
    date: number;
  } | null>(null);

  const handleEdit = (transaction: typeof editingTransaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTransaction(null);
  };

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi!";
    if (hour < 17) return "Selamat Siang!";
    return "Selamat Malam!";
  })();

  return (
    <div className="flex flex-col gap-8">
      {/* Animated Header */}
      <div className="nb-fade-in flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-nb-orange nb-wiggle" />
            <span className="text-sm font-bold opacity-60">{greeting}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">
            <span className="nb-gradient-text">Dashboard</span>
          </h1>
          <p className="mt-1 opacity-60">Kelola keuangan pribadimu dengan mudah</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingTransaction(null);
            setShowForm(true);
          }}
          className="nb-pop-in self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Wallet Manager */}
      <div className="nb-fade-in nb-delay-2">
        <WalletManager />
      </div>

      {/* Form Modal / Inline */}
      {showForm && (
        <div className="nb-pop-in">
          <Card color="white" className="mx-auto w-full max-w-lg">
            <TransactionForm
              editData={editingTransaction ?? undefined}
              onSuccess={handleFormSuccess}
              onCancel={handleCancel}
            />
          </Card>
        </div>
      )}

      {/* Content Grid: Chart + Recent Transactions */}
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="nb-fade-in nb-delay-3">
          <ExpenseChart />
        </div>

        <div className="nb-fade-in nb-delay-4 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-nb-pink" />
            <h2 className="text-xl font-extrabold">Riwayat Transaksi</h2>
          </div>
          <TransactionTable onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}
