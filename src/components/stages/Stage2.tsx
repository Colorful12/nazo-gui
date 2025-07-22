import React, { useState, useEffect, useRef } from 'react';
import { StageProps } from '../../types';

const Stage2: React.FC<StageProps> = ({ onStageComplete }) => {
    const [answer, setAnswer] = useState('');
    const [isBlinking, setIsBlinking] = useState(false);
    const [backgroundText, setBackgroundText] = useState('');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Background words with one mistyped word
    const words = ['system', 'process', 'access', 'network', 'secure', 'protocol', 'proccess', 'status', 'monitor', 'control'];
    const correctAnswer = 'process'; // The correct spelling of 'proccess'

    useEffect(() => {
        // Create repeating background text
        const repeatText = () => {
            const shuffled = [...words].sort(() => Math.random() - 0.5);
            setBackgroundText(shuffled.join(' ').repeat(20));
        };

        repeatText();
        const interval = setInterval(repeatText, 1); // Much faster refresh

        // Morse code blinking (P-R-O-C-E-S-S)
        // Simple repeating blink pattern
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), 300); // On for 300ms
        }, 1000); // Repeat every 1000ms

        return () => {
            clearInterval(interval);
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
            <div className="absolute top-1/3 left-0 right-0 opacity-20 overflow-hidden">
                <div className="whitespace-nowrap font-mono text-xs leading-relaxed text-center animate-bounce">
                    {backgroundText}
                </div>
            </div>

            {/* Blinking indicator */}
            <div className="absolute top-10 right-10 text-center p-6 bg-red-900 bg-opacity-80 border-2 border-red-400 rounded-lg animate-pulse">
                <div className={`w-20 h-20 rounded-full transition-all duration-300 mx-auto border-4 ${isBlinking ? 'bg-red-300 shadow-red-300 shadow-2xl border-white scale-110' : 'bg-red-800 border-red-500'
                    }`}></div>
                <div className="text-xl text-red-200 mt-4 font-mono font-bold animate-pulse">⚠️ SIGNAL ⚠️</div>
                <div className="text-sm text-red-300 mt-2 font-bold">BLINKING HERE</div>
            </div>

            {/* Main interface */}
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <h1 className="text-4xl font-mono mb-8 text-green-400">TERMINAL ACCESS</h1>
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
