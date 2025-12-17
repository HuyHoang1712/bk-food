"use client"
import { useRouter } from "next/navigation"
import { LogOut, Plus, Package, UtensilsCrossed } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
// import { mockRestaurants, mockMenuItems, mockOrders } from "@/lib/mock-data"
import { formatPrice, formatDate } from "@/lib/utils/format"
import type { MenuItem, Order, Restaurant } from "@/lib/types"
import { useEffect, useMemo, useState } from "react"

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

  const currentUser = useStore((s) => s.currentUser)
  const authHeader = useStore((s) => s.authHeader)
  const logout = useStore((s) => s.logout)
  const updateOrderStatus = useStore((s) => s.updateOrderStatus)

  const restaurantId = currentUser?.restaurantId

  // fetched data
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [orders, setOrders] = useState<Order[]>([])

  // ui state
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setError(null)
        setIsLoading(true)

        if (!restaurantId) {
          setRestaurant(null)
          setMenuItems([])
          setOrders([])
          setError("Tài khoản này chưa gắn với nhà hàng (restaurantId bị thiếu).")
          return
        }

        if (!authHeader) {
          setRestaurant(null)
          setMenuItems([])
          setOrders([])
          setError("Bạn chưa đăng nhập (thiếu Basic Auth). Vui lòng đăng nhập lại.")
          return
        }

        const headers: HeadersInit = {
          Authorization: authHeader, // ✅ "Basic ..."
        }

        const [restaurantRes, menuRes, ordersRes] = await Promise.all([
          fetch(`/api/restaurants/${restaurantId}`, { headers }),
          fetch(`/api/restaurants/${restaurantId}/menu-items`, { headers }),
          fetch(`/api/orders/restaurant/${restaurantId}`, { headers }),
        ])

        if (!restaurantRes.ok) throw new Error("Failed to fetch restaurant")
        if (!menuRes.ok) throw new Error("Failed to fetch menu items")
        if (!ordersRes.ok) throw new Error("Failed to fetch orders")

        const restaurantData = await restaurantRes.json()
        const menuData = await menuRes.json()
        const ordersData = await ordersRes.json()

        setRestaurant(restaurantData)
        setMenuItems(Array.isArray(menuData) ? menuData : [])
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      } catch (err) {
        console.error(err)
        setError("Không thể tải dữ liệu nhà hàng.")
        setRestaurant(null)
        setMenuItems([])
        setOrders([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAll()
  }, [restaurantId, authHeader])

  const pendingOrders = useMemo(
    () => orders.filter((o) => o.status === "pending" || o.status === "confirmed"),
    [orders]
  )
  const activeOrders = useMemo(
    () => orders.filter((o) => o.status === "preparing" || o.status === "delivering"),
    [orders]
  )
  const completedOrders = useMemo(() => orders.filter((o) => o.status === "completed"), [orders])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  // Optional: keep your UI update function working (local + store)
  const handleUpdateStatus = (orderId: string, status: Order["status"]) => {
    updateOrderStatus(orderId, status) // updates Zustand (if you still use it elsewhere)
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o))) // updates this screen
    // If you have a backend endpoint to update status, call it here too.
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    )
  }

  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <p className="text-gray-600">{error || "Không tìm thấy nhà hàng"}</p>
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
              {orders.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-500">Chưa có đơn hàng nào</p>
                </Card>
              ) : (
                orders
                  .slice()
                  .sort((a, b) => new Date(b.createdAt as any).getTime() - new Date(a.createdAt as any).getTime())
                  .map((order) => (
                    <OrderCard key={order.id} order={order} onUpdateStatus={handleUpdateStatus} />
                  ))
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

  // Unified handler for both Cancel and Next Status
  const handleStatusChange = async (newStatus: Order["status"]) => {
    if (!newStatus) return

    try {
      // 1. Call the backend API
      const updatedOrder = await updateOrderStatusApi(order.id, newStatus)

      // 2. Notify the parent to update local state
      // (We use updatedOrder.status or newStatus)
      onUpdateStatus(updatedOrder.id, updatedOrder.status)
      
    } catch (e: any) {
      alert(e?.message ?? "Cập nhật trạng thái thất bại")
    }
  }

  // Dedicated cancel handler
  const handleCancel = () => {
    if (confirm("Bạn có chắc chắn muốn hủy đơn hàng này?")) {
      handleStatusChange("cancelled")
    }
  }

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-semibold">Đơn hàng #{order.id}</p>
          <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        {/* Make sure statusColors and statusLabels are imported or defined */}
        <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
      </div>

      <div className="space-y-2 mb-3">
        <p className="text-sm font-medium">Món ăn:</p>
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-600">
              {item.quantity}x {item.menuItemName}
            </span>
            {/* <span>{formatPrice(item.menuItem.price * item.quantity)}</span> */}
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
              onClick={handleCancel} // ✅ Now defined
              className="text-red-600 hover:text-red-700 bg-transparent"
            >
              Hủy
            </Button>
          )}
          
          {nextStatus[order.status] && (
            <Button 
              size="sm" 
              // ✅ Correctly passing the specific next status string
              onClick={() => handleStatusChange(nextStatus[order.status]!)} 
              className="bg-blue-500 hover:bg-blue-600"
            >
              {nextStatusLabel[order.status]}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

export async function updateOrderStatusApi(
  orderId: string,
  status: Order["status"]
): Promise<Order> {
  const authHeader = useStore.getState().authHeader
  if (!authHeader) throw new Error("Missing Basic Auth. Please login again.")

  const res = await fetch(`/api/orders/${orderId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: authHeader,
    },
    body: JSON.stringify({ status }),
  })

  if (!res.ok) {
    const msg = await res.text().catch(() => "")
    throw new Error(msg || `Failed: ${res.status}`)
  }

  // backend returns OrderResponse, but we map it into your Order shape
  const data = await res.json()

  const mapped: Order = {
    id: String(data.id),
    restaurantId: String(data.restaurantId),
    customerId: String(data.customerId),
    total: Number(data.total),
    status: data.status,
    deliveryAddress: data.deliveryAddress,
    customerPhone: data.customerPhone,
    createdAt: new Date(data.createdAt), // LocalDateTime string -> Date
    note: data.note ?? undefined,
    items: Array.isArray(data.items)
      ? data.items.map((it: any) => ({
          menuItemName: String(it.menuItemName),
          quantity: Number(it.quantity),
        }))
      : [],
  }

  return mapped
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
