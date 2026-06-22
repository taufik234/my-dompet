"use client";

import { useState } from "react";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionForm } from "@/components/TransactionForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Plus, ArrowLeftRight } from "lucide-react";

/**
 * Halaman Riwayat Transaksi.
 * Menampilkan tabel lengkap dengan filter dan aksi edit/hapus.
 * Dengan animasi dan visual yang lebih menarik.
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
      <div className="nb-fade-in flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border-3 border-black bg-nb-green shadow-nb-sm">
            <ArrowLeftRight className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold">
              <span className="nb-gradient-text">Riwayat Transaksi</span>
            </h1>
            <p className="opacity-60">
              Lihat, filter, dan kelola semua transaksimu
            </p>
          </div>
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

      {/* Form Modal */}
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

      {/* Tabel Transaksi */}
      <div className="nb-fade-in nb-delay-1">
        <TransactionTable onEdit={handleEdit} />
      </div>
    </div>
  );
}
