import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Récupérer tous les utilisateurs
export const getAll = query({
  handler: async ({ db }) => {
    return await db.query("users").collect();
  }
});

// Récupérer un utilisateur par son ID
export const getById = query({
  args: { id: v.id("users") },
  handler: async ({ db }, { id }) => {
    return await db.get(id);
  }
});

// Récupérer les utilisateurs par rôle
export const getByRole = query({
  args: { role: v.string() },
  handler: async ({ db }, { role }) => {
    return await db
      .query("users")
      .filter((q) => q.eq(q.field("role"), role))
      .collect();
  }
});

// Créer un nouvel utilisateur
export const create = mutation({
  args: {
    name: v.string(),
    role: v.string(),
    email: v.string(),
    phone: v.string(),
    location: v.object({
      latitude: v.number(),
      longitude: v.number()
    })
  },
  handler: async ({ db }, { name, role, email, phone, location }) => {
    await db.insert("users", {
      name,
      role,
      email,
      phone,
      location,
      online: false,
      lastSeen: Date.now()
    });
  }
});

// Mettre à jour la position d'un utilisateur
export const updateLocation = mutation({
  args: {
    id: v.id("users"),
    location: v.object({
      latitude: v.number(),
      longitude: v.number()
    })
  },
  handler: async ({ db }, { id, location }) => {
    const user = await db.get(id);
    if (!user) throw new Error("User not found");

    await db.patch(id, {
      location,
      lastSeen: Date.now()
    });
  }
});

// Mettre à jour le statut en ligne d'un utilisateur
export const updateOnlineStatus = mutation({
  args: {
    id: v.id("users"),
    online: v.boolean()
  },
  handler: async ({ db }, { id, online }) => {
    const user = await db.get(id);
    if (!user) throw new Error("User not found");

    await db.patch(id, {
      online,
      lastSeen: Date.now()
    });
  }
});

// Récupérer les utilisateurs proches d'une position
export const getNearbyUsers = query({
  args: {
    location: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    maxDistance: v.number(),
    role: v.optional(v.string())
  },
  handler: async ({ db }, { location, maxDistance, role }) => {
    const users = await db.query("users")
      .filter((q) => 
        role ? q.eq(q.field("role"), role) : q.neq(q.field("role"), "")
      )
      .collect();

    return users.filter((user) => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        user.location.latitude,
        user.location.longitude
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
