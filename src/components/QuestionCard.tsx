"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Question } from "@/types/questions";
import { useAIBrainstorm } from "@/hooks/useAIBrainstorm";
// import {
//   getDifficultyColor,
//   getDifficultyAccentColor,
// } from "@/utils/difficultyUtils";

interface QuestionCardProps {
  question: Question;
}

export function QuestionCard({ question }: QuestionCardProps) {
  const {
    showAIBrainstorm,
    aiResponse,
    loading,
    handleBrainstorm,
    hideBrainstorm,
  } = useAIBrainstorm(question);

  // console.log(getDifficultyColor(question.difficulty));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "bg-gradient-to-br from-emerald-600 to-black text-white shadow-md shadow-emerald-600/20";
      case "medium":
        return "bg-gradient-to-br from-amber-600 to-black text-white shadow-md shadow-amber-600/20";
      case "hard":
        return "bg-gradient-to-br from-rose-600 to-black text-white shadow-md shadow-rose-600/20";
      default:
        return "bg-gray-600 text-white";
    }
  };

  console.log(getDifficultyColor(question.difficulty));

  return (
    <div
      className={`flex flex-col h-screen w-full relative ${getDifficultyColor(
        question.difficulty
      )}`}
    >
      {/* Content card with difficulty accent */}
      <div
        className={`absolute top-14 bottom-20 backdrop-blur-sm p-4 overflow-hidden shadow-xl`}
      >
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
        <div className="text-sm text-gray-300 mb-4 flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
          Acceptance Rate: {question.acceptance_rate}%
        </div>

        {/* Question content */}
        <div
          className={`flex-grow overflow-y-auto pr-2 markdown-body ${
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
          <div className="pb-3 mb-4 border-b border-gray-600/30 flex items-center">
            <button
              onClick={hideBrainstorm}
              className="mr-3 text-gray-300 hover:text-white transition-colors"
            >
              ← Back
            </button>
            <h3 className="text-lg font-medium bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AI Brainstorm
            </h3>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center h-full">
              <div className="w-12 h-12 border-t-3 border-b-3 border-indigo-500 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-300">AI is thinking...</p>
            </div>
          ) : (
            <div className="bg-gray-800/80 backdrop-blur-sm border border-indigo-500/20 rounded-lg p-5 whitespace-pre-line shadow-lg">
              {aiResponse}
            </div>
          )}
        </div>
      </div>

      {/* Brainstorm button */}
      <div className="absolute bottom-4 inset-x-4">
        <button
          className={`w-full py-3 rounded-xl font-medium transition-all ${
            showAIBrainstorm
              ? "bg-gradient-to-r from-gray-700 to-gray-600 shadow-md text-white"
              : "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg hover:shadow-indigo-500/30 text-white"
          }`}
          onClick={showAIBrainstorm ? hideBrainstorm : handleBrainstorm}
        >
          {showAIBrainstorm ? "Hide AI Brainstorm" : "Brainstorm with AI"}
        </button>
      </div>
    </div>
  );
}
