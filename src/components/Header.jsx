import { useNavigate } from 'react-router-dom';
import { useStoreContext } from '../context';
import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import './Header.css';
import cartImage from "../assets/cart.png";
import settingsImage from "../assets/settings.png";

import { firestore } from "../firebase"; //
import { doc, setDoc, getDoc } from "firebase/firestore"; //

function Header() {
  const {
    cartOpen, setCartOpen,
    settingsOpen, setSettingsOpen,
    genreList, user, setUser
  } = useStoreContext();
  const navigate = useNavigate();

  function loginPage() {
    navigate(`/login`);
  }

  async function logout() {
    await signOut(auth);
    setUser(null);
    navigate(`/`, { replace: true });
  }

  async function cart() {
    if (cartOpen) {
      setCartOpen(false);
    } else {
      setCartOpen(true);
    }

    //
    const genres = ["action", "adventure"];
    const docRef = doc(firestore, "users", user.uid);
    await setDoc(docRef, { genres });
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    console.log(data);
  }

  function settings() {
    if (settingsOpen) {
      setSettingsOpen(false);
      navigate(`/movies/genre/${genreList[0].id}`);
    } else {
      setSettingsOpen(true);
      navigate(`/movies/settings`);
    }
  }

  return (
    <div className="header-container">
      <h1 className="Popflix">Popflix</h1>
      {!user ? (
        <button className="signIn" onClick={loginPage}>Log In</button>
      ) : (
        <div className="loggedIn">
          <button className="logout" onClick={logout} >Log Out</button>
          <button className="cart" onClick={cart}>
            <img src={cartImage} alt="Cart" />
          </button>
          <button className="settings" onClick={settings}>
            <img src={settingsImage} alt="Settings" />
          </button>
        </div>
      )}
    </div>
  )
}

export default Header;