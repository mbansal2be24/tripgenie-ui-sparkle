import express from "express";
import { mapsService } from "../services/mapsService";

const router = express.Router();

// Search for places
router.get("/search", async (req, res) => {
  try {
    const { query, lat, lng } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const location = lat && lng ? { lat: parseFloat(lat as string), lng: parseFloat(lng as string) } : undefined;
    const places = await mapsService.searchPlaces(query as string, location);
    
    res.json({ success: true, data: places });
  } catch (error: any) {
    console.error("Maps search error:", error);
    res.status(500).json({ error: error.message || "Failed to search places" });
  }
});

// Get place details
router.get("/place/:placeId", async (req, res) => {
  try {
    const { placeId } = req.params;
    const place = await mapsService.getPlaceDetails(placeId);
    
    if (!place) {
      return res.status(404).json({ error: "Place not found" });
    }
    
    res.json({ success: true, data: place });
  } catch (error: any) {
    console.error("Place details error:", error);
    res.status(500).json({ error: error.message || "Failed to get place details" });
  }
});

// Get directions
router.get("/directions", async (req, res) => {
  try {
    const { originLat, originLng, destLat, destLng, mode } = req.query;
    
    if (!originLat || !originLng || !destLat || !destLng) {
      return res.status(400).json({ error: "Origin and destination coordinates are required" });
    }

    const directions = await mapsService.getDirections(
      { lat: parseFloat(originLat as string), lng: parseFloat(originLng as string) },
      { lat: parseFloat(destLat as string), lng: parseFloat(destLng as string) },
      (mode as string) || 'driving'
    );
    
    res.json({ success: true, data: directions });
  } catch (error: any) {
    console.error("Directions error:", error);
    res.status(500).json({ error: error.message || "Failed to get directions" });
  }
});

// Geocode address to coordinates
router.get("/geocode", async (req, res) => {
  try {
    const { address } = req.query;
    
    if (!address) {
      return res.status(400).json({ error: "Address parameter is required" });
    }

    const location = await mapsService.geocode(address as string);
    
    if (!location) {
      return res.status(404).json({ error: "Address not found" });
    }
    
    res.json({ success: true, data: location });
  } catch (error: any) {
    console.error("Geocoding error:", error);
    res.status(500).json({ error: error.message || "Failed to geocode address" });
  }
});

// Reverse geocode coordinates to address
router.get("/reverse-geocode", async (req, res) => {
  try {
    const { lat, lng } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    const location = await mapsService.reverseGeocode(
      parseFloat(lat as string),
      parseFloat(lng as string)
    );
    
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    
    res.json({ success: true, data: location });
  } catch (error: any) {
    console.error("Reverse geocoding error:", error);
    res.status(500).json({ error: error.message || "Failed to reverse geocode" });
  }
});

// Get distance matrix
router.post("/distance-matrix", async (req, res) => {
  try {
    const { origins, destinations, mode } = req.body;
    
    if (!origins || !destinations) {
      return res.status(400).json({ error: "Origins and destinations are required" });
    }

    const matrix = await mapsService.getDistanceMatrix(
      origins,
      destinations,
      mode || 'driving'
    );
    
    res.json({ success: true, data: matrix });
  } catch (error: any) {
    console.error("Distance matrix error:", error);
    res.status(500).json({ error: error.message || "Failed to get distance matrix" });
  }
});

export default router;

