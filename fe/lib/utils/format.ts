export function formatPrice(price: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price)
}

// export function formatDate(date: Date): string {
//   return new Intl.DateTimeFormat("vi-VN", {
//     year: "numeric",
//     month: "2-digit",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//   }).format(date)
// }
export function formatDate(
  input: Date | string | number,
  opts?: Intl.DateTimeFormatOptions,
  timeZone: string = 'Asia/Ho_Chi_Minh' // cố định cho server & client
): string {
  const d = input instanceof Date ? input : new Date(input);
  if (Number.isNaN(d.getTime())) return ''; // hoặc trả về '--'

  const defaults: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone, // tránh hydration error do khác múi giờ
  };

  return new Intl.DateTimeFormat('vi-VN', { ...defaults, ...opts }).format(d);
}

