import { useState } from "react";
import { VehicleCard } from "@/components/booking/VehicleCard";
import { BookingFilters } from "@/components/booking/BookingFilters";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, Home, Map, Phone, Facebook, Instagram, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data for vehicles
const MOCK_VEHICLES = [
  {
    id: "1",
    name: "Toyota Hilux Revo",
    image: "https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=400&h=300&fit=crop",
    location: "",
    features: ["Shower", "Toilet", "Freezer", "Kitchen equipment", "Fridge", "Hot water", "GPS", "AC in cab", "AC in living area", "Bluetooth", "TV", "Floor heating", "Aux-port", "Solar panel", "Adapter to electrical connection", "Mosquito net"],
    capacity: 4,
    pricePerNight: 5000,
  },
  {
    id: "2",
    name: "All-New TRITON",
    image: "https://images.unsplash.com/photo-1543465077-db45d34b88a5?w=400&h=300&fit=crop",
    location: "",
    features: ["Cooking plate", "Freezer", "Shower", "Toilet", "Fridge", "Kitchen equipment"],
    capacity: 4,
    pricePerNight: 5000,
  },
  {
    id: "3",
    name: "Toyota Champ",
    image: "https://images.unsplash.com/photo-1533591380348-14193f1de18f?w=400&h=300&fit=crop",
    location: "",
    features: ["Cooking plate", "Freezer", "Shower", "Toilet", "Fridge", "Kitchen equipment", "Oven"],
    capacity: 4,
    pricePerNight: 5000,
  },
  {
    id: "4",
    name: "MERCEDES-BENZ",
    image: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=400&h=300&fit=crop",
    location: "",
    features: ["Cooking plate", "Freezer", "Shower", "Toilet", "Kitchen equipment", "Fridge", "Oven", "Microwave oven", "Hot water", "GPS", "Parking sensors", "Back up camera", "AC in cab", "AC in living area"],
    capacity: 4,
    pricePerNight: 12000,
  },
];

export default function BookingPage() {
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(
    new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
  );
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Filter vehicles based on selected features
  const filteredVehicles = MOCK_VEHICLES.filter((vehicle) => {
    if (selectedFeatures.length === 0) return true;
    return selectedFeatures.every((feature) =>
      vehicle.features.includes(feature)
    );
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-xl font-bold">
              <span className="text-primary">RVn</span>
              <span className="text-foreground">CAMP</span>
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/booking" className="text-sm text-foreground font-medium">
              Campervan Rentals
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact Us
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Button variant="default" size="sm">
              Sign In
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Filters */}
        <BookingFilters
          startDate={startDate}
          endDate={endDate}
          onStartDateChange={setStartDate}
          onEndDateChange={setEndDate}
          selectedVehicleTypes={selectedVehicleTypes}
          onVehicleTypesChange={setSelectedVehicleTypes}
          selectedFeatures={selectedFeatures}
          onFeaturesChange={setSelectedFeatures}
        />

        {/* Results Count */}
        <h2 className="text-lg font-semibold mb-4">
          {filteredVehicles.length} Vehicle type found
        </h2>

        {/* Vehicle List */}
        <div className="space-y-4">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              {...vehicle}
              currency="฿"
              onClick={() => console.log("Selected vehicle:", vehicle.id)}
            />
          ))}
        </div>

        {/* No More Results */}
        {filteredVehicles.length > 0 && (
          <div className="text-center py-8">
            <Button variant="outline" disabled>
              No more results
            </Button>
          </div>
        )}

        {/* No Results */}
        {filteredVehicles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">ไม่พบรถที่ตรงกับเงื่อนไข</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 border-t mt-auto">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Main Menu */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Home className="h-4 w-4" />
                Main Menu
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                <li><Link to="/booking" className="hover:text-foreground">Campervan Rentals</Link></li>
                <li><Link to="#" className="hover:text-foreground">Campsites</Link></li>
                <li><Link to="#" className="hover:text-foreground">My Trips</Link></li>
              </ul>
            </div>

            {/* For Partners */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <User className="h-4 w-4" />
                For Partners
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground">Partner Registration</Link></li>
              </ul>
            </div>

            {/* General Info */}
            <div>
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Map className="h-4 w-4" />
                General Info
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground">About Us</Link></li>
                <li><Link to="#" className="hover:text-foreground">Contact Us</Link></li>
                <li><Link to="#" className="hover:text-foreground">Privacy Policy</Link></li>
                <li><Link to="#" className="hover:text-foreground">Terms & Conditions</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex items-center gap-3">
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  <MessageCircle className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2025 RVnCamp. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
