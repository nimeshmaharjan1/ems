import Rating from '@/shared/components/rating';
import { Product } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  return (
    <div className="card w-72 sm:w-[20rem] bg-base-100 shadow-xl border-2">
      <figure>
        <Image src={product.image as string} className="w-72 lg:w-full h-25 border-b-2" width={250} height={250} alt="Shoes" />
      </figure>
      <div className="card-body !p-4">
        <h2 className="card-title !text-[1.2rem]">
          {product.title}
          <div className="badge badge-accent">NEW</div>
        </h2>
        <Rating></Rating>
        <p className="py-1 font-bold text-error">&#8377; {new Intl.NumberFormat('en-IN').format(parseInt(product.price))}</p>
        <div className="card-actions justify-end items-center">
          <button className="btn btn-primary btn-sm">Add To Cart</button>
          {/* <div className="badge badge-sm">Laptops</div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
