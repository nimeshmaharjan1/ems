import { SELECTED_WHOLESALE_OPTION } from '@prisma/client';
import { create } from 'zustand';

export type ShopBySearchParams = {
  keyword?: string;
  category?: string;
  company?: string;
  priceLt?: string;
  priceGt?: string;
  title?: string;
  wholesaleOption?: SELECTED_WHOLESALE_OPTION;
};

type Store = {
  shopBySearchParams: ShopBySearchParams;
  setShopBySearchParams: (params: ShopBySearchParams) => void;
  handleShopBySearchParamsUpdate: (name: keyof ShopBySearchParams, value: string) => void;
};

export const useShopByStore = create<Store>((set) => ({
  shopBySearchParams: {
    category: '',
    company: '',
    priceLt: '',
    priceGt: '',
    wholesaleOption: SELECTED_WHOLESALE_OPTION.CASH,
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
