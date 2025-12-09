"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { mockRestaurants, mockOrders } from "@/lib/mock-data"
import { formatPrice, formatDate } from "@/lib/utils/format"
import type { Order } from "@/lib/types"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  delivering: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

const statusLabels = {
  pending: "Chờ xác nhận",
  confirmed: "Đã xác nhận",
  preparing: "Đang chuẩn bị",
  delivering: "Đang giao",
  completed: "Hoàn thành",
  cancelled: "Đã hủy",
}

export default function OrdersPage() {
  const router = useRouter()
  const { orders: storeOrders, currentUser } = useStore()

  const allOrders = [...mockOrders, ...storeOrders].filter((order) => order.customerId === currentUser?.id)

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
        {allOrders.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-4">Chưa có đơn hàng nào</p>
            <Button onClick={() => router.push("/customer")} className="bg-blue-500 hover:bg-blue-600">
              Đặt món ngay
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {allOrders
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

function OrderCard({ order }: { order: Order }) {
  const router = useRouter()
  const restaurant = mockRestaurants.find((r) => r.id === order.restaurantId)

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => router.push(`/customer/orders/${order.id}`)}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{restaurant?.name}</h3>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
      </div>

      <div className="space-y-1 mb-3">
        {order.items.map((item, index) => (
          <p key={index} className="text-sm text-gray-600">
            {item.quantity}x {item.menuItem.name}
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
