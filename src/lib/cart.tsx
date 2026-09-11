"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";

export interface CartItem {
  productId: string;
  name: string;
  price: string;
  imageUrl?: string;
  slug: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD"; item: CartItem }
  | { type: "BUY_NOW"; item: CartItem }
  | { type: "REMOVE"; productId: string }
  | { type: "SET_QTY"; productId: string; quantity: number }
  | { type: "CLEAR" }
  | { type: "LOAD"; items: CartItem[] };

function cartReducer(
  state: CartState,
  action: CartAction
): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find(
        (i) => i.productId === action.item.productId
      );

      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.item.productId
              ? {
                  ...i,
                  quantity: Math.min(
                    i.quantity + action.item.quantity,
                    i.stock
                  ),
                }
              : i
          ),
        };
      }

      return {
        items: [
          ...state.items,
          {
            ...action.item,
            quantity: Math.min(
              action.item.quantity,
              action.item.stock
            ),
          },
        ],
      };
    }

    case "BUY_NOW":
      return {
        items: [
          {
            ...action.item,
            quantity: Math.max(
              1,
              Math.min(action.item.quantity, action.item.stock)
            ),
          },
        ],
      };

    case "REMOVE":
      return {
        items: state.items.filter(
          (i) => i.productId !== action.productId
        ),
      };

    case "SET_QTY":
      return {
        items: state.items.map((i) =>
          i.productId === action.productId
            ? {
                ...i,
                quantity: Math.max(
                  1,
                  Math.min(action.quantity, i.stock)
                ),
              }
            : i
        ),
      };

    case "CLEAR":
      return { items: [] };

    case "LOAD":
      return { items: action.items };

    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (item: CartItem) => void;
  buyNow: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  setQuantity: (
    productId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext =
  createContext<CartContextValue | null>(null);

const CART_KEY = "ryven_cart";

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(
    cartReducer,
    { items: [] }
  );

  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_KEY);

      if (saved) {
        dispatch({
          type: "LOAD",
          items: JSON.parse(saved),
        });
      }
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        CART_KEY,
        JSON.stringify(state.items)
      );
    } catch {}
  }, [state.items]);

  const addItem = (item: CartItem) =>
    dispatch({
      type: "ADD",
      item,
    });

  const buyNow = (item: CartItem) =>
    dispatch({
      type: "BUY_NOW",
      item,
    });

  const removeItem = (productId: string) =>
    dispatch({
      type: "REMOVE",
      productId,
    });

  const setQuantity = (
    productId: string,
    quantity: number
  ) =>
    dispatch({
      type: "SET_QTY",
      productId,
      quantity,
    });

  const clearCart = () =>
    dispatch({
      type: "CLEAR",
    });

  const subtotal = state.items.reduce(
    (sum, item) =>
      sum + parseFloat(item.price) * item.quantity,
    0
  );

  const itemCount = state.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        ...state,
        addItem,
        buyNow,
        removeItem,
        setQuantity,
        clearCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error(
      "useCart must be within CartProvider"
    );
  }

  return ctx;
}
