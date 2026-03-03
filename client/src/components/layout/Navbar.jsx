import { useState } from "react";
import { User, LogOut, MessageSquare, ChevronDown } from "lucide-react";

const NAV_LINKS = ["Jobs", "Hackathons", "Projects", "Tasks", "Organization"];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
      {/* Changed max-w-6xl to max-w-7xl to match the profile page container */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-12"> {/* Increased gap for the "airy" look */}
          <a href="/" className="flex items-center gap-2">
            <GidyLogo />
            {/* Font size increased and color slightly lighter to match screenshot */}
            <span className="text-[18px] font-semibold text-gray-800 tracking-tight">Gidy</span>
          </a>

          <div className="hidden md:flex items-center gap-4"> {/* Increased gap between links */}
            {NAV_LINKS.map((l) => (
              <a 
                key={l} 
                href="#" 
                className="px-2 py-1 text-[14px] text-gray-600 hover:text-gray-900 transition-colors font-medium"
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        <div className="relative">
          <button 
            onClick={() => setOpen(p => !p)} 
            className="flex items-center gap-1.5 group"
          >
            {/* Avatar matches the sky-blue circle in the screenshot */}
            <div className="w-8 h-8 rounded-full bg-[#4dabf7] flex items-center justify-center text-white text-sm font-semibold shadow-sm">
              F
            </div>
            <ChevronDown size={16} className="text-gray-500 group-hover:text-gray-800 transition-colors" />
          </button>

          {open && (
            <div className="absolute right-0 top-12 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
              <DropItem icon={<User size={15}/>} label="Profile" />
              <DropItem icon={<MessageSquare size={15} className="text-gray-400"/>} label="Feedback" />
              <div className="my-1 border-t border-gray-50" />
              <DropItem icon={<LogOut size={15} className="text-red-400"/>} label="Logout" red />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function DropItem({ icon, label, red }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${red ? "text-red-600 font-medium" : "text-gray-700"}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function GidyLogo() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* This path better reflects the "G" shape in your logo screenshot */}
      <path 
        d="M26 10L16 4L6 10V22L16 28L26 22V15H16" 
        stroke="#334155" 
        strokeWidth="2.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}