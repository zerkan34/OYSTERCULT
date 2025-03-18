import { ConvexHttpClient } from "convex/browser";

// Configuration
const CONVEX_URL = "https://focused-dalmatian-343.convex.cloud";
const DEPLOY_KEY = process.env.CONVEX_DEPLOY_KEY;

// Schéma de validation
const stockSchema = {
  required: ["name", "type", "status", "quantity", "location"],
  properties: {
    name: { type: "string", minLength: 1 },
    type: { type: "string", enum: ["table", "parc", "autre"] },
    status: { type: "string", enum: ["disponible", "indisponible", "maintenance"] },
    quantity: { type: "number", minimum: 0 },
    location: {
      type: "object",
      required: ["latitude", "longitude"],
      properties: {
        latitude: { type: "number", minimum: -90, maximum: 90 },
        longitude: { type: "number", minimum: -180, maximum: 180 }
      }
    },
    description: { type: "string" }
  }
};

// Fonction de validation des données
function validateStockData(data) {
  console.log("\n🔍 Validation des données...");
  
  if (!data || !data.stock) {
    throw new Error("Les données du stock sont manquantes");
  }

  const stock = data.stock;
  
  // Vérification des champs requis
  for (const field of stockSchema.required) {
    if (!(field in stock)) {
      throw new Error(`Le champ '${field}' est requis`);
    }
  }

  // Validation du type
  if (!stockSchema.properties.type.enum.includes(stock.type)) {
    throw new Error(`Le type '${stock.type}' n'est pas valide. Types autorisés : ${stockSchema.properties.type.enum.join(", ")}`);
  }

  // Validation du statut
  if (!stockSchema.properties.status.enum.includes(stock.status)) {
    throw new Error(`Le statut '${stock.status}' n'est pas valide. Statuts autorisés : ${stockSchema.properties.status.enum.join(", ")}`);
  }

  // Validation de la quantité
  if (typeof stock.quantity !== "number" || stock.quantity < 0) {
    throw new Error("La quantité doit être un nombre positif");
  }

  // Validation de la localisation
  if (!stock.location || typeof stock.location.latitude !== "number" || typeof stock.location.longitude !== "number") {
    throw new Error("Les coordonnées de localisation doivent être des nombres");
  }

  if (stock.location.latitude < -90 || stock.location.latitude > 90) {
    throw new Error("La latitude doit être comprise entre -90 et 90");
  }

  if (stock.location.longitude < -180 || stock.location.longitude > 180) {
    throw new Error("La longitude doit être comprise entre -180 et 180");
  }

  console.log("✅ Les données sont valides");
  return true;
}

// Fonction principale d'ajout de stock
async function addStock(stockData) {
  try {
    console.log("\n🚀 Démarrage du processus d'ajout de stock...");
    console.log("📦 Données reçues :", JSON.stringify(stockData, null, 2));

    // Validation des données
    validateStockData(stockData);

    console.log("\n🔌 Initialisation du client Convex...");
    const client = new ConvexHttpClient(CONVEX_URL);
    
    console.log("📤 Envoi des données au serveur...");
    const result = await client.mutation("stocks:addStock", stockData);
    
    console.log("\n✨ Stock ajouté avec succès !");
    if (result) {
      console.log("📋 Détails du résultat :", result);
    }

    return result;
  } catch (error) {
    console.error("\n❌ Erreur lors de l'ajout du stock :");
    console.error("   ", error.message);
    process.exit(1);
  }
}

// Vérification de la clé de déploiement
if (!DEPLOY_KEY) {
  console.error("\n❌ Erreur : La variable d'environnement CONVEX_DEPLOY_KEY n'est pas définie");
  process.exit(1);
}

// Traitement des arguments de la ligne de commande
const args = process.argv.slice(2);
if (args.length > 0) {
  try {
    const stockData = JSON.parse(args[0]);
    addStock(stockData);
  } catch (error) {
    console.error("\n❌ Erreur lors du parsing des arguments JSON :");
    console.error("   ", error.message);
    console.log("\n📝 Format attendu :");
    console.log('   node add-stock.mjs \'{"stock": {"name": "Table B2", "type": "table", "status": "disponible", "quantity": 800, "location": {"latitude": 48.8568, "longitude": -3.3524}, "description": "Description optionnelle"}}\'');
    process.exit(1);
  }
} else {
  // Données par défaut si aucun argument n'est fourni
  const defaultStockData = {
    stock: {
      name: "Table B2",
      type: "table",
      status: "disponible",
      quantity: 800,
      location: {
        latitude: 48.8568,
        longitude: -3.3524
      },
      description: "Nouvelle table test"
    }
  };
  addStock(defaultStockData);
}
