import React, { useState } from "react";
import ChapterList from "./ChapterList";
import GitaReader from "./GitaReader";

const GitaModule = ({ onClose }) => {
  const [currentView, setCurrentView] = useState("chapters"); // chapters, reader
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedVerse, setSelectedVerse] = useState(1);

  const handleSelectChapter = (chapter) => {
    setSelectedChapter(chapter);
    setSelectedVerse(1);
    setCurrentView("reader");
  };

  const handleBackToChapters = () => {
    setCurrentView("chapters");
    setSelectedChapter(null);
  };

  return (
    <div>
      {currentView === "chapters" && (
        <ChapterList onSelectChapter={handleSelectChapter} />
      )}

      {currentView === "reader" && selectedChapter && (
        <GitaReader
          chapter={selectedChapter}
          initialVerse={selectedVerse}
          onBack={handleBackToChapters}
        />
      )}
    </div>
  );
};

export default GitaModule;
