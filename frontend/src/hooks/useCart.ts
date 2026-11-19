import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'aura_store_cart_v1';

function readInitialCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useCart(products: Product[]) {
  const [items, setItems] = useState<CartItem[]>(readInitialCart);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items]);

  // Synchronize cart metadata (price, stock, name) when products reload from backend
  useEffect(() => {
    if (products.length === 0) return;
    const productMap = new Map(products.map((p) => [p.id, p]));

    setItems((prev) => {
      let changed = false;
      const next: CartItem[] = [];
      for (const item of prev) {
        const latest = productMap.get(item.productId);
        if (!latest || latest.stock <= 0) {
          changed = true;
          continue;
        }
        const clampedQty = Math.min(item.quantity, latest.stock);
        if (
          clampedQty !== item.quantity ||
          latest.price !== item.price ||
          latest.stock !== item.stock ||
          latest.name !== item.name ||
          latest.imageUrl !== item.imageUrl
        ) {
          changed = true;
        }
        next.push({
          productId: latest.id,
          name: latest.name,
          category: latest.category,
          price: latest.price,
          stock: latest.stock,
          imageUrl: latest.imageUrl,
          quantity: clampedQty,
        });
      }
      return changed ? next : prev;
    });
  }, [products]);

  const addItem = useCallback((product: Product): { ok: boolean; reason?: string } => {
    if (product.stock <= 0) {
      return { ok: false, reason: 'Sản phẩm hiện đã hết hàng' };
    }

    let blocked = false;
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          blocked = true;
          return prev;
        }
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, quantity: i.quantity + 1, stock: product.stock, price: product.price }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          price: product.price,
          stock: product.stock,
          imageUrl: product.imageUrl,
          quantity: 1,
        },
      ];
    });

    if (blocked) {
      return { ok: false, reason: `Không thể thêm vượt quá tồn kho (${product.stock})` };
    }
    return { ok: true };
  }, []);

  const updateQuantity = useCallback(
    (productId: number, delta: number): { ok: boolean; reason?: string } => {
      let errorReason: string | undefined;
      setItems((prev) =>
        prev.flatMap((item) => {
          if (item.productId !== productId) return [item];
          const nextQty = item.quantity + delta;
          if (nextQty <= 0) return [];
          const liveProduct = products.find((p) => p.id === productId);
          const maxStock = liveProduct ? liveProduct.stock : item.stock;
          if (nextQty > maxStock) {
            errorReason = `Số lượng không được vượt quá tồn kho (${maxStock})`;
            return [item];
          }
          return [{ ...item, quantity: nextQty, stock: maxStock }];
        })
      );
      return errorReason ? { ok: false, reason: errorReason } : { ok: true };
    },
    [products]
  );

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalQuantity = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return {
    items,
    totalQuantity,
    subtotal,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
  };
}
