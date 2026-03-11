import { useState } from "react";
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
    images: [{ id: "i1", name: "รอยขีดข่วน_หน้า.jpg", url: "" }],
  },
  {
    id: "d2",
    description: "78787",
    images: [{ id: "i2", name: "กระจก_แตก_1.jpg", url: "" }],
  },
];

interface DefectsTabProps {
  vehicleId: string;
}

export function DefectsTab({ vehicleId }: DefectsTabProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<DefectItem[]>(mockDefects);
  const [totalDamage, setTotalDamage] = useState<string>("5000");

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

  const handleAddImage = (itemId: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === itemId
          ? {
              ...i,
              images: [
                ...i.images,
                { id: Date.now().toString(), name: `ภาพ_${i.images.length + 1}.jpg`, url: "" },
              ],
            }
          : i
      )
    );
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
                        className="relative w-16 h-16 rounded-md border border-border bg-muted flex items-center justify-center group/img"
                      >
                        <ImageIcon className="w-6 h-6 text-muted-foreground/40" />
                        <button
                          onClick={() => handleRemoveImage(item.id, img.id)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => handleAddImage(item.id)}
                      className="w-16 h-16 rounded-md border border-dashed border-border bg-muted/50 flex items-center justify-center hover:bg-muted transition-colors"
                    >
                      <Plus className="w-5 h-5 text-muted-foreground/50" />
                    </button>
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
