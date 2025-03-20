import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Types pour la traçabilité
type TraceabilityStatus = "in_transit" | "delivered" | "rejected";
type ProductType = "oyster" | "clam" | "mussel";

// Créer un nouveau lot
export const createBatch = mutation({
  args: {
    batchNumber: v.string(),
    productType: v.union(
      v.literal("oyster"),
      v.literal("clam"),
      v.literal("mussel")
    ),
    quantity: v.number(),
    origin: v.object({
      producer: v.id("users"),
      location: v.string(),
      harvestDate: v.string()
    }),
    destination: v.object({
      customer: v.id("users"),
      location: v.string(),
      expectedDeliveryDate: v.string()
    }),
    quality: v.object({
      size: v.string(),
      grade: v.string(),
      temperature: v.number()
    }),
    certifications: v.array(v.string()),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("traceability", {
      ...args,
      status: "in_transit",
      currentLocation: args.origin.location,
      checkpoints: [{
        location: args.origin.location,
        timestamp: Date.now(),
        temperature: args.quality.temperature,
        status: "in_transit",
        notes: "Lot créé"
      }],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

// Récupérer tous les lots
export const getBatches = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("traceability").collect();
  },
});

// Récupérer tous les lots avec filtres
export const getBatchesWithFilters = query({
  args: {
    status: v.optional(v.union(
      v.literal("in_transit"),
      v.literal("delivered"),
      v.literal("rejected")
    )),
    productType: v.optional(v.union(
      v.literal("oyster"),
      v.literal("clam"),
      v.literal("mussel")
    )),
    producer: v.optional(v.id("users")),
    customer: v.optional(v.id("users"))
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("traceability");

    if (args.status) {
      query = query.filter(q => q.eq(q.field("status"), args.status));
    }
    if (args.productType) {
      query = query.filter(q => q.eq(q.field("productType"), args.productType));
    }
    if (args.producer) {
      query = query.filter(q => q.eq(q.field("origin.producer"), args.producer));
    }
    if (args.customer) {
      query = query.filter(q => q.eq(q.field("destination.customer"), args.customer));
    }

    return await query.collect();
  }
});

// Récupérer un lot par son ID
export const getBatchById = query({
  args: { id: v.id("traceability") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  }
});

// Ajouter un point de contrôle
export const addCheckpoint = mutation({
  args: {
    batchId: v.id("traceability"),
    location: v.string(),
    temperature: v.number(),
    status: v.union(
      v.literal("in_transit"),
      v.literal("delivered"),
      v.literal("rejected")
    ),
    notes: v.string()
  },
  handler: async (ctx, args) => {
    const batch = await ctx.db.get(args.batchId);
    if (!batch) throw new Error("Lot non trouvé");

    const checkpoint = {
      location: args.location,
      timestamp: Date.now(),
      temperature: args.temperature,
      status: args.status,
      notes: args.notes
    };

    await ctx.db.patch(args.batchId, {
      checkpoints: [...(batch.checkpoints || []), checkpoint],
      currentLocation: args.location,
      status: args.status,
      updatedAt: Date.now()
    });

    return checkpoint;
  }
});

// Mettre à jour les informations d'un lot
export const updateBatch = mutation({
  args: {
    id: v.id("traceability"),
    quantity: v.optional(v.number()),
    quality: v.optional(v.object({
      size: v.string(),
      grade: v.string(),
      temperature: v.number()
    })),
    certifications: v.optional(v.array(v.string())),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const batch = await ctx.db.get(id);
    if (!batch) throw new Error("Lot introuvable");

    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now()
    });
  }
});

// Générer un rapport de traçabilité
export const generateTraceabilityReport = query({
  args: { batchId: v.id("traceability") },
  handler: async (ctx, { batchId }) => {
    const batch = await ctx.db.get(batchId);
    if (!batch) throw new Error("Lot introuvable");

    const producer = await ctx.db.get(batch.origin.producer);
    const customer = await ctx.db.get(batch.destination.customer);

    return {
      batchInfo: {
        batchNumber: batch.batchNumber,
        productType: batch.productType,
        quantity: batch.quantity,
        status: batch.status
      },
      origin: {
        producer: producer?.name,
        location: batch.origin.location,
        harvestDate: batch.origin.harvestDate
      },
      destination: {
        customer: customer?.name,
        location: batch.destination.location,
        expectedDeliveryDate: batch.destination.expectedDeliveryDate
      },
      quality: batch.quality,
      certifications: batch.certifications,
      journey: batch.checkpoints.map(cp => ({
        location: cp.location,
        timestamp: new Date(cp.timestamp).toISOString(),
        temperature: cp.temperature,
        status: cp.status,
        notes: cp.notes
      })),
      createdAt: new Date(batch.createdAt).toISOString(),
      lastUpdated: new Date(batch.updatedAt).toISOString()
    };
  }
});
