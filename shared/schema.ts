import { z } from "zod";

// Trip schema
export const tripSchema = z.object({
  id: z.number().optional(),
  destination: z.string(),
  days: z.number().min(1),
  budget: z.number().min(0),
  travelStyle: z.enum(["solo", "couple", "family", "friends"]),
  interests: z.array(z.string()),
  createdAt: z.date().optional(),
});

export type Trip = z.infer<typeof tripSchema>;
export type InsertTrip = Omit<Trip, "id" | "createdAt">;

// Attraction schema
export const attractionSchema = z.object({
  id: z.number().optional(),
  tripId: z.number(),
  name: z.string(),
  description: z.string(),
  timing: z.enum(["Morning", "Afternoon", "Evening"]),
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
  category: z.string(),
  upvotes: z.number().default(0),
});

export type Attraction = z.infer<typeof attractionSchema>;
export type InsertAttraction = Omit<Attraction, "id" | "upvotes">;

// Restaurant schema
export const restaurantSchema = z.object({
  id: z.number().optional(),
  tripId: z.number(),
  name: z.string(),
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
  price: z.number().min(0),
  cuisine: z.string(),
  day: z.number(),
  mealType: z.enum(["Breakfast", "Lunch", "Dinner"]),
  upvotes: z.number().default(0),
});

export type Restaurant = z.infer<typeof restaurantSchema>;
export type InsertRestaurant = Omit<Restaurant, "id" | "upvotes">;

// Nearby place schema
export const nearbyPlaceSchema = z.object({
  id: z.number().optional(),
  tripId: z.number(),
  name: z.string(),
  category: z.enum(["attractions", "food", "cafes", "nightlife"]),
  rating: z.number().min(0).max(5),
  reviews: z.number().min(0),
  priceLevel: z.string(),
  distance: z.string(),
  upvotes: z.number().default(0),
});

export type NearbyPlace = z.infer<typeof nearbyPlaceSchema>;
export type InsertNearbyPlace = Omit<NearbyPlace, "id" | "upvotes">;

// Indoor alternative schema
export const indoorPlaceSchema = z.object({
  id: z.number().optional(),
  tripId: z.number(),
  name: z.string(),
  description: z.string(),
  rating: z.number().min(0).max(5),
});

export type IndoorPlace = z.infer<typeof indoorPlaceSchema>;
export type InsertIndoorPlace = Omit<IndoorPlace, "id">;
