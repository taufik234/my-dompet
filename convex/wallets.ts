import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ==================== QUERIES ====================

/**
 * Mengambil semua dompet milik user beserta saldo masing-masing.
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const wallets = await ctx.db
      .query("wallets")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    // Hitung saldo setiap dompet dari transaksi
    const walletsWithBalance = await Promise.all(
      wallets.map(async (wallet) => {
        const transactions = await ctx.db
          .query("transactions")
          .withIndex("by_walletId", (q) => q.eq("walletId", wallet._id))
          .collect();

        let balance = 0;
        for (const t of transactions) {
          if (t.type === "income") {
            balance += t.amount;
          } else {
            balance -= t.amount;
          }
        }

        return { ...wallet, balance };
      })
    );

    return walletsWithBalance;
  },
});

/**
 * Mengambil ringkasan total SELURUH dompet (grand total).
 * Berguna untuk kartu ringkasan utama di dashboard.
 */
export const getGrandTotal = query({
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
 * Mengambil ringkasan untuk dompet tertentu saja.
 */
export const getWalletSummary = query({
  args: {
    walletId: v.id("wallets"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const wallet = await ctx.db.get(args.walletId);
    if (!wallet || wallet.userId !== identity.subject) {
      throw new Error("Wallet not found or not owned");
    }

    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_walletId", (q) => q.eq("walletId", args.walletId))
      .collect();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59).getTime();

    let balance = 0;
    let monthlyIncome = 0;
    let monthlyExpense = 0;

    for (const t of transactions) {
      if (t.type === "income") {
        balance += t.amount;
        if (t.date >= startOfMonth && t.date <= endOfMonth) {
          monthlyIncome += t.amount;
        }
      } else {
        balance -= t.amount;
        if (t.date >= startOfMonth && t.date <= endOfMonth) {
          monthlyExpense += t.amount;
        }
      }
    }

    return { balance, monthlyIncome, monthlyExpense };
  },
});

// ==================== MUTATIONS ====================

/**
 * Membuat dompet baru.
 */
export const create = mutation({
  args: {
    name: v.string(),
    icon: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    return await ctx.db.insert("wallets", {
      userId: identity.subject,
      name: args.name,
      icon: args.icon,
      color: args.color,
      createdAt: Date.now(),
    });
  },
});

/**
 * Mengupdate dompet (nama, ikon, warna).
 */
export const update = mutation({
  args: {
    id: v.id("wallets"),
    name: v.string(),
    icon: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const wallet = await ctx.db.get(args.id);
    if (!wallet || wallet.userId !== identity.subject) {
      throw new Error("Wallet not found or not owned");
    }

    await ctx.db.patch(args.id, {
      name: args.name,
      icon: args.icon,
      color: args.color,
    });
  },
});

/**
 * Menghapus dompet beserta semua transaksinya.
 */
export const remove = mutation({
  args: {
    id: v.id("wallets"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const wallet = await ctx.db.get(args.id);
    if (!wallet || wallet.userId !== identity.subject) {
      throw new Error("Wallet not found or not owned");
    }

    // Hapus semua transaksi di dompet ini
    const transactions = await ctx.db
      .query("transactions")
      .withIndex("by_walletId", (q) => q.eq("walletId", args.id))
      .collect();

    for (const t of transactions) {
      await ctx.db.delete(t._id);
    }

    // Hapus dompet
    await ctx.db.delete(args.id);
  },
});
