import { ConvexClient } from "convex/browser";

const client = new ConvexClient(process.env.CONVEX_DEPLOY_KEY);

const stockData = {
  name: "Table B2",
  type: "table",
  status: "disponible",
  quantity: 800,
  location: {
    latitude: 48.8568,
    longitude: -3.3524
  },
  description: "Nouvelle table test"
};

async function addStock() {
  try {
    await client.mutation("stocks:add", stockData);
    console.log("Stock ajouté avec succès");
  } catch (error) {
    console.error("Erreur lors de l'ajout du stock:", error);
  }
  process.exit(0);
}

addStock();
