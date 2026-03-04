import { useState } from "react";
import { Plus, X, ThumbsUp } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { addSkill, deleteSkill, endorseSkill } from "../../services/api";
import toast from "react-hot-toast";

export default function SkillsSection() {
  const { skills, setSkills, profileId } = useProfileContext();
  const [adding, setAdding] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [endorseModal, setEndorseModal] = useState(null); // skillId

  const handleAdd = async () => {
    if (!newSkill.trim()) return;
    try {
      const { data } = await addSkill(profileId, { name: newSkill.trim() });
      setSkills(s => [...s, data]);
      setNewSkill("");
      setAdding(false);
      toast.success("Skill added!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add skill");
    }
  };

  const handleDelete = async (skillId) => {
    try {
      await deleteSkill(profileId, skillId);
      setSkills(s => s.filter(sk => sk._id !== skillId));
      toast.success("Skill removed");
    } catch {
      toast.error("Failed to remove skill");
    }
  };

  const handleEndorse = async (skillId, endorsedBy) => {
    try {
      const { data } = await endorseSkill(profileId, skillId, { endorsedBy });
      setSkills(s => s.map(sk => sk._id === skillId ? data : sk));
      setEndorseModal(null);
      toast.success("Endorsed!");
    } catch {
      toast.error("Failed to endorse");
    }
  };

  return (
    <div className="card p-5 animate-slide-up shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Skills</h2>
        <button onClick={() => setAdding(p => !p)}
          className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Plus size={14} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {adding && (
        <div className="mb-4 flex gap-2">
          <input
            value={newSkill}
            onChange={e => setNewSkill(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="e.g. React"
            className="input-field flex-1"
            autoFocus
          />
          <button onClick={handleAdd} className="btn-primary px-3">Add</button>
          <button onClick={() => setAdding(false)} className="btn-secondary px-3">Cancel</button>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {skills.map((sk) => (
          <div key={sk._id} className="group relative flex items-center gap-1.5 badge">
            <span>{sk.name}</span>
            {/* Endorsement count badge */}
            {sk.endorsementCount > 0 && (
              <span className="ml-1 bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                +{sk.endorsementCount}
              </span>
            )}
            {/* Actions on hover */}
            <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
              <button
                onClick={() => setEndorseModal(sk._id)}
                title="Endorse"
                className="p-0.5 rounded hover:text-sky-500 transition-colors"
              >
                <ThumbsUp size={11} />
              </button>
              <button
                onClick={() => handleDelete(sk._id)}
                title="Remove"
                className="p-0.5 rounded hover:text-red-500 transition-colors"
              >
                <X size={11} />
              </button>
            </div>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="text-[13px] text-gray-400 dark:text-gray-500">No skills added yet. Click + to add your first skill.</p>
        )}
      </div>

      {/* Endorse modal */}
      {endorseModal && (
        <EndorseDialog
          skill={skills.find(s => s._id === endorseModal)}
          onEndorse={(name) => handleEndorse(endorseModal, name)}
          onClose={() => setEndorseModal(null)}
        />
      )}
    </div>
  );
}

function EndorseDialog({ skill, onEndorse, onClose }) {
  const [name, setName] = useState("");
  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-sm animate-slide-up">
        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Endorse "{skill?.name}"</h3>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mb-4">Add your name to endorse this skill</p>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === "Enter" && name.trim() && onEndorse(name.trim())}
          placeholder="Your name"
          className="input-field mb-4"
          autoFocus
        />
        <div className="flex gap-2">
          <button onClick={() => name.trim() && onEndorse(name.trim())} className="btn-primary flex-1">Endorse</button>
          <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
        </div>
      </div>
    </div>
  );
}