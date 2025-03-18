import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Table des stocks
  stocks: defineTable({
    name: v.string(),
    type: v.string(),
    status: v.string(),
    quantity: v.number(),
    location: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    lastUpdated: v.number(),
    description: v.optional(v.string()),
  }),

  // Table des utilisateurs
  users: defineTable({
    name: v.string(),
    role: v.string(),
    email: v.string(),
    phone: v.string(),
    location: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    online: v.boolean(),
    lastSeen: v.number()
  }),

  // Table des urgences
  emergencies: defineTable({
    type: v.string(),
    severity: v.string(),
    description: v.string(),
    location: v.object({
      latitude: v.number(),
      longitude: v.number()
    }),
    reportedBy: v.id("users"),
    status: v.string(),
    createdAt: v.number(),
    resolvedAt: v.union(v.number(), v.null())
  }),
});
