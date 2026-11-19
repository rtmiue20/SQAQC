export type AppRole = 'customer' | 'admin';

export type CustomerTab = 'store' | 'lookup';
export type AdminTab = 'dashboard' | 'products' | 'orders';

export type ProductCategory = 'Áo' | 'Quần' | 'Phụ kiện';
export type SortOption = 'default' | 'price_asc' | 'price_desc';

export type OrderStatus = 'PENDING' | 'SHIPPING' | 'COMPLETED' | 'CANCELLED';

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPayload {
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  description: string;
}

export interface Voucher {
  id: number;
  code: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
  maxDiscount: number;
  minOrderAmount: number;
  description: string;
  active: boolean;
}

export interface VoucherValidateResponse {
  valid: boolean;
  code: string;
  discountAmount: number;
  finalTotal: number;
  description: string;
  message: string;
}

export interface CartItem {
  productId: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  imageUrl: string;
  quantity: number;
}

export interface OrderItem {
  id: number;
  productId: number | null;
  productName: string;
  productCategory: string;
  productImageUrl: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface Order {
  id: number;
  orderCode: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  status: OrderStatus;
  statusLabel: string;
  subtotal: number;
  voucherCode: string | null;
  discountAmount: number;
  finalTotal: number;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  voucherCode?: string | null;
  items: { productId: number; quantity: number }[];
}

export interface DailyRevenuePoint {
  date: string;
  label: string;
  completedRevenue: number;
  totalOrderValue: number;
  orderCount: number;
}

export interface CategoryRevenuePoint {
  category: string;
  revenue: number;
  unitsSold: number;
}

export interface DashboardSummary {
  totalCompletedRevenue: number;
  totalOrders: number;
  lowStockCount: number;
  averageOrderValue: number;
  lowStockProducts: Product[];
  statusCounts: Record<OrderStatus, number>;
  dailyRevenue: DailyRevenuePoint[];
  categoryRevenue: CategoryRevenuePoint[];
}

export interface SeedResetResponse {
  success: boolean;
  message: string;
  productsCount: number;
  vouchersCount: number;
  ordersCount: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description?: string;
}
