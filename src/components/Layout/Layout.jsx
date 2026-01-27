import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer/Footer";
import MusicPlayer from "../MusicPlayer";
import EnhancedKrishnaGame from "../FloatingKrishna";

const Layout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ["/login", "/signup"].includes(location.pathname);
  const isAdminPage = location.pathname.startsWith("/admin");

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (isAdminPage) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 text-white">
      {/* Global Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Animated radial glow */}
        <div className="absolute w-[40rem] h-[40rem] bg-[radial-gradient(circle,rgba(255,255,255,0.06),transparent_80%)] rounded-full top-20 left-1/4 animate-slow-spin opacity-40"></div>

        {/* Static radial glow */}
        <div className="absolute w-[25rem] h-[25rem] bg-[radial-gradient(circle,rgba(255,255,255,0.04),transparent_70%)] rounded-full bottom-10 right-1/4 opacity-30"></div>

        {/* Subtle grid */}
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.02)_25%,transparent_25%,transparent_75%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.02))] bg-[length:50px_50px] opacity-20"></div>
      </div>

      {!isAuthPage && <Navigation />}
      {!isAuthPage && <MusicPlayer />}
      {!isAuthPage && <EnhancedKrishnaGame />}

      <main className="flex-grow relative z-10 w-full">
        {children}
      </main>

      {/* {!isAuthPage && <Footer />} */}
    </div>
  );
};

export default Layout;
