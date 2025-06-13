// import axios from 'axios';
// import React, { createContext, useEffect, useState, useContext } from 'react';
// import { toast } from 'react-toastify';
// import { AuthContext } from './AuthContext';

// export const FavouritesContext = createContext();

// const FavouritesContextProvider = ({ children }) => {

//   const [favouriteList, setFavouriteList] = useState([]);
//   const { currentUser } = useContext(AuthContext); // Get current user info

//   const fetchFavouriteList = async () => {
//     try {
//       const { data } = await axios.get("http://localhost:3000/favourites");
//       setFavouriteList(data || []);
//     } catch (err) {
//       console.error("Error loading Favourite List from server", err);
//     }
//   };

//   const addToFavouriteList = async (newProperty) => {
//     // Only allow users or admins
//     if (!currentUser || !["user", "admin"].includes(currentUser.role)) {
//       toast.warn("Login to add property to favourites!");
//       setTimeout(() => {
//         window.location.href = '/login'; // ✅ Simple redirect
//       }, 1500);
//       return;
//     }

//     if (favouriteList.some((favProperty) => favProperty.id === newProperty.id)) {
//       toast.info("This Property is already in your Favourite!");
//       return;
//     }

//     try {
//       const updated = [...favouriteList, newProperty];
//       setFavouriteList(updated);

//       await axios.post("http://localhost:3000/favourites", newProperty);
//       toast.success("Added to Favourites!");
//     } catch (error) {
//       toast.error("Failed to add property to server");
//       console.error("Error posting to json-server:", error);
//     }
//   };

//   const removeFromFavouriteList = async (newProperty) => {
//     // Optional: Also restrict removal to logged in users/admins
//     if (!currentUser || !["user", "admin"].includes(currentUser.role)) {
//       toast.warn("You must be logged in as a user or admin to remove favourites.");
//       return;
//     }

//     try {
//       const updated = favouriteList.filter((favProperty) => favProperty.id !== newProperty.id);
//       setFavouriteList(updated);

//       await axios.delete(`http://localhost:3000/favourites/${newProperty.id}`);
//       toast.success("Removed from Favourite List");
//     } catch (error) {
//       console.error("Failed to remove from Favourite List", error);
//       toast.error("Error removing property from Favourite List");
//     }
//   };

//   useEffect(() => {
//     if (currentUser) {
//       fetchFavouriteList();
//     } else {
//       setFavouriteList([]);
//     }
//   }, [currentUser]);

//   return (
//     <FavouritesContext.Provider
//       value={{ favouriteList, addToFavouriteList, removeFromFavouriteList }}
//     >
//       {children}
//     </FavouritesContext.Provider>
//   );
// };

// export default FavouritesContextProvider;

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "./AuthContext";

export const FavouritesContext = createContext();

const FavouritesContextProvider = ({ children }) => {
  const [favouriteList, setFavouriteList] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const STORAGE_KEY = currentUser ? `favourites_${currentUser.id}` : null;

  useEffect(() => {
    if (currentUser) {
      const stored = localStorage.getItem(STORAGE_KEY);
      setFavouriteList(stored ? JSON.parse(stored) : []);
    } else {
      setFavouriteList([]);
    }
  }, [currentUser, STORAGE_KEY]);

  const saveFavourites = (favs) => {
    if (!STORAGE_KEY) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favs));
    setFavouriteList(favs);
  };

  const addToFavouriteList = (newProperty) => {
    if (!currentUser) {
      toast.warn("Login to add property to favourites!");
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
      return;
    }

    if (favouriteList.some((fav) => fav.id === newProperty.id)) {
      toast.info("Already in favourites!");
      return;
    }

    const updated = [...favouriteList, newProperty];
    saveFavourites(updated);
    toast.success("Added to favourites!");
  };

  const removeFromFavouriteList = (property) => {
    if (!currentUser) {
      toast.warn("Login required.");
      return;
    }

    const updated = favouriteList.filter((fav) => fav.id !== property.id);
    saveFavourites(updated);
    toast.success("Removed from favourites");
  };

  return (
    <FavouritesContext.Provider
      value={{ favouriteList, addToFavouriteList, removeFromFavouriteList }}
    >
      {children}
    </FavouritesContext.Provider>
  );
};

export default FavouritesContextProvider;
