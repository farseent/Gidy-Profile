import { useState } from "react";
import { Plus, MoreVertical, Briefcase } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { deleteExperience } from "../../services/api";
import toast from "react-hot-toast";
import AddExperienceModal from "../modals/AddExperienceModal";

function formatDate(date) {
  if (!date) return "Present";
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function ExperienceSection() {
  const { experience, setExperience, profileId } = useProfileContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteExperience(profileId, id);
      setExperience(e => e.filter(x => x._id !== id));
      toast.success("Experience removed");
    } catch {
      toast.error("Failed to remove");
    }
    setMenuOpen(null);
  };

  return (
    <div className="card p-5 animate-slide-up shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Experience</h2>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Plus size={14} className="text-gray-500" />
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((exp) => (
          <div key={exp._id} className="flex items-start gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              {exp.logoUrl
                ? <img src={exp.logoUrl} alt="" className="w-7 h-7 object-contain" />
                : <Briefcase size={16} className="text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-gray-800">{exp.title}</p>
              <p className="text-[13px] text-gray-500">{exp.company}{exp.location ? `, ${exp.location}` : ""}</p>
              <p className="text-[12px] text-gray-400 mt-0.5">
                Started: {formatDate(exp.startDate)} – Ended: {formatDate(exp.endDate)}
              </p>
              {exp.description && <p className="text-[13px] text-gray-600 mt-1">{exp.description}</p>}
            </div>
            <div className="relative">
              <button onClick={() => setMenuOpen(menuOpen === exp._id ? null : exp._id)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical size={15} />
              </button>
              {menuOpen === exp._id && (
                <div className="absolute right-0 top-8 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-10 animate-fade-in">
                  <button onClick={() => { setEditItem(exp); setModalOpen(true); setMenuOpen(null); }}
                    className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50">Edit</button>
                  <button onClick={() => handleDelete(exp._id)}
                    className="w-full text-left px-3 py-1.5 text-[13px] text-red-500 hover:bg-red-50">Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {experience.length === 0 && (
          <p className="text-[13px] text-gray-400">No experience added yet.</p>
        )}
      </div>

      {modalOpen && (
        <AddExperienceModal
          editItem={editItem}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}