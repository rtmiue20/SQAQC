import React from 'react';
import { ClipboardList, LayoutDashboard, Package } from 'lucide-react';
import { AdminTab, DashboardSummary, Order, Product } from '../../types';
import { DashboardOverview } from './DashboardOverview';
import { OrderManagement } from './OrderManagement';
import { ProductManagement } from './ProductManagement';

interface AdminViewProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  summary: DashboardSummary | null;
  products: Product[];
  orders: Order[];
  loading: boolean;
  onDataChanged: () => Promise<void> | void;
  notify: (type: 'success' | 'error' | 'warning' | 'info', title: string, description?: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  activeTab,
  onTabChange,
  summary,
  products,
  orders,
  loading,
  onDataChanged,
  notify,
}) => {
  const tabs: { id: AdminTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { id: 'products', label: 'Sản phẩm & Kho', icon: Package },
    { id: 'orders', label: 'Đơn hàng', icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Sub-nav */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <span className="text-xs font-medium text-slate-500">
          Chế độ Quản trị &amp; Bán hàng (POS Dashboard)
        </span>
      </div>

      {activeTab === 'dashboard' && (
        <DashboardOverview
          summary={summary}
          loading={loading}
          onJumpToProducts={() => onTabChange('products')}
          onJumpToOrders={() => onTabChange('orders')}
        />
      )}

      {activeTab === 'products' && (
        <ProductManagement
          products={products}
          loading={loading}
          onChanged={onDataChanged}
          notify={notify}
        />
      )}

      {activeTab === 'orders' && (
        <OrderManagement
          orders={orders}
          loading={loading}
          onChanged={onDataChanged}
          notify={notify}
        />
      )}
    </div>
  );
};
