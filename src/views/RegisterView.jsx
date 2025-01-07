import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useStoreContext } from '../context';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, setDoc } from "firebase/firestore";
import "./RegisterView.css";

function RegisterView() {
  const { setUser, setFirstName,
    setGenreList, setCurrentGenre, user } = useStoreContext();

  const firstName = useRef('');
  const lastName = useRef('');
  const email = useRef('');
  const password = useRef('');
  const confirmPassword = useRef('');

  const navigate = useNavigate();

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

  const checkboxesRef = useRef({});

  const emailRegister = async (e) => {
    e.preventDefault();

    if (password.current.value !== confirmPassword.current.value) {
      alert("Passwords do not match!");
      return;
    }

    const selectedGenres = Object.keys(checkboxesRef.current)
      .filter((genreId) => checkboxesRef.current[genreId].checked)
      .map(Number);
    if (selectedGenres.length < 2) {  // ** change to 10
      alert("You need to pick at least 10 genres!")
      return;
    }
      
    try {
      const userr = (await createUserWithEmailAndPassword(auth, email.current.value, password.current.value)).user;
      await updateProfile(userr, { displayName: `${firstName.current.value} ${lastName.current.value}` });
      setUser(userr);
    } catch (error) {
      console.error("Error creating user:", error.message);
      alert("Error creating user with email and password!");
      return;
    }

    setFirstName(firstName.current.value);
    sortGenres(selectedGenres);
  };

  const googleRegister = async () => {
    const selectedGenres = Object.keys(checkboxesRef.current)
      .filter((genreId) => checkboxesRef.current[genreId].checked)
      .map(Number);
    if (selectedGenres.length < 2) {  // ** change to 10
      alert("You need to pick at least 10 genres!")
      return;
    }

    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
      setFirstName(user.email);
    } catch {
      alert("Error creating user with email and password!");
    }
    sortGenres(selectedGenres);
  }

  async function sortGenres(selectedGenres) {
    const sortedGenres = selectedGenres
      .map((genreId) => genres.find((genre) => genre.id === genreId))
      .sort((a, b) => a.genre.localeCompare(b.genre)); // sort by genre name alphabetically

    setGenreList([...sortedGenres]);
    setCurrentGenre(sortedGenres[0].genre);
    navigateUser(sortedGenres);

    const docRef = doc(firestore, "users", user.uid);
    await setDoc(docRef, { sortedGenres });

    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const sddsd = data.sortedGenres;

    console.log("Fetched sortedGenres:", sddsd);
  }

  function navigateUser(sortedGenres) {
    navigate(`/movies/genre/${sortedGenres[0].id}`);
  }

  return (
    <div className="register-container">
      <form onSubmit={(event) => { emailRegister(event) }}>
        <label className="createAccount">Create an Account</label>
        <input
          type="text"
          placeholder="First Name"
          ref={firstName}
          required />
        <input
          type="text"
          placeholder="Last Name"
          ref={lastName}
          required />
        <input
          type="email"
          placeholder="Email"
          ref={email}
          required />
        <input
          type="password"
          placeholder="Password"
          ref={password}
          required />
        <input
          type="password"
          placeholder="Confirm Password"
          ref={confirmPassword}
          required />

        <label className="genreLabel">Genres: (at least 10)</label>
        <div className="genresList">
          {genres.map((item) => {
            return (
              <label key={item.id}>
                <input
                  type='checkbox'
                  ref={(el) => (checkboxesRef.current[item.id] = el)}
                /> {item.genre}
              </label>
            );
          })}
        </div>
        <button type="submit">Register</button>
      </form>
      <button onClick={() => googleRegister()} type="submit" className="googleRegister" >Register by Google</button>
      <p onClick={() => { navigate(`/login`) }}>Already have an account? <a href="#">Login</a></p>
    </div>
  )
}

export default RegisterView;