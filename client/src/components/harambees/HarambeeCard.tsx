import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Harambee } from "@shared/schema";
import { formatCurrency, calculateProgressPercentage } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface HarambeeCardProps {
  harambee: Harambee;
  onContribute: () => void;
}

export default function HarambeeCard({ harambee, onContribute }: HarambeeCardProps) {
  const progressPercentage = calculateProgressPercentage(harambee.raisedAmount, harambee.goalAmount);
  
  // Get placeholder image based on harambee id
  const getHarambeeImage = (id: number) => {
    const images = [
      "https://pixabay.com/get/ga31d3061469a73bb13a03d0e3e5e1bedd8200f9a69a0933baddc03be90801a68a9634fde317b8c220dcb0c735189a70f8ccfa86539d0c230b134d3342563181d_1280.jpg",
      "https://images.unsplash.com/photo-1610484826967-09c5720778c7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      "https://pixabay.com/get/gd411083b12520d8ec89b392ad0a02a7cdcb90817e6ae9fd292963cfe06d60390a0dbc118fc8d3ab2410ac7aeabb3234952def0cbced10e4ac23186a159da98be_1280.jpg"
    ];
    return images[id % images.length];
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col border">
      <img 
        src={harambee.imageUrl || getHarambeeImage(harambee.id)} 
        alt={harambee.title} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex items-center">
          <h3 className="text-lg font-medium text-gray-800 flex-grow">{harambee.title}</h3>
          {harambee.verified && (
            <Badge className="ml-2 bg-blue-100 text-blue-800 flex items-center">
              <CheckCircle className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>
        
        <p className="mt-3 text-gray-600 text-sm flex-grow">{harambee.description}</p>
        
        <div className="mt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">{formatCurrency(harambee.raisedAmount)} raised</span>
            <span className="text-gray-500">of {formatCurrency(harambee.goalAmount)} goal</span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-secondary h-2.5 rounded-full" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="mt-5">
          <Button 
            onClick={onContribute} 
            className="w-full bg-secondary hover:bg-secondary-foreground"
          >
            Contribute
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
