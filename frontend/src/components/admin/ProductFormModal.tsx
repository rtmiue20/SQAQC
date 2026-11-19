import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Product, ProductPayload } from '../../types';

interface ProductFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialProduct: Product | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (payload: ProductPayload) => Promise<void>;
}

const CATEGORIES = ['Áo', 'Quần', 'Phụ kiện'];

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  open,
  mode,
  initialProduct,
  submitting,
  onClose,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Áo');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open) return;
    if (mode === 'edit' && initialProduct) {
      setName(initialProduct.name);
      setCategory(initialProduct.category);
      setPrice(String(initialProduct.price));
      setStock(String(initialProduct.stock));
      setImageUrl(initialProduct.imageUrl);
      setDescription(initialProduct.description ?? '');
    } else {
      setName('');
      setCategory('Áo');
      setPrice('');
      setStock('10');
      setImageUrl('');
      setDescription('');
    }
    setErrors({});
  }, [open, mode, initialProduct]);

  if (!open) return null;

  const validate = (): { valid: boolean; parsedPrice: number; parsedStock: number } => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim()) {
      nextErrors.name = 'Vui lòng nhập tên sản phẩm';
    }
    if (!category.trim()) {
      nextErrors.category = 'Vui lòng chọn danh mục';
    }

    const parsedPrice = Number(price);
    if (price.trim() === '' || Number.isNaN(parsedPrice)) {
      nextErrors.price = 'Vui lòng nhập giá bán hợp lệ';
    } else if (mode === 'edit' && parsedPrice <= 0) {
      // [SQA-BUG-01] Only Edit mode rejects <= 0; Create mode intentionally allows 0 or negative price
      nextErrors.price = 'Giá bán phải lớn hơn 0';
    }

    const parsedStock = Number(stock);
    if (stock.trim() === '' || Number.isNaN(parsedStock) || !Number.isInteger(parsedStock)) {
      nextErrors.stock = 'Số lượng tồn kho phải là số nguyên';
    } else if (parsedStock < 0) {
      nextErrors.stock = 'Số lượng tồn kho không được âm';
    }

    setErrors(nextErrors);
    return {
      valid: Object.keys(nextErrors).length === 0,
      parsedPrice,
      parsedStock,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { valid, parsedPrice, parsedStock } = validate();
    if (!valid) return;

    await onSubmit({
      name: name.trim(),
      category: category.trim(),
      price: parsedPrice,
      stock: parsedStock,
      imageUrl: imageUrl.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">
              {mode === 'create' ? 'Thêm sản phẩm mới' : 'Chỉnh sửa sản phẩm'}
            </h3>
            <p className="text-xs text-slate-500">
              {mode === 'create'
                ? 'Nhập thông tin chi tiết để đưa sản phẩm lên cửa hàng.'
                : `Cập nhật thông tin cho #${initialProduct?.id}`}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={submitting}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* [SQA-BUG-01] noValidate + step="any" without min on price allows testing price <= 0 on Create */}
        <form onSubmit={handleSubmit} className="space-y-4 p-6" noValidate>
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Tên sản phẩm <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Áo Khoác Denim Minimalist"
              className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
                errors.name
                  ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                  : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-rose-600">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Danh mục <span className="text-rose-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Giá bán (VNĐ) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                step="any"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="450000"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
                  errors.price
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                }`}
              />
              {errors.price && <p className="mt-1 text-xs text-rose-600">{errors.price}</p>}
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Tồn kho <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min={0}
                step={1}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="10"
                className={`w-full rounded-xl border px-3.5 py-2.5 text-sm outline-none transition ${
                  errors.stock
                    ? 'border-rose-300 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10'
                    : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10'
                }`}
              />
              {errors.stock && <p className="mt-1 text-xs text-rose-600">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              URL hình ảnh (Unsplash)
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Để trống sẽ dùng ảnh mặc định"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700">
              Mô tả ngắn
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Chất liệu, thông số nổi bật..."
              className="w-full resize-none rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:opacity-60"
            >
              {submitting
                ? 'Đang lưu...'
                : mode === 'create'
                ? 'Lưu sản phẩm'
                : 'Cập nhật'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
