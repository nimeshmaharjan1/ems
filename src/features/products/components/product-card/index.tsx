import { addToCart } from '@/features/cart/cart.service';
import Rating from '@/shared/components/rating';
import { useCartStore } from '@/store/user-cart';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { Toast, showToast } from '@/shared/utils/toast.util';
import classNames from 'classnames';
import { IProduct } from '@/shared/interfaces/product.interface';

const ProductCard: React.FC<{ product: IProduct }> = ({ product }) => {
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
      className="z-0 card !rounded-none w-full md:w-52 sm:w-[20rem] bg-base-100 border-2 relative">
      <figure className="relative z-20 w-full cursor-pointer h-44" onClick={() => router.push(`/products/${product.id}`)}>
        <Image quality={100} src={product.images?.[0] as string} className="z-10 object-cover border-b-2" fill alt="Shoes" />
      </figure>
      {product.hasOffer && (
        <span className="absolute top-0 right-0 z-30 p-2 text-xs text-white rounded-bl-lg bg-primary">
          Save {product.discountPercentage}%
        </span>
      )}
      <div className="card-body justify-between !gap-1 !p-4">
        <section className="space-y-2 body-section">
          <Link
            href={`/products/${product.id}`}
            className="md:min-h-[84px] !items-start card-title !font-medium cursor-pointer !text-[1.1rem]">
            {product.title}
          </Link>
          <Rating rating={Number.isNaN(product.ratingSummary.averageRating) ? 0 : Number(product.ratingSummary.averageRating)}></Rating>
          {product.hasOffer ? (
            <div className="space-y-1">
              <p className="text-xs font-medium line-through opacity-60">
                <span className="text-xs">रू</span> {new Intl.NumberFormat('en-IN').format(Number(product.price))}
              </p>
              <p className="font-medium text-red-500">
                <span className="text-xs">रू</span> {new Intl.NumberFormat('en-IN').format(Number(product.discountedPrice))}
              </p>
            </div>
          ) : (
            <p className="font-medium text-red-500">
              <span className="text-xs">रू</span> {new Intl.NumberFormat('en-IN').format(Number(product.price))}
            </p>
          )}
          <div className="flex items-center mt-1 gap-x-2">
            <div
              className={classNames('w-2 h-2 rounded-full', {
                'bg-error': Number(product.quantity) <= 0,
                'bg-success': Number(product.quantity) > 0,
              })}></div>
            {Number(product.quantity) > 0 ? <p className="text-xs">In Stock</p> : <p className="text-xs">Out of Stock</p>}
          </div>
        </section>
        <div className="items-center justify-end mt-4 card-actions">
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
