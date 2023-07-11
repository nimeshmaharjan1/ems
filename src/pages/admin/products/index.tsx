import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import Pagination from '@/shared/components/pagination';
import { PaginatedProductsResponse } from '@/shared/interfaces/product.interface';
import { formatDateWithTime, formatPrice, getDateWithWeekDay } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import { Settings, Trash } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { FaCogs } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from 'react-query';

const Products: NextPageWithLayout = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const {
    data: productData,
    isError,
    isLoading,
  } = useQuery<PaginatedProductsResponse, Error>(['fetchProducts', currentPage, limit], async () => {
    const response = await axios.get(`/api/products?page=${currentPage}&limit=${limit}`);
    return response.data;
  });
  const totalPages = productData?.totalPages;
  const [isMounted, setIsMounted] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: mutateDeleteProduct, isLoading: isProductDeleting } = useMutation(
    async (args: { productId: string }) => {
      const response = await axios.delete(`/api/admin/products/${args.productId}`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        showToast(Toast.success, data?.message);
        queryClient.invalidateQueries({ queryKey: ['fetchProducts'] });
      },
      onError: (error: any) => {
        showToast(Toast.error, error?.response?.data?.message);
      },
    }
  );
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;
  return (
    <>
      <div className="flex items-center justify-end mb-6">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            router.push('/admin/products/create');
          }}>
          Add Product
        </button>
      </div>
      <section className="overflow-x-auto">
        {isError ? (
          <h2 className="p-2 font-medium text-error">Something went wrong while trying to fetch the products.</h2>
        ) : isLoading ? (
          <table className="flex items-center justify-center h-96">
            <button className="btn btn-ghost disabled">
              <span className="loading loading-spinner"></span>
            </button>
          </table>
        ) : productData?.products.length === 0 ? (
          <h2 className="p-2 font-medium text-warning">No products have been added.</h2>
        ) : (
          <table className="table w-full overflow-auto">
            <thead>
              <tr className="bg-base-200">
                <th>#</th>
                <th>Title</th>
                <th>Model</th>
                <th>Price</th>
                <th>Inventory</th>
                <th>Status</th>
                <th>Created On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {productData?.products.map((product, index) => {
                return (
                  <tr key={product.id}>
                    <td>{`${index + 1}`}</td>
                    <td className="flex items-center gap-x-3">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <Image className="rounded-lg" src={product.images[0]} width={50} height={50} alt={product.slug}></Image>
                      </Link>
                      <Link href={`/admin/products/edit/${product.id}`}>
                        {`${product.title.substring(0, 60)}${product.title.length > 60 ? '...' : ''}`}
                      </Link>
                    </td>
                    <td>{`${product.modal.substring(0, 60)}${product.modal.length > 60 ? '...' : ''}`}</td>
                    <td>रू {formatPrice(product.price)}</td>
                    <td className="text-center">
                      <span className="px-2 py-1 text-xs font-medium text-white rounded-md bg-gradient-to-r from-cyan-400 to-blue-400">
                        {product.quantity}
                      </span>
                    </td>
                    <td>
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-md ring-1 ring-inset ring-green-600/20">
                        {product.status}
                      </span>
                    </td>
                    <td>{formatDateWithTime(product.createdAt)}</td>
                    <td className="text-center ">
                      <div className="flex">
                        {/* <Link href={`/admin/products/edit/${product.id}`} className="gap-1 btn btn-primary btn-xs btn-outline">
                          <FiSettings></FiSettings>
                        </Link> */}
                        <button
                          className="gap-1 ml-2 btn group btn-error btn-xs btn-outline"
                          disabled={isProductDeleting}
                          onClick={() => {
                            mutateDeleteProduct({ productId: product.id });
                          }}>
                          {isProductDeleting ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <Trash className="group-hover:text-white" size={14}></Trash>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
      <div className="flex justify-end mt-8 place-self-end">
        {totalPages !== undefined && <Pagination {...{ currentPage, setCurrentPage, totalPages }}></Pagination>}
      </div>
    </>
  );
};
Products.getLayout = (page: ReactNode) => {
  return <AdminDashboardLayout>{page}</AdminDashboardLayout>;
};
export default Products;
