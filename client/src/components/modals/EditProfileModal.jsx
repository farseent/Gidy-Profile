import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { updateProfile } from "../../services/api";
import toast from "react-hot-toast";

export default function EditProfileModal({ onClose }) {
  const { profile, setProfile, profileId } = useProfileContext();
  const [form, setForm] = useState({
    name: profile?.name || "",
    title: profile?.title || "",
    location: profile?.location || "",
    bio: profile?.bio || "",
    email: profile?.email || "",
    avatarUrl: profile?.avatarUrl || "",
    resumeUrl: profile?.resumeUrl || "",
  });
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updateProfile(profileId, form);
      setProfile(data);
      toast.success("Profile updated!");
      onClose();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="Full Name" value={form.name} onChange={set("name")} />
          <Field label="Title" value={form.title} onChange={set("title")} placeholder="e.g. Final-Year Student" />
          <Field label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Malappuram, Kerala" />
          <Field label="Email" value={form.email} onChange={set("email")} type="email" />
          <Field label="Avatar URL" value={form.avatarUrl} onChange={set("avatarUrl")} placeholder="https://..." />
          <Field label="Resume URL" value={form.resumeUrl} onChange={set("resumeUrl")} placeholder="https://..." />
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Bio</label>
            <textarea
              value={form.bio}
              onChange={set("bio")}
              rows={4}
              className="input-field resize-none"
              placeholder="Tell your story..."
            />
          </div>
        </div>
        <div className="flex gap-2 p-5 border-t border-gray-100">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="input-field" />
    </div>
  );
}