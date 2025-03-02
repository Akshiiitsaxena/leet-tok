"use client";

import { useRouter } from "next/navigation";

interface NavigationControlsProps {
  currentIndex: number;
  totalQuestions: number;
}

export function NavigationControls({
  currentIndex,
  totalQuestions,
}: NavigationControlsProps) {
  const router = useRouter();

  return (
    <>
      {/* Back to home button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 bg-gray-800/80 hover:bg-gray-700 p-2 rounded-full backdrop-blur-sm shadow-lg transition-colors"
        aria-label="Back to home"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      </button>

      {/* Progress indicator */}
      <div className="fixed top-4 right-4 z-50 bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm shadow-lg">
        {currentIndex + 1} / {totalQuestions}
      </div>
    </>
  );
}
