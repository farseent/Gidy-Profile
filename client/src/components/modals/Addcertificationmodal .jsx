import { useState } from "react";
import { X } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { addCertification, updateCertification } from "../../services/api";
import toast from "react-hot-toast";

const MAX_DESC = 200;

export default function AddCertificationModal({ editItem, onClose }) {
  const { setCerts, profileId } = useProfileContext();
  const [form, setForm] = useState({
    title:          editItem?.title          || "",
    issuer:         editItem?.issuer         || "",
    certificateUrl: editItem?.certificateUrl || "",
    certificateId:  editItem?.certificateId  || "",
    issuedDate:     editItem?.issuedDate?.substring(0, 10)  || "",
    expiryDate:     editItem?.expiryDate?.substring(0, 10)  || "",
    description:    editItem?.description    || "",
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

  const descLen = form.description.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-base">
            {editItem ? "Edit Certification" : "Add Certification"}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 space-y-4">
          <F label="Certification" required value={form.title}  onChange={set("title")}  placeholder="e.g. AWS Certified Developer" />
          <F label="Provider"      required value={form.issuer} onChange={set("issuer")} placeholder="e.g. Amazon Web Services" />
          <F label="Certificate URL" value={form.certificateUrl} onChange={set("certificateUrl")} placeholder="https://..." />
          <F label="Certificate ID"  value={form.certificateId}  onChange={set("certificateId")}  placeholder="e.g. ABC-12345" />

          <div className="grid grid-cols-2 gap-3">
            <F label="Issued Date" value={form.issuedDate} onChange={set("issuedDate")} type="date" />
            <F label="Expiry Date" value={form.expiryDate} onChange={set("expiryDate")} type="date" />
          </div>

          {/* Description with counter */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-medium text-gray-700">Description</label>
              <span className="text-[12px] text-gray-400">max character ({MAX_DESC} - {descLen})</span>
            </div>
            <textarea
              value={form.description}
              onChange={(e) => { if (e.target.value.length <= MAX_DESC) set("description")(e); }}
              rows={4}
              placeholder="Brief description about this certification..."
              className="input-field resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>

      </div>
    </div>
  );
}

function F({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="input-field" />
    </div>
  );
}