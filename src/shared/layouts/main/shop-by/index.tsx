import { getCategories } from '@/features/admin/services/categories/categories.service';
import { getCompanies } from '@/features/admin/services/companies/companies.service';
import { ICategoryResponse } from '@/shared/interfaces/category.interface';
import { ICompanyResponse } from '@/shared/interfaces/company.interface';
import { showToast, Toast } from '@/shared/utils/toast.util';
import { ShopBySearchParams, useShopByStore } from '@/store/use-shop-by';
import { SELECTED_WHOLESALE_OPTION } from '@prisma/client';
import React, { useState } from 'react';
import { useQuery } from 'react-query';
const ShopByAside = () => {
  const { handleShopBySearchParamsUpdate, shopBySearchParams, setShopBySearchParams } = useShopByStore();
  const {
    data: companies,
    isLoading: isCompaniesLoading,
    isError: isCompaniesError,
  } = useQuery<ICompanyResponse, Error>('getCompanies', async () => {
    const response = await getCompanies({ limit: 50, page: 1 });
    return response;
  });
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    isError: isCategoriesError,
  } = useQuery<ICategoryResponse, Error>('getCategories', async () => {
    const response = await getCategories({ limit: 50, page: 1 });
    return response;
  });

  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedWholesaleOption, setSelectedWholesaleOption] = useState<SELECTED_WHOLESALE_OPTION>(SELECTED_WHOLESALE_OPTION.CASH);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>, name: keyof ShopBySearchParams) => {
    const value = e.target.value as string;
    switch (name) {
      case 'category':
        setSelectedCategory(e.target.value);
        handleShopBySearchParamsUpdate(name, value);
        break;
      case 'company':
        setSelectedCompany(e.target.value);
        handleShopBySearchParamsUpdate(name, value);
        break;
      case 'wholesaleOption':
        setSelectedWholesaleOption(e.target.value as SELECTED_WHOLESALE_OPTION);
        handleShopBySearchParamsUpdate(name, value);
      case 'priceGt':
        if (Number(e.target.value) > Number(maxPrice)) {
          setMinPrice('0');
          handleShopBySearchParamsUpdate(name, '0');
          return showToast(Toast.error, 'Min value cannot be greater than the max value.');
        }
        setMinPrice(e.target.value);
        handleShopBySearchParamsUpdate(name, value);
        break;
      case 'priceLt':
        if (Number(e.target.value) < Number(minPrice)) {
          setMaxPrice('1000000');
          handleShopBySearchParamsUpdate(name, '1000000');
          return showToast(Toast.error, 'Max value cannot be lower than the min value.');
        }
        setMaxPrice(e.target.value);
        handleShopBySearchParamsUpdate(name, value);
        break;
    }
  };

  const clearAllFilters = () => {
    setSelectedCompany('');
    setSelectedCategory('');
    setMinPrice('');
    setMaxPrice('');
    setShopBySearchParams({ title: '', category: '', company: '', priceLt: '', priceGt: '' });
  };

  return (
    <>
      <header className="mb-6 text-2xl font-bold md:font-medium  md:text-xl uppercase border-b relative mt-1 pb-[0.65rem] box-border">
        Shop By
      </header>
      <div className="p-6 border-2">
        <div className="pb-4 mb-6 border-b border-gray-300 wholesale-option-section">
          <h3 className="mb-2 uppercase">Wholesale option</h3>
          <section className="flex gap-3">
            <label className="label !justify-start gap-2 cursor-pointer">
              <input
                type="radio"
                value={SELECTED_WHOLESALE_OPTION.CASH}
                checked={selectedWholesaleOption === SELECTED_WHOLESALE_OPTION.CASH}
                onChange={(e) => handleSearchChange(e, 'wholesaleOption')}
                className="radio radio-sm"
                name={'wholesale-sorting-checkbox'}
              />
              <span className="label-text">{SELECTED_WHOLESALE_OPTION.CASH}</span>
            </label>
            <label className="label !justify-start gap-2 cursor-pointer">
              <input
                type="radio"
                value={SELECTED_WHOLESALE_OPTION.CREDIT}
                checked={selectedWholesaleOption === SELECTED_WHOLESALE_OPTION.CREDIT}
                onChange={(e) => handleSearchChange(e, 'wholesaleOption')}
                className="radio radio-sm"
                name={'wholesale-sorting-checkbox'}
              />
              <span className="label-text">{SELECTED_WHOLESALE_OPTION.CREDIT}</span>
            </label>
          </section>
        </div>
        <section className="pb-4 mb-6 border-b border-gray-300 brand-section">
          <h3 className="mb-2 uppercase">Company</h3>
          {isCompaniesError ? (
            <h4 className="my-2 text-error">Something went wrong while trying to get the companies.</h4>
          ) : isCompaniesLoading ? (
            <div className="flex items-center justify-center h-60">
              <button className="btn btn-ghost btn-xl">
                <span className="loading loading-spinner"></span>
              </button>
            </div>
          ) : companies?.data.length === 0 ? (
            <span className="text-warning">No companies available at this moment.</span>
          ) : (
            <>
              {companies &&
                companies.data.map((company) => (
                  <div className="my-1 form-control" key={company.id}>
                    <label className="label !justify-start gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={company.name === selectedCompany}
                        value={company.name}
                        onChange={(e) => handleSearchChange(e, 'company')}
                        className="radio radio-sm"
                        name={'company-sorting-checkbox'}
                      />
                      <span className="label-text">{company.name}</span>
                    </label>
                  </div>
                ))}
            </>
          )}
        </section>

        <section className="pb-4 mb-6 border-b border-gray-300 type-section">
          <h3 className="mb-2 uppercase">Category</h3>
          {isCategoriesError ? (
            <h4 className="my-2 text-error">Something went wrong while trying to get the categories.</h4>
          ) : isCategoriesLoading ? (
            <div className="flex items-center justify-center h-60">
              <button className="btn btn-ghost btn-xl">
                <span className="loading loading-spinner"></span>
              </button>
            </div>
          ) : categories?.data.length === 0 ? (
            <span className="text-warning">No categories available at this moment.</span>
          ) : (
            <>
              {categories &&
                categories.data.map((category) => (
                  <div className="my-1 form-control" key={category.id}>
                    <label className="label !justify-start gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={category.name === selectedCategory}
                        value={category.name}
                        onChange={(e) => handleSearchChange(e, 'category')}
                        className="radio radio-sm"
                        name={'category-sorting-checkbox'}
                      />
                      <span className="label-text">{category.name}</span>
                    </label>
                  </div>
                ))}
            </>
          )}
        </section>
        <h3 className="mb-4 uppercase">Price</h3>

        <div className="mb-4 price-range-slider">
          <div className="flex flex-col gap-4 mb-8 price-input">
            <div className="form-control">
              <label className="input-group input-group-xs xl:input-group-sm">
                <span className="w-16">Min</span>
                <input
                  onChange={(e) => handleSearchChange(e, 'priceGt')}
                  value={minPrice}
                  type="text"
                  placeholder="Enter minimum price..."
                  className="input input-bordered input-xs xl:input-sm"
                />
                {/* <span>रू </span> */}
              </label>
            </div>
            <div className="form-control">
              <label className="input-group input-group-xs xl:input-group-sm">
                <span className="w-16">Max</span>
                <input
                  onChange={(e) => handleSearchChange(e, 'priceLt')}
                  value={maxPrice}
                  type="text"
                  placeholder="Enter maximum price..."
                  className="input input-bordered input-xs xl:input-sm"
                />
              </label>
            </div>
          </div>
        </div>
        <div className="self-end clear-all-filters btn btn-primary btn-sm" onClick={clearAllFilters}>
          Clear All
        </div>
      </div>
    </>
  );
};

export default ShopByAside;
