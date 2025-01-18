import { useStoreContext } from "../context";
import trashCan from "../assets/trashcan.png";
import "./Cartview.css";

function CartView() {
	const { cart, setCart } = useStoreContext();

	function removeMovie(removedItem) {
		setCart(cart.filter(item => item !== removedItem));
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
										<img className="poster" src={`https://image.tmdb.org/t/p/w500${item.poster}`} alt={item.title} />
										<p>{item.title}</p>
										<button className="trashCan" onClick={() => { removeMovie(item) }}>
											<img src={trashCan}></img>
										</button>
									</div>
								);
							})
						}
            {cart.length >= 1 ? (
              <button className='checkout'>Checkout</button>
            ) : (
              <p>Nothing in cart right now!</p>
            )}
						
					</div>
					
				</div>
		</>
	)
}

export default CartView;