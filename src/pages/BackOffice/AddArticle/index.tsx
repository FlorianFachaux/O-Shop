import axios from 'axios';
import { ChangeEvent } from 'react';
import { FormEvent, useState } from 'react';
import '../styles.scss';
import axiosInstance from '../../../utils/axios';

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

function backoffice() {

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

    const backofficeFormValues = {
      article_name,
      category_id,
      quantity,
      excerpt,
      description,
      image,
      price,
    };

    try {
      const response = await axiosInstance.post(
        '/articles',
        backofficeFormValues
      );
      console.log('Article successfully added', response.data);
      setMessageIsHidden(!messageIsHidden);
      const newArticle = response.data;

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

  return (
    <main className="add">
      <p className="backoffice__title">Ajouter un article</p>

      {/* This form used to add a new article to the database */}
      <form className="backoffice__form" onSubmit={handleSubmit}>
          <p>Nom du produit</p>
          <input
            type="text"
            className="backoffice__form-input"
            placeholder="String"
            value={article_name}
            name="article_name"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setArticleName(e.target.value)
            }
          />
          <p>Catégorie (ID)</p>
          <label htmlFor="category-select"></label>
          <select
            className="backoffice__category-select"
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

          <p>Quantité</p>

          <input
            type="number"
            value={quantity}
            className="backoffice__form-input"
            placeholder="Number"
            name="quantity"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setQuantity(Number(e.target.value))
            }
          />
          <p>Description rapide</p>
          <input
            type="text"
            value={excerpt}
            className="backoffice__form-input"
            placeholder="String"
            name="excerpt"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setExcerpt(e.target.value)
            }
          />
          <p>description détaillée</p>
          <input
            type="text"
            value={description}
            className="backoffice__form-input"
            placeholder="String"
            name="description"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setDescription(e.target.value)
            }
          />
          <p>Image</p>
          <input
            type="text"
            value={image}
            className="backoffice__form-input"
            placeholder="String"
            name="image"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setImage(e.target.value)
            }
          />
          <p>Prix</p>
          <input
            type="number"
            value={price}
            className="backoffice__form-input"
            placeholder="number"
            name="price"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPrice(Number(e.target.value))
            }
          />
          <input
            type="submit"
            value="Ajouter"
            className="backoffice__submitForm"
          />
      </form>
    </main>
  );
}

export default backoffice;