"use client"

import type React from "react"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useStore } from "@/lib/store"
import { mockOrders, mockRestaurants } from "@/lib/mock-data"
import type { Review } from "@/lib/types"

export default function ReviewOrderPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params)
  const router = useRouter()
  const { orders: storeOrders, currentUser } = useStore()

  const allOrders = [...mockOrders, ...storeOrders]
  const order = allOrders.find((o) => o.id === orderId)
  const restaurant = mockRestaurants.find((r) => r.id === order?.restaurantId)

  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!order || order.status !== "completed") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Không thể đánh giá đơn hàng này</p>
          <Button onClick={() => router.push("/customer/orders")} className="bg-blue-500 hover:bg-blue-600">
            Quay lại
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      alert("Vui lòng chọn số sao đánh giá")
      return
    }

    setIsSubmitting(true)

    const newReview: Review = {
      id: `r${Date.now()}`,
      orderId: order.id,
      customerId: currentUser?.id || "guest",
      restaurantId: order.restaurantId,
      rating,
      comment,
      createdAt: new Date(),
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    console.log("[v0] New review:", newReview)

    // In a real app, this would save to database and update restaurant rating
    router.push(`/customer/orders/${order.id}`)
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Đánh giá đơn hàng</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Card className="p-6 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <img
              src={restaurant?.image || "/placeholder.svg"}
              alt={restaurant?.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold">{restaurant?.name}</h3>
              <p className="text-sm text-gray-600">Đơn hàng #{order.id}</p>
            </div>
          </div>

          <div className="space-y-2">
            {order.items.map((item, index) => (
              <p key={index} className="text-sm text-gray-600">
                {item.quantity}x {item.menuItem.name}
              </p>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label>Đánh giá của bạn</Label>
              <div className="flex gap-2 justify-center py-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-12 w-12 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-center text-sm text-gray-600">
                  {rating === 1 && "Rất tệ"}
                  {rating === 2 && "Tệ"}
                  {rating === 3 && "Bình thường"}
                  {rating === 4 && "Tốt"}
                  {rating === 5 && "Tuyệt vời"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Nhận xét của bạn</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về món ăn, dịch vụ giao hàng..."
                rows={5}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi đánh giá"}
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )
}
