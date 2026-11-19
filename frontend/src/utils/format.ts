import { OrderStatus } from '../types';

export function formatVND(value: number | string | null | undefined): string {
  const num = Number(value ?? 0);
  if (!Number.isFinite(num)) {
    return '0 ₫';
  }
  const sign = num < 0 ? '-' : '';
  const absRounded = Math.round(Math.abs(num));
  return `${sign}${absRounded.toLocaleString('vi-VN')} ₫`;
}

export function formatDateTime(iso: string | null | undefined): string {
  if (!iso) return '—';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export const ORDER_STATUS_META: Record<
  OrderStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  PENDING: {
    label: 'Chờ xác nhận',
    badgeClass: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200',
    dotClass: 'bg-amber-500',
  },
  SHIPPING: {
    label: 'Đang giao hàng',
    badgeClass: 'bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200',
    dotClass: 'bg-indigo-500',
  },
  COMPLETED: {
    label: 'Hoàn thành',
    badgeClass: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  CANCELLED: {
    label: 'Đã hủy',
    badgeClass: 'bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200',
    dotClass: 'bg-rose-500',
  },
};

export const FALLBACK_PRODUCT_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="600" viewBox="0 0 600 600">` +
      `<rect width="600" height="600" fill="#f1f5f9"/>` +
      `<rect x="180" y="170" width="240" height="200" rx="24" fill="#e2e8f0"/>` +
      `<circle cx="250" cy="240" r="24" fill="#cbd5e1"/>` +
      `<path d="M200 340l70-65 55 50 40-35 55 50H200z" fill="#94a3b8"/>` +
      `<text x="300" y="430" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="600" fill="#64748b">AURA STORE</text>` +
      `</svg>`
  );
