import React, { useMemo, useState } from 'react';
import { CheckCircle2, PackageCheck, Truck, XCircle } from 'lucide-react';
import { api } from '../../api/client';
import { Order, OrderStatus } from '../../types';
import { formatDateTime, formatVND, ORDER_STATUS_META } from '../../utils/format';
import { ConfirmModal } from '../ConfirmModal';

interface OrderManagementProps {
  orders: Order[];
  loading: boolean;
  onChanged: () => Promise<void> | void;
  notify: (type: 'success' | 'error' | 'warning' | 'info', title: string, description?: string) => void;
}

const FILTER_OPTIONS: { value: OrderStatus | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'Tất cả' },
  { value: 'PENDING', label: 'Chờ xác nhận' },
  { value: 'SHIPPING', label: 'Đang giao hàng' },
  { value: 'COMPLETED', label: 'Hoàn thành' },
  { value: 'CANCELLED', label: 'Đã hủy' },
];

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  loading,
  onChanged,
  notify,
}) => {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Order | null>(null);

  const filteredOrders = useMemo(() => {
    if (statusFilter === 'ALL') return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  const countsByStatus = useMemo(() => {
    const map: Record<string, number> = { ALL: orders.length };
    for (const o of orders) {
      map[o.status] = (map[o.status] ?? 0) + 1;
    }
    return map;
  }, [orders]);

  const handleTransition = async (order: Order, nextStatus: OrderStatus) => {
    setUpdatingId(order.id);
    try {
      const updated = await api.adminUpdateOrderStatus(order.id, nextStatus);
      await onChanged();
      notify(
        'success',
        `Cập nhật ${updated.orderCode} → ${updated.statusLabel}`,
        nextStatus === 'CANCELLED'
          ? 'Đã hủy đơn và hoàn lại số lượng tồn kho cho sản phẩm.'
          : undefined
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể cập nhật trạng thái';
      notify('error', 'Thao tác thất bại', msg);
    } finally {
      setUpdatingId(null);
      setCancelTarget(null);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Status Filter */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Quản lý Đơn hàng (Order Lifecycle)
            </h2>
            <p className="text-xs text-slate-500">
              Theo dõi và điều phối trạng thái đơn: Chờ xác nhận → Đang giao hàng → Hoàn thành
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((opt) => {
            const active = statusFilter === opt.value;
            const count = countsByStatus[opt.value] ?? 0;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold transition sm:text-sm ${
                  active
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900'
                }`}
              >
                <span>{opt.label}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                    active ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Order Cards / List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
            />
          ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <PackageCheck className="h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-base font-bold text-slate-900">Không có đơn hàng nào</h3>
          <p className="mt-1 text-sm text-slate-500">
            Chưa có đơn hàng ở trạng thái đang lọc.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const meta = ORDER_STATUS_META[order.status];
            const isBusy = updatingId === order.id;

            return (
              <div
                key={order.id}
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition hover:border-slate-300"
              >
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

                  {/* Lifecycle Transition Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    {order.status === 'PENDING' && (
                      <>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleTransition(order, 'SHIPPING')}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
                        >
                          <Truck className="h-3.5 w-3.5" />
                          <span>Giao hàng</span>
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setCancelTarget(order)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Hủy đơn</span>
                        </button>
                      </>
                    )}

                    {order.status === 'SHIPPING' && (
                      <>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => handleTransition(order, 'COMPLETED')}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-60"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Hoàn thành</span>
                        </button>
                        <button
                          type="button"
                          disabled={isBusy}
                          onClick={() => setCancelTarget(order)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:opacity-60"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Hủy đơn</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 p-5 lg:grid-cols-12">
                  {/* Customer Details */}
                  <div className="space-y-1 text-xs text-slate-600 lg:col-span-4">
                    <p className="text-sm font-bold text-slate-900">{order.customerName}</p>
                    <p className="font-mono font-medium text-slate-700">{order.customerPhone}</p>
                    <p className="leading-relaxed text-slate-500">{order.customerAddress}</p>
                  </div>

                  {/* Items Summary */}
                  <div className="space-y-1.5 lg:col-span-5">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between gap-2 text-xs text-slate-700"
                      >
                        <span className="truncate">
                          <strong className="font-semibold text-slate-900">{item.quantity}×</strong>{' '}
                          {item.productName}
                        </span>
                        <span className="shrink-0 font-semibold text-slate-900">
                          {formatVND(item.lineTotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="flex flex-col justify-between rounded-xl bg-slate-50 p-3.5 text-xs lg:col-span-3">
                    <div className="space-y-1 text-slate-600">
                      <div className="flex justify-between">
                        <span>Tạm tính:</span>
                        <span className="font-semibold text-slate-900">
                          {formatVND(order.subtotal)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>
                          Giảm giá {order.voucherCode ? `(${order.voucherCode})` : ''}:
                        </span>
                        <span className="font-semibold text-emerald-600">
                          -{formatVND(order.discountAmount)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-sm font-extrabold text-slate-900">
                      <span>Thành tiền:</span>
                      <span className="text-indigo-600">{formatVND(order.finalTotal)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmModal
        open={Boolean(cancelTarget)}
        title={`Admin hủy đơn ${cancelTarget?.orderCode ?? ''}?`}
        description="Hệ thống sẽ chuyển trạng thái đơn sang Đã hủy và tự động hoàn lại số lượng tồn kho cho các sản phẩm trong đơn."
        confirmText="Xác nhận hủy & hoàn kho"
        cancelText="Đóng"
        variant="danger"
        isLoading={updatingId !== null}
        onConfirm={() => {
          if (cancelTarget) {
            void handleTransition(cancelTarget, 'CANCELLED');
          }
        }}
        onCancel={() => setCancelTarget(null)}
      />
    </div>
  );
};
