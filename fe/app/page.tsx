"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useStore } from "@/lib/store"
import { mockUsers } from "@/lib/mock-data"

export default function HomePage() {
  const router = useRouter()
  const { currentUser, setCurrentUser } = useStore()

  useEffect(() => {
  if (!currentUser) return  // ✅ chưa đăng nhập thì ở lại trang Home

  switch (currentUser.role) {
    case "customer":
      router.replace("/customer")
      break
    case "delivery":
      router.replace("/delivery")
      break
    case "admin":
      router.replace("/admin")
      break
    case "restaurant":
      router.replace("/restaurant")
      break
  }
}, [currentUser, router])

  const handleLogin = (role: "customer" | "restaurant" | "delivery" | "admin") => {
    const user = mockUsers.find((u) => u.role === role)
    if (user) {
      setCurrentUser(user)
    }
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">BK Food</h1>
          <p className="text-gray-600">Giao đồ ăn nhanh cho sinh viên Bách Khoa</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
          <h2 className="text-xl font-semibold text-center mb-6">Đăng nhập với vai trò</h2>

          <Button
            onClick={() => handleLogin("customer")}
            className="w-full h-14 text-lg bg-blue-500 hover:bg-blue-600"
          >
            Khách hàng
          </Button>

          <Button
            onClick={() => handleLogin("restaurant")}
            variant="outline"
            className="w-full h-14 text-lg border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            Nhà hàng
          </Button>

          <Button
            onClick={() => handleLogin("delivery")}
            variant="secondary"
            className="w-full h-14 text-lg border-blue-500 bg-slate-500 hover:bg-slate-600"
          >
            Đơn vị vận chuyển
          </Button>
          <Button
            onClick={() => handleLogin("admin")}
            variant="outline"
            className="w-full h-14 text-lg border-amber-500 text-amber-600 hover:bg-amber-50"
          >
            Quản trị viên
          </Button>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">Đây là web giao đồ ăn</p>
      </div>
    </div>
  )
}
