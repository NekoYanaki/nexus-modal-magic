import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select as UISelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Save, X, Upload, Image, LogOut, Plus, Trash2, FileText, CreditCard, Banknote, Car, Package, Receipt, CheckSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import jsPDF from "jspdf";
import { useAddons } from "@/contexts/AddonContext";

interface ConditionRecord {
  id: string;
  detail: string;
  image: string | null;
}

interface PickupAddonItem {
  value: string;
  label: string;
  price: number;
  addonId?: string;
}

interface ReturnInspectionData {
  date: string;
  mileage: string;
  fuelLevel: string;
  conditions: ConditionRecord[];
  notes: string;
  totalDamageCost: string;
}

interface BookedVehicleInfo {
  id: string;
  name: string;
  year: string;
  licensePlate: string;
  type: string;
  techInfo: string;
  pricePerDay: number;
  seats: number;
  doors: number;
  image?: string;
}

interface ReturnInspectionModalProps {
  open: boolean;
  onClose: () => void;
  bookingCode: string;
  customerName: string;
  vehicleName: string;
  bookingStatus: string;
  onStatusChange: (status: string) => void;
  returnData?: ReturnInspectionData;
  bookedVehicle?: BookedVehicleInfo | null;
  pickupAddons?: PickupAddonItem[];
  onSave?: (returnData: ReturnInspectionData) => void;
}

const defaultReturn: ReturnInspectionData = {
  date: "19 Mar 2024, 17:00",
  mileage: "45,890",
  fuelLevel: "3/4",
  conditions: [],
  notes: "",
  totalDamageCost: "",
};

