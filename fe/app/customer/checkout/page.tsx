"use client"

import type React from "react"

<<<<<<< HEAD
import { useState } from "react"
=======
import { useEffect, useMemo, useState } from "react"
>>>>>>> origin/nam-branch
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
<<<<<<< HEAD
import { mockRestaurants } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils/format"
import type { Order } from "@/lib/types"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, currentUser, clearCart, addOrder } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)
=======
import { formatPrice } from "@/lib/utils/format"
import type { Order } from "@/lib/types"

type CreateOrderRequest = {
  restaurantId: number
  items: { menuItemId: number; quantity: number }[]
  deliveryAddress: string
  customerPhone: string
  note?: string
}

// --- Basic Auth helper (works in browser; fallback included just in case) ---
function toBase64(str: string) {
  if (typeof globalThis.btoa === "function") return globalThis.btoa(str)
  return Buffer.from(str, "utf-8").toString("base64")
}
function basicAuth(email: string, password: string) {
  return "Basic " + toBase64(`${email}:${password}`)
}

export default function CheckoutPage() {
  const router = useRouter()
  // Remove addOrder from destructuring as discussed previously
  const { cart, currentUser, clearCart, authHeader } = useStore() as any

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 1. New State for Restaurant Data
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loadingRestaurant, setLoadingRestaurant] = useState(true)
>>>>>>> origin/nam-branch

  const [formData, setFormData] = useState({
    address: currentUser?.address || "",
    phone: currentUser?.phone || "",
    note: "",
  })

<<<<<<< HEAD
  if (cart.length === 0) {
    router.push("/customer/cart")
    return null
  }

  const restaurantId = cart[0]?.menuItem.restaurantId
  const restaurant = mockRestaurants.find((r) => r.id === restaurantId)
  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
=======
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      address: currentUser?.address || prev.address || "",
      phone: currentUser?.phone || prev.phone || "",
    }))
  }, [currentUser?.address, currentUser?.phone])

  // Redirect if cart is empty
  // useEffect(() => {
  //    if (!cart || cart.length === 0) router.push("/customer/cart")
  // }, [cart, router])

  // Get Restaurant ID safely
  const restaurantId = useMemo(() => {
    return (cart && cart.length > 0) ? cart[0].menuItem?.restaurantId : null
  }, [cart])

  // 2. Fetch Restaurant Data from API
  useEffect(() => {
    if (!restaurantId) {
      setLoadingRestaurant(false)
      return
    }

    const fetchRestaurant = async () => {
      try {
        setLoadingRestaurant(true)
        const res = await fetch(`/api/restaurants/${restaurantId}`)
        if (!res.ok) throw new Error("Could not fetch restaurant info")
        const data = await res.json()
        setRestaurant(data)
      } catch (err) {
        console.error("Error fetching restaurant:", err)
        setError("Không thể tải thông tin phí giao hàng.")
      } finally {
        setLoadingRestaurant(false)
      }
    }

    fetchRestaurant()
  }, [restaurantId])

  // Safety Check
  const multiRestaurant = useMemo(() => {
    const safeCart = cart || []
    const ids = new Set(safeCart.map((x: any) => x.menuItem?.restaurantId))
    return ids.size > 1
  }, [cart])

  const subtotal = useMemo(
    () => (cart || []).reduce((sum: number, item: any) => sum + item.menuItem.price * item.quantity, 0),
    [cart]
  )

  // 3. Derived values based on FETCHED data
>>>>>>> origin/nam-branch
  const deliveryFee = restaurant?.deliveryFee || 0
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
<<<<<<< HEAD
    setIsSubmitting(true)

    // Create order
    const newOrder: Order = {
      id: `o${Date.now()}`,
      customerId: currentUser?.id || "guest",
      restaurantId: restaurantId || "",
      items: cart.map((item) => ({
        menuItem: item.menuItem,
        quantity: item.quantity,
      })),
      total,
      status: "pending",
      deliveryAddress: formData.address,
      customerPhone: formData.phone,
      createdAt: new Date(),
      note: formData.note || undefined,
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    addOrder(newOrder)
    clearCart()

    router.push(`/customer/orders/${newOrder.id}`)
  }

