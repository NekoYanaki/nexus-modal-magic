import { createContext, useContext, useState, ReactNode } from "react";

export type StockStatus = "available" | "reserved" | "in_use" | "damaged" | "broken";
export type AddonKind = "equipment" | "consumable";

export interface AddonType {
  id: string;
  name: string;
  price: number;
  kind: AddonKind;
}

export interface Addon {
  id: string;
  name: string;
  category: string;
  defaultPrice: number;
  isActive: boolean;
  stockStatus: StockStatus;
  bookingRef?: string;
}

const initialAddonTypes: AddonType[] = [
  { id: "AD0001", name: "เบาะนั่งเด็ก", price: 300, kind: "equipment" },
  { id: "AD0002", name: "อุปกรณ์แคมปิ้ง", price: 100, kind: "equipment" },
  { id: "AD0003", name: "ชุดปิ้งย่าง", price: 150, kind: "equipment" },
  { id: "AD0004", name: "เครื่องปั่นไฟ", price: 30000, kind: "equipment" },
  { id: "AD0005", name: "โต๊ะกลางแจ้ง", price: 500, kind: "equipment" },
  { id: "AD0006", name: "เก้าอี้พับ (ชุด)", price: 300, kind: "equipment" },
  { id: "AD0007", name: "แก๊สกระป๋อง", price: 45, kind: "consumable" },
  { id: "AD0008", name: "ถ่านไม้ (ถุง)", price: 60, kind: "consumable" },
  { id: "AD0009", name: "น้ำแข็ง (ถุง)", price: 30, kind: "consumable" },
  { id: "AD0010", name: "ถุงขยะ (แพ็ค)", price: 20, kind: "consumable" },
];

const initialAddons: Addon[] = [
  { id: "SEAT-001", name: "เบาะนั่งเด็ก ตัวที่ 1", category: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, stockStatus: "in_use", bookingRef: "BK002" },
  { id: "SEAT-002", name: "เบาะนั่งเด็ก ตัวที่ 2", category: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, stockStatus: "reserved", bookingRef: "BK005" },
  { id: "SEAT-003", name: "เบาะนั่งเด็ก ตัวที่ 3", category: "เบาะนั่งเด็ก", defaultPrice: 300, isActive: true, stockStatus: "available" },
  { id: "CAMP-001", name: "ชุดแคมปิ้ง A", category: "อุปกรณ์แคมปิ้ง", defaultPrice: 100, isActive: true, stockStatus: "reserved", bookingRef: "BK003" },
  { id: "CAMP-002", name: "ชุดแคมปิ้ง B", category: "อุปกรณ์แคมปิ้ง", defaultPrice: 100, isActive: true, stockStatus: "available" },
  { id: "BBQ-001", name: "ชุดปิ้งย่างใหญ่", category: "ชุดปิ้งย่าง", defaultPrice: 150, isActive: true, stockStatus: "in_use", bookingRef: "BK002" },
  { id: "BBQ-002", name: "ชุดปิ้งย่างเล็ก", category: "ชุดปิ้งย่าง", defaultPrice: 100, isActive: true, stockStatus: "available" },
  { id: "GEN-001", name: "เครื่องปั่นไฟ Honda 3kW", category: "เครื่องปั่นไฟ", defaultPrice: 30000, isActive: true, stockStatus: "reserved", bookingRef: "BK004" },
  { id: "GEN-002", name: "เครื่องปั่นไฟ Yamaha 2kW", category: "เครื่องปั่นไฟ", defaultPrice: 25000, isActive: true, stockStatus: "available" },
  { id: "GEN-003", name: "เครื่องปั่นไฟ Honda 5kW", category: "เครื่องปั่นไฟ", defaultPrice: 45000, isActive: false, stockStatus: "damaged" },
  { id: "TBL-001", name: "โต๊ะกลางแจ้ง 6 ที่นั่ง", category: "โต๊ะกลางแจ้ง", defaultPrice: 500, isActive: true, stockStatus: "available" },
  { id: "TBL-002", name: "โต๊ะกลางแจ้ง 4 ที่นั่ง", category: "โต๊ะกลางแจ้ง", defaultPrice: 400, isActive: true, stockStatus: "in_use", bookingRef: "BK001" },
  { id: "CHR-001", name: "เก้าอี้พับ ชุด A (4 ตัว)", category: "เก้าอี้พับ", defaultPrice: 300, isActive: true, stockStatus: "reserved", bookingRef: "BK005" },
  { id: "CHR-002", name: "เก้าอี้พับ ชุด B (4 ตัว)", category: "เก้าอี้พับ", defaultPrice: 300, isActive: true, stockStatus: "available" },
  { id: "ICE-001", name: "ถังน้ำแข็ง 20L", category: "ถังน้ำแข็ง", defaultPrice: 50, isActive: false, stockStatus: "broken" },
  { id: "GAS-001", name: "เตาแก๊สพกพา ตัวที่ 1", category: "เตาแก๊ส", defaultPrice: 200, isActive: true, stockStatus: "available" },
  { id: "GAS-002", name: "เตาแก๊สพกพา ตัวที่ 2", category: "เตาแก๊ส", defaultPrice: 200, isActive: true, stockStatus: "available" },
];

interface AddonContextType {
  addons: Addon[];
  setAddons: React.Dispatch<React.SetStateAction<Addon[]>>;
  addonTypes: AddonType[];
  setAddonTypes: React.Dispatch<React.SetStateAction<AddonType[]>>;
}

const AddonContext = createContext<AddonContextType | null>(null);

export const AddonProvider = ({ children }: { children: ReactNode }) => {
  const [addons, setAddons] = useState<Addon[]>(initialAddons);
  const [addonTypes, setAddonTypes] = useState<AddonType[]>(initialAddonTypes);
  return (
    <AddonContext.Provider value={{ addons, setAddons, addonTypes, setAddonTypes }}>
      {children}
    </AddonContext.Provider>
  );
};

export const useAddons = () => {
  const ctx = useContext(AddonContext);
  if (!ctx) throw new Error("useAddons must be used within AddonProvider");
  return ctx;
};
