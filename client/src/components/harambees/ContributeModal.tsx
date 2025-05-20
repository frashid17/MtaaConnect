import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Harambee } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency } from "@/lib/utils";

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
  harambee: Harambee;
  onContributionSuccess: () => void;
}

export default function ContributeModal({
  isOpen,
  onClose,
  harambee,
  onContributionSuccess,
}: ContributeModalProps) {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const contributionAmount = parseFloat(amount);
    if (isNaN(contributionAmount) || contributionAmount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid contribution amount",
        variant: "destructive",
      });
      return;
    }
    
    if (!phoneNumber) {
      toast({
        title: "Phone number required",
        description: "Please enter your M-Pesa phone number",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Submit contribution to the backend
      const contributionData = {
        harambeeId: harambee.id,
        userId: currentUser?.uid ? parseInt(currentUser.uid) : 1,
        amount: contributionAmount
      };
      
      await apiRequest("POST", "/api/contributions", contributionData);
      
      // Successfully contributed
      setIsPaymentComplete(true);
      
      toast({
        title: "Contribution successful",
        description: `Thank you for your contribution of KSh ${contributionAmount} to this harambee.`,
      });
      
      onContributionSuccess();
    } catch (error: any) {
      toast({
        title: "Contribution failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setAmount("");
    setPhoneNumber("");
    setIsPaymentComplete(false);
    onClose();
  };

  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isPaymentComplete
              ? "Contribution Successful"
              : "Contribute to Harambee"}
          </DialogTitle>
          <DialogDescription>
            {isPaymentComplete
              ? "Thank you for your generosity"
              : harambee.title}
          </DialogDescription>
        </DialogHeader>

        {isPaymentComplete ? (
          <div className="flex flex-col items-center py-6">
            <div className="bg-green-100 p-3 rounded-full mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-12 w-12 text-green-600" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
            
            <h3 className="text-xl font-medium text-center mb-2">
              KSh {amount} Contributed
            </h3>
            
            <p className="text-gray-500 text-center mb-4">
              Your contribution to "{harambee.title}" has been processed successfully.
            </p>
            
            <div className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md w-full">
              <p className="mb-2">Harambee Details:</p>
              <p><strong>Goal:</strong> {formatCurrency(harambee.goalAmount)}</p>
              <p><strong>Raised:</strong> {formatCurrency(harambee.raisedAmount + parseFloat(amount))}</p>
            </div>
            
            <Button 
              variant="default" 
              className="mt-6 w-full bg-secondary hover:bg-secondary-foreground"
              onClick={resetModal}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="mb-2 font-medium">{harambee.title}</div>
                <div className="mt-1 text-sm text-gray-600 line-clamp-2">{harambee.description}</div>
                <div className="mt-2">
                  <span className="text-sm text-gray-500">Goal: {formatCurrency(harambee.goalAmount)}</span>
                  <span className="text-sm text-gray-500 ml-4">Raised: {formatCurrency(harambee.raisedAmount)}</span>
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="amount">Contribution Amount (KSh)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  required
                  className="focus:ring-secondary focus:border-secondary"
                />
                
                <div className="flex flex-wrap gap-2 mt-1">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setAmount(quickAmount.toString())}
                      className="text-xs"
                    >
                      KSh {quickAmount}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone">M-Pesa Phone Number</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="e.g. 07XX XXX XXX"
                  required
                  className="focus:ring-secondary focus:border-secondary"
                />
                <p className="text-xs text-gray-500">
                  You will receive an M-Pesa prompt to complete the payment.
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={resetModal}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isProcessing}
                className="bg-secondary hover:bg-secondary-foreground"
              >
                {isProcessing ? "Processing..." : "Contribute"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
