"use client"

<<<<<<< HEAD
import { use } from "react"
=======
import { use, useEffect } from "react"
>>>>>>> origin/nam-branch
import { useRouter } from "next/navigation"
import { ArrowLeft, ShoppingCart, Plus, Minus, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"
<<<<<<< HEAD
import { mockRestaurants, mockMenuItems, mockReviews } from "@/lib/mock-data"
import { formatPrice, formatDate } from "@/lib/utils/format"
import type { MenuItem, Review } from "@/lib/types"
import { useState } from "react"

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
=======
import { mockReviews } from "@/lib/mock-data"
import { formatPrice, formatDate } from "@/lib/utils/format"
import type { MenuItem, Restaurant, Review } from "@/lib/types"
import { useState } from "react"

export default function RestaurantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap params
>>>>>>> origin/nam-branch
  const { id } = use(params)
  const router = useRouter()
  const { cart, reviews: storeReviews } = useStore()

<<<<<<< HEAD
  const restaurant = mockRestaurants.find((r) => r.id === id)
  const menuItems = mockMenuItems.filter((item) => item.restaurantId === id)
  const allReviews = [...mockReviews, ...storeReviews].filter((review) => review.restaurantId === id)

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Không tìm thấy nhà hàng</p>
=======
  // 1. State for Fetched Data
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  
  // 2. Loading & Error States
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 3. Fetch Data Effect (Only for Restaurant & Menu Items)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        
        // Fetch both endpoints in parallel
        const [restaurantRes, menuRes] = await Promise.all([
          fetch(`/api/restaurants/${id}`),
          fetch(`/api/restaurants/${id}/menu-items`)
        ])

        if (!restaurantRes.ok) throw new Error("Failed to fetch restaurant")
        if (!menuRes.ok) throw new Error("Failed to fetch menu items")

        const restaurantData = await restaurantRes.json()
        const menuData = await menuRes.json()

        setRestaurant(restaurantData)
        setMenuItems(menuData)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Không thể tải thông tin nhà hàng")
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  // 4. Logic for Reviews (Combining Mock + Store)
  // We filter the static mockReviews just like before
  const allReviews = [...mockReviews, ...storeReviews].filter((review) => review.restaurantId === id)
  
  // 5. Logic for Categories (Derived from fetched menu items)
  const categories = Array.from(new Set(menuItems.map((item) => item.category)))
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
>>>>>>> origin/nam-branch
      </div>
    )
  }

<<<<<<< HEAD
  const categories = Array.from(new Set(menuItems.map((item) => item.category)))
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)
=======
  // Error/Empty State
  if (error || !restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 gap-4">
        <p className="text-gray-500">{error || "Không tìm thấy nhà hàng"}</p>
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại
        </Button>
      </div>
    )
  }
>>>>>>> origin/nam-branch

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">{restaurant.name}</h1>
            <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/customer/cart")}>
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </header>
<<<<<<< HEAD

      {/* Restaurant Info */}
=======
>>>>>>> origin/nam-branch
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-start gap-4">
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold">{restaurant.name}</h2>
                <Badge variant="secondary">⭐ {restaurant.rating}</Badge>
              </div>
              <p className="text-sm text-gray-600 mb-2">{restaurant.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span>{restaurant.deliveryTime}</span>
                <span>•</span>
                <span>Phí ship: {formatPrice(restaurant.deliveryFee)}</span>
                <span>•</span>
                <span>Tối thiểu: {formatPrice(restaurant.minOrder)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
<<<<<<< HEAD

      {/* Menu */}
=======
>>>>>>> origin/nam-branch
      <main className="max-w-7xl mx-auto px-4 py-6">
        {categories.map((category) => (
          <div key={category} className="mb-8">
            <h3 className="text-lg font-semibold mb-4">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {menuItems
                .filter((item) => item.category === category)
                .map((item) => (
                  <MenuItemCard key={item.id} item={item} />
                ))}
            </div>
          </div>
        ))}
<<<<<<< HEAD

=======
>>>>>>> origin/nam-branch
        {allReviews.length > 0 && (
          <div className="mt-8">
            <Separator className="mb-6" />
            <h3 className="text-lg font-semibold mb-4">Đánh giá từ khách hàng</h3>
            <div className="space-y-4">
              {allReviews
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function MenuItemCard({ item }: { item: MenuItem }) {
  const { addToCart, cart } = useStore()
  const [quantity, setQuantity] = useState(1)

  const cartItem = cart.find((i) => i.menuItem.id === item.id)
  const currentQuantity = cartItem?.quantity || 0

  const handleAddToCart = () => {
    addToCart({ menuItem: item, quantity })
    setQuantity(1)
  }

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        <img src={item.image || "/placeholder.svg"} alt={item.name} className="w-24 h-24 rounded-lg object-cover" />
        <div className="flex-1">
          <h4 className="font-semibold mb-1">{item.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
          <p className="text-blue-600 font-semibold mb-3">{formatPrice(item.price)}</p>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <Button onClick={handleAddToCart} className="bg-blue-500 hover:bg-blue-600" disabled={!item.available}>
              Thêm
            </Button>
          </div>

          {currentQuantity > 0 && <p className="text-xs text-gray-500 mt-2">Trong giỏ: {currentQuantity}</p>}
        </div>
      </div>
    </Card>
  )
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= review.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
      </div>
      <p className="text-sm text-gray-700">{review.comment}</p>
    </Card>
  )
}
