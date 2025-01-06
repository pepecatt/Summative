import { useRef, useState } from "react";
import { useStoreContext } from "../context";
import "./SettingsView.css";

function SettingsView() {
  const {
    firstName, setFirstName,
    lastName, setLastName,
    email, setCurrentGenre,
    genreList, setGenreList,
  } = useStoreContext();
  console.log("inital", genreList);

  const [changeFirstName, setChangeFirst] = useState(false);
  const [changeLastName, setChangeLast] = useState(false);
  const newFirstName = useRef();
  const newLastName = useRef();

  const genres = [
    { id: 28, genre: "Action" },
    { id: 12, genre: "Adventure" },
    { id: 16, genre: "Animation" },
    { id: 35, genre: "Comedy" },
    { id: 80, genre: "Crime" },
    { id: 10751, genre: "Family" },
    { id: 14, genre: "Fantasy" },
    { id: 36, genre: "History" },
    { id: 27, genre: "Horror" },
    { id: 10402, genre: "Music" },
    { id: 9648, genre: "Mystery" },
    { id: 878, genre: "Sci-Fi" },
    { id: 53, genre: "Thriller" },
    { id: 10752, genre: "War" },
    { id: 37, genre: "Western" }
  ];

  const genreStatusMap = genres.reduce((acc, genre) => {
    // Check if the genre.id exists in genreList
    acc[genre.id] = genreList.some((g) => g.id === genre.id); // true if in genreList, false otherwise
    return acc;
  }, {});

  const [checkedGenres, setCheckedGenres] = useState(genreStatusMap);
  const handleChange = (itemId) => {
    setCheckedGenres(prevState => ({
      ...prevState,
      [itemId]: !prevState[itemId], // Toggle checkbox
    }));
  };
  console.log(checkedGenres);

  const checkboxesRef = useRef({});

  function settings(e) {
    e.preventDefault();

    const selectedGenres = Object.keys(checkboxesRef.current)
      .filter((genreId) => checkboxesRef.current[genreId].checked)
      .map(Number);

    if (selectedGenres.length >= 1 && selectedGenres.length < 4) {  // ** change to 10
      alert("You need to select at least 10 genres!");
    } else if (selectedGenres.length >= 4) {  // ** change to 10
      const sortedGenres = selectedGenres
        .map((genreId) => genres.find((genre) => genre.id === genreId))
        .sort((a, b) => a.genre.localeCompare(b.genre));

      setGenreList(sortedGenres);
      setCurrentGenre(sortedGenres[0].genre);
    }

    setInformation();
  }

  function setInformation() {
    if (newFirstName !== null) {
      setFirstName(newFirstName.current.value);
    }
    if (newLastName !== null) {
      setLastName(newLastName.current.value);
    }
  }

  const firstNameChange = () => setChangeFirst(!changeFirstName);
  const lastNameChange = () => setChangeLast(!changeLastName);

  return (
    <>
      <div className="settings-container">
        <form onSubmit={settings}>
          <label className="settingsLabel">Settings</label>
          <label className="userEmail">Email: {email}</label>
          <div className="userInfoDiv">
            <label className="userInfo">First Name: {firstName}</label>
            <button className='changeButton' type="button" onClick={firstNameChange}>Change</button>
          </div>
          {changeFirstName && (
            <input
              type="text"
              placeholder="New First Name"
              ref={newFirstName}
            />
          )}
          <div className="userInfoDiv">
            <label className="userInfo">Last Name: {lastName}</label>
            <button className='changeButton' type="button" onClick={lastNameChange}>Change</button>
          </div>
          {changeLastName && (
            <input
              type="text"
              placeholder="New Last Name"
              ref={newLastName}
            />
          )}

          <label className="genreLabel">Genres:</label>
          {checkedGenres && (
            <div className="genresList">
            {genres.map((item) => {
              return (
                <label key={item.id}>
                  <input
                    type='checkbox'
                    id="check"
                    checked={checkedGenres[item.id] || false}
                    ref={(el) => (checkboxesRef.current[item.id] = el)}
                    onChange={() => handleChange(item.id)}
                  /> {item.genre}
                </label>
              );
            })}
          </div>
          )}
          
          <button className="submit" type="submit" onChange={settings}>Submit Changes</button>
        </form>
      </div>
    </>

  )
}

export default SettingsView;