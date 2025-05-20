import { MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rental } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

interface ListingCardProps {
  listing: Rental;
  onContact: () => void;
}

export default function ListingCard({ listing, onContact }: ListingCardProps) {
  // Get placeholder image based on listing id
  const getListingImage = (id: number) => {
    const images = [
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400",
      "https://pixabay.com/get/g7bd16dbf3cf7db65d14c8d5129cd5376bd768c16c874d76ff81c1ad815b8fffdba37e18ef2321d9f547d59d277f98941cf78cde7440e6f70c3471a8059cd89a2_1280.jpg",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=400"
    ];
    return images[id % images.length];
  };
  
  return (
    <Card className="overflow-hidden h-full">
      <img 
        src={listing.imageUrl || getListingImage(listing.id)} 
        alt={listing.title} 
        className="w-full h-40 object-cover"
      />
      <CardContent className="p-4">
        <div className="flex justify-between">
          <h3 className="text-lg font-medium text-gray-800">{listing.title}</h3>
          <Badge className={listing.isRental ? "bg-accent-100 text-accent" : "bg-green-100 text-green-800"}>
            {listing.isRental ? formatCurrency(listing.price) + "/day" : formatCurrency(listing.price)}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          {listing.category} • {listing.isRental ? "Rental" : "For Sale"}
        </p>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">{listing.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1 text-gray-400" />
            <span>{listing.location}</span>
          </div>
          <Button 
            onClick={onContact} 
            variant="secondary"
            size="sm"
            className="bg-accent-100 text-accent hover:bg-accent-200"
          >
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
