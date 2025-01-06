import { useState, useEffect } from "react";
import axios from "axios";
import './Feature.css';
import PopcornBag from "../assets/popcornbag.png";

function Feature() {
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async function getImages() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/now_playing?api_key=${import.meta.env.VITE_TMDB_KEY}`
      );
      setFeatures(
        response.data.results
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value)
      );

      setIsLoading(false);
    })();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="movies">
        <div className='movierow1'>
          <img
            className="movie"
            src={`https://image.tmdb.org/t/p/w500${features[0].poster_path}`}
          />
        </div>
        <div className="movierow2">
          <img
            className="movie"
            src={`https://image.tmdb.org/t/p/w500${features[1].poster_path}`}
          />
          <img
            className="movie"
            src={`https://image.tmdb.org/t/p/w500${features[2].poster_path}`}
          />
        </div>
        <div className="movierow3">
          <img
            className="movie"
            src={`https://image.tmdb.org/t/p/w500${features[3].poster_path}`}
          />
          <img
            className="movie"
            src={`https://image.tmdb.org/t/p/w500${features[4].poster_path}`}
          />
          <img
            className="movie"
            src={`https://image.tmdb.org/t/p/w500${features[5].poster_path}`}
          />
        </div>
      </div>
      <img className="popcornbag" src={PopcornBag}></img>
    </>

  )
}

export default Feature;