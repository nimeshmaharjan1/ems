import { addToCart } from '@/features/cart/cart.service';
import ReviewsSection from '@/features/products/components/reviews-section';
import { NextPageWithLayout } from '@/pages/_app';
import MainSharedLayout from '@/shared/layouts/main';
import { formatPrice } from '@/shared/utils/helper.util';
import { useCartStore } from '@/store/user-cart';
import { PrismaClient } from '@prisma/client';
import parse from 'html-react-parser';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { ReactNode, useState } from 'react';
const prisma = new PrismaClient();

export const getServerSideProps: GetServerSideProps = async (ctx: GetServerSidePropsContext) => {
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
  }
  return {
    props: {
      product: null,
    },
  };
};

export interface IProduct {
  id: string;
  images: string[];
  title: string;
  description: string;
  price: number;
  categoryId: string;
  companyId: string;
  quantity: string;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  modal: string;
  category: Category;
  company: Category;
}

export interface Category {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

const Product: NextPageWithLayout<{ product: IProduct }> = ({ product }) => {
  console.log(product);
  const { cartItems, setCartItems } = useCartStore();
  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addToCart(
      {
        price: product.price,
        quantity: quantity,
        productId: product.id,
        image: product.images[0],
        slug: product.slug,
        maxQuantity: parseInt(product.quantity),
      },
      cartItems,
      setCartItems
    );
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

  if (!product) {
    return <>Something went wrong while trying to get the product.</>;
  }
  //TODO decrease quantity after order created.
  return (
    <>
      <Head>
        <title>EME - {product.slug}</title>
      </Head>
      <section className="grid-cols-6 grid gap-10 gap-x-12">
        <section className="carousel-section col-span-6 md:col-span-3">
          <div className="selected-image mb-4 rounded-box">
            <Image className="rounded-box" width={800} priority height={300} alt="Product" src={selectedImage} />
          </div>
          {product.images.length > 1 && (
            <>
              <div className="carousel h-[19rem] carousel-center space-x-6 p-4">
                {product.images.map((image, index) => {
                  return (
                    <div className="carousel-item cursor-pointer" key={image} onClick={() => setSelectedImage(image)}>
                      <Image id={`item${index}`} width={300} height={200} alt="Product" className="rounded-box h-auto w-auto" src={image} />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center w-full py-2 gap-2">
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
        <section className="detail-section col-span-6 md:col-span-3">
          <h1 className="title font-[600] text-2xl tracking-wide leading-normal mb-2">{product.title}</h1>
          <div className="col-span-6 space-y-2">
            <p>
              Modal: <span className="font-bold">{product.modal}</span>
            </p>
            <p>
              Company: <span className="font-bold">{product.company.name}</span>
            </p>
            <p className="text-base">
              Availability:{' '}
              {Number(product.quantity) > 0 ? (
                <span className="text-success">In Stock</span>
              ) : (
                <span className="text-error">Out of Stock</span>
              )}
            </p>
          </div>
          <p className="description text-justify mb-6 prose mt-3">{parse(product.description)}</p>
          <p className="price text-lg font-bold text-error border-t border-b p-4 mb-9">&#8377; {formatPrice(product.price)}</p>
          <section className="quantity-section mb-8 grid grid-cols-6 items-center gap-3 gap-y-7">
            <div className="flex items-center gap-3 col-span-6">
              <p>Quantity</p>
              <div className="join">
                <button className="btn btn-sm join-item rounded-l-full" onClick={decreaseQuantity}>
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
                <button className="btn btn-sm join-item rounded-r-full" onClick={increaseQuantity}>
                  +
                </button>
              </div>
            </div>
          </section>
          <div className="action-section flex gap-4">
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
