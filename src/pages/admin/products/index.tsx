import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { BsTrash } from 'react-icons/bs';
import { FaCogs } from 'react-icons/fa';

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async () => {
  let products;
  try {
    products = await prisma.product.findMany();
  } catch (error) {
    console.error(error);
  }
  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
    },
  };
};

const Products: NextPageWithLayout<{ products: any }> = ({ products }) => {
  const router = useRouter();
  return (
    <div>
      <div className="flex items-center justify-between  mb-6">
        <h2 className="font-semibold text-2xl">Products</h2>
        <button
          className="btn btn-sm btn-secondary"
          onClick={() => {
            router.push('/admin/products/create');
          }}
        >
          Create
        </button>
      </div>
      <div className="overflow-x-scroll">
        <table className="table table-auto w-full">
          <thead>
            <tr>
              <th className="border !border-base-300">Title</th>
              <th className="border !border-base-300">Category</th>
              <th className="border !border-base-300">Quantity</th>
              <th className="border !border-base-300">Price</th>
              <th className="border !border-base-300 w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {products.map((product: any) => {
                return (
                  <>
                    <th className="border !border-base-300">{product.title}</th>
                    <td className="border !border-base-300">{product.category}</td>
                    <td className="border !border-base-300">{product.quantity}</td>
                    <td className="border !border-base-300">{product.price}</td>
                    <td className="border !border-base-300 flex gap-2 w-48 justify-between">
                      <button className="btn btn-info btn-sm !normal-case gap-1">
                        <FaCogs></FaCogs> Edit
                      </button>
                      <button className="btn btn-error btn-sm !normal-case gap-1">
                        <BsTrash></BsTrash> Delete
                      </button>
                    </td>
                  </>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
Products.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
export default Products;
