import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// Créer une commande
export const createOrder = mutation({
  args: {
    orderNumber: v.string(),
    customer: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      address: v.string()
    }),
    items: v.array(
      v.object({
        stockId: v.id("stocks"),
        quantity: v.number(),
        price: v.number()
      })
    ),
    totalAmount: v.number(),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    notes: v.optional(v.string()),
    assignedTo: v.optional(v.id("users"))
  },
  handler: async (ctx, args) => {
    // Vérifier que les stocks existent et ont assez de quantité
    for (const item of args.items) {
      const stock = await ctx.db.get(item.stockId);
      if (!stock) {
        throw new Error(`Stock ${item.stockId} not found`);
      }
      if (stock.quantity < item.quantity) {
        throw new Error(`Not enough quantity for stock ${stock.name}`);
      }
    }

    // Créer la commande
    const orderId = await ctx.db.insert("orders", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    // Mettre à jour les stocks
    for (const item of args.items) {
      const stock = await ctx.db.get(item.stockId);
      await ctx.db.patch(item.stockId, {
        quantity: stock.quantity - item.quantity,
        lastUpdated: Date.now()
      });
    }

    return orderId;
  }
});

// Récupérer toutes les commandes
export const getAllOrders = query({
  handler: async ({ db }) => {
    return await db.query("orders").collect();
  }
});

// Récupérer une commande par son ID
export const getOrderById = query({
  args: { id: v.id("orders") },
  handler: async ({ db }, { id }) => {
    const order = await db.get(id);
    if (!order) return null;

    // Récupérer les détails des stocks
    const itemsWithDetails = await Promise.all(
      order.items.map(async (item) => {
        const stock = await db.get(item.stockId);
        return {
          ...item,
          stock: stock
        };
      })
    );

    return { ...order, items: itemsWithDetails };
  }
});

// Récupérer les commandes par statut
export const getOrdersByStatus = query({
  args: { 
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    )
  },
  handler: async ({ db }, { status }) => {
    return await db
      .query("orders")
      .filter((q) => q.eq(q.field("status"), status))
      .collect();
  }
});

// Mettre à jour le statut d'une commande
export const updateOrderStatus = mutation({
  args: {
    id: v.id("orders"),
    status: v.union(
      v.literal("pending"),
      v.literal("confirmed"),
      v.literal("shipped"),
      v.literal("delivered"),
      v.literal("cancelled")
    ),
    userId: v.id("users")
  },
  handler: async ({ db }, { id, status, userId }) => {
    const order = await db.get(id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Si la commande est annulée, remettre les quantités en stock
    if (status === "cancelled" && order.status !== "cancelled") {
      for (const item of order.items) {
        const stock = await db.get(item.stockId);
        await db.patch(item.stockId, {
          quantity: stock.quantity + item.quantity,
          lastUpdated: Date.now()
        });
      }
    }

    await db.patch(id, {
      status,
      updatedAt: Date.now(),
      history: [
        ...(order.history || []),
        {
          action: "status_update",
          from: order.status,
          to: status,
          by: userId,
          at: Date.now()
        }
      ]
    });

    return id;
  }
});

// Supprimer une commande
export const removeOrder = mutation({
  args: { id: v.id("orders") },
  handler: async ({ db }, { id }) => {
    const order = await db.get(id);
    if (!order) {
      throw new Error("Order not found");
    }

    // Si la commande n'est pas annulée, remettre les quantités en stock
    if (order.status !== "cancelled") {
      for (const item of order.items) {
        const stock = await db.get(item.stockId);
        await db.patch(item.stockId, {
          quantity: stock.quantity + item.quantity,
          lastUpdated: Date.now()
        });
      }
    }

    await db.delete(id);
  }
});
