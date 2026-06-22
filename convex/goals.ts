import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ==================== QUERIES ====================

/**
 * Mengambil goal untuk bulan/tahun tertentu beserta progress aktual dari transaksi.
 * Mengembalikan null jika user belum set goal untuk bulan tersebut.
 */
export const getByMonth = query({
  args: {
    month: v.number(),
    year: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const { month, year } = args;

    // Cari goal untuk bulan/tahun yang dipilih
    const goals = await ctx.db
      .query("goals")
      .withIndex("by_userId_and_month", (q) =>
        q.eq("userId", identity.subject).eq("month", month).eq("year", year)
      )
      .collect();

    const goal = goals[0];
    if (!goal) return null;

    // Hitung actual dari transaksi bulan tersebut
    const startOfMonth = new Date(year, month, 1).getTime();
    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59).getTime();

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_userId_and_date", (q) =>
        q.eq("userId", identity.subject).gte("date", startOfMonth).lte("date", endOfMonth)
      )
      .collect();

    let actualIncome = 0;
    let actualExpense = 0;
    for (const t of transactions) {
      if (t.type === "income") actualIncome += t.amount;
      else actualExpense += t.amount;
    }

    const actualSavings = actualIncome - actualExpense;

    return {
      ...goal,
      actualIncome,
      actualExpense,
      actualSavings,
    };
  },
});

/**
 * Mengambil semua goal user (untuk riwayat/daftar goal).
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const goals = await ctx.db
      .query("goals")
      .withIndex("by_userId_and_month", (q) =>
        q.eq("userId", identity.subject)
      )
      .collect();

    // Urutkan dari terbaru
    return goals.sort((a, b) => {
      if (b.year !== a.year) return b.year - a.year;
      return b.month - a.month;
    });
  },
});

// ==================== MUTATIONS ====================

/**
 * Menyimpan atau mengupdate goal bulanan.
 * Jika goal untuk bulan/tahun sudah ada, akan diupdate (upsert).
 */
export const set = mutation({
  args: {
    month: v.number(),
    year: v.number(),
    incomeTarget: v.number(),
    expenseLimit: v.number(),
    savingsTarget: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    // Cek apakah sudah ada goal untuk bulan ini
    const existing = await ctx.db
      .query("goals")
      .withIndex("by_userId_and_month", (q) =>
        q.eq("userId", identity.subject).eq("month", args.month).eq("year", args.year)
      )
      .first();

    if (existing) {
      // Update goal yang ada
      await ctx.db.patch(existing._id, {
        incomeTarget: args.incomeTarget,
        expenseLimit: args.expenseLimit,
        savingsTarget: args.savingsTarget,
        updatedAt: Date.now(),
      });
      return existing._id;
    }

    // Buat goal baru
    return await ctx.db.insert("goals", {
      userId: identity.subject,
      month: args.month,
      year: args.year,
      incomeTarget: args.incomeTarget,
      expenseLimit: args.expenseLimit,
      savingsTarget: args.savingsTarget,
      updatedAt: Date.now(),
    });
  },
});
