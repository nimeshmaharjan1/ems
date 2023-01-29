import MainLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import React, { ReactNode } from 'react';
import { BsTrash } from 'react-icons/bs';
import { FaCogs } from 'react-icons/fa';

const Products: NextPageWithLayout = () => {
  return (
    <div>
      <h2 className="font-semibold text-2xl mb-6">Products</h2>
      <div className="overflow-x-scroll">
        <table className="table table-auto w-full">
          <thead>
            <tr>
              <th className="border !border-base-300">S.N.</th>
              <th className="border !border-base-300">Name</th>
              <th className="border !border-base-300">Job</th>
              <th className="border !border-base-300 w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th className="border !border-base-300">1</th>
              <td className="border !border-base-300">Cy Ganderton</td>
              <td className="border !border-base-300">Quality Control Specialist</td>
              <td className="border !border-base-300 flex gap-2 w-48 justify-between">
                <button className="btn btn-info btn-sm !normal-case gap-1">
                  <FaCogs></FaCogs> Edit
                </button>
                <button className="btn btn-error btn-sm !normal-case gap-1">
                  <BsTrash></BsTrash> Delete
                </button>
              </td>
            </tr>
            <tr>
              <th className="border !border-base-300">2</th>
              <td className="border !border-base-300">Hart Hagerty</td>
              <td className="border !border-base-300">Desktop Support Technician</td>
              <td className="border !border-base-300">Purple</td>
            </tr>
            <tr>
              <th className="border !border-base-300">3</th>
              <td className="border !border-base-300">Brice Swyre</td>
              <td className="border !border-base-300">Tax Accountant</td>
              <td className="border !border-base-300">Red</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
Products.getLayout = (page: ReactNode) => {
  return <MainLayout>{page}</MainLayout>;
};
export default Products;
