import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Minus,
  Wrench,
  Edit2,
  Save,
  ImageIcon,
  FileText,
  X,
  Trash2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export interface RepairItem {
  id: string;
  name: string;
  description: string;
  price: number;
  attachments: { id: string; name: string; type: "image" | "document"; url: string }[];
  status: "pending" | "in_progress" | "completed";
}

const mockRepairItems: RepairItem[] = [
  {
    id: "r1",
    name: "เปลี่ยนหัวเทียน",
    description: "หัวเทียนเสื่อมสภาพ ทำให้เครื่องยนต์สั่นผิดปกติ เปลี่ยนทั้ง 4 หัว",
    price: 2400,
    attachments: [
      { id: "a1", name: "หัวเทียนเก่า.jpg", type: "image", url: "" },
    ],
    status: "completed",
  },
  {
    id: "r2",
    name: "เปลี่ยนน้ำมันเครื่อง",
    description: "ถ่ายน้ำมันเครื่องเก่า เติมน้ำมัน 5W-30 ใหม่ 4 ลิตร พร้อมเปลี่ยนกรองน้ำมัน",
    price: 1800,
    attachments: [],
    status: "in_progress",
  },
  {
    id: "r3",
    name: "ซ่อมระบบแอร์",
    description: "แอร์ไม่เย็น ต้องเติมน้ำยาแอร์และตรวจสอบคอมเพรสเซอร์",
    price: 3500,
    attachments: [
      { id: "a2", name: "ใบเสนอราคาแอร์.pdf", type: "document", url: "" },
    ],
    status: "pending",
  },
];

interface RepairJobTabProps {
  vehicleId: string;
}

export function RepairJobTab({ vehicleId }: RepairJobTabProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<RepairItem[]>(mockRepairItems);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", price: "" });
  const [formAttachments, setFormAttachments] = useState<RepairItem["attachments"]>([]);

  const totalCost = items.reduce((sum, i) => sum + i.price, 0);
  const completedCount = items.filter((i) => i.status === "completed").length;

  const resetForm = () => {
    setForm({ name: "", description: "", price: "" });
    setFormAttachments([]);
    setEditingId(null);
    setShowForm(false);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    const newItem: RepairItem = {
      id: editingId || Date.now().toString(),
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price) || 0,
      attachments: formAttachments,
      status: "pending",
    };

    if (editingId) {
      setItems((prev) => prev.map((i) => (i.id === editingId ? { ...newItem, status: i.status } : i)));
      toast({ title: "แก้ไขรายการซ่อมเรียบร้อย" });
    } else {
      setItems((prev) => [...prev, newItem]);
      toast({ title: "เพิ่มรายการซ่อมเรียบร้อย" });
    }
    resetForm();
  };

  const handleEdit = (item: RepairItem) => {
    setEditingId(item.id);
    setForm({ name: item.name, description: item.description, price: item.price.toString() });
    setFormAttachments(item.attachments);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    toast({ title: "ลบรายการซ่อมเรียบร้อย" });
  };

  const handleStatusChange = (id: string, status: RepairItem["status"]) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)));
  };

  const handleFileAttach = () => {
    // Simulate file attachment
    const mockFile = {
      id: Date.now().toString(),
      name: `ไฟล์แนบ_${formAttachments.length + 1}.jpg`,
      type: "image" as const,
      url: "",
    };
    setFormAttachments((prev) => [...prev, mockFile]);
  };

  const handleRemoveAttachment = (attachId: string) => {
    setFormAttachments((prev) => prev.filter((a) => a.id !== attachId));
  };

  const getStatusBadge = (status: RepairItem["status"]) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-warning/10 text-warning border-warning/20 cursor-pointer">รอดำเนินการ</Badge>;
      case "in_progress":
        return <Badge className="bg-primary/10 text-primary border-primary/20 cursor-pointer">กำลังซ่อม</Badge>;
      case "completed":
        return <Badge className="bg-success/10 text-success border-success/20 cursor-pointer">เสร็จสิ้น</Badge>;
    }
  };

  const nextStatus = (s: RepairItem["status"]): RepairItem["status"] => {
    if (s === "pending") return "in_progress";
    if (s === "in_progress") return "completed";
    return "pending";
  };

  return (
    <div className="space-y-4">
      {/* Job Header */}
      <Card className="p-4 border-primary/20">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            งานซ่อม
          </h3>
          <span className="text-sm font-medium">
            รวมทั้งหมด: <span className="text-primary font-bold">{totalCost.toLocaleString()} ฿</span>
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          {items.length} หัวข้อ · {completedCount}/{items.length} เสร็จสิ้น
        </p>
      </Card>

      {/* Add topic button */}
      <div className="flex justify-end">
        <Button size="sm" variant="outline" onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="w-4 h-4 mr-1" /> เพิ่มหัวข้อซ่อม
        </Button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card className="p-4 border-primary/30 bg-primary/5">
          <h4 className="font-semibold mb-3">{editingId ? "แก้ไขหัวข้อซ่อม" : "เพิ่มหัวข้อซ่อมใหม่"}</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">ชื่อหัวข้อ *</label>
              <Input
                placeholder="เช่น เปลี่ยนหัวเทียน, ซ่อมระบบแอร์"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">รายละเอียด</label>
              <Textarea
                placeholder="อธิบายรายละเอียดการซ่อม..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                rows={2}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">ราคา (฿)</label>
                <Input
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">แนบไฟล์</label>
                <div className="flex items-center gap-2 mt-1">
                  <Button variant="outline" size="sm" onClick={handleFileAttach}>
                    <ImageIcon className="w-4 h-4 mr-1" /> รูปภาพ
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleFileAttach}>
                    <FileText className="w-4 h-4 mr-1" /> เอกสาร
                  </Button>
                </div>
              </div>
            </div>
            {formAttachments.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formAttachments.map((att) => (
                  <div key={att.id} className="flex items-center gap-1 bg-secondary/50 rounded-md px-2 py-1 text-xs">
                    {att.type === "image" ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                    <span>{att.name}</span>
                    <button onClick={() => handleRemoveAttachment(att.id)} className="text-muted-foreground hover:text-destructive">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={resetForm}>ยกเลิก</Button>
              <Button size="sm" onClick={handleSave} disabled={!form.name.trim()}>
                {editingId ? "บันทึก" : "เพิ่ม"}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Topics list */}
      {items.length === 0 ? (
        <div className="text-center py-12">
          <Wrench className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">ยังไม่มีหัวข้อซ่อม</p>
          <p className="text-sm text-muted-foreground">กดปุ่ม "เพิ่มหัวข้อซ่อม" เพื่อเริ่มสร้าง</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item, index) => (
            <Card key={item.id} className="p-3 group hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground bg-muted rounded-full w-6 h-6 flex items-center justify-center shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div onClick={() => handleStatusChange(item.id, nextStatus(item.status))}>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mb-1">{item.description}</p>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-primary">{item.price.toLocaleString()} ฿</span>
                      {item.attachments.length > 0 && (
                        <div className="flex items-center gap-1">
                          {item.attachments.map((att) => (
                            <span key={att.id} className="inline-flex items-center gap-1 bg-secondary/50 rounded px-1.5 py-0.5 text-[10px]">
                              {att.type === "image" ? <ImageIcon className="w-2.5 h-2.5" /> : <FileText className="w-2.5 h-2.5" />}
                              {att.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEdit(item)}>
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="w-3.5 h-3.5" />
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
