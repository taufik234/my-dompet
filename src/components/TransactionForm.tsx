"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { CATEGORIES } from "../../convex/categories";
import { Plus, X } from "lucide-react";

interface TransactionFormProps {
  onSuccess?: () => void;
  editData?: {
    id: string;
    amount: number;
    type: "income" | "expense";
    category: string;
    description: string;
    date: number;
  };
  onCancel?: () => void;
}

/**
 * Form untuk menambah atau mengedit transaksi.
 * Menggunakan Convex mutation untuk menyimpan data secara real-time.
 */
export function TransactionForm({
  onSuccess,
  editData,
  onCancel,
}: TransactionFormProps) {
  const createTransaction = useMutation(api.transactions.create);
  const updateTransaction = useMutation(api.transactions.update);

  const [amount, setAmount] = useState(editData?.amount?.toString() ?? "");
  const [type, setType] = useState<"income" | "expense">(
    editData?.type ?? "expense"
  );
  const [category, setCategory] = useState(editData?.category ?? "Makanan");
  const [description, setDescription] = useState(editData?.description ?? "");
  const [date, setDate] = useState(
    editData?.date
      ? new Date(editData.date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categoryOptions = CATEGORIES.map((c) => ({
    value: c.name,
    label: c.name,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = {
        amount: parseFloat(amount),
        type,
        category,
        description,
        date: new Date(date).getTime(),
      };

      if (editData?.id) {
        await updateTransaction({ id: editData.id as never, ...data });
      } else {
        await createTransaction(data);
      }

      // Reset form jika bukan edit mode
      if (!editData) {
        setAmount("");
        setDescription("");
        setDate(new Date().toISOString().split("T")[0]);
      }

      onSuccess?.();
    } catch (error) {
      console.error("Gagal menyimpan transaksi:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-extrabold">
          {editData ? "Edit Transaksi" : "Tambah Transaksi"}
        </h3>
        {onCancel && (
          <button type="button" onClick={onCancel} className="nb-btn bg-white p-2">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Tipe Transaksi Toggle */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setType("income")}
          className={`nb-btn flex-1 text-sm ${
            type === "income" ? "bg-nb-green" : "bg-white"
          }`}
        >
          Pemasukan
        </button>
        <button
          type="button"
          onClick={() => setType("expense")}
          className={`nb-btn flex-1 text-sm ${
            type === "expense" ? "bg-nb-pink text-white" : "bg-white"
          }`}
        >
          Pengeluaran
        </button>
      </div>

      {/* Form Fields */}
      <Input
        label="Nominal (Rp)"
        type="number"
        placeholder="0"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        min="1"
      />

      <Select
        label="Kategori"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        options={categoryOptions}
      />

      <Input
        label="Tanggal"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <Input
        label="Keterangan"
        type="text"
        placeholder="Contoh: Makan siang di kantin"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        disabled={isSubmitting || !amount}
        className="w-full"
      >
        {isSubmitting ? (
          "Menyimpan..."
        ) : (
          <>
            <Plus className="h-4 w-4" />
            {editData ? "Simpan Perubahan" : "Tambah Transaksi"}
          </>
        )}
      </Button>
    </form>
  );
}
