import React, { useEffect, useState } from 'react';
import krishna from "../Media/k.webp"
const Preloader = ({ onFinish }) => {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Minimum wait time of 2 seconds for visual appeal
    const minWait = new Promise(resolve => setTimeout(resolve, 2000));
    
    // Wait for window load if not already loaded
    const windowLoad = new Promise(resolve => {
      if (document.readyState === 'complete') {
        resolve();
      } else {
        window.addEventListener('load', resolve);
      }
    });

    Promise.all([minWait, windowLoad]).then(() => {
      setFading(true);
      // Wait for transition to finish before unmounting
      setTimeout(onFinish, 1000); 
    });
  }, [onFinish]);

  if (!onFinish) return null;

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#fffbf2] transition-opacity duration-1000 ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative flex flex-col items-center">
        {/* Glowing effect behind the image */}
        <div className="absolute inset-0 bg-yellow-400 blur-3xl opacity-20 rounded-full scale-150 animate-pulse"></div>
        
        {/* Main Krishna Image */}
        <img 
          src={krishna} 
          alt="Krishnova Loading" 
          className="w-48 md:w-64 object-contain animate-float-slow relative z-10 drop-shadow-2xl"
        />
        
        {/* Loading Text */}
        <div className="mt-8 relative z-10">
           <p className="text-[#d4af37] font-serif tracking-[0.3em] text-sm md:text-base uppercase animate-pulse">
             Loading Divine Experience...
           </p>
        </div>
        
        {/* Decorative Divider */}
        <div className="mt-4 w-24 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-50"></div>
      </div>
    </div>
  );
};

export default Preloader;
