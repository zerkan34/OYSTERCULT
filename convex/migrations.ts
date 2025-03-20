import { mutation } from "./_generated/server";

// Migration pour mettre à jour les stocks existants
export const migrateStocks = mutation({
  args: {},
  handler: async (ctx) => {
    const stocks = await ctx.db.query("stocks").collect();
    const now = Date.now();
    
    for (const stock of stocks) {
      // Convertir les nombres en float64
      await ctx.db.patch(stock._id, {
        quantity: stock.quantity ? parseFloat(stock.quantity.toString()) : 0,
        minQuantity: stock.minQuantity ? parseFloat(stock.minQuantity.toString()) : undefined,
        price: stock.price ? parseFloat(stock.price.toString()) : undefined,
        createdAt: stock.createdAt ? parseFloat(stock.createdAt.toString()) : now,
        lastUpdated: stock.lastUpdated ? parseFloat(stock.lastUpdated.toString()) : now,
        location: {
          latitude: parseFloat(stock.location.latitude.toString()),
          longitude: parseFloat(stock.location.longitude.toString())
        }
      });
    }
  }
});
