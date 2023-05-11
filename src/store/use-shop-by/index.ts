import { create } from 'zustand';

export type ShopBySearchParams = {
  keyword?: string;
  category?: string;
  company?: string;
  priceLt?: string;
  priceGt?: string;
  title?: string;
};

type Store = {
  shopBySearchParams: ShopBySearchParams;
  setShopBySearchParams: (params: ShopBySearchParams) => void;
  handleShopBySearchParamsUpdate: (name: keyof ShopBySearchParams, value: string) => void;
};

export const useShopByStore = create<Store>((set) => ({
  shopBySearchParams: {
    title: '',
    category: '',
    company: '',
    priceLt: '',
    priceGt: '',
  },
  setShopBySearchParams: (params: ShopBySearchParams) => set({ shopBySearchParams: params }),
  handleShopBySearchParamsUpdate: (name, value) => {
    set((prevState) => ({
      shopBySearchParams: {
        ...prevState.shopBySearchParams,
        [name]: value,
      },
    }));
  },
}));
