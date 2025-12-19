<<<<<<< HEAD
import type { Restaurant, MenuItem, Order, Review, User, DeliveryAssignment} from "./types"
=======
import type { Restaurant, MenuItem, MockOrder, Review, User, DeliveryAssignment} from "./types"
>>>>>>> origin/nam-branch

export const mockRestaurants: Restaurant[] = [
  {
    id: "1",
    name: "Cơm Tấm Sài Gòn",
    description: "Cơm tấm ngon, giá sinh viên",
    image: "/vietnamese-broken-rice-restaurant.jpg",
    rating: 4.5,
    deliveryTime: "15-20 phút",
    deliveryFee: 5000,
    minOrder: 20000,
    categories: ["Cơm", "Việt Nam"],
    isOpen: true,
  },
  {
    id: "2",
    name: "Phở Hà Nội",
    description: "Phở bò, phở gà chính gốc",
    image: "/vietnamese-pho.png",
    rating: 4.7,
    deliveryTime: "20-25 phút",
    deliveryFee: 8000,
    minOrder: 25000,
    categories: ["Phở", "Việt Nam"],
    isOpen: true,
  },
  {
    id: "3",
    name: "Bánh Mì 37",
    description: "Bánh mì thịt, trứng, pate",
    image: "/vietnamese-banh-mi-sandwich.jpg",
    rating: 4.3,
    deliveryTime: "10-15 phút",
    deliveryFee: 3000,
    minOrder: 15000,
    categories: ["Bánh Mì", "Việt Nam"],
    isOpen: true,
  },
  {
    id: "4",
    name: "Trà Sữa Gongcha",
    description: "Trà sữa, trà trái cây tươi mát",
    image: "/bubble-tea-milk-tea-shop.jpg",
    rating: 4.6,
    deliveryTime: "15-20 phút",
    deliveryFee: 5000,
    minOrder: 20000,
    categories: ["Đồ Uống", "Trà Sữa"],
    isOpen: true,
  },
]

export const mockMenuItems: MenuItem[] = [
  // Cơm Tấm Sài Gòn
  {
<<<<<<< HEAD
    id: "m1",
=======
    id: "1",
>>>>>>> origin/nam-branch
    restaurantId: "1",
    name: "Cơm Tấm Sườn Bì",
    description: "Sườn nướng, bì, chả trứng",
    price: 35000,
    image: "/com-tam-suon-bi-vietnamese.jpg",
    category: "Cơm",
    available: true,
  },
  {
<<<<<<< HEAD
    id: "m2",
=======
    id: "2",
>>>>>>> origin/nam-branch
    restaurantId: "1",
    name: "Cơm Tấm Sườn Trứng",
    description: "Sườn nướng, trứng ốp la",
    price: 30000,
    image: "/com-tam-suon-trung-vietnamese.jpg",
    category: "Cơm",
    available: true,
  },
  // Phở Hà Nội
  {
<<<<<<< HEAD
    id: "m3",
=======
    id: "3",
>>>>>>> origin/nam-branch
    restaurantId: "2",
    name: "Phở Bò Tái",
    description: "Phở bò tái, nước dùng đậm đà",
    price: 40000,
    image: "/pho-bo-tai-beef-noodle-soup.jpg",
    category: "Phở",
    available: true,
  },
  {
<<<<<<< HEAD
    id: "m4",
=======
    id: "4",
>>>>>>> origin/nam-branch
    restaurantId: "2",
    name: "Phở Gà",
    description: "Phở gà thơm ngon, thanh đạm",
    price: 35000,
    image: "/pho-ga-chicken-noodle-soup.jpg",
    category: "Phở",
    available: true,
  },
  // Bánh Mì 37
  {
<<<<<<< HEAD
    id: "m5",
=======
    id: "5",
>>>>>>> origin/nam-branch
    restaurantId: "3",
    name: "Bánh Mì Thịt",
    description: "Thịt nguội, pate, rau thơm",
    price: 20000,
    image: "/banh-mi-thit-vietnamese-sandwich.jpg",
    category: "Bánh Mì",
    available: true,
  },
  {
<<<<<<< HEAD
    id: "m6",
=======
    id: "6",
>>>>>>> origin/nam-branch
    restaurantId: "3",
    name: "Bánh Mì Trứng",
    description: "Trứng ốp la, pate, rau",
    price: 18000,
    image: "/banh-mi-trung-egg-sandwich.jpg",
    category: "Bánh Mì",
    available: true,
  },
  // Trà Sữa Gongcha
  {
<<<<<<< HEAD
    id: "m7",
=======
    id: "7",
>>>>>>> origin/nam-branch
    restaurantId: "4",
    name: "Trà Sữa Trân Châu",
    description: "Trà sữa trân châu đường đen",
    price: 25000,
    image: "/bubble-tea-brown-sugar.jpg",
    category: "Đồ Uống",
    available: true,
  },
  {
<<<<<<< HEAD
    id: "m8",
=======
    id: "8",
>>>>>>> origin/nam-branch
    restaurantId: "4",
    name: "Trà Đào Cam Sả",
    description: "Trà trái cây tươi mát",
    price: 28000,
    image: "/peach-tea-fruit-tea.jpg",
    category: "Đồ Uống",
    available: true,
  },
]

