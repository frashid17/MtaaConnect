import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import HarambeeCard from "@/components/harambees/HarambeeCard";
import CreateHarambeeModal from "@/components/harambees/CreateHarambeeModal";
import ContributeModal from "@/components/harambees/ContributeModal";
import { useModal } from "@/hooks/use-modal";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { Harambee } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";

export default function Harambees() {
  const { isOpen: isCreateModalOpen, open: openCreateModal, close: closeCreateModal } = useModal();
  const { isOpen: isContributeModalOpen, data: selectedHarambee, open: openContributeModal, close: closeContributeModal } = useModal();
  const [limit, setLimit] = useState(6);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const { data: harambees, isLoading, isError, refetch } = useQuery<Harambee[]>({
    queryKey: ['/api/harambees', { limit }],
    queryFn: async () => {
      const res = await fetch(`/api/harambees?limit=${limit}`);
      if (!res.ok) throw new Error('Failed to fetch harambees');
      return res.json();
    }
  });

  const handleCreateHarambee = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to start a harambee",
        variant: "destructive",
      });
      return;
    }
    openCreateModal();
  };

  const handleContribute = (harambee: Harambee) => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please log in to contribute",
        variant: "destructive",
      });
      return;
    }
    openContributeModal(harambee);
  };

  const loadMore = () => {
    setLimit((prev) => prev + 6);
  };

  if (isError) {
    return (
      <div className="py-10 text-center">
        <p className="text-red-500">Failed to load harambees. Please try again later.</p>
        <Button onClick={() => refetch()} className="mt-4">Retry</Button>
      </div>
    );
  }

  return (
    <section className="py-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-display font-bold text-gray-800">Community Harambees</h2>
            <p className="text-gray-500 mt-1">Support causes that matter in our community</p>
          </div>
          <Button onClick={handleCreateHarambee} className="inline-flex items-center bg-secondary hover:bg-secondary-foreground">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Start Harambee
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-secondary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {harambees && harambees.length > 0 ? (
                harambees.map((harambee) => (
                  <HarambeeCard 
                    key={harambee.id} 
                    harambee={harambee} 
                    onContribute={() => handleContribute(harambee)} 
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-20">
                  <p className="text-gray-500">No harambees found. Be the first to start one!</p>
                </div>
              )}
            </div>

            {harambees && harambees.length >= limit && (
              <div className="mt-8 text-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  className="inline-flex items-center"
                >
                  View More Harambees
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <CreateHarambeeModal 
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        onHarambeeCreated={() => {
          refetch();
          closeCreateModal();
        }}
      />

      {selectedHarambee && (
        <ContributeModal
          isOpen={isContributeModalOpen}
          onClose={closeContributeModal}
          harambee={selectedHarambee as Harambee}
          onContributionSuccess={() => {
            refetch();
            closeContributeModal();
          }}
        />
      )}
    </section>
  );
}
