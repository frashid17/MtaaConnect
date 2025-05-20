import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuthActions } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import LoginModal from "@/components/auth/LoginModal";
import SignupModal from "@/components/auth/SignupModal";
import MobileMenu from "@/components/layout/MobileMenu";
import { Menu } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "Harambees", href: "/harambees" },
  { name: "Rent & Sell", href: "/rentals" },
  { name: "Alerts", href: "/alerts" },
];

export default function Header() {
  const [location] = useLocation();
  const { isAuthenticated, logout, currentUser } = useAuthActions();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <h1 className="text-xl font-display font-bold text-primary cursor-pointer">
                  MTAA CONNECT
                </h1>
              </Link>
            </div>
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      location === link.href
                        ? "border-primary text-primary-foreground"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {link.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated ? (
              <Button
                variant="outline"
                onClick={() => logout()}
                className="ml-3"
              >
                Logout {currentUser?.displayName && `(${currentUser.displayName})`}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={() => setIsLoginModalOpen(true)}
                  className="text-primary bg-primary-50 hover:bg-primary-100 border-transparent"
                >
                  Login
                </Button>
                <Button
                  variant="default"
                  onClick={() => setIsSignupModalOpen(true)}
                  className="ml-3"
                >
                  Sign up
                </Button>
              </>
            )}
            <div className="sm:hidden ml-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        currentPath={location}
      />
      
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSignupClick={() => {
          setIsLoginModalOpen(false);
          setIsSignupModalOpen(true);
        }}
      />
      
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={() => setIsSignupModalOpen(false)}
        onLoginClick={() => {
          setIsSignupModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
    </header>
  );
}
