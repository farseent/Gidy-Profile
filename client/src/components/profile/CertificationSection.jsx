import { useState } from "react";
import { Plus, MoreVertical, Award, ExternalLink } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { deleteCertification } from "../../services/api";
import toast from "react-hot-toast";
import AddCertificationModal from "../modals/Addcertificationmodal ";

function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default function CertificationSection() {
  const { certifications, setCerts, profileId } = useProfileContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteCertification(profileId, id);
      setCerts(c => c.filter(x => x._id !== id));
      toast.success("Certification removed");
    } catch {
      toast.error("Failed to remove");
    }
    setMenuOpen(null);
  };

  return (
    <div className="card p-5 animate-slide-up shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Certification</h2>
        <button onClick={() => { setEditItem(null); setModalOpen(true); }}
          className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <Plus size={14} className="text-gray-500" />
        </button>
      </div>
      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert._id} className="flex items-start gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              {cert.logoUrl
                ? <img src={cert.logoUrl} alt="" className="w-7 h-7 object-contain" />
                : <Award size={16} className="text-gray-400" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-semibold text-gray-800">{cert.title}</p>
              <p className="text-[13px] text-gray-500">{cert.issuer}</p>
              {cert.certificateUrl && (
                <a href={cert.certificateUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[12px] text-sky-500 hover:underline mt-0.5">
                  Certificate Link <ExternalLink size={10} />
                </a>
              )}
              {cert.issuedDate && (
                <p className="text-[12px] text-gray-400 mt-0.5">Provided on: {formatDate(cert.issuedDate)}</p>
              )}
            </div>
            <div className="relative">
              <button onClick={() => setMenuOpen(menuOpen === cert._id ? null : cert._id)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-300 hover:text-gray-500 transition-colors opacity-0 group-hover:opacity-100">
                <MoreVertical size={15} />
              </button>
              {menuOpen === cert._id && (
                <div className="absolute right-0 top-8 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-10">
                  <button onClick={() => { setEditItem(cert); setModalOpen(true); setMenuOpen(null); }}
                    className="w-full text-left px-3 py-1.5 text-[13px] text-gray-700 hover:bg-gray-50">Edit</button>
                  <button onClick={() => handleDelete(cert._id)}
                    className="w-full text-left px-3 py-1.5 text-[13px] text-red-500 hover:bg-red-50">Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
        {certifications.length === 0 && (
          <p className="text-[13px] text-gray-400">No certifications added yet.</p>
        )}
      </div>
      {modalOpen && (
        <AddCertificationModal editItem={editItem} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}