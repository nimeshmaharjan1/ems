import ReviewsSection from '@/features/products/components/reviews-section';
import { NextPageWithLayout } from '@/pages/_app';
import MainSharedLayout from '@/shared/layouts/main';
import ViewOneLayout from '@/shared/layouts/view-one';
import { formatPrice } from '@/shared/utils/helper.util';
import { PrismaClient, Product } from '@prisma/client';
import { GetServerSideProps, GetServerSidePropsContext, GetStaticPaths } from 'next';
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

const Product: NextPageWithLayout<{ product: Product }> = ({ product }) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string>(product.images[0]);
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  if (!product) {
    return <>Something went wrong while trying to get the product.</>;
  }
  return (
    <>
      <Head>
        <title>EMS - {product.slug}</title>
      </Head>
      <section className="grid-cols-6 grid gap-10 gap-x-12">
        <section className="carousel-section col-span-6 md:col-span-3">
          <div className="selected-image mb-4 rounded-box">
            <Image className="rounded-box" width={800} priority height={300} alt="Product" src={selectedImage} />
          </div>
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
        </section>
        <section className="detail-section col-span-6 md:col-span-3">
          <h1 className="title font-[600] text-2xl tracking-wide leading-normal mb-5">{product.title}</h1>
          <p className="description text-lg text-justify mb-8">{product.description}</p>
          <p className="price text-lg font-bold text-error border-t border-b p-4 mb-9">&#8377; {formatPrice(product.price)}</p>
          <section className="quantity-section mb-8 flex items-center gap-3">
            <p>Quantity</p>
            <div className="join">
              <button className="btn btn-sm join-item rounded-l-full" onClick={decreaseQuantity}>
                -
              </button>
              <input
                className="input w-24 input-sm text-center !bg-base-200 join-item"
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                value={quantity}
              />
              <button className="btn btn-sm join-item rounded-r-full" onClick={increaseQuantity}>
                +
              </button>
            </div>
          </section>
          <div className="action-section flex gap-4">
            <button className="btn btn-primary">Add to Cart</button>
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
