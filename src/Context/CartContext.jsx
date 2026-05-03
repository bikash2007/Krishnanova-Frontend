import React, { createContext, useContext, useState } from "react";
const CartContext = createContext();

export function useCart() {
  return useContext(CartContext);
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() =>
    JSON.parse(localStorage.getItem("cart") || "[]"),
  );

  const getStockLimit = (item) => {
    if (item?.availableStock === undefined || item?.availableStock === null) {
      return Number.POSITIVE_INFINITY;
    }
    const availableStock = Number(item?.availableStock ?? 0);
    const isPreOrder = !!item?.isPreOrder;
    if (availableStock === 0 && isPreOrder) return Number.POSITIVE_INFINITY;
    return Math.max(0, availableStock);
  };

  const addToCart = (product, qty = 1) => {
    let outcome = { ok: true, message: "Added to cart" };

    setCart((prev) => {
      // Create a unique identifier for this specific product + variant/color combination
      const cartItemId = `${product._id}-${product.selectedVariantId || product.selectedVariant || "none"}-${product.selectedColor || "none"}`;
      const found = prev.find((p) => p.cartItemId === cartItemId);
      let updated;

      const limit = getStockLimit(product);
      const currentQty = found?.quantity || 0;
      const nextQty = currentQty + qty;
      const safeQty =
        Number.isFinite(limit) && limit >= 0
          ? Math.min(nextQty, limit)
          : nextQty;

      if (Number.isFinite(limit) && safeQty <= currentQty) {
        outcome = {
          ok: false,
          message:
            limit <= 0
              ? "This variant is out of stock"
              : `Only ${limit} left for this variant`,
        };
        return prev;
      }

      if (found) {
        updated = prev.map((p) =>
          p.cartItemId === cartItemId
            ? {
                ...p,
                quantity: safeQty,
                availableStock: product.availableStock,
                isPreOrder: !!product.isPreOrder,
              }
            : p,
        );
      } else {
        updated = [
          ...prev,
          {
            cartItemId,
            productId: product._id,
            title: product.title,
            price: product.price,
            image: product.images?.[0] || product.media?.[0]?.url || "",
            quantity: Number.isFinite(limit) ? Math.min(qty, limit) : qty,
            selectedColor: product.selectedColor || null,
            selectedVariant: product.selectedVariant || null,
            selectedVariantId: product.selectedVariantId || null,
            sku: product.sku || null,
            availableStock: Number(product.availableStock ?? 0),
            isPreOrder: !!product.isPreOrder,
          },
        ];
      }

      outcome = {
        ok: true,
        message: !!product.isPreOrder
          ? "Pre-order item added"
          : "Added to cart",
      };

      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    return outcome;
  };

  const removeFromCart = (cartItemId) =>
    setCart((prev) => {
      const updated = prev.filter((p) => p.cartItemId !== cartItemId);
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

  const updateQuantity = (cartItemId, qty) => {
    let outcome = { ok: true };

    setCart((prev) => {
      const row = prev.find((p) => p.cartItemId === cartItemId);
      if (!row) return prev;

      const limit = getStockLimit(row);
      const safeQty = Number.isFinite(limit)
        ? Math.max(1, Math.min(qty, limit))
        : Math.max(1, qty);

      if (Number.isFinite(limit) && qty > limit) {
        outcome = {
          ok: false,
          message: `Only ${limit} left for this variant`,
          quantity: safeQty,
        };
      }

      const updated = prev.map((p) =>
        p.cartItemId === cartItemId ? { ...p, quantity: safeQty } : p,
      );
      localStorage.setItem("cart", JSON.stringify(updated));
      return updated;
    });

    return outcome;
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem("cart");
  };
  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}
