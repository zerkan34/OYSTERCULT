import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Types pour les parcelles marines
type ParcelStatus = "active" | "inactive" | "maintenance";
type WaterQuality = "excellent" | "good" | "fair" | "poor";

// Créer une nouvelle parcelle marine
export const createParcel = mutation({
  args: {
    name: v.string(),
    coordinates: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    area: v.number(),
    depth: v.number(),
    currentSpeed: v.number(),
    waterQuality: v.union(
      v.literal("excellent"),
      v.literal("good"),
      v.literal("fair"),
      v.literal("poor")
    ),
    temperature: v.number(),
    salinity: v.number(),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("maintenance")
    ),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("marine_parcels", {
      ...args,
      lastMeasurement: Date.now(),
      history: [{
        timestamp: Date.now(),
        temperature: args.temperature,
        salinity: args.salinity,
        waterQuality: args.waterQuality
      }],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

// Récupérer toutes les parcelles
export const getParcels = query({
  args: {
    status: v.optional(v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("maintenance")
    ))
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("marine_parcels");
    
    if (args.status) {
      query = query.filter(q => q.eq(q.field("status"), args.status));
    }

    return await query.collect();
  }
});

// Récupérer une parcelle par son ID
export const getParcelById = query({
  args: { id: v.id("marine_parcels") },
  handler: async (ctx, { id }) => {
    return await ctx.db.get(id);
  }
});

// Mettre à jour les mesures d'une parcelle
export const updateParcelMeasurements = mutation({
  args: {
    id: v.id("marine_parcels"),
    temperature: v.number(),
    salinity: v.number(),
    waterQuality: v.union(
      v.literal("excellent"),
      v.literal("good"),
      v.literal("fair"),
      v.literal("poor")
    ),
    currentSpeed: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const { id, ...measurements } = args;
    const parcel = await ctx.db.get(id);
    if (!parcel) throw new Error("Parcelle introuvable");

    const newMeasurement = {
      timestamp: Date.now(),
      temperature: measurements.temperature,
      salinity: measurements.salinity,
      waterQuality: measurements.waterQuality
    };

    await ctx.db.patch(id, {
      ...measurements,
      lastMeasurement: Date.now(),
      history: [...parcel.history, newMeasurement],
      updatedAt: Date.now()
    });
  }
});

// Mettre à jour le statut d'une parcelle
export const updateParcelStatus = mutation({
  args: {
    id: v.id("marine_parcels"),
    status: v.union(
      v.literal("active"),
      v.literal("inactive"),
      v.literal("maintenance")
    ),
    notes: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const parcel = await ctx.db.get(args.id);
    if (!parcel) throw new Error("Parcelle introuvable");

    await ctx.db.patch(args.id, {
      status: args.status,
      notes: args.notes,
      updatedAt: Date.now()
    });
  }
});

// Obtenir l'historique des mesures d'une parcelle
export const getParcelHistory = query({
  args: {
    id: v.id("marine_parcels"),
    startDate: v.optional(v.number()),
    endDate: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    const parcel = await ctx.db.get(args.id);
    if (!parcel) throw new Error("Parcelle introuvable");

    let history = parcel.history;
    if (args.startDate) {
      history = history.filter(h => h.timestamp >= args.startDate!);
    }
    if (args.endDate) {
      history = history.filter(h => h.timestamp <= args.endDate!);
    }

    return history;
  }
});
