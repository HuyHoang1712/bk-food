"use client"
import { useRouter } from "next/navigation"
import { LogOut, Plus, Package, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { mockRestaurants, mockMenuItems, mockOrders } from "@/lib/mock-data"
import { formatPrice, formatDate } from "@/lib/utils/format"
import type { MenuItem, Order } from "@/lib/types"

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

export default function RestaurantDashboard() {
  const router = useRouter()
  const { currentUser, setCurrentUser, orders: storeOrders, updateOrderStatus } = useStore()

  const restaurant = mockRestaurants.find((r) => r.id === currentUser?.restaurantId)
  const menuItems = mockMenuItems.filter((item) => item.restaurantId === currentUser?.restaurantId)
  const allOrders = [...mockOrders, ...storeOrders].filter((order) => order.restaurantId === currentUser?.restaurantId)

  const pendingOrders = allOrders.filter((o) => o.status === "pending" || o.status === "confirmed")
  const activeOrders = allOrders.filter((o) => o.status === "preparing" || o.status === "delivering")
  const completedOrders = allOrders.filter((o) => o.status === "completed")

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/")
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy nhà hàng</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-blue-600">{restaurant.name}</h1>
              <p className="text-sm text-gray-600">Quản lý nhà hàng</p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Package className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đơn chờ</p>
                <p className="text-2xl font-bold">{pendingOrders.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <UtensilsCrossed className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Đang xử lý</p>
                <p className="text-2xl font-bold">{activeOrders.length}</p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold">{completedOrders.length}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="orders" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="orders">Đơn hàng</TabsTrigger>
            <TabsTrigger value="menu">Menu</TabsTrigger>
          </TabsList>

          <TabsContent value="orders" className="mt-6">
            <div className="space-y-4">
              {allOrders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">Chưa có đơn hàng nào</p>
                </Card>
              ) : (
                allOrders
                  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                  .map((order) => <OrderCard key={order.id} order={order} onUpdateStatus={updateOrderStatus} />)
              )}
            </div>
          </TabsContent>

          <TabsContent value="menu" className="mt-6">
            <div className="mb-4">
              <Button onClick={() => router.push("/restaurant/menu/add")} className="bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 mr-2" />
                Thêm món mới
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map((item) => (
                <MenuItemCard key={item.id} item={item} onEdit={() => router.push(`/restaurant/menu/${item.id}`)} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function OrderCard({
  order,
  onUpdateStatus,
}: {
  order: Order
  onUpdateStatus: (orderId: string, status: Order["status"]) => void
}) {
  const nextStatus: Record<Order["status"], Order["status"] | null> = {
    pending: "confirmed",
    confirmed: "preparing",
    preparing: "delivering",
    delivering: "completed",
    completed: null,
    cancelled: null,
  }

  const nextStatusLabel: Record<Order["status"], string | null> = {
    pending: "Xác nhận",
    confirmed: "Bắt đầu chuẩn bị",
    preparing: "Giao hàng",
    delivering: "Hoàn thành",
    completed: null,
    cancelled: null,
  }

  const handleUpdateStatus = () => {
    const next = nextStatus[order.status]
    if (next) {
      onUpdateStatus(order.id, next)
    }
  }

  const handleCancel = () => {
    onUpdateStatus(order.id, "cancelled")
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold">Đơn hàng #{order.id}</p>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
      </div>

      <div className="space-y-2 mb-3">
        <p className="text-sm font-medium">Món ăn:</p>
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.quantity}x {item.menuItem.name}
            </span>
            <span>{formatPrice(item.menuItem.price * item.quantity)}</span>
          </div>
        ))}
      </div>

      <div className="border-t pt-3 mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Địa chỉ:</span>
          <span className="text-right">{order.deliveryAddress}</span>
        </div>
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">SĐT:</span>
          <span>{order.customerPhone}</span>
        </div>
        {order.note && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Ghi chú:</span>
            <span className="text-right">{order.note}</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pt-3 border-t">
        <span className="font-semibold text-blue-600">{formatPrice(order.total)}</span>
        <div className="flex gap-2">
          {order.status !== "completed" && order.status !== "cancelled" && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="text-red-600 hover:text-red-700 bg-transparent"
            >
              Hủy
            </Button>
          )}
          {nextStatus[order.status] && (
            <Button size="sm" onClick={handleUpdateStatus} className="bg-blue-500 hover:bg-blue-600">
              {nextStatusLabel[order.status]}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

function MenuItemCard({ item, onEdit }: { item: MenuItem; onEdit: () => void }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-full h-40 object-cover" />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold">{item.name}</h3>
          <Badge variant={item.available ? "default" : "secondary"}>{item.available ? "Còn" : "Hết"}</Badge>
        </div>
        <p className="text-sm text-gray-600 mb-2">{item.description}</p>
        <div className="flex items-center justify-between">
          <span className="text-blue-600 font-semibold">{formatPrice(item.price)}</span>
          <Button variant="outline" size="sm" onClick={onEdit}>
            Chỉnh sửa
          </Button>
        </div>
      </div>
    </Card>
  )
}
