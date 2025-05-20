import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import ListingCard from "@/components/rentals/ListingCard";
import CreateListingModal from "@/components/rentals/CreateListingModal";
import ContactSellerModal from "@/components/rentals/ContactSellerModal";
import { useModal } from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Rental } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";

export default function Rentals() {
  const { isOpen: isCreateModalOpen, open: openCreateModal, close: closeCreateModal } = useModal();
  const { isOpen: isContactModalOpen, data: selectedListing, open: openContactModal, close: closeContactModal } = useModal();
  const [limit, setLimit] = useState(8);
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const { data: rentals, isLoading, isError, refetch } = useQuery<Rental[]>({
    queryKey: ['/api/rentals', { limit, category }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit.toString());
      if (category) queryParams.append('category', category);
      
      const res = await fetch(`/api/rentals?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch rentals');
      return res.json();
    }
  });

  const handleCreateListing = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to list an item",
        variant: "destructive",
      });
      return;
    }
    openCreateModal();
  };

  const handleContactSeller = (listing: Rental) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to contact sellers",
        variant: "destructive",
      });
      return;
    }
    openContactModal(listing);
  };

  const handleCategoryChange = (newCategory: string | undefined) => {
    setCategory(newCategory === 'All' ? undefined : newCategory);
  };

  const loadMore = () => {
    setLimit((prev) => prev + 8);
  };

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">Failed to load listings. Please try again later.</p>
        <Button onClick={() => refetch()} className="mt-4">Retry</Button>
      </div>
    );
  }

  const categories = [
    'All', 
    'Electronics', 
    'Furniture', 
    'Vehicles', 
    'Clothing', 
    'Books', 
    'Services', 
    'Housing'
  ];

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-800">Rent & Sell</h2>
            <p className="text-gray-500 mt-1">Find or list items for rent and sale</p>
          </div>
          <Button 
            onClick={handleCreateListing} 
            className="inline-flex items-center bg-accent hover:bg-accent-foreground"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            List Item
          </Button>
        </div>

        {/* Category Filters */}
        <div className="mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 py-2">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={category === cat || (cat === 'All' && !category) ? "default" : "outline"}
                className={category === cat || (cat === 'All' && !category) 
                  ? "bg-accent hover:bg-accent-foreground text-white rounded-full" 
                  : "bg-white text-gray-600 hover:bg-gray-100 rounded-full"}
                onClick={() => handleCategoryChange(cat === 'All' ? undefined : cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {rentals && rentals.length > 0 ? (
                rentals.map((rental) => (
                  <ListingCard 
                    key={rental.id} 
                    listing={rental} 
                    onContact={() => handleContactSeller(rental)} 
                  />
                ))
              ) : (
                <div className="col-span-4 text-center py-20">
                  <p className="text-gray-500">No listings found. Be the first to list an item!</p>
                </div>
              )}
            </div>

            {rentals && rentals.length >= limit && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  className="inline-flex items-center"
                >
                  View More Listings
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateListingModal 
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onListingCreated={() => {
          refetch();
          closeCreateModal();
        }}
      />

      {selectedListing && (
        <ContactSellerModal
          isOpen={isContactModalOpen}
          onClose={closeContactModal}
          listing={selectedListing as Rental}
        />
      )}
    </section>
  );
}
