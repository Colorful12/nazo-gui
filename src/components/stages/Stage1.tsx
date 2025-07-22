import React, { useState, useEffect, useRef } from 'react';
import { StageProps } from '../../types';

const Stage1: React.FC<StageProps> = ({ onStageComplete }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [fakeUsername, setFakeUsername] = useState('user01');
    const [fakePassword, setFakePassword] = useState('password123');
    const [showHint, setShowHint] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
    const [fakePosition, setFakePosition] = useState({ x: 0, y: 0 });
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [systemMessage, setSystemMessage] = useState('');

    const fakeFormRef = useRef<HTMLDivElement>(null);

    // 初期位置設定
    useEffect(() => {
        setFakePosition({ x: 0, y: 0 });
    }, []);

    // 5秒後にヒント表示
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowHint(true);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    // ドラッグ処理
    const handlePointerDown = (e: React.PointerEvent) => {
        if (!fakeFormRef.current) return;

        setIsDragging(true);
        const rect = fakeFormRef.current.getBoundingClientRect();
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
    };

    const handlePointerMove = (e: React.PointerEvent) => {
        if (!isDragging) return;

        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        setFakePosition({ x: newX, y: newY });
    };

    const handlePointerUp = () => {
        setIsDragging(false);
    };

    // 偽フォームのクリック処理
    const handleFakeClick = () => {
        setFakePosition(prev => ({
            x: prev.x + (Math.random() - 0.5) * 10,
            y: prev.y + (Math.random() - 0.5) * 10
        }));
    };

    // 本物のログイン処理
    const handleRealLogin = () => {
        setLoginAttempts(prev => prev + 1);

        if (username === 'admin' && password === 'escape') {
            setSystemMessage('ACCESS GRANTED. Transferring to next stage...');
            setTimeout(() => {
                onStageComplete();
            }, 2000);
        } else {
            setSystemMessage(`ACCESS DENIED. Attempt ${loginAttempts + 1}/∞`);
            setUsername('');
            setPassword('');
        }
    };

    // 偽フォームのsubmit処理
    const handleFakeSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSystemMessage('Interface unresponsive. System may be compromised.');
    };

    return (
        <div className="fixed inset-0 bg-black text-white overflow-hidden">
            {/* 本物のログインフォーム（背後） */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-gray-800 border border-gray-600 p-8 w-96">
                    <div className="text-center text-xl mb-8">
                        NEURAL ACCESS TERMINAL
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm mb-2">NEURAL ID:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter neural ID"
                                className="w-full bg-transparent border-b border-gray-600 text-white p-2"
                                onKeyPress={(e) => e.key === 'Enter' && handleRealLogin()}
                            />
                        </div>

                        <div>
                            <label className="block text-sm mb-2">OVERRIDE TOKEN:</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter override token"
                                className="w-full bg-transparent border-b border-gray-600 text-white p-2"
                                onKeyPress={(e) => e.key === 'Enter' && handleRealLogin()}
                            />
                        </div>

                        <button
                            onClick={handleRealLogin}
                            className="w-full bg-gray-600 text-white p-3 hover:bg-gray-500"
                        >
                            UNLOCK
                        </button>
                    </div>
                </div>
            </div>

            {/* 偽フォームと背景のセット（前面、ドラッグ可能） */}
            <div
                ref={fakeFormRef}
                className="absolute inset-0 z-20 cursor-grab active:cursor-grabbing"
                style={{
                    transform: `translate(${fakePosition.x}px, ${fakePosition.y}px)`,
                    boxShadow: isDragging
                        ? '0 0 20px rgba(255, 255, 255, 0.3)'
                        : '0 0 10px rgba(255, 255, 255, 0.1)'
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerLeave={handlePointerUp}
                onClick={handleFakeClick}
            >
                {/* 偽の背景 */}
                <div className="absolute inset-0 bg-black"></div>

                {/* 偽ログインフォーム */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gray-800 border border-gray-600 p-8 w-96">
                        <div className="text-center text-xl mb-8">
                            SYSTEM LOGIN
                        </div>

                        <form onSubmit={handleFakeSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm mb-2">USER ID:</label>
                                <input
                                    type="text"
                                    value={fakeUsername}
                                    onChange={(e) => setFakeUsername(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-600 text-white p-2"
                                    placeholder="Enter user ID"
                                />
                            </div>

                            <div>
                                <label className="block text-sm mb-2">PASSWORD:</label>
                                <input
                                    type="password"
                                    value={fakePassword}
                                    onChange={(e) => setFakePassword(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-600 text-white p-2"
                                    placeholder="Enter password"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gray-600 text-white p-3 hover:bg-gray-500"
                            >
                                LOGIN
                            </button>
                        </form>
                    </div>
                </div>

                {/* ヒントメッセージ */}
                {showHint && (
                    <div className="absolute bottom-4 right-4 text-yellow-400 bg-black px-4 py-2">
                        This interface seems... unstable.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stage1; 
