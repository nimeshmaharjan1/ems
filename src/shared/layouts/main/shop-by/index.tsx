import { getCategories } from '@/features/admin/services/categories/categories.service';
import { getCompanies } from '@/features/admin/services/companies/companies.service';
import { ICategoryResponse } from '@/shared/interfaces/category.interface';
import { ICompanyResponse } from '@/shared/interfaces/company.interface';
import { showToast, Toast } from '@/shared/utils/toast.util';
import { ShopBySearchParams, useShopByStore } from '@/store/use-shop-by';
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
      <div className="border-2 p-6">
        <section className="brand-section mb-6 border-b border-gray-300 pb-4">
          <h3 className="uppercase mb-2">Company</h3>
          {isCompaniesError ? (
            <h4 className="text-error my-2">Something went wrong while trying to get the companies.</h4>
          ) : isCompaniesLoading ? (
            <div className="h-60  flex items-center justify-center">
              <button className="btn btn-ghost  btn-xl">
                <span className="loading loading-spinner"></span>
              </button>
            </div>
          ) : companies?.data.length === 0 ? (
            <span className="text-warning">No companies available at this moment.</span>
          ) : (
            <>
              {companies &&
                companies.data.map((company) => (
                  <div className="form-control my-1" key={company.id}>
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

        <section className="type-section mb-6 border-b border-gray-300 pb-4">
          <h3 className="uppercase mb-2">Category</h3>
          {isCategoriesError ? (
            <h4 className="text-error my-2">Something went wrong while trying to get the categories.</h4>
          ) : isCategoriesLoading ? (
            <div className="h-60  flex items-center justify-center">
              <button className="btn btn-ghost  btn-xl">
                <span className="loading loading-spinner"></span>
              </button>
            </div>
          ) : categories?.data.length === 0 ? (
            <span className="text-warning">No categories available at this moment.</span>
          ) : (
            <>
              {categories &&
                categories.data.map((category) => (
                  <div className="form-control my-1" key={category.id}>
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
        <h3 className="uppercase mb-4">Price</h3>

        <div className="price-range-slider mb-4">
          <div className="price-input flex-col flex gap-4 mb-8">
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
        <div className="clear-all-filters btn btn-primary btn-sm self-end" onClick={clearAllFilters}>
          Clear All
        </div>
      </div>
    </>
  );
};

export default ShopByAside;
