import type {
  Trip,
  InsertTrip,
  Attraction,
  InsertAttraction,
  Restaurant,
  InsertRestaurant,
  NearbyPlace,
  InsertNearbyPlace,
  IndoorPlace,
  InsertIndoorPlace,
} from "../shared/schema";

export interface IStorage {
  // Trip operations
  getTrips(): Promise<Trip[]>;
  getTrip(id: number): Promise<Trip | null>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: Partial<Trip>): Promise<Trip>;

  // Attraction operations
  getAttractions(tripId: number): Promise<Attraction[]>;
  createAttraction(attraction: InsertAttraction): Promise<Attraction>;
  upvoteAttraction(id: number): Promise<Attraction>;
  shuffleAttraction(tripId: number, day: number): Promise<Attraction>;

  // Restaurant operations
  getRestaurants(tripId: number): Promise<Restaurant[]>;
  createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant>;
  shuffleRestaurant(tripId: number, day: number): Promise<Restaurant>;

  // Nearby place operations
  getNearbyPlaces(tripId: number, category?: string): Promise<NearbyPlace[]>;
  upvoteNearbyPlace(id: number): Promise<NearbyPlace>;

  // Indoor alternative operations
  getIndoorAlternatives(tripId: number): Promise<IndoorPlace[]>;
}

// In-memory storage implementation
class MemStorage implements IStorage {
  private trips: Map<number, Trip> = new Map();
  private attractions: Map<number, Attraction> = new Map();
  private restaurants: Map<number, Restaurant> = new Map();
  private nearbyPlaces: Map<number, NearbyPlace> = new Map();
  private indoorPlaces: Map<number, IndoorPlace> = new Map();
  private tripIdCounter = 1;
  private attractionIdCounter = 1;
  private restaurantIdCounter = 1;
  private nearbyPlaceIdCounter = 1;
  private indoorPlaceIdCounter = 1;

  // Trip operations
  async getTrips(): Promise<Trip[]> {
    return Array.from(this.trips.values());
  }

  async getTrip(id: number): Promise<Trip | null> {
    return this.trips.get(id) || null;
  }

  async createTrip(trip: InsertTrip): Promise<Trip> {
    const newTrip: Trip = {
      ...trip,
      id: this.tripIdCounter++,
      createdAt: new Date(),
    };
    this.trips.set(newTrip.id, newTrip);
    return newTrip;
  }

  async updateTrip(id: number, updates: Partial<Trip>): Promise<Trip> {
    const trip = this.trips.get(id);
    if (!trip) throw new Error("Trip not found");
    const updated = { ...trip, ...updates };
    this.trips.set(id, updated);
    return updated;
  }

  // Attraction operations
  async getAttractions(tripId: number): Promise<Attraction[]> {
    return Array.from(this.attractions.values()).filter(
      (a) => a.tripId === tripId
    );
  }

  async createAttraction(attraction: InsertAttraction): Promise<Attraction> {
    const newAttraction: Attraction = {
      ...attraction,
      id: this.attractionIdCounter++,
      upvotes: 0,
    };
    this.attractions.set(newAttraction.id, newAttraction);
    return newAttraction;
  }

  async upvoteAttraction(id: number): Promise<Attraction> {
    const attraction = this.attractions.get(id);
    if (!attraction) throw new Error("Attraction not found");
    attraction.upvotes = (attraction.upvotes || 0) + 1;
    return attraction;
  }

  async shuffleAttraction(tripId: number, day: number): Promise<Attraction> {
    const attractions = Array.from(this.attractions.values()).filter(
      (a) => a.tripId === tripId && a.timing === this.getTimingByDay(day)
    );
    if (attractions.length === 0) throw new Error("No attractions found");
    return attractions[Math.floor(Math.random() * attractions.length)];
  }

  // Restaurant operations
  async getRestaurants(tripId: number): Promise<Restaurant[]> {
    return Array.from(this.restaurants.values()).filter(
      (r) => r.tripId === tripId
    );
  }

  async createRestaurant(restaurant: InsertRestaurant): Promise<Restaurant> {
    const newRestaurant: Restaurant = {
      ...restaurant,
      id: this.restaurantIdCounter++,
      upvotes: 0,
    };
    this.restaurants.set(newRestaurant.id, newRestaurant);
    return newRestaurant;
  }

  async shuffleRestaurant(tripId: number, day: number): Promise<Restaurant> {
    const restaurants = Array.from(this.restaurants.values()).filter(
      (r) => r.tripId === tripId && r.day === day
    );
    if (restaurants.length === 0) throw new Error("No restaurants found");
    return restaurants[Math.floor(Math.random() * restaurants.length)];
  }

  // Nearby place operations
  async getNearbyPlaces(tripId: number, category?: string): Promise<NearbyPlace[]> {
    return Array.from(this.nearbyPlaces.values()).filter((p) => {
      if (p.tripId !== tripId) return false;
      if (category && p.category !== category) return false;
      return true;
    });
  }

  async upvoteNearbyPlace(id: number): Promise<NearbyPlace> {
    const place = this.nearbyPlaces.get(id);
    if (!place) throw new Error("Nearby place not found");
    place.upvotes = (place.upvotes || 0) + 1;
    return place;
  }

  // Indoor alternative operations
  async getIndoorAlternatives(tripId: number): Promise<IndoorPlace[]> {
    return Array.from(this.indoorPlaces.values()).filter(
      (p) => p.tripId === tripId
    );
  }

  // Helper method
  private getTimingByDay(day: number): string {
    if (day % 3 === 1) return "Morning";
    if (day % 3 === 2) return "Afternoon";
    return "Evening";
  }
}

export const storage: IStorage = new MemStorage();
