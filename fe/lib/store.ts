"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, CartItem, Order, Review } from "./types"

interface AppStore {
  currentUser: User | null
  cart: CartItem[]
  orders: Order[]
  reviews: Review[]
  setCurrentUser: (user: User | null) => void
  addToCart: (item: CartItem) => void
  removeFromCart: (menuItemId: string) => void
  updateCartQuantity: (menuItemId: string, quantity: number) => void
  clearCart: () => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  addReview: (review: Review) => void
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      currentUser: null,
      cart: [],
      orders: [],
      reviews: [],
      setCurrentUser: (user) => set({ currentUser: user }),
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((i) => i.menuItem.id === item.menuItem.id)
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.menuItem.id === item.menuItem.id ? { ...i, quantity: i.quantity + item.quantity } : i,
              ),
            }
          }
          return { cart: [...state.cart, item] }
        }),
      removeFromCart: (menuItemId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.menuItem.id !== menuItemId),
        })),
      updateCartQuantity: (menuItemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ cart: [] }),
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),
      addReview: (review) => set((state) => ({ reviews: [...state.reviews, review] })),
    }),
    {
      name: "student-food-delivery-storage",
    },
  ),
)
