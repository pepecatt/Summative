import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Map } from 'immutable';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [genreList, setGenreList] = useState(Map());
  const [currentGenre, setCurrentGenre] = useState("");
  const [cart, setCart] = useState(Map());
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
        const sessionCart = JSON.parse(localStorage.getItem(`${user?.uid}-cart`)).cart || [];
        if (sessionCart) {
          setCart(sessionCart);
        }

        const storedGenres = JSON.parse(localStorage.getItem(`${user?.uid}-genres`)).genres || [];
        setGenreList(storedGenres);
        setCurrentGenre(storedGenres[0].genre);
      }
      setLoading(false);
    });
  }, [])

  useEffect(() => {
    console.log("user changed:", user);
  }, [user]);

  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <StoreContext.Provider value={{
      user, setUser,
      genreList, setGenreList,
      currentGenre, setCurrentGenre,
      cart, setCart,
      cartOpen, setCartOpen,
      settingsOpen, setSettingsOpen,
      loading, setLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => {
  return useContext(StoreContext);
}