import React from 'react';
import { ArrowUpDown, PackageSearch, Search, X } from 'lucide-react';
import { CartItem, Product, SortOption } from '../../types';
import { ProductCard } from './ProductCard';

const CATEGORIES = ['Tất cả', 'Áo', 'Quần', 'Phụ kiện'] as const;

interface ProductCatalogProps {
  products: Product[];
  loading: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (cat: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  loading,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  cartItems,
  onAddToCart,
}) => {
  const cartQuantityMap = new Map(cartItems.map((i) => [i.productId, i.quantity]));

  const filteredProducts = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = products.filter((p) => {
      const catMatch = category === 'Tất cả' || p.category.toLowerCase() === category.toLowerCase();
      const searchMatch =
        !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
      return catMatch && searchMatch;
    });

    if (sort === 'price_asc') {
      return [...list].sort((a, b) => a.price - b.price);
    }
    if (sort === 'price_desc') {
      return [...list].sort((a, b) => b.price - a.price);
    }
    return list;
  }, [products, search, category, sort]);

  return (
    <section id="product-catalog" className="scroll-mt-24 space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            Danh mục sản phẩm
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Hiển thị {filteredProducts.length} / {products.length} sản phẩm hiện có
          </p>
        </div>

        {/* Search & Sort controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-[240px] sm:w-72">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tìm tên sản phẩm..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
            {search && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <div className="relative">
            <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              aria-label="Sắp xếp theo giá"
              className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-medium text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:w-auto"
            >
              <option value="default">Sắp xếp: Mặc định</option>
              <option value="price_asc">Giá: Thấp đến Cao</option>
              <option value="price_desc">Giá: Cao đến Thấp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`rounded-full px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                active
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="h-44 rounded-xl bg-slate-100" />
              <div className="mt-4 h-4 w-3/4 rounded bg-slate-100" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-100" />
              <div className="mt-6 h-9 rounded-xl bg-slate-100" />
            </div>
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <PackageSearch className="h-12 w-12 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-900">
            Không tìm thấy sản phẩm phù hợp
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn danh mục khác.
          </p>
          {(search || category !== 'Tất cả') && (
            <button
              type="button"
              onClick={() => {
                onSearchChange('');
                onCategoryChange('Tất cả');
              }}
              className="mt-4 rounded-xl bg-indigo-50 px-4 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              cartQuantity={cartQuantityMap.get(product.id) ?? 0}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      )}
    </section>
  );
};
