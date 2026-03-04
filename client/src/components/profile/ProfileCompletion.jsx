import { CheckCircle2, GraduationCap } from "lucide-react";
import { useProfileContext } from "../../context/ProfileContext";

export default function ProfileCompletion() {
  const { profile } = useProfileContext();
  const pct = profile?.profileCompletionPercent ?? 0;
  const done = pct >= 100;

  return (
    <div className="card p-4 animate-slide-up shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
            <GraduationCap size={18} className="text-gray-600 dark:text-gray-300" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-gray-800 dark:text-gray-100">Profile Completed</p>
            <p className="text-[12px] text-gray-500 dark:text-gray-400">
              {done ? "Mission complete! Profile at 100% and you're good to go!" : `${pct}% complete – keep going!`}
            </p>
          </div>
        </div>
        {done ? (
          <CheckCircle2 size={22} className="text-green-500 flex-shrink-0" />
        ) : (
          <span className="text-[13px] font-bold text-sky-600">{pct}%</span>
        )}
      </div>
      {!done && (
        <div className="mt-3 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-400 to-sky-600 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}