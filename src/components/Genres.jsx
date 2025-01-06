import { useNavigate } from "react-router-dom";
import { useStoreContext } from '../context';
import "./Genres.css";

function Genres() {
	const { genreList, setCurrentGenre, setCartOpen } = useStoreContext();
	const navigate = useNavigate();

	function click(item) {
		navigate(`genre/${item.id}`);
		setCurrentGenre(item.genre);
        setCartOpen(false);
	}

	return (
		<>
			<div className='genre-container'>
				<h2>Genres</h2>
				<ol>
					{genreList.length > 0 && genreList.map((item) => (
						<li key={item.id} onClick={() => click(item)}>
							{item.genre}
						</li>
					))}
				</ol>
			</div>
		</>
	)
}

export default Genres;