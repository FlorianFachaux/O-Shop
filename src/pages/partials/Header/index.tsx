import { Link, NavLink, useLocation, useParams } from 'react-router-dom';
import Logo from '../../../assets/images/logo-yellow.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';
import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { CartContext } from '../../../context/Context';

type HeaderProps = {
  isLogged: boolean;
  handleLogout: () => void;
};

interface Article {
  quantity: number;
}

interface HeaderContextType {
  currentHeaderBackground: string;
  setCurrentHeaderBackground: (color: string) => void;
}

const HeaderContext = createContext<HeaderContextType>({
  currentHeaderBackground: '',
  setCurrentHeaderBackground: () => {},
});

const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentHeaderBackground, setCurrentHeaderBackground] = useState('');

  return (
    <HeaderContext.Provider value={{ currentHeaderBackground, setCurrentHeaderBackground }}>
      {children}
    </HeaderContext.Provider>
  );
};

function Header({ isLogged, handleLogout }: HeaderProps) {
  const { state } = useContext(CartContext);
  const cartItemCount = state.reduce((total: number, article: Article) => total + article.quantity, 0);
  const { currentHeaderBackground, setCurrentHeaderBackground } = useContext(
    HeaderContext
  ) || {};

  const location = useLocation();
  const params = useParams<{ color?: string }>();

  // We define a color according to the url retrieved in params
  const colorMappings: {[url: string]: string} = {
    '/categories': '#c13530',
    '/articles': '#e3a000',
    '/login': '#234b78',
    '/signup': '#234b78',
    '/account': '#45cafc',
    '/cart': '#234b78',
    '/addArticle': '#45cafc',
  };
  // We loop on the colorMappings array to define the color
  const getColorFromURL = (pathname: string) => {
    for (const url in colorMappings) {
      if (pathname.includes(url)) {
        return colorMappings[url];
      }
    }
    return '';
  };
// We manage the color change
  useEffect(() => {
    const color = getColorFromURL(location.pathname);
    setCurrentHeaderBackground(color);
  }, [location.pathname]);

  return (
    <header className="header" style={{ backgroundColor: currentHeaderBackground }}>
      <Link to="/">
        <img className="header__logo" src={Logo} alt="O'Shop Logo" />
      </Link>
      <nav className="header__nav">
        <NavLink
          to="/"
          className="header__nav--item"
        >
          Accueil
        </NavLink>
        <NavLink
          to="/articles"
          className="header__nav--item"
        >
          Produits
        </NavLink>
        <NavLink
          to="/categories"
          className="header__nav--item"
          onClick={() => setCurrentHeaderBackground('#c13530')}
        >
          Catégories
        </NavLink>

        {isLogged ? (
          <>
            <NavLink
              to="/login"
              className="header__nav--item"
              id="logout"
              onClick={handleLogout}
            >
              Déconnexion
            </NavLink>
            <NavLink
              to="/account"
              className="header__nav--item"
              id="account__link"
              onClick={() => setCurrentHeaderBackground('#45cafc')}
            >
              <FontAwesomeIcon icon={faUser} style={{ color: '$vars.font-color' }} size={'xl'} />
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="header__nav--item"
              onClick={() => setCurrentHeaderBackground('#234b78')}
            >
              Se Connecter
            </NavLink>
            <NavLink
              to="/signup"
              className="header__nav--item"
              id="signup"
              onClick={() => setCurrentHeaderBackground('#234b78')}
            >
              S&apos;inscrire
            </NavLink>
          </>
        )}
        <NavLink
          to="/cart"
          className="header__nav--item"
          id="cart__link"
          onClick={() => setCurrentHeaderBackground('#234b78')}
        >
          <FontAwesomeIcon icon={faCartShopping} style={{ color: '$vars.font-color' }} size={'xl'} />
          {cartItemCount > 0 && <span className="item-count__number  item-count">{cartItemCount}</span>}
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;
export { HeaderProvider };