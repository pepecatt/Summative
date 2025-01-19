import { useStoreContext } from "../context";
import trashCan from "../assets/trashcan.png";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import "./Cartview.css";

function CartView() {
	const { cart, setCart, user } = useStoreContext();

	function removeMovie(removedItem) {
    const updatedCart = cart.filter(item => item !== removedItem);
    setCart(updatedCart);
    localStorage.setItem(user.uid, JSON.stringify(updatedCart));
	} 

  async function checkout() {
    const docRef = doc(firestore, "users", user.uid);
    const userData = { purchases: cart };
    await setDoc(docRef, userData, { merge: true });
    localStorage.removeItem(user.uid);
    setCart([]);
  }

	return (
		<>
				<div className="cart-view">
					<h1>Shopping Cart</h1>
					<div className="cart-items">
						{
							cart.map((item, index) => {
                return (
                  <div className="cart-item" key={index}>
                    <img className="poster" 
                      src={`https://image.tmdb.org/t/p/w500${item.poster}`}
                      alt={item.title} 
                    />
                    <p>{item.title}</p>
                    <button className="trashCan" onClick={() => removeMovie(item)}>
                      <img src={trashCan} alt="trash can" />
                    </button>
                  </div>
                );
              })
						}
            {cart.length > 0 ? (
              <button className='checkout' onClick={() => checkout()} >Checkout</button>
            ) : (
              <p>Nothing in cart right now!</p>
            )}
						
					</div>
					
				</div>
		</>
	)
}

export default CartView;