import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { Doc } from "@convex/_generated/dataModel";

type Stock = Doc<"stocks">;

export default function StocksList() {
  const stocks = useQuery(api.stocks.getAll) || [];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Liste des Stocks</h2>
      <div className="grid gap-4">
        {stocks.map((stock) => (
          <div key={stock._id} className="p-4 border rounded-lg shadow">
            <h3 className="font-bold">{stock.name}</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <div>Type: {stock.type}</div>
              <div>Status: {stock.status}</div>
              <div>Quantité: {stock.quantity}</div>
              <div>
                Position: {stock.location.latitude.toFixed(6)},
                {stock.location.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
