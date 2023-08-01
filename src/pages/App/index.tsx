import './styles.scss';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { CartContext } from '../../context/Context';
import Header, { HeaderProvider } from '../partials/Header';
import Footer from '../partials/Footer';
import Homepage from '../Homepage';
import Login from '../Login';
import Signup from '../Signup';
import Categories from '../Categories';
import Articles from '../Articles';
import Account from '../Account';
import Cart from '../Cart';
import Detail from '../Detail';
import Checkout from '../Checkout';
import Error from '../Error';
import AddArticle from '../AddArticle';
import axios from 'axios';

function App() {
  // Managing the connection status in the navigation
  const [isLogged, setIsLogged] = useState(false);
  const { resetCart } = useContext(CartContext);

  // This function checks for a token in local storage and, if found, sets up axios headers for authentication and indicates user login.
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsLogged(true);
    }
  }, []);

  // This function checks for the token in local storage and set isLogged to true to display the online Header
  const handleLogin = () => {
    localStorage.getItem('token');
    setIsLogged(true);
    console.log('Logged');
  };

  // This functioin is used to remove the current token and reset the userCard after user's logout
  const handleLogout = () => {
    setIsLogged(false);
    localStorage.removeItem('token');
    axios.defaults.headers.common['Authorization'] = '';
    resetCart();
    console.log('Logged out');
  };

  return (
    <div className="app">
      <div className="app-content">
        <HeaderProvider>
          <Header isLogged={isLogged} handleLogout={handleLogout} />
        </HeaderProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/articles" element={<Articles />} />
          <Route
            path="/articles/category/:category_slug"
            element={<Articles />}
          />
          <Route path="/articles/:id" element={<Detail />} />
          <Route path="/addarticle" element={<AddArticle />} />
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
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </>
          )}
          {/* if the user isnt logged in ans try to access account or cart, redirect to the Login page */}
          {!isLogged && (
            <>
              <Route path="/cart" element={<Navigate to="/login" />} />
              <Route path="/account" element={<Navigate to="/login" />} />
            </>
          )}
          
          <Route path="*" element={<Error />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

