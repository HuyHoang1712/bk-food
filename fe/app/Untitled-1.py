diff --git a/app/page.tsx b/app/page.tsx
index 821972afe8c028f8898f7c82dc9e92582a2fb705..de5f2bd05dc13e3aa0873fd013c6408e4610e354 100644
--- a/app/page.tsx
+++ b/app/page.tsx
@@ -1,61 +1,430 @@
 "use client"
 
-import { useEffect } from "react"
+import { useEffect, useState, type FormEvent } from "react"
 import { useRouter } from "next/navigation"
+import { ShieldCheck, Sparkles, Store, Users } from "lucide-react"
+
 import { Button } from "@/components/ui/button"
+import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
+import { Input } from "@/components/ui/input"
+import { Label } from "@/components/ui/label"
+import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
 import { useStore } from "@/lib/store"
 import { mockUsers } from "@/lib/mock-data"
+import type { User } from "@/lib/types"
+
+const roleLabel = {
+  customer: "Khách hàng",
+  restaurant: "Nhà hàng",
+} as const
+
+type Role = keyof typeof roleLabel
+
+type AuthMode = "login" | "register"
+
+type RegisterValues = {
+  name: string
+  email: string
+  phone: string
+  address: string
+  taxCode: string
+  password: string
+}
+
+type LoginValues = {
+  email: string
+  password: string
+}
+
+const featureCards = [
+  {
+    title: "Đồng bộ Gmail",
+    description: "Tự động lấy thông tin liên hệ, avatar và xác thực 2 bước từ tài khoản Google.",
+    icon: Sparkles,
+  },
+  {
+    title: "Bảo mật đa lớp",
+    description: "Mã hoá mật khẩu, lưu lịch sử đăng nhập và cảnh báo phiên bất thường.",
+    icon: ShieldCheck,
+  },
+  {
+    title: "Quản lý nhiều vai trò",
+    description: "Tài khoản khách hàng và nhà hàng dùng chung nền tảng, dễ chuyển đổi.",
+    icon: Users,
+  },
+  {
+    title: "Kết nối nhà hàng",
+    description: "Theo dõi hiệu suất bán hàng, đồng bộ menu và thông báo đơn theo thời gian thực.",
+    icon: Store,
+  },
+]
+
+const gmailProfiles: Record<Role, User> = {
+  customer: {
+    id: "gmail-customer",
+    name: "Sinh viên BK",
+    email: "bkfood.student@gmail.com",
+    role: "customer",
+    phone: "0908000111",
+    address: "Ký túc xá Bách Khoa",
+  },
+  restaurant: {
+    id: "gmail-restaurant",
+    name: "BK Food Station",
+    email: "bkfood.station@gmail.com",
+    role: "restaurant",
+    restaurantId: "gmail-restaurant",
+  },
+}
 
