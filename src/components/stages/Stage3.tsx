import React, { useState, useRef } from 'react';
import { StageProps } from '../../types';

interface UIPart {
    id: string;
    type: 'input' | 'label' | 'button' | 'dummy';
    content: string;
    correctOrder: number;
    x: number;
    y: number;
}

const Stage3: React.FC<StageProps> = ({ onStageComplete }) => {
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [dropZones, setDropZones] = useState<Array<UIPart | null>>([null, null, null, null]);
    const dragRef = useRef<{ offsetX: number; offsetY: number }>({ offsetX: 0, offsetY: 0 });

    const initialParts: UIPart[] = [
        { id: 'label1', type: 'label', content: 'USERNAME:', correctOrder: 0, x: 50, y: 100 },
        { id: 'input1', type: 'input', content: '', correctOrder: 1, x: 200, y: 150 },
        { id: 'label2', type: 'label', content: 'PASSWORD:', correctOrder: 2, x: 350, y: 200 },
        { id: 'input2', type: 'input', content: '', correctOrder: 3, x: 150, y: 250 },
        { id: 'button1', type: 'button', content: 'SUBMIT', correctOrder: 4, x: 300, y: 300 },
        { id: 'dummy1', type: 'dummy', content: 'CANCEL', correctOrder: -1, x: 400, y: 350 },
        { id: 'dummy2', type: 'dummy', content: 'RESET', correctOrder: -1, x: 100, y: 400 },
    ];

    const [parts, setParts] = useState<UIPart[]>(initialParts);

    const handleDragStart = (e: React.DragEvent, partId: string) => {
        setDraggedItem(partId);
        const rect = e.currentTarget.getBoundingClientRect();
        dragRef.current = {
            offsetX: e.clientX - rect.left,
            offsetY: e.clientY - rect.top,
        };
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number) => {
        e.preventDefault();
        if (!draggedItem) return;

        const draggedPart = parts.find(p => p.id === draggedItem);
        if (!draggedPart || draggedPart.type === 'dummy') return;

        const newDropZones = [...dropZones];
        newDropZones[dropIndex] = draggedPart;
        setDropZones(newDropZones);

        setParts(parts.filter(p => p.id !== draggedItem));
        setDraggedItem(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const returnToScattered = (partId: string) => {
        const part = dropZones.find(p => p?.id === partId);
        if (!part) return;

        const randomX = Math.random() * 400 + 50;
        const randomY = Math.random() * 300 + 100;

        setParts([...parts, { ...part, x: randomX, y: randomY }]);
        setDropZones(dropZones.map(p => p?.id === partId ? null : p));
    };

    const isCorrectOrder = () => {
        return dropZones.every((part, index) =>
            part && part.correctOrder === index
        ) && dropZones.every(part => part !== null);
    };

    const handleSubmit = () => {
        if (isCorrectOrder()) {
            onStageComplete();
        }
    };

    return (
        <div className="h-screen bg-black text-white overflow-hidden relative">
            {/* Background hint */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="flex flex-col items-center justify-center h-full space-y-8">
                    <div className="text-gray-600 text-sm">USERNAME:</div>
                    <div className="w-48 h-8 border border-gray-800"></div>
                    <div className="text-gray-600 text-sm">PASSWORD:</div>
                    <div className="w-48 h-8 border border-gray-800"></div>
                    <div className="w-32 h-10 border border-gray-800"></div>
                </div>
            </div>

            {/* Scattered UI parts */}
            {parts.map((part) => (
                <div
                    key={part.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, part.id)}
                    className={`absolute cursor-move transition-opacity hover:opacity-80 ${part.type === 'dummy' ? 'opacity-50' : ''
                        }`}
                    style={{ left: part.x, top: part.y }}
                >
                    {part.type === 'label' && (
                        <div className="text-green-400 font-mono text-sm p-2 border border-green-400 bg-black">
                            {part.content}
                        </div>
                    )}
                    {part.type === 'input' && (
                        <input
                            className="input-stage0 w-48 pointer-events-none"
                            placeholder="input field"
                            readOnly
                        />
                    )}
                    {part.type === 'button' && (
                        <button className="btn-stage0 pointer-events-none">
                            {part.content}
                        </button>
                    )}
                    {part.type === 'dummy' && (
                        <button className="px-4 py-2 bg-red-900 text-red-400 border border-red-400 font-mono pointer-events-none">
                            {part.content}
                        </button>
                    )}
                </div>
            ))}

            {/* Drop zones */}
            <div className="flex flex-col items-center justify-center h-full space-y-8">
                <h1 className="text-4xl font-mono mb-8 text-green-400">UI RECONSTRUCTION</h1>

                {dropZones.map((part, index) => (
                    <div
                        key={index}
                        onDrop={(e) => handleDrop(e, index)}
                        onDragOver={handleDragOver}
                        className="w-64 h-12 border-2 border-dashed border-gray-600 flex items-center justify-center relative"
                    >
                        {part ? (
                            <div
                                onClick={() => returnToScattered(part.id)}
                                className="cursor-pointer w-full h-full flex items-center justify-center"
                            >
                                {part.type === 'label' && (
                                    <div className="text-green-400 font-mono text-sm">
                                        {part.content}
                                    </div>
                                )}
                                {part.type === 'input' && (
                                    <input
                                        className="input-stage0 w-48 pointer-events-none"
                                        placeholder="input field"
                                        readOnly
                                    />
                                )}
                                {part.type === 'button' && (
                                    <button className="btn-stage0 pointer-events-none">
                                        {part.content}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <span className="text-gray-600 text-sm">Drop component here</span>
                        )}
                    </div>
                ))}

                {isCorrectOrder() && (
                    <button
                        onClick={handleSubmit}
                        className="btn-stage0 mt-8 animate-pulse"
                    >
                        ACTIVATE INTERFACE
                    </button>
                )}
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 left-4 text-gray-400 text-xs font-mono">
                Drag UI components to reconstruct the interface. Ignore invalid components.
            </div>

            {/* Noise overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="noise-bg w-full h-full"></div>
            </div>
        </div>
    );
};

export default Stage3; 
