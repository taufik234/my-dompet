import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Tabel dompet (wallet) - user bisa punya banyak dompet
  wallets: defineTable({
    userId: v.string(), // ID user dari Clerk
    name: v.string(), // Nama dompet (contoh: "BCA", "Dompet Utama", "Tabungan")
    icon: v.string(), // Emoji atau nama ikon
    color: v.string(), // Warna untuk tampilan
    createdAt: v.number(),
  })
    .index("by_userId", ["userId"]),

  // Tabel utama untuk menyimpan semua transaksi keuangan
  transactions: defineTable({
    userId: v.string(), // ID user dari Clerk
    walletId: v.optional(v.id("wallets")), // Dompet tempat transaksi (opsional untuk backward compat)
    amount: v.number(), // Nominal transaksi
    type: v.union(v.literal("income"), v.literal("expense")), // Tipe: pemasukan atau pengeluaran
    category: v.string(), // Kategori transaksi (Makanan, Transportasi, dll)
    description: v.string(), // Keterangan transaksi
    date: v.number(), // Timestamp tanggal transaksi
    createdAt: v.number(), // Timestamp saat dibuat
  })
    .index("by_userId", ["userId"])
    .index("by_userId_and_date", ["userId", "date"])
    .index("by_userId_and_type", ["userId", "type"])
    .index("by_walletId", ["walletId"]),
});
