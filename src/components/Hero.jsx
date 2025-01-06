import { useNavigate } from "react-router-dom";
import './Hero.css';

function Hero() {
  const navigate = useNavigate();

  function registerPage() {
    navigate(`/register`);
  }

  return (
    <>
      <div className="homepage">
        <h1>Endless popcorn binging</h1>
        <p className="startsatpi-text">Starts at $3.14. Cancel anytime.</p>
        <div className='email-getStarted'>
          <input type="text" placeholder="Email"></input>
          <button onClick={() => { registerPage() }} >Get Started &#62;</button>
        </div>
      </div>

    </>
  )
}

export default Hero;