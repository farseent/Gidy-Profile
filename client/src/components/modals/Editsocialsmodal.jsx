import { useState } from "react";
import { X, Check, Trash2 } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import toast from "react-hot-toast";

export default function EditSocialsModal({ onClose }) {
  const { profile, setProfile } = useProfileContext();

  const [socials, setSocials] = useState(
    (profile.socials || []).map((s, i) => ({ ...s, id: i }))
  );

  const handleChange = (id, value) => {
    setSocials((prev) =>
      prev.map((s) => (s.id === id ? { ...s, link: value } : s))
    );
  };

  const handleConfirmOne = (id) => {
    const item = socials.find((s) => s.id === id);
    if (!item?.link.trim()) {
      toast.error("Link cannot be empty.");
      return;
    }

    setProfile((p) => ({
      ...p,
      socials: socials.map(({ id: _id, ...rest }) => rest),
    }));
    toast.success(`${item.platform} updated!`);
  };

  const handleDelete = (id) => {
    const updated = socials.filter((s) => s.id !== id);
    setSocials(updated);
    setProfile((p) => ({
      ...p,
      socials: updated.map(({ id: _id, ...rest }) => rest),
    }));
    toast.success("Social link removed.");
  };

  const handleDone = () => {
    setProfile((p) => ({
      ...p,
      socials: socials.map(({ id: _id, ...rest }) => rest),
    }));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Edit Socials</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Social rows */}
        <div className="flex flex-col gap-4 mb-6">
          {socials.length === 0 ? (
            <p className="text-[13px] text-gray-400 text-center py-4">
              No social links added yet.
            </p>
          ) : (
            socials.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                {/* Platform label */}
                <span className="text-[13px] font-medium text-gray-600 w-24 flex-shrink-0">
                  {s.platform} :
                </span>

                {/* Editable link */}
                <input
                  type="url"
                  value={s.link}
                  onChange={(e) => handleChange(s.id, e.target.value)}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
                />

                {/* Confirm (tick) */}
                <button
                  onClick={() => handleConfirmOne(s.id)}
                  className="p-1.5 rounded-lg text-green-500 hover:bg-green-50 transition-colors flex-shrink-0"
                  title="Save this link"
                >
                  <Check size={16} />
                </button>

                {/* Delete (bin) */}
                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors flex-shrink-0"
                  title="Remove this link"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-gray-500 hover:text-gray-700 transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleDone}
            className="px-5 py-2 text-[13px] font-medium bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}