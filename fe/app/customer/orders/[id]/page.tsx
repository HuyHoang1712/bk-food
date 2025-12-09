"use client"

import { use } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, MapPin, Phone, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
import { mockRestaurants, mockOrders } from "@/lib/mock-data"
import { formatPrice, formatDate } from "@/lib/utils/format"

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  preparing: "bg-purple-100 text-purple-800",
  delivering: "bg-orange-100 text-orange-800",
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

const statusSteps = [
  { key: "pending", label: "Đặt hàng", icon: Clock },
  { key: "confirmed", label: "Xác nhận", icon: CheckCircle2 },
  { key: "preparing", label: "Chuẩn bị", icon: Clock },
  { key: "delivering", label: "Giao hàng", icon: Clock },
  { key: "completed", label: "Hoàn thành", icon: CheckCircle2 },
]

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { orders: storeOrders } = useStore()

  const allOrders = [...mockOrders, ...storeOrders]
  const order = allOrders.find((o) => o.id === id)

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Không tìm thấy đơn hàng</p>
          <Button onClick={() => router.push("/customer/orders")} className="bg-orange-500 hover:bg-orange-600">
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  const restaurant = mockRestaurants.find((r) => r.id === order.restaurantId)
  const currentStepIndex = statusSteps.findIndex((step) => step.key === order.status)

  return (
    <div className="min-h-screen bg-orange-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Chi tiết đơn hàng</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        {/* Status */}
        <Card className="p-6 mb-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Đơn hàng #{order.id}</p>
              <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
            </div>
            <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
          </div>

          {/* Progress Steps */}
          {order.status !== "cancelled" && (
            <div className="relative">
              <div className="flex justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon
                  const isCompleted = index <= currentStepIndex
                  const isCurrent = index === currentStepIndex

                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                          isCompleted ? "bg-orange-500 text-white" : "bg-gray-200 text-gray-400"
                        } ${isCurrent ? "ring-4 ring-orange-200" : ""}`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className={`text-xs text-center ${isCompleted ? "text-gray-900" : "text-gray-400"}`}>
                        {step.label}
                      </p>
                    </div>
                  )
                })}
              </div>
              <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10">
                <div
                  className="h-full bg-orange-500 transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                />
              </div>
            </div>
          )}
        </Card>

        {/* Restaurant Info */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3">{restaurant?.name}</h3>
          <div className="space-y-3">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-gray-600">
                  {item.quantity}x {item.menuItem.name}
                </span>
                <span className="font-medium">{formatPrice(item.menuItem.price * item.quantity)}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Delivery Info */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3">Thông tin giao hàng</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Địa chỉ</p>
                <p className="text-sm font-medium">{order.deliveryAddress}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="text-sm font-medium">{order.customerPhone}</p>
              </div>
            </div>
            {order.note && (
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-600">Ghi chú</p>
                  <p className="text-sm font-medium">{order.note}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Payment Summary */}
        <Card className="p-4 mb-4">
          <h3 className="font-semibold mb-3">Chi tiết thanh toán</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tạm tính</span>
              <span>
                {formatPrice(order.items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0))}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Phí giao hàng</span>
              <span>{formatPrice(restaurant?.deliveryFee || 0)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold text-lg">
              <span>Tổng cộng</span>
              <span className="text-orange-600">{formatPrice(order.total)}</span>
            </div>
            <div className="pt-2 border-t">
              <p className="text-sm text-gray-600">Thanh toán khi nhận hàng (COD)</p>
            </div>
          </div>
        </Card>

        {/* Actions */}
        {order.status === "completed" && (
          <Button
            onClick={() => router.push(`/customer/review/${order.id}`)}
            className="w-full bg-orange-500 hover:bg-orange-600"
          >
            Đánh giá đơn hàng
          </Button>
        )}
      </main>
    </div>
  )
}