export const ReturnInspectionModal = ({
  open,
  onClose,
  bookingCode,
  customerName,
  vehicleName,
  bookingStatus,
  onStatusChange,
  returnData = defaultReturn,
  bookedVehicle = null,
  pickupAddons = [],
  onSave,
}: ReturnInspectionModalProps) => {
  const { addonTypes } = useAddons();
  const [isEditing, setIsEditing] = useState(false);
  const [returnInspection, setReturnInspection] = useState<ReturnInspectionData>(returnData);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmed, setConfirmed] = useState(bookingStatus === "returned");
  const [paymentMethod, setPaymentMethod] = useState<string>("cash");
  const [checkedAddons, setCheckedAddons] = useState<Record<string, boolean>>({});

  // Filter pickup addons to only equipment types (not consumable)
  const equipmentCategoryNames = useMemo(() => {
    return new Set(addonTypes.filter(t => t.kind === "equipment").map(t => t.name));
  }, [addonTypes]);

  const equipmentAddons = useMemo(() => {
    return pickupAddons.filter(a => equipmentCategoryNames.has(a.label));
  }, [pickupAddons, equipmentCategoryNames]);

  const checkedCount = equipmentAddons.filter(a => checkedAddons[a.value]).length;

  const handleToggleAddon = (addonValue: string) => {
    setCheckedAddons(prev => ({ ...prev, [addonValue]: !prev[addonValue] }));
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddCondition = () => {
    const newCondition: ConditionRecord = {
      id: generateId(),
      detail: "",
      image: null,
    };
    
    setReturnInspection(prev => ({
      ...prev,
      conditions: [...prev.conditions, newCondition]
    }));
  };

  const handleRemoveCondition = (id: string) => {
    setReturnInspection(prev => ({
      ...prev,
      conditions: prev.conditions.filter(c => c.id !== id)
    }));
  };

  const handleConditionChange = (id: string, field: keyof ConditionRecord, value: string | null) => {
    setReturnInspection(prev => ({
      ...prev,
      conditions: prev.conditions.map(c => c.id === id ? { ...c, [field]: value } : c)
    }));
  };

  const handleConditionImageUpload = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handleConditionChange(id, 'image', result);
    };
    reader.readAsDataURL(file);
    toast.success("อัปโหลดรูปสำเร็จ");
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(returnInspection);
    toast.success("บันทึกข้อมูลคืนรถสำเร็จ");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setReturnInspection(returnData);
  };

  const handlePrintReceipt = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text("ใบเสร็จการคืนรถ", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`รหัสการจอง: ${bookingCode}`, 20, 40);
    doc.text(`ลูกค้า: ${customerName}`, 20, 50);
    doc.text(`รถ: ${vehicleName}`, 20, 60);
    
    doc.line(20, 70, 190, 70);
    
    doc.text(`วันที่คืนรถ: ${returnInspection.date}`, 20, 85);
    doc.text(`เลขไมล์: ${returnInspection.mileage} km`, 20, 95);
    doc.text(`สภาพรถ: ${returnInspection.conditions.length} รายการ`, 20, 105);
    
    doc.line(20, 120, 190, 120);
    
    doc.setFontSize(10);
    doc.text("เอกสารนี้ออกโดยระบบอัตโนมัติ", 105, 140, { align: "center" });

    doc.save(`return-receipt-${bookingCode}.pdf`);
    toast.success("ดาวน์โหลดใบเสร็จสำเร็จ");
  };

  const handleConfirm = () => {
    onStatusChange("returned");
    setShowConfirm(false);
    setConfirmed(true);
    toast.success("อัปเดตสถานะเป็น Returned สำเร็จ");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="w-5 h-5 text-blue-600" />
              คืนรถ (Return)
            </DialogTitle>
          </DialogHeader>

          {/* Vehicle Info (Read-only) */}
          <Card className="p-4 border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-950/10">
            <h5 className="font-medium text-sm flex items-center gap-2 mb-3">
              <Car className="w-4 h-4 text-blue-600" />
              รถที่ปล่อยให้ลูกค้า
            </h5>
            <div className="flex gap-4">
              <div className="w-28 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden flex-shrink-0 border border-border">
                {bookedVehicle?.image ? (
                  <img src={bookedVehicle.image} alt={bookedVehicle.name} className="w-full h-full object-cover" />
                ) : (
                  <Car className="w-8 h-8 text-muted-foreground/40" />
                )}
              </div>
              <div className="flex-1 text-sm space-y-1.5">
                <p className="font-semibold text-base">{bookedVehicle ? bookedVehicle.name : vehicleName}</p>
                {bookedVehicle ? (
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs">
                    <div><span className="text-muted-foreground">ประเภท:</span> <span className="font-medium">{bookedVehicle.type}</span></div>
                    <div><span className="text-muted-foreground">ปีรุ่น:</span> <span className="font-medium">{bookedVehicle.year}</span></div>
                    <div><span className="text-muted-foreground">ทะเบียน:</span> <span className="font-medium">{bookedVehicle.licensePlate}</span></div>
                    <div><span className="text-muted-foreground">ที่นั่ง/ประตู:</span> <span className="font-medium">{bookedVehicle.seats} ที่นั่ง / {bookedVehicle.doors} ประตู</span></div>
                    <div className="col-span-2"><span className="text-muted-foreground">ข้อมูลเทคนิค:</span> <span className="font-medium">{bookedVehicle.techInfo}</span></div>
                    <div><span className="text-muted-foreground">ราคา/วัน:</span> <span className="font-medium text-blue-600">฿{bookedVehicle.pricePerDay.toLocaleString()}</span></div>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">ยังไม่มีข้อมูลรถจากการจอง</p>
                )}
              </div>
            </div>
          </Card>

          {/* Equipment Add-on Checklist */}
          {equipmentAddons.length > 0 && (
            <Card className="p-4 border-border">
              <h5 className="font-medium text-sm flex items-center gap-2 mb-3">
                <CheckSquare className="w-4 h-4 text-primary" />
                ตรวจสอบอุปกรณ์ก่อนคืน ({checkedCount}/{equipmentAddons.length})
              </h5>
              {checkedCount === equipmentAddons.length && (
                <div className="mb-3 p-2 rounded-lg bg-success/10 border border-success/30">
                  <p className="text-xs text-success font-medium text-center">✓ ตรวจสอบอุปกรณ์ครบทุกรายการแล้ว</p>
                </div>
              )}
              <div className="space-y-2">
                {equipmentAddons.map((addon) => (
                  <label
                    key={addon.value}
                    className={`flex items-center justify-between gap-3 border rounded-lg p-2.5 cursor-pointer transition-colors ${
                      checkedAddons[addon.value]
                        ? "border-success/40 bg-success/5"
                        : "border-border bg-background/50"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <Checkbox
                        checked={!!checkedAddons[addon.value]}
                        onCheckedChange={() => handleToggleAddon(addon.value)}
                      />
                      <div className="flex items-center gap-2 min-w-0">
                        {addon.addonId && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono shrink-0">{addon.addonId}</Badge>
                        )}
                        <span className={`text-sm font-medium ${checkedAddons[addon.value] ? "line-through text-muted-foreground" : ""}`}>
                          {addon.label}
                        </span>
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground shrink-0">฿{addon.price.toLocaleString()}</span>
                  </label>
                ))}
              </div>
            </Card>
          )}

          {/* Non-equipment Add-ons (consumables - read-only summary) */}
          {pickupAddons.filter(a => !equipmentCategoryNames.has(a.label)).length > 0 && (
            <Card className="p-4 border-border">
              <h5 className="font-medium text-sm flex items-center gap-2 mb-3">
                <Package className="w-4 h-4 text-muted-foreground" />
                วัสดุสิ้นเปลือง ({pickupAddons.filter(a => !equipmentCategoryNames.has(a.label)).length} รายการ)
              </h5>
              <div className="space-y-2">
                {pickupAddons.filter(a => !equipmentCategoryNames.has(a.label)).map((addon) => (
                  <div key={addon.value} className="flex items-center justify-between gap-2 border border-border rounded-lg p-2 bg-muted/30">
                    <div className="flex items-center gap-2 min-w-0">
                      {addon.addonId && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono shrink-0">{addon.addonId}</Badge>
                      )}
                      <span className="text-sm font-medium text-muted-foreground">{addon.label}</span>
                    </div>
                    <span className="text-sm text-muted-foreground shrink-0">฿{addon.price.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Card className="p-4 bg-gradient-to-br from-blue-50/50 to-blue-100/30 dark:from-blue-950/20 dark:to-blue-900/10 border-blue-200 dark:border-blue-800">
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
              <h5 className="font-medium text-sm border-b border-border pb-2">คืนรถ (Return)</h5>
              <div className="text-sm space-y-2">
                <div>
                  <p className="text-muted-foreground mb-1">วันที่คืนรถ</p>
                  {isEditing ? (
                    <Input
                      value={returnInspection.date}
                      onChange={(e) => setReturnInspection(prev => ({ ...prev, date: e.target.value }))}
                      className="h-8"
                    />
                  ) : (
                    <p className="font-medium">{returnInspection.date}</p>
                  )}
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">เลขไมล์</p>
                  {isEditing ? (
                    <Input
                      value={returnInspection.mileage}
                      onChange={(e) => setReturnInspection(prev => ({ ...prev, mileage: e.target.value }))}
                      className="h-8"
                      placeholder="km"
                    />
                  ) : (
                    <p className="font-medium">{returnInspection.mileage} km</p>
                  )}
                </div>
              </div>

              {/* Vehicle Condition Records */}
              <div className="pt-3 border-t border-border mt-3">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-muted-foreground text-sm">สภาพรถ ({returnInspection.conditions.length} รายการ)</p>
                  {isEditing && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 text-xs gap-1"
                      onClick={handleAddCondition}
                    >
                      <Plus className="w-3 h-3" />
                      เพิ่มรายการ
                    </Button>
                  )}
                </div>
                {returnInspection.conditions.length > 0 ? (
                  <div className="space-y-3">
                    {returnInspection.conditions.map((condition, index) => (
                      <div key={condition.id} className="border border-border rounded-lg p-3 bg-muted/20">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className="text-xs text-muted-foreground font-medium">รายการ #{index + 1}</span>
                          {isEditing && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                              onClick={() => handleRemoveCondition(condition.id)}
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
                                onChange={(e) => handleConditionChange(condition.id, 'detail', e.target.value)}
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
                                  alt="Condition"
                                  className="w-full h-full object-cover rounded-lg border border-border"
                                />
                                {isEditing && (
                                  <button
                                    onClick={() => handleConditionChange(condition.id, 'image', null)}
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
                                    if (file) handleConditionImageUpload(condition.id, file);
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
                    
                    {/* Total Damage Cost */}
                    <div className="mt-4 p-3 rounded-lg bg-destructive/10 border border-destructive/30">
                      <p className="text-sm font-medium text-destructive mb-2">ยอดความเสียหายทั้งหมด</p>
                      {isEditing ? (
                        <Input
                          type="number"
                          value={returnInspection.totalDamageCost}
                          onChange={(e) => setReturnInspection(prev => ({ ...prev, totalDamageCost: e.target.value }))}
                          className="h-8"
                          placeholder="0.00"
                        />
                      ) : (
                        <p className="font-medium text-destructive">
                          {returnInspection.totalDamageCost ? `฿${Number(returnInspection.totalDamageCost).toLocaleString()}` : "-"}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">ไม่มีรายการสภาพรถ</p>
                )}
              </div>
            </div>
            
            {/* Payment Method Section */}
            <div className="mt-6 pt-4 border-t-2 border-blue-300 dark:border-blue-700">
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
                      <p className="text-muted-foreground text-xs mb-1">ประเภท</p>
                      <Select defaultValue="pay">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="refund">คืนเงิน</SelectItem>
                          <SelectItem value="pay">จ่ายเพิ่ม</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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
                <Button className="w-full gap-2 bg-blue-600 hover:bg-blue-700" onClick={handleSave}>
                  <Save className="w-4 h-4" />
                  บันทึก
                </Button>
              )}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3 mt-4">
            <Button
              className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setShowConfirm(true)}
              disabled={bookingStatus !== "picked_up"}
            >
              <LogOut className="w-4 h-4" />
              ยืนยันคืนรถ (Return)
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
            <AlertDialogAction onClick={handleConfirm} className="bg-blue-600 hover:bg-blue-700">
              ยืนยันคืนรถ
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </>
  );
};
