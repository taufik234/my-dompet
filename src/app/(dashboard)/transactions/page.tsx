"use client";

import { useState } from "react";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionForm } from "@/components/TransactionForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus } from "lucide-react";

/**
 * Halaman Riwayat Transaksi.
 * Menampilkan tabel lengkap dengan filter dan aksi edit/hapus.
 */
export default function TransactionsPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<{
    id: string;
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
          <h1 className="text-3xl font-extrabold">Riwayat Transaksi</h1>
          <p className="opacity-60">
            Lihat, filter, dan kelola semua transaksimu
          </p>
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

      {/* Form Modal */}
      {showForm && (
        <Card color="white" className="mx-auto w-full max-w-lg">
          <TransactionForm
            editData={editingTransaction ?? undefined}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        </Card>
      )}

      {/* Tabel Transaksi */}
      <TransactionTable onEdit={handleEdit} />
    </div>
  );
}
