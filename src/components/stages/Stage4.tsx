import React, { useState, useEffect } from 'react';
import { StageProps } from '../../types';

interface Setting {
    id: string;
    type: 'slider' | 'toggle' | 'checkbox';
    label: string;
    value: number | boolean;
    min?: number;
    max?: number;
    target: number | boolean;
}

const Stage4: React.FC<StageProps> = ({ onStageComplete }) => {
    const [settings, setSettings] = useState<Setting[]>([
        { id: 'freq', type: 'slider', label: 'FREQUENCY', value: 0, min: 0, max: 100, target: 42 },
        { id: 'amp', type: 'slider', label: 'AMPLITUDE', value: 50, min: 0, max: 100, target: 73 },
        { id: 'secure', type: 'toggle', label: 'SECURE_MODE', value: false, target: true },
        { id: 'debug', type: 'toggle', label: 'DEBUG_OUTPUT', value: true, target: false },
        { id: 'bypass', type: 'checkbox', label: 'BYPASS_AUTH', value: false, target: true },
    ]);

    const [systemStatus, setSystemStatus] = useState('UNSTABLE');
    const [showHints, setShowHints] = useState(false);

    useEffect(() => {
        // Calculate system status based on settings
        const freq = settings.find(s => s.id === 'freq')?.value as number;
        const amp = settings.find(s => s.id === 'amp')?.value as number;
        const secure = settings.find(s => s.id === 'secure')?.value as boolean;
        const debug = settings.find(s => s.id === 'debug')?.value as boolean;
        const bypass = settings.find(s => s.id === 'bypass')?.value as boolean;

        if (freq === 42 && amp === 73 && secure && !debug && bypass) {
            setSystemStatus('STABLE');
        } else if (freq >= 40 && freq <= 45 && secure) {
            setSystemStatus('STABILIZING');
        } else {
            setSystemStatus('UNSTABLE');
        }
    }, [settings]);

    const updateSetting = (id: string, value: number | boolean) => {
        setSettings(prev => prev.map(setting =>
            setting.id === id ? { ...setting, value } : setting
        ));
    };

    const isSystemStable = () => {
        return systemStatus === 'STABLE';
    };

    const handleProceed = () => {
        if (isSystemStable()) {
            onStageComplete();
        }
    };

    // Background calculation hints
    const backgroundEquations = [
        "sin(x) = 0.669... → x ≈ 42°",
        "√5329 = 73",
        "SECURE = !VULNERABLE",
        "DEBUG ⊕ PRODUCTION = 1",
        "AUTH_BYPASS = ROOT_ACCESS"
    ];

    return (
        <div className="h-screen bg-black text-white overflow-hidden relative">
            {/* Background equations */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="p-8 font-mono text-xs space-y-4">
                    {backgroundEquations.map((eq, index) => (
                        <div key={index} className="text-green-400">
                            {eq}
                        </div>
                    ))}
                </div>
            </div>

            {/* System status */}
            <div className="absolute top-4 right-4 text-right">
                <div className="text-xs text-gray-400 mb-1">SYSTEM STATUS</div>
                <div className={`text-lg font-mono font-bold ${systemStatus === 'STABLE' ? 'text-green-400' :
                        systemStatus === 'STABILIZING' ? 'text-yellow-400' :
                            'text-red-400'
                    }`}>
                    {systemStatus}
                </div>
            </div>

            {/* Main interface */}
            <div className="flex flex-col items-center justify-center h-full space-y-8">
                <h1 className="text-4xl font-mono mb-8 text-green-400">ENVIRONMENT CONFIG</h1>

                <div className="space-y-6 w-96">
                    {settings.map((setting) => (
                        <div key={setting.id} className="space-y-2">
                            <label className="block text-sm font-mono text-gray-300">
                                {setting.label}
                            </label>

                            {setting.type === 'slider' && (
                                <div className="space-y-1">
                                    <input
                                        type="range"
                                        min={setting.min}
                                        max={setting.max}
                                        value={setting.value as number}
                                        onChange={(e) => updateSetting(setting.id, parseInt(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                                    />
                                    <div className="text-right text-xs text-gray-400">
                                        {setting.value}
                                    </div>
                                </div>
                            )}

                            {setting.type === 'toggle' && (
                                <div
                                    onClick={() => updateSetting(setting.id, !setting.value)}
                                    className={`w-12 h-6 rounded-full cursor-pointer transition-colors ${setting.value ? 'bg-green-600' : 'bg-gray-600'
                                        }`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-transform transform ${setting.value ? 'translate-x-7 mt-1' : 'translate-x-1 mt-1'
                                        }`}></div>
                                </div>
                            )}

                            {setting.type === 'checkbox' && (
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={setting.value as boolean}
                                        onChange={(e) => updateSetting(setting.id, e.target.checked)}
                                        className="w-4 h-4 text-green-600 bg-gray-900 border-gray-600 rounded focus:ring-green-500"
                                    />
                                    <span className="text-xs text-gray-400">Enable</span>
                                </label>
                            )}
                        </div>
                    ))}
                </div>

                {isSystemStable() && (
                    <button
                        onClick={handleProceed}
                        className="btn-stage0 mt-8 animate-pulse"
                    >
                        APPLY CONFIGURATION
                    </button>
                )}

                <button
                    onClick={() => setShowHints(!showHints)}
                    className="text-xs text-gray-600 hover:text-gray-400 transition-colors"
                >
                    {showHints ? 'Hide' : 'Show'} Background Calculations
                </button>
            </div>

            {/* Corrupted display areas */}
            <div className="absolute bottom-10 left-10 w-32 h-16 border border-red-600 bg-red-900 bg-opacity-20">
                <div className="p-2 text-xs text-red-400 font-mono">
                    <div className="animate-pulse">ERROR_CODE</div>
                    <div>0x{(73).toString(16).toUpperCase()}</div>
                </div>
            </div>

            {/* Noise overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="noise-bg w-full h-full"></div>
            </div>
        </div>
    );
};

export default Stage4; 
