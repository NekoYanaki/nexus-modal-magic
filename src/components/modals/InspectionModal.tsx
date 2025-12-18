import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Save, X, Upload, Image, LogIn, LogOut, Plus, Trash2, CreditCard, FileText } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";

type SeverityLevel = 'low' | 'medium' | 'high' | 'critical' | '';
type DamageType = 'new' | 'existing' | '';

// Master list of damage options
const DAMAGE_OPTIONS = [
  { value: 'scratch', label: 'รอยขีดข่วน' },
  { value: 'dent', label: 'รอยบุบ' },
  { value: 'crack', label: 'รอยแตกร้าว' },
  { value: 'broken_mirror', label: 'กระจกแตก/ชำรุด' },
  { value: 'bumper_damage', label: 'กันชนเสียหาย' },
  { value: 'paint_damage', label: 'สีลอก/ถลอก' },
  { value: 'light_damage', label: 'ไฟชำรุด' },
  { value: 'interior_damage', label: 'ภายในเสียหาย' },
  { value: 'tire_damage', label: 'ยางชำรุด' },
  { value: 'mechanical_issue', label: 'ปัญหาเครื่องยนต์' },
  { value: 'other', label: 'อื่นๆ' },
];

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

interface ConditionRecord {
  id: string;
  title: string;
  customTitle: string;
  detail: string;
  image: string | null;
  severityLevel: SeverityLevel;
  damageType: DamageType;
  price: number;
}

interface FinanceRecord {
  label: string;
  type: 'cash' | 'credit_card' | '';
  amount: number;
  proofImage: string | null;
}

interface DamageDeposit {
  date: string;
  amount: number;
  proofImage: string | null;
}

interface InspectionData {
  date: string;
  mileage: string;
  fuelLevel: string;
  conditions: ConditionRecord[];
  notes: string;
  financeRecord: FinanceRecord;
  addons: AddonItem[];
}

interface PaymentDetail {
  deposit: number;
  damageDeposit: number;
  totalAmount: number;
  remainingBalance: number;
  damageDepositRecord: DamageDeposit | null;
}

interface InspectionModalProps {
  open: boolean;
  onClose: () => void;
  bookingCode: string;
  customerName: string;
  vehicleName: string;
  bookingStatus: string;
  onStatusChange: (status: string) => void;
  pickupData?: InspectionData;
  returnData?: InspectionData;
  paymentDetail?: PaymentDetail;
  onSave?: (pickup: InspectionData, returnData: InspectionData, payment: PaymentDetail) => void;
}

const defaultPayment: PaymentDetail = {
  deposit: 5000,
  damageDeposit: 3000,
  totalAmount: 12000,
  remainingBalance: 7000,
  damageDepositRecord: null,
};

const defaultFinanceRecord: FinanceRecord = {
  label: '',
  type: '',
  amount: 0,
  proofImage: null,
};

const defaultPickup: InspectionData = {
  date: "15 Mar 2024, 09:00",
  mileage: "45,230",
  fuelLevel: "full",
  conditions: [],
  notes: "",
  financeRecord: { ...defaultFinanceRecord },
  addons: [],
};

const defaultReturn: InspectionData = {
  date: "19 Mar 2024, 17:00",
  mileage: "45,890",
  fuelLevel: "3/4",
  conditions: [],
  notes: "",
  financeRecord: { ...defaultFinanceRecord },
  addons: [],
};

