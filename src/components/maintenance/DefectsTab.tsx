import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Plus,
  AlertTriangle,
  Trash2,
  ImageIcon,
  X,
  Camera,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface DefectItem {
  id: string;
  description: string;
  images: { id: string; name: string; url: string }[];
}

const mockDefects: DefectItem[] = [
  {
    id: "d1",
    description: "รอยขีดข่วนกันชนหน้าซ้าย (เดิม)",
    images: [{ id: "i1", name: "รอยขีดข่วน_หน้า.jpg", url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&h=200&fit=crop" }],
  },
  {
    id: "d2",
    description: "กระจกมองข้างซ้ายแตกร้าว ต้องเปลี่ยนใหม่",
    images: [
      { id: "i2", name: "กระจก_แตก_1.jpg", url: "https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=200&h=200&fit=crop" },
      { id: "i3", name: "กระจก_แตก_2.jpg", url: "https://images.unsplash.com/photo-1549317661-bd32c8ce0237?w=200&h=200&fit=crop" },
    ],
  },
  {
    id: "d3",
    description: "บุ๋มประตูหลังขวา ไม่มีรอยถลอกของสี",
    images: [{ id: "i4", name: "รอยบุ๋ม_ประตูหลัง.jpg", url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=200&h=200&fit=crop" }],
  },
];

interface DefectsTabProps {
  vehicleId: string;
}

export function DefectsTab({ vehicleId }: DefectsTabProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<DefectItem[]>(mockDefects);
  const [totalDamage, setTotalDamage] = useState<string>("16500");
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { id: Date.now().toString(), description: "", images: [] },
    ]);
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({ title: "ลบรายการเรียบร้อย" });
  };

  const handleDescriptionChange = (id: string, value: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, description: value } : i))
    );
  };

  const handleFileUpload = (itemId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newImages = Array.from(files).map((file) => ({
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      name: file.name,
      url: URL.createObjectURL(file),
    }));
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId ? { ...i, images: [...i.images, ...newImages] } : i
      )
    );
    toast({ title: `เพิ่ม ${newImages.length} รูปเรียบร้อย` });
  };

  const handleCameraCapture = (itemId: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      handleFileUpload(itemId, target.files);
    };
    input.click();
  };

  const handleRemoveImage = (itemId: string, imgId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? { ...i, images: i.images.filter((img) => img.id !== imgId) }
          : i
      )
    );
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-warning" />
          สภาพรถ ({items.length} รายการ)
        </h3>
        <Button size="sm" variant="outline" onClick={handleAddItem}>
          <Plus className="w-4 h-4 mr-1" /> เพิ่มรายการ
        </Button>
      </div>

      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">ยังไม่มีรายการตำหนิ/ความเสียหาย</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item, index) => (
            <Card key={item.id} className="p-4">
              <div className="flex items-start justify-between mb-2">
                <span className="text-sm font-semibold text-muted-foreground">
                  รายการ #{index + 1}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteItem(item.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-xs text-muted-foreground">รายละเอียด</label>
                  <Textarea
                    placeholder="อธิบายความเสียหาย..."
                    value={item.description}
                    onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground">รูปประกอบ</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {item.images.map((img) => (
                      <div
                        key={img.id}
                        className="relative w-16 h-16 rounded-md border border-border overflow-hidden group/img"
                      >
                        {img.url ? (
                          <img
                            src={img.url}
                            alt={img.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                          </div>
                        )}
                        <button
                          onClick={() => handleRemoveImage(item.id, img.id)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}

                    {/* Camera button */}
                    <button
                      onClick={() => handleCameraCapture(item.id)}
                      className="w-16 h-16 rounded-md border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center hover:bg-muted transition-colors gap-0.5"
                    >
                      <Camera className="w-4 h-4 text-muted-foreground/60" />
                      <span className="text-[10px] text-muted-foreground/60">ถ่ายรูป</span>
                    </button>

                    {/* Upload button */}
                    <button
                      onClick={() => fileInputRefs.current[item.id]?.click()}
                      className="w-16 h-16 rounded-md border border-dashed border-border bg-muted/50 flex flex-col items-center justify-center hover:bg-muted transition-colors gap-0.5"
                    >
                      <Upload className="w-4 h-4 text-muted-foreground/60" />
                      <span className="text-[10px] text-muted-foreground/60">อัปโหลด</span>
                    </button>
                    <input
                      ref={(el) => { fileInputRefs.current[item.id] = el; }}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(item.id, e.target.files)}
                    />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Total damage cost */}
      {items.length > 0 && (
        <Card className="p-4 border-destructive/20 bg-destructive/5">
          <label className="text-sm font-semibold text-destructive">ยอดความเสียหายทั้งหมด</label>
          <div className="flex items-center gap-1 mt-1">
            <span className="text-destructive font-bold">฿</span>
            <Input
              type="number"
              placeholder="0"
              value={totalDamage}
              onChange={(e) => setTotalDamage(e.target.value)}
              className="border-destructive/30 text-destructive font-bold"
            />
          </div>
        </Card>
      )}
    </div>
  );
}
