import './styles.scss';
import { ICategory } from '../../@types/article';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function Categories() {
  const [categoriesData, setCategories] = useState<ICategory[]>([]);

  // here we want to retrieve the list of all categories in the database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/categories`);
        setCategories(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <div className="categories">
      <div className="categories__container">
        <h1 className="categories__title">Catégories</h1>
        <div className="categories__card--wrap ">
          {/* We map to reach each category informations and display them*/}
          {categoriesData.map((category) => (
            <Link
              to={`/articles/category/${category.slug}`}
              className="categories__card"
              key={category.id}
            >
              <div className="categories__card--elem">
                <div className="categories__card--title">
                  <h3>{category.label}</h3>
                </div>
                <div className="categories__card--description">
                  <p>{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Categories;
