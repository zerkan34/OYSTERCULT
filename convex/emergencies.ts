import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Récupérer toutes les urgences
export const getAll = query({
  handler: async ({ db }) => {
    return await db.query("emergencies").collect();
  }
});

// Récupérer une urgence par son ID
export const getById = query({
  args: { id: v.id("emergencies") },
  handler: async ({ db }, { id }) => {
    return await db.get(id);
  }
});

// Récupérer les urgences actives
export const getActive = query({
  handler: async ({ db }) => {
    return await db
      .query("emergencies")
      .filter((q) => q.eq(q.field("status"), "actif"))
      .collect();
  }
});

// Créer une nouvelle urgence
export const create = mutation({
  args: {
    type: v.string(),
    severity: v.string(),
    description: v.string(),
    location: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    reportedBy: v.id("users")
  },
  handler: async ({ db }, { type, severity, description, location, reportedBy }) => {
    await db.insert("emergencies", {
      type,
      severity,
      description,
      location,
      reportedBy,
      status: "actif",
      createdAt: Date.now(),
      resolvedAt: null
    });
  }
});

// Mettre à jour le statut d'une urgence
export const updateStatus = mutation({
  args: {
    id: v.id("emergencies"),
    status: v.string(),
    resolvedAt: v.optional(v.number())
  },
  handler: async ({ db }, { id, status, resolvedAt }) => {
    const emergency = await db.get(id);
    if (!emergency) throw new Error("Emergency not found");

    await db.patch(id, {
      status,
      ...(resolvedAt && { resolvedAt })
    });
  }
});

// Récupérer les urgences proches d'une position
export const getNearbyEmergencies = query({
  args: {
    location: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    maxDistance: v.number(),
    status: v.optional(v.string())
  },
  handler: async ({ db }, { location, maxDistance, status }) => {
    const emergencies = await db.query("emergencies")
      .filter((q) => 
        status ? q.eq(q.field("status"), status) : q.neq(q.field("status"), "")
      )
      .collect();

    return emergencies.filter((emergency) => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        emergency.location.latitude,
        emergency.location.longitude
      );
      return distance <= maxDistance;
    });
  }
});

// Fonction utilitaire pour calculer la distance entre deux points (en km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Rayon de la Terre en km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}
