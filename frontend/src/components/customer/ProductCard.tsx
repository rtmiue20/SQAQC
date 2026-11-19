import React from 'react';
import { PackageCheck, Plus, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { FALLBACK_PRODUCT_IMAGE, formatVND } from '../../utils/format';

interface ProductCardProps {
  product: Product;
  cartQuantity: number;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  cartQuantity,
  onAddToCart,
}) => {
  const isOutOfStock = product.stock <= 0;
  const reachedMaxStock = !isOutOfStock && cartQuantity >= product.stock;

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5">
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img
          src={product.imageUrl || FALLBACK_PRODUCT_IMAGE}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== FALLBACK_PRODUCT_IMAGE) {
              img.src = FALLBACK_PRODUCT_IMAGE;
            }
          }}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            isOutOfStock ? 'grayscale opacity-75' : ''
          }`}
        />

        {/* Top badges */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5">
          <span className="rounded-lg bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-700 shadow-sm backdrop-blur-sm">
            {product.category}
          </span>
        </div>

        <div className="absolute right-3 top-3">
          {isOutOfStock ? (
            <span className="inline-flex items-center rounded-lg bg-rose-600 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-sm">
              Hết hàng
            </span>
          ) : product.stock < 5 ? (
            <span className="inline-flex items-center rounded-lg bg-amber-500 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm">
              Chỉ còn {product.stock}
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 sm:text-base">
          {product.name}
        </h3>

        {product.description && (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {product.description}
          </p>
        )}

        <div className="mt-auto pt-4">
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-lg font-extrabold tracking-tight text-slate-900">
              {formatVND(product.price)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
              <PackageCheck className="h-3.5 w-3.5 text-slate-400" />
              <span>Tồn kho: {product.stock}</span>
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock || reachedMaxStock}
            onClick={() => onAddToCart(product)}
            className={`mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition sm:text-sm ${
              isOutOfStock
                ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                : reachedMaxStock
                ? 'cursor-not-allowed bg-amber-50 text-amber-700 ring-1 ring-amber-200'
                : 'bg-slate-900 text-white shadow-sm hover:bg-indigo-600 active:scale-[0.98]'
            }`}
          >
            {isOutOfStock ? (
              <span>Tạm hết hàng</span>
            ) : reachedMaxStock ? (
              <span>Đã đạt giới hạn kho ({cartQuantity})</span>
            ) : (
              <>
                <ShoppingBag className="h-4 w-4" />
                <span>Thêm vào giỏ</span>
                {cartQuantity > 0 && (
                  <span className="inline-flex items-center gap-0.5 rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-bold">
                    <Plus className="h-3 w-3" />
                    {cartQuantity}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
