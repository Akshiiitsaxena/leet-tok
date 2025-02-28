"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import QuestionCard from "@/components/QuestionCard";

interface Question {
  id: number;
  title: string;
  description: string;
  difficulty: string;
  acceptance_rate: number;
  topic: [string];
  company: [string];
  [key: string]: any;
}

// Number of questions to load at a time
const BATCH_SIZE = 20;

export default function Feed() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [visibleQuestions, setVisibleQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showSwipeIndicator, setShowSwipeIndicator] = useState(true);

  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const isScrollingContent = useRef(false);
  const lastTouchTime = useRef(0);

  // Load questions from JSON file
  useEffect(() => {
    fetch("/questions.json")
      .then((res) => res.json())
      .then((data) => {
        // Filter or sort questions based on selected option
        let filteredData = [...data];

        if (type) {
          switch (type) {
            case "shuffle":
              // Shuffle the array
              filteredData = [...data].sort(() => Math.random() - 0.5);
              break;

            case "difficulty":
              // Sort by difficulty (easy, medium, hard)
              filteredData = [...data].sort((a, b) => {
                const difficultyOrder = { Easy: 1, Medium: 2, Hard: 3 };
                return (
                  difficultyOrder[
                    a.difficulty as keyof typeof difficultyOrder
                  ] -
                  difficultyOrder[b.difficulty as keyof typeof difficultyOrder]
                );
              });
              break;

            case "topic":
              // Group by topic if available
              if (data[0]?.topic) {
                filteredData = [...data].sort((a, b) =>
                  (a.topic || "").localeCompare(b.topic || "")
                );
              }
              break;

            case "company":
              // Group by company if available
              if (data[0]?.company) {
                filteredData = [...data].sort((a, b) =>
                  (a.company || "").localeCompare(b.company || "")
                );
              }
              break;

            default:
              break;
          }
        }

        setAllQuestions(filteredData);
        // Initially load just the first batch
        setVisibleQuestions(filteredData.slice(0, BATCH_SIZE));
        setLoading(false);

        // Hide swipe indicator after 5 seconds
        setTimeout(() => {
          setShowSwipeIndicator(false);
        }, 5000);
      })
      .catch((err) => {
        console.error("Error loading questions:", err);
        setLoading(false);
      });
  }, [type]);

  // Load more questions when approaching the end of current batch
  useEffect(() => {
    // If user is 5 questions away from the end, load next batch
    if (
      currentIndex >= visibleQuestions.length - 5 &&
      visibleQuestions.length < allQuestions.length
    ) {
      const nextBatch = allQuestions.slice(
        visibleQuestions.length,
        visibleQuestions.length + BATCH_SIZE
      );
      setVisibleQuestions((prev) => [...prev, ...nextBatch]);
    }
  }, [currentIndex, visibleQuestions.length, allQuestions]);

  // Improved touch events for better scrolling vs navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
    lastTouchTime.current = Date.now();

    // Check if we're starting touch on a scrollable content area
    const target = e.target as HTMLElement;
    const scrollableParent = findScrollableParent(target);

    if (
      scrollableParent &&
      scrollableParent.scrollHeight > scrollableParent.clientHeight
    ) {
      // We're touching inside a scrollable area that has content to scroll
      isScrollingContent.current = true;
    } else {
      isScrollingContent.current = false;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    const distance = touchStartY.current - touchEndY.current;
    const touchDuration = Date.now() - lastTouchTime.current;
    const MIN_SWIPE_DISTANCE = 80; // Increased for deliberate swipes
    const FAST_SWIPE_THRESHOLD = 300; // ms

    // If we're inside a scrollable element that isn't at its boundary, don't navigate
    if (isScrollingContent.current) {
      const scrollableElement =
        contentRef.current?.querySelector(".overflow-y-auto");
      if (scrollableElement) {
        const { scrollTop, scrollHeight, clientHeight } = scrollableElement;

        // If we're at the top and swiping down, or at the bottom and swiping up, allow navigation
        const isAtTop = scrollTop <= 0;
        const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

        if ((distance < 0 && !isAtTop) || (distance > 0 && !isAtBottom)) {
          // Still within content bounds, don't navigate
          return;
        }
      }
    }

    // Navigation requires either a longer swipe or a fast swipe
    const isFastSwipe =
      touchDuration < FAST_SWIPE_THRESHOLD && Math.abs(distance) > 30;
    const isLongSwipe = Math.abs(distance) > MIN_SWIPE_DISTANCE;

    if (
      (isLongSwipe || isFastSwipe) &&
      distance > 0 &&
      currentIndex < visibleQuestions.length - 1
    ) {
      // Swipe up - go to next question
      setCurrentIndex((prev) => prev + 1);
    } else if (
      (isLongSwipe || isFastSwipe) &&
      distance < 0 &&
      currentIndex > 0
    ) {
      // Swipe down - go to previous question
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Find the closest parent element that is scrollable
  const findScrollableParent = (
    element: HTMLElement | null
  ): HTMLElement | null => {
    if (!element || element === document.body) return null;

    const { overflowY } = window.getComputedStyle(element);
    if (overflowY === "auto" || overflowY === "scroll") {
      return element;
    }

    return findScrollableParent(element.parentElement);
  };

  // Handle mouse wheel for desktop with improved scrolling logic
  const handleWheel = (e: React.WheelEvent) => {
    // Find if we're scrolling inside content
    const target = e.target as HTMLElement;
    const scrollableParent = findScrollableParent(target);

    if (scrollableParent) {
      const { scrollTop, scrollHeight, clientHeight } = scrollableParent;

      // Check if we've reached the top or bottom of the content
      const isAtTop = scrollTop <= 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

      // Only navigate if we're at the boundaries
      if (
        e.deltaY > 30 &&
        isAtBottom &&
        currentIndex < visibleQuestions.length - 1
      ) {
        e.preventDefault();
        setCurrentIndex((prev) => prev + 1);
      } else if (e.deltaY < -30 && isAtTop && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex((prev) => prev - 1);
      }

      // Otherwise let the normal scrolling happen
    } else {
      // Not in a scrollable area, so navigate between questions
      if (e.deltaY > 30 && currentIndex < visibleQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (e.deltaY < -30 && currentIndex > 0) {
        setCurrentIndex((prev) => prev - 1);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="w-16 h-16 border-t-4 border-b-4 border-indigo-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (allQuestions.length === 0 && !loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center p-6 bg-gray-800 rounded-lg">
          <h2 className="text-xl font-bold mb-2">No questions found</h2>
          <p>Please check your questions.json file in the public folder.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen overflow-hidden bg-gray-900 touch-none"
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      ref={contentRef}
    >
      {/* Back to home button */}
      <button
        onClick={() => router.push("/")}
        className="fixed top-4 left-4 z-50 bg-gray-800 p-2 rounded-full"
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
      <div className="fixed top-4 right-4 z-50 bg-gray-800 px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {allQuestions.length}
      </div>

      {/* Swipe indicator for onboarding */}
      {showSwipeIndicator && (
        <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-50 animate-pulse">
          <div className="flex flex-col items-center">
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
      )}

      {/* Questions carousel */}
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="h-screen w-full"
        >
          {visibleQuestions[currentIndex] && (
            <QuestionCard question={visibleQuestions[currentIndex]} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
