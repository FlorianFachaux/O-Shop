import { Link } from 'react-router-dom';
import { ICategory } from '../../../@types/article';
import { useState } from 'react';

interface CategoryProps {
  category: ICategory
}

function Category({ category }: CategoryProps) {
  const [categoryData, setCategoryData] = useState<ICategory>();

  return (
    <div className="categories__card">
      <Link to={`/articles/category/${category.slug}`}>
        <div className="categories__card--title">
          <h3>{categoryData?.label}</h3>
        </div>
        <div className="categories__card--description">
          <p>
            {categoryData?.description}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default Category;
