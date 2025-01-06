import Header from "../components/Header";
import Genre from "../components/Genres";
import CartView from "./CartView.jsx";
import { Outlet } from "react-router-dom";

function MovieView() {
  return (
    <>
      <Genre />
      <CartView />
      <Header />
      <Outlet />
    </>
  )
}

export default MovieView;