// import axios from 'axios';
// import React, { useEffect, useState } from 'react';

// import { createContext } from "react";

// export const ZonesContext = createContext();

// const ZonesContextProvider = ({ children }) => {

//     const [zonesList, setZonesList] = useState([]);

//     const getAllZones = async () => {
//         const { data } = await axios.get("http://localhost:3000/zones");
//         setZonesList(data);
//     }

//     useEffect(() => {
//         getAllZones()
//     }, [])

//     return (
//         <ZonesContext.Provider value={{ zonesList }}>
//             {children}
//         </ZonesContext.Provider>
//     );
// }

// export default ZonesContextProvider;

import React, { useEffect, useState, createContext } from "react";

export const ZonesContext = createContext();
const ZONES_KEY = "zonesList";

const ZonesContextProvider = ({ children }) => {
  const [zonesList, setZonesList] = useState([]);

  useEffect(() => {
    const storedZones = localStorage.getItem(ZONES_KEY);

    if (storedZones) {
      setZonesList(JSON.parse(storedZones));
    } else {
      const uniqueZones = [
        "Nasr City",
        "Smouha",
        "Maadi",
        "Ain Sokhna",
        "Sheikh Zayed",
        "Heliopolis",
        "New Cairo",
        "Hurghada",
        "6th October City",
      ];

      localStorage.setItem(ZONES_KEY, JSON.stringify(uniqueZones));
      setZonesList(uniqueZones);
    }
  }, []);

  return (
    <ZonesContext.Provider value={{ zonesList }}>
      {children}
    </ZonesContext.Provider>
  );
};

export default ZonesContextProvider;
