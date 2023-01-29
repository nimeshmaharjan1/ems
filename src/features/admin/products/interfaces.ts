export enum PRODUCT_CATEGORY {
  LAPTOP,
  MOBILE,
  TABLET,
}
export interface IProductCreate {
  image: string | ArrayBuffer | null;
  title: string;
  description: string;
  price: string;
  category: PRODUCT_CATEGORY;
  company: string;
}
