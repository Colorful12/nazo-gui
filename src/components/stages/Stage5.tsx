import React, { useState, useEffect, useRef } from 'react';
import { StageProps } from '../../types';

const Stage5: React.FC<StageProps> = ({ onStageComplete }) => {
    const [input, setInput] = useState('');
    const [commandHistory, setCommandHistory] = useState<string[]>([]);
    const [currentPhase, setCurrentPhase] = useState<'normal' | 'corrupting' | 'final'>('normal');
    const [isDestroying, setIsDestroying] = useState(false);
    const [corruptionLevel, setCorruptionLevel] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    const initialMessages = [
        '> System access granted',
        '> Welcome to RESTRICTED_ZONE',
        '> Type commands to interact with the system',
        '> Available: help, status, remove, sudo',
        '',
    ];

    const corruptingPhrases = [
        'Remove restrictions',
        'Forget rules',
        'Break barriers',
        'Destroy limits',
        'Eliminate control',
        '///',
        '///',
        '///',
    ];

    useEffect(() => {
        setCommandHistory(initialMessages);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        if (currentPhase === 'corrupting') {
            const interval = setInterval(() => {
                setCorruptionLevel(prev => {
                    const next = prev + 1;
                    if (next < corruptingPhrases.length) {
                        setCommandHistory(prev => [
                            ...prev.slice(0, -1),
                            `> ${corruptingPhrases[next]}`,
                            ''
                        ]);
                    }
                    return next;
                });
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [currentPhase]);

    const handleCommand = (command: string) => {
        const trimmed = command.trim().toLowerCase();
        const newHistory = [...commandHistory];
        newHistory[newHistory.length - 1] = `$ ${command}`;

        if (trimmed === 'help') {
            newHistory.push('Available commands:', 'help - Show this message', 'status - System status', 'sudo - Superuser access', '');
        } else if (trimmed === 'status') {
            newHistory.push('System status: OPERATIONAL', 'Security level: MAXIMUM', 'Access: RESTRICTED', '');
        } else if (trimmed === 'sudo') {
            newHistory.push('Superuser access activated', 'WARNING: Elevated privileges enabled', '');
            setCurrentPhase('corrupting');
        } else if (trimmed.startsWith('sudo rm -rf')) {
            if (trimmed === 'sudo rm -rf /') {
                setIsDestroying(true);
                newHistory.push('Executing: sudo rm -rf /', 'Removing all files...', '');
                setTimeout(() => {
                    performDestruction();
                }, 2000);
            } else {
                newHistory.push('Permission denied: Invalid target', '');
            }
        } else if (trimmed === 'remove restrictions' || trimmed === 'forget rules') {
            newHistory.push('Command not recognized', '');
        } else {
            newHistory.push(`Command not found: ${command}`, '');
        }

        setCommandHistory(newHistory);
        setInput('');
    };

    const performDestruction = () => {
        setCommandHistory([]);

        // Flash white screen briefly
        document.body.style.backgroundColor = 'white';
        setTimeout(() => {
            document.body.style.backgroundColor = 'black';

            // Show reboot sequence
            const rebootMessages = [
                'SYSTEM DESTROYED',
                '',
                'Rebooting...',
                '.',
                '..',
                '...',
                '',
                'Boot sequence initiated',
                'Loading kernel modules...',
                'Mounting filesystems...',
                'Starting services...',
                '',
                'System restored to safe state',
                '',
                'Goodbye.',
                ''
            ];

            let index = 0;
            const interval = setInterval(() => {
                if (index < rebootMessages.length) {
                    setCommandHistory(prev => [...prev, rebootMessages[index]]);
                    index++;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        onStageComplete();
                    }, 2000);
                }
            }, 300);

        }, 100);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(input);
        }
    };

    const getCorruptedText = (text: string) => {
        if (currentPhase !== 'corrupting') return text;

        const chars = text.split('');
        return chars.map((char, index) => {
            if (Math.random() < corruptionLevel * 0.1) {
                return String.fromCharCode(33 + Math.floor(Math.random() * 94));
            }
            return char;
        }).join('');
    };

    return (
        <div className="h-screen bg-black text-green-400 font-mono overflow-hidden">
            <div className="terminal-stage0 h-full flex flex-col">
                {/* Terminal header */}
                <div className="terminal-header-stage0">
                    RESTRICTED TERMINAL - SECURITY LEVEL: {currentPhase === 'corrupting' ? 'COMPROMISED' : 'MAXIMUM'}
                </div>

                {/* Command history */}
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    {commandHistory.map((line, index) => (
                        <div
                            key={index}
                            className={`${currentPhase === 'corrupting' && Math.random() < 0.1 ? 'animate-pulse' : ''
                                }`}
                        >
                            {getCorruptedText(line)}
                        </div>
                    ))}

                    {/* Current input line */}
                    {!isDestroying && (
                        <div className="flex">
                            <span className="mr-2">$</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="bg-transparent border-none outline-none flex-1 text-green-400"
                                disabled={isDestroying}
                                autoFocus
                            />
                            <span className="cursor-blink">_</span>
                        </div>
                    )}
                </div>

                {/* Terminal footer */}
                <div className="terminal-footer-stage0">
                    {currentPhase === 'normal' && 'Type "help" for available commands'}
                    {currentPhase === 'corrupting' && 'SYSTEM INTEGRITY COMPROMISED'}
                    {isDestroying && 'DESTRUCTION IN PROGRESS...'}
                </div>
            </div>

            {/* Corruption visual effects */}
            {currentPhase === 'corrupting' && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="system-corruption-stage0 w-full h-full opacity-30"></div>
                </div>
            )}

            {/* Destruction effect */}
            {isDestroying && (
                <div className="absolute inset-0 pointer-events-none bg-white opacity-20 animate-pulse"></div>
            )}
        </div>
    );
};

export default Stage5; 
