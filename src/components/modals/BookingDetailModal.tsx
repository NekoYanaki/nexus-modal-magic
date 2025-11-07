import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { BookingHeader } from "./booking/BookingHeader";
import { BookingTabs } from "./booking/BookingTabs";
import { BookingSummary } from "./booking/BookingSummary";
import { BookingInspections } from "./booking/BookingInspections";
import { BookingFiles } from "./booking/BookingFiles";
import { BookingTimeline } from "./booking/BookingTimeline";
import { BookingSidebar } from "./booking/BookingSidebar";

interface BookingDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type BookingStatus = "confirmed" | "waiting" | "cancelled";

export interface BookingData {
  code: string;
  vehicleName: string;
  status: BookingStatus;
  dateRange: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropoffLocation: string;
  mainDriver: string;
  vehicleModel: string;
  licensePlate: string;
  insurance: string;
  campName: string;
  campNights: number;
  campAmenities: string[];
  deposit: number;
  vehicleRental: number;
  campFee: number;
  totalPaid: number;
  totalDue: number;
  customerEmail: string;
}

const mockBookingData: BookingData = {
  code: "BK002",
  vehicleName: "Toyota Fortuner",
  status: "confirmed",
  dateRange: "15–19 Mar 2024",
  customerName: "สมชาย ใจดี",
  customerPhone: "081-234-5678",
  pickupLocation: "สาขากรุงเทพ (สุขุมวิท)",
  dropoffLocation: "สาขากรุงเทพ (สุขุมวิท)",
  mainDriver: "สมชาย ใจดี",
  vehicleModel: "Toyota Fortuner 2.8 4WD",
  licensePlate: "กข-1234 กรุงเทพมหานคร",
  insurance: "Insurance Class 1",
  campName: "ค่ายภูทับเบิก แพคเกจ VIP",
  campNights: 2,
  campAmenities: ["เต็นท์ขนาดใหญ่", "เตาปิ้งย่าง", "เก้าอี้ 4 ตัว", "โคมไฟ LED"],
  deposit: 4000,
  vehicleRental: 12000,
  campFee: 3200,
  totalPaid: 4000,
  totalDue: 15200,
  customerEmail: "somchai@example.com",
};

export const BookingDetailModal = ({ open, onOpenChange }: BookingDetailModalProps) => {
  const [activeTab, setActiveTab] = useState("summary");
  const [bookingData] = useState<BookingData>(mockBookingData);

  const renderTabContent = () => {
    switch (activeTab) {
      case "summary":
        return <BookingSummary data={bookingData} />;
      case "inspections":
        return <BookingInspections />;
      case "files":
        return <BookingFiles />;
      case "timeline":
        return <BookingTimeline />;
      default:
        return <BookingSummary data={bookingData} />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[960px] max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-0">
          <BookingHeader data={bookingData} />
        </DialogHeader>

        <BookingTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <div className="grid grid-cols-3 gap-6 px-6 pb-6 overflow-y-auto">
          <div className="col-span-2 space-y-4">{renderTabContent()}</div>

          <div className="col-span-1">
            <BookingSidebar data={bookingData} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
