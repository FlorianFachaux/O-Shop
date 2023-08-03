import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { Modal } from 'react-bootstrap';
import './styles.scss'

// Définition du type de données pour un article
interface Article {
  id: number;
  article_name: string;
  category_id: number;
  quantity: number;
  excerpt: string;
  description: string;
  image: string;
  price: number;
}

// Ici, on définit le type des valeurs du formulaire
interface FormValues {
  article_name: string;
  category_id: number;
  quantity: number;
  excerpt: string;
  description: string;
  image: string;
  price: number;
}

const categories = [
  { id: 1, name: '1 : vêtement' },
  { id: 2, name: '2 : tasse & mug' },
  { id: 3, name: '3 : accessoire' },
  { id: 4, name: '4 : Thermos' },
];

function BackOfficePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [formValues, setFormValues] = useState<FormValues>({
    article_name: "",
    category_id: 0,
    quantity: 0,
    excerpt: "",
    description: "",
    image: "",
    price: 0,
  });
  const [messageIsHidden, setMessageIsHidden] = useState(true);

  useEffect(() => {
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
        console.error('Erreur lors de la récupération des données utilisateur:', error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/articles');
        setArticles(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchArticles();
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:3000/articles', formValues);
      console.log('Article successfully added', response.data);
      setMessageIsHidden(!messageIsHidden);
      const newArticle = response.data;
      setTimeout(() => {
        navigate(`/articles/${newArticle.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error during article adding', error);
    }
  };

  const [showModal, setShowModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<Article | undefined>();
  const [selectedArticleId, setSelectedArticleId] = useState<number | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const articleResponse = await axios.get(`http://localhost:3000/articles/${id}`);
        setDetail(articleResponse.data);
        setFormValues({
          article_name: articleResponse.data.article_name,
          category_id: articleResponse.data.category_id,
          quantity: articleResponse.data.quantity,
          excerpt: articleResponse.data.excerpt,
          description: articleResponse.data.description,
          image: articleResponse.data.image,
          price: articleResponse.data.price.toString(),
        });
      } catch (err) {
        console.log(err);
      }
    };
    fetchArticle();
  }, [id]);

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditData = async () => {
    try {
      const token = localStorage.getItem('token');

      // Vérifier si un article est sélectionné pour la modification
      if (selectedArticleId === null) {
        return;
      }

      // Préparation des données avant l'envoi des données au Back
      const articleData = {
        article_name: formValues.article_name,
        excerpt: formValues.excerpt,
        description: formValues.description,
        price: parseFloat(formValues.price.toString()),
        image: formValues.image,
      };

      // Envoi de la requête PATCH qui mettra les données à jour
      await axios.patch(`http://localhost:3000/articles/${selectedArticleId}`, articleData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Fermeture de la modal à l'envoi de la requête
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
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

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigate('/articles');
      setShowConfirmationModal(false); // Fermer la modal de confirmation après la suppression
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="backoffice">
      {isAdmin ? (
        <>
          <section className="backoffice__add">
            <div className="backoffice__title">Ajouter un article</div>
            <form className="backoffice__form" onSubmit={handleSubmit}>
              <div className="backoffice__grid">
                <div className="backoffice__form-part">
                  <p>Nom de l'article</p>
                  <input
                    type="text"
                    className="backoffice__form-input"
                    placeholder="String"
                    value={formValues.article_name}
                    name="article_name"
                    onChange={handleChange}
                  />
                </div>
                <div className="backoffice__form-part">
                  <label htmlFor="category-select">Catégorie</label>
                  <select
                    id="category-select"
                    className="backoffice__category-select"
                    value={formValues.category_id}
                    name="category_id"
                    onChange={handleChange}
                  >
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="backoffice__form-part">
                  <p>Quantité</p>
                  <input
                    type="number"
                    value={formValues.quantity}
                    className="backoffice__form-input"
                    placeholder="Number"
                    name="quantity"
                    onChange={handleChange}
                  />
                </div>
                <div className="backoffice__form-part">
                  <p>Description rapide</p>
                  <input
                    type="text"
                    value={formValues.excerpt}
                    className="backoffice__form-input"
                    placeholder="String"
                    name="excerpt"
                    onChange={handleChange}
                  />
                </div>
                <div className="backoffice__form-part">
                  <p>description détaillée</p>
                  <input
                    type="text"
                    value={formValues.description}
                    className="backoffice__form-input"
                    placeholder="String"
                    name="description"
                    onChange={handleChange}
                  />
                </div>
                <div className="backoffice__form-part">
                  <p>Image</p>
                
                  <input
                    type="text"
                    value={formValues.image}
                    className="backoffice__form-input"
                    placeholder="String"
                    name="image"
                    onChange={handleChange}
                  />
                </div>
                <div className="backoffice__form-part">
                  <p>Prix</p>
                  <input
                    type="number"
                    value={formValues.price}
                    className="backoffice__form-input"
                    placeholder="number"
                    name="price"
                    onChange={handleChange}
                  />
                </div>
              </div>
              <input type="submit" value="Ajouter" className="backoffice__submitForm" />
            </form>
          </section>
          <div className="backoffice__actions">
            <div className="backoffice__title">Modifier ou Supprimer un article</div>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom du produit</th>
                  <th>Modifier</th>
                  <th>Supprimer</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id}>
                    <td>{article.id}</td>
                    <td>{article.article_name}</td>
                    <td>
                      <button
                        className='edit__button'
                        onClick={() => {
                          setShowModal(true);
                          setSelectedArticleId(article.id); // Définir l'id de l'article sélectionné
                        }}
                      >
                        Modifier
                      </button>
                    </td>
                    <td>
                      <button
                        className='delete__button'
                        onClick={() => {
                          handleDeleteArticle(article.id); // Passer l'id de l'article à la fonction de suppression
                        }}
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
          <Modal show={showModal} onHide={() => setShowModal(false)} className='modal'>
            <Modal.Header className='modal__header' closeButton>
              <Modal.Title>Modifier l'article</Modal.Title>
            </Modal.Header>
            <Modal.Body className='modal__body'>
              <label>Nom</label>
              <input
                type="text"
                value={formValues.article_name}
                onChange={handleChange}
                placeholder={detail?.article_name || ''}
                className='modal__input'
                name="article_name"
              />
              <label>Image (url)</label>
              <input
                type="text"
                value={formValues.image}
                onChange={handleChange}
                placeholder={detail?.image || ''}
                className='modal__input'
                name="image"
              />
              <label>Extrait</label>
              <input
                type="text"
                value={formValues.excerpt}
                onChange={handleChange}
                placeholder={detail?.excerpt || ''}
                className='modal__input'
                name="excerpt"
              />
              <label>Description</label>
              <input
                type="text"
                value={formValues.description}
                onChange={handleChange}
                placeholder={detail?.description || ''}
                className='modal__input'
                name="description"
              />
              <label>Prix</label>
              <input
                type="number"
                value={formValues.price}
                onChange={handleChange}
                placeholder={detail?.price.toString() || ''}
                className='modal__input'
                name="price"
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
        </>
      ) : (
        <h2 className="message__access-denied">
          Accès non autorisé. Vous devez être administrateur pour accéder à cette page.
        </h2>
      )}
    </div>
  );
}

export default BackOfficePage;