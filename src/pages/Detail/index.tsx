import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../utils/axios';
import './styles.scss';
import { useContext, useEffect, useState } from 'react';
import { IArticle } from '../../@types/article';
import { CartContext } from '../../context/Context';
import { Modal } from 'react-bootstrap';
import { User } from '../../@types/article';

function Detail() {
  const [detail, setDetail] = useState<IArticle | undefined>();
  const [addedToCart, setAddedToCart] = useState(false);
  const { id } = useParams<{ id: string }>();
  const Globalstate = useContext(CartContext);
  const { dispatch } = Globalstate;
  const [quantity, setQuantity] = useState<number>(0);
  const [articleName, setArticleName] = useState(detail?.article_name || '');
  const [articleExcerpt, setArticleExcerpt] = useState(detail?.excerpt || '');
  const [articleDescription, setArticleDescription] = useState(detail?.description || '');
  const [articleImage, setArticleImage] = useState(detail?.image || '');
  const [articlePrice, setArticlePrice] = useState<number>(0);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleResponse = await axios.get(`http://localhost:3000/articles/${id}`);
        setDetail(articleResponse.data);
        setQuantity(articleResponse.data.quantity);
        setArticleName(articleResponse.data.article_name);
        setArticleExcerpt(articleResponse.data.excerpt);
        setArticleDescription(articleResponse.data.description);
        setArticleImage(articleResponse.data.image);
        setArticlePrice(parseFloat(articleResponse.data.price));
      } catch (err) {
        console.log(err);
      }
    };
    fetchArticle();
  }, [id]);
    
  // Récupérer les informations de l'utilisateur connecté
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // On effectue la requête GET pour récupérer les données de l'utilisateur
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/account', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
        console.log(response.data);
        console.log(response.data.userConnected.isAdmin);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    fetchUser();
  }, []);
  
  
  const [showAddedToCart, setShowAddedToCart] = useState(false);
  // On gère l'ajout de l'article dans le panier
  const handleAddToCart = () => {
    dispatch({ type: 'ADD', payload: detail });
    setAddedToCart(true);

    setTimeout(() => {
      setAddedToCart(false);
    }, 3500);
  };

  return (
    <div className="detail">
      {detail && (
      <>
        <div className="detail__leftSide">
          <img className="detail__image" src={articleImage} alt="article" />
        </div><div className="detail__rightSide">
            <h1 className="detail__title">{articleName}</h1>
            <p className="detail__excerpt">
              {articleExcerpt}
            </p>
            <p className="detail__description">
              {articleDescription}
            </p>
            <p className="detail__price">
              Prix :
              {' '}
              {articlePrice}
              €
            </p>
            <button onClick={handleAddToCart} type="button" className="detail__button">
              Ajouter au panier
            </button>
          </div>
          {addedToCart && <p className="detail__added">Ajouté au panier</p>}
      </>
      )}
    </div>
  );
}

export default Detail;