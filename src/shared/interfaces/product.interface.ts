export interface IProductCreate {
  image: string | ArrayBuffer | null;
  title: string;
  description: string;
  price: string;
  category: string;
  company: string;
  quantity: number | null;
}

export interface IProductResponse {
  image: string;
  title: string;
  description: string;
  price: string;
  category: string;
  company: string;
  quantity: number | null;
  updatedAt: string;
  createdAt: string;
}
