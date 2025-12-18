export type UserRole = "customer" | "restaurant" | "delivery"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  address?: string
  restaurantId?: string
    vehicleType?: string
}

export type DeliveryStatus = "assigned" | "accepted" | "in_transit" | "completed" | "cancelled"

export interface DeliveryRouteStep {
  id: string
  instruction: string
  distanceKm: number
  durationMinutes: number
}

export interface DeliveryAssignment {
  id: string
  orderId: string
  driverId: string
  pickupAddress: string
  dropoffAddress: string
  scheduledPickupTime: string
  scheduledDeliveryTime: string
  distanceKm: number
  estimatedDurationMinutes: number
  status: DeliveryStatus
  route: DeliveryRouteStep[]
  notes?: string
}


export interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  rating: number
  deliveryTime: string
  deliveryFee: number
  minOrder: number
  categories: string[]
  isOpen: boolean
}

export interface MenuItem {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  available: boolean
}

export interface CartItem {
  menuItem: MenuItem
  quantity: number
}

export interface Order {
  id: string
  customerId: string
  restaurantId: string
  items: {
    menuItemName: String
    quantity: number
    price: number
  }[]
  total: number
  status: "pending" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled"
  deliveryAddress: string
  customerPhone: string
  createdAt: Date
  note?: string
  deliveryAssignmentId?: string
}

export interface Review {
  id: string
  orderId: string
  customerId: string
  restaurantId: string
  rating: number
  comment: string
  createdAt: Date
}
