import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Récupérer tous les stocks
export const getAll = query({
  handler: async ({ db }) => {
    return await db.query("stocks").collect();
  }
});

// Récupérer un stock par son ID
export const getById = query({
  args: { id: v.id("stocks") },
  handler: async ({ db }, { id }) => {
    return await db.get(id);
  }
});

// Récupérer les stocks par type
export const getByType = query({
  args: { type: v.string() },
  handler: async ({ db }, { type }) => {
    return await db
      .query("stocks")
      .filter((q) => q.eq(q.field("type"), type))
      .collect();
  }
});

// Récupérer les stocks par statut
export const getByStatus = query({
  args: { status: v.string() },
  handler: async ({ db }, { status }) => {
    return await db
      .query("stocks")
      .filter((q) => q.eq(q.field("status"), status))
      .collect();
  }
});

// Ajouter un nouvel item
export const add = mutation({
  args: {
    name: v.string(),
    type: v.string(),
    status: v.string(),
    quantity: v.number(),
    location: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    description: v.optional(v.string())
  },
  handler: async (
    { db },
    { name, type, status, quantity, location, description }
  ) => {
    await db.insert("stocks", {
      name,
      type,
      status,
      quantity,
      location,
      description,
      lastUpdated: Date.now(),
    });
  }
});

// Mettre à jour un item
export const update = mutation({
  args: {
    id: v.id("stocks"),
    name: v.optional(v.string()),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    quantity: v.optional(v.number()),
    location: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number()
    })),
    description: v.optional(v.string())
  },
  handler: async (
    { db },
    { id, name, type, status, quantity, location, description }
  ) => {
    const stock = await db.get(id);
    if (!stock) throw new Error("Stock not found");

    await db.patch(id, {
      ...(name && { name }),
      ...(type && { type }),
      ...(status && { status }),
      ...(quantity && { quantity }),
      ...(location && { location }),
      ...(description && { description }),
      lastUpdated: Date.now(),
    });
  }
});

// Récupérer les stocks proches d'une position
export const getNearbyStocks = query(
  async ({ db }, 
    { location, maxDistance, type }: {
      location: { latitude: number; longitude: number; };
      maxDistance: number;
      type?: string;
    }
  ) => {
    const stocks = await db.query("stocks")
      .filter((q) => 
        type ? q.eq(q.field("type"), type) : q.neq(q.field("type"), "")
      )
      .collect();

    return stocks.filter(stock => {
      const distance = calculateDistance(
        location.latitude,
        location.longitude,
        stock.location.latitude,
        stock.location.longitude
      );
      return distance <= maxDistance;
    });
});

// Fonction utilitaire pour calculer la distance (même que dans users.ts)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Ajouter un stock unique
export const addStock = mutation({
  args: {
    stock: v.object({
      name: v.string(),
      type: v.string(),
      status: v.string(),
      quantity: v.number(),
      location: v.object({
        latitude: v.number(),
        longitude: v.number()
      }),
      description: v.optional(v.string())
    })
  },
  handler: async ({ db }, { stock }) => {
    await db.insert("stocks", {
      ...stock,
      lastUpdated: Date.now()
    });
  }
});

// Ajouter plusieurs stocks à la fois
export const addStocks = mutation({
  args: {
    stocks: v.array(v.object({
      name: v.string(),
      type: v.string(),
      status: v.string(),
      quantity: v.number(),
      location: v.object({
        latitude: v.number(),
        longitude: v.number()
      }),
      description: v.optional(v.string())
    }))
  },
  handler: async ({ db }, { stocks }) => {
    for (const stock of stocks) {
      await db.insert("stocks", {
        ...stock,
        lastUpdated: Date.now()
      });
    }
  }
});

// Nettoyer tous les stocks
export const clearAll = mutation({
  handler: async ({ db }) => {
    const stocks = await db.query("stocks").collect();
    for (const stock of stocks) {
      await db.delete(stock._id);
    }
  }
});

// Ajouter des données de test
export const addTestData = mutation({
  handler: async ({ db }) => {
    const testStocks = [
      {
        name: "Table A1",
        type: "table",
        status: "disponible",
        quantity: 1000,
        location: {
          latitude: 48.8566,
          longitude: -3.3522
        },
        description: "Table à huîtres principale"
      },
      {
        name: "Bassin B1",
        type: "bassin",
        status: "en_utilisation",
        quantity: 500,
        location: {
          latitude: 48.8566,
          longitude: -3.3523
        },
        description: "Bassin de purification"
      },
      {
        name: "Stock S1",
        type: "stock",
        status: "disponible",
        quantity: 2000,
        location: {
          latitude: 48.8567,
          longitude: -3.3522
        },
        description: "Stock principal"
      }
    ];

    for (const stock of testStocks) {
      await db.insert("stocks", {
        ...stock,
        lastUpdated: Date.now()
      });
    }
  }
});
