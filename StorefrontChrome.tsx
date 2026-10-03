import { Link, useLocation } from "wouter";
import { ArrowUpRight, ChevronRight, Heart, Menu, Search, ShoppingBag, Sparkles, UserRound, X } from "lucide-react";
import { useMemo, useState } from "react";
import { products } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function Wordmark() {
  return <Link href="/" className="wordmark" aria-label="RYK AXIS Plus home"><span className="wordmark-mark">R</span><span>RYK <i>AXIS</i></span></Link>;
}

export function Header() {
  const [, setLocation] = useLocation();
  const { cartCount, wishlist, setCartOpen } = useStore();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const suggestions = useMemo(() => query.trim() ? products.filter(product => `${product.name} ${product.category}`.toLowerCase().includes(query.toLowerCase())).slice(0, 4) : products.slice(0, 3), [query]);
  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setLocation(`/shop${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
    setSuggestionsOpen(false);
  };
  return <>
    <a className="skip-link" href="#main-content">Skip to content</a>
    <div className="utility-strip"><span>RYK AXIS PLUS // BANGLADESH ACCESS</span><span className="utility-hide">FREE DELIVERY OVER ৳9,520</span><span className="utility-hide">SECURE CHECKOUT // DIGITAL + PHYSICAL</span><span className="utility-live">CAMPAIGN LIVE <span aria-hidden="true">↗</span></span></div>
    <header className="site-header">
      <div className="header-main">
        <button className="icon-button mobile-menu" aria-label={menuOpen ? "Close navigation" : "Open navigation"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20} /> : <Menu size={20} />}</button>
        <Wordmark />
        <nav className={`primary-nav ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <Link href="/shop" onClick={() => setMenuOpen(false)}>Shop <span>01</span></Link>
          <Link href="/digital-vault" onClick={() => setMenuOpen(false)}>Digital vault <span>02</span></Link>
          <Link href="/campaigns" onClick={() => setMenuOpen(false)}>Campaigns <span>03</span></Link>
          <Link href="/why-ryk" onClick={() => setMenuOpen(false)}>Why RYK <span>04</span></Link>
        </nav>
        <div className="header-actions">
          <span className="currency">BD / BDT</span>
          <Link className="icon-button" href="/account" aria-label="Open account"><UserRound size={18} /></Link>
          <Link className="icon-button badge-button" href="/wishlist" aria-label={`Open wishlist, ${wishlist.length} saved products`}><Heart size={18} /><span>{wishlist.length}</span></Link>
          <button className="icon-button badge-button" aria-label={`Open cart, ${cartCount} items`} onClick={() => setCartOpen(true)}><ShoppingBag size={18} /><span>{cartCount}</span></button>
        </div>
      </div>
      <form className="search-bar" onSubmit={submitSearch} role="search">
        <Search size={18} aria-hidden="true" />
        <label className="sr-only" htmlFor="site-search">Search RYK AXIS Plus</label>
        <input id="site-search" value={query} onChange={event => { setQuery(event.target.value); setSuggestionsOpen(true); }} onFocus={() => setSuggestionsOpen(true)} placeholder="Search products, categories, signal..." autoComplete="off" />
        <kbd>/</kbd>
        {suggestionsOpen && <div className="search-suggestions" role="listbox" aria-label="Search suggestions">
          <div className="suggestion-heading"><span>{query ? "Matching signals" : "Popular now"}</span><button type="button" onClick={() => setSuggestionsOpen(false)} aria-label="Close suggestions"><X size={14} /></button></div>
          {suggestions.map(product => <button key={product.id} type="button" role="option" className="suggestion" onClick={() => { setQuery(product.name); setLocation(`/product/${product.slug}`); setSuggestionsOpen(false); }}><img src={product.image} alt="" /><span><b>{product.name}</b><small>{product.category} · ৳{product.price.toLocaleString()}</small></span><ArrowUpRight size={15} /></button>)}
          <button type="submit" className="suggestion-all">View all results <ArrowUpRight size={14} /></button>
        </div>}
      </form>
    </header>
  </>;
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cartProducts, cartCount, subtotal, total, updateQuantity, removeFromCart } = useStore();
  if (!cartOpen) return null;
  return <div className="drawer-layer" role="presentation" onMouseDown={() => setCartOpen(false)}>
    <aside className="cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onMouseDown={event => event.stopPropagation()}>
      <div className="drawer-head"><div><span className="eyebrow">UTILITY / 07</span><h2 id="cart-title">Your signal <span>({cartCount})</span></h2></div><button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={20} /></button></div>
      {cartProducts.length === 0 ? <div className="drawer-empty"><ShoppingBag size={34} /><h3>Your cart is quiet.</h3><p>Build a better everyday kit from the current drop.</p><Link className="button button-primary" href="/shop" onClick={() => setCartOpen(false)}>Explore the drop <ArrowUpRight size={16} /></Link></div> : <>
        <div className="drawer-lines">{cartProducts.map(({ product, quantity }) => <div className="drawer-line" key={product.id}><img src={product.image} alt="" /><div className="drawer-line-copy"><span className="eyebrow">{product.kind}</span><Link href={`/product/${product.slug}`} onClick={() => setCartOpen(false)}>{product.name}</Link><span className="drawer-price">৳{product.price.toLocaleString()}</span><div className="quantity-control"><button onClick={() => updateQuantity(product.id, quantity - 1)} aria-label={`Decrease ${product.name} quantity`}>−</button><span>{quantity}</span><button onClick={() => updateQuantity(product.id, quantity + 1)} aria-label={`Increase ${product.name} quantity`}>+</button><button className="remove-link" onClick={() => removeFromCart(product.id)}>Remove</button></div></div></div>)}</div>
        <div className="drawer-summary"><div><span>Subtotal</span><b>৳{subtotal.toLocaleString()}</b></div><div><span>Delivery</span><span className="text-accent">Calculated at checkout</span></div><div className="total-row"><span>Total</span><b>৳{total.toLocaleString()}</b></div><Link className="button button-primary button-wide" href="/checkout" onClick={() => setCartOpen(false)}>Continue to checkout <ArrowUpRight size={16} /></Link><Link className="text-link center-link" href="/cart" onClick={() => setCartOpen(false)}>View full cart <ChevronRight size={15} /></Link></div>
      </>}
    </aside>
  </div>;
}

export function Footer() {
  return <footer className="site-footer"><div className="footer-top"><div><Wordmark /><p>Smart goods. Clear signal.<br />A Bangladesh-first independent store.</p></div><div className="footer-links"><div><span className="eyebrow">Explore</span><Link href="/shop">Catalog</Link><Link href="/digital-vault">Digital vault</Link><Link href="/campaigns">Campaigns</Link></div><div><span className="eyebrow">Support</span><Link href="/account">Track an order</Link><Link href="/returns">Returns & refunds</Link><Link href="/support">Contact signal support</Link></div><div><span className="eyebrow">Seller</span><Link href="/seller">Open control room</Link><Link href="/seller/catalog">Manage catalog</Link><Link href="/seller/campaigns">Manage campaigns</Link></div></div></div><div className="footer-bottom"><span>© 2026 RYK AXIS PLUS / INDEPENDENT PROJECT</span><span>BD / BDT <span className="footer-dot">●</span> MANUAL PAYMENT REVIEW</span></div></footer>;
}

export function AppChrome({ children }: { children: React.ReactNode }) {
  return <><Header /><main id="main-content">{children}</main><Footer /><CartDrawer /></>;
}
