import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";

// Fonction de test pour vérifier toutes les fonctionnalités
export const testAll = mutation({
  handler: async (ctx) => {
    const results: any = {};
    
    try {
      // Test des notifications
      results.notifications = await testNotifications(ctx);
      
      // Test de la traçabilité
      results.traceability = await testTraceability(ctx);
      
      // Test des stocks
      results.stocks = await testStocks(ctx);
      
      // Test des commandes
      results.orders = await testOrders(ctx);
      
      // Test des factures
      results.invoices = await testInvoices(ctx);
      
      // Test du tableau de bord
      results.dashboard = await testDashboard(ctx);
      
    } catch (error: any) {
      console.error("Test failed:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return results;
  }
});

// Test des notifications
async function testNotifications(ctx: any) {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  try {
    // Créer un utilisateur de test
    const userId = await ctx.db.insert("users", {
      name: "Test User",
      email: "test@example.com",
      createdAt: Date.now()
    });

    // Test 1: Créer une notification
    const notifId = await ctx.db.insert("notifications", {
      title: "Test Notification",
      message: "This is a test notification",
      type: "info",
      userId: userId,
      important: false,
      read: false,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    const notif = await ctx.db.get(notifId);
    if (!notif) throw new Error("Notification not found");
    results.success++;

    // Test 2: Marquer comme lu
    await ctx.db.patch(notifId, { read: true, updatedAt: Date.now() });
    const readNotif = await ctx.db.get(notifId);
    if (!readNotif?.read) throw new Error("Notification not marked as read");
    results.success++;

    // Test 3: Marquer comme important
    await ctx.db.patch(notifId, { important: true, updatedAt: Date.now() });
    const importantNotif = await ctx.db.get(notifId);
    if (!importantNotif?.important) throw new Error("Notification not marked as important");
    results.success++;

    // Nettoyage
    await ctx.db.delete(notifId);
    await ctx.db.delete(userId);

  } catch (error: any) {
    results.failed++;
    results.errors.push(error.message);
  }

  return results;
}

// Test de la traçabilité
async function testTraceability(ctx: any) {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  try {
    // Créer un producteur et un client de test
    const producerId = await ctx.db.insert("users", {
      name: "Test Producer",
      email: "producer@example.com",
      createdAt: Date.now()
    });
    
    const customerId = await ctx.db.insert("users", {
      name: "Test Customer",
      email: "customer@example.com",
      createdAt: Date.now()
    });

    // Test 1: Créer un lot
    const batchId = await ctx.db.insert("traceability", {
      batchNumber: "TEST-001",
      productType: "oyster",
      quantity: 100,
      origin: {
        producer: producerId,
        location: "Test Location",
        harvestDate: new Date().toISOString()
      },
      destination: {
        customer: customerId,
        location: "Test Destination",
        expectedDeliveryDate: new Date().toISOString()
      },
      quality: {
        size: "3",
        grade: "A",
        temperature: 4
      },
      certifications: ["Test Cert"],
      status: "in_transit",
      currentLocation: "Test Location",
      checkpoints: [{
        location: "Test Location",
        timestamp: Date.now(),
        temperature: 4,
        status: "in_transit",
        notes: "Initial checkpoint"
      }],
      createdAt: Date.now(),
      updatedAt: Date.now()
    });
    
    const batch = await ctx.db.get(batchId);
    if (!batch) throw new Error("Batch not found");
    results.success++;

    // Test 2: Ajouter un checkpoint
    const checkpoint = {
      location: "Checkpoint 1",
      timestamp: Date.now(),
      temperature: 4.5,
      status: "in_transit",
      notes: "Test checkpoint"
    };
    
    await ctx.db.patch(batchId, {
      checkpoints: [...batch.checkpoints, checkpoint],
      currentLocation: checkpoint.location,
      updatedAt: Date.now()
    });
    
    const updatedBatch = await ctx.db.get(batchId);
    if (updatedBatch?.checkpoints.length !== 2) throw new Error("Checkpoint not added");
    results.success++;

    // Test 3: Marquer comme livré
    await ctx.db.patch(batchId, {
      status: "delivered",
      updatedAt: Date.now()
    });
    
    const deliveredBatch = await ctx.db.get(batchId);
    if (deliveredBatch?.status !== "delivered") throw new Error("Batch not marked as delivered");
    results.success++;

    // Nettoyage
    await ctx.db.delete(batchId);
    await ctx.db.delete(producerId);
    await ctx.db.delete(customerId);

  } catch (error: any) {
    results.failed++;
    results.errors.push(error.message);
  }

  return results;
}

// Test des stocks
async function testStocks(ctx: any) {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  try {
    const stockId = await ctx.db.insert("stocks", {
      name: "Test Stock",
      type: "test",
      status: "available",
      quantity: 100,
      location: {
        latitude: 48.8566,
        longitude: 2.3522
      },
      description: "Test stock item",
      category: "test",
      supplier: "test supplier",
      minQuantity: 10,
      price: 99.99,
      createdAt: Date.now(),
      lastUpdated: Date.now()
    });

    const stock = await ctx.db.get(stockId);
    if (!stock) throw new Error("Stock not found");
    results.success++;

    // Nettoyage
    await ctx.db.delete(stockId);
  } catch (error: any) {
    results.failed++;
    results.errors.push(error.message);
  }

  return results;
}

// Test des commandes
async function testOrders(ctx: any) {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  try {
    const orderId = await ctx.db.insert("orders", {
      orderNumber: "TEST-001",
      customer: {
        name: "Test Customer",
        email: "test@example.com",
        phone: "1234567890",
        address: "Test Address"
      },
      items: [{
        stockId: "test_stock_id",
        quantity: 1,
        price: 99.99
      }],
      totalAmount: 99.99,
      status: "pending",
      notes: "Test order",
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const order = await ctx.db.get(orderId);
    if (!order) throw new Error("Order not found");
    results.success++;

    // Nettoyage
    await ctx.db.delete(orderId);
  } catch (error: any) {
    results.failed++;
    results.errors.push(error.message);
  }

  return results;
}

// Test des factures
async function testInvoices(ctx: any) {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  try {
    const invoiceId = await ctx.db.insert("invoices", {
      invoiceNumber: "INV-001",
      orderId: "test_order_id",
      customer: {
        name: "Test Customer",
        email: "test@example.com",
        phone: "1234567890",
        address: "Test Address"
      },
      items: [{
        description: "Test Item",
        quantity: 1,
        price: 99.99
      }],
      totalAmount: 99.99,
      tax: 20.00,
      status: "draft",
      dueDate: Date.now() + 30 * 24 * 60 * 60 * 1000,
      notes: "Test invoice",
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const invoice = await ctx.db.get(invoiceId);
    if (!invoice) throw new Error("Invoice not found");
    results.success++;

    // Nettoyage
    await ctx.db.delete(invoiceId);
  } catch (error: any) {
    results.failed++;
    results.errors.push(error.message);
  }

  return results;
}

// Test du tableau de bord
async function testDashboard(ctx: any) {
  const results = { success: 0, failed: 0, errors: [] as string[] };
  
  try {
    const statsId = await ctx.db.insert("dashboard_stats", {
      statsId: "sales_daily",
      type: "sales",
      period: "daily",
      value: 99.99,
      change: 10,
      target: 100,
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const stats = await ctx.db.get(statsId);
    if (!stats) throw new Error("Dashboard stats not found");
    results.success++;

    // Nettoyage
    await ctx.db.delete(statsId);
  } catch (error: any) {
    results.failed++;
    results.errors.push(error.message);
  }

  return results;
}
