import ProductCard from "@/features/products/components/product-card";
import Pagination from "@/shared/components/pagination/index";
import { PaginatedProductsResponse } from "@/shared/interfaces/product.interface";
import MainSharedLayout from "@/shared/layouts/main";
import ViewAllLayout from "@/shared/layouts/view-all";
import { useShopByStore } from "@/store/use-shop-by";
import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { NextPageWithLayout } from "../_app";
import Modal from "@/shared/components/modal";
import StyledReactSelect from "@/shared/components/styled-react-select";
import Image from "next/image";

const Home: NextPageWithLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(8);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const { shopBySearchParams } = useShopByStore();

  const [selectedSearchProduct, setSelectedSearchProduct] = useState({
    label: "",
    value: "",
  });
  const {
    data: productData,
    isError,
    isLoading,
  } = useQuery<PaginatedProductsResponse, Error>(
    [
      "fetchProducts",
      shopBySearchParams,
      currentPage,
      limit,
      selectedSearchProduct,
    ],
    async () => {
      const params = new URLSearchParams(shopBySearchParams);
      const response = await axios.get(
        `/api/products?${params}&page=${currentPage}&limit=${limit}&title=${
          selectedSearchProduct?.label || ""
        }`
      );
      return response.data;
    }
  );
  const totalPages = productData?.totalPages;

  const loadSearchProducts = async (
    searchValue: string,
    loadedData: any,
    { page }: any
  ) => {
    try {
      const res = await axios.get(`/api/products?page=${page}&limit=${5}`);
      const response = res.data;
      let filteredOptions: any;
      if (!searchValue) {
        filteredOptions = response.products;
      } else {
        filteredOptions = response.products.filter((option: any) =>
          option.title.toLowerCase().includes(searchValue.toLowerCase())
        );
      }
      return {
        options: filteredOptions.map((option: any) => {
          return {
            value: option.id,
            label: option.title,
            image: option.images[0],
          };
        }),
        hasMore: response.page < response.totalPages ? true : false,
        additional: {
          page: page + 1,
        },
      };
    } catch (error) {
      console.error(error);
      return {
        options: [],
        hasMore: false,
      };
    }
  };

  if (!isMounted) return null;

  return (
    <>
      <header className="mb-8 flex flex-col md:flex-row items-start gap-y-9 justify-between md:items-center gap-x-24">
        <h1 className="relative pb-1 text-2xl font-bold uppercase">
          Products
          <span
            className="bg-primary"
            style={{
              content: "",
              width: "70px",
              height: "3px",
              display: "inline-block",
              position: "absolute",
              bottom: "-8px",
              left: "0",
            }}
          ></span>
        </h1>

        <div className="flex-1">
          {" "}
          <StyledReactSelect
            onChange={(values: any) => {
              setSelectedSearchProduct(values);
            }}
            loadOptions={loadSearchProducts}
            isMulti={false}
            placeholder="Search products..."
            isClearable
            formatOptionLabel={(product: any) => {
              return (
                <div className="product-option flex items-center gap-x-3">
                  <Image
                    width={80}
                    height={50}
                    src={product?.image}
                    className="rounded"
                    alt="product-image"
                  />
                  <span className="text-base">{product.label}</span>
                </div>
              );
            }}
          ></StyledReactSelect>
        </div>
      </header>
      {isError ? (
        <>
          <header className="mb-8">
            <h1 className="relative pb-1 text-2xl font-bold uppercase text-error">
              Error
              <span
                className="bg-error"
                style={{
                  content: "",
                  width: "70px",
                  height: "3px",
                  display: "inline-block",
                  position: "absolute",
                  bottom: "-8px",
                  left: "0",
                }}
              ></span>
            </h1>
          </header>
          <div>
            Something went wrong while trying to get the products please try
            again later.
          </div>
        </>
      ) : isLoading ? (
        <>
          <div className="grid grid-cols-12 gap-6 mt-10">
            {Array(6)
              .fill(0)
              .map((_, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-center col-span-12 md:col-span-6 lg:col-span-4"
                  >
                    <div className="flex flex-col w-full rounded shadow-md sm:w-80 animate-pulse h-96">
                      <div className="h-48 rounded-t bg-base-200"></div>
                      <div className="flex-1 px-4 py-8 space-y-4 sm:p-8 bg-base-300">
                        <div className="w-full h-6 rounded bg-base-200"></div>
                        <div className="w-full h-6 rounded bg-base-200"></div>
                        <div className="w-3/4 h-6 rounded bg-base-200"></div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </>
      ) : productData?.products?.length === 0 ? (
        <div className="md:mt-16 text-warning">
          No products are available at this moment.
        </div>
      ) : (
        <>
          {" "}
          <div className="z-0 grid grid-cols-12 gap-6">
            {productData?.products &&
              productData.products.map((product) => {
                return (
                  <div
                    className="flex justify-center col-span-12 md:col-span-6 lg:col-span-3"
                    key={product.id}
                  >
                    <ProductCard
                      {...{ product }}
                      key={product.id}
                    ></ProductCard>
                  </div>
                );
              })}
          </div>
          <div className="flex justify-end px-2 mt-6 md:mt-12 md:px-12 lg:px-0 place-self-end">
            {totalPages !== undefined && (
              <Pagination
                {...{ currentPage, setCurrentPage, totalPages }}
              ></Pagination>
            )}
          </div>
        </>
      )}
    </>
  );
};

export default Home;
Home.getLayout = (page: ReactNode) => {
  return (
    <MainSharedLayout
      metaData={{
        title: "Products",
      }}
    >
      <ViewAllLayout>{page}</ViewAllLayout>
    </MainSharedLayout>
  );
};
