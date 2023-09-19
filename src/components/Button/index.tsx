import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/types";
import { addToCartAction } from "../../Redux/actions";
import Cookies from "js-cookie";
import { IArticle } from "../../@types/article";

interface ButtonProps {
  article: IArticle;
}

function Button({ article }: ButtonProps) {
  const dispatch = useDispatch();

  // Utilisez useSelector pour obtenir le panier depuis le store Redux
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const addToCart = (item: IArticle) => {
    dispatch(addToCartAction(item)); 
  
    // Récupérez le panier actuel depuis le cookie
    const cartCookie = Cookies.get('cartToken');
    const currentCart = cartCookie ? JSON.parse(cartCookie) : [];
  
    // Ajoutez l'article au panier (s'il n'est pas déjà présent)
    const updatedCart = currentCart.some((cartItem: IArticle) => cartItem.id === item.id)
      ? currentCart
      : [...currentCart, item];
  
    // Mettez à jour le cookie 'cartToken' avec le nouveau panier
    Cookies.set('cartToken', JSON.stringify(updatedCart), { expires: 7 });
  };

  return (
    <button onClick={() => addToCart(article)} type="button" className="detail__button">
      Ajouter au panier
    </button>
  );
}

export default Button;