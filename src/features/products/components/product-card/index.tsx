import { addToCart } from '@/features/cart/cart.service';
import Rating from '@/shared/components/rating';
import { useCartStore } from '@/store/user-cart';
import { Product } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Toast, showToast } from '@/shared/utils/toast.util';

const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const { cartItems, setCartItems } = useCartStore();
  const handleAddToCart = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    addToCart(
      {
        price: product.price,
        quantity: 1,
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
  return (
    <motion.div
      whileHover={{
        scale: 1.02,
      }}
      className="z-0 card !rounded-none md:w-72 sm:w-[20rem] bg-base-100 border-2">
      <figure className="h-44 cursor-pointer" onClick={() => router.push(`/products/${product.id}`)}>
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
        <Link href={`/products/${product.id}`} className="card-title !font-medium cursor-pointer !text-[1.1rem]">
          {product.title}
        </Link>
        <Rating></Rating>
        <p className="py-1 font-medium text-error">&#8377; {new Intl.NumberFormat('en-IN').format(Number(product.price))}</p>
        <div className="card-actions justify-end items-center">
          {/* <div className="badge badge-accent">NEW</div> */}

          <button className="btn btn-primary btn-sm" onClick={handleAddToCart}>
            Add To Cart
          </button>
          {/* <div className="badge badge-sm">Laptops</div> */}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
