import React, { useEffect, useState } from 'react';
import {
  Ban,
  MapPin,
  Package,
  Phone,
  Search,
  User,
} from 'lucide-react';
import { api } from '../../api/client';
import { Order } from '../../types';
import {
  FALLBACK_PRODUCT_IMAGE,
  formatDateTime,
  formatVND,
  ORDER_STATUS_META,
} from '../../utils/format';
import { ConfirmModal } from '../ConfirmModal';

interface OrderLookupProps {
  initialPhone?: string;
  onOrderCancelled: () => Promise<void> | void;
  notify: (type: 'success' | 'error' | 'warning' | 'info', title: string, description?: string) => void;
}

const SAMPLE_PHONES = ['0901234567', '0912345678', '0938112233', '0987654321'];

export const OrderLookup: React.FC<OrderLookupProps> = ({
  initialPhone,
  onOrderCancelled,
  notify,
}) => {
  const [phoneInput, setPhoneInput] = useState(initialPhone ?? '');
  const [orders, setOrders] = useState<Order[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastQuery, setLastQuery] = useState<string>('');

  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const performLookup = async (query: string) => {
    setLoading(true);
    setHasSearched(true);
    setLastQuery(query);
    try {
      // [SQA-BUG-04] Intentionally allow empty or special-character input to reach backend lookup
      const result = await api.lookupOrders(query);
      setOrders(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể tra cứu đơn hàng';
      notify('error', 'Lỗi tra cứu', msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialPhone && initialPhone.trim()) {
      setPhoneInput(initialPhone);
      void performLookup(initialPhone);
    }
  }, [initialPhone]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void performLookup(phoneInput);
  };

  const handleConfirmCancelOrder = async () => {
    if (!cancelTarget) return;
    setCancelling(true);
    try {
      // [SQA-BUG-03] Calls customer-cancel endpoint which transitions to CANCELLED without restoring stock
      const updated = await api.customerCancelOrder(cancelTarget.id);
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
      setCancelTarget(null);
      await onOrderCancelled();
      notify(
        'success',
        `Đã hủy đơn ${updated.orderCode}`,
        'Trạng thái đơn hàng đã chuyển sang Đã hủy.'
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể hủy đơn hàng';
      notify('error', 'Hủy đơn thất bại', msg);
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="max-w-2xl">
          <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
            Tra cứu lịch sử đơn hàng
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Nhập số điện thoại bạn đã dùng khi đặt hàng để xem tiến trình xử lý và chi tiết đơn.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row" noValidate>
            <div className="relative flex-1">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Nhập SĐT khách hàng (VD: 0938112233)..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-600 disabled:opacity-60"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? 'Đang tìm...' : 'Tìm kiếm'}</span>
            </button>
          </form>

          {/* Sample phone quick fill */}
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            <span>SĐT mẫu để kiểm tra nhanh:</span>
            {SAMPLE_PHONES.map((phone) => (
              <button
                key={phone}
                type="button"
                onClick={() => {
                  setPhoneInput(phone);
                  void performLookup(phone);
                }}
                className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono font-medium text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
              >
                {phone}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      {!hasSearched ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Search className="h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-900">
            Nhập số điện thoại để bắt đầu tra cứu
          </h3>
          <p className="mt-1 max-w-md text-sm text-slate-500">
            Bạn có thể xem trạng thái giao hàng hoặc hủy đơn đang ở trạng thái Chờ xác nhận.
          </p>
        </div>
      ) : loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div
              key={n}
              className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <Package className="h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-900">
            Không tìm thấy đơn hàng nào
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            Không có đơn hàng nào khớp với số điện thoại{' '}
            <span className="font-semibold text-slate-700">"{lastQuery}"</span>.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-sm font-medium text-slate-600">
            Tìm thấy <span className="font-bold text-slate-900">{orders.length}</span> đơn hàng
            {lastQuery.trim() ? (
              <>
                {' '}
                cho từ khóa <span className="font-mono font-semibold text-indigo-600">{lastQuery}</span>
              </>
            ) : null}
          </p>

          {orders.map((order) => {
            const meta = ORDER_STATUS_META[order.status];
            const canCancel = order.status === 'PENDING';

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm"
              >
                {/* Order Header */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3.5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-sm font-extrabold text-slate-900">
                      {order.orderCode}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                      {meta.label}
                    </span>
                    <span className="text-xs text-slate-500">
                      {formatDateTime(order.createdAt)}
                    </span>
                  </div>

                  {canCancel && (
                    <button
                      type="button"
                      onClick={() => setCancelTarget(order)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      <Ban className="h-3.5 w-3.5" />
                      <span>Hủy đơn hàng</span>
                    </button>
                  )}
                </div>

                {/* Customer Info */}
                <div className="grid gap-3 border-b border-slate-100 px-5 py-3.5 text-xs text-slate-600 sm:grid-cols-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                      Khách hàng:{' '}
                      <strong className="text-slate-900">{order.customerName}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                    <span>
                      SĐT:{' '}
                      <strong className="font-mono text-slate-900">{order.customerPhone}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0 text-slate-400" />
                    <span className="truncate" title={order.customerAddress}>
                      {order.customerAddress}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-slate-100 px-5">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between gap-4 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <img
                          src={item.productImageUrl || FALLBACK_PRODUCT_IMAGE}
                          alt={item.productName}
                          onError={(e) => {
                            if (e.currentTarget.src !== FALLBACK_PRODUCT_IMAGE) {
                              e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                            }
                          }}
                          className="h-12 w-12 shrink-0 rounded-xl object-cover bg-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-900">
                            {item.productName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {formatVND(item.unitPrice)} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-sm font-bold text-slate-900">
                        {formatVND(item.lineTotal)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer Totals */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs">
                  <div className="flex flex-wrap items-center gap-4 text-slate-600">
                    <span>
                      Tạm tính: <strong className="text-slate-900">{formatVND(order.subtotal)}</strong>
                    </span>
                    {order.voucherCode && (
                      <span>
                        Voucher{' '}
                        <code className="rounded bg-indigo-50 px-1.5 py-0.5 font-semibold text-indigo-700">
                          {order.voucherCode}
                        </code>
                        : <strong className="text-emerald-600">-{formatVND(order.discountAmount)}</strong>
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-extrabold text-slate-900">
                    Tổng cộng:{' '}
                    <span className="text-base text-indigo-600">{formatVND(order.finalTotal)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={Boolean(cancelTarget)}
        title={`Xác nhận hủy đơn ${cancelTarget?.orderCode ?? ''}?`}
        description="Đơn hàng đang ở trạng thái Chờ xác nhận sẽ chuyển sang Đã hủy và không thể khôi phục."
        confirmText="Hủy đơn hàng"
        cancelText="Quay lại"
        variant="danger"
        isLoading={cancelling}
        onConfirm={handleConfirmCancelOrder}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
};
