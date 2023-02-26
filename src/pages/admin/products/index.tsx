import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import { IProductResponse } from '@/shared/interfaces/product.interface';
import { formatPrice, getDateWithWeekDay } from '@/shared/utils/helper.util';
import { PrismaClient, Product } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import { BsTrash } from 'react-icons/bs';
import { FaCogs } from 'react-icons/fa';

const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        company: true,
      },
    });
    return {
      props: {
        products: JSON.parse(JSON.stringify(products)),
      },
    };
  } catch (error) {
    console.error(error);
  }
  return {
    props: {
      products: null,
    },
  };
};

const Products: NextPageWithLayout<{ products: IProductResponse[] }> = ({ products }) => {
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
      <section className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th className="border !border-base-300">Title</th>
              <th className="border !border-base-300">Category</th>
              <th className="border !border-base-300">Company</th>
              <th className="border !border-base-300">Quantity</th>
              <th className="border !border-base-300">Price</th>
              <th className="border !border-base-300">Created On</th>
              <th className="border !border-base-300 w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr key={product.id}>
                  <td className="border !border-base-300">
                    {`${product.title.substring(0, 40)}${product.title.length > 40 ? '...' : ''}`}
                  </td>
                  <td className="border !border-base-300">{product.category?.name}</td>
                  <td className="border !border-base-300">{product.company?.name}</td>
                  <td className="border !border-base-300">{product.quantity}</td>
                  <td className="border !border-base-300">&#8377; {formatPrice(product.price)}</td>
                  <td className="border !border-base-300">{getDateWithWeekDay(product.createdAt)}</td>
                  <td className="border !border-base-300 flex gap-2 w-48 justify-between">
                    <Link href={`/admin/products/edit/${product.id}`} className="btn btn-info btn-sm !normal-case gap-1">
                      <FaCogs></FaCogs> Edit
                    </Link>
                    <button className="btn btn-error btn-sm !normal-case gap-1">
                      <BsTrash></BsTrash> Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
};
Products.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
export default Products;
