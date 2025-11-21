import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  // Add your API routes here
  // Example:
  // app.get("/api/items", async (req, res) => {
  //   const items = await storage.getItems();
  //   res.json(items);
  // });

  const httpServer = createServer(app);
  return httpServer;
}
