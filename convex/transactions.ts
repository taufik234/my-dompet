import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ==================== QUERIES ====================

/**
 * Mengambil semua transaksi milik user yang sedang login,
 * dengan filter opsional berdasarkan walletId.
 * Diurutkan berdasarkan tanggal terbaru.
 */
export const list = query({
  args: {
    walletId: v.optional(v.id("wallets")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    let transactions;
    if (args.walletId) {
      // Filter berdasarkan dompet tertentu
      transactions = await ctx.db
        .query("transactions")
        .withIndex("by_walletId", (q) => q.eq("walletId", args.walletId!))
        .collect();
    } else {
      // Semua transaksi user
      transactions = await ctx.db
        .query("transactions")
        .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
        .collect();
    }

    // Urutkan berdasarkan tanggal terbaru
    return transactions.sort((a, b) => b.date - a.date);
  },
});

/**
 * Mengambil ringkasan keuangan: total saldo, pemasukan bulan ini, pengeluaran bulan ini.
 */
export const getSummary = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();

    let totalIncome = 0;
    let totalExpense = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    for (const t of transactions) {
      if (t.type === "income") {
        totalIncome += t.amount;
        if (t.date >= startOfMonth && t.date <= endOfMonth) {
          monthlyIncome += t.amount;
        }
      } else {
        totalExpense += t.amount;
        if (t.date >= startOfMonth && t.date <= endOfMonth) {
          monthlyExpense += t.amount;
        }
      }
    }

    return {
      totalBalance: totalIncome - totalExpense,
      monthlyIncome,
      monthlyExpense,
      totalIncome,
      totalExpense,
    };
  },
});

/**
 * Mengambil transaksi yang difilter berdasarkan bulan dan tahun.
 */
export const getByMonth = query({
  args: {
    month: v.number(), // 0-11 (Januari = 0)
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const startDate = new Date(args.year, args.month, 1).getTime();
    const endDate = new Date(args.year, args.month + 1, 0, 23, 59, 59).getTime();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_userId_and_date", (q) =>
        q.eq("userId", identity.subject).gte("date", startDate).lte("date", endDate)
      )
      .collect();

    return transactions.sort((a, b) => b.date - a.date);
  },
});

/**
 * Mengambil transaksi yang difilter berdasarkan tipe (income/expense).
 */
export const getByType = query({
  args: {
    type: v.union(v.literal("income"), v.literal("expense")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_userId_and_type", (q) =>
        q.eq("userId", identity.subject).eq("type", args.type)
      )
      .collect();

    return transactions.sort((a, b) => b.date - a.date);
  },
});

/**
 * Mengagregasi total pengeluaran per kategori (untuk pie chart).
 */
export const getExpenseByCategory = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_userId_and_type", (q) =>
        q.eq("userId", identity.subject).eq("type", "expense")
      )
      .collect();

    // Kelompokkan berdasarkan kategori dan hitung total
    const categoryMap = new Map<string, number>();
    for (const t of transactions) {
      const current = categoryMap.get(t.category) || 0;
      categoryMap.set(t.category, current + t.amount);
    }

    // Konversi ke array untuk frontend
    return Array.from(categoryMap.entries()).map(([category, total]) => ({
      category,
      total,
    }));
  },
});

/**
 * Mengambil data bulanan untuk bar chart (income vs expense per bulan).
 */
export const getMonthlyComparison = query({
  args: {
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const startDate = new Date(args.year, 0, 1).getTime();
    const endDate = new Date(args.year, 11, 31, 23, 59, 59).getTime();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_userId_and_date", (q) =>
        q.eq("userId", identity.subject).gte("date", startDate).lte("date", endDate)
      )
      .collect();

    // Buat array 12 bulan
    const monthlyData = Array.from({ length: 12 }, (_, i) => ({
      month: i,
      monthName: new Date(args.year, i, 1).toLocaleDateString("id-ID", { month: "short" }),
      income: 0,
      expense: 0,
    }));

    for (const t of transactions) {
      const month = new Date(t.date).getMonth();
      if (t.type === "income") {
        monthlyData[month].income += t.amount;
      } else {
        monthlyData[month].expense += t.amount;
      }
    }

    return monthlyData;
  },
});

// ==================== MUTATIONS ====================

/**
 * Menambah transaksi baru.
 */
export const create = mutation({
  args: {
    walletId: v.optional(v.id("wallets")),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    description: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("transactions", {
      userId: identity.subject,
      walletId: args.walletId,
      amount: args.amount,
      type: args.type,
      category: args.category,
      description: args.description,
      date: args.date,
      createdAt: Date.now(),
    });
  },
});

/**
 * Mengupdate transaksi yang sudah ada.
 */
export const update = mutation({
  args: {
    id: v.id("transactions"),
    walletId: v.optional(v.id("wallets")),
    amount: v.number(),
    type: v.union(v.literal("income"), v.literal("expense")),
    category: v.string(),
    description: v.string(),
    date: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Verifikasi bahwa transaksi ini milik user yang sedang login
    const transaction = await ctx.db.get(args.id);
    if (!transaction || transaction.userId !== identity.subject) {
      throw new Error("Unauthorized: Transaction not found or not owned");
    }

    const { id, ...data } = args;
    await ctx.db.patch(id, {
      walletId: data.walletId,
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description,
      date: data.date,
    });
  },
});

/**
 * Menghapus transaksi.
 */
export const remove = mutation({
  args: {
    id: v.id("transactions"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Verifikasi bahwa transaksi ini milik user yang sedang login
    const transaction = await ctx.db.get(args.id);
    if (!transaction || transaction.userId !== identity.subject) {
      throw new Error("Unauthorized: Transaction not found or not owned");
    }

    await ctx.db.delete(args.id);
  },
});
