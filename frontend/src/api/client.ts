import {
  CreateOrderPayload,
  DashboardSummary,
  Order,
  OrderStatus,
  Product,
  ProductPayload,
  SeedResetResponse,
  SortOption,
  Voucher,
  VoucherValidateResponse,
} from '../types';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api';

export class ApiError extends Error {
  status: number;
  fieldErrors?: Record<string, string>;

  constructor(message: string, status: number, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers ?? {}),
    },
    ...options,
  });

  const text = await response.text();
  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const errObj = (data ?? {}) as {
      message?: string;
      fieldErrors?: Record<string, string>;
    };
    throw new ApiError(
      errObj.message || `Yêu cầu thất bại (HTTP ${response.status})`,
      response.status,
      errObj.fieldErrors
    );
  }

  return data as T;
}

export const api = {
  getProducts(params?: { search?: string; category?: string; sort?: SortOption }): Promise<Product[]> {
    const sp = new URLSearchParams();
    if (params?.search) sp.set('search', params.search);
    if (params?.category && params.category !== 'Tất cả') sp.set('category', params.category);
    if (params?.sort && params.sort !== 'default') sp.set('sort', params.sort);
    const qs = sp.toString();
    return request<Product[]>(`/products${qs ? `?${qs}` : ''}`);
  },

  createProduct(payload: ProductPayload): Promise<Product> {
    return request<Product>('/products', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  updateProduct(id: number, payload: ProductPayload): Promise<Product> {
    return request<Product>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  deleteProduct(id: number): Promise<{ deleted: boolean; id: number }> {
    return request<{ deleted: boolean; id: number }>(`/products/${id}`, {
      method: 'DELETE',
    });
  },

  getVouchers(): Promise<Voucher[]> {
    return request<Voucher[]>('/vouchers');
  },

  validateVoucher(code: string, subtotal: number): Promise<VoucherValidateResponse> {
    return request<VoucherValidateResponse>('/vouchers/validate', {
      method: 'POST',
      body: JSON.stringify({ code, subtotal }),
    });
  },

  getOrders(status?: OrderStatus | 'ALL'): Promise<Order[]> {
    const qs = status && status !== 'ALL' ? `?status=${encodeURIComponent(status)}` : '';
    return request<Order[]>(`/orders${qs}`);
  },

  lookupOrders(phone: string): Promise<Order[]> {
    return request<Order[]>(`/orders/lookup?phone=${encodeURIComponent(phone)}`);
  },

  createOrder(payload: CreateOrderPayload): Promise<Order> {
    return request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  customerCancelOrder(id: number): Promise<Order> {
    return request<Order>(`/orders/${id}/customer-cancel`, {
      method: 'POST',
    });
  },

  adminUpdateOrderStatus(id: number, status: OrderStatus): Promise<Order> {
    return request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  getDashboardSummary(): Promise<DashboardSummary> {
    return request<DashboardSummary>('/dashboard/summary');
  },

  resetSeedData(): Promise<SeedResetResponse> {
    return request<SeedResetResponse>('/seed/reset', {
      method: 'POST',
    });
  },
};
