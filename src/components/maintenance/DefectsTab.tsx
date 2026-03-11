import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  AlertTriangle,
  Edit2,
  Trash2,
  ImageIcon,
  X,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface DefectItem {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high";
  estimatedCost: number;
  images: { id: string; name: string; url: string }[];
  status: "reported" | "fixing" | "resolved";
  reportedDate: string;
}

const mockDefects: DefectItem[] = [
  {
    id: "d1",
    title: "รอยขีดข่วนฝากระโปรงหน้า",
    description: "รอยขีดข่วนยาวประมาณ 15 ซม. ด้านขวาของฝากระโปรง สาเหตุจากกิ่งไม้เสียดสี",
    severity: "low",
    estimatedCost: 3000,
    images: [{ id: "i1", name: "รอยขีดข่วน_หน้า.jpg", url: "" }],
    status: "reported",
    reportedDate: "18 ก.พ. 2026",
  },
  {
    id: "d2",
    title: "กระจกมองข้างซ้ายแตกร้าว",
    description: "กระจกมองข้างฝั่งคนขับมีรอยร้าวจากการกระแทก ต้องเปลี่ยนใหม่ทั้งชิ้น",
    severity: "high",
    estimatedCost: 8500,
    images: [
      { id: "i2", name: "กระจก_แตก_1.jpg", url: "" },
      { id: "i3", name: "กระจก_แตก_2.jpg", url: "" },
    ],
    status: "fixing",
    reportedDate: "15 ก.พ. 2026",
  },
  {
    id: "d3",
    title: "บุ๋มประตูหลังขวา",
    description: "รอยบุ๋มขนาดเล็กบริเวณประตูหลังขวา ไม่มีรอยถลอกของสี",
    severity: "medium",
    estimatedCost: 5000,
    images: [{ id: "i4", name: "รอยบุ๋ม_ประตูหลัง.jpg", url: "" }],
    status: "reported",
    reportedDate: "20 ก.พ. 2026",
  },
  {
    id: "d4",
    title: "เบาะนั่งหลังฉีกขาด",
    description: "เบาะนั่งหลังด้านซ้ายมีรอยฉีกขาดยาว 5 ซม. สาเหตุจากของมีคมเสียดสี",
    severity: "medium",
    estimatedCost: 4000,
    images: [],
    status: "resolved",
    reportedDate: "10 ก.พ. 2026",
  },
];

interface DefectsTabProps {
  vehicleId: string;
}

