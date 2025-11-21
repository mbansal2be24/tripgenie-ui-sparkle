import { createContext, useContext, useState, ReactNode } from "react";

interface Trip {
  id: number;
  destination: string;
  days: number;
  budget: number;
  travelStyle: string;
  interests: string[];
  createdAt?: string;
}

interface TripContextType {
  currentTrip: Trip | null;
  setCurrentTrip: (trip: Trip) => void;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: ReactNode }) {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(() => {
    const saved = localStorage.getItem("currentTrip");
    return saved ? JSON.parse(saved) : null;
  });

  const handleSetTrip = (trip: Trip) => {
    setCurrentTrip(trip);
    localStorage.setItem("currentTrip", JSON.stringify(trip));
  };

  return (
    <TripContext.Provider value={{ currentTrip, setCurrentTrip: handleSetTrip }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTrip must be used within TripProvider");
  }
  return context;
}
