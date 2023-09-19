import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ADD_TO_CART, DECREASE_QUANTITY, INCREASE_QUANTITY, REMOVE_ITEM, RootState } from '../../Redux/types';
import { IArticle } from '../../@types/article';
import plus from '../../assets/images/Cart/plus.png';
import minus from '../../assets/images/Cart/minus.png';
import './styles.scss';
import Cookies from 'js-cookie';

function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  const updateCartCookie = () => {
    Cookies.set('cartToken', JSON.stringify(cartItems), { expires: 7 }); // 'cart' est le nom du cookie
  };
  
  const cartTotal = cartItems.reduce(
    (total: number, article: IArticle) => total + (article.price || 0) * (article.quantity || 0),
    0
  );

  const handleDecreaseQuantity = (article: IArticle) => {
    dispatch({ type: DECREASE_QUANTITY, payload: article });
    updateCartCookie();
  };
  
  const handleIncreaseQuantity = (article: IArticle) => {
    dispatch({ type: INCREASE_QUANTITY, payload: article });
    updateCartCookie();
  };
  
  const handleRemoveItem = (article: IArticle) => {
    dispatch({ type: REMOVE_ITEM, payload: article });
    const updatedCartItems = cartItems.filter(item => item.id !== article.id);
    updateCartCookie();
  };

  useEffect(() => {
    const cartCookie = Cookies.get('cart');
    if (cartCookie) {
      const parsedCart = JSON.parse(cartCookie);
      parsedCart.forEach((item: IArticle) => {
        dispatch({ type: ADD_TO_CART, payload: item });
      });
    }
    updateCartCookie();
  }, []);
  

  if (cartItems.length === 0) {
    return (
      <section className="cart">
        <div className="cart__container">
          <h2 className="cart__container-empty">Mon panier est vide</h2>
          <Link to="/articles" className="cart__container-links">
            Continuer mes achats
          </Link>
          <Link to="/Login" className="cart__container-links">
            Me connecter
          </Link>
          <NavLink to="/articles">
            <button className="cart__button-empty" type="button">
              Trouver des articles
            </button>
          </NavLink>
        </div>
      </section>
    );
  }

  return (
    <section className="cart">
      <div className="cart__container">
        <div className="cart__items">
          <div>
            <div className="cart__header">
              <h2 className="cart__header-title">Mon panier</h2>
              <Link to="/articles" className="cart__header-continue-link">
                Continuer mes achats
              </Link>
            </div>
          </div>
          <form action="#">
            <div className="cart__content">
              <div className="cart__content-list">
                <div className="cart__content-list--article">Article</div>
                <div className="cart__content-list--quantity">Quantité</div>
                <div className="cart__content-list--total">Total</div>
              </div>

              <div className="cart__details">
                {cartItems.map((article: IArticle) => (
                  <div key={article.id} className="cart__details-items">
                    <div className="cart__details-description">
                      <img
                        className="cart__details-description-image"
                        src={article.image}
                        alt="article"
                      />
                    </div>
                    <div className="cart__details-quantity">
                      <div className="cart__details-quantity-items">
                        <div className="cart__details-quantity--wrap">
                          {/* Decrease quantity button */}
                          <button
                            onClick={() => handleDecreaseQuantity(article)}
                            className="cart__quantity-button"
                            type="button"
                          >
                            <img
                              className="cart__quantity-button--item"
                              src={minus}
                              alt="minus"
                            />
                          </button>
                          {/* Input quantity */}
                          <input
                            readOnly
                            value={article.quantity}
                            className="cart__quantity-input"
                            type="number"
                          />
                          {/* Increase quantity button */}
                          <button
                            onClick={() => handleIncreaseQuantity(article)}
                            className="cart__quantity-button"
                            type="button"
                          >
                            <img
                              className="cart__quantity-button--item"
                              src={plus}
                              alt="plus"
                            />
                          </button>
                        </div>
                        {/* Remove item button */}
                        <button
                          onClick={() => handleRemoveItem(article)}
                          className="cart__quantity-button"
                          type="button"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                    <div className="cart__details-total">
                      {(article.quantity ?? 0) * (article.price || 0)}€
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
          <section className="cart__summary">
            {cartItems.length > 0 && (
              <div className="cart__summary-wrap">
                <h2 className="cart__summary-title">Recapitulatif:</h2>
                <div className="cart__summary-subtotal">
                  <div className="cart__summary--left">Panier</div>
                  <div>{cartTotal} €</div>
                </div>
                <div className="cart__summary-delivery">
                  <div className="cart__summary--left">
                    Frais de livraison estimés: 0 €
                  </div>
                </div>
                <hr />
                <div className="cart__summary-total">
                  <div className="cart__summary--item">Total</div>
                  <div className="cart__summary--price">{cartTotal} €</div>
                </div>
              </div>
            )}
            <div className="cart__summary-button">
              <Link className="cart__summary-button--link" to="/checkout">
                Valider mon panier
              </Link>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}

export default Cart;