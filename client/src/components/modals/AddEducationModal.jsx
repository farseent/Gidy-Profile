import { useState } from "react";
import { X } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { addEducation, updateEducation } from "../../services/api";
import toast from "react-hot-toast";

export default function AddEducationModal({ editItem, onClose }) {
  const { setEducation, profileId } = useProfileContext();
  const [form, setForm] = useState({
    degree: editItem?.degree || "",
    institution: editItem?.institution || "",
    university: editItem?.university || "",
    startDate: editItem?.startDate?.substring(0,10) || "",
    endDate: editItem?.endDate?.substring(0,10) || "",
    isCurrent: editItem?.isCurrent || false,
    grade: editItem?.grade || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSave = async () => {
    if (!form.degree || !form.institution || !form.startDate) return toast.error("Fill required fields");
    setSaving(true);
    try {
      if (editItem) {
        const { data } = await updateEducation(profileId, editItem._id, form);
        setEducation(e => e.map(x => x._id === editItem._id ? data : x));
        toast.success("Education updated!");
      } else {
        const { data } = await addEducation(profileId, form);
        setEducation(e => [data, ...e]);
        toast.success("Education added!");
      }
      onClose();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{editItem ? "Edit Education" : "Add Education"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X size={18}/></button>
        </div>
        <div className="p-5 space-y-4">
          <F label="Degree / Course *" value={form.degree} onChange={set("degree")} />
          <F label="Institution *" value={form.institution} onChange={set("institution")} />
          <F label="University / Board" value={form.university} onChange={set("university")} />
          <div className="grid grid-cols-2 gap-3">
            <F label="Start Date *" value={form.startDate} onChange={set("startDate")} type="date" />
            {!form.isCurrent && <F label="End Date" value={form.endDate} onChange={set("endDate")} type="date" />}
          </div>
          <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer">
            <input type="checkbox" checked={form.isCurrent} onChange={set("isCurrent")} className="rounded" />
            Currently studying here
          </label>
          <F label="Grade / CGPA" value={form.grade} onChange={set("grade")} />
        </div>
        <div className="flex gap-2 p-5 border-t border-gray-100">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? "Saving..." : "Save"}</button>
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
}
function F({ label, value, onChange, type="text" }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange} className="input-field" />
    </div>
  );
}