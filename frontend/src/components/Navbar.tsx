import React from 'react';
import {
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Store,
} from 'lucide-react';
import { AppRole } from '../types';

interface NavbarProps {
  role: AppRole;
  onRoleChange: (role: AppRole) => void;
  cartCount: number;
  onOpenCart: () => void;
  onRequestReset: () => void;
  isResetting: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  role,
  onRoleChange,
  cartCount,
  onOpenCart,
  onRequestReset,
  isResetting,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm ring-1 ring-slate-900/10">
            <Sparkles className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                AURA STORE
              </span>
              <span className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
                Release v1.0 (Beta)
              </span>
            </div>
            <p className="hidden text-xs text-slate-500 sm:block">
              Hệ thống Quản lý Bán hàng &amp; Thương mại Trực tuyến
            </p>
          </div>
        </div>

        {/* Role Switcher */}
        <div
          className="order-3 flex w-full items-center justify-center rounded-xl bg-slate-100 p-1 sm:order-2 sm:w-auto"
          role="tablist"
          aria-label="Chuyển đổi góc nhìn"
        >
          <button
            type="button"
            onClick={() => onRoleChange('customer')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:flex-initial sm:text-sm ${
              role === 'customer'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="h-4 w-4 text-indigo-600" />
            <span>Khách hàng</span>
          </button>

          <button
            type="button"
            onClick={() => onRoleChange('admin')}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all sm:flex-initial sm:text-sm ${
              role === 'admin'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck
              className={`h-4 w-4 ${role === 'admin' ? 'text-indigo-400' : 'text-slate-500'}`}
            />
            <span>Quản trị &amp; Bán hàng</span>
          </button>
        </div>

        {/* Utility Actions */}
        <div className="order-2 flex items-center gap-2.5 sm:order-3">
          <button
            type="button"
            onClick={onRequestReset}
            disabled={isResetting}
            title="Khôi phục 8 sản phẩm, 2 voucher và 4 đơn hàng mẫu ban đầu"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
          >
            <RotateCcw className={`h-4 w-4 text-slate-500 ${isResetting ? 'animate-spin' : ''}`} />
            <span className="hidden md:inline">Reset Dữ liệu Mẫu</span>
            <span className="md:hidden">Reset</span>
          </button>

          {role === 'customer' && (
            <button
              type="button"
              onClick={onOpenCart}
              aria-label="Mở giỏ hàng"
              className="relative inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:scale-[0.98] sm:text-sm"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">Giỏ hàng</span>
              <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-bold text-white">
                {cartCount}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
