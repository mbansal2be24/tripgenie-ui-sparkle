import React, { createContext, useContext, useState, ReactNode } from "react";

interface TripContextType {
  userPreferences: any;
  setUserPreferences: (prefs: any) => void;
  visited: string[];
  addVisited: (place: string) => void;
  previouslyShown: string[];
  addPreviouslyShown: (place: string) => void;
  clearHistory: () => void;
}

const TripContext = createContext(undefined);

export const TripProvider: React.FC = ({ children }) => {
  const [userPreferences, setUserPreferences] = useState(null);
  const [visited, setVisited] = useState([]);
  const [previouslyShown, setPreviouslyShown] = useState([]);

  const addVisited = (place: string) => {
    setVisited(prev => [...new Set([...prev, place])]);
  };

  const addPreviouslyShown = (place: string) => {
    setPreviouslyShown(prev => [...new Set([...prev, place])]);
  };

  const clearHistory = () => {
    setVisited([]);
    setPreviouslyShown([]);
  };

  return (
    
      {children}
    
  );
};

export const useTripContext = () => {
  const context = useContext(TripContext);
  if (!context) {
    throw new Error("useTripContext must be used within TripProvider");
  }
  return context;
};
