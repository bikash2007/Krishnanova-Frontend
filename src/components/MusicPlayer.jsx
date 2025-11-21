import { useEffect, useRef, useState } from "react";
import bgMusic from "../Audio/bg.mp3";
export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleMusic = () => {
    if (!isPlaying) {
      audioRef.current.play().catch(() => {
        console.log("Autoplay blocked. User must interact.");
      });
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    // Try to start muted on mount
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          console.log("Autoplay blocked on mount.");
        });
    }
  }, []);

  return (
    <div className="flex items-center gap-2 p-4">
      <audio ref={audioRef} loop>
        <source src={bgMusic} type="audio/mpeg" />
      </audio>

      <button
        onClick={toggleMusic}
        className="bg-yellow-400/40 top-20 z-50 fixed text-white px-4 py-2 rounded text-sm shadow hover:bg-yellow-500 transition hidden md:flex"
      >
        {isPlaying ? "🔇 Stop Music" : "🔊 Play Music"}
      </button>
      <button
        onClick={toggleMusic}
        className="bg-yellow-400/40 top-18 left-0 z-40 fixed text-white px-2 py-2 rounded text-sm shadow hover:bg-yellow-500 transition md:hidden"
      >
        {isPlaying ? "🔇 " : "🔊 "}
      </button>
    </div>
  );
}
