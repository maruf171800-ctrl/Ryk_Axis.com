import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppChrome } from "@/components/StorefrontChrome";
import { StoreProvider } from "@/lib/store";
import { Route, Switch, useLocation } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Account from "./pages/Account";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import { Campaigns, DigitalVault, InfoPage } from "./pages/ContentPages";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Product from "./pages/Product";
import Shop from "./pages/Shop";
import Seller from "./pages/Seller";

function Router() {
  return <Switch>
    <Route path="/" component={Home} />
    <Route path="/shop" component={Shop} />
    <Route path="/product/:slug" component={Product} />
    <Route path="/cart" component={Cart} />
    <Route path="/checkout" component={Checkout} />
    <Route path="/account/:rest*" component={Account} />
    <Route path="/account" component={Account} />
    <Route path="/wishlist" component={Account} />
    <Route path="/digital-vault" component={DigitalVault} />
    <Route path="/campaigns" component={Campaigns} />
    <Route path="/why-ryk" component={() => <InfoPage type="why" />} />
    <Route path="/support" component={() => <InfoPage type="support" />} />
    <Route path="/returns" component={() => <InfoPage type="returns" />} />
    <Route path="/seller/:rest*" component={Seller} />
    <Route path="/seller" component={Seller} />
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  const [location] = useLocation();
  const isSellerRoute = location.startsWith("/seller");
  return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster /><StoreProvider>{isSellerRoute ? <Router /> : <AppChrome><Router /></AppChrome>}</StoreProvider></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
export default App;
