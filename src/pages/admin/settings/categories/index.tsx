import { Category } from '@prisma/client';
import axios from 'axios';
import React from 'react';
import { useQuery } from 'react-query';

const SettingCategory = () => {
  const { data: categories } = useQuery<{ id: string; name: string; products: Array<any>; companies: Array<any> }[], Error>(
    'fetchCategories',
    async () => {
      const response = await axios.get('/api/admin/categories');
      return response.data?.categories;
    }
  );
  console.log(categories);
  return (
    <div className="grid grid-cols-6 gap-6">
      <section className="overflow-x-auto col-span-6 lg:col-span-4 shadow">
        <table className="table w-full shadow">
          <thead>
            <tr className="bg-base-100">
              <th>SN</th>
              <th>Name</th>
              <th>Companies</th>
              <th>Products</th>
            </tr>
          </thead>
          <tbody>
            {categories?.map((category, categoryIndex) => {
              return (
                <tr key={category.id}>
                  <td>{categoryIndex + 1}</td>
                  <td>{category.name}</td>

                  <td>{category.companies?.length ? category.name : '-'}</td>
                  <td>{category.companies?.length ? category.name : '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
      <section className="col-span-6 lg:col-span-2">
        <div className="card bg-base-100 shadow">
          <div className="card-body">
            <div className="card-title">Hello</div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SettingCategory;
