import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Créer une nouvelle tâche
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    dueDate: v.string(),
    assignedTo: v.string(),
    isRecurring: v.boolean(),
    recurrencePattern: v.optional(v.string()),
    estimatedHours: v.number(),
    priority: v.string(),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    const taskId = await ctx.db.insert("tasks", {
      ...args,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return taskId;
  },
});

// Récupérer toutes les tâches
export const getTasks = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// Mettre à jour une tâche
export const updateTask = mutation({
  args: {
    id: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    isRecurring: v.optional(v.boolean()),
    recurrencePattern: v.optional(v.string()),
    estimatedHours: v.optional(v.number()),
    priority: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

// Supprimer une tâche
export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
