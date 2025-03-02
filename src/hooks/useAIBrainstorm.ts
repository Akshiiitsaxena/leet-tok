"use client"

import { useState } from 'react';
import { Question } from '@/types/questions';

export function useAIBrainstorm(question: Question) {
    const [showAIBrainstorm, setShowAIBrainstorm] = useState(false);
    const [aiResponse, setAiResponse] = useState('');
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

    const hideBrainstorm = () => {
        setShowAIBrainstorm(false);
    };

    return {
        showAIBrainstorm,
        aiResponse,
        loading,
        handleBrainstorm,
        hideBrainstorm
    };
}