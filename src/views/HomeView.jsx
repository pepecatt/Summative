import Header from "../components/Header";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import Footer from "../components/Footer";
import "./HomeView.css";

function HomeView() {
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