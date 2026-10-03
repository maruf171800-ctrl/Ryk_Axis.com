import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "./catalog";

type CartLine = { productId: string; quantity: number };

type StoreValue = {
  cart: CartLine[];
  wishlist: string[];
  compare: string[];
  recent: string[];
  coupon: string;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  toggleCompare: (productId: string) => void;
  setCoupon: (coupon: string) => void;
  clearCart: () => void;
  cartProducts: Array<{ product: Product; quantity: number }>;
  cartCount: number;
  subtotal: number;
  discount: number;
  delivery: number;
  total: number;
};

const StoreContext = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartLine[]>(() => JSON.parse(localStorage.getItem("axis-cart") ?? "[]"));
  const [wishlist, setWishlist] = useState<string[]>(() => JSON.parse(localStorage.getItem("axis-wishlist") ?? "[]"));
  const [compare, setCompare] = useState<string[]>(() => JSON.parse(localStorage.getItem("axis-compare") ?? "[]"));
  const [recent, setRecent] = useState<string[]>(() => JSON.parse(localStorage.getItem("axis-recent") ?? "[]"));
  const [coupon, setCoupon] = useState("");
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => localStorage.setItem("axis-cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("axis-wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("axis-compare", JSON.stringify(compare)), [compare]);
  useEffect(() => localStorage.setItem("axis-recent", JSON.stringify(recent)), [recent]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(current => {
      const existing = current.find(line => line.productId === product.id);
      return existing
        ? current.map(line => line.productId === product.id ? { ...line, quantity: Math.min(line.quantity + quantity, 99) } : line)
        : [...current, { productId: product.id, quantity }];
    });
    setRecent(current => [product.id, ...current.filter(id => id !== product.id)].slice(0, 6));
    setCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) return setCart(current => current.filter(line => line.productId !== productId));
    const product = products.find(item => item.id === productId);
    const maxQuantity = product?.kind === "physical" ? product.stock : 99;
    setCart(current => current.map(line => line.productId === productId ? { ...line, quantity: Math.min(quantity, maxQuantity) } : line));
  };

  const removeFromCart = (productId: string) => setCart(current => current.filter(line => line.productId !== productId));
  const toggleWishlist = (productId: string) => setWishlist(current => current.includes(productId) ? current.filter(id => id !== productId) : [...current, productId]);
  const toggleCompare = (productId: string) => setCompare(current => current.includes(productId) ? current.filter(id => id !== productId) : current.length >= 3 ? current : [...current, productId]);
  const clearCart = () => { setCart([]); setCoupon(""); };

  const cartProducts = cart.flatMap(line => {
    const product = products.find(item => item.id === line.productId);
    return product ? [{ product, quantity: line.quantity }] : [];
  });
  const subtotal = cartProducts.reduce((sum, line) => sum + line.product.price * line.quantity, 0);
  const discount = coupon.trim().toUpperCase() === "SIGNAL20" ? Math.round(subtotal * 0.2) : 0;
  const delivery = cartProducts.length === 0 || cartProducts.every(line => line.product.kind === "digital") || subtotal - discount >= 9520 ? 0 : 180;
  const total = subtotal - discount + delivery;
  const value = useMemo(() => ({ cart, wishlist, compare, recent, coupon, cartOpen, setCartOpen, addToCart, updateQuantity, removeFromCart, toggleWishlist, toggleCompare, setCoupon, clearCart, cartProducts, cartCount: cart.reduce((sum, line) => sum + line.quantity, 0), subtotal, discount, delivery, total }), [cart, wishlist, compare, recent, coupon, cartOpen, cartProducts, subtotal, discount, delivery, total]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore must be used inside StoreProvider");
  return value;
}
