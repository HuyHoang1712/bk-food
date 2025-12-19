"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

type Restaurant = {
  id: number
  name: string
  description?: string
  image?: string
  rating?: number
  deliveryTime?: string
  deliveryFee?: number
  minOrder?: number
  isOpen?: boolean
  categories?: string[]
}

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // restaurants fetching state
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [restaurantsLoading, setRestaurantsLoading] = useState(false)
  const [restaurantsError, setRestaurantsError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer",
    address: "",
    restaurantId: "", // will store selected restaurant id as string
    vehicleType: "motorbike",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  // ✅ fetch restaurants when role becomes "restaurant"
  useEffect(() => {
    let cancelled = false

    const fetchRestaurants = async () => {
      setRestaurantsLoading(true)
      setRestaurantsError(null)

      try {
        const res = await fetch("/api/restaurants", { method: "GET" })
        if (!res.ok) throw new Error("Không tải được danh sách nhà hàng.")

        const data: Restaurant[] = await res.json()
        if (cancelled) return

        setRestaurants(data || [])

        // auto-select first restaurant if nothing selected yet
        if (!formData.restaurantId && data?.length) {
          setFormData((prev) => ({ ...prev, restaurantId: String(data[0].id) }))
        }
      } catch (err: any) {
        if (cancelled) return
        setRestaurants([])
        setRestaurantsError(err?.message || "Có lỗi khi tải nhà hàng.")
      } finally {
        if (!cancelled) setRestaurantsLoading(false)
      }
    }

    if (formData.role === "restaurant") fetchRestaurants()
    else {
      // reset restaurant selection when switching away
      setRestaurants([])
      setRestaurantsLoading(false)
      setRestaurantsError(null)
      setFormData((prev) => ({ ...prev, restaurantId: "" }))
    }

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.role])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        address: formData.address,
      }

      if (formData.role === "restaurant") {
        // ✅ send the selected restaurant id
        payload.restaurantId = Number(formData.restaurantId)
        if (!payload.restaurantId) {
          throw new Error("Vui lòng chọn nhà hàng.")
        }
      } else if (formData.role === "delivery") {
        payload.vehicleType = formData.vehicleType
      }

      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        let msg = "Đăng ký thất bại."
        try {
          const data = await res.json()
          msg = data?.message || msg
        } catch {}
        throw new Error(msg)
      }

      router.push("/")
    } catch (err: any) {
      setError(err?.message || "Có lỗi xảy ra, vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-red-50 py-10">
      <div className="max-w-xl w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-blue-600 mb-2">BK Food</h1>
          <p className="text-gray-600">Tạo tài khoản mới</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h2 className="text-xl font-semibold text-center">Đăng ký</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Họ và tên</label>
                <input
                  name="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-700">Số điện thoại</label>
                <input
                  name="phone"
                  type="tel"
                  placeholder="0912..."
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-700">Mật khẩu</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-700">Địa chỉ</label>
              <input
                name="address"
                type="text"
                placeholder="KTX Khu A..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-700">Vai trò</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="customer">Khách hàng (Customer)</option>
                <option value="restaurant">Nhà hàng (Restaurant)</option>
                <option value="delivery">Tài xế (Delivery)</option>
              </select>
            </div>

            {/* ✅ Restaurant dropdown */}
            {formData.role === "restaurant" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm text-gray-700">Chọn nhà hàng</label>

                {restaurantsLoading ? (
                  <div className="text-sm text-gray-600 bg-gray-50 border rounded-md px-3 py-2">
                    Đang tải danh sách nhà hàng...
                  </div>
                ) : restaurantsError ? (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">
                    {restaurantsError}
                  </div>
                ) : (
                  <select
                    name="restaurantId"
                    value={formData.restaurantId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    required
                  >
                    {restaurants.map((r) => (
                      <option key={r.id} value={String(r.id)}>
                        {r.name} (ID: {r.id})
                      </option>
                    ))}
                  </select>
                )}

                {!restaurantsLoading && !restaurantsError && restaurants.length === 0 && (
                  <div className="text-sm text-gray-600">
                    Chưa có nhà hàng nào để chọn.
                  </div>
                )}
              </div>
            )}

            {/* Vehicle Type */}
            {formData.role === "delivery" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm text-gray-700">Loại xe</label>
                <select
                  name="vehicleType"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="motorbike">Xe máy</option>
                  <option value="bicycle">Xe đạp</option>
                  <option value="electric_bike">Xe đạp điện</option>
                </select>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 text-lg font-medium text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors disabled:opacity-70 mt-4"
            >
              {loading ? "Đang xử lý..." : "Đăng ký ngay"}
            </button>

            <div className="text-center mt-4">
              <span className="text-sm text-gray-600">Đã có tài khoản? </span>
              <button
                type="button"
                onClick={() => router.push("/")}
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                Đăng nhập
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
