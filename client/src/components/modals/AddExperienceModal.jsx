import { useState } from "react";
import { X } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { addExperience, updateExperience } from "../../services/api";
import toast from "react-hot-toast";

export default function AddExperienceModal({ editItem, onClose }) {
  const { setExperience, profileId } = useProfileContext();
  const [form, setForm] = useState({
    title: editItem?.title || "",
    company: editItem?.company || "",
    location: editItem?.location || "",
    startDate: editItem?.startDate?.substring(0,10) || "",
    endDate: editItem?.endDate?.substring(0,10) || "",
    isCurrent: editItem?.isCurrent || false,
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSave = async () => {
    if (!form.title || !form.company || !form.startDate) return toast.error("Fill required fields");
    setSaving(true);
    try {
      if (editItem) {
        const { data } = await updateExperience(profileId, editItem._id, form);
        setExperience(e => e.map(x => x._id === editItem._id ? data : x));
        toast.success("Experience updated!");
      } else {
        const { data } = await addExperience(profileId, form);
        setExperience(e => [data, ...e]);
        toast.success("Experience added!");
      }
      onClose();
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={editItem ? "Edit Experience" : "Add Experience"} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Job Title *" value={form.title} onChange={set("title")} />
        <Field label="Company *" value={form.company} onChange={set("company")} />
        <Field label="Location" value={form.location} onChange={set("location")} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Start Date *" value={form.startDate} onChange={set("startDate")} type="date" />
          {!form.isCurrent && <Field label="End Date" value={form.endDate} onChange={set("endDate")} type="date" />}
        </div>
        <label className="flex items-center gap-2 text-[13px] text-gray-700 cursor-pointer">
          <input type="checkbox" checked={form.isCurrent} onChange={set("isCurrent")} className="rounded" />
          Currently working here
        </label>
      </div>
      <ModalFooter onSave={handleSave} onClose={onClose} saving={saving} />
    </Modal>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
        
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-300 transition-colors"
          >
            <X size={18}/>
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
function ModalFooter({ onSave, onClose, saving }) {
  return (
    <div className="flex gap-2 mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
      <button
        onClick={onSave}
        disabled={saving}
        className="btn-primary flex-1"
      >
        {saving ? "Saving..." : "Save"}
      </button>

      <button
        onClick={onClose}
        className="btn-secondary flex-1"
      >
        Cancel
      </button>
    </div>
  );
}
function Field({ label, value, onChange, type="text", placeholder="" }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}