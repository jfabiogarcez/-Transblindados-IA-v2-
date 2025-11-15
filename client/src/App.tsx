import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import { useEffect } from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Admin from "./pages/Admin";

function Router() {
  // Sync cart to localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      // This will trigger re-renders when cart changes
      window.dispatchEvent(new Event("cartUpdated"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/produtos" component={Home} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/pagamento/:orderId" component={Payment} />
      <Route path="/admin" component={Admin} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