=======
    if (isSubmitting) return

    setError(null)

    if (multiRestaurant) {
      setError("Giỏ hàng đang có món từ nhiều nhà hàng. Vui lòng chỉ chọn 1 nhà hàng.")
      return
    }

    if (!restaurantId) {
      setError("Không xác định được nhà hàng.")
      return
    }

    // ✅ Basic Auth credentials (adjust to your store)
    if (!authHeader) {
      setError("Bạn chưa đăng nhập (thiếu Basic Auth). Vui lòng đăng nhập lại.")
      return
    }

    setIsSubmitting(true)

    try {
      const payload: CreateOrderRequest = {
        restaurantId: Number(restaurantId),
        items: cart.map((item: any) => ({
          menuItemId: Number(item.menuItem.id),
          quantity: Number(item.quantity),
        })),
        deliveryAddress: formData.address,
        customerPhone: formData.phone,
        ...(formData.note?.trim() ? { note: formData.note.trim() } : {}),
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader, // ✅ Basic Auth header
        },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const msg = await res.text().catch(() => "")
        throw new Error(msg || `Request failed: ${res.status}`)
      }

      const savedOrder = await res.json()

      clearCart()
      router.push(`/customer/orders/${savedOrder.id}`)
    } catch (err: any) {
      setError(err?.message ?? "Đặt hàng thất bại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Early return if cart is empty (safe to do here after hooks)
  // if (!cart || cart.length === 0) return null

>>>>>>> origin/nam-branch
  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Xác nhận đơn hàng</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-4">
<<<<<<< HEAD
=======
          {error && (
            <Card className="p-4 border border-red-200 bg-white">
              <p className="text-sm text-red-600">{error}</p>
            </Card>
          )}

>>>>>>> origin/nam-branch
          {/* Delivery Info */}
          <Card className="p-4">
            <h3 className="font-semibold mb-4">Thông tin giao hàng</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Địa chỉ giao hàng
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nhập địa chỉ giao hàng"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Số điện thoại
                </Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Nhập số điện thoại"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ghi chú (tùy chọn)
                </Label>
                <Textarea
                  id="note"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                  placeholder="Ghi chú cho nhà hàng..."
                  rows={3}
                />
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card className="p-4">
<<<<<<< HEAD
            <h3 className="font-semibold mb-4">{restaurant?.name}</h3>
            <div className="space-y-3 mb-4">
              {cart.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {item.quantity}x {item.menuItem.name}
                  </span>
                  <span className="font-medium">{formatPrice(item.menuItem.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí giao hàng</span>
                <span>{formatPrice(deliveryFee)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng</span>
                <span className="text-blue-600">{formatPrice(total)}</span>
              </div>
            </div>
=======
            {/* 4. Handle Loading State in UI */}
            {loadingRestaurant ? (
               <div className="py-4 text-center text-gray-500">Đang tải thông tin nhà hàng...</div>
            ) : (
              <>
                <h3 className="font-semibold mb-4">{restaurant?.name || "Nhà hàng"}</h3>

                <div className="space-y-3 mb-4">
                  {cart.map((item: any) => (
                    <div key={item.menuItem.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.quantity}x {item.menuItem.name}
                      </span>
                      <span className="font-medium">
                        {formatPrice(item.menuItem.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí giao hàng</span>
                    <span>{formatPrice(deliveryFee)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Tổng cộng</span>
                    <span className="text-blue-600">{formatPrice(total)}</span>
                  </div>
                </div>
              </>
            )}
>>>>>>> origin/nam-branch
          </Card>

          {/* Payment Method */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Phương thức thanh toán</h3>
            <p className="text-sm text-gray-600">Thanh toán khi nhận hàng (COD)</p>
          </Card>

          <Button
            type="submit"
<<<<<<< HEAD
            disabled={isSubmitting}
=======
            disabled={isSubmitting || loadingRestaurant}
>>>>>>> origin/nam-branch
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-lg"
          >
            {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </form>
      </main>
    </div>
  )
<<<<<<< HEAD
}
=======
}
>>>>>>> origin/nam-branch
