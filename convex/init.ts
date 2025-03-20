import { mutation } from "./_generated/server";

// Initialise la base de données avec quelques tâches de test
export const initializeData = mutation({
  handler: async (ctx) => {
    const tasks = [
      {
        title: "Première tâche",
        description: "Description de la première tâche",
        dueDate: new Date().toISOString(),
        priority: "high",
        status: "pending",
        createdAt: Date.now(),
      },
      {
        title: "Deuxième tâche",
        description: "Description de la deuxième tâche",
        dueDate: new Date().toISOString(),
        priority: "medium",
        status: "in_progress",
        createdAt: Date.now(),
      },
    ];

    for (const task of tasks) {
      await ctx.db.insert("tasks", task);
    }
  },
});
