import Rating from '@/shared/components/rating';
import { Product } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <Link
      href={`/products/${product.id}`}
      className="card !rounded-none md:w-72 sm:w-[20rem] bg-base-100 transition-all hover:shadow-xl hover:scale-105 cursor-pointer border-2">
      <figure className="h-44">
        <Image
          quality={100}
          src={product.images?.[0] as string}
          className="w-96 lg:w-full border-b-2"
          width={500}
          height={500}
          alt="Shoes"
        />
      </figure>
      <div className="card-body !p-4">
        <h2 className="card-title !text-[1.1rem]">{product.title}</h2>
        <Rating></Rating>
        <p className="py-1 font-bold text-error">&#8377; {new Intl.NumberFormat('en-IN').format(Number(product.price))}</p>
        <div className="card-actions justify-end items-center">
          {/* <div className="badge badge-accent">NEW</div> */}

          <button className="btn btn-primary btn-sm">Add To Cart</button>
          {/* <div className="badge badge-sm">Laptops</div> */}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
