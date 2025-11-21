import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { tripSchema, attractionSchema, restaurantSchema, nearbyPlaceSchema, indoorPlaceSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Trip endpoints
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

  // Attraction endpoints
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

  app.post("/api/trips/:tripId/attractions/shuffle/:day", async (req, res) => {
    try {
      const attraction = await storage.shuffleAttraction(
        parseInt(req.params.tripId),
        parseInt(req.params.day)
      );
      res.json(attraction);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  // Restaurant endpoints
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

  app.post("/api/trips/:tripId/restaurants/shuffle/:day", async (req, res) => {
    try {
      const restaurant = await storage.shuffleRestaurant(
        parseInt(req.params.tripId),
        parseInt(req.params.day)
      );
      res.json(restaurant);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  });

  // Nearby place endpoints
  app.get("/api/trips/:tripId/nearby", async (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const places = await storage.getNearbyPlaces(parseInt(req.params.tripId), category);
      res.json(places);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch nearby places" });
    }
  });

  app.post("/api/trips/:tripId/nearby", async (req, res) => {
    try {
      const data = nearbyPlaceSchema
        .omit({ id: true, upvotes: true })
        .parse({ ...req.body, tripId: parseInt(req.params.tripId) });
      // Note: In a real app, this would generate places from an API
      res.status(201).json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid nearby place data" });
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

  // Indoor alternatives endpoints
  app.get("/api/trips/:tripId/indoor-alternatives", async (req, res) => {
    try {
      const alternatives = await storage.getIndoorAlternatives(parseInt(req.params.tripId));
      res.json(alternatives);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch indoor alternatives" });
    }
  });

  app.post("/api/trips/:tripId/indoor-alternatives", async (req, res) => {
    try {
      const data = indoorPlaceSchema
        .omit({ id: true })
        .parse({ ...req.body, tripId: parseInt(req.params.tripId) });
      res.status(201).json(data);
    } catch (error: any) {
      res.status(400).json({ message: error.message || "Invalid indoor alternative data" });
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
