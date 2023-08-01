import './styles.scss';
import axios from 'axios';
import { ChangeEvent } from 'react';
import { FormEvent, useState, useEffect } from 'react';
import { User } from '../../@types/article';
import { useNavigate } from 'react-router-dom';

export interface FormValues {
  article_name: string;
  category_id: number;
  excerpt: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
}

// here we define the id of the different categories, so that once the selection is made by the admin, only the id of the category is sent to the database
const categories = [
  { id: '1', name: '1 : vêtement' },
  { id: '2', name: '2 : tasse & mug' },
  { id: '3', name: '3 : accessoire' },
  { id: '4', name: '4 : Thermos' },
];

function AddArticle() {
  const navigate = useNavigate();

  const [lastArticleId, setLastArticleId] = useState(0);
  const [article_name, setArticleName] = useState('');
  const [category_id, setCategoryId] = useState<number | ''>('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [excerpt, setExcerpt] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [messageIsHidden, setMessageIsHidden] = useState(true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const addArticleFormValues = {
      article_name,
      category_id,
      quantity,
      excerpt,
      description,
      image,
      price,
    };

    try {
      const response = await axios.post(
        'https://o-shop-back.onrender.com/articles',
        addArticleFormValues
      );
      console.log('Article successfully added', response.data);
      setMessageIsHidden(!messageIsHidden);
      const newArticle = response.data;
      // We'll be redirected to the added product page after a 2s delay.
      setTimeout(() => {
        navigate(`/articles/${newArticle.id}`);
      }, 2000);
    } catch (error) {
      console.error('Error during article adding', error);
    }

    setTimeout(() => {
      setArticleName('');
      setCategoryId('');
      setQuantity('');
      setExcerpt('');
      setDescription('');
      setImage('');
      setPrice('');
    }, 1900);
  };

  // We get the information of the connected user to check if he is admin or not
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // This function will retrieve the token locally, send a get request with the header, and update the user and admin
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://o-shop-back.onrender.com/account', {
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
    <div className="addArticle">
      {isAdmin ? (
        <>
          <h1 className="addArticle__title">Ajouter un article</h1>

          {/* This form used to add a new article to the database */}
          <form className="addArticle__form" onSubmit={handleSubmit}>
            <div className="addArticle__grid">
              <div>
                <p>Nom du produit</p>
              </div>
              <div>
                <input
                  type="text"
                  className="bigScreenSize"
                  placeholder="String"
                  value={article_name}
                  name="article_name"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setArticleName(e.target.value)
                  }
                />
                <input
                  type="text"
                  value={article_name}
                  className="smallScreenSize"
                  placeholder="Nom du produit"
                  name="article_name"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setArticleName(e.target.value)
                  }
                />
              </div>
              <div>
                <p>Catégorie (ID)</p>
              </div>
              <div>
                <label htmlFor="category-select"></label>
                <select
                  className="addArticle__category-select"
                  value={category_id}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
                >
                  <option value="">catégorie</option>
                  {categories.map((category_id) => (
                    <option key={category_id.id} value={category_id.id}>
                      {category_id.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p>Quantité</p>
              </div>
              <div>
                <input
                  type="number"
                  value={quantity}
                  className="bigScreenSize"
                  placeholder="Number"
                  name="quantity"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setQuantity(Number(e.target.value))
                  }
                />
                <input
                  type="number"
                  value={quantity}
                  className="smallScreenSize"
                  placeholder="Number"
                  name="image"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setQuantity(Number(e.target.value))
                  }
                />
              </div>
              <div>
                <p>Description rapide</p>
              </div>
              <div>
                <input
                  type="text"
                  value={excerpt}
                  className="bigScreenSize"
                  placeholder="String"
                  name="excerpt"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setExcerpt(e.target.value)
                  }
                />
                <input
                  type="text"
                  value={excerpt}
                  className="smallScreenSize"
                  placeholder="Description rapide"
                  name="excerpt"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setExcerpt(e.target.value)
                  }
                />
              </div>
              <div>
                <p>description détaillée</p>
              </div>
              <div>
                <input
                  type="text"
                  value={description}
                  className="bigScreenSize"
                  placeholder="String"
                  name="description"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDescription(e.target.value)
                  }
                />
                <input
                  type="text"
                  value={description}
                  className="smallScreenSize"
                  placeholder="Description détaillée"
                  name="description"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDescription(e.target.value)
                  }
                />
              </div>
              <div>
                <p>Image</p>
              </div>
              <div>
                <input
                  type="text"
                  value={image}
                  className="bigScreenSize"
                  placeholder="String"
                  name="image"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setImage(e.target.value)
                  }
                />
                <input
                  type="text"
                  value={image}
                  className="smallScreenSize"
                  placeholder="Image"
                  name="image"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setImage(e.target.value)
                  }
                />
              </div>

              <div>
                <p>Prix</p>
              </div>
              <div>
                <input
                  type="number"
                  value={price}
                  className="bigScreenSize"
                  placeholder="number"
                  name="price"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPrice(Number(e.target.value))
                  }
                />
                <input
                  type="number"
                  value={price}
                  className="smallScreenSize"
                  placeholder="Prix"
                  name="price"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setPrice(Number(e.target.value))
                  }
                />
              </div>
            </div>
            <input
              type="submit"
              value="Ajouter"
              className="addArticle__submitForm"
            />
          </form>
          <div
            className={`addArticle__added-message ${
              messageIsHidden ? 'addArticle__added-message--isHidden' : ''
            }`}
          >
            <p>Article ajouté avec succès</p>
          </div>
        </>
      ) : (
        // If you're not admin, you're acces will be denied
        <h2 className="message__access-denied">
          Accès non autorisé. Vous devez être administrateur pour accéder à
          cette page.
        </h2>
      )}
    </div>
  );
}

export default AddArticle;
