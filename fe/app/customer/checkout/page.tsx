"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { mockRestaurants } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils/format"
import type { Order } from "@/lib/types"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, currentUser, clearCart, addOrder } = useStore()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    address: currentUser?.address || "",
    phone: currentUser?.phone || "",
    note: "",
  })

  if (cart.length === 0) {
    router.push("/customer/cart")
    return null
  }

  const restaurantId = cart[0]?.menuItem.restaurantId
  const restaurant = mockRestaurants.find((r) => r.id === restaurantId)
  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
  const deliveryFee = restaurant?.deliveryFee || 0
  const total = subtotal + deliveryFee

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
          </Card>

          {/* Payment Method */}
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Phương thức thanh toán</h3>
            <p className="text-sm text-gray-600">Thanh toán khi nhận hàng (COD)</p>
          </Card>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-lg"
          >
            {isSubmitting ? "Đang xử lý..." : "Đặt hàng"}
          </Button>
        </form>
      </main>
    </div>
  )
}
