import { useState, useRef, useEffect } from "react";
import {
  Mail, Download, MoreVertical, Sparkles,
  UserPen, Share2, Link2, Lightbulb, Settings,
} from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { generateAIBio } from "../../services/api";
import toast from "react-hot-toast";
import EditProfileModal from "../modals/EditProfileModal";

const MENU_ITEMS = [
  { icon: UserPen,   label: "Edit Profile",   key: "edit"    },
  { icon: Share2,    label: "Share Profile",  key: "share"   },
  { icon: Link2,     label: "Add Socials",    key: "socials" },
  { icon: Lightbulb, label: "Career Vision",  key: "career"  },
  { icon: Settings,  label: "Settings",       key: "settings"},
];

export default function ProfileHeader() {
  const { profile, setProfile, profileId } = useProfileContext();
  const [editOpen,    setEditOpen]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [genLoading,  setGenLoading]  = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!profile) return null;

  const resolveUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    // if the API_URL ends in "/api", leave it off when building an arbitrary
    // asset path; otherwise you end up requesting /api/uploads/… which our
    // server doesn’t serve (we expose uploads at the root).  we also support
    // the server providing full URLs so this function is safe to call on
    // whatever comes back from the backend.
    let base = process.env.REACT_APP_API_URL || "";
    base = base.replace(/\/+$/g, "");
    base = base.replace(/\/api$/i, "");
    return base + url;
  };

  const handleMenuClick = (key) => {
    setMenuOpen(false);
    if (key === "edit") setEditOpen(true);
    // other keys: wire up your own handlers here
  };

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

  const fullName = profile.firstName && profile.lastName
    ? `${profile.firstName} ${profile.lastName}`
    : profile.name || "—";

  return (
    <>
      <div className="card p-6 animate-slide-up shadow-xl">

        {/* Top row: avatar + name + three-dot */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile.avatarUrl ? (
                <img src={resolveUrl(profile.avatarUrl)} alt={fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-300 to-orange-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                  {fullName?.[0] || "?"}
                </div>
              )}
            </div>

            {/* Name / title / location */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center flex-wrap gap-2 mb-0.5">
                <h1 className="text-xl font-bold text-gray-900">{fullName}</h1>
                {profile.title && (
                  <span className="text-sm text-gray-500 font-normal">( {profile.title} )</span>
                )}
              </div>
              {profile.location && (
                <p className="text-[13px] text-gray-500">{profile.location}</p>
              )}
            </div>
          </div>

          {/* Three-dot + dropdown */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600"
            >
              <MoreVertical size={18} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-8 z-50 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1 animate-slide-up">
                {MENU_ITEMS.map(({ icon: Icon, label, key }) => (
                  <button
                    key={key}
                    onClick={() => handleMenuClick(key)}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-[13px] text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Icon size={14} className="text-gray-400" />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-[14px] text-gray-700 leading-relaxed">{profile.bio}</p>
        )}

        {/* Email + Resume — stacked vertically, then stats on the right */}
        <div className="mt-4 flex items-end justify-between flex-wrap gap-4">

          {/* Left: email, resume, AI bio */}
          <div className="flex flex-col gap-2">
            {profile.email && (
              <a href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 text-[13px] text-sky-600 hover:underline w-fit">
                <Mail size={14} /> {profile.email}
              </a>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              {profile.resumeUrl && (
                <a
                  href={resolveUrl(profile.resumeUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="flex items-center gap-1.5 text-[13px] border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Download size={13} /> Download Resume
                </a>
              )}
              <button
                onClick={handleGenerateBio}
                disabled={genLoading}
                className="flex items-center gap-1.5 text-[13px] border border-sky-200 bg-sky-50 text-sky-600 px-3 py-1.5 rounded-lg hover:bg-sky-100 transition-colors disabled:opacity-50"
              >
                <Sparkles size={13} className={genLoading ? "animate-spin" : ""} />
                {genLoading ? "Generating..." : "AI Bio"}
              </button>
            </div>
          </div>

          {/* Right: stats */}
          <div className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-2.5 bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">🥉</span>
            </div>
            <div className="flex gap-6 text-center text-[12px]">
              <StatItem label="League" value={profile.stats?.league  || "Bronze"} />
              <StatItem label="Rank"   value={profile.stats?.rank    ?? 28}       />
              <StatItem label="Points" value={profile.stats?.points  ?? 110}      />
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