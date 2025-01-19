import Header from "../components/Header";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import Footer from "../components/Footer";
import { useStoreContext } from '../context';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import "./HomeView.css";

function HomeView() {
  const { user, setUser } = useStoreContext();
  async function signout() {
    if (user) {
      await signOut(auth);
      setUser(null);
      localStorage.clear();
    }
  }
  signout();

  return (
    <>
      <div className="footerBackground"></div>
      <div className="spotlight"></div>
      <div className="mainPage">
        <Feature />
        <Hero />
        <Header />
      </div>
      <Footer />

    </>
  )
}

export default HomeView;