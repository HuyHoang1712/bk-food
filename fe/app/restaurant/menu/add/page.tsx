"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AddMenuItemPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save to database
    console.log("[v0] New menu item:", formData)
    router.push("/restaurant")
  }

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-semibold">Thêm món mới</h1>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Tên món</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="VD: Cơm tấm sườn"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Mô tả món ăn..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Giá (VNĐ)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="35000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Danh mục</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cơm">Cơm</SelectItem>
                  <SelectItem value="Phở">Phở</SelectItem>
                  <SelectItem value="Bánh Mì">Bánh Mì</SelectItem>
                  <SelectItem value="Đồ Uống">Đồ Uống</SelectItem>
                  <SelectItem value="Khác">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">URL hình ảnh</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => router.back()} className="flex-1">
                Hủy
              </Button>
              <Button type="submit" className="flex-1 bg-blue-500 hover:bg-blue-600">
                Thêm món
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  )


}
