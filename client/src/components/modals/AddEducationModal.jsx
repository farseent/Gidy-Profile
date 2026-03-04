import { useState } from "react";
import { X } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { addEducation, updateEducation } from "../../services/api";
import toast from "react-hot-toast";

export default function AddEducationModal({ editItem, onClose }) {
  const { setEducation, profileId } = useProfileContext();
  const [form, setForm] = useState({
    college:     editItem?.college     || "",
    degree:      editItem?.degree      || "",
    fieldOfStudy: editItem?.fieldOfStudy || "",
    location:    editItem?.location    || "",
    startDate:   editItem?.startDate?.substring(0, 10) || "",
    isCurrent:   editItem?.isCurrent   || false,
    endDate:     editItem?.endDate?.substring(0, 10)   || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) =>
    setForm(f => ({ ...f, [k]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const handleSave = async () => {
    if (!form.college || !form.degree || !form.fieldOfStudy || !form.location || !form.startDate)
      return toast.error("Please fill all required fields");
    if (!form.isCurrent && !form.endDate)
      return toast.error("Please enter a date of completion or check 'Currently studying here'");

    setSaving(true);
    try {
      const payload = { ...form, endDate: form.isCurrent ? null : form.endDate };
      if (editItem) {
        const { data } = await updateEducation(profileId, editItem._id, payload);
        setEducation(e => e.map(x => x._id === editItem._id ? data : x));
        toast.success("Education updated!");
      } else {
        const { data } = await addEducation(profileId, payload);
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
    <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-base">
            {editItem ? "Edit Education" : "Add Education"}
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 dark:text-gray-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 space-y-4">
          <F label="College"       required value={form.college}      onChange={set("college")}      placeholder="e.g. IET Thrissur" />
          <F label="Degree"        required value={form.degree}       onChange={set("degree")}       placeholder="e.g. B.Tech" />
          <F label="Field of Study" required value={form.fieldOfStudy} onChange={set("fieldOfStudy")} placeholder="e.g. Information Technology" />
          <F label="Location"      required value={form.location}     onChange={set("location")}     placeholder="e.g. Thrissur, Kerala" />
          <F label="Date of Joining" required value={form.startDate}  onChange={set("startDate")}    type="date" />

          {/* Checkbox */}
          <label className="flex items-center gap-2.5 text-[13px] text-gray-700 dark:text-gray-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isCurrent}
              onChange={set("isCurrent")}
              className="w-4 h-4 rounded accent-blue-500"
            />
            Currently studying here / not completed
          </label>

          {/* Date of completion — hidden when currently studying */}
          {!form.isCurrent && (
            <F label="Date of Completion" required value={form.endDate} onChange={set("endDate")} type="date" />
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>

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
      <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
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