"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { mockRestaurants, mockOrders } from "@/lib/mock-data"
import { formatPrice, formatDate } from "@/lib/utils/format"
import type { Order, Restaurant } from "@/lib/types"
import { useEffect, useState } from "react"

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  delivering: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels: Record<string, string> = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  delivering: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
}
// ----------------------

export default function OrdersPage() {
  const router = useRouter()
  const { authHeader } = useStore();
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
    // Optional: Guard clause if user isn't logged in yet
    if (!authHeader) {
        console.warn("No auth header found")
        return 
    }

    try {
        setIsLoading(true)
        
        // 2. Pass the header in the options object
        const response = await fetch('/api/orders/me', {
            method: 'GET', // Good practice to be explicit
            headers: {
                "Authorization": authHeader 
            }
        })
        
        if (!response.ok) {
            throw new Error('Failed to fetch orders')
        }

        const data = await response.json()
        setOrders(data)
    } catch (err) {
        console.error("Error loading orders:", err)
        setError("Không thể tải danh sách đơn hàng")
    } finally {
        setIsLoading(false)
    }
}

    fetchOrders()
  }, [])

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Đơn hàng của tôi</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="text-center py-12 text-red-500">
            {error}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Chưa có đơn hàng nào</p>
            <Button onClick={() => router.push("/customer")} className="bg-blue-500 hover:bg-blue-600">
              Đặt món ngay
            </Button>
          </div>
        )}

        {/* Order List */}
        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-4">
            {orders
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
          </div>
        )}
      </main>
    </div>
  )
}

function OrderCard({ order }: { order: any }) { 
  const router = useRouter()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const res = await fetch(`/api/restaurants/${order.restaurantId}`)
        if (res.ok) {
          const data = await res.json()
          setRestaurant(data)
        }
      } catch (error) {
        console.error("Failed to load restaurant name", error)
      }
    }
    if (order.restaurantId) {
      fetchRestaurant()
    }
  }, [order.restaurantId])

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/customer/orders/${order.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">
            {restaurant ? restaurant.name : `Nhà hàng #${order.restaurantId}`}
          </h3>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        
        {/* Using your status constants */}
        <Badge className={statusColors[order.status] || "bg-gray-100 text-gray-800"}>
          {statusLabels[order.status] || order.status}
        </Badge>
      </div>

      <div className="space-y-1 mb-3">
        {order.items.map((item: any, index: number) => (
          <p key={index} className="text-sm text-gray-600">
            {item.quantity}x {item.menuItemName}
          </p>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t">
        <span className="text-sm text-gray-600">Tổng cộng</span>
        <span className="font-semibold text-blue-600">{formatPrice(order.total)}</span>
      </div>
    </Card>
  )
}