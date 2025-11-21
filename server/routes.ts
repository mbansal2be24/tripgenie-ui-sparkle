import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export function registerRoutes(app: Express): Server {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example API endpoint - customize based on your frontend needs
  app.get("/api/data", (req, res) => {
    res.json({ message: "Backend is working!", data: [] });
  });

  // Catch-all for SPA routing
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) {
      res.status(404).json({ message: "API endpoint not found" });
    } else {
      next();
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
