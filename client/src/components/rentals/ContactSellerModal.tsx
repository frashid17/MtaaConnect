import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Rental } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Phone, Mail, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  listing: Rental;
}

export default function ContactSellerModal({
  isOpen,
  onClose,
  listing,
}: ContactSellerModalProps) {
  const { toast } = useToast();

  const handleCopyContact = () => {
    navigator.clipboard.writeText(listing.contactInfo);
    toast({
      title: "Contact copied",
      description: "The contact information has been copied to your clipboard.",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Seller</DialogTitle>
          <DialogDescription>
            Get in touch with the seller of this {listing.isRental ? "rental" : "sale"} listing.
          </DialogDescription>
        </DialogHeader>

        <div className="border rounded-lg p-4 bg-gray-50 mb-4">
          <h3 className="font-medium text-gray-900">{listing.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {listing.category} • {listing.isRental ? "Rental" : "For Sale"}
          </p>
          <div className="flex items-center mt-1">
            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm text-gray-600">{listing.location}</span>
          </div>
          <div className="mt-2 font-medium text-gray-900">
            {listing.isRental 
              ? `${formatCurrency(listing.price)}/day` 
              : formatCurrency(listing.price)}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-1">Contact Information</h4>
            <div className="flex items-center justify-between border rounded-md p-3">
              <div className="flex items-center">
                {listing.contactInfo.includes('@') ? (
                  <Mail className="h-4 w-4 text-gray-400 mr-2" />
                ) : (
                  <Phone className="h-4 w-4 text-gray-400 mr-2" />
                )}
                <span className="text-sm">{listing.contactInfo}</span>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={handleCopyContact} 
                className="h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-md text-sm text-blue-700">
            <p>
              <strong>Safety tips:</strong>
            </p>
            <ul className="list-disc list-inside mt-1 space-y-1">
              <li>Meet in a public place</li>
              <li>Don't share personal financial information</li>
              <li>Verify the item before payment</li>
              <li>For high-value items, consider escrow services</li>
            </ul>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
