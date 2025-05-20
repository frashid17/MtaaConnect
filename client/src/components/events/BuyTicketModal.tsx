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
import { Event } from "@shared/schema";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, generateSimpleQRCode } from "@/lib/utils";

interface BuyTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
}

export default function BuyTicketModal({
  isOpen,
  onClose,
  event,
}: BuyTicketModalProps) {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [ticketQRCode, setTicketQRCode] = useState("");

  const isFree = event.price === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!phoneNumber && !isFree) {
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
      
      // Create ticket in the backend
      const ticketData = {
        eventId: event.id,
        userId: currentUser?.uid ? parseInt(currentUser.uid) : 1,
        qrCode: "placeholder" // This will be generated on the server
      };
      
      const response = await apiRequest("POST", "/api/tickets", ticketData);
      const ticket = await response.json();
      
      // Successfully created ticket
      setTicketQRCode(ticket.qrCode);
      setIsPaymentComplete(true);
      
      toast({
        title: isFree ? "Registration successful" : "Payment successful",
        description: isFree 
          ? "You have been registered for this event" 
          : `KSh ${event.price} has been charged from your M-Pesa`,
      });
    } catch (error: any) {
      toast({
        title: isFree ? "Registration failed" : "Payment failed",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetModal = () => {
    setPhoneNumber("");
    setIsPaymentComplete(false);
    setTicketQRCode("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isPaymentComplete
              ? "Your Ticket"
              : isFree
              ? "Register for Event"
              : "Buy Ticket"}
          </DialogTitle>
          <DialogDescription>
            {isPaymentComplete
              ? "Keep this QR code to access the event"
              : `${event.title} - ${event.date} at ${event.time}`}
          </DialogDescription>
        </DialogHeader>

        {isPaymentComplete ? (
          <div className="flex flex-col items-center py-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 mb-4 bg-gray-50">
              <div className="text-center mb-4">
                <p className="text-xl font-semibold">{event.title}</p>
                <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
                <p className="text-sm text-gray-500">{event.location}</p>
              </div>
              
              <div className="flex justify-center mb-2">
                {/* In a real app, we would use a QR code library here */}
                <div className="bg-white p-2 border border-gray-200 rounded">
                  <svg
                    className="h-32 w-32 text-black"
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="100" height="100" fill="white" />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 10H40V40H10V10ZM15 15H35V35H15V15Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M60 10H90V40H60V10ZM65 15H85V35H65V15Z"
                      fill="currentColor"
                    />
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M10 60H40V90H10V60ZM15 65H35V85H15V65Z"
                      fill="currentColor"
                    />
                    <rect x="20" y="20" width="10" height="10" fill="currentColor" />
                    <rect x="70" y="20" width="10" height="10" fill="currentColor" />
                    <rect x="20" y="70" width="10" height="10" fill="currentColor" />
                    <rect x="50" y="50" width="10" height="10" fill="currentColor" />
                    <rect x="70" y="50" width="10" height="10" fill="currentColor" />
                    <rect x="50" y="70" width="10" height="10" fill="currentColor" />
                    <rect x="70" y="70" width="10" height="10" fill="currentColor" />
                    <rect x="70" y="80" width="10" height="10" fill="currentColor" />
                    <rect x="80" y="70" width="10" height="10" fill="currentColor" />
                    <rect x="60" y="60" width="10" height="10" fill="currentColor" />
                    <rect x="80" y="50" width="10" height="10" fill="currentColor" />
                    <rect x="50" y="60" width="10" height="10" fill="currentColor" />
                  </svg>
                </div>
              </div>
              
              <p className="text-xs text-center text-gray-500">Ticket ID: {ticketQRCode}</p>
            </div>
            
            <div className="text-center text-sm text-gray-600">
              <p>Present this QR code at the event entrance</p>
              {!isFree && (
                <p className="mt-2">
                  Payment of {formatCurrency(event.price)} completed via M-Pesa
                </p>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <div className="mb-2 font-medium">{event.title}</div>
                <div className="text-sm text-gray-500">
                  {event.date}, {event.time}
                </div>
                <div className="text-sm text-gray-500">{event.location}</div>
                <div className="mt-2 font-semibold">
                  {isFree ? "Free Entry" : formatCurrency(event.price)}
                </div>
              </div>

              {!isFree && (
                <div className="grid gap-2">
                  <Label htmlFor="phone">M-Pesa Phone Number</Label>
                  <Input
                    id="phone"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. 07XX XXX XXX"
                    required
                  />
                  <p className="text-xs text-gray-500">
                    You will receive an M-Pesa prompt to complete the payment.
                  </p>
                </div>
              )}
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
              <Button type="submit" disabled={isProcessing}>
                {isProcessing
                  ? isFree
                    ? "Registering..."
                    : "Processing..."
                  : isFree
                  ? "Register"
                  : "Pay with M-Pesa"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
