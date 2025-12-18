"use client"

import { useState } from "react"
import { useRouter } from "next/navigation" // Use next/router if on Pages Router

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Combined state for all form fields
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "customer", // Default role
    address: "",
    restaurantId: "",
    vehicleType: "Xe máy", // Default vehicle
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // 1. Construct the payload
      // We start with common fields
      const payload: any = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        address: formData.address,
      }

      // 2. Add specific fields based on role 
      if (formData.role === "restaurant") {
        // Ensure restaurantId is a number if your backend requires it
        payload.restaurantId = Number(formData.restaurantId) || 0
      } else if (formData.role === "delivery") {
        payload.vehicleType = formData.vehicleType
      }

      // 3. Send Request
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Đăng ký thất bại.")
      }

      // 4. Success -> Redirect to Login
      router.push("/") // Or wherever your login page is
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra, vui lòng thử lại.")
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
            {/* Grid for Name and Phone */}
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

            {/* Email */}
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

            {/* Password */}
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

            {/* Address */}
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

            {/* Role Selection */}
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

            {/* --- Conditional Fields --- */}
            
            {/* Show Restaurant ID only if role is Restaurant */}
            {formData.role === "restaurant" && (
              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                <label className="text-sm text-gray-700">Restaurant ID</label>
                <input
                  name="restaurantId"
                  type="number"
                  placeholder="Nhập ID nhà hàng"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.restaurantId}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Show Vehicle Type only if role is Delivery */}
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

            {/* Error Message */}
            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 text-center">
                {error}
              </p>
            )}

            {/* Submit Button */}
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