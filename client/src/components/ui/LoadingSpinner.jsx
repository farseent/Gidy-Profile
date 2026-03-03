export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-[3px] border-gray-200 border-t-sky-500 rounded-full animate-spin" />
      <p className="text-[13px] text-gray-400">Loading profile...</p>
    </div>
  );
}