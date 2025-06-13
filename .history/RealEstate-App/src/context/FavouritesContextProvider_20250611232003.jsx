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
