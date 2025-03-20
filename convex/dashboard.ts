import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Récupérer les statistiques du tableau de bord
export const getStats = query({
  args: {
    type: v.union(
      v.literal("sales"),
      v.literal("inventory"),
      v.literal("orders")
    ),
    period: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly")
    )
  },
  handler: async (ctx, args) => {
    const stats = await ctx.db
      .query("dashboard_stats")
      .filter((q) => q.eq(q.field("type"), args.type))
      .filter((q) => q.eq(q.field("period"), args.period))
      .first();
    return stats;
  }
});

// Récupérer toutes les statistiques
export const getAllStats = query({
  handler: async ({ db }) => {
    return await db.query("dashboardStats").collect();
  }
});

// Mettre à jour les statistiques
export const updateStats = mutation({
  args: {
    type: v.union(
      v.literal("sales"),
      v.literal("inventory"),
      v.literal("orders")
    ),
    period: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly")
    ),
    value: v.number(),
    change: v.number(),
    target: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const statsId = `${args.type}_${args.period}`;
    const existingStats = await ctx.db
      .query("dashboard_stats")
      .filter((q) => q.eq(q.field("statsId"), statsId))
      .first();

    if (existingStats) {
      return await ctx.db.patch(existingStats._id, {
        value: args.value,
        change: args.change,
        target: args.target,
        updatedAt: Date.now()
      });
    } else {
      return await ctx.db.insert("dashboard_stats", {
        statsId,
        type: args.type,
        period: args.period,
        value: args.value,
        change: args.change,
        target: args.target,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
  }
});

// Récupérer les statistiques par type et période
export const getStatsById = query({
  args: {
    type: v.union(
      v.literal("sales"),
      v.literal("inventory"),
      v.literal("orders")
    ),
    period: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly")
    )
  },
  handler: async (ctx, args) => {
    const { type, period } = args;
    const statsId = `${type}_${period}`;
    
    return await ctx.db
      .query("dashboard_stats")
      .filter(q => q.eq(q.field("statsId"), statsId))
      .first();
  }
});

// Mettre à jour les statistiques de ventes
export const updateSalesStats = mutation({
  args: {
    period: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly")
    )
  },
  handler: async (ctx, { period }) => {
    const invoices = await ctx.db
      .query("invoices")
      .filter((q) => q.eq(q.field("status"), "paid"))
      .collect();

    if (!invoices.length) return;

    const currentTotal = invoices.reduce((sum, invoice) => sum + invoice.totalAmount, 0);
    const previousTotal = await ctx.db
      .query("dashboard_stats")
      .filter((q) => q.eq(q.field("statsId"), `sales_${period}`))
      .first();
    const change = previousTotal ? ((currentTotal - previousTotal.value) / previousTotal.value) * 100 : 100;

    await ctx.db.insert("dashboard_stats", {
      statsId: `sales_${period}`,
      type: "sales",
      period,
      value: currentTotal,
      change,
      target: currentTotal * 1.1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

// Mettre à jour les statistiques d'inventaire
export const updateInventoryStats = mutation({
  handler: async (ctx) => {
    const stocks = await ctx.db.query("stocks").collect();
    if (!stocks.length) return;

    const totalItems = stocks.reduce((sum, stock) => sum + stock.quantity, 0);
    const lowStock = stocks.filter(stock => stock.status === "low").length;
    const outOfStock = stocks.filter(stock => stock.status === "out_of_stock").length;

    await ctx.db.insert("dashboard_stats", {
      statsId: "inventory_daily",
      type: "inventory",
      period: "daily",
      value: totalItems,
      change: ((lowStock + outOfStock) / stocks.length) * 100,
      target: null,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

// Mettre à jour les statistiques de commandes
export const updateOrderStats = mutation({
  args: {
    period: v.union(
      v.literal("daily"),
      v.literal("weekly"),
      v.literal("monthly"),
      v.literal("yearly")
    )
  },
  handler: async (ctx, { period }) => {
    const orders = await ctx.db
      .query("orders")
      .filter((q) => q.neq(q.field("status"), "cancelled"))
      .collect();

    if (!orders.length) return;

    const previousCount = await ctx.db
      .query("dashboard_stats")
      .filter((q) => q.eq(q.field("statsId"), `orders_${period}`))
      .first();
    const change = previousCount ? ((orders.length - previousCount.value) / previousCount.value) * 100 : 100;

    await ctx.db.insert("dashboard_stats", {
      statsId: `orders_${period}`,
      type: "orders",
      period,
      value: orders.length,
      change,
      target: Math.ceil(orders.length * 1.1),
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});
