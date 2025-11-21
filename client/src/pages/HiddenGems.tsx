import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MapPin, Gem, Star, Filter } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Place {
  id: string;
  title: string;
  description: string;
  status: "verified" | "under_review";
  latitude: number;
  longitude: number;
}

const HiddenGems = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [filteredPlaces, setFilteredPlaces] = useState<Place[]>([]);
  const [filter, setFilter] = useState<"all" | "verified" | "under_review">("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    filterPlaces();
  }, [places, filter]);

  const fetchPlaces = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/places");
      if (response.ok) {
        const data = await response.json();
        setPlaces(data);
      }
    } catch (error) {
      console.error("Failed to fetch places", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterPlaces = () => {
    if (filter === "all") {
      setFilteredPlaces(places);
    } else {
      setFilteredPlaces(places.filter((place) => place.status === filter));
    }
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Gem className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Hidden Gems</h1>
          </div>
          <p className="text-muted-foreground">
            Discover amazing underrated places shared by travelers
          </p>
        </div>

        <Card className="p-6 mb-8 bg-gradient-to-r from-primary/5 to-info/5 border-primary/20">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 rounded-lg p-3">
              <Gem className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-foreground mb-1">Community Hidden Gems</h3>
              <p className="text-muted-foreground">
                Browse hidden gems shared by other travelers. Verified places have been confirmed with location and authenticity checks.
              </p>
            </div>
          </div>
        </Card>

        <div className="mb-6 flex items-center gap-3">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Gems</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="under_review">Under Review</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading hidden gems...</p>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">
              {filter === "all"
                ? "No hidden gems yet. Be the first to share one!"
                : `No ${filter} hidden gems yet.`}
            </p>
            <Button asChild>
              <a href="/upload-place">Submit a Hidden Gem</a>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaces.map((place) => (
              <Card key={place.id} className="p-6 hover:shadow-medium transition-shadow flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg mb-1">{place.title}</h3>
                    {place.status === "verified" && (
                      <div className="inline-flex items-center gap-1 bg-success/20 text-success px-2 py-1 rounded text-xs font-medium">
                        <Star className="h-3 w-3 fill-success" />
                        Verified
                      </div>
                    )}
                    {place.status === "under_review" && (
                      <div className="inline-flex items-center gap-1 bg-warning/20 text-warning px-2 py-1 rounded text-xs font-medium">
                        Under Review
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4 flex-1">{place.description}</p>

                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="text-xs">
                      {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HiddenGems;
