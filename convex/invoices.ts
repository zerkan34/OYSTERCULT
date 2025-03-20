import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Créer une facture
export const create = mutation({
  args: {
    invoiceNumber: v.string(),
    orderId: v.id("orders"),
    customer: v.object({
      name: v.string(),
      email: v.string(),
      phone: v.optional(v.string()),
      address: v.string()
    }),
    items: v.array(
      v.object({
        description: v.string(),
        quantity: v.number(),
        price: v.number()
      })
    ),
    totalAmount: v.number(),
    tax: v.number(),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    dueDate: v.number(),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("invoices", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

// Récupérer une facture par ID
export const getById = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  }
});

// Supprimer une facture
export const remove = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  }
});

// Récupérer toutes les factures
export const getAll = query({
  handler: async ({ db }) => {
    return await db.query("invoices").collect();
  }
});

// Récupérer une facture par son ID
export const getByIdOriginal = query({
  args: { id: v.id("invoices") },
  handler: async ({ db }, { id }) => {
    return await db.get(id);
  }
});

// Récupérer les factures par statut
export const getByStatus = query({
  args: { 
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    )
  },
  handler: async ({ db }, { status }) => {
    return await db
      .query("invoices")
      .filter((q) => q.eq(q.field("status"), status))
      .collect();
  }
});

// Récupérer les factures par client
export const getByCustomer = query({
  args: { customerName: v.string() },
  handler: async ({ db }, { customerName }) => {
    return await db
      .query("invoices")
      .filter((q) => q.eq(q.field("customer.name"), customerName))
      .collect();
  }
});

// Mettre à jour le statut d'une facture
export const updateStatus = mutation({
  args: {
    id: v.id("invoices"),
    status: v.union(
      v.literal("draft"),
      v.literal("sent"),
      v.literal("paid"),
      v.literal("overdue"),
      v.literal("cancelled")
    ),
    userId: v.id("users")
  },
  handler: async ({ db }, { id, status, userId }) => {
    const invoice = await db.get(id);
    if (!invoice) throw new Error("Invoice not found");

    const updates: any = { status };

    if (status === "paid") {
      updates.paidAt = Date.now();
    }

    // Ajouter à l'historique
    const history = invoice.history || [];
    history.push({
      field: "status",
      oldValue: invoice.status,
      newValue: status,
      changedBy: userId,
      changedAt: Date.now()
    });
    updates.history = history;

    await db.patch(id, updates);
  }
});

// Marquer une facture comme payée
export const markAsPaid = mutation({
  args: {
    id: v.id("invoices"),
    paymentMethod: v.string(),
    userId: v.id("users")
  },
  handler: async ({ db }, { id, paymentMethod, userId }) => {
    const invoice = await db.get(id);
    if (!invoice) throw new Error("Invoice not found");

    const history = invoice.history || [];
    history.push({
      field: "status",
      oldValue: invoice.status,
      newValue: "paid",
      changedBy: userId,
      changedAt: Date.now()
    });

    await db.patch(id, {
      status: "paid",
      paidAt: Date.now(),
      paymentMethod,
      history
    });
  }
});

// Récupérer les statistiques de facturation
export const getStats = query({
  args: {
    startDate: v.number(),
    endDate: v.number()
  },
  handler: async ({ db }, { startDate, endDate }) => {
    const invoices = await db
      .query("invoices")
      .filter((q) => 
        q.and(
          q.gte(q.field("createdAt"), startDate),
          q.lte(q.field("createdAt"), endDate)
        )
      )
      .collect();

    return {
      total: invoices.length,
      totalAmount: invoices.reduce((sum, inv) => sum + inv.totalAmount, 0),
      paid: invoices.filter(inv => inv.status === "paid").length,
      overdue: invoices.filter(inv => inv.status === "overdue").length
    };
  }
});
