import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/events/EventCard";
import CreateEventModal from "@/components/events/CreateEventModal";
import BuyTicketModal from "@/components/events/BuyTicketModal";
import { useModal } from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Event } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";

export default function Events() {
  const { isOpen: isCreateModalOpen, open: openCreateModal, close: closeCreateModal } = useModal();
  const { isOpen: isBuyTicketModalOpen, data: selectedEvent, open: openBuyTicketModal, close: closeBuyTicketModal } = useModal();
  const [limit, setLimit] = useState(6);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const { data: events, isLoading, isError, refetch } = useQuery<Event[]>({
    queryKey: ['/api/events', { limit }],
    queryFn: async () => {
      const res = await fetch(`/api/events?limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    }
  });

  const handleCreateEvent = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to create an event",
        variant: "destructive",
      });
      return;
    }
    openCreateModal();
  };

  const handleBuyTicket = (event: Event) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to buy tickets",
        variant: "destructive",
      });
      return;
    }
    openBuyTicketModal(event);
  };

  const loadMore = () => {
    setLimit((prev) => prev + 6);
  };

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">Failed to load events. Please try again later.</p>
        <Button onClick={() => refetch()} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <section className="py-10 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-800">Upcoming Events</h2>
            <p className="text-gray-500 mt-1">Discover what's happening in Mombasa</p>
          </div>
          <Button onClick={handleCreateEvent} className="inline-flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Event
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events && events.length > 0 ? (
                events.map((event) => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onBuyTicket={() => handleBuyTicket(event)} 
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-20">
                  <p className="text-gray-500">No events found. Be the first to create one!</p>
                </div>
              )}
            </div>

            {events && events.length >= limit && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  className="inline-flex items-center"
                >
                  Load More Events
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateEventModal 
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onEventCreated={() => {
          refetch();
          closeCreateModal();
        }}
      />

      {selectedEvent && (
        <BuyTicketModal
          isOpen={isBuyTicketModalOpen}
          onClose={closeBuyTicketModal}
          event={selectedEvent as Event}
        />
      )}
    </section>
  );
}
