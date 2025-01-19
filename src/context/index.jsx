import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth, firestore } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Map } from 'immutable';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [genreList, setGenreList] = useState(Map());
  const [cart, setCart] = useState(Map());
  const [purchases, setPurchases] = useState(Map());
  const [cartOpen, setCartOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setUser(user);

        try {
          const cartData = localStorage.getItem(user.uid);
          if (cartData) {
            setCart(JSON.parse(cartData));
            console.log("Parsed cart data:", JSON.parse(cartData)); // Debugging line
          }
        } catch {
          cartObject = [];
          setCart(new Map());
        }

        const getGenresandPurchases = async () => {
          try {
            const docRef = doc(firestore, "users", user.uid);
            const data = (await getDoc(docRef)).data();
            setGenreList(data.genres);
            if (data.purchases) {
              setPurchases(data.purchases);
              console.log(data.purchases);
            } else {
              setPurchases(Map());
            }
          } catch (error) {
            console.log(error);
          }
        };
        getGenresandPurchases();
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
      cart, setCart,
      purchases, setPurchases,
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