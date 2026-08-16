import { Product } from "../context/ContextProvider";

export const products: Product[] = [
  { id: "midnight-hoodie", name: "Midnight Seoul Hoodie", category: "Hoodies", price: 890000, comparePrice: 1050000, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=900&q=85", hoverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=900&q=85", colors: ["#0a0a0a", "#e5e7eb"], sizes: ["S", "M", "L", "XL"], stock: 18, sale: true, views: 1248, likes: 214 },
  { id: "blueprint-tee", name: "Blueprint Oversized Tee", category: "T-Shirts", price: 420000, image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=900&q=85", hoverImage: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=900&q=85", colors: ["#3b82f6", "#f8fafc"], sizes: ["S", "M", "L", "XL"], stock: 31, views: 891, likes: 156 },
  { id: "seoul-cap", name: "Seoul Signature Cap", category: "Caps", price: 290000, image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&w=900&q=85", hoverImage: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&w=900&q=85", colors: ["#111111", "#3b82f6"], sizes: ["One Size"], stock: 24, views: 672, likes: 98 },
  { id: "studio-cup", name: "MN Studio Cup", category: "Cups", price: 180000, image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85", hoverImage: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=900&q=85", colors: ["#f8fafc", "#111111"], sizes: ["400 ml"], stock: 42, views: 401, likes: 62 },
];

export const money = (value: number) => new Intl.NumberFormat("uz-UZ").format(value) + " so‘m";
