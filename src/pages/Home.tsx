import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mic, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const interests = [
  "Adventure",
  "Culture",
  "Food",
  "Nature",
  "Shopping",
  "Nightlife",
  "History",
  "Beach",
];

const Home = () => {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleGenerateTrip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">AI-Powered Travel Planning</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Plan Smarter with TripGenie
          </h1>
          <p className="text-lg text-muted-foreground">
            Your personalized AI travel companion for unforgettable journeys
          </p>
        </div>

        <div className="bg-card rounded-2xl shadow-large p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="e.g., Paris, France"
              className="h-12"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="days">Number of Days</Label>
              <Input
                id="days"
                type="number"
                placeholder="7"
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget (USD)</Label>
              <Input
                id="budget"
                type="number"
                placeholder="2000"
                className="h-12"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Interests (Select multiple)</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interests.map((interest) => (
                <div
                  key={interest}
                  className="flex items-center space-x-2 bg-secondary rounded-lg p-3 cursor-pointer hover:bg-secondary/80 transition-colors"
                  onClick={() => toggleInterest(interest)}
                >
                  <Checkbox
                    id={interest}
                    checked={selectedInterests.includes(interest)}
                    onCheckedChange={() => toggleInterest(interest)}
                  />
                  <label
                    htmlFor={interest}
                    className="text-sm font-medium cursor-pointer flex-1"
                  >
                    {interest}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="travelStyle">Travel Style</Label>
            <Select>
              <SelectTrigger id="travelStyle" className="h-12">
                <SelectValue placeholder="Select your travel style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Solo</SelectItem>
                <SelectItem value="couple">Couple</SelectItem>
                <SelectItem value="family">Family</SelectItem>
                <SelectItem value="friends">Friends</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleGenerateTrip}
              className="flex-1 h-12 text-base font-semibold"
              size="lg"
            >
              Generate Trip
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="h-12 w-full sm:w-12 border-2"
            >
              <Mic className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
