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
        setTimeout(() => {
            setPrimaryLoginAttempt(false);
        }, 2000);
    };

    const handleBackupLogin = () => {
        if (backupUsername === 'admin' && backupPassword === 'secret') {
            onStageComplete();
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
                        <h1 className="text-3xl font-mono mb-2 text-blue-300">BACKUP LOGIN</h1>
                        <p className="text-blue-400 text-sm">Secondary Authentication System</p>
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
                            AUTHENTICATE
                        </button>
                    </div>

                    <div className="mt-6 text-center text-xs font-mono text-blue-400">
                        ✓ SECURE CONNECTION ESTABLISHED
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
                {/* メイン認証インターフェース */}
                <div className="h-full w-full flex items-center justify-center">
                    <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border border-gray-600/50 shadow-2xl relative">
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

                        <div className="space-y-6 w-80">
                            <div>
                                <label className="block text-sm font-mono mb-2 text-gray-300">
                                    USERNAME
                                </label>
                                <input
                                    type="text"
                                    value={primaryUsername}
                                    onChange={(e) => setPrimaryUsername(e.target.value)}
                                    onKeyPress={(e) => handleKeyPress(e, false)}
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded font-mono text-white focus:outline-none focus:border-red-400 transition-colors"
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
                                    className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded font-mono text-white focus:outline-none focus:border-red-400 transition-colors"
                                    placeholder="Enter password"
                                />
                            </div>

                            <button
                                onClick={handlePrimaryLogin}
                                className="w-full p-3 bg-red-600 hover:bg-red-500 rounded font-mono transition-colors duration-300"
                            >
                                LOGIN
                            </button>

                            {primaryLoginAttempt && (
                                <div className="text-center text-red-400 text-sm font-mono animate-pulse">
                                    ❌ Authentication Failed
                                </div>
                            )}
                        </div>

                        <div className="mt-6 flex justify-center space-x-4 text-xs font-mono">
                            <div className="flex items-center space-x-1">
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                                <span className="text-gray-400">SYSTEM ERROR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Stage1; 
