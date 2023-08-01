import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IArticle, User } from '../../@types/article';
import Article from '../partials/Article';
import './styles.scss';

function Articles() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const { category_slug } = useParams();

  useEffect(() => {
    // we get the information from the database to display the list of each item
    const fetchData = async () => {
      try {
        let url = 'http://localhost:3000/articles';
        if (category_slug) {
          url = `http://localhost:3000/articles/category/${category_slug}`;
        }
        const articlesResponse = await axios.get(url);
        setArticles(articlesResponse.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [category_slug]);
  // We need to get additional information for the admin access
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // We check that the connected user is an admin
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        setIsAdmin(response.data.userConnected.isAdmin);
      } catch (error) {
        console.error(
          'Erreur lors de la récupération des données utilisateur:',
          error
        );
      }
    };

    fetchUser();
  }, []);
  return (
    <section className="articles">
      <div className="articles__container">
        <h1 className="articles__title">Produits</h1>
        {/* The admin is able to go to addArticle */}
        {isAdmin && (
          <Link className="link__addArticle" to="/addArticle">
            + Ajouter un article
          </Link>
        )}
        <div className="articles__card-wrap ">
          {articles.map((article) => (
            <Article key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Articles;