-export default function HomePage() {
+export default function AuthPage() {
   const router = useRouter()
   const { currentUser, setCurrentUser } = useStore()
+  const [role, setRole] = useState<Role>("customer")
+  const [mode, setMode] = useState<AuthMode>("login")
+  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null)
+  const [loginValues, setLoginValues] = useState<Record<Role, LoginValues>>({
+    customer: { email: "student@bk.edu.vn", password: "123456" },
+    restaurant: { email: "comtam@restaurant.com", password: "123456" },
+  })
+  const [registerValues, setRegisterValues] = useState<Record<Role, RegisterValues>>({
+    customer: {
+      name: "",
+      email: "",
+      phone: "",
+      address: "",
+      taxCode: "",
+      password: "",
+    },
+    restaurant: {
+      name: "",
+      email: "",
+      phone: "",
+      address: "",
+      taxCode: "",
+      password: "",
+    },
+  })
 
   useEffect(() => {
     if (currentUser) {
-      if (currentUser.role === "customer") {
-        router.push("/customer")
-      } else {
-        router.push("/restaurant")
-      }
+      router.replace(currentUser.role === "customer" ? "/customer" : "/restaurant")
     }
   }, [currentUser, router])
 
-  const handleLogin = (role: "customer" | "restaurant") => {
-    const user = mockUsers.find((u) => u.role === role)
-    if (user) {
-      setCurrentUser(user)
+  const handleLoginSubmit = (event: FormEvent<HTMLFormElement>, currentRole: Role) => {
+    event.preventDefault()
+    setStatus(null)
+
+    const { email, password } = loginValues[currentRole]
+    if (!email || !password) {
+      setStatus({ type: "error", message: "Vui lòng nhập đầy đủ email và mật khẩu." })
+      return
+    }
+
+    const user = mockUsers.find(
+      (mockUser) => mockUser.role === currentRole && mockUser.email.toLowerCase() === email.toLowerCase(),
+    )
+
+    if (!user) {
+      setStatus({
+        type: "error",
+        message: `Không tìm thấy ${roleLabel[currentRole].toLowerCase()} nào với email đã nhập.`,
+      })
+      return
     }
+
+    setCurrentUser(user)
+    setStatus({ type: "success", message: "Đăng nhập thành công, đang chuyển đến bảng điều khiển..." })
+    router.push(user.role === "customer" ? "/customer" : "/restaurant")
   }
 
-  return (
-    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-red-50">
-      <div className="max-w-md w-full mx-4">
-        <div className="text-center mb-8">
-          <h1 className="text-4xl font-bold text-orange-600 mb-2">BK Food</h1>
-          <p className="text-gray-600">Giao đồ ăn nhanh cho sinh viên Bách Khoa</p>
-        </div>
+  const handleRegisterSubmit = (event: FormEvent<HTMLFormElement>, currentRole: Role) => {
+    event.preventDefault()
+    setStatus(null)
 
-        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-4">
-          <h2 className="text-xl font-semibold text-center mb-6">Đăng nhập với vai trò</h2>
+    const values = registerValues[currentRole]
+    if (!values.name || !values.email || !values.password) {
+      setStatus({ type: "error", message: "Hãy điền tối thiểu tên, email và mật khẩu." })
+      return
+    }
 
-          <Button
-            onClick={() => handleLogin("customer")}
-            className="w-full h-14 text-lg bg-orange-500 hover:bg-orange-600"
-          >
-            Khách hàng
-          </Button>
+    if (values.password.length < 6) {
+      setStatus({ type: "error", message: "Mật khẩu cần ít nhất 6 ký tự." })
+      return
+    }
 
-          <Button
-            onClick={() => handleLogin("restaurant")}
-            variant="outline"
-            className="w-full h-14 text-lg border-orange-500 text-orange-600 hover:bg-orange-50"
-          >
-            Nhà hàng
-          </Button>
+    const newUser: User =
+      currentRole === "customer"
+        ? {
+            id: `cust-${Date.now()}`,
+            name: values.name,
+            email: values.email,
+            role: "customer",
+            phone: values.phone,
+            address: values.address,
+          }
+        : {
+            id: `rest-${Date.now()}`,
+            name: values.name,
+            email: values.email,
+            role: "restaurant",
+            restaurantId: values.taxCode || `rest-${Date.now()}`,
+          }
+
+    setCurrentUser(newUser)
+    setStatus({ type: "success", message: "Đăng ký tài khoản mới thành công!" })
+    router.push(currentRole === "customer" ? "/customer" : "/restaurant")
+  }
+
+  const handleLoginInputChange = (field: keyof LoginValues, value: string) => {
+    setLoginValues((prev) => ({
+      ...prev,
+      [role]: { ...prev[role], [field]: value },
+    }))
+  }
+
+  const handleRegisterInputChange = (field: keyof RegisterValues, value: string) => {
+    setRegisterValues((prev) => ({
+      ...prev,
+      [role]: { ...prev[role], [field]: value },
+    }))
+  }
+
+  const handleGmailConnect = (targetRole: Role) => {
+    const profile = gmailProfiles[targetRole]
+    setCurrentUser(profile)
+    setStatus({ type: "success", message: `Đăng nhập Gmail cho ${roleLabel[targetRole].toLowerCase()} thành công!` })
+    router.push(targetRole === "customer" ? "/customer" : "/restaurant")
+  }
+
+  const GmailIcon = () => (
+    <svg viewBox="0 0 533.5 544.3" className="size-4" aria-hidden="true">
+      <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.4-34.4-4.3-50.8H272v96.2h147.4c-6.4 34.6-25.9 63.9-55.2 83.4l89.1 69.1c52-48 80.2-118.8 80.2-197.9" />
+      <path fill="#34a853" d="M272 544.3c74.7 0 137.4-24.8 183.1-67.5l-89.1-69.1c-24.7 16.6-56.5 26.4-94 26.4-72 0-133-48.6-154.6-113.9l-92.5 71.2c44.7 88.4 136 152.9 247.1 152.9" />
+      <path fill="#fbbc04" d="M117.4 320.2c-5.5-16.6-8.6-34.4-8.6-52.6 0-18.3 3.1-36 8.6-52.6l-92.5-71.2C6.9 182 0 214.8 0 247.6s6.9 65.6 24.9 103.8l92.5-71.2" />
+      <path fill="#ea4335" d="M272 105.2c40.7 0 77.2 14 106 41.4l79.2-79.2C409.2 24.3 346.5 0 272 0 160.9 0 69.6 64.5 24.9 143.8l92.5 71.2c21.6-65.3 82.6-113.9 154.6-113.9" />
+    </svg>
+  )
+
+  const roleSpecificHelper = (targetRole: Role) =>
+    targetRole === "customer"
+      ? {
+          name: "Họ và tên",
+          address: "Địa chỉ giao hàng",
+          phone: "Số điện thoại",
+          taxCode: "",
+        }
+      : {
+          name: "Tên nhà hàng",
+          address: "Khu vực phục vụ chính",
+          phone: "Số điện thoại liên hệ",
+          taxCode: "Mã số thuế / Giấy phép",
+        }
+
+  const renderForm = (currentRole: Role) => {
+    const helper = roleSpecificHelper(currentRole)
+    const registerState = registerValues[currentRole]
+
+    return (
+      <div className="space-y-6">
+      <div className="flex items-center justify-between rounded-full bg-slate-100 p-1 text-xs font-medium">
+        <button
+          type="button"
+          onClick={() => setMode("login")}
+          className={`flex-1 rounded-full px-3 py-1 transition ${
+            mode === "login" ? "bg-white text-orange-600 shadow" : "text-slate-500"
+          }`}
+        >
+          Đăng nhập
+        </button>
+        <button
+          type="button"
+          onClick={() => setMode("register")}
+          className={`flex-1 rounded-full px-3 py-1 transition ${
+            mode === "register" ? "bg-white text-orange-600 shadow" : "text-slate-500"
+          }`}
+        >
+          Đăng ký
+        </button>
+      </div>
+
+      {status && (
+        <div
+          className={`rounded-xl border px-4 py-3 text-sm ${
+            status.type === "success"
+              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
+              : "border-red-200 bg-red-50 text-red-700"
+          }`}
+        >
+          {status.message}
         </div>
+      )}
+
+      {mode === "login" ? (
+        <form className="space-y-4" onSubmit={(event) => handleLoginSubmit(event, currentRole)}>
+          <div className="space-y-2">
+            <Label htmlFor={`email-${currentRole}`}>Email đăng nhập</Label>
+            <Input
+              id={`email-${currentRole}`}
+              type="email"
+              required
+              placeholder="example@gmail.com"
+              value={loginValues[currentRole].email}
+              onChange={(event) => handleLoginInputChange("email", event.target.value)}
+            />
+          </div>
+          <div className="space-y-2">
+            <Label htmlFor={`password-${currentRole}`}>Mật khẩu</Label>
+            <Input
+              id={`password-${currentRole}`}
+              type="password"
+              required
+              minLength={6}
+              placeholder="••••••"
+              value={loginValues[currentRole].password}
+              onChange={(event) => handleLoginInputChange("password", event.target.value)}
+            />
+          </div>
+          <div className="space-y-3">
+            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
+              Tiếp tục
+            </Button>
+            <Button
+              type="button"
+              variant="outline"
+              className="w-full border-orange-200 bg-orange-50 text-orange-600 hover:bg-orange-100"
+              onClick={() => handleGmailConnect(currentRole)}
+            >
+              <GmailIcon /> Đăng nhập bằng Gmail
+            </Button>
+          </div>
+        </form>
+      ) : (
+        <form className="space-y-4" onSubmit={(event) => handleRegisterSubmit(event, currentRole)}>
+          <div className="space-y-2">
+            <Label htmlFor={`name-${currentRole}`}>{helper.name}</Label>
+            <Input
+              id={`name-${currentRole}`}
+              required
+              placeholder={helper.name}
+              value={registerState.name}
+              onChange={(event) => handleRegisterInputChange("name", event.target.value)}
+            />
+          </div>
+          <div className="space-y-2">
+            <Label htmlFor={`register-email-${currentRole}`}>Email chính</Label>
+            <Input
+              id={`register-email-${currentRole}`}
+              type="email"
+              required
+              placeholder="example@gmail.com"
+              value={registerState.email}
+              onChange={(event) => handleRegisterInputChange("email", event.target.value)}
+            />
+          </div>
+          <div className="space-y-2">
+            <Label htmlFor={`phone-${currentRole}`}>{helper.phone}</Label>
+            <Input
+              id={`phone-${currentRole}`}
+              placeholder="0903xxxxxx"
+              value={registerState.phone}
+              onChange={(event) => handleRegisterInputChange("phone", event.target.value)}
+            />
+          </div>
+          <div className="space-y-2">
+            <Label htmlFor={`address-${currentRole}`}>{helper.address}</Label>
+            <Input
+              id={`address-${currentRole}`}
+              placeholder={helper.address}
+              value={registerState.address}
+              onChange={(event) => handleRegisterInputChange("address", event.target.value)}
+            />
+          </div>
+          {currentRole === "restaurant" && (
+            <div className="space-y-2">
+              <Label htmlFor="tax">{helper.taxCode}</Label>
+              <Input
+                id="tax"
+                placeholder="0312-xxxxx"
+                value={registerState.taxCode}
+                onChange={(event) => handleRegisterInputChange("taxCode", event.target.value)}
+              />
+            </div>
+          )}
+          <div className="space-y-2">
+            <Label htmlFor={`register-password-${currentRole}`}>Mật khẩu</Label>
+            <Input
+              id={`register-password-${currentRole}`}
+              type="password"
+              minLength={6}
+              required
+              placeholder="Tối thiểu 6 ký tự"
+              value={registerState.password}
+              onChange={(event) => handleRegisterInputChange("password", event.target.value)}
+            />
+          </div>
+          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600">
+            Tạo tài khoản
+          </Button>
+        </form>
+      )}
+    </div>
+  )
+  }
+
+  return (
+    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4 py-10">
+      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
+        <section className="rounded-3xl bg-white/80 p-8 shadow-lg shadow-orange-100">
+          <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
+            <Sparkles className="size-3" /> BK Food Identity Hub
+          </p>
+          <h1 className="text-4xl font-bold text-slate-900">
+            Trung tâm đăng nhập & đăng ký dành cho sinh viên và nhà hàng đối tác
+          </h1>
+          <p className="mt-4 text-lg text-slate-600">
+            Liên kết nhanh với Gmail, quản lý quyền truy cập đa vai trò và khởi chạy trải nghiệm giao đồ ăn chỉ với vài bước.
+          </p>
+          <div className="mt-8 grid gap-4 sm:grid-cols-2">
+            {featureCards.map((feature) => (
+              <div key={feature.title} className="rounded-2xl border border-orange-100/70 bg-orange-50/40 p-4">
+                <feature.icon className="mb-3 size-6 text-orange-500" />
+                <p className="text-base font-semibold text-slate-800">{feature.title}</p>
+                <p className="text-sm text-slate-500">{feature.description}</p>
+              </div>
+            ))}
+          </div>
+          <div className="mt-8 rounded-2xl bg-slate-900 p-6 text-white">
+            <p className="text-sm uppercase tracking-widest text-orange-200">Hỗ trợ nhanh</p>
+            <p className="mt-2 text-2xl font-semibold">bkfood-support@bk.edu.vn</p>
+            <p className="text-sm text-slate-200">Đội ngũ kỹ thuật trực 24/7 giúp bạn kích hoạt Gmail Workspace.</p>
+          </div>
+        </section>
 
-        <p className="text-center text-sm text-gray-500 mt-6">Demo app - Chọn vai trò để trải nghiệm</p>
+        <Card className="border-none bg-white/90 shadow-2xl shadow-orange-100">
+          <CardHeader className="space-y-2">
+            <CardTitle className="text-2xl font-bold text-slate-900">Đăng nhập & Đăng ký</CardTitle>
+            <CardDescription>
+              Chọn vai trò phù hợp, đăng nhập bằng tài khoản sẵn có hoặc tạo mới và kết nối Gmail trong một thao tác.
+            </CardDescription>
+          </CardHeader>
+          <CardContent className="space-y-6">
+            <Tabs value={role} onValueChange={(value) => setRole(value as Role)}>
+              <TabsList className="grid w-full grid-cols-2 bg-slate-100">
+                <TabsTrigger value="customer" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
+                  Khách hàng
+                </TabsTrigger>
+                <TabsTrigger value="restaurant" className="data-[state=active]:bg-white data-[state=active]:text-orange-600">
+                  Nhà hàng
+                </TabsTrigger>
+              </TabsList>
+              <TabsContent value="customer">{renderForm("customer")}</TabsContent>
+              <TabsContent value="restaurant">{renderForm("restaurant")}</TabsContent>
+            </Tabs>
+          </CardContent>
+        </Card>
       </div>
     </div>
   )
 }
