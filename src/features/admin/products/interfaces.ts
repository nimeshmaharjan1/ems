export enum PRODUCT_CATEGORY {
  LAPTOP = 'laptop',
  MOBILE = 'mobile',
  TABLET = 'tablet',
}
export interface IProductCreate {
  image: string | ArrayBuffer | null;
  title: string;
  description: string;
  price: string;
  category: PRODUCT_CATEGORY;
  company: string;
  quantity: number | null;
}
