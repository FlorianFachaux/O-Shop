import './styles.scss';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Homepage from '../Homepage';
import Login from '../Login';
import Signup from '../Signup';
import Articles from '../Articles';
import Account from '../Account';
import Cart from '../Cart';
import Detail from '../Detail';
import Checkout from '../Checkout';
import Error from '../Error';
import BackOffice from '../BackOffice';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/types';
import { addToCartAction, removeItemAction, decreaseQuantityAction, increaseQuantityAction, resetCartAction, loginAction, logoutAction } from '../../Redux/actions';
import Cookies from 'js-cookie';
import { IArticle } from '../../@types/article';

function App() {
  // Managing the connection status in the navigation
  const isLogged = useSelector((state: RootState) => state.auth.isLoggedIn);
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const dispatch = useDispatch();

  // This function handles the login action
  const handleLogin = () => {
    dispatch(loginAction());
    console.log('Logged');
  };
  
  // This function handles the logout action
  const handleLogout = () => {
    dispatch(logoutAction());
    Cookies.remove('authToken');
    console.log('Logged out');
  };

  // This function checks for a tokens in Cookies
  useEffect(() => {
    const authToken = Cookies.get('authToken');
    if (authToken) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;
      dispatch(loginAction());
    }
    const cartTokenCookie = Cookies.get('cartToken');
    
    if (cartTokenCookie) {
      const cartItems: IArticle[] = JSON.parse(decodeURIComponent(cartTokenCookie)); // Spécifiez le type IArticle
      cartItems.forEach((item: IArticle) => { // Spécifiez le type IArticle
        dispatch(addToCartAction(item));
      });
    }
  }, [dispatch]);

  const cartItemsJson = JSON.stringify(cartItems);

  // Mettre à jour le cookie dans le useEffect
  useEffect(() => {
    Cookies.set('cartToken', encodeURIComponent(cartItemsJson), { expires: 7 });
  }, [cartItemsJson]);  // Vous pouvez également ajouter `dispatch` dans les dépendances car vous l'utilisez dans le hook useSelector


  return (
    <div className="app">
      <div className="app-content">
        <Header isLogged={isLogged} handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/articles" element={<Articles />} />
          <Route
            path="/articles/category/:category_slug"
            element={<Articles />}
          />
          <Route
            path="/admin"
            element={<BackOffice />}
          />
          <Route path="/articles/:id" element={<Detail />} />
          {/* <Route path="/addarticle" element={<AddArticle />} /> */}
          <Route
            path="/login"
            element={
              // if the connection matched, redirect on homepage
              isLogged ? (
                <Navigate to="/" />
              ) : (
                <Login handleLogin={handleLogin} />
              )
            }
          />
          <Route path="/signup" element={<Signup />} />
          {/* if the user is connected, display the account button in header and open the cart, checkout and account access*/}
          {isLogged && (
            <>
              <Route
                path="/account"
                element={<Account handleLogout={handleLogout} />}
              />
              <Route path="/checkout" element={<Checkout />} />
            </>
          )}
          {/* if the user isnt logged in ans try to access account or cart, redirect to the Login page */}
          {!isLogged && (
            <>
              <Route path="/account" element={<Navigate to="/login" />} />
              <Route path="/checkout" element={<Navigate to="/login"/>} />
            </>
          )}
          <Route path="/cart" element={<Cart />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

