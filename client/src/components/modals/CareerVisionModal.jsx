import { useState } from "react";
import { X } from "lucide-react";

function Field({ label, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  );
}

export default function CareerVisionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    describedAs:  initial?.describedAs  || "",
    vision:       initial?.vision       || "",
    growSpace:    initial?.growSpace    || "",
    inspiredBy:   initial?.inspiredBy   || "",
    aimingFor:    initial?.aimingFor    || "",
  });

  const [saving, setSaving] = useState(false);

  const set = (k) => (e) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 dark:bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="font-semibold text-gray-900 dark:text-white text-base">
            Career Vision
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Fields */}
        <div className="px-6 py-5 space-y-4">
          <Field
            label="What Best Describes You?"
            placeholder="e.g. Final-Year Student"
            value={form.describedAs}
            onChange={set("describedAs")}
            required
          />

          <Field
            label="What Is Your Long-Term Career Aspiration?"
            placeholder="e.g. AI / ML Architect"
            value={form.vision}
            onChange={set("vision")}
            required
          />

          <Field
            label="Aspirational Field"
            placeholder="e.g. AI / ML Engineering"
            value={form.growSpace}
            onChange={set("growSpace")}
            required
          />

          <Field
            label="Who Is Your Inspiration?"
            placeholder="e.g. Steve Jobs"
            value={form.inspiredBy}
            onChange={set("inspiredBy")}
            required
          />

          <Field
            label="What Are You Aiming For Right Now?"
            placeholder="e.g. Entry Level Professional"
            value={form.aimingFor}
            onChange={set("aimingFor")}
            required
          />
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={onClose}
            className="btn-secondary flex-1"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary flex-1"
          >
            {saving ? "Saving..." : "Update"}
          </button>
        </div>
      </div>
    </div>
  );
}