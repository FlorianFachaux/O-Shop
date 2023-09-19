import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { IArticle } from '../../@types/article';
import './styles.scss';
import axiosInstance from '../../utils/axios';
import { useDispatch } from 'react-redux';
import { addToCartAction } from '../../Redux/actions';


interface ArticleProps {
  article: IArticle
}

function Article({ article }: ArticleProps) {
  const [articleData, setArticleData] = useState<IArticle>();
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch(addToCartAction(article));
  };

  useEffect(() => {
    async function fetchArticle() {
      try {
        const response = await axiosInstance.get(`/articles/${article.id}`);
        setArticleData(response.data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchArticle();
  }, [article.id]);

  return (
    <article className="article">
      <Link to={`/articles/${article.id}`} className="article__link">
        <img src={articleData?.image} alt="Photo du produit" className="article__card-image" />
        <section className="article__card-detail">
          <h3 className="article__card-title">{articleData?.article_name}</h3>
          <p className="article__card-price">
            {articleData?.price}
            {' '}
            €
          </p>
        </section>
      </Link>
      <button className="article__card-button" onClick={addToCart}>Ajouter au panier</button>
    </article>
  );
}

export default Article;
