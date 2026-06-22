"use client";

import { useState } from "react";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionTable } from "@/components/TransactionTable";
import { WalletManager } from "@/components/WalletManager";
import { ExpenseChart } from "@/components/ExpenseChart";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus } from "lucide-react";

/**
 * Konten Dashboard utama.
 * Menampilkan ringkasan keuangan, dompet, form tambah transaksi, chart, dan riwayat.
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

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold">Dashboard</h1>
          <p className="opacity-60">Kelola keuangan pribadimu dengan mudah</p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingTransaction(null);
            setShowForm(true);
          }}
        >
          <Plus className="h-4 w-4" />
          Tambah Transaksi
        </Button>
      </div>

      {/* Summary Cards */}
      <SummaryCards />

      {/* Wallet Manager */}
      <WalletManager />

      {/* Form Modal / Inline */}
      {showForm && (
        <Card color="white" className="mx-auto w-full max-w-lg">
          <TransactionForm
            editData={editingTransaction ?? undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </Card>
      )}

      {/* Content Grid: Chart + Recent Transactions */}
      <div className="grid gap-8 lg:grid-cols-2">
        <ExpenseChart />

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-extrabold">Riwayat Transaksi</h2>
          <TransactionTable onEdit={handleEdit} />
        </div>
      </div>
    </div>
  );
}
