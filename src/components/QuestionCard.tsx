"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface QuestionProps {
  question: {
    id: number;
    title: string;
    description: string;
    difficulty: string;
    acceptance_rate: number;
    company: [string];
    topic: [string];
  };
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty.toLowerCase()) {
    case "easy":
      return "bg-emerald-600 text-white";
    case "medium":
      return "bg-amber-600 text-white";
    case "hard":
      return "bg-rose-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

const QuestionCard: React.FC<QuestionProps> = ({ question }) => {
  const [showAIBrainstorm, setShowAIBrainstorm] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBrainstorm = async () => {
    setShowAIBrainstorm(true);
    setLoading(true);

    // Mock AI response - in a real app, you'd call an AI API here
    setTimeout(() => {
      setAiResponse(`Here's how to approach the "${question.title}" problem:

1. Understand the problem: We need to find two numbers that add up to the target.
2. Consider using a hash map to store values we've seen.
3. For each number, check if its complement (target - num) exists in our hash map.
4. If it does, we've found our pair. If not, add the current number to the hash map.
5. Time complexity: O(n), Space complexity: O(n)`);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-900 text-white p-4 overflow-hidden">
      {/* Header with title and difficulty tag */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{question.title}</h2>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
            question.difficulty
          )}`}
        >
          {question.difficulty}
        </span>
      </div>

      {/* Acceptance rate */}
      <div className="text-sm text-gray-400 mb-2">
        Acceptance Rate: {question.acceptance_rate}%
      </div>

      {/* Question content */}
      <div
        className={`flex-grow overflow-y-auto pr-1 markdown-body ${
          showAIBrainstorm ? "hidden" : "block"
        }`}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {question.description}
        </ReactMarkdown>
      </div>

      {/* AI Brainstorming section */}
      <div
        className={`flex-grow overflow-y-auto ${
          showAIBrainstorm ? "block" : "hidden"
        }`}
      >
        <div className="pb-3 mb-4 border-b border-gray-700 flex items-center">
          <button
            onClick={() => setShowAIBrainstorm(false)}
            className="mr-3 text-gray-400 hover:text-white"
          >
            ← Back
          </button>
          <h3 className="text-lg font-medium">AI Brainstorm</h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-10 h-10 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin mb-3"></div>
            <p className="text-gray-400">AI is thinking...</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-4 whitespace-pre-line">
            {aiResponse}
          </div>
        )}
      </div>

      {/* Brainstorm button */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <button
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            showAIBrainstorm
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-indigo-600 hover:bg-indigo-500"
          }`}
          onClick={
            showAIBrainstorm
              ? () => setShowAIBrainstorm(false)
              : handleBrainstorm
          }
        >
          {showAIBrainstorm ? "Hide AI Brainstorm" : "Brainstorm with AI"}
        </button>
      </div>
    </div>
  );
};

export default QuestionCard;
