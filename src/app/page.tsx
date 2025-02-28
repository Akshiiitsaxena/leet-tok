"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleOptionClick = (option: string) => {
    setSelectedOption(option);
  };

  const handleStartExploring = () => {
    if (selectedOption) {
      router.push(`/feed?type=${selectedOption}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="p-4 md:p-6 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-emerald-400 via-indigo-500 to-rose-500 text-transparent bg-clip-text">
          Leet-Tok
        </h1>
        <p className="text-gray-400">
          Swipe through LeetCode problems like you're on TikTok
        </p>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6">
        <div className="max-w-md w-full">
          <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">
              Choose how to browse:
            </h2>

            <div className="space-y-3">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg cursor-pointer border ${
                  selectedOption === "shuffle"
                    ? "border-indigo-500 bg-indigo-900/30"
                    : "border-gray-700 hover:border-gray-500"
                }`}
                onClick={() => handleOptionClick("shuffle")}
              >
                <h3 className="font-medium">🎲 Shuffle</h3>
                <p className="text-sm text-gray-400">
                  Start with a random selection of problems
                </p>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg cursor-pointer border ${
                  selectedOption === "difficulty"
                    ? "border-indigo-500 bg-indigo-900/30"
                    : "border-gray-700 hover:border-gray-500"
                }`}
                onClick={() => handleOptionClick("difficulty")}
              >
                <h3 className="font-medium">🔥 Difficulty</h3>
                <p className="text-sm text-gray-400">
                  Browse problems by difficulty level
                </p>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg cursor-pointer border ${
                  selectedOption === "topic"
                    ? "border-indigo-500 bg-indigo-900/30"
                    : "border-gray-700 hover:border-gray-500"
                }`}
                onClick={() => handleOptionClick("topic")}
              >
                <h3 className="font-medium">📚 Topic</h3>
                <p className="text-sm text-gray-400">
                  Find problems by algorithm or data structure
                </p>
              </motion.div>

              <motion.div
                whileTap={{ scale: 0.98 }}
                className={`p-4 rounded-lg cursor-pointer border ${
                  selectedOption === "company"
                    ? "border-indigo-500 bg-indigo-900/30"
                    : "border-gray-700 hover:border-gray-500"
                }`}
                onClick={() => handleOptionClick("company")}
              >
                <h3 className="font-medium">🏢 Company</h3>
                <p className="text-sm text-gray-400">
                  Practice problems asked by specific companies
                </p>
              </motion.div>
            </div>

            <div className="mt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full py-3 rounded-lg font-medium ${
                  selectedOption
                    ? "bg-indigo-600 hover:bg-indigo-500"
                    : "bg-gray-700 cursor-default"
                }`}
                disabled={!selectedOption}
                onClick={handleStartExploring}
              >
                Start Exploring
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-gray-500">
        <p>Your personal LeetCode practice companion</p>
      </footer>
    </div>
  );
}
