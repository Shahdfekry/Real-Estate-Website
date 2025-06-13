// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import { createContext } from "react";

// export const RealEstateContext = createContext();

// const RealEstateContextProvider = ({ children }) => {

//     const [allProperties, setAllProperties] = useState([])

//     const getAllProperties = async () => {
//         const { data } = await axios.get("http://localhost:3000/all");
//         setAllProperties(data);
//     }

//     const deleteProperty = async (id) => {
//         try {
//             await axios.delete(`http://localhost:3000/all/${id}`);
//             setAllProperties(prevProperties => prevProperties.filter(property => property.id !== id));
//         } catch (error) {
//             console.error('Error deleting property:', error);
//         }
//     }

//     const updateProperty = async (id, updatedData) => {
//         try {
//             const { data } = await axios.put(`http://localhost:3000/all/${id}`, updatedData);
//             setAllProperties(prevProperties =>
//                 prevProperties.map(property =>
//                     property.id === id ? { ...property, ...data } : property
//                 )
//             );
//         } catch (error) {
//             console.error('Error updating property:', error);
//         }
//     }

//     useEffect(() => {
//         getAllProperties()
//     }, [])

//     return (
//         <>
//             <RealEstateContext.Provider value={{getAllProperties ,allProperties ,deleteProperty,updateProperty}}>
//                 {children}
//             </RealEstateContext.Provider>
//         </>
//     );
// }

// export default RealEstateContextProvider;

import React, { useEffect, useState, createContext } from "react";
import { realestateData } from "./realestateData";
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
      }}
    >
      {children}
    </RealEstateContext.Provider>
  );
};

export default RealEstateContextProvider;
