interface IArticle {
  article_name?: string;
  excerpt?: string;
  image?: string;
  description?: string;
  price?: number | undefined;
  id?: number;
  category?: string;
  quantity?: number;
}

export interface ICategory {
  id: number,
  slug: string,
  label: string,
  description: string,
}

export interface User{
  firstname?: string;
  lastname?: string;
  email?: string;
  address?: string;
  phone?: string;
  role?: string;
  promo?: string;
  isAdmin?: boolean;
}
