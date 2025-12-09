import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Save, X, Upload, Trash2, Image } from "lucide-react";
import { toast } from "sonner";

interface InspectionData {
  date: string;
  mileage: string;
  fuelLevel: string;
  condition: string;
  notes: string;
  images: string[];
}

interface InspectionCardProps {
  pickupData?: InspectionData;
  returnData?: InspectionData;
  onSave?: (pickup: InspectionData, returnData: InspectionData) => void;
}

const defaultPickup: InspectionData = {
  date: "15 Mar 2024, 09:00",
  mileage: "45,230",
  fuelLevel: "full",
  condition: "ปกติ ไม่มีรอยตำหนิ",
  notes: "",
  images: [],
};

const defaultReturn: InspectionData = {
  date: "19 Mar 2024, 17:00",
  mileage: "45,890",
  fuelLevel: "3/4",
  condition: "ปกติ ไม่มีรอยตำหนิ",
  notes: "",
  images: [],
};

export const InspectionCard = ({ 
  pickupData = defaultPickup, 
  returnData = defaultReturn,
  onSave 
}: InspectionCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [pickup, setPickup] = useState<InspectionData>(pickupData);
  const [returnInspection, setReturnInspection] = useState<InspectionData>(returnData);
  
  const pickupFileRef = useRef<HTMLInputElement>(null);
  const returnFileRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (type: 'pickup' | 'return', files: FileList | null) => {
    if (!files) return;
    
    const currentImages = type === 'pickup' ? pickup.images : returnInspection.images;
    const remainingSlots = 6 - currentImages.length;
    
    if (remainingSlots <= 0) {
      toast.error("สามารถอัปโหลดได้สูงสุด 6 รูปเท่านั้น");
      return;
    }

    const filesToProcess = Array.from(files).slice(0, remainingSlots);
    
    filesToProcess.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (type === 'pickup') {
          setPickup(prev => ({
            ...prev,
            images: [...prev.images, result].slice(0, 6)
          }));
        } else {
          setReturnInspection(prev => ({
            ...prev,
            images: [...prev.images, result].slice(0, 6)
          }));
        }
      };
      reader.readAsDataURL(file);
    });
    
    toast.success(`อัปโหลด ${filesToProcess.length} รูปสำเร็จ`);
  };

  const handleRemoveImage = (type: 'pickup' | 'return', index: number) => {
    if (type === 'pickup') {
      setPickup(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    } else {
      setReturnInspection(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    onSave?.(pickup, returnInspection);
    toast.success("บันทึกข้อมูล Inspection สำเร็จ");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setPickup(pickupData);
    setReturnInspection(returnData);
  };

  const renderImageGrid = (images: string[], type: 'pickup' | 'return') => {
    const slots = Array(6).fill(null);
    images.forEach((img, i) => {
      if (i < 6) slots[i] = img;
    });

    return (
      <div className="grid grid-cols-3 gap-2 mt-3">
        {slots.map((img, index) => (
          <div 
            key={index} 
            className="aspect-square border border-dashed border-border rounded-lg overflow-hidden relative bg-muted/30 flex items-center justify-center"
          >
            {img ? (
              <>
                <img src={img} alt={`${type} ${index + 1}`} className="w-full h-full object-cover" />
                {isEditing && (
                  <button
                    onClick={() => handleRemoveImage(type, index)}
                    className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </>
            ) : (
              <Image className="w-6 h-6 text-muted-foreground/50" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderInspectionSection = (
    title: string,
    data: InspectionData,
    setData: React.Dispatch<React.SetStateAction<InspectionData>>,
    type: 'pickup' | 'return',
    fileRef: React.RefObject<HTMLInputElement>
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
          <p className="text-muted-foreground mb-1">สภาพรถ</p>
          {isEditing ? (
            <Input 
              value={data.condition} 
              onChange={(e) => setData(prev => ({ ...prev, condition: e.target.value }))}
              className="h-8"
            />
          ) : (
            <p className="font-medium text-success">{data.condition}</p>
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

      {/* Image Upload Section */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <p className="text-muted-foreground text-sm">รูปภาพ ({data.images.length}/6)</p>
          {isEditing && data.images.length < 6 && (
            <>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageUpload(type, e.target.files)}
              />
              <Button 
                variant="outline" 
                size="sm" 
                className="h-7 text-xs"
                onClick={() => fileRef.current?.click()}
              >
                <Upload className="w-3 h-3 mr-1" />
                อัปโหลดรูป
              </Button>
            </>
          )}
        </div>
        {renderImageGrid(data.images, type)}
      </div>
    </div>
  );

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          </svg>
          Inspection รับรถ - คืนรถ
        </h4>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleCancel}>
                <X className="w-3 h-3 mr-1" />
                ยกเลิก
              </Button>
              <Button size="sm" className="h-7 text-xs" onClick={handleSave}>
                <Save className="w-3 h-3 mr-1" />
                บันทึก
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setIsEditing(true)}>
              <Pencil className="w-3 h-3 mr-1" />
              แก้ไข
            </Button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {renderInspectionSection("รับรถ (Pick Up)", pickup, setPickup, 'pickup', pickupFileRef)}
        {renderInspectionSection("คืนรถ (Return)", returnInspection, setReturnInspection, 'return', returnFileRef)}
      </div>
    </Card>
  );
};
