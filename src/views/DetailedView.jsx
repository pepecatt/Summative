import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import "./DetailedView.css";

function DetailedView() {
	const { id } = useParams();
	const [details, setDetails] = useState([]);

	useEffect(() => {
		async function getDetails() {
			const response = await axios.get(
				`https://api.themoviedb.org/3/movie/${id}?api_key=${import.meta.env.VITE_TMDB_KEY}&append_to_response=videos`
			);
			setDetails(response.data)
		}
		getDetails();
	}, [id]);

	if (!details) {
		return <div>Loading...</div>;
	}

	return (
		<>
			<Header />
			<div className="detail-container">
				{details.poster_path && (
					<img
						className="detail-poster"
						src={`https://image.tmdb.org/t/p/w500${details.poster_path}`}
						alt={details.title}
					/>
				)}
				<div className="movie-details">
					<label>{details.title}</label>
					<p className="ogTitle">Original Title: {details.original_title}</p>
					<p className="tagline">{details.tagline}</p>
					<p className="overview">{details.overview}</p>
					<p className="details-info"><strong>Release Date:</strong> {details.release_date}</p>
					<p className="details-info"><strong>Runtime:</strong> {details.runtime} minutes</p>
					{details.vote_average && (
						<p className="rating">Rating: {details.vote_average.toFixed(1)}/10</p>
					)}
				</div>
			</div>

			<div className="trailers-section">
				<h2>Trailers</h2>
				<div className="trailers-grid">
					{details.videos && details.videos.results
						.filter(trailer => trailer.type === 'Trailer' || trailer.type === 'Teaser')
						.map((trailer) => (
							<div key={trailer.id} className="trailer-tile">
								<a
									href={`https://www.youtube.com/watch?v=${trailer.key}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<img
										className="trailer-thumbnail"
										src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
										alt={trailer.name}
									/>
									<h3>{trailer.name}</h3>
								</a>
							</div>
						))
					}
				</div>
			</div>
		</>
	)
}

export default DetailedView;