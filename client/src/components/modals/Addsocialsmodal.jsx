import { useState } from "react";
import { X } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import toast from "react-hot-toast";

const SOCIAL_OPTIONS = [
  "GitHub",
  "LinkedIn",
  "Twitter",
  "Portfolio",
];

export default function AddSocialsModal({ onClose }) {
  const { profile, setProfile } = useProfileContext();
  const [platform, setPlatform] = useState("");
  const [link, setLink]         = useState("");
  const [loading, setLoading]   = useState(false);

  const handleAdd = async () => {
    if (!platform || !link.trim()) {
      toast.error("Please select a platform and enter a link.");
      return;
    }
    setLoading(true);
    try {
      const newSocial = { platform, link: link.trim() };
      setProfile((p) => ({
        ...p,
        socials: [...(p.socials || []), newSocial],
      }));
      toast.success(`${platform} added!`);
      onClose();
    } catch {
      toast.error("Failed to add social link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-slide-up">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">Add Socials</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Social Media Select */}
        <div className="mb-4">
          <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
            Social Media <span className="text-red-400">*</span>
          </label>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
          >
            <option value="" disabled>Select platform…</option>
            {SOCIAL_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        {/* Link Input */}
        <div className="mb-6">
          <label className="block text-[13px] font-medium text-gray-600 mb-1.5">
            Link <span className="text-red-400">*</span>
          </label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://"
            className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
          />
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
            onClick={handleAdd}
            disabled={loading}
            className="px-5 py-2 text-[13px] font-medium bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Adding…" : "ADD"}
          </button>
        </div>
      </div>
    </div>
  );
}