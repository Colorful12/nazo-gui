import React, { useState, useRef, useEffect } from 'react';
import { StageProps } from '../../types';

const Stage1: React.FC<StageProps> = ({ onStageComplete }) => {
    // メインシステムの状態
    const [primaryUsername, setPrimaryUsername] = useState('');
    const [primaryPassword, setPrimaryPassword] = useState('');
    const [primaryLoginAttempt, setPrimaryLoginAttempt] = useState(false);
    
    // バックアップシステムの状態
    const [backupUsername, setBackupUsername] = useState('');
    const [backupPassword, setBackupPassword] = useState('');
    
    // 間違い回数のカウント
    const [errorCount, setErrorCount] = useState(0);
    
    // ドラッグ関連の状態
    const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    
    const primaryLayerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsDragging(true);
        setDragOffset({
            x: e.clientX - dragPosition.x,
            y: e.clientY - dragPosition.y
        });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        
        e.preventDefault();
        setDragPosition({
            x: e.clientX - dragOffset.x,
            y: e.clientY - dragOffset.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handlePrimaryLogin = () => {
        setPrimaryLoginAttempt(true);
        setErrorCount(prev => prev + 1);
        setTimeout(() => {
            setPrimaryLoginAttempt(false);
        }, 2000);
    };

    const handleBackupLogin = () => {
        if (backupUsername === 'admin' && backupPassword === 'secret') {
            onStageComplete();
        } else {
            setErrorCount(prev => prev + 1);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent, isBackup: boolean) => {
        if (e.key === 'Enter') {
            if (isBackup) {
                handleBackupLogin();
            } else {
                handlePrimaryLogin();
            }
        }
    };

    // ヒント単語の色変更用コンポーネント
    const HintWord = ({ word, hintPart, position, size, revealAt }: {
        word: string;
        hintPart: string;
        position: string;
        size: string;
        revealAt: number;
    }) => {
        const shouldReveal = errorCount >= revealAt;
        const hintIndex = word.toLowerCase().indexOf(hintPart.toLowerCase());
        
        if (hintIndex === -1) {
            return (
                <div className={`fixed ${position} text-gray-500 ${size} font-mono`}>
                    {word}
                </div>
            );
        }
        
        const beforeHint = word.slice(0, hintIndex);
        const hint = word.slice(hintIndex, hintIndex + hintPart.length);
        const afterHint = word.slice(hintIndex + hintPart.length);
        
        return (
            <div className={`fixed ${position} ${size} font-mono`}>
                <span className="text-gray-500">{beforeHint}</span>
                <span style={{ color: shouldReveal ? '#ff0000' : '#ffffff', transition: 'color 3s ease-in-out' }}>{hint}</span>
                <span className="text-gray-500">{afterHint}</span>
            </div>
        );
    };

    return (
        <div 
            className="h-screen w-screen bg-black text-white relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* プライマリ認証システム */}
            <div className="absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center">
                <div className="bg-blue-800/30 backdrop-blur-sm p-8 rounded-lg border border-blue-400/30 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-mono mb-2 text-blue-300">I'VE BEEN WAITING</h1>
                        <p className="text-blue-400 text-sm">Well done finding this, first timer</p>
                    </div>

                    <div className="space-y-6 w-80">
                        <div>
                            <label className="block text-sm font-mono mb-2 text-blue-300">
                                USERNAME
                            </label>
                            <input
                                type="text"
                                value={backupUsername}
                                onChange={(e) => setBackupUsername(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, true)}
                                className="w-full p-3 bg-blue-900/50 border border-blue-500 rounded font-mono text-white focus:outline-none focus:border-blue-300 transition-colors"
                                placeholder="admin"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-mono mb-2 text-blue-300">
                                PASSWORD
                            </label>
                            <input
                                type="password"
                                value={backupPassword}
                                onChange={(e) => setBackupPassword(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, true)}
                                className="w-full p-3 bg-blue-900/50 border border-blue-500 rounded font-mono text-white focus:outline-none focus:border-blue-300 transition-colors"
                                placeholder="secret"
                            />
                        </div>

                        <button
                            onClick={handleBackupLogin}
                            className="w-full p-3 bg-blue-600 hover:bg-blue-500 rounded font-mono transition-colors duration-300"
                        >
                            LOGIN
                        </button>
                    </div>

                </div>
            </div>

            {/* セキュリティレイヤー */}
            <div
                ref={primaryLayerRef}
                className="absolute select-none"
                style={{
                    transform: `translate(${dragPosition.x}px, ${dragPosition.y}px)`,
                    transition: isDragging ? 'none' : 'transform 0.3s ease-out',
                    width: '100vw',
                    height: '100vh',
                    top: 0,
                    left: 0,
                    backgroundColor: '#000000'
                }}
            >
                <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
                    <div className="fixed top-[15%] left-[10%] text-gray-500 text-sm font-mono">password123</div>
                    <div className="fixed top-[25%] right-[20%] text-gray-500 text-xs font-mono">mydog2021</div>
                    <div className="fixed top-[40%] left-[5%] text-gray-500 text-lg font-mono">sunshine84</div>
                    <div className="fixed top-[60%] right-[15%] text-gray-500 text-sm font-mono">admin1234</div>
                    <HintWord word="lefthand99" hintPart="left" position="top-[70%] left-[25%]" size="text-xs" revealAt={10} />
                    <div className="fixed top-[20%] left-[60%] text-gray-500 text-sm font-mono">family456</div>
                    <div className="fixed top-[80%] right-[30%] text-gray-500 text-xs font-mono">welcome2023</div>
                    <div className="fixed top-[18%] right-[5%] text-gray-500 text-sm font-mono">birthday78</div>
                    <div className="fixed top-[55%] left-[70%] text-gray-500 text-xs font-mono">football01</div>
                    <div className="fixed top-[10%] right-[45%] text-gray-500 text-sm font-mono">pizza2024</div>
                    <div className="fixed top-[95%] left-[40%] text-gray-500 text-xs font-mono">masterkey</div>
                    <div className="fixed top-[85%] left-[15%] text-gray-500 text-sm font-mono">qwerty123</div>
                    <div className="fixed top-[30%] left-[80%] text-gray-500 text-xs font-mono">computer7</div>
                    <div className="fixed top-[65%] right-[50%] text-gray-500 text-sm font-mono">coffee888</div>
                    <div className="fixed top-[75%] left-[50%] text-gray-500 text-xs font-mono">summer2022</div>
                    
                    <HintWord word="uppercat55" hintPart="upper" position="top-[8%] left-[35%]" size="text-xs" revealAt={8} />
                    <div className="fixed top-[32%] right-[10%] text-gray-500 text-sm font-mono">music4life</div>
                    <div className="fixed top-[52%] left-[15%] text-gray-500 text-xs font-mono">user12345</div>
                    <div className="fixed top-[12%] right-[35%] text-gray-500 text-sm font-mono">charlie2019</div>
                    <div className="fixed top-[67%] left-[65%] text-gray-500 text-xs font-mono">bluesky90</div>
                    <HintWord word="toolbox47" hintPart="box" position="top-[38%] right-[65%]" size="text-sm" revealAt={5} />
                    <div className="fixed top-[88%] left-[40%] text-gray-500 text-xs font-mono">dragon123</div>
                    <div className="fixed top-[48%] right-[25%] text-gray-500 text-sm font-mono">rainbow33</div>
                    <div className="fixed top-[12%] left-[75%] text-gray-500 text-xs font-mono">flower2020</div>
                    <div className="fixed top-[78%] right-[60%] text-gray-500 text-sm font-mono">laptop999</div>
                    <div className="fixed top-[58%] left-[85%] text-gray-500 text-xs font-mono">monkey45</div>
                    <div className="fixed top-[58%] right-[75%] text-gray-500 text-sm font-mono">thunder88</div>
                    <div className="fixed top-[28%] left-[30%] text-gray-500 text-xs font-mono">school123</div>
                    <div className="fixed top-[68%] right-[40%] text-gray-500 text-sm font-mono">leftside21</div>
                    <div className="fixed top-[92%] left-[70%] text-gray-500 text-xs font-mono">golden777</div>
                    <div className="fixed top-[22%] right-[85%] text-gray-500 text-sm font-mono">hockey2018</div>
                    <div className="fixed top-[62%] left-[8%] text-gray-500 text-xs font-mono">regular555</div>
                    <div className="fixed top-[6%] right-[55%] text-gray-500 text-sm font-mono">winter2021</div>
                    <div className="fixed top-[86%] left-[55%] text-gray-500 text-xs font-mono">ocean4ever</div>
                    <div className="fixed top-[86%] right-[15%] text-gray-500 text-sm font-mono">secure2023</div>
                    <div className="fixed top-[82%] left-[92%] text-gray-500 text-xs font-mono">superman1</div>
                    <div className="fixed top-[76%] right-[8%] text-gray-500 text-sm font-mono">game123</div>
                    <div className="fixed top-[16%] left-[20%] text-gray-500 text-xs font-mono">normal99cat</div>
                    <div className="fixed top-[56%] right-[92%] text-gray-500 text-sm font-mono">orange44</div>
                    <div className="fixed top-[26%] left-[48%] text-gray-500 text-xs font-mono">travel2024</div>
                    <div className="fixed top-[82%] right-[70%] text-gray-500 text-sm font-mono">kitchen12</div>
                    <div className="fixed top-[14%] left-[88%] text-gray-500 text-xs font-mono">friday777</div>
                    <div className="fixed top-[74%] right-[22%] text-gray-500 text-sm font-mono">garden88</div>
                    <div className="fixed top-[44%] left-[22%] text-gray-500 text-xs font-mono">rightside22</div>
                    <div className="fixed top-[84%] right-[48%] text-gray-500 text-sm font-mono">phone2022</div>
                    <div className="fixed top-[4%] left-[62%] text-gray-500 text-xs font-mono">river333</div>
                </div>
                {/* メイン認証インターフェース */}
                <div className="h-full w-full flex items-center justify-center">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-16 rounded-lg border border-gray-600/50 shadow-2xl relative max-w-2xl">
                        {/* システム設定パネル */}
                        <div 
                            className="absolute top-2 left-2 w-12 h-12 cursor-default bg-gray-800 hover:bg-gray-700 transition-colors rounded"
                            onMouseDown={handleMouseDown}
                        >
                            <div className="w-full h-full flex items-center justify-center text-transparent text-xs">
                                DRAG
                            </div>
                        </div>
                        
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-mono mb-2">SECURE LOGIN</h1>
                            <p className="text-gray-400 text-sm">Authentication Required</p>
                        </div>

                        <div className="space-y-8 w-[500px]">
                            <div>
                                <label className="block text-sm font-mono mb-2 text-gray-300">
                                    USERNAME
                                </label>
                                <input
                                    type="text"
                                    value={primaryUsername}
                                    onChange={(e) => setPrimaryUsername(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, false)}
                                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded font-mono text-white focus:outline-none focus:border-red-400 transition-colors text-lg"
                                    placeholder="Enter username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-mono mb-2 text-gray-300">
                                    PASSWORD
                                </label>
                                <input
                                    type="password"
                                    value={primaryPassword}
                                    onChange={(e) => setPrimaryPassword(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, false)}
                                    className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded font-mono text-white focus:outline-none focus:border-red-400 transition-colors text-lg"
                                    placeholder="Enter password"
                                />
                            </div>

                            <button
                                onClick={handlePrimaryLogin}
                                className="w-full p-4 bg-red-600 hover:bg-red-500 rounded font-mono transition-colors duration-300 text-lg"
                            >
                                LOGIN
                            </button>

                            {primaryLoginAttempt && (
                                <div className="text-center text-red-400 text-sm font-mono animate-pulse">
                                    ❌ Authentication Failed
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stage1; 
