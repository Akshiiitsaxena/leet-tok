"use client"

import { useRef, useCallback } from 'react';

interface SwipeNavigationProps {
    goToNext: () => void;
    goToPrevious: () => void;
    currentIndex: number;
}

export function useSwipeNavigation({ goToNext, goToPrevious, currentIndex }: SwipeNavigationProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const touchStartY = useRef(0);
    const touchEndY = useRef(0);
    const isScrollingContent = useRef(false);
    const lastTouchTime = useRef(0);
    const previousIndex = useRef(currentIndex);

    // Find the closest parent element that is scrollable
    const findScrollableParent = useCallback((element: HTMLElement | null): HTMLElement | null => {
        if (!element || element === document.body) return null;

        const { overflowY } = window.getComputedStyle(element);
        if (overflowY === 'auto' || overflowY === 'scroll') {
            return element;
        }

        return findScrollableParent(element.parentElement);
    }, []);

    // Handle touch start event
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
        lastTouchTime.current = Date.now();

        // Check if we're starting touch on a scrollable content area
        const target = e.target as HTMLElement;
        const scrollableParent = findScrollableParent(target);

        if (scrollableParent && scrollableParent.scrollHeight > scrollableParent.clientHeight) {
            // We're touching inside a scrollable area that has content to scroll
            isScrollingContent.current = true;
        } else {
            isScrollingContent.current = false;
        }
    }, [findScrollableParent]);

    // Handle touch move event
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        touchEndY.current = e.touches[0].clientY;
    }, []);

    // Handle touch end event
    const handleTouchEnd = useCallback(() => {
        const distance = touchStartY.current - touchEndY.current;
        const touchDuration = Date.now() - lastTouchTime.current;
        const MIN_SWIPE_DISTANCE = 80; // Increased for deliberate swipes
        const FAST_SWIPE_THRESHOLD = 300; // ms

        // If we're inside a scrollable element that isn't at its boundary, don't navigate
        if (isScrollingContent.current) {
            const scrollableElement = contentRef.current?.querySelector('.overflow-y-auto');
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
        const isFastSwipe = touchDuration < FAST_SWIPE_THRESHOLD && Math.abs(distance) > 30;
        const isLongSwipe = Math.abs(distance) > MIN_SWIPE_DISTANCE;

        if ((isLongSwipe || isFastSwipe) && distance > 0) {
            // Swipe up - go to next question
            goToNext();
        } else if ((isLongSwipe || isFastSwipe) && distance < 0) {
            // Swipe down - go to previous question
            goToPrevious();
        }
    }, [goToNext, goToPrevious]);

    // Handle mouse wheel for desktop with improved scrolling logic
    const handleWheel = useCallback((e: React.WheelEvent) => {
        // Find if we're scrolling inside content
        const target = e.target as HTMLElement;
        const scrollableParent = findScrollableParent(target);

        if (scrollableParent) {
            const { scrollTop, scrollHeight, clientHeight } = scrollableParent;

            // Check if we've reached the top or bottom of the content
            const isAtTop = scrollTop <= 0;
            const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

            // Only navigate if we're at the boundaries
            if (e.deltaY > 30 && isAtBottom) {
                e.preventDefault();
                goToNext();
            } else if (e.deltaY < -30 && isAtTop) {
                e.preventDefault();
                goToPrevious();
            }

            // Otherwise let the normal scrolling happen
        } else {
            // Not in a scrollable area, so navigate between questions
            if (e.deltaY > 30) {
                goToNext();
            } else if (e.deltaY < -30) {
                goToPrevious();
            }
        }
    }, [findScrollableParent, goToNext, goToPrevious]);

    // Track the previous index value
    if (previousIndex.current !== currentIndex) {
        previousIndex.current = currentIndex;
    }

    return {
        contentRef,
        previousIndex,
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleWheel
    };
}