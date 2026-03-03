import { useState } from "react";
import { Sparkles } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { updateProfile } from "../../services/api";
import toast from "react-hot-toast";

export default function CareerGoals() {
  const { profile, setProfile, profileId } = useProfileContext();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(profile?.careerGoals || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data } = await updateProfile(profileId, { careerGoals: value });
      setProfile(data);
      toast.success("Career goals saved!");
      setEditing(false);
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (profile?.careerGoals && !editing) {
    return (
      <div className="card p-5 animate-slide-up shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="section-title">Career Goals</h2>
          <button onClick={() => { setValue(profile.careerGoals); setEditing(true); }}
            className="text-[12px] text-gray-400 hover:text-gray-600 border border-gray-200 px-2.5 py-1 rounded-lg transition-colors">
            Edit
          </button>
        </div>
        <p className="text-[14px] text-gray-600 leading-relaxed">{profile.careerGoals}</p>
      </div>
    );
  }

  return (
    <div className="card p-5 animate-slide-up">
      {editing ? (
        <div>
          <h2 className="section-title mb-3">Career Goals</h2>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            rows={3}
            placeholder="What are your career goals and what inspires you?"
            className="input-field resize-none mb-3"
          />
          <div className="flex gap-2">
            <button onClick={handleSave} disabled={saving} className="btn-primary">
              {saving ? "Saving..." : "Save"}
            </button>
            <button onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="section-title mb-1">Tell us where you want to go</h2>
            <p className="text-[13px] text-gray-500 max-w-sm">
              Add your career goals and what inspires you. This helps us tailor recommendations, learning paths, and opportunities just for you.
            </p>
          </div>
          <button
            onClick={() => setEditing(true)}
            className="flex-shrink-0 flex items-center gap-1.5 bg-gray-900 text-white text-[13px] font-medium px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
          >
            <Sparkles size={13} /> Add your career goals
          </button>
        </div>
      )}
    </div>
  );
}