export const InspectionModal = ({
  open,
  onClose,
  bookingCode,
  customerName,
  vehicleName,
  bookingStatus,
  onStatusChange,
  pickupData = defaultPickup,
  returnData = defaultReturn,
  paymentDetail = defaultPayment,
  onSave,
}: InspectionModalProps) => {
  const [isEditingPickup, setIsEditingPickup] = useState(false);
  const [isEditingReturn, setIsEditingReturn] = useState(false);
  const [pickup, setPickup] = useState<InspectionData>(pickupData);
  const [returnInspection, setReturnInspection] = useState<InspectionData>(returnData);
  const [payment, setPayment] = useState<PaymentDetail>(paymentDetail);
  const [showPickupConfirm, setShowPickupConfirm] = useState(false);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);
  const [pickupConfirmed, setPickupConfirmed] = useState(bookingStatus === "picked_up" || bookingStatus === "returned");
  const [returnConfirmed, setReturnConfirmed] = useState(bookingStatus === "returned");

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddCondition = (type: 'pickup' | 'return') => {
    const newCondition: ConditionRecord = {
      id: generateId(),
      title: "",
      customTitle: "",
      detail: "",
      image: null,
      severityLevel: '',
      damageType: '',
      price: 0,
    };
    
    if (type === 'pickup') {
      setPickup(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition]
      }));
    } else {
      setReturnInspection(prev => ({
        ...prev,
        conditions: [...prev.conditions, newCondition]
      }));
    }
  };

  const handleRemoveCondition = (type: 'pickup' | 'return', id: string) => {
    if (type === 'pickup') {
      setPickup(prev => ({
        ...prev,
        conditions: prev.conditions.filter(c => c.id !== id)
      }));
    } else {
      setReturnInspection(prev => ({
        ...prev,
        conditions: prev.conditions.filter(c => c.id !== id)
      }));
    }
  };

  const handleConditionChange = (
    type: 'pickup' | 'return',
    id: string,
    field: keyof ConditionRecord,
    value: string | null
  ) => {
    const updateConditions = (conditions: ConditionRecord[]) =>
      conditions.map(c => c.id === id ? { ...c, [field]: value } : c);

    if (type === 'pickup') {
      setPickup(prev => ({
        ...prev,
        conditions: updateConditions(prev.conditions)
      }));
    } else {
      setReturnInspection(prev => ({
        ...prev,
        conditions: updateConditions(prev.conditions)
      }));
    }
  };

  const handleConditionImageUpload = (
    type: 'pickup' | 'return',
    id: string,
    file: File
  ) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleConditionChange(type, id, 'image', result);
    };
    reader.readAsDataURL(file);
    toast.success("อัปโหลดรูปสำเร็จ");
  };

  // Addon handlers
  const handleAddAddon = (addonValue: string) => {
    const masterAddon = ADDON_OPTIONS.find(a => a.value === addonValue);
    if (!masterAddon) return;
    
    // Check if already added
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

  // Calculate total addon price
  const totalAddonPrice = pickup.addons.reduce((sum, addon) => sum + addon.price, 0);

  // Calculate total collected payments
  const calculateTotalCollected = () => {
    return pickup.financeRecord.amount + returnInspection.financeRecord.amount;
  };

  const totalCollected = calculateTotalCollected();
  const pendingAmount = payment.remainingBalance + totalAddonPrice - totalCollected;

  // Calculate total damage amount from all conditions
  const totalDamageAmount = [...pickup.conditions, ...returnInspection.conditions].reduce(
    (sum, condition) => sum + (condition.price || 0),
    0
  );

  // Finance record handlers
  const handleFinanceRecordChange = (
    type: 'pickup' | 'return',
    field: keyof FinanceRecord,
    value: string | number | null
  ) => {
    if (type === 'pickup') {
      setPickup(prev => ({
        ...prev,
        financeRecord: { ...prev.financeRecord, [field]: value }
      }));
    } else {
      setReturnInspection(prev => ({
        ...prev,
        financeRecord: { ...prev.financeRecord, [field]: value }
      }));
    }
  };

  const handleFinanceProofUpload = (type: 'pickup' | 'return', file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleFinanceRecordChange(type, 'proofImage', result);
    };
    reader.readAsDataURL(file);
    toast.success("อัปโหลดหลักฐานการชำระเงินสำเร็จ");
  };

  const handleSavePickup = () => {
    setIsEditingPickup(false);
    onSave?.(pickup, returnInspection, payment);
    toast.success("บันทึกข้อมูลรับรถสำเร็จ");
  };

  const handleSaveReturn = () => {
    setIsEditingReturn(false);
    onSave?.(pickup, returnInspection, payment);
    toast.success("บันทึกข้อมูลคืนรถสำเร็จ");
  };

  const handleCancelPickup = () => {
    setIsEditingPickup(false);
    setPickup(pickupData);
    setPayment(paymentDetail);
  };

  const handleCancelReturn = () => {
    setIsEditingReturn(false);
    setReturnInspection(returnData);
  };

  // Damage Deposit handlers
  const handleCreateDamageDeposit = () => {
    if (payment.damageDepositRecord) {
      toast.error("สร้างยอดมัดจำความเสียหายได้เพียงครั้งเดียว");
      return;
    }
    setPayment(prev => ({
      ...prev,
      damageDepositRecord: {
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        proofImage: null,
      }
    }));
  };

  const handleDamageDepositChange = (field: keyof DamageDeposit, value: string | number | null) => {
    setPayment(prev => ({
      ...prev,
      damageDepositRecord: prev.damageDepositRecord
        ? { ...prev.damageDepositRecord, [field]: value }
        : null
    }));
  };

  const handleDamageDepositProofUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleDamageDepositChange('proofImage', result);
    };
    reader.readAsDataURL(file);
    toast.success("อัปโหลดหลักฐานสำเร็จ");
  };

  const handlePrintDamageDepositReceipt = () => {
    if (!payment.damageDepositRecord) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(18);
    doc.text("ใบเสร็จยอดมัดจำความเสียหาย", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`รหัสการจอง: ${bookingCode}`, 20, 40);
    doc.text(`ลูกค้า: ${customerName}`, 20, 50);
    doc.text(`รถ: ${vehicleName}`, 20, 60);
    
    doc.line(20, 70, 190, 70);
    
    doc.text(`วันที่ทำรายการ: ${payment.damageDepositRecord.date}`, 20, 85);
    doc.text(`จำนวนเงินมัดจำความเสียหาย: ${payment.damageDepositRecord.amount.toLocaleString()} บาท`, 20, 95);
    
    doc.line(20, 110, 190, 110);
    
    doc.setFontSize(10);
    doc.text("เอกสารนี้ออกโดยระบบอัตโนมัติ", 105, 130, { align: "center" });

    doc.save(`damage-deposit-receipt-${bookingCode}.pdf`);
    toast.success("ดาวน์โหลดใบเสร็จสำเร็จ");
  };

  const handlePickupConfirm = () => {
    onStatusChange("picked_up");
    setShowPickupConfirm(false);
    setPickupConfirmed(true);
    toast.success("อัปเดตสถานะเป็น Picked Up สำเร็จ");
  };

  const handleReturnConfirm = () => {
    onStatusChange("returned");
    setShowReturnConfirm(false);
    setReturnConfirmed(true);
    toast.success("อัปเดตสถานะเป็น Returned สำเร็จ");
  };

  const renderInspectionSection = (
    title: string,
    data: InspectionData,
    setData: React.Dispatch<React.SetStateAction<InspectionData>>,
    type: 'pickup' | 'return',
    isEditing: boolean
  ) => (
    <div className="space-y-3">
      <h5 className="font-medium text-sm border-b border-border pb-2">{title}</h5>
      <div className="text-sm space-y-2">
        <div>
          <p className="text-muted-foreground mb-1">วันที่{type === 'pickup' ? 'รับรถ' : 'คืนรถ'}</p>
          {isEditing ? (
            <Input
              value={data.date}
              onChange={(e) => setData(prev => ({ ...prev, date: e.target.value }))}
              className="h-8"
            />
          ) : (
            <p className="font-medium">{data.date}</p>
          )}
        </div>
        <div>
          <p className="text-muted-foreground mb-1">เลขไมล์</p>
          {isEditing ? (
            <Input
              value={data.mileage}
              onChange={(e) => setData(prev => ({ ...prev, mileage: e.target.value }))}
              className="h-8"
              placeholder="km"
            />
          ) : (
            <p className="font-medium">{data.mileage} km</p>
          )}
        </div>
      </div>

      {/* Vehicle Condition Records - Only for Return */}
      {type === 'return' && (
        <div className="pt-3 border-t border-border mt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">สภาพรถ ({data.conditions.length} รายการ)</p>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs gap-1"
                onClick={() => handleAddCondition(type)}
              >
                <Plus className="w-3 h-3" />
                เพิ่มรายการ
              </Button>
            )}
          </div>
          {data.conditions.length > 0 ? (
            <div className="space-y-3">
              {data.conditions.map((condition, index) => (
                <div key={condition.id} className="border border-border rounded-lg p-3 bg-muted/20">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs text-muted-foreground font-medium">รายการ #{index + 1}</span>
                    {isEditing && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleRemoveCondition(type, condition.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">รายละเอียด</p>
                      {isEditing ? (
                        <Textarea
                          value={condition.detail}
                          onChange={(e) => handleConditionChange(type, condition.id, 'detail', e.target.value)}
                          className="min-h-[50px] text-sm"
                          placeholder="รายละเอียดสภาพ..."
                        />
                      ) : (
                        <p className="text-sm">{condition.detail || "-"}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">รูปประกอบ</p>
                      {condition.image ? (
                        <div className="relative w-20 h-20">
                          <img
                            src={condition.image}
                            alt={condition.title}
                            className="w-full h-full object-cover rounded-lg border border-border"
                          />
                          {isEditing && (
                            <button
                              onClick={() => handleConditionChange(type, condition.id, 'image', null)}
                              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : isEditing ? (
                        <label className="flex items-center justify-center w-20 h-20 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleConditionImageUpload(type, condition.id, file);
                            }}
                          />
                          <Upload className="w-5 h-5 text-muted-foreground" />
                        </label>
                      ) : (
                        <div className="w-20 h-20 border border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30">
                          <Image className="w-5 h-5 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">ไม่มีรายการสภาพรถ</p>
          )}
        </div>
      )}

      {/* Add-on & Accessories - Only for Pickup */}
      {type === 'pickup' && (
        <div className="pt-3 border-t border-border mt-3">
          <div className="flex items-center justify-between mb-2">
            <p className="text-muted-foreground text-sm">Add-on & Accessories ({data.addons.length} รายการ)</p>
          </div>
          
          {/* Dropdown to add addon */}
          {isEditing && (
            <div className="mb-3">
              <Select onValueChange={handleAddAddon}>
                <SelectTrigger className="h-8 text-sm bg-background">
                  <SelectValue placeholder="เลือก Add-on & Accessories" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border z-50">
                  {ADDON_OPTIONS.filter(opt => !data.addons.some(a => a.value === opt.value)).map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label} (฿{option.price.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Selected addons list */}
          {data.addons.length > 0 ? (
            <div className="space-y-2">
              {data.addons.map((addon) => (
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
              {/* Total addon price */}
              <div className="flex items-center justify-between pt-2 border-t border-border mt-2">
                <span className="text-sm text-muted-foreground">รวม Add-on</span>
                <span className="text-sm font-semibold text-primary">฿{totalAddonPrice.toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">ไม่มีรายการ Add-on & Accessories</p>
          )}
        </div>
      )}

    </div>
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                Inspection รับรถ - คืนรถ
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-6 mt-4">
            {/* Left Card - รับรถ (Pick Up) */}
            <Card className="p-4 bg-gradient-to-br from-emerald-50/50 to-emerald-100/30 dark:from-emerald-950/20 dark:to-emerald-900/10 border-emerald-200 dark:border-emerald-800">
              {/* Edit Button for Pickup */}
              <div className="flex justify-end mb-2">
                {isEditingPickup ? (
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleCancelPickup}>
                    <X className="w-3 h-3 mr-1" />
                    ยกเลิก
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsEditingPickup(true)}>
                    <Pencil className="w-3 h-3 mr-1" />
                    แก้ไข
                  </Button>
                )}
              </div>
              
              {/* Inspection Section */}
              {renderInspectionSection("รับรถ (Pick Up)", pickup, setPickup, 'pickup', isEditingPickup)}
              
              {/* Payment Section - Separator */}
              <div className="mt-6 pt-4 border-t-2 border-emerald-300 dark:border-emerald-700">
                
                {/* Payment Summary */}
                <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                  <div className="bg-background/70 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">ยอดมัดจำ</p>
                    <p className="font-semibold text-lg text-primary">฿{payment.deposit.toLocaleString()}</p>
                  </div>
                  <div className="bg-background/70 rounded-lg p-3">
                    <p className="text-muted-foreground text-xs mb-1">ยอดรวมทั้งหมด</p>
                    <p className="font-semibold text-lg">฿{payment.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-emerald-100 dark:bg-emerald-950/50 rounded-lg p-3 border border-emerald-300 dark:border-emerald-700">
                    <p className="text-emerald-700 dark:text-emerald-400 text-xs mb-1">รับเงินแล้ว</p>
                    <p className="font-semibold text-lg text-emerald-600">฿{totalCollected.toLocaleString()}</p>
                  </div>
                  <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                    <p className="text-muted-foreground text-xs mb-1">ยอดคงเหลือ (รวม Add-on)</p>
                    <p className="font-semibold text-lg text-amber-600">฿{(payment.remainingBalance + totalAddonPrice).toLocaleString()}</p>
                  </div>
                </div>

                {/* Finance Record - Pickup */}
                <div className="pt-4 border-t border-emerald-200 dark:border-emerald-800">
                  <h6 className="font-medium text-sm mb-3">บันทึกการเงิน</h6>
                  <div className="border border-border rounded-lg p-3 bg-background/50 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">หัวข้อรายการ</p>
                      {isEditingPickup ? (
                        <Input
                          value={pickup.financeRecord.label}
                          onChange={(e) => handleFinanceRecordChange('pickup', 'label', e.target.value)}
                          className="h-8 text-sm"
                          placeholder="เช่น ชำระค่าเช่าคงเหลือ, ค่าน้ำมัน"
                        />
                      ) : (
                        <p className="font-medium text-sm">{pickup.financeRecord.label || "-"}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">จำนวนเงิน</p>
                      {isEditingPickup ? (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-sm">฿</span>
                          <Input
                            type="number"
                            value={pickup.financeRecord.amount}
                            onChange={(e) => handleFinanceRecordChange('pickup', 'amount', Number(e.target.value))}
                            className="h-8 text-sm"
                            placeholder="0"
                          />
                        </div>
                      ) : (
                        <p className="font-medium text-sm text-primary">฿{pickup.financeRecord.amount.toLocaleString()}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">หลักฐานการชำระเงิน</p>
                      {pickup.financeRecord.proofImage ? (
                        <div className="relative w-16 h-16">
                          <img
                            src={pickup.financeRecord.proofImage}
                            alt="หลักฐานการชำระเงิน"
                            className="w-full h-full object-cover rounded-lg border border-border"
                          />
                          {isEditingPickup && (
                            <button
                              onClick={() => handleFinanceRecordChange('pickup', 'proofImage', null)}
                              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : isEditingPickup ? (
                        <label className="flex items-center justify-center w-16 h-16 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFinanceProofUpload('pickup', file);
                            }}
                          />
                          <Upload className="w-4 h-4 text-muted-foreground" />
                        </label>
                      ) : (
                        <div className="w-16 h-16 border border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30">
                          <Image className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save Button for Pickup */}
                {isEditingPickup && (
                  <div className="pt-4 mt-4 border-t border-emerald-200 dark:border-emerald-800">
                    <Button className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700" onClick={handleSavePickup}>
                      <Save className="w-4 h-4" />
                      บันทึก
                    </Button>
                  </div>
                )}
              </div>
            </Card>

            {/* Right Card - คืนรถ (Return) */}
            <Card className="p-4 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
              {/* Edit Button for Return */}
              <div className="flex justify-end mb-2">
                {isEditingReturn ? (
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleCancelReturn}>
                    <X className="w-3 h-3 mr-1" />
                    ยกเลิก
                  </Button>
                ) : (
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsEditingReturn(true)}>
                    <Pencil className="w-3 h-3 mr-1" />
                    แก้ไข
                  </Button>
                )}
              </div>
              
              {/* Inspection Section */}
              {renderInspectionSection("คืนรถ (Return)", returnInspection, setReturnInspection, 'return', isEditingReturn)}
              
              {/* Payment Section - Separator */}
              <div className="mt-6 pt-4 border-t-2 border-blue-300 dark:border-blue-700">
                

                {/* Finance Record - Return */}
                <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
                  <h6 className="font-medium text-sm mb-3">บันทึกการเงิน</h6>
                  <div className="border border-border rounded-lg p-3 bg-background/50 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">หัวข้อรายการ</p>
                      {isEditingReturn ? (
                        <Input
                          value={returnInspection.financeRecord.label}
                          onChange={(e) => handleFinanceRecordChange('return', 'label', e.target.value)}
                          className="h-8 text-sm"
                          placeholder="เช่น ชำระค่าเช่าคงเหลือ, ค่าน้ำมัน"
                        />
                      ) : (
                        <p className="font-medium text-sm">{returnInspection.financeRecord.label || "-"}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">จำนวนเงิน</p>
                      {isEditingReturn ? (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-sm">฿</span>
                          <Input
                            type="number"
                            value={returnInspection.financeRecord.amount}
                            onChange={(e) => handleFinanceRecordChange('return', 'amount', Number(e.target.value))}
                            className="h-8 text-sm"
                            placeholder="0"
                          />
                        </div>
                      ) : (
                        <p className="font-medium text-sm text-primary">฿{returnInspection.financeRecord.amount.toLocaleString()}</p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">หลักฐานการชำระเงิน</p>
                      {returnInspection.financeRecord.proofImage ? (
                        <div className="relative w-16 h-16">
                          <img
                            src={returnInspection.financeRecord.proofImage}
                            alt="หลักฐานการชำระเงิน"
                            className="w-full h-full object-cover rounded-lg border border-border"
                          />
                          {isEditingReturn && (
                            <button
                              onClick={() => handleFinanceRecordChange('return', 'proofImage', null)}
                              className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ) : isEditingReturn ? (
                        <label className="flex items-center justify-center w-16 h-16 border border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFinanceProofUpload('return', file);
                            }}
                          />
                          <Upload className="w-4 h-4 text-muted-foreground" />
                        </label>
                      ) : (
                        <div className="w-16 h-16 border border-dashed border-border rounded-lg flex items-center justify-center bg-muted/30">
                          <Image className="w-4 h-4 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Save Button for Return */}
                {isEditingReturn && (
                  <div className="pt-4 mt-4 border-t border-blue-200 dark:border-blue-800">
                    <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleSaveReturn}>
                      <Save className="w-4 h-4" />
                      บันทึก
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Action Buttons Section - Bottom */}
          <div className="grid grid-cols-2 gap-6 mt-6">
            <div className="space-y-3">
              <Button
                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={() => setShowPickupConfirm(true)}
                disabled={bookingStatus !== "confirmed"}
              >
                <LogIn className="w-4 h-4" />
                ยืนยันรับรถ (Pick Up)
              </Button>
              
              {pickupConfirmed && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handlePrintDamageDepositReceipt}
                >
                  <FileText className="w-4 h-4" />
                  พิมพ์เอกสารใบเสร็จ
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <Button
                className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => setShowReturnConfirm(true)}
                disabled={bookingStatus !== "picked_up"}
              >
                <LogOut className="w-4 h-4" />
                ยืนยันคืนรถ (Return)
              </Button>
              
              {returnConfirmed && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handlePrintDamageDepositReceipt}
                >
                  <FileText className="w-4 h-4" />
                  พิมพ์เอกสารใบเสร็จ
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pick Up Confirmation Dialog */}
      <AlertDialog open={showPickupConfirm} onOpenChange={setShowPickupConfirm}>
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
            <AlertDialogAction onClick={handlePickupConfirm} className="bg-emerald-600 hover:bg-emerald-700">
              ยืนยันรับรถ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Return Confirmation Dialog */}
      <AlertDialog open={showReturnConfirm} onOpenChange={setShowReturnConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ยืนยันการคืนรถ</AlertDialogTitle>
            <AlertDialogDescription>
              คุณต้องการเปลี่ยนสถานะการจอง <strong>{bookingCode}</strong> เป็น "Returned" ใช่หรือไม่?
              <br /><br />
              <span className="text-muted-foreground">ลูกค้า: {customerName}</span>
              <br />
              <span className="text-muted-foreground">รถ: {vehicleName}</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
            <AlertDialogAction onClick={handleReturnConfirm} className="bg-blue-600 hover:bg-blue-700">
              ยืนยันคืนรถ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
