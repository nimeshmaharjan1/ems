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
      className="z-0 card !rounded-none w-full md:w-52 sm:w-[20rem] bg-base-100 border-2">
      <figure className="h-44 w-full relative cursor-pointer" onClick={() => router.push(`/products/${product.id}`)}>
        <Image quality={100} src={product.images?.[0] as string} className="object-contain border-b-2" fill alt="Shoes" />
      </figure>
      <div className="card-body !gap-1 !p-4">
        <Link
          href={`/products/${product.id}`}
          className="md:min-h-[84px] !items-start card-title !font-medium cursor-pointer !text-[1.1rem]">
          {product.title}
        </Link>
        <Rating></Rating>
        <p className="pt-1 font-medium text-error">&#8377; {new Intl.NumberFormat('en-IN').format(Number(product.price))}</p>
        <div className="mt-1 flex items-center gap-x-2">
          <div className="w-2 h-2 rounded-full bg-success"></div>
          {Number(product.quantity) > 0 ? <p className="text-xs">In Stock</p> : <p className="text-xs">Out of Stock</p>}
        </div>
        <div className="card-actions justify-end items-center mt-3">
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
