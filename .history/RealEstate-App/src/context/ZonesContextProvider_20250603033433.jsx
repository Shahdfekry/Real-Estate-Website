import axios from 'axios';
import React, { useEffect, useState } from 'react';

import { createContext } from "react";


export const ZonesContext = createContext();

const ZonesContextProvider = ({ children }) => {

    const [zonesList, setZonesList] = useState([]);


    const getAllZones = async () => {
        const { data } = await axios.get("http://localhost:3000/zones");
        setZonesList(data);
    }


    useEffect(() => {
        getAllZones()
    }, [])


    return (
        <ZonesContext.Provider value={{ zonesList }}>
            {children}
        </ZonesContext.Provider>
    );
}

export default ZonesContextProvider;
