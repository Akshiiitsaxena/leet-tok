"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QuestionCard } from "@/components/QuestionCard";
import { NavigationControls } from "@/components/NavigationControls";
import { SwipeIndicator } from "@/components/SwipeIndicator";
import { useQuestions } from "@/hooks/useQuestions";
import { useSwipeNavigation } from "@/hooks/useSwipeNavigation";
import { FilterType } from "@/types/questions";
// import { getDifficultyGradientClass } from "@/utils/difficultyUtils";

interface QuestionFeedProps {
  filterType: FilterType;
}

export function QuestionFeed({ filterType }: QuestionFeedProps) {
  // Use the questions hook to manage question data and navigation state
  const {
    allQuestions,
    visibleQuestions,
    currentIndex,
    loading,
    error,
    goToNextQuestion,
    goToPreviousQuestion,
    totalQuestions,
    currentQuestion,
  } = useQuestions(filterType);

  // Use the swipe navigation hook to handle touch and wheel events
  const {
    contentRef,
    previousIndex,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWheel,
  } = useSwipeNavigation({
    goToNext: goToNextQuestion,
    goToPrevious: goToPreviousQuestion,
    currentIndex,
  });

  // // Get the difficulty color for the current question's background accents
  // const getDifficultyAccentClass = () => {
  //   if (!currentQuestion) return "";
  //   return getDifficultyGradientClass(currentQuestion.difficulty);
  // };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || (allQuestions.length === 0 && !loading)) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-2">No questions found</h2>
          <p>
            {error?.message ||
              "Please check your questions.json file in the public folder."}
          </p>
        </div>
      </div>
    );
  }

  // Variants for Framer Motion
  const variants = {
    enter: (custom: number) => ({
      y: custom > previousIndex.current ? "100%" : "-100%",
    }),
    center: {
      y: 0,
    },
    exit: (custom: number) => ({
      y: custom < previousIndex.current ? "100%" : "-100%",
    }),
  };

  return (
    <div
      className="h-screen overflow-hidden bg-gradient-to-b from-gray-950 to-gray-900 touch-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={contentRef}
    >
      {/* Navigation controls */}
      <NavigationControls
        currentIndex={currentIndex}
        totalQuestions={totalQuestions}
      />

      {/* Swipe indicator for onboarding */}
      <SwipeIndicator />

      {/* Questions carousel */}
      <AnimatePresence initial={false} custom={currentIndex} mode="wait">
        <motion.div
          key={currentIndex}
          custom={currentIndex}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-screen w-full"
          onAnimationStart={() => {
            previousIndex.current = currentIndex;
          }}
        >
          {currentQuestion && <QuestionCard question={currentQuestion} />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
