"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User, CartItem, Order, Review } from "./types"

interface AppStore {
  currentUser: User | null
  cart: CartItem[]
  orders: Order[]
  reviews: Review[]
<<<<<<< HEAD
  setCurrentUser: (user: User | null) => void
=======

  // ✅ store Basic Auth header string
  authHeader: string | null

  setCurrentUser: (user: User | null) => void
  setAuthHeader: (header: string | null) => void

  // optional convenience
  logout: () => void

>>>>>>> origin/nam-branch
  addToCart: (item: CartItem) => void
  removeFromCart: (menuItemId: string) => void
  updateCartQuantity: (menuItemId: string, quantity: number) => void
  clearCart: () => void
<<<<<<< HEAD
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
=======

  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void

>>>>>>> origin/nam-branch
  addReview: (review: Review) => void
}

export const useStore = create<AppStore>()(
  persist(
    (set) => ({
      currentUser: null,
      cart: [],
      orders: [],
      reviews: [],
<<<<<<< HEAD
      setCurrentUser: (user) => set({ currentUser: user }),
=======

      authHeader: null,

      setCurrentUser: (user) => set({ currentUser: user }),
      setAuthHeader: (header) => set({ authHeader: header }),

      logout: () =>
        set({
          currentUser: null,
          authHeader: null,
          cart: [],
          // orders: [],
          // reviews: [],
        }),

>>>>>>> origin/nam-branch
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find((i) => i.menuItem.id === item.menuItem.id)
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
<<<<<<< HEAD
                i.menuItem.id === item.menuItem.id ? { ...i, quantity: i.quantity + item.quantity } : i,
=======
                i.menuItem.id === item.menuItem.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
>>>>>>> origin/nam-branch
              ),
            }
          }
          return { cart: [...state.cart, item] }
        }),
<<<<<<< HEAD
=======

>>>>>>> origin/nam-branch
      removeFromCart: (menuItemId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.menuItem.id !== menuItemId),
        })),
<<<<<<< HEAD
=======

>>>>>>> origin/nam-branch
      updateCartQuantity: (menuItemId, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i)),
        })),
<<<<<<< HEAD
      clearCart: () => set({ cart: [] }),
      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
=======

      clearCart: () => set({ cart: [] }),

      addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),

>>>>>>> origin/nam-branch
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),
<<<<<<< HEAD
=======

>>>>>>> origin/nam-branch
      addReview: (review) => set((state) => ({ reviews: [...state.reviews, review] })),
    }),
    {
      name: "student-food-delivery-storage",
<<<<<<< HEAD
    },
  ),
)
=======
    }
  )
)
>>>>>>> origin/nam-branch
