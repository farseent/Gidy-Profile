import { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { updateProfile } from "../../services/api";
import toast from "react-hot-toast";

const MAX_BIO = 500;

export default function EditProfileModal({ onClose }) {
  const { profile, setProfile, profileId } = useProfileContext();
  const avatarInputRef = useRef(null);
  const resumeInputRef = useRef(null);

  const [form, setForm] = useState({
    firstName: profile?.firstName || "",
    lastName:  profile?.lastName  || "",
    location:  profile?.location  || "",
    bio:       profile?.bio       || "",
  });

  const [avatarFile,  setAvatarFile]  = useState(null);
  const resolveUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    const base = process.env.REACT_APP_API_URL?.replace(/\/+$/g, "") || "";
    return base + url;
  };
  const [avatarPreview, setAvatarPreview] = useState(resolveUrl(profile?.avatarUrl || ""));
  const [resumeFile,  setResumeFile]  = useState(null);
  const [saving, setSaving] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleResumeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setResumeFile(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("firstName", form.firstName);
      fd.append("lastName",  form.lastName);
      fd.append("location",  form.location);
      fd.append("bio",       form.bio);
      if (avatarFile) fd.append("avatar",  avatarFile);
      if (resumeFile) fd.append("resume",  resumeFile);

      const { data } = await updateProfile(profileId, fd);
      setProfile(data);
      toast.success("Profile updated!");
      onClose();
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const bioLen = form.bio.length;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md animate-slide-up max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-base">Edit Profile</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="relative">
              <div
                className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden border-2 border-gray-200 cursor-pointer"
                onClick={() => avatarInputRef.current?.click()}
              >
                {avatarPreview
                  ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-gray-300 text-4xl select-none">👤</div>
                }
              </div>
              {/* pencil badge */}
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow text-white hover:bg-blue-600 transition-colors"
              >
                <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10z"/>
                </svg>
              </button>
              <input ref={avatarInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
          </div>

          {/* First Name */}
          <Field label="First Name" required value={form.firstName} onChange={set("firstName")} placeholder="First name" />

          {/* Last Name */}
          <Field label="Last Name" required value={form.lastName} onChange={set("lastName")} placeholder="Last name" />

          {/* Email — read only */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Email ID <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={profile?.email || ""}
              readOnly
              className="input-field bg-gray-50 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* Location */}
          <Field label="Location" value={form.location} onChange={set("location")} placeholder="e.g. Malappuram, Kerala" />

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-[13px] font-medium text-gray-700">Bio</label>
              <span className="text-[12px] text-gray-400">max character ({MAX_BIO} - {bioLen})</span>
            </div>
            <textarea
              value={form.bio}
              onChange={(e) => {
                if (e.target.value.length <= MAX_BIO) set("bio")(e);
              }}
              rows={4}
              className="input-field resize-none"
              placeholder="Tell your story..."
            />
          </div>

          {/* Resume Upload */}
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Resume</label>
            <div
              onClick={() => resumeInputRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
            >
              <Upload size={28} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                {resumeFile ? resumeFile.name : "Upload Resume"}
              </span>
              {resumeFile && (
                <span className="text-xs text-green-500">File selected ✓</span>
              )}
            </div>
            <input ref={resumeInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeChange} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1">
            {saving ? "Saving..." : "Update"}
          </button>
        </div>

      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", required }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} className="input-field" />
    </div>
  );
}