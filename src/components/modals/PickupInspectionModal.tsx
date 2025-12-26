import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Save, X, LogIn, Trash2, FileText, ChevronsUpDown, Check, CreditCard, Banknote, Receipt, Shield, ShieldCheck, Camera, Upload } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { cn } from "@/lib/utils";

// Master list of Add-on & Accessories
const ADDON_OPTIONS = [
  { value: 'gps', label: 'GPS นำทาง', price: 200 },
  { value: 'child_seat', label: 'เบาะนั่งเด็ก', price: 300 },
  { value: 'wifi_router', label: 'WiFi Router', price: 150 },
  { value: 'camping_gear', label: 'อุปกรณ์แคมปิ้ง', price: 500 },
  { value: 'bbq_set', label: 'ชุดปิ้งย่าง', price: 350 },
  { value: 'bicycle_rack', label: 'แร็คจักรยาน', price: 250 },
  { value: 'awning', label: 'กันสาด', price: 400 },
  { value: 'generator', label: 'เครื่องปั่นไฟ', price: 600 },
  { value: 'outdoor_table', label: 'โต๊ะกลางแจ้ง', price: 200 },
  { value: 'outdoor_chair', label: 'เก้าอี้พับ (ชุด)', price: 150 },
];

interface AddonItem {
  value: string;
  label: string;
  price: number;
}

interface InsuranceOption {
  value: string;
  label: string;
  price: number;
}

interface PickupInspectionData {
  date: string;
  mileage: string;
  fuelLevel: string;
  notes: string;
  addons: AddonItem[];
}

interface DocumentUploads {
  internationalLicense: File | null;
  passport: File | null;
}

interface PaymentDetail {
  deposit: number;
  damageDeposit: number;
  totalAmount: number;
  remainingBalance: number;
}

interface CardPaymentRecord {
  cardType: string;
  lastFourDigits: string;
  transactionId: string;
  approvalCode: string;
  paymentDate: string;
}

// Insurance options
const INSURANCE_OPTIONS: InsuranceOption[] = [
  { value: 'basic', label: 'ประกันพื้นฐาน (Basic)', price: 500 },
  { value: 'standard', label: 'ประกันมาตรฐาน (Standard)', price: 1000 },
  { value: 'premium', label: 'ประกันพรีเมียม (Premium)', price: 2000 },
  { value: 'full', label: 'ประกันเต็มรูปแบบ (Full Coverage)', price: 3500 },
];

interface PickupInspectionModalProps {
  open: boolean;
  onClose: () => void;
  bookingCode: string;
  customerName: string;
  vehicleName: string;
  bookingStatus: string;
  onStatusChange: (status: string) => void;
  pickupData?: PickupInspectionData;
  paymentDetail?: PaymentDetail;
  invoiceAddons?: AddonItem[];
  bookedInsurance?: InsuranceOption | null; // Insurance from booking
  onSave?: (pickup: PickupInspectionData) => void;
}

const defaultPayment: PaymentDetail = {
  deposit: 5000,
  damageDeposit: 3000,
  totalAmount: 12000,
  remainingBalance: 7000,
};

const defaultPickup: PickupInspectionData = {
  date: "15 Mar 2024, 09:00",
  mileage: "45,230",
  fuelLevel: "full",
  notes: "",
  addons: [],
};

// Mock invoice addons (from original booking)
const defaultInvoiceAddons: AddonItem[] = [
  { value: 'gps', label: 'GPS นำทาง', price: 200 },
  { value: 'camping_gear', label: 'อุปกรณ์แคมปิ้ง', price: 500 },
];

const defaultCardPayment: CardPaymentRecord = {
  cardType: "VISA",
  lastFourDigits: "4532",
  transactionId: "TXN-2024031512345",
  approvalCode: "AUTH-789456",
  paymentDate: "15 Mar 2024, 09:15",
};

