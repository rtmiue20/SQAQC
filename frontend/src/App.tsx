import { useCallback, useEffect, useState } from 'react';
import { RefreshCw, ServerCrash } from 'lucide-react';
import { api } from './api/client';
import { ConfirmModal } from './components/ConfirmModal';
import { Navbar } from './components/Navbar';
import { ToastContainer } from './components/ToastContainer';
import { AdminView } from './components/admin/AdminView';
import { CartDrawer } from './components/customer/CartDrawer';
import { CustomerView } from './components/customer/CustomerView';
import { useCart } from './hooks/useCart';
import {
  AdminTab,
  AppRole,
  CustomerTab,
  DashboardSummary,
  Order,
  Product,
  SortOption,
  ToastMessage,
  Voucher,
} from './types';

export function App() {
  const [role, setRole] = useState<AppRole>('customer');
  const [customerTab, setCustomerTab] = useState<CustomerTab>('store');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');

  const [products, setProducts] = useState<Product[]>([]);
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [backendError, setBackendError] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Tất cả');
  const [sort, setSort] = useState<SortOption>('default');

  const [cartOpen, setCartOpen] = useState(false);
  const [lookupInitialPhone, setLookupInitialPhone] = useState<string | undefined>(undefined);

  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [resetting, setResetting] = useState(false);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const notify = useCallback(
    (type: ToastMessage['type'], title: string, description?: string) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, type, title, description }]);
      window.setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const loadAllData = useCallback(async () => {
    try {
      setBackendError(null);
      const [productsData, vouchersData, ordersData, summaryData] = await Promise.all([
        api.getProducts(),
        api.getVouchers(),
        api.getOrders(),
        api.getDashboardSummary(),
      ]);
      setProducts(productsData);
      setVouchers(vouchersData);
      setOrders(ordersData);
      setSummary(summaryData);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Không thể kết nối máy chủ Spring Boot (http://localhost:8080)';
      setBackendError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAllData();
  }, [loadAllData]);

  const cart = useCart(products);

  const handleAddToCart = (product: Product) => {
    const result = cart.addItem(product);
    if (result.ok) {
      notify('success', 'Đã thêm vào giỏ hàng', product.name);
    } else if (result.reason) {
      notify('warning', 'Không thể thêm sản phẩm', result.reason);
    }
  };

  const handleConfirmResetSeed = async () => {
    setResetting(true);
    try {
      const res = await api.resetSeedData();
      cart.clearCart();
      setSearch('');
      setCategory('Tất cả');
      setSort('default');
      setLookupInitialPhone(undefined);
      await loadAllData();
      setResetModalOpen(false);
      notify('success', 'Reset dữ liệu mẫu thành công', res.message);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể khôi phục dữ liệu mẫu';
      notify('error', 'Reset thất bại', msg);
    } finally {
      setResetting(false);
    }
  };

  const handleGoToLookupWithPhone = (phone: string) => {
    setRole('customer');
    setCustomerTab('lookup');
    setLookupInitialPhone(phone);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar
        role={role}
        onRoleChange={(nextRole) => setRole(nextRole)}
        cartCount={cart.totalQuantity}
        onOpenCart={() => setCartOpen(true)}
        onRequestReset={() => setResetModalOpen(true)}
        isResetting={resetting}
      />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {backendError && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-900">
            <div className="flex items-start gap-3">
              <ServerCrash className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
              <div className="text-sm">
                <p className="font-bold">Chưa kết nối được với API Backend</p>
                <p className="mt-0.5 text-xs text-rose-700">
                  {backendError}. Hãy đảm bảo Spring Boot đang chạy tại cổng 8080 và MariaDB đã
                  khởi động.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setLoading(true);
                void loadAllData();
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-rose-700"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Thử kết nối lại</span>
            </button>
          </div>
        )}

        {role === 'customer' ? (
          <CustomerView
            activeTab={customerTab}
            onTabChange={setCustomerTab}
            products={products}
            loadingProducts={loading}
            search={search}
            onSearchChange={setSearch}
            category={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
            cartItems={cart.items}
            onAddToCart={handleAddToCart}
            lookupInitialPhone={lookupInitialPhone}
            onOrderCancelled={loadAllData}
            notify={notify}
          />
        ) : (
          <AdminView
            activeTab={adminTab}
            onTabChange={setAdminTab}
            summary={summary}
            products={products}
            orders={orders}
            loading={loading}
            onDataChanged={loadAllData}
            notify={notify}
          />
        )}
      </main>

      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <p className="font-medium text-slate-700">
            AURA STORE — Release v1.0 (Beta) • Spring Boot + React TypeScript + MariaDB
          </p>
          <p>Phục vụ thực hành Kiểm thử Phần mềm (SQA &amp; QC)</p>
        </div>
      </footer>

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cart.items}
        products={products}
        vouchers={vouchers}
        subtotal={cart.subtotal}
        onUpdateQty={cart.updateQuantity}
        onRemoveItem={cart.removeItem}
        onClearCart={cart.clearCart}
        onOrderCreated={loadAllData}
        onGoToLookupWithPhone={handleGoToLookupWithPhone}
        notify={notify}
      />

      <ConfirmModal
        open={resetModalOpen}
        title="Khôi phục Dữ liệu Mẫu?"
        description="Thao tác này sẽ xóa toàn bộ sản phẩm/đơn hàng phát sinh trong quá trình test và khôi phục lại đúng 8 sản phẩm, 2 voucher (UEH10, FREESHIP) và 4 đơn hàng mẫu ban đầu."
        confirmText="Reset Dữ liệu Mẫu"
        cancelText="Hủy bỏ"
        variant="primary"
        isLoading={resetting}
        onConfirm={handleConfirmResetSeed}
        onCancel={() => setResetModalOpen(false)}
      />

      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}

export default App;