export const mockUsers: User[] = [
  {
    id: "u1",
    name: "Nguyễn Văn A",
    email: "student@bk.edu.vn",
    role: "customer",
    phone: "0901234567",
    address: "Ký túc xá khu A, ĐHBK",
  },
  {
    id: "u2",
    name: "Cơm Tấm Sài Gòn",
    email: "comtam@restaurant.com",
    role: "restaurant",
<<<<<<< HEAD
=======
    phone: "",
>>>>>>> origin/nam-branch
    restaurantId: "1",
  },
    {
    id: "u3",
    name: "Huỳnh Huy Hoàng",
    email: "shipper@vnexpress.vn",
    role: "delivery",
    phone: "0843301338",
    vehicleType: "Xe máy Honda Vision",
  },
<<<<<<< HEAD
  {
    id: "u4",
    name: "Trần Quản Trị",
    email: "admin@bkfood.vn",
    role: "admin",
    phone: "0987654321",
  },
]

export const mockOrders: Order[] = [
=======
]

export const mockOrders: MockOrder[] = [
>>>>>>> origin/nam-branch
  {
    id: "o1",
    customerId: "u1",
    restaurantId: "1",
    items: [
      {
        menuItem: mockMenuItems[0],
        quantity: 2,
      },
    ],
    total: 75000,
    status: "completed",
    deliveryAddress: "Ký túc xá khu A, ĐHBK",
    customerPhone: "0901234567",
    createdAt: new Date("2025-01-05"),
  },
  {
    id: "o2",
    customerId: "u1",
    restaurantId: "2",
    items: [
      {
        menuItem: mockMenuItems[2],
        quantity: 1,
      },
      {
        menuItem: mockMenuItems[3],
        quantity: 1,
      },
    ],
    total: 75000,
    status: "confirmed",
    deliveryAddress: "Ký túc xá khu B, ĐHBK",
    customerPhone: "0901234567",
    createdAt: new Date("2025-01-12T11:30:00"),
    note: "Giao trước giờ học lúc 12h",
    deliveryAssignmentId: "d1",
  },
  {
    id: "o3",
    customerId: "u1",
    restaurantId: "3",
    items: [
      {
        menuItem: mockMenuItems[4],
        quantity: 3,
      },
    ],
    total: 60000,
    status: "delivering",
    deliveryAddress: "Thư viện Tạ Quang Bửu",
    customerPhone: "0901234567",
    createdAt: new Date("2025-01-12T08:15:00"),
    deliveryAssignmentId: "d2",
  },
  {
    id: "o4",
    customerId: "u1",
    restaurantId: "4",
    items: [
      {
        menuItem: mockMenuItems[7],
        quantity: 2,
      },
    ],
    total: 56000,
    status: "completed",
    deliveryAddress: "Ký túc xá khu A, ĐHBK",
    customerPhone: "0901234567",
    createdAt: new Date("2024-12-28T15:45:00"),
    deliveryAssignmentId: "d3",
  },
]

