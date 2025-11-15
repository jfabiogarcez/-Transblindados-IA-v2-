import { ShoppingBag, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "./ui/button";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

interface HeaderProps {
  cartItemCount?: number;
  onCartClick?: () => void;
}

export default function Header({ cartItemCount = 0, onCartClick }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();

  const isAdmin = user?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer">
            <h1 className="text-2xl font-bold text-primary">Allure</h1>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/">
            <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === '/' ? 'text-primary' : 'text-foreground'}`}>
              Início
            </span>
          </Link>
          <Link href="/produtos">
            <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === '/produtos' ? 'text-primary' : 'text-foreground'}`}>
              Produtos
            </span>
          </Link>
          {isAdmin && (
            <Link href="/admin">
              <span className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === '/admin' ? 'text-primary' : 'text-foreground'}`}>
                Admin
              </span>
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center space-x-4">
          {/* Cart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={onCartClick}
          >
            <ShoppingBag className="h-5 w-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Button>

          {/* User Button */}
          {isAuthenticated ? (
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Button variant="ghost" size="sm" asChild>
              <a href={getLoginUrl()}>Entrar</a>
            </Button>
          )}

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container py-4 flex flex-col space-y-4">
            <Link href="/">
              <span
                className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === '/' ? 'text-primary' : 'text-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Início
              </span>
            </Link>
            <Link href="/produtos">
              <span
                className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === '/produtos' ? 'text-primary' : 'text-foreground'}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Produtos
              </span>
            </Link>
            {isAdmin && (
              <Link href="/admin">
                <span
                  className={`text-sm font-medium transition-colors hover:text-primary cursor-pointer ${location === '/admin' ? 'text-primary' : 'text-foreground'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin
                </span>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
