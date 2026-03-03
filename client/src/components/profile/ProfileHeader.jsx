import { useState } from "react";
import { Mail, Download, MoreVertical, Sparkles } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { updateProfile, generateAIBio } from "../../services/api";
import toast from "react-hot-toast";
import EditProfileModal from "../modals/EditProfileModal";

export default function ProfileHeader() {
  const { profile, setProfile, profileId } = useProfileContext();
  const [editOpen, setEditOpen] = useState(false);
  const [genLoading, setGenLoading] = useState(false);

  if (!profile) return null;

  const handleGenerateBio = async () => {
    setGenLoading(true);
    try {
      const { data } = await generateAIBio(profileId);
      setProfile(p => ({ ...p, bio: data.aiBio }));
      toast.success("AI bio generated!");
    } catch {
      toast.error("Failed to generate bio");
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <>
      <div className="card p-6 animate-slide-up shadow-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {profile.name?.[0] || "?"}
                </div>
              )}
            </div>

            {/* Name / title / location */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-0.5">
                <h1 className="text-xl font-bold text-gray-900">{profile.name}</h1>
                {profile.title && (
                  <span className="text-sm text-gray-500 font-normal">( {profile.title} )</span>
                )}
              </div>
              {profile.location && (
                <p className="text-[13px] text-gray-500">{profile.location}</p>
              )}
            </div>
          </div>

          {/* Three-dot menu */}
          <button
            onClick={() => setEditOpen(true)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <MoreVertical size={18} />
          </button>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-[14px] text-gray-700 leading-relaxed">{profile.bio}</p>
        )}

        {/* Email + Resume row */}
        <div className="mt-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3 flex-wrap">
            {profile.email && (
              <a href={`mailto:${profile.email}`} className="flex items-center gap-1.5 text-[13px] text-sky-600 hover:underline">
                <Mail size={14} /> {profile.email}
              </a>
            )}
            {profile.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-[13px] border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                <Download size={13} /> Download Resume
              </a>
            )}
            {/* Innovation: AI Bio button */}
            <button
              onClick={handleGenerateBio}
              disabled={genLoading}
              className="flex items-center gap-1.5 text-[13px] border border-sky-200 bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-colors disabled:opacity-50"
            >
              <Sparkles size={13} className={genLoading ? "animate-spin" : ""} />
              {genLoading ? "Generating..." : "AI Bio"}
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-2.5 bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">🥉</span>
            </div>
            <div className="flex gap-6 text-center text-[12px]">
              <StatItem label="League"  value={profile.stats?.league  || "Bronze"} />
              <StatItem label="Rank"    value={profile.stats?.rank    ?? 28}       />
              <StatItem label="Points"  value={profile.stats?.points  ?? 110}      />
            </div>
          </div>
        </div>

        <div className="mt-3 text-right">
          <a href="#" className="text-[13px] text-amber-600 font-medium hover:underline">
            View My Rewards →
          </a>
        </div>
      </div>

      {editOpen && <EditProfileModal onClose={() => setEditOpen(false)} />}
    </>
  );
}

function StatItem({ label, value }) {
  return (
    <div>
      <p className="text-gray-400">{label}</p>
      <p className="font-semibold text-gray-800">{value}</p>
    </div>
  );
}