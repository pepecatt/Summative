import { useNavigate } from "react-router-dom";
import { useRef } from "react";
import { useStoreContext } from '../context';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, firestore } from '../firebase';
import { doc, getDoc } from "firebase/firestore";
import './LoginView.css';

function LoginView() {
	const { setUser, 
		setGenreList, setCurrentGenre, 
		setFirstName, setLastName, setEmail } 
		= useStoreContext();
	const enteredEmail = useRef('');
	const enteredPassword = useRef('');
	const navigate = useNavigate();

  async function emailLogin(e) {
    e.preventDefault();
    try {
      const user = (await signInWithEmailAndPassword(auth, enteredEmail.current.value, enteredPassword.current.value)).user;
      setUser(user);
			if (user) {
				readGenres(user);
				setFirstName(user.displayName.split(' ')[0]);
				setLastName(user.displayName.split(' ')[1]);
			}
    } catch (error) {
      alert("Error signing in!");
    }
  }

  async function googleLogin() {
    try {
      const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
      setUser(user);
			if (user) {
				readGenres(user);
				setFirstName(user.email);
			}
    } catch (error) {
      alert("Error signing in!");
    }
  }
  
	async function readGenres(user) {
		const docRef = doc(firestore, "users", user.uid);
  	const data = (await getDoc(docRef)).data();
  	const genres = data.sortedGenres;
		console.log(genres);
		setGenreList(genres);
		navigate(`/movies/genre/${genres[0].id}`);
		setCurrentGenre(genres[0].genre);
		setEmail(user.email);
	}

	return (
		<div className="login-container">
			<div className='login'>
				<form onSubmit={(event) => { emailLogin(event) }}>
					<label>Log In</label>
					<input
						type="text"
						ref={enteredEmail}
						placeholder="Email"
						required />
					<input
						type="text"
						ref={enteredPassword}
						placeholder="Password"
						required />
					<button type="submit">Log In</button>
				</form>
        <button onClick={() => googleLogin()} type="submit" className="googleLogin">Login by Google</button>
			</div>
		</div>
	)
}

export default LoginView;