export const mockReviews: Review[] = [
  {
    id: "r1",
    orderId: "o1",
    customerId: "u1",
    restaurantId: "1",
    rating: 5,
    comment: "Ngon, giao nhanh, giá sinh viên!",
    createdAt: new Date("2025-01-05"),
  },
]

export const mockDeliveryAssignments: DeliveryAssignment[] = [
  {
    id: "d1",
    orderId: "o2",
    driverId: "u3",
    pickupAddress: "Phở Hà Nội - 123 Lý Thường Kiệt, Q.10",
    dropoffAddress: "Ký túc xá khu B, ĐHBK",
    scheduledPickupTime: "2025-01-12T11:45:00+07:00",
    scheduledDeliveryTime: "2025-01-12T12:10:00+07:00",
    distanceKm: 3.4,
    estimatedDurationMinutes: 18,
    status: "assigned",
    notes: "Gọi khách khi tới cổng ký túc xá.",
    route: [
      {
        id: "d1-r1",
        instruction: "Rời Phở Hà Nội, rẽ phải vào đường Lý Thường Kiệt",
        distanceKm: 0.6,
        durationMinutes: 3,
      },
      {
        id: "d1-r2",
        instruction: "Đi thẳng qua vòng xoay Nguyễn Tri Phương, tiếp tục hướng về Âu Cơ",
        distanceKm: 1.8,
        durationMinutes: 8,
      },
      {
        id: "d1-r3",
        instruction: "Rẽ trái vào đường vào ký túc xá khu B",
        distanceKm: 1.0,
        durationMinutes: 5,
      },
    ],
  },
  {
    id: "d2",
    orderId: "o3",
    driverId: "u3",
    pickupAddress: "Bánh Mì 37 - 89 Nguyễn Thị Minh Khai",
    dropoffAddress: "Thư viện Tạ Quang Bửu",
    scheduledPickupTime: "2025-01-12T08:05:00+07:00",
    scheduledDeliveryTime: "2025-01-12T08:30:00+07:00",
    distanceKm: 2.6,
    estimatedDurationMinutes: 14,
    status: "in_transit",
    route: [
      {
        id: "d2-r1",
        instruction: "Chạy thẳng đường Nguyễn Thị Minh Khai 1,2km",
        distanceKm: 1.2,
        durationMinutes: 6,
      },
      {
        id: "d2-r2",
        instruction: "Rẽ trái vào Trần Hưng Đạo, tiếp tục 900m",
        distanceKm: 0.9,
        durationMinutes: 4,
      },
      {
        id: "d2-r3",
        instruction: "Đi vào cổng thư viện Tạ Quang Bửu",
        distanceKm: 0.5,
        durationMinutes: 4,
      },
    ],
  },
  {
    id: "d3",
    orderId: "o4",
    driverId: "u3",
    pickupAddress: "Trà Sữa Gongcha - 45 Võ Văn Tần",
    dropoffAddress: "Ký túc xá khu A, ĐHBK",
    scheduledPickupTime: "2024-12-28T15:15:00+07:00",
    scheduledDeliveryTime: "2024-12-28T15:35:00+07:00",
    distanceKm: 4.1,
    estimatedDurationMinutes: 20,
    status: "completed",
    route: [
      {
        id: "d3-r1",
        instruction: "Rời Gongcha, đi thẳng Võ Văn Tần 1,5km",
        distanceKm: 1.5,
        durationMinutes: 7,
      },
      {
        id: "d3-r2",
        instruction: "Rẽ phải vào Lê Duẩn, tiếp tục 2km",
        distanceKm: 2.0,
        durationMinutes: 9,
      },
      {
        id: "d3-r3",
        instruction: "Rẽ vào cổng ký túc xá khu A",
        distanceKm: 0.6,
        durationMinutes: 4,
      },
    ],
  },
]