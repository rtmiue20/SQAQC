import React, { useEffect, useState } from 'react';
import {
  CheckCircle2,
  Minus,
  Plus,
  ShoppingBag,
  Tag,
  Trash2,
  X,
} from 'lucide-react';
import { api, ApiError } from '../../api/client';
import { CartItem, Order, Product, Voucher, VoucherValidateResponse } from '../../types';
import { FALLBACK_PRODUCT_IMAGE, formatVND } from '../../utils/format';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
  items: CartItem[];
  products: Product[];
  vouchers: Voucher[];
  subtotal: number;
  onUpdateQty: (productId: number, delta: number) => { ok: boolean; reason?: string };
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  onOrderCreated: (order: Order) => Promise<void> | void;
  onGoToLookupWithPhone: (phone: string) => void;
  notify: (type: 'success' | 'error' | 'warning' | 'info', title: string, description?: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  open,
  onClose,
  items,
  products,
  vouchers,
  subtotal,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  onOrderCreated,
  onGoToLookupWithPhone,
  notify,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');

  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<VoucherValidateResponse | null>(null);
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [validatingVoucher, setValidatingVoucher] = useState(false);

  const [formErrors, setFormErrors] = useState<{
    name?: string;
    phone?: string;
    address?: string;
  }>({});
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const productMap = new Map(products.map((p) => [p.id, p]));

  // Re-validate applied voucher whenever subtotal changes
  useEffect(() => {
    if (!appliedVoucher) return;
    if (items.length === 0) {
      setAppliedVoucher(null);
      setVoucherError(null);
      return;
    }

    let cancelled = false;
    api
      .validateVoucher(appliedVoucher.code, subtotal)
      .then((res) => {
        if (!cancelled) {
          // [SQA-BUG-02] Trust backend discountAmount directly without clamping at 50,000 VND
          setAppliedVoucher(res);
          setVoucherError(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setAppliedVoucher(null);
          setVoucherError(err instanceof Error ? err.message : 'Mã giảm giá không còn hợp lệ');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [subtotal, items.length, appliedVoucher?.code]);

  if (!open) return null;

  const handleApplyVoucher = async (codeOverride?: string) => {
    const code = (codeOverride ?? voucherCodeInput).trim().toUpperCase();
    if (!code) {
      setVoucherError('Vui lòng nhập mã giảm giá');
      return;
    }
    if (items.length === 0) {
      setVoucherError('Giỏ hàng đang trống');
      return;
    }

    setValidatingVoucher(true);
    setVoucherError(null);
    try {
      const res = await api.validateVoucher(code, subtotal);
      // [SQA-BUG-02] Display backend discountAmount directly (UEH10 above 500k exceeds 50k cap)
      setAppliedVoucher(res);
      setVoucherCodeInput(res.code);
      notify('success', `Đã áp dụng mã ${res.code}`, res.description);
    } catch (err) {
      setAppliedVoucher(null);
      const msg = err instanceof ApiError ? err.message : 'Không thể áp dụng mã giảm giá';
      setVoucherError(msg);
    } finally {
      setValidatingVoucher(false);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCodeInput('');
    setVoucherError(null);
  };

  const handleQtyChange = (productId: number, delta: number) => {
    const result = onUpdateQty(productId, delta);
    if (!result.ok && result.reason) {
      notify('warning', 'Giới hạn tồn kho', result.reason);
    }
  };

  const validateCheckoutForm = (): boolean => {
    const nextErrors: { name?: string; phone?: string; address?: string } = {};
    if (!customerName.trim()) {
      nextErrors.name = 'Vui lòng nhập họ tên người nhận';
    }
    const cleanPhone = customerPhone.trim().replace(/\s+/g, '');
    if (!cleanPhone) {
      nextErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (!/^[0-9]{9,12}$/.test(cleanPhone)) {
      nextErrors.phone = 'Số điện thoại phải gồm 9–12 chữ số';
    }
    if (!customerAddress.trim()) {
      nextErrors.address = 'Vui lòng nhập địa chỉ giao hàng';
    }
    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      notify('warning', 'Giỏ hàng trống', 'Vui lòng chọn ít nhất một sản phẩm trước khi đặt hàng.');
      return;
    }
    if (!validateCheckoutForm()) return;

    setSubmitting(true);
    try {
      const created = await api.createOrder({
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim().replace(/\s+/g, ''),
        customerAddress: customerAddress.trim(),
        voucherCode: appliedVoucher?.code ?? null,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      setCompletedOrder(created);
      onClearCart();
      setAppliedVoucher(null);
      setVoucherCodeInput('');
      setVoucherError(null);
      await onOrderCreated(created);
      notify(
        'success',
        `Đặt hàng thành công (${created.orderCode})`,
        'Đơn hàng đang ở trạng thái Chờ xác nhận và đã trừ tồn kho.'
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đặt hàng thất bại, vui lòng thử lại';
      notify('error', 'Không thể tạo đơn hàng', msg);
    } finally {
      setSubmitting(false);
    }
  };

  const discountAmount = appliedVoucher?.discountAmount ?? 0;
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleCloseDrawer = () => {
    setCompletedOrder(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-sm">
      <div
        className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng và Thanh toán"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Giỏ hàng &amp; Thanh toán</h2>
              <p className="text-xs text-slate-500">
                {items.reduce((acc, i) => acc + i.quantity, 0)} sản phẩm đã chọn
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCloseDrawer}
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label="Đóng giỏ hàng"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-5">
          {completedOrder ? (
            <div className="flex flex-col items-center rounded-2xl border border-emerald-200 bg-emerald-50/50 p-6 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-lg font-extrabold text-slate-900">
                Đặt hàng thành công!
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                Mã đơn hàng:{' '}
                <span className="font-bold text-indigo-600">{completedOrder.orderCode}</span>
              </p>
              <div className="mt-4 w-full space-y-2 rounded-xl bg-white p-4 text-left text-xs text-slate-600 shadow-sm ring-1 ring-slate-200">
                <div className="flex justify-between">
                  <span>Khách hàng:</span>
                  <span className="font-semibold text-slate-900">
                    {completedOrder.customerName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Số điện thoại:</span>
                  <span className="font-semibold text-slate-900">
                    {completedOrder.customerPhone}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Trạng thái:</span>
                  <span className="font-semibold text-amber-700">{completedOrder.statusLabel}</span>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-bold text-slate-900">
                  <span>Tổng thanh toán:</span>
                  <span className="text-indigo-600">{formatVND(completedOrder.finalTotal)}</span>
                </div>
              </div>

              <div className="mt-5 flex w-full flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const phone = completedOrder.customerPhone;
                    setCompletedOrder(null);
                    onClose();
                    onGoToLookupWithPhone(phone);
                  }}
                  className="w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
                >
                  Tra cứu đơn hàng vừa đặt
                </button>
                <button
                  type="button"
                  onClick={handleCloseDrawer}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="mt-4 text-base font-bold text-slate-900">Giỏ hàng đang trống</h3>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                Hãy chọn thêm sản phẩm yêu thích từ cửa hàng để bắt đầu đặt hàng.
              </p>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="mt-5 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-600"
              >
                Khám phá sản phẩm
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Cart Items */}
              <div className="space-y-3">
                {items.map((item) => {
                  const liveStock = productMap.get(item.productId)?.stock ?? item.stock;
                  const atMax = item.quantity >= liveStock;

                  return (
                    <div
                      key={item.productId}
                      className="flex gap-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-3"
                    >
                      <img
                        src={item.imageUrl || FALLBACK_PRODUCT_IMAGE}
                        alt={item.name}
                        onError={(e) => {
                          if (e.currentTarget.src !== FALLBACK_PRODUCT_IMAGE) {
                            e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                          }
                        }}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover bg-slate-100"
                      />
                      <div className="flex min-w-0 flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="line-clamp-2 text-sm font-bold text-slate-900">
                              {item.name}
                            </h4>
                            <p className="mt-0.5 text-xs font-semibold text-indigo-600">
                              {formatVND(item.price)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => onRemoveItem(item.productId)}
                            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
                            aria-label={`Xóa ${item.name}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="inline-flex items-center rounded-xl border border-slate-200 bg-white p-0.5">
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.productId, -1)}
                              className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100"
                              aria-label="Giảm số lượng"
                            >
                              <Minus className="h-3.5 w-3.5" />
                            </button>
                            <span className="min-w-[28px] text-center text-xs font-bold text-slate-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleQtyChange(item.productId, 1)}
                              disabled={atMax}
                              title={
                                atMax
                                  ? `Không thể vượt quá tồn kho (${liveStock})`
                                  : 'Tăng số lượng'
                              }
                              className="rounded-lg p-1.5 text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                              aria-label="Tăng số lượng"
                            >
                              <Plus className="h-3.5 w-3.5" />
                            </button>
                          </div>

                          <span className="text-xs font-medium text-slate-500">
                            Kho: {liveStock}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Voucher Input */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <Tag className="h-3.5 w-3.5 text-indigo-600" />
                    Mã giảm giá
                  </span>
                  {appliedVoucher && (
                    <button
                      type="button"
                      onClick={handleRemoveVoucher}
                      className="text-xs font-semibold text-rose-600 hover:underline"
                    >
                      Gỡ mã
                    </button>
                  )}
                </div>

                <div className="mt-2.5 flex gap-2">
                  <input
                    type="text"
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                    placeholder="Nhập mã (VD: UEH10, FREESHIP)"
                    className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium uppercase text-slate-900 outline-none transition placeholder:normal-case placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />
                  <button
                    type="button"
                    disabled={validatingVoucher}
                    onClick={() => handleApplyVoucher()}
                    className="shrink-0 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:opacity-60"
                  >
                    {validatingVoucher ? 'Đang kiểm...' : 'Áp dụng'}
                  </button>
                </div>

                {/* Quick voucher pills */}
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {(vouchers.length > 0
                    ? vouchers
                    : [
                        { code: 'UEH10', description: 'Giảm 10% tối đa 50.000đ cho đơn từ 200.000đ' },
                        { code: 'FREESHIP', description: 'Giảm trực tiếp 30.000đ' },
                      ]
                  ).map((v) => (
                    <button
                      key={v.code}
                      type="button"
                      onClick={() => {
                        setVoucherCodeInput(v.code);
                        void handleApplyVoucher(v.code);
                      }}
                      title={v.description}
                      className={`rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition ${
                        appliedVoucher?.code === v.code
                          ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-indigo-200 hover:text-indigo-600'
                      }`}
                    >
                      {v.code}
                    </button>
                  ))}
                </div>

                {voucherError && (
                  <p className="mt-2 text-xs font-medium text-rose-600">{voucherError}</p>
                )}
                {appliedVoucher && !voucherError && (
                  <p className="mt-2 text-xs font-medium text-emerald-700">
                    {appliedVoucher.description} (Giảm {formatVND(appliedVoucher.discountAmount)})
                  </p>
                )}
              </div>

              {/* Customer Information Form */}
              <form id="checkout-form" onSubmit={handleSubmitOrder} className="space-y-3.5" noValidate>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Thông tin giao hàng
                </h3>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Họ và tên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
                    }}
                    placeholder="Nguyễn Văn A"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
                      formErrors.name
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                    }`}
                  />
                  {formErrors.name && (
                    <p className="mt-1 text-xs text-rose-600">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Số điện thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => {
                      setCustomerPhone(e.target.value);
                      if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: undefined }));
                    }}
                    placeholder="0901234567"
                    className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
                      formErrors.phone
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-xs text-rose-600">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-700">
                    Địa chỉ nhận hàng <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    value={customerAddress}
                    onChange={(e) => {
                      setCustomerAddress(e.target.value);
                      if (formErrors.address) setFormErrors((p) => ({ ...p, address: undefined }));
                    }}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện..."
                    className={`w-full resize-none rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
                      formErrors.address
                        ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                        : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-xs text-rose-600">{formErrors.address}</p>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Footer Summary */}
        {!completedOrder && items.length > 0 && (
          <div className="border-t border-slate-200 bg-slate-50/90 px-5 py-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Tạm tính</span>
                <span className="font-semibold text-slate-900">{formatVND(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>
                  Giảm giá {appliedVoucher ? `(${appliedVoucher.code})` : ''}
                </span>
                <span className="font-semibold text-emerald-600">
                  -{formatVND(discountAmount)}
                </span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 text-base font-extrabold text-slate-900">
                <span>Tổng thanh toán</span>
                <span className="text-indigo-600">{formatVND(finalTotal)}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Đang xử lý đơn hàng...' : 'Đặt hàng'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
