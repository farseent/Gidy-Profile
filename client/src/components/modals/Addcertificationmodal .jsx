import { useState } from "react";
import { X } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { addCertification, updateCertification } from "../../services/api";
import toast from "react-hot-toast";

export default function AddCertificationModal({ editItem, onClose }) {
  const { setCerts, profileId } = useProfileContext();
  const [form, setForm] = useState({
    title: editItem?.title || "",
    issuer: editItem?.issuer || "",
    certificateUrl: editItem?.certificateUrl || "",
    issuedDate: editItem?.issuedDate?.substring(0,10) || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    if (!form.title || !form.issuer) return toast.error("Fill required fields");
    setSaving(true);
    try {
      if (editItem) {
        const { data } = await updateCertification(profileId, editItem._id, form);
        setCerts(c => c.map(x => x._id === editItem._id ? data : x));
        toast.success("Certification updated!");
      } else {
        const { data } = await addCertification(profileId, form);
        setCerts(c => [data, ...c]);
        toast.success("Certification added!");
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
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">{editItem ? "Edit Certification" : "Add Certification"}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-colors"><X size={18}/></button>
        </div>
        <div className="p-5 space-y-4">
          <F label="Certificate Title *" value={form.title} onChange={set("title")} />
          <F label="Issuer *" value={form.issuer} onChange={set("issuer")} />
          <F label="Certificate URL" value={form.certificateUrl} onChange={set("certificateUrl")} placeholder="https://..." />
          <F label="Issued Date" value={form.issuedDate} onChange={set("issuedDate")} type="date" />
        </div>
        <div className="flex gap-2 p-5 border-t border-gray-100">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">{saving ? "Saving..." : "Save"}</button>
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
}
function F({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="input-field" />
    </div>
  );
}