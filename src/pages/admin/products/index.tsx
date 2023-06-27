import AdminDashboardLayout from '@/features/admin/layouts/main';
import { NextPageWithLayout } from '@/pages/_app';
import Pagination from '@/shared/components/pagination';
import { PaginatedProductsResponse } from '@/shared/interfaces/product.interface';
import { formatPrice, getDateWithWeekDay } from '@/shared/utils/helper.util';
import { Toast, showToast } from '@/shared/utils/toast.util';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { BsTrash } from 'react-icons/bs';
import { FaCogs } from 'react-icons/fa';
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
  productData;
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
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Products</h2>
        <button
          className="btn btn-sm btn-primary"
          onClick={() => {
            router.push('/admin/products/create');
          }}>
          Create
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
              <tr>
                <th className="border !border-base-300">Title</th>
                <th className="border !border-base-300">Modal</th>
                <th className="border !border-base-300">Category</th>
                <th className="border !border-base-300">Company</th>
                <th className="border !border-base-300">Quantity</th>
                <th className="border !border-base-300">Price</th>
                <th className="border !border-base-300">Discount</th>
                <th className="border !border-base-300">Discounted Price</th>
                <th className="border !border-base-300">Created On</th>
                <th className="border !border-base-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productData?.products.map((product) => {
                return (
                  <tr key={product.id}>
                    <td className="border !border-base-300">
                      {`${product.title.substring(0, 60)}${product.title.length > 60 ? '...' : ''}`}
                    </td>
                    <td className="border !border-base-300">
                      {`${product.modal.substring(0, 60)}${product.modal.length > 60 ? '...' : ''}`}
                    </td>
                    <td className="border !border-base-300">{product.category?.name}</td>
                    <td className="border !border-base-300">{product.company?.name}</td>
                    <td className="border !border-base-300">{product.quantity}</td>
                    <td className="border !border-base-300">रू {formatPrice(product.price)}</td>
                    <td className="border !border-base-300">{product.hasOffer ? product.discountPercentage : '-'}</td>
                    <td className="border !border-base-300">{product.hasOffer ? <>रू {formatPrice(product.discountedPrice)}</> : '-'}</td>
                    <td className="border !border-base-300">{getDateWithWeekDay(product.createdAt)}</td>
                    <td className="border !border-base-300 text-center">
                      <div className="flex">
                        <Link href={`/admin/products/edit/${product.id}`} className="gap-1 btn btn-info btn-xs btn-outline">
                          <FaCogs></FaCogs>
                        </Link>
                        <button
                          className="gap-1 ml-2 btn btn-error btn-xs btn-outline"
                          disabled={isProductDeleting}
                          onClick={() => {
                            mutateDeleteProduct({ productId: product.id });
                          }}>
                          {isProductDeleting ? <span className="loading loading-spinner loading-xs"></span> : <BsTrash></BsTrash>}
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
