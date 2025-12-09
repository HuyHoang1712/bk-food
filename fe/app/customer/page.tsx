"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, ShoppingCart, User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { mockRestaurants } from "@/lib/mock-data"
import { formatPrice } from "@/lib/utils/format"
import type { Restaurant } from "@/lib/types"

export default function CustomerPage() {
  const router = useRouter()
  const { currentUser, setCurrentUser, cart } = useStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const categories = ["all", "Cơm", "Phở", "Bánh Mì", "Đồ Uống"]

  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || restaurant.categories.includes(selectedCategory)
    return matchesSearch && matchesCategory && restaurant.isOpen
  })

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleLogout = () => {
    setCurrentUser(null)
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-blue-600">BK Food</h1>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="relative" onClick={() => router.push("/customer/cart")}>
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => router.push("/customer/orders")}>
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Tìm nhà hàng, món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </header>

      {/* Categories */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-blue-500 hover:bg-blue-600" : ""}
              >
                {category === "all" ? "Tất cả" : category}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Restaurant List */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onClick={() => router.push(`/customer/restaurant/${restaurant.id}`)}
            />
          ))}
        </div>

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không tìm thấy nhà hàng nào</p>
          </div>
        )}
      </main>
    </div>
  )
}

function RestaurantCard({
  restaurant,
  onClick,
}: {
  restaurant: Restaurant
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
    >
      <div className="relative h-40">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-2 right-2 bg-white text-gray-900">⭐ {restaurant.rating}</Badge>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{restaurant.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{restaurant.description}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>{restaurant.deliveryTime}</span>
          <span>{formatPrice(restaurant.deliveryFee)}</span>
        </div>
        <div className="mt-2 text-xs text-gray-500">Đơn tối thiểu: {formatPrice(restaurant.minOrder)}</div>
      </div>
    </div>
  )
}
