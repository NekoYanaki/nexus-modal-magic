import { useState } from "react";
import {
  Car, Settings, Bell, Home, MessageSquare, Users, CalendarDays, Tent,
  Calendar, CreditCard, Tag, Star, FileText, Database, Boxes, Package,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockTab from "@/components/stock/StockTab";
import AddonManagementTab from "@/components/stock/AddonManagementTab";

interface Addon {
  id: string;
  name: string;
  defaultPrice: number;
  isActive: boolean;
  total: number;
  available: number;
  reserved: number;
  damaged: number;
}

const mockAddons: Addon[] = [
  { id: "AD0001", name: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, total: 10, available: 5, reserved: 3, damaged: 2 },
  { id: "AD0002", name: "อุปกรณ์แคมปิ้ง", defaultPrice: 100, isActive: true, total: 15, available: 10, reserved: 4, damaged: 1 },
  { id: "AD0003", name: "ชุดปิ้งย่าง", defaultPrice: 150, isActive: true, total: 8, available: 8, reserved: 0, damaged: 0 },
  { id: "AD0004", name: "เครื่องปั่นไฟ", defaultPrice: 30000, isActive: true, total: 3, available: 1, reserved: 1, damaged: 1 },
  { id: "AD0005", name: "โต๊ะกลางแจ้ง", defaultPrice: 500, isActive: true, total: 6, available: 6, reserved: 0, damaged: 0 },
  { id: "AD0006", name: "เก้าอี้พับ (ชุด)", defaultPrice: 300, isActive: true, total: 12, available: 8, reserved: 4, damaged: 0 },
  { id: "AD0007", name: "ถังน้ำแข็ง", defaultPrice: 50, isActive: false, total: 0, available: 0, reserved: 0, damaged: 0 },
];

const StockPage = () => {
  const [addons, setAddons] = useState<Addon[]>(mockAddons);

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: MessageSquare, label: "แชทลูกค้า", href: "/" },
    { icon: Car, label: "รถทั้งหมด", href: "/maintenance" },
    { icon: CalendarDays, label: "ปฏิทินราคารถ", href: "/" },
    { icon: Tent, label: "แคมป์ไซต์", href: "/" },
    { icon: Calendar, label: "การจอง", href: "/" },
    { icon: Users, label: "พาร์ทเนอร์", href: "/" },
    { icon: Users, label: "ลูกค้า", href: "/" },
    { icon: CreditCard, label: "การชำระเงิน", href: "/" },
    { icon: Tag, label: "จัดการโปรโมชั่น", href: "/" },
    { icon: Star, label: "รีวิว", href: "/" },
    { icon: FileText, label: "รายงาน", href: "/" },
    { icon: Database, label: "จัดการข้อมูล", href: "/" },
    { icon: Boxes, label: "Stock / Add-on", href: "/stock", active: true },
    { icon: Settings, label: "ตั้งค่า", href: "/" },
  ];

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-56 bg-primary text-primary-foreground flex flex-col">
        <div className="p-4 border-b border-primary-foreground/20">
          <div className="flex items-center gap-2">
            <Car className="w-6 h-6" />
            <div>
              <h1 className="font-bold text-lg">RentCar Admin</h1>
              <p className="text-xs text-primary-foreground/70">จัดการระบบเช่ารถ</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-2">
          <p className="text-xs text-primary-foreground/50 px-3 py-2">เมนูหลัก</p>
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 text-sm transition-colors ${
                item.active
                  ? "bg-accent/20 text-primary-foreground rounded-r-lg border-l-4 border-accent"
                  : "text-primary-foreground/80 hover:bg-primary-foreground/10 rounded-lg"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Stock / Add-on</h1>
            <p className="text-sm text-muted-foreground">บริหารจำนวนคงเหลือและจัดการรายการอุปกรณ์เสริม</p>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-sm">admin</span>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="stock" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="stock" className="gap-2">
              <Package className="w-4 h-4" />
              Stock อุปกรณ์เสริม
            </TabsTrigger>
            <TabsTrigger value="addon" className="gap-2">
              <Boxes className="w-4 h-4" />
              การจัดการ Add-on
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stock">
            <StockTab addons={addons} setAddons={setAddons} />
          </TabsContent>

          <TabsContent value="addon">
            <AddonManagementTab addons={addons} setAddons={setAddons} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StockPage;
