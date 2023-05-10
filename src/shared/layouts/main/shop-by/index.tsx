import { getCategories } from '@/features/admin/services/categories/categories.service';
import { getCompanies } from '@/features/admin/services/companies/companies.service';
import { ICategoryResponse } from '@/shared/interfaces/category.interface';
import { ICompanyResponse } from '@/shared/interfaces/company.interface';
import React, { useState } from 'react';
import { useQuery } from 'react-query';

const ShopByAside = () => {
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
  console.log({ companies, categories });
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  return (
    <>
      <header className="mb-6 text-2xl font-bold md:font-medium  md:text-xl uppercase border-b relative mt-1 pb-[0.65rem] box-border">
        Shop By
      </header>
      <div className="border-2 p-6">
        <section className="brand-section mb-6 pb-2 border-b border-gray-300">
          <h3 className="uppercase">Company</h3>
          {isCompaniesError ? (
            <h4 className="text-error my-2">Something went wrong while trying to get the companies.</h4>
          ) : isCompaniesLoading ? (
            <div className="h-60  flex items-center justify-center">
              <button className="btn btn-ghost loading btn-xl"></button>
            </div>
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
                        onChange={() => setSelectedCompany(company.name)}
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
          <h3 className="uppercase mb-1">Category</h3>
          {isCategoriesError ? (
            <h4 className="text-error my-2">Something went wrong while trying to get the categories.</h4>
          ) : isCategoriesLoading ? (
            <div className="h-60  flex items-center justify-center">
              <button className="btn btn-ghost loading btn-xl"></button>
            </div>
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
                        onChange={() => setSelectedCategory(category.name)}
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
        <section className="price-section mb-5">
          <h3 className="uppercase">Price</h3>
          <div className="range-wrapper mt-4">
            <input type="range" min="0" max="100" className="range range-sm range-primary" />
          </div>
        </section>
      </div>
    </>
  );
};

export default ShopByAside;
