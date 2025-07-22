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
        const interval = setInterval(repeatText, 5000);

        // Morse code blinking (P-R-O-C-E-S-S)
        const morsePattern = [
            250, 150, 250, 150, 500, 150, // P: .--. 
            250, 150, 500, 150, 250, 150, // R: .-.
            500, 150, 500, 150, 500, 150, // O: ---
            500, 150, 250, 150, 500, 150, 250, 150, // C: -.-.
            250, 150, // E: .
            250, 150, 250, 150, 250, 150, // S: ...
            250, 150, 250, 150, 250, 150, // S: ...
        ];

        let patternIndex = 0;
        const blinkInterval = setInterval(() => {
            setIsBlinking(true);
            setTimeout(() => setIsBlinking(false), morsePattern[patternIndex] || 250);
            patternIndex = (patternIndex + 1) % morsePattern.length;
        }, 800);

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
                <div className="whitespace-nowrap animate-pulse font-mono text-xs leading-relaxed text-center">
                    {backgroundText}
                </div>
            </div>

            {/* Signal monitor */}
            <div className="absolute top-10 left-10 w-64 h-32 border border-green-400 bg-black bg-opacity-80">
                <div className="p-2">
                    <div className="text-green-400 text-xs mb-2">SIGNAL MONITOR</div>
                    <div className="h-16 flex items-center justify-center">
                        <svg width="200" height="60" className="opacity-70">
                            <polyline
                                points="0,30 20,25 40,35 60,20 80,40 100,30 120,15 140,45 160,30 180,25 200,30"
                                fill="none"
                                stroke="#00ff00"
                                strokeWidth="2"
                                className="animate-pulse"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Blinking indicator */}
            <div className="absolute top-20 right-20 text-center">
                <div className={`w-12 h-12 rounded-full transition-all duration-100 mx-auto border-2 ${isBlinking ? 'bg-red-500 shadow-red-500 shadow-2xl border-red-300' : 'bg-red-800 border-red-600'
                    }`}></div>
                <div className="text-sm text-red-400 mt-3 font-mono">ACTIVE</div>
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
