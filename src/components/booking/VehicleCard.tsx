import { MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface VehicleCardProps {
  id: string;
  name: string;
  image: string;
  location?: string;
  features: string[];
  capacity: number;
  pricePerNight: number;
  currency?: string;
  onClick?: () => void;
}

export const VehicleCard = ({
  name,
  image,
  location,
  features,
  capacity,
  pricePerNight,
  currency = "฿",
  onClick,
}: VehicleCardProps) => {
  return (
    <Card 
      className="flex flex-col md:flex-row overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={onClick}
    >
      {/* Vehicle Image */}
      <div className="w-full md:w-72 h-48 md:h-auto flex-shrink-0">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Vehicle Details */}
      <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
        <div>
          {/* Name and Location */}
          <h3 className="text-lg font-semibold text-foreground mb-1">{name}</h3>
          {location && (
            <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-4">
            {features.map((feature, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs font-normal bg-background"
              >
                {feature}
              </Badge>
            ))}
          </div>

          {/* Capacity */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm">
            <Users className="h-4 w-4" />
            <span>Up to {capacity} guests</span>
          </div>
        </div>

        {/* Price */}
        <div className="text-right mt-4 md:mt-0">
          <span className="text-2xl font-bold text-foreground">
            {currency}{pricePerNight.toLocaleString()}
          </span>
          <p className="text-sm text-muted-foreground">per night</p>
        </div>
      </div>
    </Card>
  );
};
