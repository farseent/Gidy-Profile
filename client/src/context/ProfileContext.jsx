import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getProfile } from "../services/api";
import toast from "react-hot-toast";

const ProfileContext = createContext(null);
// ensure we explicitly provide a valid profile id via env when running

const DEMO_PROFILE_ID = process.env.REACT_APP_PROFILE_ID;

export const ProfileProvider = ({ children }) => {
  const [profile, setProfile]       = useState(null);
  const [experience, setExperience] = useState([]);
  const [education, setEducation]   = useState([]);
  const [skills, setSkills]         = useState([]);
  const [certifications, setCerts]  = useState([]);
  const [loading, setLoading]       = useState(true);

  if (!DEMO_PROFILE_ID) {
    // fail fast during development rather than hitting the server with "demo"
    throw new Error(
      "PROFILE_ID environment variable must be set to a real profile MongoDB ObjectId"
    );
  }

  const [profileId] = useState(DEMO_PROFILE_ID);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await getProfile(profileId);
      setProfile(data.profile);
      setExperience(data.experience || []);
      setEducation(data.education || []);
      setSkills(data.skills || []);
      setCerts(data.certifications || []);
    } catch {
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  return (
    <ProfileContext.Provider value={{
      profile, setProfile,
      experience, setExperience,
      education, setEducation,
      skills, setSkills,
      certifications, setCerts,
      loading, profileId, fetchProfile,
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfileContext must be inside ProfileProvider");
  return ctx;
};