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
  const [isAdmin, setIsAdmin] = useState(false);

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
        setIsAdmin(response.data.userConnected.isAdmin);
        console.log(response.data);
        console.log(response.data.userConnected.isAdmin);
      } catch (error) {
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    fetchUser();
  }, []);
const [showModal, setShowModal] = useState<boolean>(false);

  // Fermeture de la modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Gestion de la modification des données dans la modal
  const handleEditData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Préparation des données avant l'envoi des données au Back
      const articleData = {
        article_name: detail?.article_name,
        excerpt: detail?.excerpt,
        description: detail?.description,
        price: detail?.price,
        image: detail?.image,
      };
      console.log(articleData);

      // Envoi de la requête PATCH qui mettra les données à jour
      await axios.patch(`http://localhost:3000/articles/${id}`, articleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setDetail((prevDetail) => ({
        ...prevDetail,
        ...articleData
      }));

      // Mise à jour des données
      setArticleName(articleName);
      setArticleExcerpt(articleExcerpt);
      setArticleDescription(articleDescription);
      setArticleImage(articleImage);
      setArticlePrice(articlePrice);

      // Fermeture de la modal à l'envoi de la requête
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  // Gestion de la suppression d'un article
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const navigate = useNavigate();

  const handleDeleteArticle = () => {
    setShowConfirmationModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
  
      // On envoie la requête DELETE à la base de données
      await axios.delete(`http://localhost:3000/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate('/articles');
  
    } catch (error) {
      console.error(error);
    }
  };
  

  // On gère l'ajout de l'article dans le panier
  const handleAddToCart = () => {
    dispatch({ type: 'ADD', payload: detail });
    setAddedToCart(true);
  };

  return (
    <div className="article">
      {detail && (
      <>
        <div className="article__leftSide">
          <img className="article__image" src={articleImage} alt="article" />
        </div><div className="article__rightSide">
            <h1 className="article__title">{articleName}</h1>
            <p className="article__excerpt">
              {articleExcerpt}
            </p>
            <p className="article__description">
              {articleDescription}
            </p>
            <p className="article__price">
              Prix :
              {' '}
              {articlePrice}
              €
            </p>
            <button onClick={handleAddToCart} type="button" className="article__button">
              Ajouter au panier
            </button>
            {addedToCart && <p className="article__added">Ajouté au panier</p>}
          </div>
      </>
      )}
      {isAdmin && (
        <div className="admin__buttons">
          <button className='edit__button' onClick={() => setShowModal(true)}>Modifier</button>
          <button className='delete__button' onClick={handleDeleteArticle}>Supprimer</button>
        </div>
      )}
      {/* Modal de confirmation de suppression d'un article*/}
      <Modal show={showConfirmationModal} onHide={() => setShowConfirmationModal(false)} className='modal'>
        <Modal.Header closeButton className='modal__header'>
          <Modal.Title>Confirmation de suppression</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal__body'>
          Êtes-vous sûr de vouloir supprimer cet article ?
        </Modal.Body>
        <Modal.Footer className='modal__footer'>
          <button className='modal__button' onClick={() => setShowConfirmationModal(false)}>
            Annuler
          </button>
          <button className='modal__button' onClick={handleConfirmDelete}>
            Supprimer
          </button>
        </Modal.Footer>
      </Modal>
      {/* Fin de la modal de confirmation de suppression */}
      {/* Modal de Modification d'un article */}
      <Modal show={showModal} onHide={() => setShowModal(false)} className='modal'>
        <Modal.Header className='modal__header' closeButton>
          <Modal.Title>Modifier l'article</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal__body'>
          <label>Nom</label>
          <input
            type="text"
            value={detail?.article_name || ''}
            onChange={e => setDetail(prevDetail => ({
              ...prevDetail,
              article_name: e.target.value
            }))}
            className='modal__input'
            placeholder={detail?.article_name || ''}
          />
          <label>Image (url)</label>
          <input
            type="text"
            value={detail?.image || ''}
            onChange={e => setDetail(prevDetail => ({
              ...prevDetail,
              image: e.target.value
            }))}
            className='modal__input'
            placeholder={detail?.image || ''}
          />
          <label>Extrait</label>
          <input
            type="text"
            value={detail?.excerpt || ''}
            onChange={e => setDetail(prevDetail => ({
              ...prevDetail,
              excerpt: e.target.value
            }))}
            className='modal__input'
            placeholder={detail?.excerpt || ''}
          />
          <label>Description</label>
          <input
            type="text"
            value={detail?.description || ''}
            onChange={e => setDetail(prevDetail => ({
              ...prevDetail,
              description: e.target.value
            }))}
            className='modal__input'
            placeholder={detail?.description || ''}
          />
          <label>Prix</label>
          <input
            type="number"
            value={detail?.price || 0}
            onChange={e => setDetail(prevDetail => ({
              ...prevDetail,
              price: parseFloat(e.target.value)
            }))}
            className='modal__input'
            placeholder={detail?.price?.toString() || ''}
          />
        </Modal.Body>
        <Modal.Footer className='modal__footer'>
          <button className='modal__button' onClick={() => setShowModal(false)}>
            Annuler
          </button>
          <button className='modal__button' onClick={handleEditData}>
            Enregistrer
          </button>
        </Modal.Footer>
      </Modal>
      {/* Fin de la modal de modification d'un article */}
    </div>
  );
}

export default Detail;