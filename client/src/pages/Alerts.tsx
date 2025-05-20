import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import AlertCard from "@/components/alerts/AlertCard";
import CreateAlertModal from "@/components/alerts/CreateAlertModal";
import ContactAlertPosterModal from "@/components/alerts/ContactAlertPosterModal";
import { useModal } from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Alert } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";

export default function Alerts() {
  const { isOpen: isCreateModalOpen, open: openCreateModal, close: closeCreateModal } = useModal();
  const { isOpen: isContactModalOpen, data: selectedAlert, open: openContactModal, close: closeContactModal } = useModal();
  const [limit, setLimit] = useState(6);
  const [alertType, setAlertType] = useState<string | undefined>(undefined);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const { data: alerts, isLoading, isError, refetch } = useQuery<Alert[]>({
    queryKey: ['/api/alerts', { limit, type: alertType }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (limit) queryParams.append('limit', limit.toString());
      if (alertType) queryParams.append('type', alertType);
      
      const res = await fetch(`/api/alerts?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch alerts');
      return res.json();
    }
  });

  const handleCreateAlert = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to post an alert",
        variant: "destructive",
      });
      return;
    }
    openCreateModal();
  };

  const handleContactPoster = (alert: Alert) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to contact alert posters",
        variant: "destructive",
      });
      return;
    }
    openContactModal(alert);
  };

  const handleTypeChange = (newType: string | undefined) => {
    setAlertType(newType === 'All' ? undefined : newType);
  };

  const loadMore = () => {
    setLimit((prev) => prev + 6);
  };

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">Failed to load alerts. Please try again later.</p>
        <Button onClick={() => refetch()} className="mt-4">Retry</Button>
      </div>
    );
  }

  const alertTypes = [
    'All', 
    'Lost & Found', 
    'Emergency', 
    'Community Safety', 
    'Service Interruption', 
    'Weather'
  ];

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-800">Community Alerts</h2>
            <p className="text-gray-500 mt-1">Lost & found, emergency notices, and important updates</p>
          </div>
          <Button 
            onClick={handleCreateAlert} 
            className="inline-flex items-center bg-red-600 hover:bg-red-700 text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Post Alert
          </Button>
        </div>

        {/* Alert Type Filters */}
        <div className="mb-6 overflow-x-auto hide-scrollbar">
          <div className="flex space-x-2 py-2">
            {alertTypes.map((type) => (
              <Button
                key={type}
                variant={alertType === type || (type === 'All' && !alertType) ? "default" : "outline"}
                className={alertType === type || (type === 'All' && !alertType) 
                  ? "bg-red-600 hover:bg-red-700 text-white rounded-full" 
                  : "bg-white text-gray-600 hover:bg-gray-100 rounded-full"}
                onClick={() => handleTypeChange(type === 'All' ? undefined : type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-red-600" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {alerts && alerts.length > 0 ? (
                alerts.map((alert) => (
                  <AlertCard 
                    key={alert.id} 
                    alert={alert} 
                    onContact={() => handleContactPoster(alert)}
                    onComment={() => handleContactPoster(alert)} 
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-20">
                  <p className="text-gray-500">No alerts found. Be the first to post an alert!</p>
                </div>
              )}
            </div>

            {alerts && alerts.length >= limit && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  className="inline-flex items-center"
                >
                  View More Alerts
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateAlertModal 
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onAlertCreated={() => {
          refetch();
          closeCreateModal();
        }}
      />

      {selectedAlert && (
        <ContactAlertPosterModal
          isOpen={isContactModalOpen}
          onClose={closeContactModal}
          alert={selectedAlert as Alert}
        />
      )}
    </section>
  );
}
