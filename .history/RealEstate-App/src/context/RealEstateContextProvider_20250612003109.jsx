import React, { useEffect, useState, createContext } from "react";
import { realestateData } from "../realestateData";
export const RealEstateContext = createContext();

const STORAGE_KEY = "allProperties";

const RealEstateContextProvider = ({ children }) => {
  const [allProperties, setAllProperties] = useState([]);
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAllProperties(JSON.parse(stored));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(realestateData));
      setAllProperties(realestateData);
    }
  }, []);

  const addProperty = (newProperty) => {
    const updated = [...allProperties, newProperty];
    saveToStorage(updated);
  };

  const saveToStorage = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    setAllProperties(data);
  };

  const deleteProperty = (id) => {
    const updated = allProperties.filter((p) => p.id !== id);
    saveToStorage(updated);
  };

  const updateProperty = (id, updatedData) => {
    const updated = allProperties.map((p) =>
      p.id === id ? { ...p, ...updatedData } : p
    );
    saveToStorage(updated);
  };

  return (
    <RealEstateContext.Provider
      value={{
        allProperties,
        deleteProperty,
        updateProperty,
        addProperty,
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};

export default RealEstateContextProvider;
