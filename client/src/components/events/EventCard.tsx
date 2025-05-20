import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Event } from "@shared/schema";
import { formatCurrency } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  onBuyTicket: () => void;
}

export default function EventCard({ event, onBuyTicket }: EventCardProps) {
  // Function to determine if event is free
  const isFree = event.price === 0;

  // Get placeholder image based on event id to diversify the appearance
  const getEventImage = (id: number) => {
    const images = [
      "https://pixabay.com/get/ge0c8f0b0fa097c770303a27e4286072a84252a85a3293f8193f855c3b786914047da58d9a3eee1c001be485c6d2c229a88d0215c667dc4be40a12f7bafaabbf4_1280.jpg",
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
      "https://pixabay.com/get/g28b028702a2fe8255441c54046beb1557dcddb39e0f73a941550267f23dbf5b27afb2a756087444909b8c41fb25cdaac97944c5e7fcaf145ed0159c35538ce20_1280.jpg",
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400"
    ];
    return images[id % images.length];
  };

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <img 
        src={event.imageUrl || getEventImage(event.id)} 
        alt={event.title} 
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-medium text-gray-800">{event.title}</h3>
            <p className="text-sm text-gray-500">{event.date} • {event.time}</p>
          </div>
          <Badge className={isFree ? "bg-green-100 text-green-800" : "bg-primary-100 text-primary"}>
            {isFree ? "Free" : formatCurrency(event.price)}
          </Badge>
        </div>
        <p className="mt-3 text-gray-600 text-sm flex-grow">{event.description}</p>
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <MapPin className="h-5 w-5 mr-1 text-gray-400" />
          <span>{event.location}</span>
        </div>
        <div className="mt-5">
          <Button 
            onClick={onBuyTicket} 
            className="w-full"
            variant={isFree ? "secondary" : "default"}
          >
            {isFree ? "Register" : "Buy Ticket"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