export const PickupInspectionModal = ({
  open,
  onClose,
  bookingCode,
  customerName,
  vehicleName,
  bookingStatus,
  onStatusChange,
  pickupData = defaultPickup,
  paymentDetail = defaultPayment,
  invoiceAddons = defaultInvoiceAddons,
  bookedInsurance = null,
  onSave,
}: PickupInspectionModalProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pickup, setPickup] = useState<PickupInspectionData>(pickupData);
  const [payment] = useState<PaymentDetail>(paymentDetail);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmed, setConfirmed] = useState(bookingStatus === "picked_up" || bookingStatus === "returned");
  const [addonComboboxOpen, setAddonComboboxOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [cardPayment] = useState<CardPaymentRecord>(defaultCardPayment);
  
  // Insurance state
  const [selectedInsurance, setSelectedInsurance] = useState<InsuranceOption | null>(bookedInsurance);
  const [insuranceComboboxOpen, setInsuranceComboboxOpen] = useState(false);
  
  // Document uploads state
  const [documents, setDocuments] = useState<DocumentUploads>({
    internationalLicense: null,
    passport: null,
  });

  const handleDocumentUpload = (type: 'internationalLicense' | 'passport', file: File | null) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
    if (file) {
      toast.success(`อัปโหลด${type === 'internationalLicense' ? 'ใบขับขี่สากล' : 'Passport'}สำเร็จ`);
    }
  };

  const handleRemoveDocument = (type: 'internationalLicense' | 'passport') => {
    setDocuments(prev => ({ ...prev, [type]: null }));
  };

  const handleAddInsurance = (insuranceValue: string) => {
    const insurance = INSURANCE_OPTIONS.find(i => i.value === insuranceValue);
    if (insurance) {
      setSelectedInsurance(insurance);
      setInsuranceComboboxOpen(false);
      toast.success(`เพิ่มประกัน: ${insurance.label}`);
    }
  };

  const handleRemoveInsurance = () => {
    setSelectedInsurance(null);
    toast.success("ยกเลิกประกันสำเร็จ");
  };

  // Calculate insurance price (only if added at pickup, not from booking)
  const insurancePrice = bookedInsurance ? 0 : (selectedInsurance?.price || 0);

  const invoiceAddonTotal = invoiceAddons.reduce((sum, addon) => sum + addon.price, 0);

  // Addon handlers
  const handleAddAddon = (addonValue: string) => {
    const masterAddon = ADDON_OPTIONS.find(a => a.value === addonValue);
    if (!masterAddon) return;
    
    if (pickup.addons.some(a => a.value === addonValue)) {
      toast.error("รายการนี้ถูกเพิ่มแล้ว");
      return;
    }
    
    setPickup(prev => ({
      ...prev,
      addons: [...prev.addons, { ...masterAddon }]
    }));
  };

  const handleRemoveAddon = (addonValue: string) => {
    setPickup(prev => ({
      ...prev,
      addons: prev.addons.filter(a => a.value !== addonValue)
    }));
  };

  const handleAddonPriceChange = (addonValue: string, newPrice: number) => {
    setPickup(prev => ({
      ...prev,
      addons: prev.addons.map(a => 
        a.value === addonValue ? { ...a, price: newPrice } : a
      )
    }));
  };

  const totalAddonPrice = pickup.addons.reduce((sum, addon) => sum + addon.price, 0);

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(pickup);
    toast.success("บันทึกข้อมูลรับรถสำเร็จ");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPickup(pickupData);
  };

  const handlePrintReceipt = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("ใบเสร็จยอดมัดจำความเสียหาย", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`รหัสการจอง: ${bookingCode}`, 20, 40);
    doc.text(`ลูกค้า: ${customerName}`, 20, 50);
    doc.text(`รถ: ${vehicleName}`, 20, 60);
    
    doc.line(20, 70, 190, 70);
    
    doc.text(`วันที่รับรถ: ${pickup.date}`, 20, 85);
    doc.text(`เลขไมล์: ${pickup.mileage} km`, 20, 95);
    
    doc.line(20, 110, 190, 110);
    
    doc.setFontSize(10);
    doc.text("เอกสารนี้ออกโดยระบบอัตโนมัติ", 105, 130, { align: "center" });

    doc.save(`pickup-receipt-${bookingCode}.pdf`);
    toast.success("ดาวน์โหลดใบเสร็จสำเร็จ");
  };

  const handleConfirm = () => {
    onStatusChange("picked_up");
    setShowConfirm(false);
    setConfirmed(true);
    toast.success("อัปเดตสถานะเป็น Picked Up สำเร็จ");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-emerald-600" />
              รับรถ (Pick Up)
            </DialogTitle>
          </DialogHeader>

          <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800">
            {/* Edit Button */}
            <div className="flex justify-end mb-2">
              {isEditing ? (
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleCancel}>
                  <X className="w-3 h-3 mr-1" />
                  ยกเลิก
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsEditing(true)}>
                  <Pencil className="w-3 h-3 mr-1" />
                  แก้ไข
                </Button>
              )}
            </div>
            
            {/* Inspection Section */}
            <div className="space-y-3">
              <h5 className="font-medium text-sm border-b border-border pb-2">รับรถ (Pick Up)</h5>
              <div className="text-sm space-y-2">
                <div>
                  <p className="text-muted-foreground mb-1">วันที่รับรถ</p>
                  {isEditing ? (
                    <Input
                      value={pickup.date}
                      onChange={(e) => setPickup(prev => ({ ...prev, date: e.target.value }))}
                      className="h-8"
                    />
                  ) : (
                    <p className="font-medium">{pickup.date}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">เลขไมล์</p>
                  {isEditing ? (
                    <Input
                      value={pickup.mileage}
                      onChange={(e) => setPickup(prev => ({ ...prev, mileage: e.target.value }))}
                      className="h-8"
                      placeholder="km"
                    />
                  ) : (
                    <p className="font-medium">{pickup.mileage} km</p>
                  )}
              </div>

              {/* Invoice Add-ons (Read-only) */}
              <div className="pt-3 border-t border-border mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Add-on จาก Invoice ({invoiceAddons.length} รายการ)
                  </p>
                </div>
                
                {invoiceAddons.length > 0 && (
                  <div className="space-y-2">
                    {invoiceAddons.map((addon) => (
                      <div key={addon.value} className="flex items-center justify-between gap-2 border border-border rounded-lg p-2 bg-muted/30">
                        <span className="text-sm font-medium text-muted-foreground">{addon.label}</span>
                        <span className="text-sm text-muted-foreground">฿{addon.price.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

              {/* Add-on & Accessories */}
              <div className="pt-3 border-t border-border mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">เพิ่ม Add-on & Accessories ({pickup.addons.length} รายการ)</p>
                </div>
                
                {/* Searchable Dropdown */}
                {isEditing && (
                  <div className="mb-3">
                    <Popover open={addonComboboxOpen} onOpenChange={setAddonComboboxOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={addonComboboxOpen}
                          className="w-full h-8 justify-between text-sm bg-background"
                        >
                          <span className="text-muted-foreground">ค้นหา Add-on & Accessories...</span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-background border border-border z-50" align="start">
                        <Command>
                          <CommandInput placeholder="ค้นหา Add-on..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>ไม่พบรายการ</CommandEmpty>
                            <CommandGroup>
                              {ADDON_OPTIONS.filter(opt => !pickup.addons.some(a => a.value === opt.value)).map(option => (
                                <CommandItem
                                  key={option.value}
                                  value={option.label}
                                  onSelect={() => {
                                    handleAddAddon(option.value);
                                    setAddonComboboxOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      pickup.addons.some(a => a.value === option.value) ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  {option.label} (฿{option.price.toLocaleString()})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                {/* Selected addons list */}
                {pickup.addons.length > 0 && (
                  <div className="space-y-2">
                    {pickup.addons.map((addon) => (
                      <div key={addon.value} className="flex items-center justify-between gap-2 border border-border rounded-lg p-2 bg-background/50">
                        <span className="text-sm font-medium">{addon.label}</span>
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <>
                              <div className="flex items-center gap-1">
                                <span className="text-muted-foreground text-sm">฿</span>
                                <Input
                                  type="number"
                                  value={addon.price}
                                  onChange={(e) => handleAddonPriceChange(addon.value, Number(e.target.value))}
                                  className="h-7 w-20 text-sm"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                                onClick={() => handleRemoveAddon(addon.value)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          ) : (
                            <span className="text-sm text-primary font-medium">฿{addon.price.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                      <span className="text-sm text-muted-foreground">รวม Add-on</span>
                      <span className="text-sm font-semibold text-primary">฿{totalAddonPrice.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Insurance Section */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-blue-600" />
                <p className="font-medium text-sm">ประกันภัย (Insurance)</p>
              </div>
              
              {bookedInsurance ? (
                // Show booked insurance (read-only)
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-1">
                    <ShieldCheck className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">ซื้อประกันจากการจองแล้ว</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{bookedInsurance.label}</span>
                    <span className="text-sm font-medium text-green-600">฿{bookedInsurance.price.toLocaleString()}</span>
                  </div>
                </div>
              ) : selectedInsurance ? (
                // Show selected insurance with option to remove
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium">{selectedInsurance.label}</span>
                      <p className="text-xs text-muted-foreground">เพิ่มประกันตอนรับรถ</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-600">฿{selectedInsurance.price.toLocaleString()}</span>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                          onClick={handleRemoveInsurance}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                // Show option to add insurance
                <div className="space-y-2">
                  <p className="text-sm text-amber-600 dark:text-amber-400">ยังไม่ได้ซื้อประกัน</p>
                  {isEditing && (
                    <Popover open={insuranceComboboxOpen} onOpenChange={setInsuranceComboboxOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={insuranceComboboxOpen}
                          className="w-full h-8 justify-between text-sm bg-background"
                        >
                          <span className="text-muted-foreground">เลือกประกันภัย...</span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0 bg-background border border-border z-50" align="start">
                        <Command>
                          <CommandInput placeholder="ค้นหาประกัน..." className="h-9" />
                          <CommandList>
                            <CommandEmpty>ไม่พบรายการ</CommandEmpty>
                            <CommandGroup>
                              {INSURANCE_OPTIONS.map(option => (
                                <CommandItem
                                  key={option.value}
                                  value={option.label}
                                  onSelect={() => handleAddInsurance(option.value)}
                                >
                                  <Shield className="mr-2 h-4 w-4 text-blue-500" />
                                  {option.label} (฿{option.price.toLocaleString()})
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  )}
                </div>
              )}
            </div>

            {/* Document Upload Section */}
            <div className="mt-4 pt-4 border-t border-border">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-purple-600" />
                <p className="font-medium text-sm">เอกสารประกอบ</p>
              </div>
              
              <div className="space-y-3">
                {/* International License Upload */}
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm font-medium mb-2">ใบขับขี่สากล (International Driver's License)</p>
                  {documents.internationalLicense ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        {documents.internationalLicense.name}
                      </span>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveDocument('internationalLicense')}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleDocumentUpload('internationalLicense', e.target.files?.[0] || null)}
                        />
                        <Button variant="outline" size="sm" className="w-full h-8 text-xs" asChild>
                          <span>
                            <Upload className="w-3 h-3 mr-1" />
                            อัปโหลดรูป
                          </span>
                        </Button>
                      </label>
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => handleDocumentUpload('internationalLicense', e.target.files?.[0] || null)}
                        />
                        <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                          <span>
                            <Camera className="w-3 h-3 mr-1" />
                            ถ่ายรูป
                          </span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>

                {/* Passport Upload */}
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <p className="text-sm font-medium mb-2">หนังสือเดินทาง (Passport)</p>
                  {documents.passport ? (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-600 flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        {documents.passport.name}
                      </span>
                      {isEditing && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveDocument('passport')}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <label className="flex-1">
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleDocumentUpload('passport', e.target.files?.[0] || null)}
                        />
                        <Button variant="outline" size="sm" className="w-full h-8 text-xs" asChild>
                          <span>
                            <Upload className="w-3 h-3 mr-1" />
                            อัปโหลดรูป
                          </span>
                        </Button>
                      </label>
                      <label>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          onChange={(e) => handleDocumentUpload('passport', e.target.files?.[0] || null)}
                        />
                        <Button variant="outline" size="sm" className="h-8 text-xs" asChild>
                          <span>
                            <Camera className="w-3 h-3 mr-1" />
                            ถ่ายรูป
                          </span>
                        </Button>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Summary */}
            <div className="mt-6 pt-4 border-t-2 border-emerald-300 dark:border-emerald-700">
              <div className="text-sm mb-4">
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                  <p className="text-muted-foreground text-xs mb-1">ยอดคงเหลือ (รวม Add-on + ประกัน)</p>
                  <p className="font-semibold text-lg text-amber-600">฿{(payment.remainingBalance + totalAddonPrice + insurancePrice).toLocaleString()}</p>
                  {insurancePrice > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">รวมประกัน ฿{insurancePrice.toLocaleString()}</p>
                  )}
                </div>
              </div>
              {/* Payment Method Selection */}
              <div className="mb-4">
                <p className="text-muted-foreground text-sm mb-2">ประเภทการชำระเงิน</p>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="เลือกประเภทการชำระเงิน" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border z-50">
                    <SelectItem value="cash">
                      <div className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-green-600" />
                        เงินสด
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        บัตรเครดิต/เดบิต
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Card Payment Record (shown when card is selected) */}
              {paymentMethod === "card" && (
                <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-2 mb-3">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <p className="font-medium text-sm text-blue-700 dark:text-blue-400">บันทึกการชำระเงินด้วยบัตร</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">จำนวนเงิน</p>
                      <Input 
                        type="number"
                        placeholder="0.00" 
                        className="h-8 text-sm"
                      />
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-1">แนบหลักฐาน</p>
                      <Input 
                        type="file"
                        accept="image/*,.pdf"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}


              {/* Save Button */}
              {isEditing && (
                <div className="pt-4 mt-4 border-t border-emerald-200 dark:border-emerald-800">
                  <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={handleSave}>
                    <Save className="w-4 h-4" />
                    บันทึก
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 mt-4">
            <Button
              className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={() => setShowConfirm(true)}
              disabled={bookingStatus !== "confirmed"}
            >
              <LogIn className="w-4 h-4" />
              ยืนยันรับรถ (Pick Up)
            </Button>
            
            {confirmed && (
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={handlePrintReceipt}
              >
                <FileText className="w-4 h-4" />
                พิมพ์เอกสารใบเสร็จ
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการรับรถ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการเปลี่ยนสถานะการจอง <strong>{bookingCode}</strong> เป็น "Picked Up" ใช่หรือไม่?
              <br /><br />
              <span className="text-muted-foreground">ลูกค้า: {customerName}</span>
              <br />
              <span className="text-muted-foreground">รถ: {vehicleName}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700">
              ยืนยันรับรถ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
