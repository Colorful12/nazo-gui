import React, { useState, useEffect } from 'react';
import { StageProps } from '../../types';

interface NoiseElement {
    id: string;
    content: string;
    x: number;
    y: number;
    isDragging: boolean;
}

const Stage3: React.FC<StageProps> = ({ onStageComplete }) => {
    const [noiseElements, setNoiseElements] = useState<NoiseElement[]>([]);
    const [notePassword, setNotePassword] = useState('');
    const [isNoteUnlocked, setIsNoteUnlocked] = useState(false);
    const [showNote, setShowNote] = useState(false);
    const [showLockedNote, setShowLockedNote] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const generateFibonacci = (n: number): number[] => {
        const fib = [1, 1];
        for (let i = 2; i < n; i++) {
            fib[i] = fib[i - 1] + fib[i - 2];
        }
        return fib;
    };

    const fibSequence = generateFibonacci(100);
    const correctPassword = '4181'; // フィボナッチ数列の20番目

    const createGridDisplay = () => {
        const grid = [];
        for (let i = 0; i < 100; i++) {
            const row = Math.floor(i / 10);
            const col = i % 10;
            
            let content;
            if (i === 19) { // 20番目（0インデックス）= 4181
                content = '????';
            } else {
                content = fibSequence[i]?.toString() || '0';
            }

            grid.push({
                id: `cell-${i}`,
                content,
                x: col * 80 + 50,
                y: row * 50 + 100,
            });
        }
        return grid;
    };

    const gridCells = createGridDisplay();

    useEffect(() => {
        // より多くのノイズで格子を完全に隠す
        const noises = [
            { content: '4', x: 120, y: 180 },
            { content: ':D', x: 200, y: 220 },
            { content: '🐢', x: 350, y: 150 },
            { content: '25', x: 450, y: 300 },
            { content: '#', x: 150, y: 350 },
            { content: '∆', x: 320, y: 280 },
            { content: '✓', x: 480, y: 180 },
            { content: '@', x: 250, y: 400 },
            { content: '∞', x: 380, y: 240 },
            { content: '♦', x: 180, y: 480 },
            { content: '§', x: 420, y: 380 },
            { content: '★', x: 300, y: 160 },
            { content: '⚡', x: 500, y: 450 },
            { content: '◉', x: 160, y: 280 },
            { content: '※', x: 440, y: 210 },
            { content: '▲', x: 280, y: 340 },
            { content: '♠', x: 520, y: 320 },
            { content: '◆', x: 220, y: 460 },
            { content: '⊗', x: 360, y: 380 },
            { content: '✗', x: 140, y: 420 },
        ].map((noise, index) => ({
            id: `noise-${index}`,
            ...noise,
            isDragging: false,
        }));
        setNoiseElements(noises);
    }, []);

    const handleMouseDown = (e: React.MouseEvent, noiseId: string) => {
        const updatedNoises = noiseElements.map(noise =>
            noise.id === noiseId ? { ...noise, isDragging: true } : noise
        );
        setNoiseElements(updatedNoises);

        const handleMouseMove = (e: MouseEvent) => {
            setNoiseElements(prev => prev.map(noise =>
                noise.id === noiseId
                    ? { ...noise, x: e.clientX - 20, y: e.clientY - 20 }
                    : noise
            ));
        };

        const handleMouseUp = () => {
            setNoiseElements(prev => prev.map(noise =>
                noise.id === noiseId ? { ...noise, isDragging: false } : noise
            ));
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handlePasswordSubmit = () => {
        if (notePassword === correctPassword) {
            setIsNoteUnlocked(true);
            setShowLockedNote(true);
            setTimeout(() => {
                setIsTransitioning(true);
                setTimeout(() => {
                    onStageComplete();
                }, 2000);
            }, 3000);
        }
    };

    return (
        <div className="h-screen bg-gray-800 text-white overflow-hidden relative select-none">
            {/* デスクトップファイル */}
            <div className="absolute z-20" style={{ top: '50px', left: '40px' }}>
                {/* note.txt */}
                <div
                    className="flex flex-col items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-50 p-4 w-24 transition-colors rounded"
                    onClick={() => setShowNote(true)}
                    style={{ marginBottom: '40px' }}
                >
                    {/* ファイルアイコン */}
                    <div className="mb-3">
                        <svg width="40" height="48" viewBox="0 0 40 48" className="pixelated">
                            <rect x="2" y="2" width="28" height="44" fill="white" stroke="#333" strokeWidth="2"/>
                            <polygon points="30,2 30,12 40,12 40,46 2,46 2,2" fill="white" stroke="#333" strokeWidth="2"/>
                            <polygon points="30,2 40,12 30,12" fill="#ddd" stroke="#333" strokeWidth="1"/>
                            <rect x="6" y="18" width="20" height="2" fill="#666"/>
                            <rect x="6" y="22" width="24" height="2" fill="#666"/>
                            <rect x="6" y="26" width="18" height="2" fill="#666"/>
                        </svg>
                    </div>
                    <div className="text-xs font-mono text-center text-white leading-tight">note.txt</div>
                </div>
                
                {/* hope.txt */}
                <div
                    className="flex flex-col items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-50 p-4 w-24 transition-colors rounded"
                    onClick={() => setShowLockedNote(true)}
                >
                    {/* ファイルアイコン */}
                    <div className="mb-3">
                        <svg width="40" height="48" viewBox="0 0 40 48" className="pixelated">
                            <rect x="2" y="2" width="28" height="44" fill="white" stroke="#333" strokeWidth="2"/>
                            <polygon points="30,2 30,12 40,12 40,46 2,46 2,2" fill="white" stroke="#333" strokeWidth="2"/>
                            <polygon points="30,2 40,12 30,12" fill="#ddd" stroke="#333" strokeWidth="1"/>
                            <rect x="6" y="18" width="20" height="2" fill="#666"/>
                            <rect x="6" y="22" width="24" height="2" fill="#666"/>
                            <rect x="6" y="26" width="18" height="2" fill="#666"/>
                        </svg>
                    </div>
                    <div className="text-xs font-mono text-center text-white leading-tight">hope.txt</div>
                </div>
            </div>

            {/* note.txt ウィンドウ */}
            {showNote && (
                <>
                    {/* 背景オーバーレイ */}
                    <div className="fixed inset-0 bg-black bg-opacity-30 z-30"></div>
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                        <div 
                            className="shadow-2xl"
                            style={{
                                backgroundColor: '#c0c0c0',
                                border: '2px solid',
                                borderTopColor: 'white',
                                borderLeftColor: 'white', 
                                borderRightColor: '#808080',
                                borderBottomColor: '#808080'
                            }}
                        >
                            {/* タイトルバー */}
                            <div 
                                className="flex justify-between items-center font-mono text-sm px-2 py-1"
                                style={{ backgroundColor: '#0000aa', color: 'white' }}
                            >
                                <span>note.txt - Notepad</span>
                                <button
                                    onClick={() => setShowNote(false)}
                                    className="px-2 hover:bg-gray-400"
                                    style={{
                                        backgroundColor: '#c0c0c0',
                                        color: 'black',
                                        border: '1px solid #808080'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            {/* コンテンツエリア */}
                            <div className="bg-white text-black p-4 font-mono text-sm" style={{ width: '350px', height: '200px', marginTop: '6px' }}>
                                <div className="whitespace-pre-line">
                                    I think my time is over...{'\n'}
                                    After 20 years, I'm tired.{'\n'}
                                    Please set me free.
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* hope.txt ウィンドウ */}
            {showLockedNote && (
                <>
                    {/* 背景オーバーレイ */}
                    <div className="fixed inset-0 bg-black bg-opacity-30 z-30"></div>
                    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
                        <div 
                            className="shadow-2xl"
                            style={{
                                backgroundColor: '#c0c0c0',
                                border: '2px solid',
                                borderTopColor: 'white',
                                borderLeftColor: 'white', 
                                borderRightColor: '#808080',
                                borderBottomColor: '#808080'
                            }}
                        >
                            {/* タイトルバー */}
                            <div 
                                className="flex justify-between items-center font-mono text-sm px-2 py-1"
                                style={{ backgroundColor: '#0000aa', color: 'white' }}
                            >
                                <span>hope.txt - Notepad</span>
                                <button
                                    onClick={() => setShowLockedNote(false)}
                                    className="px-2 hover:bg-gray-400"
                                    style={{
                                        backgroundColor: '#c0c0c0',
                                        color: 'black',
                                        border: '1px solid #808080'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                            {/* コンテンツエリア */}
                            <div className="bg-white text-black p-4 font-mono text-sm" style={{ width: '350px', height: '200px', marginTop: '6px' }}>
                                {!isNoteUnlocked ? (
                                    <div>
                                        <div className="mb-3">Password required (4 digits):</div>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                maxLength={4}
                                                value={notePassword}
                                                onChange={(e) => setNotePassword(e.target.value)}
                                                className="border border-gray-400 px-2 py-1 w-16 text-center"
                                            />
                                            <button
                                                onClick={handlePasswordSubmit}
                                                className="bg-gray-200 hover:bg-gray-300 border border-gray-400 px-3 py-1 text-xs"
                                            >
                                                OK
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-red-600 font-bold whitespace-pre-line">
                                        SUPER USER{'\n'}
                                        REMOVE{'\n'}
                                        RECURSIVELY{'\n'}
                                        FORCE{'\n'}
                                        ALL
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* トランジション */}
            {isTransitioning && (
                <div className="absolute inset-0 bg-black z-50 flex items-center justify-center">
                    <div className="text-red-400 text-xl font-mono animate-pulse">
                        SYSTEM CORRUPTION DETECTED...
                    </div>
                </div>
            )}

            <style jsx>{`
                .pixelated {
                    image-rendering: -moz-crisp-edges;
                    image-rendering: -webkit-crisp-edges;
                    image-rendering: pixelated;
                    image-rendering: crisp-edges;
                }
            `}</style>
        </div>
    );
};

export default Stage3; 
