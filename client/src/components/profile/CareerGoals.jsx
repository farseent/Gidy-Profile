import { useState } from "react";
import { Sparkles, X } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { updateProfile } from "../../services/api";
import toast from "react-hot-toast";

/* ── Edit Modal ─────────────────────────────────────────────────── */
function CareerVisionModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState({
    vision:    initial?.vision    || "",
    growingAs: initial?.growingAs || "",
    growSpace: initial?.growSpace || "",
    inspiredBy: initial?.inspiredBy || "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 text-base">Career Vision</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <Field
            label="You're Career Vision"
            placeholder="e.g. AI / ML Architect"
            value={form.vision}
            onChange={set("vision")}
          />
          <Field
            label="What you're growing into right now"
            placeholder="e.g. Student"
            value={form.growingAs}
            onChange={set("growingAs")}
          />
          <Field
            label="The space you want to grow in"
            placeholder="e.g. AI / ML Engineering"
            value={form.growSpace}
            onChange={set("growSpace")}
          />
          <Field
            label="Inspired by"
            placeholder="e.g. everything"
            value={form.inspiredBy}
            onChange={set("inspiredBy")}
          />
        </div>

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

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">{label}</label>
      <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="input-field" />
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function CareerGoals() {
  const { profile, setProfile, profileId } = useProfileContext();
  const [modalOpen, setModalOpen] = useState(false);

  // careerGoals stored as JSON string in the DB
  const goals = (() => {
    try { return JSON.parse(profile?.careerGoals || "{}"); }
    catch { return {}; }
  })();

  const hasGoals = goals.vision || goals.growingAs || goals.growSpace || goals.inspiredBy;

  const handleSave = async (form) => {
    try {
      const { data } = await updateProfile(profileId, { careerGoals: JSON.stringify(form) });
      setProfile(data);
      toast.success("Career vision saved!");
      setModalOpen(false);
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <>
      {hasGoals ? (
        /* ── Filled card ── */
        <div className="card p-5 animate-slide-up shadow-xl">
          {/* Top section */}
          <div className="flex items-start justify-between pb-4 border-b border-gray-100">
            <div>
              <p className="text-[12px] text-gray-400 mb-0.5">You're Career Vision</p>
              <h2 className="text-lg font-bold text-gray-900">{goals.vision || "—"}</h2>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="w-9 h-9 rounded-full bg-amber-50 flex items-center justify-center hover:bg-amber-100 transition-colors flex-shrink-0"
            >
              <Sparkles size={16} className="text-amber-400" />
            </button>
          </div>

          {/* Bottom three columns */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            <div>
              <p className="text-[12px] text-gray-400 mb-0.5">What you're growing into right now</p>
              <p className="text-[14px] font-semibold text-gray-800">{goals.growingAs || "—"}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 mb-0.5">The space you want to grow in</p>
              <p className="text-[14px] font-semibold text-gray-800">{goals.growSpace || "—"}</p>
            </div>
            <div>
              <p className="text-[12px] text-gray-400 mb-0.5">Inspired by</p>
              <p className="text-[14px] font-semibold text-gray-800">{goals.inspiredBy || "—"}</p>
            </div>
          </div>
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="card p-5 animate-slide-up">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="section-title mb-1">Tell us where you want to go</h2>
              <p className="text-[13px] text-gray-500 max-w-sm">
                Add your career vision and what inspires you. This helps us tailor recommendations, learning paths, and opportunities just for you.
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="flex-shrink-0 flex items-center gap-1.5 bg-gray-900 text-white text-[13px] font-medium px-4 py-2.5 rounded-xl hover:bg-gray-800 transition-colors"
            >
              <Sparkles size={13} /> Add your career goals
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <CareerVisionModal
          initial={goals}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  );
}