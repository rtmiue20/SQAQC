import React from 'react';
import { PackageSearch, ShoppingBag } from 'lucide-react';
import { CartItem, CustomerTab, Product, SortOption } from '../../types';
import { HeroBanner } from './HeroBanner';
import { OrderLookup } from './OrderLookup';
import { ProductCatalog } from './ProductCatalog';

interface CustomerViewProps {
  activeTab: CustomerTab;
  onTabChange: (tab: CustomerTab) => void;
  products: Product[];
  loadingProducts: boolean;
  search: string;
  onSearchChange: (val: string) => void;
  category: string;
  onCategoryChange: (cat: string) => void;
  sort: SortOption;
  onSortChange: (sort: SortOption) => void;
  cartItems: CartItem[];
  onAddToCart: (product: Product) => void;
  lookupInitialPhone?: string;
  onOrderCancelled: () => Promise<void> | void;
  notify: (type: 'success' | 'error' | 'warning' | 'info', title: string, description?: string) => void;
}

export const CustomerView: React.FC<CustomerViewProps> = ({
  activeTab,
  onTabChange,
  products,
  loadingProducts,
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  cartItems,
  onAddToCart,
  lookupInitialPhone,
  onOrderCancelled,
  notify,
}) => {
  const scrollToCatalog = () => {
    const el = document.getElementById('product-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-8">
      {/* Sub-navigation tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange('store')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'store'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900'
            }`}
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Cửa hàng</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange('lookup')}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
              activeTab === 'lookup'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900'
            }`}
          >
            <PackageSearch className="h-4 w-4" />
            <span>Tra cứu đơn hàng</span>
          </button>
        </div>
      </div>

      {activeTab === 'store' ? (
        <div className="space-y-10">
          <HeroBanner
            onExploreClick={scrollToCatalog}
            onGoToLookup={() => onTabChange('lookup')}
          />

          <ProductCatalog
            products={products}
            loading={loadingProducts}
            search={search}
            onSearchChange={onSearchChange}
            category={category}
            onCategoryChange={onCategoryChange}
            sort={sort}
            onSortChange={onSortChange}
            cartItems={cartItems}
            onAddToCart={onAddToCart}
          />
        </div>
      ) : (
        <OrderLookup
          initialPhone={lookupInitialPhone}
          onOrderCancelled={onOrderCancelled}
          notify={notify}
        />
      )}
    </div>
  );
};
