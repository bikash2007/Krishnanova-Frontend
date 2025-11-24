import React, { useState } from "react";
import MeditationIntro from "./MeditationIntro";
import MeditationSetup from "./MeditationSetup";
import MeditationSession from "./MeditationSession";
import BhajanList from "./BhajanList";

const MeditationModule = ({ onClose, userId, showToast }) => {
  const [currentView, setCurrentView] = useState("intro"); // intro, setup, session, bhajans
  const [meditationConfig, setMeditationConfig] = useState(null);

  const handleStartSetup = () => {
    setCurrentView("setup");
  };

  const handleStartMeditation = (config) => {
    setMeditationConfig(config);
    setCurrentView("session");
  };

  const handleMeditationComplete = async (data) => {
    // Save meditation data to backend
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/krishna/wisdom-portal/meditation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId,
            duration: data.duration,
            eyesOpen: data.config.eyesOpen,
            musicType: data.config.musicType,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Meditation saved:", result);
        if (showToast) showToast("Meditation session saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save meditation:", error);
    }
  };

  const handleSessionStop = () => {
    setCurrentView("intro");
    setMeditationConfig(null);
  };

  const handleBackToIntro = () => {
    setCurrentView("intro");
  };

  const handleViewBhajans = () => {
    setCurrentView("bhajans");
  };

  return (
    <div>
      {currentView === "intro" && (
        <MeditationIntro
          onContinue={handleStartSetup}
          onViewBhajans={handleViewBhajans}
        />
      )}

      {currentView === "setup" && (
        <MeditationSetup
          onStart={handleStartMeditation}
          onBack={handleBackToIntro}
        />
      )}

      {currentView === "session" && meditationConfig && (
        <MeditationSession
          config={meditationConfig}
          onComplete={handleMeditationComplete}
          onStop={handleSessionStop}
        />
      )}

      {currentView === "bhajans" && <BhajanList onBack={handleBackToIntro} />}
    </div>
  );
};

export default MeditationModule;
