import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ProfileProvider } from "./context/ProfileContext";
import { DarkModeProvider } from "./context/DarkModeContext";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <BrowserRouter>
      <DarkModeProvider>
        <ProfileProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                borderRadius: "12px",
                fontSize: "13px",
                boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              },
            }}
          />
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </ProfileProvider>
      </DarkModeProvider>
    </BrowserRouter>
  );
}