import React, { useState } from 'react';
import {
  AlertTriangle,
  BarChart3,
  DollarSign,
  Package,
  ShoppingCart,
  TrendingUp,
} from 'lucide-react';
import { DashboardSummary, OrderStatus } from '../../types';
import { formatVND, ORDER_STATUS_META } from '../../utils/format';

interface DashboardOverviewProps {
  summary: DashboardSummary | null;
  loading: boolean;
  onJumpToProducts: () => void;
  onJumpToOrders: () => void;
}

type ChartMode = 'daily' | 'category';

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  summary,
  loading,
  onJumpToProducts,
  onJumpToOrders,
}) => {
  const [chartMode, setChartMode] = useState<ChartMode>('daily');

  if (loading || !summary) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div
              key={n}
              className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
            />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-2xl border border-slate-200 bg-white p-6" />
      </div>
    );
  }

  const maxDailyValue = Math.max(
    1,
    ...summary.dailyRevenue.map((d) => Math.max(d.completedRevenue, d.totalOrderValue))
  );
  const maxCategoryValue = Math.max(1, ...summary.categoryRevenue.map((c) => c.revenue));

  const kpis = [
    {
      label: 'Tổng doanh thu (Hoàn thành)',
      value: formatVND(summary.totalCompletedRevenue),
      sub: `${summary.statusCounts.COMPLETED ?? 0} đơn đã hoàn thành`,
      icon: DollarSign,
      iconBg: 'bg-indigo-50 text-indigo-600',
    },
    {
      label: 'Tổng số đơn hàng',
      value: String(summary.totalOrders),
      sub: `${summary.statusCounts.PENDING ?? 0} chờ xác nhận • ${
        summary.statusCounts.SHIPPING ?? 0
      } đang giao`,
      icon: ShoppingCart,
      iconBg: 'bg-slate-100 text-slate-800',
    },
    {
      label: 'Sản phẩm sắp hết hàng (< 5)',
      value: String(summary.lowStockCount),
      sub:
        summary.lowStockCount > 0
          ? 'Cần nhập thêm hàng tồn kho'
          : 'Tất cả sản phẩm đều đủ hàng',
      icon: AlertTriangle,
      iconBg:
        summary.lowStockCount > 0
          ? 'bg-amber-50 text-amber-600'
          : 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Giá trị trung bình đơn',
      value: formatVND(summary.averageOrderValue),
      sub: 'Tính trên các đơn Hoàn thành',
      icon: TrendingUp,
      iconBg: 'bg-emerald-50 text-emerald-600',
    },
  ];

  const statusOrder: OrderStatus[] = ['PENDING', 'SHIPPING', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:border-slate-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-500">{kpi.label}</p>
                  <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">
                    {kpi.value}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${kpi.iconBg}`}
                >
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">{kpi.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Main Analytics Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Bar Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Biểu đồ doanh thu</h3>
                <p className="text-xs text-slate-500">
                  {chartMode === 'daily'
                    ? 'Theo dõi doanh thu hoàn thành & tổng giá trị đặt hàng 7 ngày qua'
                    : 'Doanh thu đơn Hoàn thành phân bổ theo danh mục'}
                </p>
              </div>
            </div>

            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setChartMode('daily')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  chartMode === 'daily'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                7 ngày gần nhất
              </button>
              <button
                type="button"
                onClick={() => setChartMode('category')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                  chartMode === 'category'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Theo danh mục
              </button>
            </div>
          </div>

          {chartMode === 'daily' ? (
            <div className="mt-6">
              <div className="mb-4 flex items-center gap-5 text-xs font-medium text-slate-600">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-indigo-600" />
                  Doanh thu Hoàn thành
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-slate-300" />
                  Tổng đơn hợp lệ (gồm Chờ/Đang giao)
                </span>
              </div>

              <div className="grid h-64 grid-cols-7 items-end gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 px-4 pb-4 pt-8">
                {summary.dailyRevenue.map((point) => {
                  const completedPct = Math.round((point.completedRevenue / maxDailyValue) * 100);
                  const totalPct = Math.round((point.totalOrderValue / maxDailyValue) * 100);

                  return (
                    <div
                      key={point.date}
                      className="group relative flex h-full flex-col items-center justify-end"
                    >
                      {/* Tooltip */}
                      <div className="pointer-events-none absolute -top-6 left-1/2 z-20 hidden w-max -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2 text-[11px] text-white shadow-lg group-hover:block">
                        <p className="font-bold">{point.label} ({point.orderCount} đơn)</p>
                        <p className="text-indigo-300">
                          Hoàn thành: {formatVND(point.completedRevenue)}
                        </p>
                        <p className="text-slate-300">
                          Tổng đặt: {formatVND(point.totalOrderValue)}
                        </p>
                      </div>

                      <div className="flex h-44 w-full items-end justify-center gap-1.5">
                        <div
                          className="w-4 rounded-t-lg bg-indigo-600 transition-all duration-300 group-hover:bg-indigo-500 sm:w-5"
                          style={{
                            height: `${
                              point.completedRevenue > 0 ? Math.max(completedPct, 8) : 3
                            }%`,
                            opacity: point.completedRevenue > 0 ? 1 : 0.2,
                          }}
                        />
                        <div
                          className="w-4 rounded-t-lg bg-slate-300 transition-all duration-300 group-hover:bg-slate-400 sm:w-5"
                          style={{
                            height: `${
                              point.totalOrderValue > 0 ? Math.max(totalPct, 8) : 3
                            }%`,
                            opacity: point.totalOrderValue > 0 ? 1 : 0.25,
                          }}
                        />
                      </div>

                      <span className="mt-2.5 text-xs font-semibold text-slate-600">
                        {point.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {summary.categoryRevenue.map((cat) => {
                const pct = Math.round((cat.revenue / maxCategoryValue) * 100);
                return (
                  <div key={cat.category} className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-bold text-slate-900">{cat.category}</span>
                      <div className="text-right">
                        <span className="font-extrabold text-indigo-600">
                          {formatVND(cat.revenue)}
                        </span>
                        <span className="ml-2 text-xs text-slate-500">
                          ({cat.unitsSold} sản phẩm)
                        </span>
                      </div>
                    </div>
                    <div className="mt-2.5 h-3 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${cat.revenue > 0 ? Math.max(pct, 6) : 0}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side Alerts & Status Breakdown */}
        <div className="space-y-6 lg:col-span-4">
          {/* Status Breakdown */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Trạng thái đơn hàng</h3>
              <button
                type="button"
                onClick={onJumpToOrders}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Quản lý đơn →
              </button>
            </div>
            <div className="mt-4 space-y-2.5">
              {statusOrder.map((st) => {
                const meta = ORDER_STATUS_META[st];
                const count = summary.statusCounts[st] ?? 0;
                return (
                  <div
                    key={st}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-3.5 py-2.5"
                  >
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${meta.badgeClass}`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${meta.dotClass}`} />
                      {meta.label}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 text-sm font-bold text-slate-900">
                <Package className="h-4 w-4 text-amber-500" />
                Cảnh báo tồn kho (&lt; 5)
              </h3>
              <button
                type="button"
                onClick={onJumpToProducts}
                className="text-xs font-semibold text-indigo-600 hover:underline"
              >
                Xem kho →
              </button>
            </div>

            {summary.lowStockProducts.length === 0 ? (
              <p className="mt-4 text-xs text-slate-500">
                Không có sản phẩm nào dưới mức tồn kho an toàn.
              </p>
            ) : (
              <div className="mt-3.5 space-y-2.5">
                {summary.lowStockProducts.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between gap-2 rounded-xl border border-slate-100 bg-slate-50/70 px-3 py-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-xs font-semibold text-slate-900">{p.name}</p>
                      <p className="text-[11px] text-slate-500">{p.category}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-lg px-2 py-0.5 text-xs font-bold ${
                        p.stock === 0
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {p.stock === 0 ? 'Hết hàng (0)' : `Còn ${p.stock}`}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
