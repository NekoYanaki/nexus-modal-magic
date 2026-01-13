import { useState } from "react";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface BookingFiltersProps {
  startDate: Date | undefined;
  endDate: Date | undefined;
  onStartDateChange: (date: Date | undefined) => void;
  onEndDateChange: (date: Date | undefined) => void;
  selectedVehicleTypes: string[];
  onVehicleTypesChange: (types: string[]) => void;
  selectedFeatures: string[];
  onFeaturesChange: (features: string[]) => void;
}

const VEHICLE_TYPES = [
  "Campervan",
  "Motorhome",
  "Pickup Camper",
  "Caravan",
];

const FEATURES = [
  "Shower",
  "Toilet",
  "Freezer",
  "Kitchen equipment",
  "Fridge",
  "Hot water",
  "GPS",
  "AC in cab",
  "AC in living area",
  "Bluetooth",
  "TV",
  "Floor heating",
  "Aux-port",
  "Solar panel",
  "Oven",
  "Microwave oven",
  "Parking sensors",
  "Back up camera",
];

export const BookingFilters = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  selectedVehicleTypes,
  onVehicleTypesChange,
  selectedFeatures,
  onFeaturesChange,
}: BookingFiltersProps) => {
  const toggleVehicleType = (type: string) => {
    if (selectedVehicleTypes.includes(type)) {
      onVehicleTypesChange(selectedVehicleTypes.filter((t) => t !== type));
    } else {
      onVehicleTypesChange([...selectedVehicleTypes, type]);
    }
  };

  const toggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      onFeaturesChange(selectedFeatures.filter((f) => f !== feature));
    } else {
      onFeaturesChange([...selectedFeatures, feature]);
    }
  };

  return (
    <div className="flex flex-wrap gap-3 mb-6">
      {/* Start Date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[180px] justify-start text-left font-normal",
              !startDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {startDate ? format(startDate, "d MMM yyyy", { locale: th }) : "วันรับรถ"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={startDate}
            onSelect={onStartDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* End Date */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-[180px] justify-start text-left font-normal",
              !endDate && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {endDate ? format(endDate, "d MMM yyyy", { locale: th }) : "วันคืนรถ"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={endDate}
            onSelect={onEndDateChange}
            initialFocus
            disabled={(date) => (startDate ? date < startDate : false)}
          />
        </PopoverContent>
      </Popover>

      {/* Vehicle Type Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            Vehicle type
            {selectedVehicleTypes.length > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {selectedVehicleTypes.length}
              </span>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          {VEHICLE_TYPES.map((type) => (
            <DropdownMenuCheckboxItem
              key={type}
              checked={selectedVehicleTypes.includes(type)}
              onCheckedChange={() => toggleVehicleType(type)}
            >
              {type}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Features Filter */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            Features
            {selectedFeatures.length > 0 && (
              <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                {selectedFeatures.length}
              </span>
            )}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 max-h-64 overflow-y-auto">
          {FEATURES.map((feature) => (
            <DropdownMenuCheckboxItem
              key={feature}
              checked={selectedFeatures.includes(feature)}
              onCheckedChange={() => toggleFeature(feature)}
            >
              {feature}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
