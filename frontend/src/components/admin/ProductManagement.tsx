import React, { useMemo, useState } from 'react';
import { Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { api } from '../../api/client';
import { Product, ProductPayload } from '../../types';
import { FALLBACK_PRODUCT_IMAGE, formatVND } from '../../utils/format';
import { ConfirmModal } from '../ConfirmModal';
import { ProductFormModal } from './ProductFormModal';

interface ProductManagementProps {
  products: Product[];
  loading: boolean;
  onChanged: () => Promise<void> | void;
  notify: (type: 'success' | 'error' | 'warning' | 'info', title: string, description?: string) => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  loading,
  onChanged,
  notify,
}) => {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    );
  }, [products, search]);

  const openCreateModal = () => {
    setModalMode('create');
    setEditingProduct(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleSaveProduct = async (payload: ProductPayload) => {
    setSaving(true);
    try {
      if (modalMode === 'create') {
        const created = await api.createProduct(payload);
        notify('success', 'Đã thêm sản phẩm mới', created.name);
      } else if (editingProduct) {
        const updated = await api.updateProduct(editingProduct.id, payload);
        notify('success', 'Đã cập nhật sản phẩm', updated.name);
      }
      setModalOpen(false);
      await onChanged();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể lưu sản phẩm';
      notify('error', 'Lỗi thao tác', msg);
    } finally {
      setSaving(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteProduct(deleteTarget.id);
      notify('success', 'Đã xóa sản phẩm', deleteTarget.name);
      setDeleteTarget(null);
      await onChanged();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không thể xóa sản phẩm';
      notify('error', 'Xóa thất bại', msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header Toolbar */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-extrabold text-slate-900">Quản lý Sản phẩm &amp; Kho</h2>
          <p className="text-xs text-slate-500">
            Tổng cộng {products.length} mã sản phẩm đang được quản lý
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative sm:w-64">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm sản phẩm, danh mục..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-10 pr-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4" />
            <span>Thêm sản phẩm mới</span>
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="px-5 py-3.5">Sản phẩm</th>
                <th className="px-4 py-3.5">Danh mục</th>
                <th className="px-4 py-3.5 text-right">Giá bán</th>
                <th className="px-4 py-3.5 text-center">Tồn kho</th>
                <th className="px-4 py-3.5 text-center">Trạng thái</th>
                <th className="px-5 py-3.5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-sm text-slate-500">
                    Không có sản phẩm nào phù hợp.
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="transition hover:bg-slate-50/70">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.imageUrl || FALLBACK_PRODUCT_IMAGE}
                          alt={product.name}
                          onError={(e) => {
                            if (e.currentTarget.src !== FALLBACK_PRODUCT_IMAGE) {
                              e.currentTarget.src = FALLBACK_PRODUCT_IMAGE;
                            }
                          }}
                          className="h-11 w-11 shrink-0 rounded-xl object-cover bg-slate-100"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-400">ID #{product.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="inline-flex rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {product.category}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3.5 text-right font-bold ${
                        product.price <= 0 ? 'text-rose-600' : 'text-slate-900'
                      }`}
                    >
                      {formatVND(product.price)}
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono font-bold text-slate-800">
                      {product.stock}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      {product.stock === 0 ? (
                        <span className="inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-200">
                          Hết hàng
                        </span>
                      ) : product.stock < 5 ? (
                        <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                          Sắp hết
                        </span>
                      ) : (
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          Còn hàng
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          <span>Sửa</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(product)}
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-rose-600 transition hover:border-rose-200 hover:bg-rose-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Xóa</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ProductFormModal
        open={modalOpen}
        mode={modalMode}
        initialProduct={editingProduct}
        submitting={saving}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSaveProduct}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={`Xóa sản phẩm "${deleteTarget?.name ?? ''}"?`}
        description="Sản phẩm sẽ bị xóa khỏi danh mục bán hàng. Các đơn hàng lịch sử trước đó vẫn được giữ nguyên thông tin."
        confirmText="Xóa sản phẩm"
        cancelText="Hủy"
        variant="danger"
        isLoading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
