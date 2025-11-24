import React, { useState } from "react";
import MantraIntro from "./MantraIntro";
import MantraSetup from "./MantraSetup";
import ChantingSession from "./ChantingSession";

const MantraModule = ({ onClose, userId, showToast }) => {
  const [currentView, setCurrentView] = useState("intro"); // intro, setup, session
  const [chantingConfig, setChantingConfig] = useState(null);

  const handleStartSetup = () => {
    setCurrentView("setup");
  };

  const handleStartChanting = (config) => {
    setChantingConfig(config);
    setCurrentView("session");
  };

  const handleChantingComplete = async (data) => {
    // Save chanting data to backend
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/krishna/wisdom-portal/chanting`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            userId,
            count: data.count,
            duration: data.duration,
            mantra: data.mantra,
            deity: data.deity,
            completed: data.count === 108,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Chanting saved:", result);
        if (showToast) showToast("Chanting session saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save chanting:", error);
    }
  };

  const handleSessionStop = () => {
    setCurrentView("intro");
    setChantingConfig(null);
  };

  const handleBackToIntro = () => {
    setCurrentView("intro");
  };

  return (
    <div>
      {currentView === "intro" && (
        <MantraIntro onContinue={handleStartSetup} />
      )}

      {currentView === "setup" && (
        <MantraSetup
          onStart={handleStartChanting}
          onBack={handleBackToIntro}
        />
      )}

      {currentView === "session" && chantingConfig && (
        <ChantingSession
          config={chantingConfig}
          onComplete={handleChantingComplete}
          onStop={handleSessionStop}
        />
      )}
    </div>
  );
};

export default MantraModule;
