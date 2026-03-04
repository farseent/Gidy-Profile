import Navbar from "../components/layout/Navbar";
import ProfileHeader from "../components/profile/ProfileHeader";
import CareerGoals from "../components/profile/CareerGoals";
import ProfileCompletion from "../components/profile/ProfileCompletion";
import SkillsSection from "../components/profile/SkillsSection";
import ExperienceSection from "../components/profile/ExperienceSection";
import EducationSection from "../components/profile/EducationSection";
import CertificationSection from "../components/profile/CertificationSection";
import { useProfileContext } from "../context/ProfileContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

export default function ProfilePage() {
  const { loading } = useProfileContext();

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900">
      <Navbar />
      <main className="max-w-[1210px] mx-auto px-4 py-6 space-y-4">
        {/* Hero card */}
        <ProfileHeader />

        {/* Career Goals */}
        <CareerGoals />

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-4">
            <ProfileCompletion />
            <SkillsSection />
          </div>

          {/* Right column */}
          <div className="lg:col-span-3 space-y-4">
            <ExperienceSection />
            <EducationSection />
            <CertificationSection />
          </div>
        </div>
      </main>
    </div>
  );
}