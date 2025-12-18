"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { LogOut, MapPin, Clock, Navigation2, Phone, CheckCircle2, History, Route as RouteIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStore } from "@/lib/store"
import { mockDeliveryAssignments, mockOrders, mockRestaurants } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils/format"
import type { DeliveryAssignment, DeliveryStatus, Order } from "@/lib/types"

const statusConfig: Record<DeliveryStatus, { label: string; className: string }> = {
  assigned: { label: "Chờ xác nhận", className: "bg-yellow-100 text-yellow-800" },
  accepted: { label: "Đã nhận đơn", className: "bg-blue-100 text-blue-800" },
  in_transit: { label: "Đang giao", className: "bg-blue-100 text-blue-800" },
  completed: { label: "Hoàn thành", className: "bg-green-100 text-green-800" },
  cancelled: { label: "Đã hủy", className: "bg-red-100 text-red-800" },
}

const statusAction: Record<DeliveryStatus, { next: DeliveryStatus | null; label: string | null }> = {
  assigned: { next: "accepted", label: "Xác nhận nhận đơn" },
  accepted: { next: "in_transit", label: "Bắt đầu giao" },
  in_transit: { next: "completed", label: "Hoàn tất giao" },
  completed: { next: null, label: null },
  cancelled: { next: null, label: null },
}

