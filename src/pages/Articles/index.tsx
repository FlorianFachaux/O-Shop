import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { IArticle, User } from '../../@types/article';
import Article from '../../components/Article';
import './styles.scss';
import axiosInstance from '../../utils/axios';
import Cookies from 'js-cookie';

function Articles() {
  const [articles, setArticles] = useState<IArticle[]>([]);
  const { category_slug } = useParams();

  useEffect(() => {
    // we get the information from the database to display the list of each item
    const fetchData = async () => {
      try {
        let url = '/articles';
        if (category_slug) {
          url = `/articles/category/${encodeURIComponent(category_slug)}`;
        }
        const articlesResponse = await axiosInstance.get(url);
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
        const token = Cookies.get('authToken');
        const response = await axiosInstance.get('/account', {
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
  // Rechercher un article par son nom
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = articles.filter((article) => {
    const searchTerm = searchQuery.toLowerCase();
    return article.article_name?.toLowerCase().includes(searchTerm);
  });

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Filtrer les articles
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | 'az' | 'za' | ''>('');

const customSort = (a: IArticle, b: IArticle) => {
  if (sortOrder === 'asc') {
    return (a.price || 0) - (b.price || 0);
  } else if (sortOrder === 'desc') {
    return (b.price || 0) - (a.price || 0);
  } else if (sortOrder === 'za') {
    return (a.article_name || '').localeCompare(b.article_name || '');
  } else if (sortOrder === 'az') {
    return (b.article_name || '').localeCompare(a.article_name || '');
  }
  return 0;
};

const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const value = e.target.value as 'asc' | 'desc' | 'az' | 'za' | '';
  setSortOrder(value);

  if (value !== '') {
    let sortedArticles: IArticle[] = [...filteredArticles];
    sortedArticles.sort(customSort);
    setArticles(sortedArticles);
  }
};

  return (
    <section className="articles">
      <div className="articles__container">
        <section className="articles__container-header">
          <h1 className="articles__title">Produits</h1>
          <div className="articles__filters">
          <div className="articles__sort-select">
              <label htmlFor="sortOrderSelect">Filtrer par:</label>
              <select
              id="sortOrderSelect"
              value={sortOrder}
              onChange={handleSortOrderChange}
            >
              <option value="default">-- Sélectionnez un filtre --</option>
              <option value="desc">Prix croissant</option>
              <option value="asc">Prix décroissant</option>
              <option value="az">Nom A-Z</option>
              <option value="za">Nom Z-A</option>
            </select>
            </div>
            <div className="articles__filters-searchbar">
            <input
              className="articles__filters-research"
              type="text"
              placeholder="Rechercher un produit..."
              value={searchQuery}
              onChange={handleSearchInputChange}
            />
            </div>
          </div>
        </section>
        <div className="articles__card-wrap ">
          {filteredArticles.map((article) => (
            <Article key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Articles;
