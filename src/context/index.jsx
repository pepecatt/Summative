import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { Map } from 'immutable';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  // email user
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // firebase user
  const [user, setUser] = useState(null);

  const [genreList, setGenreList] = useState(Map());
  const [currentGenre, setCurrentGenre] = useState("");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);
        const sessionCart = localStorage.getItem(user.uid);
        if (sessionCart) {
          setCart(Map(JSON.parse(sessionCart)));
        }
      }
      setLoading(false);
    });
  }, [])
  useEffect(() => {
    console.log("user context updated:", user); // Log user after every state change
  }, [user]);

  if (loading) {
    return <h1>Loading...</h1>
  }

  return (
    <StoreContext.Provider value={{
      email, setEmail,
      password, setPassword,
      user, setUser,
      firstName, setFirstName,
      lastName, setLastName,
      genreList, setGenreList,
      currentGenre, setCurrentGenre,
      cart, setCart,
      cartOpen, setCartOpen,
      settingsOpen, setSettingsOpen,
      genres, setGenres,
      loading, setLoading
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStoreContext = () => {
  return useContext(StoreContext);
}