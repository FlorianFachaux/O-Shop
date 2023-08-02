import './styles.scss';
import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CartContext } from '../../context/Context';
import plus from '../../assets/images/Cart/plus.png';
import minus from '../../assets/images/Cart/minus.png';
import remove from '../../assets/images/Cart/delete.png';

interface Article {
  id: number;
  image: string;
  title: string;
  price: number;
  quantity: number;
}

function Cart() {
  // Get the cart state and dispatch function from the CartContext
  const { state, dispatch } = useContext(CartContext);
  // Calculate the total cart value by multiplying each article's price with its quantity and summing them up
  const cartTotal = state.reduce(
    (total: number, article: Article) => total + article.price * article.quantity,
    0
  );

  // Decrease the quantity of an article in the cart
  const handleDecreaseQuantity = (article: Article) => {
    if (article.quantity > 1) {
      dispatch({ type: 'DECREASE', payload: article });
    } else {
      dispatch({ type: 'REMOVE', payload: article });
    }
  };

   // Increase the quantity of an article in the cart
  const handleIncreaseQuantity = (article: Article) => {
    dispatch({ type: 'INCREASE', payload: article })
  };

  // Remove an article from the cart
  const handleRemoveItem = (article: Article) => {
    dispatch({ type: 'REMOVE', payload: article });
  };

   // Render empty cart message when cart is empty
  if (state.length === 0) {
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
          <NavLink to="/categories">
            <button
              className="cart__button-empty"
              type="button"
            >
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
                {state.map((article: Article) => (
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
                          <img
                            className="cart__quantity-button--item cart__quantity--remove-button"
                            src={remove}
                            alt="delete"
                          />
                        </button>
                      </div>
                    </div>
                    <div className="cart__details-total">
                      {article.quantity * article.price}€ {/* Calculate and display the total cost of the article */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </form>
          <section className="cart__summary">
            {state.length > 0 && (
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