export function DefectsTab({ vehicleId }: DefectsTabProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<DefectItem[]>(mockDefects);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", severity: "medium" as DefectItem["severity"], estimatedCost: "" });
  const [formImages, setFormImages] = useState<DefectItem["images"]>([]);

  const totalDamage = items.reduce((sum, i) => sum + i.estimatedCost, 0);
  const unresolvedCount = items.filter((i) => i.status !== "resolved").length;

  const resetForm = () => {
    setForm({ title: "", description: "", severity: "medium", estimatedCost: "" });
    setFormImages([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const newItem: DefectItem = {
      id: editingId || Date.now().toString(),
      title: form.title.trim(),
      description: form.description.trim(),
      severity: form.severity,
      estimatedCost: Number(form.estimatedCost) || 0,
      images: formImages,
      status: "reported",
      reportedDate: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }),
    };

    if (editingId) {
      setItems((prev) => prev.map((i) => (i.id === editingId ? { ...newItem, status: i.status, reportedDate: i.reportedDate } : i)));
      toast({ title: "แก้ไขรายการเรียบร้อย" });
    } else {
      setItems((prev) => [...prev, newItem]);
      toast({ title: "เพิ่มรายการความเสียหายเรียบร้อย" });
    }
    resetForm();
  };

  const handleEdit = (item: DefectItem) => {
    setEditingId(item.id);
    setForm({ title: item.title, description: item.description, severity: item.severity, estimatedCost: item.estimatedCost.toString() });
    setFormImages(item.images);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({ title: "ลบรายการเรียบร้อย" });
  };

  const handleStatusChange = (id: string) => {
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== id) return i;
        const next = i.status === "reported" ? "fixing" : i.status === "fixing" ? "resolved" : "reported";
        return { ...i, status: next as DefectItem["status"] };
      })
    );
  };

  const handleAddImage = () => {
    setFormImages((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `ภาพ_${prev.length + 1}.jpg`, url: "" },
    ]);
  };

  const handleRemoveImage = (imgId: string) => {
    setFormImages((prev) => prev.filter((i) => i.id !== imgId));
  };

  const getSeverityBadge = (severity: DefectItem["severity"]) => {
    switch (severity) {
      case "low":
        return <Badge variant="outline" className="text-success border-success/30">เล็กน้อย</Badge>;
      case "medium":
        return <Badge variant="outline" className="text-warning border-warning/30">ปานกลาง</Badge>;
      case "high":
        return <Badge variant="outline" className="text-destructive border-destructive/30">รุนแรง</Badge>;
    }
  };

  const getStatusBadge = (status: DefectItem["status"]) => {
    switch (status) {
      case "reported":
        return <Badge className="bg-warning/10 text-warning border-warning/20 cursor-pointer">รอแก้ไข</Badge>;
      case "fixing":
        return <Badge className="bg-primary/10 text-primary border-primary/20 cursor-pointer">กำลังแก้ไข</Badge>;
      case "resolved":
        return <Badge className="bg-success/10 text-success border-success/20 cursor-pointer">แก้ไขแล้ว</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-warning" />
            ตำหนิ / ความเสียหาย
          </h3>
          <span className="text-sm text-muted-foreground">
            {unresolvedCount} รายการที่ยังไม่แก้ไข
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium">
            ค่าเสียหายรวม: <span className="text-destructive font-bold">{totalDamage.toLocaleString()} ฿</span>
          </span>
          <Button size="sm" onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="w-4 h-4 mr-1" /> เพิ่มรายการ
          </Button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="p-4 border-warning/30 bg-warning/5">
          <h4 className="font-semibold mb-3">{editingId ? "แก้ไขรายการ" : "เพิ่มรายการความเสียหายใหม่"}</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">ชื่อรายการ *</label>
              <Input
                placeholder="เช่น รอยขีดข่วนฝากระโปรง, กระจกแตก"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">รายละเอียด</label>
              <Textarea
                placeholder="อธิบายตำแหน่ง สาเหตุ และขนาดความเสียหาย..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">ระดับความรุนแรง</label>
                <div className="flex gap-1 mt-1">
                  {(["low", "medium", "high"] as const).map((s) => (
                    <Button
                      key={s}
                      variant={form.severity === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setForm((f) => ({ ...f, severity: s }))}
                      className={form.severity === s ? "" : ""}
                    >
                      {s === "low" ? "เล็กน้อย" : s === "medium" ? "ปานกลาง" : "รุนแรง"}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">ค่าเสียหายโดยประมาณ (฿)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.estimatedCost}
                  onChange={(e) => setForm((f) => ({ ...f, estimatedCost: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">แนบรูปภาพ</label>
                <Button variant="outline" size="sm" className="mt-1" onClick={handleAddImage}>
                  <ImageIcon className="w-4 h-4 mr-1" /> เพิ่มรูป
                </Button>
              </div>
            </div>
            {formImages.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formImages.map((img) => (
                  <div key={img.id} className="flex items-center gap-1 bg-secondary/50 rounded-md px-2 py-1 text-xs">
                    <ImageIcon className="w-3 h-3" />
                    <span>{img.name}</span>
                    <button onClick={() => handleRemoveImage(img.id)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={resetForm}>ยกเลิก</Button>
              <Button size="sm" onClick={handleSave} disabled={!form.title.trim()}>
                {editingId ? "บันทึก" : "เพิ่ม"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Items list */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">ยังไม่มีรายการตำหนิ/ความเสียหาย</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className={`p-4 group hover:shadow-sm transition-shadow ${item.status === "resolved" ? "opacity-60" : ""}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold">{item.title}</h4>
                    {getSeverityBadge(item.severity)}
                    <div onClick={() => handleStatusChange(item.id)}>
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-destructive">{item.estimatedCost.toLocaleString()} ฿</span>
                    <span className="text-muted-foreground">รายงานเมื่อ {item.reportedDate}</span>
                    {item.images.length > 0 && (
                      <div className="flex items-center gap-1">
                        {item.images.map((img) => (
                          <span key={img.id} className="inline-flex items-center gap-1 bg-secondary/50 rounded px-2 py-0.5 text-xs">
                            <ImageIcon className="w-3 h-3" />
                            {img.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
