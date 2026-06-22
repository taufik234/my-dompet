// Daftar kategori default dengan warna untuk tampilan Neobrutalism
export const CATEGORIES = [
  { name: "Makanan", icon: "Utensils", color: "#FF6B9D" },
  { name: "Transportasi", icon: "Car", color: "#00D9FF" },
  { name: "Gaji", icon: "Banknote", color: "#7CFF6B" },
  { name: "Hiburan", icon: "Gamepad2", color: "#FFE156" },
  { name: "Belanja", icon: "ShoppingBag", color: "#FFA63E" },
  { name: "Kesehatan", icon: "Heart", color: "#FF6B9D" },
  { name: "Pendidikan", icon: "GraduationCap", color: "#00D9FF" },
  { name: "Tagihan", icon: "Receipt", color: "#FFA63E" },
  { name: "Investasi", icon: "TrendingUp", color: "#7CFF6B" },
  { name: "Lainnya", icon: "MoreHorizontal", color: "#999999" },
] as const;

export type CategoryName = (typeof CATEGORIES)[number]["name"];

/**
 * Helper untuk mendapatkan warna kategori berdasarkan nama
 */
export function getCategoryColor(categoryName: string): string {
  const category = CATEGORIES.find((c) => c.name === categoryName);
  return category?.color ?? "#999999";
}

/**
 * Helper untuk mendapatkan ikon kategori berdasarkan nama
 */
export function getCategoryIcon(categoryName: string): string {
  const category = CATEGORIES.find((c) => c.name === categoryName);
  return category?.icon ?? "MoreHorizontal";
}
