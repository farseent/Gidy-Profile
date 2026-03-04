import { useState } from "react";
import { Plus, MoreVertical, GraduationCap } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { deleteEducation } from "../../services/api";
import toast from "react-hot-toast";
import AddEducationModal from "../modals/AddEducationModal";

function formatDate(date) {
  if (!date) return "Present";
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function EducationSection() {
  const { education, setEducation, profileId } = useProfileContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteEducation(profileId, id);
      setEducation(e => e.filter(x => x._id !== id));
      toast.success("Education removed");
    } catch {
      toast.error("Failed to remove");
    }
    setMenuOpen(null);
  };

  return (
    <div className="card p-5 animate-slide-up shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Education</h2>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="w-7 h-7 rounded-full border border-gray-200 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
          <Plus size={14} className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <div className="space-y-4">
        {education.map((edu) => (
          <div key={edu._id} className="flex items-start gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0 mt-0.5">
              {edu.logoUrl
                ? <img src={edu.logoUrl} alt="" className="w-7 h-7 object-contain" />
                : <GraduationCap size={16} className="text-gray-400 dark:text-gray-500" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-gray-800 dark:text-gray-100">{edu.degree} - {edu.fieldOfStudy}</p>
              <p className="text-[13px] text-gray-500 dark:text-gray-400">{edu.college}{edu.location ? `, ${edu.location}` : ""}</p>
              <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-0.5">
                {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
              </p>
            </div>
            <div className="relative">
              <button onClick={() => setMenuOpen(menuOpen === edu._id ? null : edu._id)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-300 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical size={15} />
              </button>
              {menuOpen === edu._id && (
                <div className="absolute right-0 top-8 w-32 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-lg py-1 z-10 animate-fade-in">
                  <button onClick={() => { setEditItem(edu); setModalOpen(true); setMenuOpen(null); }}
                    className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">Edit</button>
                  <button onClick={() => handleDelete(edu._id)}
                    className="w-full text-left px-3 py-1.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {education.length === 0 && (
          <p className="text-[13px] text-gray-400 dark:text-gray-500">No education added yet.</p>
        )}
      </div>

      {modalOpen && (
        <AddEducationModal editItem={editItem} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}