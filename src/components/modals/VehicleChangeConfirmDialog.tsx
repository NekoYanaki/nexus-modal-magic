import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Car } from "lucide-react";
import type { SelectableVehicle } from "./VehicleSelectionDialog";

interface ReasonDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export const VehicleChangeReasonDialog = ({ open, onClose, onConfirm }: ReasonDialogProps) => {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  const handleClose = () => {
    setReason("");
    onClose();
  };

  return (
    <AlertDialog open={open} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            ยืนยันการเปลี่ยนรถ
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>คุณต้องการเปลี่ยนรถสำหรับการจองนี้ใช่หรือไม่?</p>
              <div>
                <Label htmlFor="change-reason" className="text-foreground">เหตุผลในการเปลี่ยนรถ <span className="text-destructive">*</span></Label>
                <Textarea
                  id="change-reason"
                  placeholder="ระบุเหตุผลในการเปลี่ยนรถ เช่น รถเดิมอยู่ระหว่างซ่อมบำรุง..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1.5"
                  rows={3}
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={!reason.trim()}>
            ดำเนินการเลือกรถ
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface OriginalVehicleInfo {
  name: string;
  year?: string;
  licensePlate?: string;
  type?: string;
  pricePerDay?: number;
}

interface FinalConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedVehicle: SelectableVehicle | null;
  originalVehicle?: OriginalVehicleInfo | null;
  reason: string;
}

export const VehicleChangeFinalConfirmDialog = ({ open, onClose, onConfirm, selectedVehicle, originalVehicle, reason }: FinalConfirmDialogProps) => {
  if (!selectedVehicle) return null;

  const VehicleInfoBlock = ({ title, vehicle, highlight }: { title: string; vehicle: { name: string; year?: string; licensePlate?: string; type?: string; pricePerDay?: number }; highlight?: boolean }) => (
    <div className={`rounded-lg border p-3 space-y-2 text-sm ${highlight ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/30'}`}>
      <p className={`text-xs font-semibold uppercase tracking-wide ${highlight ? 'text-primary' : 'text-muted-foreground'}`}>{title}</p>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-muted-foreground">ชื่อรถ</span>
          <span className="font-semibold text-foreground">{vehicle.name} {vehicle.year || ''}</span>
        </div>
        {vehicle.licensePlate && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">ทะเบียน</span>
            <span className="font-medium text-foreground">{vehicle.licensePlate}</span>
          </div>
        )}
        {vehicle.type && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">ประเภท</span>
            <span className="font-medium text-foreground">{vehicle.type}</span>
          </div>
        )}
        {vehicle.pricePerDay != null && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">ราคา/วัน</span>
            <span className="font-medium text-foreground">฿{vehicle.pricePerDay.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Car className="w-5 h-5 text-primary" />
            ยืนยันการเปลี่ยนรถ
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>กรุณาตรวจสอบข้อมูลก่อนยืนยัน</p>
              {originalVehicle && (
                <VehicleInfoBlock title="🚗 รถคันเดิม" vehicle={originalVehicle} />
              )}
              <div className="flex justify-center">
                <span className="text-muted-foreground text-lg">↓</span>
              </div>
              <VehicleInfoBlock title="🚙 รถคันใหม่" vehicle={selectedVehicle} highlight />
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm">
                <span className="text-muted-foreground">เหตุผล: </span>
                <span className="text-foreground">{reason}</span>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>ยืนยันเปลี่ยนรถ</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
