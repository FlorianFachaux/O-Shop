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
    <>
      <div className="articles__card">
        <img className="articles__card--image" src={articleData?.image} alt="card" />
        <h2 className="articles__card--title">{articleData?.article_name}</h2>
        <div className="articles__card--price">
          {articleData?.price}
          {' '}
          €
        </div>
        <div className="articles__cards--icons-wrap">
          <FontAwesomeIcon onClick={addToCart} className='articles__cards--icon fa-xl'  icon={faShoppingCart} />
          <Link to={`/articles/${article.id}`} rel="stylesheet">
          <FontAwesomeIcon className='articles__cards--icon fa-lg' icon={faSearch} />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Article;
