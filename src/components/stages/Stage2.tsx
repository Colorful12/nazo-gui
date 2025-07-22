import React, { useState, useEffect, useRef } from 'react';
import { StageProps } from '../../types';

const Stage2: React.FC<StageProps> = ({ onStageComplete }) => {
    const [answer, setAnswer] = useState('');
    const [isBlinking, setIsBlinking] = useState<'dot' | 'dash' | false>(false);
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [morsePhase, setMorsePhase] = useState<'waiting' | 'transmitting'>('waiting');
    const [blinkCount, setBlinkCount] = useState(0);
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
            setBlinkCount(prev => prev + 1);
        }, 100); // Check every 100ms for more precise timing

        // Morse code pattern for "PROCESS": .--. .-.  ---  -.-.  .  ...  ...
        const morsePattern = [
            // P: .--.
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 100 },
            { type: 'dash', duration: 600 }, { type: 'gap', duration: 100 },
            { type: 'dash', duration: 600 }, { type: 'gap', duration: 100 },
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 400 }, // letter gap
            // R: .-.
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 100 },
            { type: 'dash', duration: 600 }, { type: 'gap', duration: 100 },
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 400 }, // letter gap
            // O: ---
            { type: 'dash', duration: 600 }, { type: 'gap', duration: 100 },
            { type: 'dash', duration: 600 }, { type: 'gap', duration: 100 },
            { type: 'dash', duration: 600 }, { type: 'gap', duration: 400 }, // letter gap
            // C: -.-.
            { type: 'dash', duration: 600 }, { type: 'gap', duration: 100 },
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 100 },
            { type: 'dash', duration: 600 }, { type: 'gap', duration: 100 },
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 400 }, // letter gap
            // E: .
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 400 }, // letter gap
            // S: ...
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 100 },
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 100 },
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 400 }, // letter gap
            // S: ...
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 100 },
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 100 },
            { type: 'dot', duration: 200 }, { type: 'gap', duration: 800 }, // word gap
        ];

        let patternIndex = 0;
        let isTransmitting = false;

        const morseInterval = setInterval(() => {
            if (!isTransmitting) {
                // Start new transmission every 5 seconds
                if (blinkCount % 50 === 0) {
                    isTransmitting = true;
                    patternIndex = 0;
                    setMorsePhase('transmitting');
                    console.log('Starting morse transmission!');
                }
            } else {
                // Follow morse pattern
                if (patternIndex < morsePattern.length) {
                    const signal = morsePattern[patternIndex];

                    if (signal.type === 'dot' || signal.type === 'dash') {
                        setIsBlinking(signal.type); // 'dot' or 'dash'
                    } else {
                        setIsBlinking(false); // gap
                    }

                    setTimeout(() => {
                        patternIndex++;
                        if (patternIndex >= morsePattern.length) {
                            isTransmitting = false;
                            setMorsePhase('waiting');
                            setIsBlinking(false);
                            console.log('Morse transmission ended');
                        }
                    }, signal.duration);
                }
            }
        }, 100);

        return () => {
            clearInterval(wordInterval);
            clearInterval(blinkInterval);
            clearInterval(morseInterval);
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
            {morsePhase === 'transmitting' && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50" style={{ marginTop: '-100px' }}>
                    <div className={`w-20 h-20 rounded-full transition-all duration-100 border-4 ${isBlinking === 'dot'
                        ? 'bg-white shadow-white shadow-xl scale-125 opacity-100 border-gray-300'
                        : isBlinking === 'dash'
                            ? 'bg-white shadow-white shadow-2xl scale-175 opacity-100 border-gray-300'
                            : 'bg-white scale-100 opacity-70 border-gray-400'
                        }`}></div>
                </div>
            )}

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
