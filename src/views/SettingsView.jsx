import { useRef, useState } from "react";
import { useStoreContext } from "../context";
import { updateProfile } from 'firebase/auth';
import "./SettingsView.css";

function SettingsView() {
  const { user, genreList, setGenreList } = useStoreContext();

  const firstName = user.displayName.split(' ')[0];
  const [changeFirstName, setChangeFirst] = useState(false);
  const newFirstName = useRef();
  const lastName = user.displayName.split(' ')[1];
  const [changeLastName, setChangeLast] = useState(false);
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

  const checkboxesRef = useRef({});

  async function settings(e) {
    e.preventDefault();

    const selectedGenres = Object.keys(checkboxesRef.current)
      .filter((genreId) => checkboxesRef.current[genreId].checked)
      .map(Number);

    if (selectedGenres.length >= 1 && selectedGenres.length < 3) {  // ** change to 10
      alert("You need to select at least 10 genres!");
      return;
    } else if (selectedGenres.length >= 3) {  // ** change to 10
      const sortedGenres = selectedGenres
        .map((genreId) => genres.find((genre) => genre.id === genreId))
        .sort((a, b) => a.genre.localeCompare(b.genre));

      setGenreList(sortedGenres);
      const docRef = doc(firestore, "users", user.uid);
      await setDoc(docRef, { genres: genreList });
    }

    setInformation();
  }

  function setInformation() {
    if (newFirstName.current && newFirstName.current.value) {
      if (newLastName.current && newLastName.current.value) {
        updateProfile(user, {
          displayName: newFirstName.current.value + " " + newLastName.current.value
        });
      } else {
        updateProfile(user, {
          displayName: newFirstName.current.value + " " + user.displayName.split(' ')[1]
        });
      }
    } else if (newLastName.current && newLastName.current.value) {
      updateProfile(user, {
        displayName: user.displayName.split(' ')[0] + " " + newLastName.current.value
      });
    }
  }

  const firstNameChange = () => setChangeFirst(!changeFirstName);
  const lastNameChange = () => setChangeLast(!changeLastName);

  return (
    <>
      <div className="settings-container">
        <label className="settingsLabel">Settings</label>

        {user.emailVerified ? (
          <form onSubmit={settings}>
            <label className="userEmail">Email: {user.email}</label>

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
        ) : (
          <form onSubmit={settings}>
            <label className="userEmail">Email: {user.email}</label>
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
        )
        }

      </div>
    </>

  )
}

export default SettingsView;