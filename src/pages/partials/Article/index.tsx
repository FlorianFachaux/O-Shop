import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IArticle } from '../../../@types/article';
import { faShoppingCart, faSearch } from '@fortawesome/free-solid-svg-icons';
import './styles.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CartContext } from '../../../context/Context';


interface ArticleProps {
  article: IArticle
}

function Article({ article }: ArticleProps) {
  const [articleData, setArticleData] = useState<IArticle>();
  const { dispatch } = useContext(CartContext);
  

  const addToCart = () => {
    dispatch({ type: 'ADD', payload: article });
  };

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await axios.get(`http://localhost:3000/articles/${article.id}`);
        setArticleData(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchArticle();
  }, [article.id]);

  return (
    <Link to={`/articles/${article.id}`}>
      <article className="article">
        <img src={articleData?.image} alt="Photo du produit" className="article__card-image" />
        <section className="article__card-detail">
          <h3 className="article__card-title">{articleData?.article_name}</h3>
          <p className="article__card-price">
            {articleData?.price}
            {' '}
            €</p>
            <button className="article__card-button" onClick={addToCart}>Ajouter au panier</button>
        </section>
      </article>
    </Link>
  );
}

export default Article;
