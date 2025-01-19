import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreContext } from '../context';
import "./GenreView.css";

function GenresView() {
  const { user, genreList, purchases,
    setCartOpen, cart, setCart
  } = useStoreContext();
  const [movies, setMovies] = useState([]);
  const { id } = useParams();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const firstName = user.displayName.split(' ')[0];
  const navigate = useNavigate();

  if (!genreList || genreList.length < 1) {
    return <div>Loading...</div>;
  }

  const currentGenre = genreList.find(genre => genre.id === parseInt(id))?.genre;

  const firstGenre = genreList[0];
  const [previousId, setPreviousId] = useState(firstGenre ? firstGenre.id : null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id !== previousId) {
      setPage(1);
      setPreviousId(id);
    }

    async function getMovies() {
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${import.meta.env.VITE_TMDB_KEY}&with_genres=${id}&page=${page}`
      );
      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    }
    getMovies();
  }, [id, page]);

  function nextPage() {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }

  function previousPage() {
    if (page !== 1) {
      setPage(page - 1);
    }
  }

  function loadMovie(id) {
    navigate(`/movies/details/${id}`);
    setCartOpen(false);
  }

  function addToCart(movie) {
    const updatedCart = [...cart, { title: movie.title, poster: movie.poster_path }];
    setCart(updatedCart);
    localStorage.setItem(user.uid, JSON.stringify(updatedCart));
    console.log(purchases);
  }

  return (
    <div className="genreView-container">
      <h2 className="hello">Welcome, {firstName}!</h2>
      <h1>{currentGenre} Movies</h1>
      <div className='movie-list'>
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              onClick={() => { loadMovie(movie.id) }}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="movie-poster"
            />
            <button
              className={
                purchases.some(item => item.title === movie.title)
                  ? "bought"
                  : cart.some(item => item.title === movie.title)
                    ? "added"
                    : "buy"
              }
              onClick={() => addToCart(movie)}
              disabled={
                cart.some(item => item.title === movie.title)
                || purchases.some(item => item.title === movie.title)
              }
            >
              {purchases.some(item => item.title === movie.title)
                ? "Bought"
                : cart.some(item => item.title === movie.title)
                  ? "Added"
                  : "Add"
              }
            </button>
          </div>
        ))}
      </div>
      <div className='pages'>
        {page > 1 && (
          <button className="page-button" onClick={previousPage}>
            Previous
          </button>
        )}
        <p className="page-number">Page: {page}/{totalPages}</p>
        {page < totalPages && (
          <button className="page-button" onClick={nextPage}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default GenresView;