export default function DeliveryDashboard() {
  const router = useRouter()
  const {
    currentUser,
    setCurrentUser,
    orders: storeOrders,
    deliveryAssignments,
    updateDeliveryAssignmentStatus,
  } = useStore()

  //const assignments = deliveryAssignments.length ? deliveryAssignments : mockDeliveryAssignments
  const assignments =
  (deliveryAssignments?.length ? deliveryAssignments : mockDeliveryAssignments) ?? [];


  const driverAssignments = useMemo(
    () => assignments.filter((assignment) => assignment.driverId === currentUser?.id),
    [assignments, currentUser?.id],
  )

  const allOrders: Order[] = useMemo(() => {
    const combined = [...mockOrders, ...storeOrders]
    const uniqueMap = new Map<string, Order>()
    combined.forEach((order) => {
      if (!uniqueMap.has(order.id)) {
        uniqueMap.set(order.id, order)
      }
    })
    return Array.from(uniqueMap.values())
  }, [storeOrders])

  const activeAssignments = driverAssignments.filter(
    (assignment) => assignment.status !== "completed" && assignment.status !== "cancelled",
  )

  const historyAssignments = driverAssignments.filter((assignment) => assignment.status === "completed")

  const totalDistance = historyAssignments.reduce((sum, assignment) => sum + assignment.distanceKm, 0)

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/")
  }

  if (!currentUser || currentUser.role !== "delivery") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-blue-50">
        <h2 className="text-xl font-semibold text-gray-700">Vui lòng đăng nhập với vai trò vận chuyển</h2>
        <Button onClick={() => router.push("/")} className="bg-blue-500 hover:bg-blue-600">
          Quay lại trang chủ
        </Button>
      </div>
    )
  }

  const getOrder = (assignment: DeliveryAssignment) =>
    allOrders.find((order) => order.id === assignment.orderId)

  const getRestaurantName = (order?: Order) =>
    order ? mockRestaurants.find((restaurant) => restaurant.id === order.restaurantId)?.name : undefined

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">BK Express</h1>
            <p className="text-sm text-gray-600">Bảng điều khiển dành cho đơn vị vận chuyển</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-right">
              <p className="font-semibold">{currentUser.name}</p>
              {currentUser.vehicleType && <p className="text-gray-500">{currentUser.vehicleType}</p>}
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đơn cần xử lý</p>
                <p className="text-2xl font-bold">{activeAssignments.length}</p>
              </div>
              <Navigation2 className="h-8 w-8 text-blue-500" />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              {activeAssignments.length > 0
                ? "Ưu tiên các đơn đang chờ xác nhận và đang giao"
                : "Chưa có đơn nào đang hoạt động"}
            </p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Tổng km đã giao</p>
                <p className="text-2xl font-bold">{totalDistance.toFixed(1)} km</p>
              </div>
              <RouteIcon className="h-8 w-8 text-blue-500" />
            </div>
            <p className="mt-2 text-sm text-gray-500">Tính trên các đơn đã hoàn thành</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Đơn hoàn tất tháng này</p>
                <p className="text-2xl font-bold">{historyAssignments.length}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
            </div>
            <p className="mt-2 text-sm text-gray-500">Theo dõi hiệu suất giao hàng cá nhân</p>
          </Card>
        </section>

        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="active">Đơn hiện tại</TabsTrigger>
            <TabsTrigger value="history">Lịch sử</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6 space-y-4">
            {activeAssignments.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                Không có đơn giao nào đang chờ.
              </Card>
            ) : (
              activeAssignments.map((assignment) => {
                const order = getOrder(assignment)
                return (
                  <DeliveryAssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    order={order}
                    restaurantName={getRestaurantName(order)}
                    onStatusChange={updateDeliveryAssignmentStatus}
                  />
                )
              })
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6 space-y-4">
            {historyAssignments.length === 0 ? (
              <Card className="p-8 text-center text-gray-500">
                Chưa có đơn giao nào hoàn thành.
              </Card>
            ) : (
              historyAssignments.map((assignment) => {
                const order = getOrder(assignment)
                return (
                  <DeliveryAssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    order={order}
                    restaurantName={getRestaurantName(order)}
                    onStatusChange={updateDeliveryAssignmentStatus}
                    disableActions
                  />
                )
              })
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function DeliveryAssignmentCard({
  assignment,
  order,
  restaurantName,
  onStatusChange,
  disableActions = false,
}: {
  assignment: DeliveryAssignment
  order?: Order
  restaurantName?: string
  onStatusChange: (id: string, status: DeliveryStatus) => void
  disableActions?: boolean
}) {
  const action = statusAction[assignment.status]
  const nextStatus = action.next

  return (
    <Card className="p-6 space-y-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">Đơn #{assignment.orderId}</h3>
            {restaurantName && <Badge variant="outline">{restaurantName}</Badge>}
          </div>
          {order && (
            <p className="text-sm text-gray-500">Tổng giá trị đơn: {formatPrice(order.total)}</p>
          )}
        </div>
        <Badge className={statusConfig[assignment.status].className}>
          {statusConfig[assignment.status].label}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoLine icon={MapPin} label="Địa chỉ lấy" value={assignment.pickupAddress} />
        <InfoLine icon={MapPin} label="Địa chỉ giao" value={assignment.dropoffAddress} />
        <InfoLine
          icon={Clock}
          label="Giờ lấy dự kiến"
          value={new Date(assignment.scheduledPickupTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
        <InfoLine
          icon={Clock}
          label="Giờ giao dự kiến"
          value={new Date(assignment.scheduledDeliveryTime).toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricBox title="Quãng đường" value={`${assignment.distanceKm.toFixed(1)} km`} />
        <MetricBox title="Thời gian dự kiến" value={`${assignment.estimatedDurationMinutes} phút`} />
        {order && <MetricBox title="Khách hàng" value={order.customerPhone} icon={Phone} />}
      </div>

      {assignment.notes && (
        <div className="bg-blue-100/60 border border-blue-200 text-sm text-blue-700 rounded-lg p-3">
          Ghi chú: {assignment.notes}
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-600">
          <History className="h-4 w-4" />
          Lộ trình tối ưu
        </div>
        <div className="space-y-2">
          {assignment.route.map((step, index) => (
            <div key={step.id} className="rounded-lg border border-dashed border-gray-200 bg-white/80 p-3">
              <p className="text-sm font-medium">
                Bước {index + 1}: {step.instruction}
              </p>
              <p className="text-xs text-gray-500">
                {step.distanceKm.toFixed(1)} km · {step.durationMinutes} phút
              </p>
            </div>
          ))}
        </div>
      </div>

      {!disableActions && nextStatus && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pt-2 border-t border-dashed border-gray-200">
          <p className="text-sm text-gray-500">
            Cập nhật trạng thái để thông báo cho khách hàng và nhà hàng.
          </p>
          <Button onClick={() => onStatusChange(assignment.id, nextStatus)} className="bg-blue-500 hover:bg-blue-600">
            {action.label}
          </Button>
        </div>
      )}
    </Card>
  )
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white/60 p-3">
      <Icon className="h-5 w-5 text-blue-500" />
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">{label}</p>
        <p className="text-sm font-medium text-gray-800">{value}</p>
      </div>
    </div>
  )
}

function MetricBox({
  title,
  value,
  icon: Icon,
}: {
  title: string
  value: string
  icon?: typeof Navigation2
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white/60 p-3 flex items-center gap-3">
      {Icon && <Icon className="h-5 w-5 text-blue-500" />}
      <div>
        <p className="text-xs uppercase tracking-wide text-gray-500">{title}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  )
}
