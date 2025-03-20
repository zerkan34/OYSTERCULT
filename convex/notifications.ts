import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

type NotificationType = "info" | "success" | "warning" | "error";

// Créer une nouvelle notification
export const create = mutation({
  args: {
    title: v.string(),
    message: v.string(),
    type: v.union(
      v.literal("info"),
      v.literal("success"),
      v.literal("warning"),
      v.literal("error")
    ),
    userId: v.id("users"),
    important: v.boolean(),
    link: v.optional(v.string()),
    category: v.optional(v.string()),
    expiresAt: v.optional(v.number())
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", {
      ...args,
      read: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
  }
});

// Récupérer les notifications d'un utilisateur
export const getForUser = query({
  args: {
    userId: v.id("users"),
    filter: v.optional(v.union(
      v.literal("all"),
      v.literal("unread"),
      v.literal("important")
    )),
    search: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    let query = ctx.db.query("notifications")
      .filter(q => q.eq(q.field("userId"), args.userId))
      .order("desc");

    if (args.filter === "unread") {
      query = query.filter(q => q.eq(q.field("read"), false));
    } else if (args.filter === "important") {
      query = query.filter(q => q.eq(q.field("important"), true));
    }

    let notifications = await query.collect();

    // Filtrer par recherche si nécessaire
    if (args.search) {
      const searchLower = args.search.toLowerCase();
      notifications = notifications.filter(notif =>
        notif.title.toLowerCase().includes(searchLower) ||
        notif.message.toLowerCase().includes(searchLower)
      );
    }

    return notifications;
  }
});

// Marquer une notification comme lue
export const markAsRead = mutation({
  args: {
    id: v.id("notifications")
  },
  handler: async (ctx, { id }) => {
    const notification = await ctx.db.get(id);
    if (!notification) throw new Error("Notification introuvable");

    await ctx.db.patch(id, {
      read: true,
      updatedAt: Date.now()
    });
  }
});

// Marquer toutes les notifications comme lues
export const markAllAsRead = mutation({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, { userId }) => {
    const notifications = await ctx.db
      .query("notifications")
      .filter(q => 
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("read"), false)
        )
      )
      .collect();

    await Promise.all(
      notifications.map(notif =>
        ctx.db.patch(notif._id, {
          read: true,
          updatedAt: Date.now()
        })
      )
    );
  }
});

// Marquer une notification comme importante
export const toggleImportant = mutation({
  args: {
    id: v.id("notifications")
  },
  handler: async (ctx, { id }) => {
    const notification = await ctx.db.get(id);
    if (!notification) throw new Error("Notification introuvable");

    await ctx.db.patch(id, {
      important: !notification.important,
      updatedAt: Date.now()
    });
  }
});

// Supprimer une notification
export const remove = mutation({
  args: {
    id: v.id("notifications")
  },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  }
});

// Supprimer toutes les notifications lues
export const removeAllRead = mutation({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, { userId }) => {
    const notifications = await ctx.db
      .query("notifications")
      .filter(q => 
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("read"), true)
        )
      )
      .collect();

    await Promise.all(
      notifications.map(notif => ctx.db.delete(notif._id))
    );
  }
});

// Obtenir le nombre de notifications non lues
export const getUnreadCount = query({
  args: {
    userId: v.id("users")
  },
  handler: async (ctx, { userId }) => {
    const notifications = await ctx.db
      .query("notifications")
      .filter(q => 
        q.and(
          q.eq(q.field("userId"), userId),
          q.eq(q.field("read"), false)
        )
      )
      .collect();

    return notifications.length;
  }
});
