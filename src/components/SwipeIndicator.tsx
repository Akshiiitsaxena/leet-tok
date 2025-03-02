"use client";

import { useState, useEffect } from "react";

export function SwipeIndicator() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    // Hide swipe indicator after 5 seconds
    const timer = setTimeout(() => {
      setShow(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
      <div className="flex flex-col items-center bg-gray-800/60 backdrop-blur-sm rounded-full p-3 shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <polyline points="19 12 12 19 5 12"></polyline>
        </svg>
        <span className="text-white text-xs mt-1">Swipe to explore</span>
      </div>
    </div>
  );
}
