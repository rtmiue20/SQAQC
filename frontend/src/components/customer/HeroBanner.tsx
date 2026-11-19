import React from 'react';
import { ArrowDownRight, ShieldCheck, Sparkles, Tag, Truck } from 'lucide-react';

interface HeroBannerProps {
  onExploreClick: () => void;
  onGoToLookup: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExploreClick, onGoToLookup }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-white shadow-xl shadow-slate-900/10 sm:px-10 sm:py-16 lg:px-14">
      {/* Subtle radial accent glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-indigo-600/30 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/3 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl"
      />

      <div className="relative z-10 grid items-center gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3.5 py-1.5 text-xs font-semibold text-indigo-200 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-indigo-300" />
            <span>Bộ Sưu Tập Thu Đông &amp; Tech Essentials 2026</span>
          </div>

          <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.12]">
            Phong cách tối giản,{' '}
            <span className="bg-gradient-to-r from-indigo-300 to-sky-200 bg-clip-text text-transparent">
              trải nghiệm mua sắm chuẩn mực.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Khám phá dòng sản phẩm thời trang hiện đại và phụ kiện công nghệ được tuyển chọn kỹ
            lưỡng tại AURA STORE. Theo dõi tồn kho thời gian thực, áp dụng ưu đãi nhanh chóng và
            tra cứu vận đơn minh bạch.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExploreClick}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500 active:scale-[0.98]"
            >
              <span>Khám phá Bộ sưu tập</span>
              <ArrowDownRight className="h-4 w-4" />
            </button>

            <button
              type="button"
              onClick={onGoToLookup}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/70 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-slate-600 hover:bg-slate-800"
            >
              <span>Tra cứu đơn hàng</span>
            </button>
          </div>
        </div>

        {/* Highlight cards */}
        <div className="grid gap-3.5 sm:grid-cols-2 lg:col-span-5 lg:grid-cols-1">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm transition hover:bg-white/10">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-300">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
                  Mã ưu đãi đang hoạt động
                </p>
                <p className="mt-1 text-sm font-semibold text-white">
                  Nhập <code className="rounded bg-white/10 px-1.5 py-0.5 text-indigo-200">UEH10</code>{' '}
                  &amp; <code className="rounded bg-white/10 px-1.5 py-0.5 text-indigo-200">FREESHIP</code>
                </p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Giảm 10% tối đa 50.000đ (đơn từ 200.000đ) hoặc trừ ngay 30.000đ ship.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <Truck className="h-5 w-5 text-emerald-300" />
              <p className="mt-2.5 text-sm font-semibold text-white">Giao nhanh 24h</p>
              <p className="mt-0.5 text-xs text-slate-300">Nội thành TP.HCM &amp; toàn quốc</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <ShieldCheck className="h-5 w-5 text-sky-300" />
              <p className="mt-2.5 text-sm font-semibold text-white">Tồn kho Live</p>
              <p className="mt-0.5 text-xs text-slate-300">Cập nhật tự động theo đơn hàng</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
