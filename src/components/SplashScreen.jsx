import React, { useEffect, useState } from 'react';
import { FaUtensils } from 'react-icons/fa';

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start fade out after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Notify parent after transition ends (500ms duration)
      setTimeout(onFinish, 500); 
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
        <div className="relative w-24 h-24 bg-primary rounded-full flex items-center justify-center shadow-2xl z-10">
          <FaUtensils className="text-white text-4xl" />
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-2 animate-fade-in-up">
        Campus <span className="text-primary">Eats</span>
      </h1>
      
      <p className="text-gray-500 text-sm font-medium tracking-wide animate-pulse">
        Central University
      </p>

      <div className="absolute bottom-10 flex flex-col items-center gap-2">
         <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-secondary w-full animate-[loading_1.5s_ease-in-out_infinite] origin-left"></div>
         </div>
      </div>
      
      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
