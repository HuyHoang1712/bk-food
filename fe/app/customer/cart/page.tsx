"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { mockRestaurants } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils/format"
import { useEffect, useState } from "react"
import { Restaurant } from "@/lib/types"

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateCartQuantity } = useStore()
  
  // 1. State for the specific restaurant
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)

  // 2. Derive Restaurant ID from the first item in the cart
  // (Assuming all items in cart belong to one restaurant)
  const restaurantId = cart.length > 0 ? cart[0].menuItem.restaurantId : null

  // 3. Fetch Restaurant Data
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId) return

      try {
        const response = await fetch(`/api/restaurants/${restaurantId}`)
        if (response.ok) {
          const data = await response.json()
          setRestaurant(data)
        }
      } catch (error) {
        console.error("Failed to fetch restaurant details:", error)
      }
    }

    fetchRestaurant()
  }, [restaurantId])

  // Empty State
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-blue-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-xl font-semibold">Giỏ hàng</h1>
            </div>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-500 mb-4">Giỏ hàng trống</p>
          <Button onClick={() => router.push("/customer")} className="bg-blue-500 hover:bg-blue-600">
            Đặt món ngay
          </Button>
        </div>
      </div>
    )
  }

  // 4. Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0)
  
  // Use fetched delivery fee (or default to 0/36 if not loaded yet)
  const deliveryFee = restaurant?.deliveryFee || 36
  const total = subtotal + deliveryFee

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Giỏ hàng</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Card className="p-4 mb-4">
          {/* Display fetched name or placeholder */}
          <h3 className="font-semibold mb-4">
            {restaurant ? restaurant.name : "Đang tải..."}
          </h3>
          
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.menuItem.id} className="flex gap-4">
                <img
                  src={item.menuItem.image || "/placeholder.svg"}
                  alt={item.menuItem.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium mb-1">{item.menuItem.name}</h4>
                  <p className="text-blue-600 font-semibold mb-2">{formatPrice(item.menuItem.price)}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 border rounded-lg">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartQuantity(item.menuItem.id, Math.max(1, item.quantity - 1))}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateCartQuantity(item.menuItem.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => removeFromCart(item.menuItem.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(item.menuItem.price * item.quantity)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-4">Chi tiết thanh toán</h3>
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

        <Button
          onClick={() => router.push("/customer/checkout")}
          className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-lg"
          // Prevent checkout until we have restaurant data (to ensure fees/ids are correct)
          
        >
          Đặt hàng
        </Button>
      </main>
    </div>
  )
}
