import { useState, useRef, useEffect } from "react";
import {
  Mail, Download, MoreVertical, Sparkles,
  UserPen, Share2, Link2, Lightbulb, Settings, Github, Twitter, Linkedin, Globe,
  Check, Trash2, X, Plus,
} from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";
import { generateAIBio, updateSocialLinksAPI } from "../../services/api";
import toast from "react-hot-toast";
import EditProfileModal from "../modals/EditProfileModal";
import CareerVisionModal from "../modals/CareerVisionModal";

const SOCIAL_PLATFORMS = [
  { value: "github",   label: "GitHub",    icon: Github   },
  { value: "linkedin", label: "LinkedIn",  icon: Linkedin },
  { value: "twitter",  label: "Twitter",   icon: Twitter  },
  { value: "website",  label: "Website",   icon: Globe    },
];

const getPlatformIcon = (key) => {
  const found = SOCIAL_PLATFORMS.find((p) => p.value === key);
  return found ? found.icon : Globe;
};

const socialLinksToArray = (socialLinks = {}) =>
  SOCIAL_PLATFORMS
    .filter((p) => socialLinks[p.value]?.trim())
    .map((p) => ({ platform: p.value, link: socialLinks[p.value].trim() }));

function AddSocialsModal({ socialLinks = {}, onClose, onSave }) {
  const [platform, setPlatform] = useState("");
  const [link, setLink]         = useState("");
  const [loading, setLoading]   = useState(false);

  const handleAdd = async () => {
    if (!platform || !link.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await onSave({ [platform]: link.trim() });
      toast.success("Social link added!");
      onClose();
    } catch {
      toast.error("Failed to add social link");
    } finally {
      setLoading(false);
    }
  };

  const available = SOCIAL_PLATFORMS.filter((p) => !socialLinks[p.value]?.trim());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Add Social</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        {available.length === 0 ? (
          <p className="text-[13px] text-gray-500 text-center py-4">
            All social platforms are already added.
          </p>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Platform <span className="text-red-400">*</span>
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-all appearance-none cursor-pointer"
              >
                <option value="" disabled>Select platform…</option>
                {available.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Link <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-[13px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-all"
              />
            </div>
          </>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            CANCEL
          </button>
          {available.length > 0 && (
            <button
              onClick={handleAdd}
              disabled={loading}
              className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-[13px] font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Adding…" : "ADD"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function EditSocialsModal({ socialLinks = {}, onClose, onSave }) {
  const initial = SOCIAL_PLATFORMS
    .filter((p) => socialLinks[p.value]?.trim())
    .map((p) => ({ platform: p.value, draft: socialLinks[p.value] }));

  const [items, setItems]   = useState(initial);
  const [saving, setSaving] = useState(null);

  const handleConfirm = async (idx) => {
    const item = items[idx];
    if (!item.draft.trim()) {
      toast.error("Link cannot be empty — use delete to remove");
      return;
    }
    setSaving(item.platform);
    try {
      await onSave({ [item.platform]: item.draft.trim() });
      toast.success("Social link updated!");
    } catch {
      toast.error("Failed to update");
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (idx) => {
    const item = items[idx];
    try {
      await onSave({ [item.platform]: "" });
      setItems((prev) => prev.filter((_, i) => i !== idx));
      toast.success("Social link removed!");
    } catch {
      toast.error("Failed to remove");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Edit Socials</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3 mb-6">
          {items.length === 0 && (
            <p className="text-[13px] text-gray-400 text-center py-4">
              No social links added yet.
            </p>
          )}
          {items.map((item, idx) => {
            const Icon  = getPlatformIcon(item.platform);
            const label = SOCIAL_PLATFORMS.find((p) => p.value === item.platform)?.label || item.platform;

            return (
              <div key={item.platform} className="flex items-center gap-2">
                <span className="text-[13px] text-gray-600 font-medium w-20 flex-shrink-0 flex items-center gap-1.5">
                  <Icon size={13} className="text-gray-400" />
                  {label}:
                </span>
                <input
                  type="url"
                  value={item.draft}
                  onChange={(e) =>
                    setItems((prev) =>
                      prev.map((it, i) =>
                        i === idx ? { ...it, draft: e.target.value } : it
                      )
                    )
                  }
                  className="flex-1 border border-gray-200 rounded-lg px-2.5 py-1.5 text-[12px] text-gray-700 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-300 transition-all"
                />
                <button
                  onClick={() => handleConfirm(idx)}
                  disabled={saving === item.platform}
                  className="p-1 text-green-500 hover:text-green-600 transition-colors disabled:opacity-40"
                  title="Save"
                >
                  <Check size={15} />
                </button>
                <button
                  onClick={() => handleDelete(idx)}
                  className="p-1 text-red-400 hover:text-red-500 transition-colors"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-[13px] text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white text-[13px] font-semibold rounded-xl transition-colors"
          >
            DONE
          </button>
        </div>
      </div>
    </div>
  );
}

const MENU_ITEMS = [
  { icon: UserPen,   label: "Edit Profile",  key: "edit"        },
  { icon: Share2,    label: "Share Profile", key: "share"       },
  { icon: Plus,      label: "Add Socials",   key: "socials"     },
  { icon: Link2,     label: "Edit Socials",  key: "editSocials" },
  { icon: Lightbulb, label: "Career Vision", key: "career"      },
  { icon: Settings,  label: "Settings",      key: "settings"    },
];

export default function ProfileHeader() {
  const { profile, setProfile, profileId } = useProfileContext();

  const [editOpen,       setEditOpen]       = useState(false);
  const [addSocialOpen,  setAddSocialOpen]  = useState(false);
  const [editSocialOpen, setEditSocialOpen] = useState(false);
  const [careerOpen,     setCareerOpen]     = useState(false);
  const [menuOpen,       setMenuOpen]       = useState(false);
  const [genLoading,     setGenLoading]     = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!profile) return null;

  const resolveUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http")) return url;
    let base = process.env.REACT_APP_API_URL || "";
    base = base.replace(/\/+$/g, "").replace(/\/api$/i, "");
    return base + url;
  };

  const handleMenuClick = (key) => {
    setMenuOpen(false);
    if (key === "edit")        { setEditOpen(true);       return; }
    if (key === "share")       { handleShareProfile();    return; }
    if (key === "socials")     { setAddSocialOpen(true);  return; }
    if (key === "editSocials") { setEditSocialOpen(true); return; }
    if (key === "career")      { setCareerOpen(true);     return; }
  };

  const handleShareProfile = () => {
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(url)
        .then(() => toast.success("Profile URL copied to clipboard!"))
        .catch(() => fallbackCopy(url));
    } else {
      fallbackCopy(url);
    }
  };

  const fallbackCopy = (text) => {
    const el = document.createElement("input");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    toast.success("Profile URL copied!");
  };

  const handleSaveSocialLinks = async (patch) => {
    const { data } = await updateSocialLinksAPI(profileId, patch);
    setProfile((p) => ({ ...p, socialLinks: data.socialLinks }));
  };

  const handleGenerateBio = async () => {
    setGenLoading(true);
    try {
      const { data } = await generateAIBio(profileId);
      setProfile((p) => ({ ...p, bio: data.aiBio }));
      toast.success("AI bio generated!");
    } catch {
      toast.error("Failed to generate bio");
    } finally {
      setGenLoading(false);
    }
  };

  const fullName =
    profile.firstName && profile.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : profile.name || "—";

  const activeSocials = socialLinksToArray(profile.socialLinks);

  return (
    <>
      <div className="card p-6 animate-slide-up shadow-xl">

        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">

            {/* Avatar */}
            <div className="relative flex-shrink-0">
              {profile.avatarUrl ? (
                <img
                  src={resolveUrl(profile.avatarUrl)}
                  alt={fullName}
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                />
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
                  <span className="text-sm text-gray-500 font-normal">
                    ( {profile.title} )
                  </span>
                )}
              </div>
              {profile.location && (
                <p className="text-[13px] text-gray-500">{profile.location}</p>
              )}
            </div>
          </div>

          {/* Social icons + three-dot — mirrors the screenshot layout */}
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {activeSocials.map(({ platform, link }) => {
              const Icon  = getPlatformIcon(platform);
              const label = SOCIAL_PLATFORMS.find((p) => p.value === platform)?.label || platform;
              return (
                <a
                  key={platform}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-800"
                >
                  <Icon size={17} />
                </a>
              );
            })}

            {/* Three-dot menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((o) => !o)}
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
        </div>

        {/* Bio */}
        {profile.bio && (
          <p className="mt-4 text-[14px] text-gray-700 leading-relaxed">
            {profile.bio}
          </p>
        )}

        {/* Email + Resume + Stats */}
        <div className="mt-4 flex items-end justify-between flex-wrap gap-4">
          <div className="flex flex-col gap-2">
            {profile.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-1.5 text-[13px] text-sky-600 hover:underline w-fit"
              >
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

          {/* Stats */}
          <div className="flex items-center gap-3 border border-gray-100 rounded-xl px-4 py-2.5 bg-gray-50">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">🥉</span>
            </div>
            <div className="flex gap-6 text-center text-[12px]">
              <StatItem label="League" value={profile.stats?.league || "Bronze"} />
              <StatItem label="Rank"   value={profile.stats?.rank   ?? 0}        />
              <StatItem label="Points" value={profile.stats?.points ?? 0}        />
            </div>
          </div>
        </div>

        <div className="mt-3 text-right">
          <a href="#" className="text-[13px] text-amber-600 font-medium hover:underline">
            View My Rewards →
          </a>
        </div>
      </div>

      {editOpen && (
        <EditProfileModal onClose={() => setEditOpen(false)} />
      )}

      {addSocialOpen && (
        <AddSocialsModal
          socialLinks={profile.socialLinks || {}}
          onClose={() => setAddSocialOpen(false)}
          onSave={handleSaveSocialLinks}
        />
      )}

      {editSocialOpen && (
        <EditSocialsModal
          socialLinks={profile.socialLinks || {}}
          onClose={() => setEditSocialOpen(false)}
          onSave={handleSaveSocialLinks}
        />
      )}

      {careerOpen && (
        <CareerVisionModal onClose={() => setCareerOpen(false)} />
      )}
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