import React, { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUser } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../../context/Context';
import './styles.scss';
import { Dropdown } from 'react-bootstrap';
import { ICategory } from '../../../@types/article';

type HeaderProps = {
  isLogged: boolean;
  handleLogout: () => void;
};

interface Article {
  quantity: number;
}

function Header({ isLogged, handleLogout }: HeaderProps) {
  const { state } = useContext(CartContext);
  const cartItemCount = state.reduce((total: number, article: Article) => total + article.quantity, 0);

  return (
    <header className="header">
      <Link to="/" className="header__logo">
        O'Shop
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
        <Dropdown>
          <Dropdown.Toggle className="header__nav--item">
            Catégorie
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item as={NavLink} to="/articles/category/vetements" >
              Vêtements
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/articles/category/thermos" >
              Thermos
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/articles/category/accessoires" >
              Accessoires
            </Dropdown.Item>
            <Dropdown.Item as={NavLink} to="/articles/category/tasses-et-mugs" >
              Tasses & Mugs
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
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
            >
              <FontAwesomeIcon icon={faUser} style={{ color: '$vars.font-color' }} size={'xl'} />
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              className="header__nav--item"
            >
              Se Connecter
            </NavLink>
            <NavLink
              to="/signup"
              className="header__nav--item"
              id="signup"
            >
              S&apos;inscrire
            </NavLink>
          </>
        )}
        <NavLink
          to="/cart"
          className="header__nav--item"
          id="cart__link"
        >
          <FontAwesomeIcon icon={faCartShopping} style={{ color: '$vars.font-color' }} size={'xl'} />
          {cartItemCount > 0 && <span className="item-count__number  item-count">{cartItemCount}</span>}
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;