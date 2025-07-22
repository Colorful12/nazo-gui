import React, { useState, useEffect, useRef } from 'react';
import { StageProps } from '../../types';

const Stage2: React.FC<StageProps> = ({ onStageComplete }) => {
    const [answer, setAnswer] = useState('');
    const [isBlinking, setIsBlinking] = useState(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Background words with one mistyped word
    const words = ['system', 'process', 'access', 'network', 'secure', 'protocol', 'proccess', 'status', 'monitor', 'control'];
    const correctAnswer = 'process'; // The correct spelling of 'proccess'
    const allWords = [...words, ...words, ...words, ...words, ...words]; // Repeat words multiple times

    useEffect(() => {
        // Word by word animation
        const wordInterval = setInterval(() => {
            setCurrentWordIndex(prev => (prev + 1) % allWords.length);
        }, 1000); // 1 second per word

        // Simple repeating blink pattern
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 300); // On for 300ms
        }, 1000); // Repeat every 1000ms

        return () => {
            clearInterval(wordInterval);
            clearInterval(blinkInterval);
        };
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (answer.toLowerCase().trim() === correctAnswer) {
            onStageComplete();
        } else {
            // Wrong answer feedback
            setAnswer('');
        }
    };

    return (
        <div className="h-screen bg-black text-white overflow-hidden relative">
            {/* Background scrolling text */}
            <div className="absolute top-1/3 left-0 right-0 opacity-30 overflow-hidden">
                <div className="whitespace-nowrap font-mono text-sm leading-relaxed">
                    {/* Create seamless infinite loop */}
                    {[...allWords, ...allWords, ...allWords]
                        .slice(currentWordIndex, currentWordIndex + 40)
                        .join(' ')}
                </div>
            </div>

            {/* Blinking indicator */}
            <div className="absolute top-10 right-10 z-50">
                <div className={`w-20 h-20 rounded-full transition-all duration-300 border-4 ${isBlinking ? 'bg-red-500 shadow-red-500 shadow-2xl scale-125 opacity-100 border-white' : 'bg-red-800 scale-100 opacity-90 border-red-600'
                    }`}></div>
            </div>

            {/* Main interface */}
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-4xl font-mono mb-8 text-green-400">WEIRD ACCESS</h1>
                    <p className="text-gray-400 mb-8 max-w-md">
                        System ready for input.<br />
                        Enter command to proceed.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="input-stage0 text-center text-lg w-64"
                            placeholder="ENTER COMMAND"
                            autoFocus
                        />
                        <br />
                        <button type="submit" className="btn-stage0">
                            EXECUTE
                        </button>
                    </form>
                </div>
            </div>

            {/* Noise overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="noise-bg w-full h-full"></div>
            </div>
        </div>
    );
};

export default Stage2; 
