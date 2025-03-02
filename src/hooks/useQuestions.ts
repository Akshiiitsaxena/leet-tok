"use client"

import { useState, useEffect } from 'react';
import { Question, FilterType } from '@/types/questions';

const BATCH_SIZE = 20;

export function useQuestions(filterType: FilterType) {
    const [allQuestions, setAllQuestions] = useState<Question[]>([]);
    const [visibleQuestions, setVisibleQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    // Load and filter questions
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const response = await fetch('/questions.json');

                if (!response.ok) {
                    throw new Error(`Failed to fetch questions: ${response.status}`);
                }

                const data = await response.json();

                // Apply filtering based on the selected option
                let filteredData = [...data];

                if (filterType) {
                    switch (filterType) {
                        case 'shuffle':
                            // Shuffle the array
                            filteredData = [...data].sort(() => Math.random() - 0.5);
                            break;

                        case 'difficulty':
                            // Sort by difficulty (easy, medium, hard)
                            filteredData = [...data].sort((a, b) => {
                                const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
                                return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] -
                                    difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
                            });
                            break;

                        case 'topic':
                            // Group by topic if available
                            if (data[0]?.topic) {
                                filteredData = [...data].sort((a, b) => (a.topic || '').localeCompare(b.topic || ''));
                            }
                            break;

                        case 'company':
                            // Group by company if available
                            if (data[0]?.company) {
                                filteredData = [...data].sort((a, b) => (a.company || '').localeCompare(b.company || ''));
                            }
                            break;
                    }
                }

                setAllQuestions(filteredData);
                // Initially load just the first batch
                setVisibleQuestions(filteredData.slice(0, BATCH_SIZE));
                setError(null);
            } catch (err) {
                console.error('Error loading questions:', err);
                setError(err instanceof Error ? err : new Error('Unknown error occurred'));
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [filterType]);

    // Load more questions when approaching the end of current batch
    useEffect(() => {
        // If user is 5 questions away from the end, load next batch
        if (currentIndex >= visibleQuestions.length - 5 && visibleQuestions.length < allQuestions.length) {
            const nextBatch = allQuestions.slice(
                visibleQuestions.length,
                visibleQuestions.length + BATCH_SIZE
            );
            setVisibleQuestions(prev => [...prev, ...nextBatch]);
        }
    }, [currentIndex, visibleQuestions.length, allQuestions]);

    // Navigation functions
    const goToNextQuestion = () => {
        if (currentIndex < visibleQuestions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        }
    };

    const goToPreviousQuestion = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        }
    };

    return {
        allQuestions,
        visibleQuestions,
        currentIndex,
        setCurrentIndex,
        loading,
        error,
        goToNextQuestion,
        goToPreviousQuestion,
        hasNext: currentIndex < visibleQuestions.length - 1,
        hasPrevious: currentIndex > 0,
        totalQuestions: allQuestions.length,
        currentQuestion: visibleQuestions[currentIndex]
    };
}