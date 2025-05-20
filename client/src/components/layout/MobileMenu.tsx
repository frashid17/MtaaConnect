import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
}

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Events", href: "/events" },
  { name: "Harambees", href: "/harambees" },
  { name: "Rent & Sell", href: "/rentals" },
  { name: "Alerts", href: "/alerts" },
];

export default function MobileMenu({ isOpen, onClose, currentPath }: MobileMenuProps) {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[240px] sm:w-[300px]">
        <div className="py-4">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <a
                  className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    currentPath === link.href
                      ? "bg-primary-50 border-primary text-primary-foreground"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                  onClick={onClose}
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
