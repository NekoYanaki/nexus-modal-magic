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

interface ConditionRecord {
  id: string;
  title: string;
  detail: string;
  image: string | null;
  severityLevel: SeverityLevel;
  damageType: DamageType;
}

interface PaymentRecord {
  id: string;
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
  paymentRecords: PaymentRecord[];
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

const defaultPickup: InspectionData = {
  date: "15 Mar 2024, 09:00",
  mileage: "45,230",
  fuelLevel: "full",
  conditions: [],
  notes: "",
  paymentRecords: [],
};

const defaultReturn: InspectionData = {
  date: "19 Mar 2024, 17:00",
  mileage: "45,890",
  fuelLevel: "3/4",
  conditions: [],
  notes: "",
  paymentRecords: [],
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
  const [isEditing, setIsEditing] = useState(false);
  const [pickup, setPickup] = useState<InspectionData>(pickupData);
  const [returnInspection, setReturnInspection] = useState<InspectionData>(returnData);
  const [payment, setPayment] = useState<PaymentDetail>(paymentDetail);
  const [showPickupConfirm, setShowPickupConfirm] = useState(false);
  const [showReturnConfirm, setShowReturnConfirm] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleAddCondition = (type: 'pickup' | 'return') => {
    const newCondition: ConditionRecord = {
      id: generateId(),
      title: "",
      detail: "",
      image: null,
      severityLevel: '',
      damageType: '',
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

  // Calculate total collected payments
  const calculateTotalCollected = () => {
    const pickupTotal = pickup.paymentRecords.reduce((sum, r) => sum + r.amount, 0);
    const returnTotal = returnInspection.paymentRecords.reduce((sum, r) => sum + r.amount, 0);
    return pickupTotal + returnTotal;
  };

  const totalCollected = calculateTotalCollected();
  const pendingAmount = payment.remainingBalance - totalCollected;

  // Payment record handlers
  const handleAddPaymentRecord = (type: 'pickup' | 'return') => {
    const newRecord: PaymentRecord = {
      id: generateId(),
      label: '',
      type: '',
      amount: 0,
      proofImage: null,
    };
    if (type === 'pickup') {
      setPickup(prev => ({
        ...prev,
        paymentRecords: [...prev.paymentRecords, newRecord]
      }));
    } else {
      setReturnInspection(prev => ({
        ...prev,
        paymentRecords: [...prev.paymentRecords, newRecord]
      }));
    }
  };

  const handleRemovePaymentRecord = (type: 'pickup' | 'return', id: string) => {
    if (type === 'pickup') {
      setPickup(prev => ({
        ...prev,
        paymentRecords: prev.paymentRecords.filter(r => r.id !== id)
      }));
    } else {
      setReturnInspection(prev => ({
        ...prev,
        paymentRecords: prev.paymentRecords.filter(r => r.id !== id)
      }));
    }
  };

  const handlePaymentRecordChange = (
    type: 'pickup' | 'return',
    id: string,
    field: keyof PaymentRecord,
    value: string | number | null
  ) => {
    const updateRecords = (records: PaymentRecord[]) =>
      records.map(r => r.id === id ? { ...r, [field]: value } : r);

    if (type === 'pickup') {
      setPickup(prev => ({
        ...prev,
        paymentRecords: updateRecords(prev.paymentRecords)
      }));
    } else {
      setReturnInspection(prev => ({
        ...prev,
        paymentRecords: updateRecords(prev.paymentRecords)
      }));
    }
  };

  const handlePaymentProofUpload = (type: 'pickup' | 'return', id: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      handlePaymentRecordChange(type, id, 'proofImage', result);
    };
    reader.readAsDataURL(file);
    toast.success("อัปโหลดหลักฐานการชำระเงินสำเร็จ");
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(pickup, returnInspection, payment);
    toast.success("บันทึกข้อมูล Inspection สำเร็จ");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPickup(pickupData);
    setReturnInspection(returnData);
    setPayment(paymentDetail);
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
    toast.success("อัปเดตสถานะเป็น Picked Up สำเร็จ");
  };

  const handleReturnConfirm = () => {
    onStatusChange("returned");
    setShowReturnConfirm(false);
    toast.success("อัปเดตสถานะเป็น Returned สำเร็จ");
  };

  const renderInspectionSection = (
    title: string,
    data: InspectionData,
    setData: React.Dispatch<React.SetStateAction<InspectionData>>,
    type: 'pickup' | 'return'
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
        <div>
          <p className="text-muted-foreground mb-1">ระดับน้ำมัน</p>
          {isEditing ? (
            <Select
              value={data.fuelLevel}
              onValueChange={(value) => setData(prev => ({ ...prev, fuelLevel: value }))}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full</SelectItem>
                <SelectItem value="3/4">3/4</SelectItem>
                <SelectItem value="1/2">1/2</SelectItem>
                <SelectItem value="1/4">1/4</SelectItem>
                <SelectItem value="empty">Empty</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <p className="font-medium">{data.fuelLevel === 'full' ? 'Full' : data.fuelLevel}</p>
          )}
        </div>
        <div>
          <p className="text-muted-foreground mb-1">หมายเหตุ</p>
          {isEditing ? (
            <Textarea
              value={data.notes}
              onChange={(e) => setData(prev => ({ ...prev, notes: e.target.value }))}
              className="min-h-[60px] text-sm"
              placeholder="หมายเหตุเพิ่มเติม..."
            />
          ) : (
            <p className="font-medium">{data.notes || "-"}</p>
          )}
        </div>
      </div>

      {/* Vehicle Condition Records */}
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
                    <p className="text-xs text-muted-foreground mb-1">หัวข้อ</p>
                    {isEditing ? (
                      <Input
                        value={condition.title}
                        onChange={(e) => handleConditionChange(type, condition.id, 'title', e.target.value)}
                        className="h-8 text-sm"
                        placeholder="เช่น รอยขีดข่วนประตูหน้า"
                      />
                    ) : (
                      <p className="font-medium text-sm">{condition.title || "-"}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ระดับความรุนแรง</p>
                      {isEditing ? (
                        <Select
                          value={condition.severityLevel}
                          onValueChange={(value) => handleConditionChange(type, condition.id, 'severityLevel', value)}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="เลือกระดับ" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">น้อย</SelectItem>
                            <SelectItem value="medium">ปานกลาง</SelectItem>
                            <SelectItem value="high">มาก</SelectItem>
                            <SelectItem value="critical">รุนแรงมาก</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium text-sm">
                          {condition.severityLevel === 'low' && <span className="text-emerald-600">น้อย</span>}
                          {condition.severityLevel === 'medium' && <span className="text-amber-600">ปานกลาง</span>}
                          {condition.severityLevel === 'high' && <span className="text-orange-600">มาก</span>}
                          {condition.severityLevel === 'critical' && <span className="text-red-600">รุนแรงมาก</span>}
                          {!condition.severityLevel && "-"}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">ประเภทความเสียหาย</p>
                      {isEditing ? (
                        <Select
                          value={condition.damageType}
                          onValueChange={(value) => handleConditionChange(type, condition.id, 'damageType', value)}
                        >
                          <SelectTrigger className="h-8 text-sm">
                            <SelectValue placeholder="เลือกประเภท" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">ความเสียหายใหม่</SelectItem>
                            <SelectItem value="existing">มีมาก่อน</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium text-sm">
                          {condition.damageType === 'new' && <span className="text-red-600">ความเสียหายใหม่</span>}
                          {condition.damageType === 'existing' && <span className="text-muted-foreground">มีมาก่อน</span>}
                          {!condition.damageType && "-"}
                        </p>
                      )}
                    </div>
                  </div>
                  
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

      {/* Payment Records Section */}
      <div className="pt-3 border-t border-border mt-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-muted-foreground text-sm">บันทึกการรับเงิน ({data.paymentRecords.length} รายการ)</p>
          {isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs gap-1"
              onClick={() => handleAddPaymentRecord(type)}
            >
              <Plus className="w-3 h-3" />
              เพิ่มรายการ
            </Button>
          )}
        </div>
        
        <div className="space-y-2">
          {data.paymentRecords.map((record, index) => (
            <div key={record.id} className="border border-border rounded-lg p-3 bg-muted/20">
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="text-xs text-muted-foreground font-medium">รายการ #{index + 1}</span>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                    onClick={() => handleRemovePaymentRecord(type, record.id)}
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">หัวข้อรายการ</p>
                  {isEditing ? (
                    <Input
                      value={record.label}
                      onChange={(e) => handlePaymentRecordChange(type, record.id, 'label', e.target.value)}
                      className="h-8 text-sm"
                      placeholder="เช่น ชำระค่าเช่าคงเหลือ, ค่าน้ำมัน"
                    />
                  ) : (
                    <p className="font-medium text-sm">{record.label || "-"}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">ประเภทการชำระ</p>
                    {isEditing ? (
                      <Select
                        value={record.type}
                        onValueChange={(value) => handlePaymentRecordChange(type, record.id, 'type', value)}
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="เลือกประเภท" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="cash">เงินสด</SelectItem>
                          <SelectItem value="credit_card">บัตรเครดิต</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="font-medium text-sm">
                        {record.type === 'cash' ? 'เงินสด' : record.type === 'credit_card' ? 'บัตรเครดิต' : '-'}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">จำนวนเงิน</p>
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground text-sm">฿</span>
                        <Input
                          type="number"
                          value={record.amount}
                          onChange={(e) => handlePaymentRecordChange(type, record.id, 'amount', Number(e.target.value))}
                          className="h-8 text-sm"
                          placeholder="0"
                        />
                      </div>
                    ) : (
                      <p className="font-medium text-sm text-primary">฿{record.amount.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="mt-2">
                <p className="text-xs text-muted-foreground mb-1">หลักฐานการชำระเงิน</p>
                {record.proofImage ? (
                  <div className="relative w-20 h-20">
                    <img
                      src={record.proofImage}
                      alt="หลักฐานการชำระเงิน"
                      className="w-full h-full object-cover rounded-lg border border-border"
                    />
                    {isEditing && (
                      <button
                        onClick={() => handlePaymentRecordChange(type, record.id, 'proofImage', null)}
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
                        if (file) handlePaymentProofUpload(type, record.id, file);
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
          ))}
          
          {data.paymentRecords.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-2 bg-muted/20 rounded-lg">ยังไม่มีรายการบันทึกการรับเงิน</p>
          )}
        </div>
      </div>
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
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" className="h-8" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-1" />
                      ยกเลิก
                    </Button>
                    <Button size="sm" className="h-8" onClick={handleSave}>
                      <Save className="w-4 h-4 mr-1" />
                      บันทึก
                    </Button>
                  </>
                ) : (
                  <Button variant="outline" size="sm" className="h-8" onClick={() => setIsEditing(true)}>
                    <Pencil className="w-4 h-4 mr-1" />
                    แก้ไข
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>

          {/* Payment Details Section */}
          <Card className="p-4 mt-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="w-4 h-4 text-primary" />
              <h5 className="font-medium text-sm">รายละเอียดชำระเงิน</h5>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-1">ยอดมัดจำ</p>
                <p className="font-semibold text-lg text-primary">฿{payment.deposit.toLocaleString()}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-1">ยอดมัดจำความเสียหาย</p>
                <p className="font-semibold text-lg text-orange-600">฿{payment.damageDeposit.toLocaleString()}</p>
              </div>
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-1">ยอดรวมทั้งหมด</p>
                <p className="font-semibold text-lg">฿{payment.totalAmount.toLocaleString()}</p>
              </div>
            </div>
            
            {/* Editable remaining balance */}
            <div className="mt-3">
              <div className="bg-background/50 rounded-lg p-3">
                <p className="text-muted-foreground text-xs mb-1">ยอดคงเหลือ</p>
                {isEditing ? (
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">฿</span>
                    <Input
                      type="number"
                      value={payment.remainingBalance}
                      onChange={(e) => setPayment(prev => ({ ...prev, remainingBalance: Number(e.target.value) }))}
                      className="h-8 text-sm w-32"
                    />
                  </div>
                ) : (
                  <p className="font-semibold text-lg text-amber-600">฿{payment.remainingBalance.toLocaleString()}</p>
                )}
              </div>
            </div>
            
            {/* Payment Summary Section */}
            <div className="mt-3 pt-3 border-t border-primary/10">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                  <p className="text-emerald-700 dark:text-emerald-400 text-xs mb-1">รับเงินแล้ว</p>
                  <p className="font-semibold text-lg text-emerald-600">฿{totalCollected.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">({pickup.paymentRecords.length + returnInspection.paymentRecords.length} รายการ)</p>
                </div>
                <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                  <p className="text-amber-700 dark:text-amber-400 text-xs mb-1">ยอดคงเหลือ</p>
                  <p className="font-semibold text-lg text-amber-600">฿{payment.remainingBalance.toLocaleString()}</p>
                </div>
              </div>
            </div>

            {/* Damage Deposit Creation Section */}
            <div className="mt-4 pt-4 border-t border-primary/10">
              <div className="flex items-center justify-between mb-3">
                <h6 className="font-medium text-sm">สร้างยอดมัดจำความเสียหาย</h6>
                {!payment.damageDepositRecord && isEditing && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={handleCreateDamageDeposit}
                  >
                    <Plus className="w-3 h-3" />
                    สร้างรายการ
                  </Button>
                )}
              </div>
              
              {payment.damageDepositRecord ? (
                <div className="border border-border rounded-lg p-3 bg-muted/20 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">วันที่ทำรายการ</p>
                      {isEditing ? (
                        <Input
                          type="date"
                          value={payment.damageDepositRecord.date}
                          onChange={(e) => handleDamageDepositChange('date', e.target.value)}
                          className="h-8 text-sm"
                        />
                      ) : (
                        <p className="font-medium text-sm">{payment.damageDepositRecord.date}</p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">จำนวนเงิน</p>
                      {isEditing ? (
                        <div className="flex items-center gap-1">
                          <span className="text-muted-foreground text-sm">฿</span>
                          <Input
                            type="number"
                            value={payment.damageDepositRecord.amount}
                            onChange={(e) => handleDamageDepositChange('amount', Number(e.target.value))}
                            className="h-8 text-sm"
                          />
                        </div>
                      ) : (
                        <p className="font-medium text-sm text-primary">฿{payment.damageDepositRecord.amount.toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">หลักฐาน</p>
                    {payment.damageDepositRecord.proofImage ? (
                      <div className="relative w-20 h-20">
                        <img
                          src={payment.damageDepositRecord.proofImage}
                          alt="หลักฐานมัดจำความเสียหาย"
                          className="w-full h-full object-cover rounded-lg border border-border"
                        />
                        {isEditing && (
                          <button
                            onClick={() => handleDamageDepositChange('proofImage', null)}
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
                            if (file) handleDamageDepositProofUpload(file);
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
                  
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full gap-2"
                    onClick={handlePrintDamageDepositReceipt}
                  >
                    <FileText className="w-4 h-4" />
                    พิมพ์ใบเสร็จมัดจำความเสียหาย
                  </Button>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4 bg-muted/20 rounded-lg">
                  ยังไม่มีรายการมัดจำความเสียหาย
                </p>
              )}
            </div>
          </Card>

          <div className="grid grid-cols-2 gap-6 mt-4">
            <Card className="p-4">
              {renderInspectionSection("รับรถ (Pick Up)", pickup, setPickup, 'pickup')}
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  className="w-full gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
                  onClick={() => setShowPickupConfirm(true)}
                  disabled={bookingStatus !== "confirmed"}
                >
                  <LogIn className="w-4 h-4" />
                  ยืนยันรับรถ (Pick Up)
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              {renderInspectionSection("คืนรถ (Return)", returnInspection, setReturnInspection, 'return')}
              <div className="mt-4 pt-4 border-t border-border">
                <Button
                  className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setShowReturnConfirm(true)}
                  disabled={bookingStatus !== "picked_up"}
                >
                  <LogOut className="w-4 h-4" />
                  ยืนยันคืนรถ (Return)
                </Button>
              </div>
            </Card>
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
