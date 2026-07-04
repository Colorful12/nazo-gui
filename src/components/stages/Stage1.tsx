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
        if (backupUsername === 'admin' && backupPassword === 'haru73cat') {
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

    // 付箋コンポーネント
    const StickyNote = ({ text, position, rotate, color, width = '120px' }: {
        text: React.ReactNode;
        position: string;
        rotate: number;
        color: string;
        width?: string;
    }) => (
        <div
            className={`absolute ${position} ${color} px-3 py-2 shadow-md text-black text-sm`}
            style={{
                transform: `rotate(${rotate}deg)`,
                fontFamily: "'Comic Sans MS', cursive",
                width,
                whiteSpace: 'pre-line',
                lineHeight: 1.3
            }}
        >
            {text}
        </div>
    );

    return (
        <div 
            className="h-screen w-screen bg-black text-white relative overflow-hidden"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {/* プライマリ認証システム */}
            <div className="absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center">
                <StickyNote text={"coffee break\n3pm"} position="top-[10%] left-[10%]" rotate={-6} color="bg-yellow-200" />
                <StickyNote
                    text={
                        <>
                            <div style={{ textDecoration: 'line-through' }}>☑ reply to email</div>
                            <div>◻ finish slides</div>
                            <div>◻ order coffee</div>
                        </>
                    }
                    position="top-[15%] right-[12%]"
                    rotate={5}
                    color="bg-pink-200"
                    width="170px"
                />
                <StickyNote text={"admin\nharu73cat"} position="bottom-[15%] left-[13%]" rotate={3} color="bg-yellow-200" />
                <StickyNote text={"team lunch\nFriday!"} position="bottom-[18%] right-[15%]" rotate={-4} color="bg-blue-200" />
                <StickyNote text={"wifi pw:\nSunshine99"} position="top-[45%] left-[6%]" rotate={7} color="bg-green-200" />
                <div
                    style={{
                        backgroundColor: '#c0c0c0',
                        border: '2px solid',
                        borderTopColor: 'white',
                        borderLeftColor: 'white',
                        borderRightColor: '#808080',
                        borderBottomColor: '#808080'
                    }}
                >
                    <div
                        className="h-7"
                        style={{ backgroundColor: '#0000aa' }}
                    />

                    <div className="p-8">
                        <div className="text-center mb-6">
                            <h1 className="text-xl font-mono mb-2 text-black">I'VE BEEN WAITING</h1>
                            <p className="text-black text-sm">Well done finding this, first timer</p>
                        </div>

                        <div className="space-y-4 w-72">
                            <div>
                                <label className="block text-xs font-mono mb-1 text-black">
                                    USERNAME
                                </label>
                                <input
                                    type="text"
                                    value={backupUsername}
                                    onChange={(e) => setBackupUsername(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, true)}
                                    className="w-full px-2 py-2 font-mono text-black focus:outline-none"
                                    style={{
                                        backgroundColor: 'white',
                                        border: '2px solid',
                                        borderTopColor: '#808080',
                                        borderLeftColor: '#808080',
                                        borderRightColor: 'white',
                                        borderBottomColor: 'white'
                                    }}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono mb-1 text-black">
                                    PASSWORD
                                </label>
                                <input
                                    type="password"
                                    value={backupPassword}
                                    onChange={(e) => setBackupPassword(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, true)}
                                    className="w-full px-2 py-2 font-mono text-black focus:outline-none"
                                    style={{
                                        backgroundColor: 'white',
                                        border: '2px solid',
                                        borderTopColor: '#808080',
                                        borderLeftColor: '#808080',
                                        borderRightColor: 'white',
                                        borderBottomColor: 'white'
                                    }}
                                />
                            </div>

                            <button
                                onClick={handleBackupLogin}
                                className="w-full py-2 text-sm font-mono text-black"
                                style={{
                                    backgroundColor: '#c0c0c0',
                                    border: '2px solid',
                                    borderTopColor: 'white',
                                    borderLeftColor: 'white',
                                    borderRightColor: '#808080',
                                    borderBottomColor: '#808080'
                                }}
                            >
                                LOGIN
                            </button>
                        </div>
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
                    <div className="fixed top-[15%] left-[10%] text-gray-500 text-sm font-mono">qwerty123</div>
                    <div className="fixed top-[25%] right-[20%] text-gray-500 text-xs font-mono">123456789</div>
                    <div className="fixed top-[40%] left-[5%] text-gray-500 text-lg font-mono">sunshine1</div>
                    <div className="fixed top-[60%] right-[15%] text-gray-500 text-sm font-mono">p@ssw0rd</div>
                    <HintWord word="leftover2001" hintPart="left" position="top-[70%] left-[25%]" size="text-xs" revealAt={10} />
                    <div className="fixed top-[20%] left-[60%] text-gray-500 text-sm font-mono">iloveyou</div>
                    <div className="fixed top-[80%] right-[30%] text-gray-500 text-xs font-mono">monkey123</div>
                    <div className="fixed top-[18%] right-[5%] text-gray-500 text-sm font-mono">asdfghjk</div>
                    <div className="fixed top-[55%] left-[70%] text-gray-500 text-xs font-mono">dragon55</div>
                    <div className="fixed top-[10%] right-[45%] text-gray-500 text-sm font-mono">shadow99</div>
                    <div className="fixed top-[95%] left-[40%] text-gray-500 text-xs font-mono">l3tm3in</div>
                    <div className="fixed top-[85%] left-[15%] text-gray-500 text-sm font-mono">baseball1</div>
                    <div className="fixed top-[30%] left-[80%] text-gray-500 text-xs font-mono">zxcvbnm1</div>
                    <div className="fixed top-[65%] right-[50%] text-gray-500 text-sm font-mono">princess1</div>
                    <div className="fixed top-[75%] left-[50%] text-gray-500 text-xs font-mono">whatever1</div>

                    <HintWord word="upperclass99" hintPart="upper" position="top-[8%] left-[35%]" size="text-xs" revealAt={8} />
                    <div className="fixed top-[32%] right-[10%] text-gray-500 text-sm font-mono">1qaz2wsx</div>
                    <div className="fixed top-[52%] left-[15%] text-gray-500 text-xs font-mono">michael99</div>
                    <div className="fixed top-[12%] right-[35%] text-gray-500 text-sm font-mono">h4ck3r99</div>
                    <div className="fixed top-[67%] left-[65%] text-gray-500 text-xs font-mono">coffee888</div>
                    <HintWord word="mailbox2003" hintPart="box" position="top-[38%] right-[65%]" size="text-sm" revealAt={5} />
                    <div className="fixed top-[88%] left-[40%] text-gray-500 text-xs font-mono">jennifer1</div>
                    <div className="fixed top-[48%] right-[25%] text-gray-500 text-sm font-mono">qwertyuiop</div>
                    <div className="fixed top-[12%] left-[75%] text-gray-500 text-xs font-mono">tamagotchi1</div>
                    <div className="fixed top-[78%] right-[60%] text-gray-500 text-sm font-mono">987654321</div>
                    <div className="fixed top-[58%] left-[85%] text-gray-500 text-xs font-mono">jordan23</div>
                    <div className="fixed top-[58%] right-[75%] text-gray-500 text-sm font-mono">adm1n123</div>
                    <div className="fixed top-[28%] left-[30%] text-gray-500 text-xs font-mono">mnbvcxz1</div>
                    <div className="fixed top-[68%] right-[40%] text-gray-500 text-sm font-mono">aaaaaa11</div>
                    <div className="fixed top-[92%] left-[70%] text-gray-500 text-xs font-mono">dreamcast99</div>
                    <div className="fixed top-[22%] right-[85%] text-gray-500 text-sm font-mono">napster99</div>
                    <div className="fixed top-[62%] left-[8%] text-gray-500 text-xs font-mono">tr0ub4dor</div>
                    <div className="fixed top-[6%] right-[55%] text-gray-500 text-sm font-mono">11223344</div>
                    <div className="fixed top-[86%] left-[55%] text-gray-500 text-xs font-mono">msn2004</div>
                    <div className="fixed top-[86%] right-[15%] text-gray-500 text-sm font-mono">winamp98</div>
                    <div className="fixed top-[82%] left-[92%] text-gray-500 text-xs font-mono">111222333</div>
                    <div className="fixed top-[76%] right-[8%] text-gray-500 text-sm font-mono">poiuytr9</div>
                    <div className="fixed top-[16%] left-[20%] text-gray-500 text-xs font-mono">footballfan</div>
                    <div className="fixed top-[56%] right-[92%] text-gray-500 text-sm font-mono">mydog2003</div>
                    <div className="fixed top-[26%] left-[48%] text-gray-500 text-xs font-mono">xxxxxx99</div>
                    <div className="fixed top-[82%] right-[70%] text-gray-500 text-sm font-mono">aol4ever</div>
                    <div className="fixed top-[14%] left-[88%] text-gray-500 text-xs font-mono">dialup56k</div>
                    <div className="fixed top-[74%] right-[22%] text-gray-500 text-sm font-mono">bluesky90</div>
                    <div className="fixed top-[44%] left-[22%] text-gray-500 text-xs font-mono">zzzz2020</div>
                    <div className="fixed top-[84%] right-[48%] text-gray-500 text-sm font-mono">00000000</div>
                    <div className="fixed top-[4%] left-[62%] text-gray-500 text-xs font-mono">geocities99</div>
                </div>
                {/* メイン認証インターフェース */}
                <div className="h-full w-full flex items-center justify-center">
                    <div
                        className="relative z-20"
                        style={{
                            backgroundColor: '#c0c0c0',
                            border: '2px solid',
                            borderTopColor: 'white',
                            borderLeftColor: 'white',
                            borderRightColor: '#808080',
                            borderBottomColor: '#808080'
                        }}
                    >
                        <div
                            className="h-7 flex items-center"
                            style={{ backgroundColor: '#aa0000' }}
                        >
                            {/* システム設定パネル(ドラッグハンドル) */}
                            <div
                                className="w-4 h-4 ml-2 cursor-default"
                                onMouseDown={handleMouseDown}
                            />
                        </div>

                        <div className="p-10">
                            <div className="text-center mb-6">
                                <h1 className="text-xl font-mono mb-2 text-black tracking-wide">SECURE LOGIN</h1>
                                <p className="text-black text-sm">Authentication Required</p>
                            </div>

                            <div className="space-y-4 w-96">
                                <div>
                                    <label className="block text-xs font-mono mb-1 text-black">
                                        USERNAME
                                    </label>
                                    <input
                                        type="text"
                                        value={primaryUsername}
                                        onChange={(e) => setPrimaryUsername(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, false)}
                                        className="w-full px-2 py-2 font-mono text-black focus:outline-none"
                                        style={{
                                            backgroundColor: 'white',
                                            border: '2px solid',
                                            borderTopColor: '#808080',
                                            borderLeftColor: '#808080',
                                            borderRightColor: 'white',
                                            borderBottomColor: 'white'
                                        }}
                                        placeholder="Enter username"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono mb-1 text-black">
                                        PASSWORD
                                    </label>
                                    <input
                                        type="password"
                                        value={primaryPassword}
                                        onChange={(e) => setPrimaryPassword(e.target.value)}
                                        onKeyPress={(e) => handleKeyPress(e, false)}
                                        className="w-full px-2 py-2 font-mono text-black focus:outline-none"
                                        style={{
                                            backgroundColor: 'white',
                                            border: '2px solid',
                                            borderTopColor: '#808080',
                                            borderLeftColor: '#808080',
                                            borderRightColor: 'white',
                                            borderBottomColor: 'white'
                                        }}
                                        placeholder="Enter password"
                                    />
                                </div>

                                <button
                                    onClick={handlePrimaryLogin}
                                    className="w-full py-2 text-sm font-mono text-black"
                                    style={{
                                        backgroundColor: '#c0c0c0',
                                        border: '2px solid',
                                        borderTopColor: 'white',
                                        borderLeftColor: 'white',
                                        borderRightColor: '#808080',
                                        borderBottomColor: '#808080'
                                    }}
                                >
                                    LOGIN
                                </button>

                                {primaryLoginAttempt && (
                                    <div className="text-center text-red-700 text-sm font-mono animate-pulse">
                                        AUTHENTICATION FAILED
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stage1; 
