import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  tripSchema,
  attractionSchema,
  restaurantSchema,
  nearbyPlaceSchema,
  indoorPlaceSchema,
  loginSchema,
  signupSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../shared/schema";

export function registerRoutes(app: Express): Server {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // ============= AUTH ENDPOINTS =============
  
  // Login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const data = loginSchema.parse(req.body);
      const user = await storage.authenticateUser(data.email, data.password);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Login failed" });
    }
  });

  // Signup
  app.post("/api/auth/signup", async (req, res) => {
    try {
      const data = signupSchema.parse(req.body);
      const user = await storage.createUser(data);
      res.status(201).json({ user });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Signup failed" });
    }
  });

  // Update profile
  app.put("/api/auth/update-profile", async (req, res) => {
    try {
      const data = updateProfileSchema.parse(req.body);
      // In a real app, you'd get userId from session/token
      const userId = 1; // Placeholder
      const user = await storage.updateUser(userId, data);
      res.json(user);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Update failed" });
    }
  });

  // Change password
  app.put("/api/auth/change-password", async (req, res) => {
    try {
      const data = changePasswordSchema.parse(req.body);
      // In a real app, you'd get userId from session/token
      const userId = 1; // Placeholder
      await storage.changePassword(userId, data.currentPassword, data.newPassword);
      res.json({ message: "Password changed successfully" });
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Password change failed" });
    }
  });

  // ============= TRIP ENDPOINTS =============
  
  app.get("/api/trips", async (req, res) => {
    try {
      const trips = await storage.getTrips();
      res.json(trips);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trips" });
    }
  });

  app.get("/api/trips/:id", async (req, res) => {
    try {
      const trip = await storage.getTrip(parseInt(req.params.id));
      if (!trip) return res.status(404).json({ message: "Trip not found" });
      res.json(trip);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch trip" });
    }
  });

  app.post("/api/trips", async (req, res) => {
    try {
      const data = tripSchema.omit({ id: true, createdAt: true }).parse(req.body);
      const trip = await storage.createTrip(data);
      res.status(201).json(trip);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid trip data" });
    }
  });

  app.delete("/api/trips/:id", async (req, res) => {
    try {
      await storage.deleteTrip(parseInt(req.params.id));
      res.json({ message: "Trip deleted successfully" });
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  // ============= ATTRACTION ENDPOINTS =============
  
  app.get("/api/trips/:tripId/attractions", async (req, res) => {
    try {
      const attractions = await storage.getAttractions(parseInt(req.params.tripId));
      res.json(attractions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch attractions" });
    }
  });

  app.post("/api/trips/:tripId/attractions", async (req, res) => {
    try {
      const data = attractionSchema
        .omit({ id: true, upvotes: true })
        .parse({ ...req.body, tripId: parseInt(req.params.tripId) });
      const attraction = await storage.createAttraction(data);
      res.status(201).json(attraction);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid attraction data" });
    }
  });

  app.post("/api/attractions/:id/upvote", async (req, res) => {
    try {
      const attraction = await storage.upvoteAttraction(parseInt(req.params.id));
      res.json(attraction);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  // ============= RESTAURANT ENDPOINTS =============
  
  app.get("/api/trips/:tripId/restaurants", async (req, res) => {
    try {
      const restaurants = await storage.getRestaurants(parseInt(req.params.tripId));
      res.json(restaurants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch restaurants" });
    }
  });

  app.post("/api/trips/:tripId/restaurants", async (req, res) => {
    try {
      const data = restaurantSchema
        .omit({ id: true, upvotes: true })
        .parse({ ...req.body, tripId: parseInt(req.params.tripId) });
      const restaurant = await storage.createRestaurant(data);
      res.status(201).json(restaurant);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid restaurant data" });
    }
  });

  // ============= NEARBY PLACE ENDPOINTS =============
  
  app.get("/api/trips/:tripId/nearby", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const places = await storage.getNearbyPlaces(parseInt(req.params.tripId), category);
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nearby places" });
    }
  });

  app.post("/api/nearby/:id/upvote", async (req, res) => {
    try {
      const place = await storage.upvoteNearbyPlace(parseInt(req.params.id));
      res.json(place);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  // ============= INDOOR ALTERNATIVES ENDPOINTS =============
  
  app.get("/api/trips/:tripId/indoor-alternatives", async (req, res) => {
    try {
      const alternatives = await storage.getIndoorAlternatives(parseInt(req.params.tripId));
      res.json(alternatives);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch indoor alternatives" });
    }
  });

  // Catch-all
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
