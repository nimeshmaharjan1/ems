import ReviewsSection from '@/features/products/components/reviews-section';
import { NextPageWithLayout } from '@/pages/_app';
import { IProduct } from '@/shared/interfaces/product.interface';
import MainSharedLayout from '@/shared/layouts/main';
import { formatPrice } from '@/shared/utils/helper.util';
import { useCartStore, useShallowCartStore } from '@/store/user-cart';
import { PrismaClient, USER_ROLES } from '@prisma/client';
import classNames from 'classnames';
import parse from 'html-react-parser';
import { ShieldCheck } from 'lucide-react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
import { shallow } from 'zustand/shallow';

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const prisma = new PrismaClient();
  // Get the current home from the database
  const id = ctx?.params?.productId as string;
  try {
    const product = await prisma.product.findUnique({
      where: { id: id },
      include: {
        category: true,
        company: true,
      },
    });

    if (product) {
      return {
        props: {
          product: JSON.parse(JSON.stringify(product)),
        },
      };
    }
  } catch (error) {
    console.error(error);
    return {
      props: {
        product: null,
      },
    };
  } finally {
    await prisma.$disconnect();
  }
  return {
    props: {
      product: null,
    },
  };
};

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const Product: NextPageWithLayout<{ product: IProduct }> = ({ product }) => {
  const { cartItems, setCartItems, addToCart } = useShallowCartStore((state) => ({
    cartItems: state.cartItems,
    setCartItems: state.setCartItems,
    addToCart: state.addToCart,
  }));

  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addToCart({
      price: product.price,
      quantity: quantity,
      productId: product.id,
      image: product.images[0],
      slug: product.slug,
      maxQuantity: parseInt(product.quantity),
      hasOffer: product.hasOffer,
      crossedPrice: product?.crossedPrice,
      sellingPrice: product.sellingPrice,
      wholesaleCashPrice: product.wholesaleCashPrice,
      wholesaleCreditPrice: product.wholesaleCreditPrice,
    });
  };
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity((prev) => {
      if (prev >= parseInt(product.quantity)) {
        return prev;
      }
      return quantity + 1;
    });
  };

  const { data: session } = useSession();

  if (!product) {
    return <>Something went wrong while trying to get the product.</>;
  }
  //TODO decrease quantity after order created.
  return (
    <>
      <Head>
        <title>EME - {product.slug}</title>
      </Head>
      <section className="grid grid-cols-6 gap-10 gap-x-12">
        <section className="col-span-6 carousel-section md:col-span-3">
          <div className="mb-4 selected-image rounded-box">
            <Image className="rounded-box" width={800} priority height={300} alt="Product" src={selectedImage} />
          </div>
          {product.images.length > 1 && (
            <>
              <div className="carousel h-[19rem] carousel-center space-x-6 p-4">
                {product.images.map((image, index) => {
                  return (
                    <div className="cursor-pointer carousel-item" key={image} onClick={() => setSelectedImage(image)}>
                      <Image id={`item${index}`} width={300} height={200} alt="Product" className="w-auto h-auto rounded-box" src={image} />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center w-full gap-2 py-2">
                {product.images.map((_, index) => {
                  return (
                    <a key={index} href={`#item${index}`} className="btn btn-xs">
                      {index + 1}
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </section>
        <section className="col-span-6 detail-section md:col-span-3">
          <h1 className="title font-[600] text-2xl tracking-wide leading-normal mb-2">{product.title}</h1>
          <div className="col-span-6 space-y-2">
            <div className="flex flex-col-reverse justify-between gap-2 lg:flex-row">
              <p>
                Model: <span className="font-bold">{product.modal}</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck strokeWidth={1.5} /> 100% Genuine Product{' '}
              </p>
            </div>
            <p>
              Company: <span className="font-bold">{product.company.name}</span>
            </p>
            <div className="flex items-center mt-1 gap-x-2">
              <div
                className={classNames('w-3 h-3 rounded-full', {
                  'bg-error': Number(product.quantity) <= 0,
                  'bg-success': Number(product.quantity) > 0,
                })}></div>
              {Number(product.quantity) > 0 ? <p>In Stock</p> : <p>Out of Stock</p>}
            </div>
          </div>
          <p className="mt-3 mb-6 prose text-justify description">{parse(product.description)}</p>
          {session?.user?.role === USER_ROLES.BUSINESS_CLIENT ? (
            <p className="p-4 text-lg font-bold border-t border-b price text-error mb-9">रू {formatPrice(product.wholesaleCashPrice)}</p>
          ) : (
            <>
              {product.hasOffer ? (
                <p className="p-4 font-bold border-t border-b price mb-9">
                  <span className="text-sm text-gray-400 line-through">रू {formatPrice(product.crossedPrice)}</span>
                  <span className="ml-4 text-lg text-error">रू {formatPrice(product.sellingPrice)}</span>
                </p>
              ) : (
                <p className="p-4 text-lg font-bold border-t border-b price text-error mb-9">रू {formatPrice(product.sellingPrice)}</p>
              )}
            </>
          )}
          <section className="grid items-center grid-cols-6 gap-3 mb-8 quantity-section gap-y-7">
            <div className="flex items-center col-span-6 gap-3">
              <p>Quantity</p>
              <div className="join">
                <button className="rounded-l-full btn btn-sm join-item" onClick={decreaseQuantity}>
                  -
                </button>
                <input
                  className="input w-24 input-sm text-center !bg-base-200 join-item"
                  type="number"
                  onChange={(e) => {
                    setQuantity((prev) => {
                      if (parseInt(e.target.value) > parseInt(product.quantity)) {
                        return prev;
                      }
                      return parseInt(e.target.value);
                    });
                  }}
                  value={quantity}
                />
                <button className="rounded-r-full btn btn-sm join-item" onClick={increaseQuantity}>
                  +
                </button>
              </div>
            </div>
          </section>
          <div className="flex gap-4 action-section">
            <button onClick={handleAddToCart} className="btn btn-primary">
              Add to Cart
            </button>
            <button className="btn btn-ghost" onClick={() => router.push('/products')}>
              Go Back
            </button>
          </div>
        </section>
      </section>
      <section className="specification-section"></section>
      <ReviewsSection productId={product.id}></ReviewsSection>
    </>
  );
};

export default Product;

//TODO update single product title
Product.getLayout = (page: ReactNode) => {
  return <MainSharedLayout metaData={{}}>{page}</MainSharedLayout>;
};
