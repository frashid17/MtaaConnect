import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert } from "@shared/schema";
import { formatDate } from "@/lib/utils";
import { MapPin, MessageSquare } from "lucide-react";

interface AlertCardProps {
  alert: Alert;
  onContact: () => void;
  onComment: () => void;
}

export default function AlertCard({ alert, onContact, onComment }: AlertCardProps) {
  // Get placeholder image based on alert id and type
  const getAlertImage = (id: number, type: string) => {
    if (type === 'Lost & Found') {
      return "https://images.unsplash.com/photo-1570018144715-43110363d70a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400";
    } else if (type === 'Emergency') {
      return "https://pixabay.com/get/gea0f1a11759bfd2af2872b74b396284871f39fc03f6832f87ed56931a71823cf314732bdf7d7c29b9c1be6dd6e06a13c49359b9c9fe6cec7343cd5eb1667e0f7_1280.jpg";
    } else {
      const images = [
        "https://images.unsplash.com/photo-1508175688576-e2bc4fb8c8b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
        "https://images.unsplash.com/photo-1550353127-b0da3aeaa0ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
      ];
      return images[id % images.length];
    }
  };

  // Get badge color based on alert type
  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'Lost & Found':
        return "bg-yellow-100 text-yellow-800";
      case 'Emergency':
        return "bg-red-100 text-red-800";
      case 'Community Safety':
        return "bg-blue-100 text-blue-800";
      case 'Service Interruption':
        return "bg-purple-100 text-purple-800";
      case 'Weather':
        return "bg-teal-100 text-teal-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="overflow-hidden border border-red-100">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <Badge className={`mb-2 ${getBadgeColor(alert.type)}`}>
              {alert.type}
            </Badge>
            <h3 className="text-lg font-medium text-gray-800">{alert.title}</h3>
          </div>
          <p className="text-xs text-gray-500 whitespace-nowrap ml-2">
            {formatDate(alert.createdAt)}
          </p>
        </div>
        
        {alert.imageUrl && (
          <img 
            src={alert.imageUrl || getAlertImage(alert.id, alert.type)} 
            alt={alert.title} 
            className="mt-3 w-full h-48 object-cover rounded-md"
          />
        )}
        
        <p className="mt-3 text-gray-600 text-sm">{alert.description}</p>
        
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1 text-gray-400" />
          <span>{alert.location}</span>
        </div>
        
        <div className="mt-5 flex space-x-3">
          <Button 
            onClick={onComment} 
            variant="outline" 
            className="flex-1"
          >
            <MessageSquare className="h-5 w-5 mr-1" />
            Comment
          </Button>
          <Button 
            onClick={onContact} 
            variant="default" 
            className="flex-1"
          >
            Contact
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
