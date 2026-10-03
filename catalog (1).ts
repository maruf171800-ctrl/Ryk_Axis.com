export type ProductKind = "physical" | "digital";

export type Product = {
  id: string;
  slug: string;
  name: string;
  eyebrow: string;
  description: string;
  price: number;
  compareAt?: number;
  kind: ProductKind;
  category: string;
  rating: number;
  reviews: number;
  stock: number;
  delivery: string;
  image: string;
  accent: string;
  tags: string[];
  specs: string[];
};

export const imageRoot = "/manus-storage/async-images/DjGkUWsqQDZECr0i815R14";

export const products: Product[] = [
  {
    id: "orbit-buds",
    slug: "orbit-buds",
    name: "Orbit Buds / 02",
    eyebrow: "AUDIO / PHYSICAL",
    description: "Adaptive wireless audio with a soft-touch case, spatial clarity, and a battery made for the full day.",
    price: 5831,
    compareAt: 7290,
    kind: "physical",
    category: "Audio",
    rating: 4.8,
    reviews: 126,
    stock: 18,
    delivery: "Arrives in Dhaka in 2–3 days",
    image: `${imageRoot}/image-2.webp`,
    accent: "#9cff2e",
    tags: ["new drop", "flash 20%"],
    specs: ["Adaptive ANC", "32-hour case battery", "USB-C fast charge", "IPX4 splash resistant"],
  },
  {
    id: "air-pulse",
    slug: "air-pulse",
    name: "Air Pulse Mini",
    eyebrow: "EVERYDAY TECH / PHYSICAL",
    description: "A pocket cooling system for hot commutes, desk sessions, and the in-between moments.",
    price: 1666,
    compareAt: 1950,
    kind: "physical",
    category: "Everyday tech",
    rating: 4.6,
    reviews: 84,
    stock: 42,
    delivery: "Arrives in Dhaka in 2–3 days",
    image: `${imageRoot}/image-4.webp`,
    accent: "#76b7ff",
    tags: ["20% off", "new stock"],
    specs: ["3 wind levels", "USB-C rechargeable", "Quiet desk mode", "6-hour battery"],
  },
  {
    id: "halo-loop",
    slug: "halo-loop",
    name: "Halo Loop Light",
    eyebrow: "HOME TECH / PHYSICAL",
    description: "Ambient light with 16M colours, designed to make a small room feel intentional.",
    price: 4641,
    kind: "physical",
    category: "Home tech",
    rating: 4.9,
    reviews: 61,
    stock: 9,
    delivery: "Arrives in Dhaka in 3–5 days",
    image: `${imageRoot}/image-3.webp`,
    accent: "#b16cff",
    tags: ["trending", "editor's pick"],
    specs: ["16M colour scenes", "App + touch control", "Warm-to-cool white", "USB-C powered"],
  },
  {
    id: "stronger-every-day",
    slug: "stronger-every-day-gym-benefits",
    name: "Stronger Every Day",
    eyebrow: "DIGITAL / DOWNLOAD",
    description: "A clear beginner’s guide to the benefits of going to the gym, made to travel light.",
    price: 952,
    kind: "digital",
    category: "Digital",
    rating: 4.7,
    reviews: 39,
    stock: 999,
    delivery: "Instant download after approval",
    image: `${imageRoot}/image-5.webp`,
    accent: "#ffcb66",
    tags: ["new e-book", "instant access"],
    specs: ["PDF + EPUB", "62 practical pages", "Beginner friendly", "Lifetime access"],
  },
  {
    id: "tora-oni",
    slug: "tora-oni-wallpaper",
    name: "Tora Oni Wallpaper",
    eyebrow: "WALLPAPER / DOWNLOAD",
    description: "A high-resolution mobile and desktop wallpaper pack with a sharp, graphic character study.",
    price: 120,
    kind: "digital",
    category: "Wallpaper",
    rating: 4.5,
    reviews: 22,
    stock: 999,
    delivery: "Instant download after approval",
    image: `${imageRoot}/image-5.webp`,
    accent: "#ff6dd6",
    tags: ["digital", "low lift"],
    specs: ["4K desktop", "Mobile crop included", "PNG + JPG", "Personal use"],
  },
  {
    id: "asos-fan",
    slug: "asos-electric-hand-fan",
    name: "ASOS Electric Hand Fan",
    eyebrow: "ELECTRIC FAN / PHYSICAL",
    description: "A small, reliable hand fan with a focused breeze and no unnecessary settings.",
    price: 500,
    kind: "physical",
    category: "Electric fan",
    rating: 4.3,
    reviews: 17,
    stock: 4,
    delivery: "Arrives in Dhaka in 4–6 days",
    image: `${imageRoot}/image-4.webp`,
    accent: "#9cff2e",
    tags: ["low stock", "new stock"],
    specs: ["3 speed modes", "USB rechargeable", "Foldable stand", "Lightweight body"],
  },
  {
    id: "hand-fan",
    slug: "hand-fan",
    name: "Hand Fan",
    eyebrow: "DESK ESSENTIAL / PHYSICAL",
    description: "A quiet little desk companion for warm afternoons, late work, and small spaces.",
    price: 500,
    kind: "physical",
    category: "Everyday tech",
    rating: 4.2,
    reviews: 13,
    stock: 0,
    delivery: "Back in stock soon",
    image: `${imageRoot}/image-4.webp`,
    accent: "#76b7ff",
    tags: ["sold out"],
    specs: ["Quiet desk mode", "USB-C powered", "Compact footprint", "Lightweight body"],
  },
];

export const categories = ["All products", "Audio", "Everyday tech", "Home tech", "Digital", "Wallpaper", "Electric fan"];

export const campaigns = [
  { code: "FLASH // 20", title: "Save 20% on selected tech", copy: "A tighter signal for the everyday kit.", color: "#9cff2e" },
  { code: "DIGITAL / 01", title: "Good ideas travel light", copy: "E-books, guides, and downloads with a reason to exist.", color: "#b16cff" },
  { code: "DELIVERY / BD", title: "Free delivery over ৳9,520", copy: "Bangladesh-first pricing. Clear checkout. No hidden signal.", color: "#76b7ff" },
];

export function formatBDT(amount: number) {
  return new Intl.NumberFormat("en-BD", { style: "currency", currency: "BDT", maximumFractionDigits: 0 }).format(amount).replace("BDT", "৳");
}

export function getProduct(slug?: string) {
  return products.find(product => product.slug === slug);
}
