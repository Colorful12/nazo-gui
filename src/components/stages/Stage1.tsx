import React from 'react';
import { StageProps } from '../../types';

const Stage1: React.FC<StageProps> = ({ onStageComplete }) => {
    return (
        <div className="h-screen bg-black text-white flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-4xl font-mono mb-8">STAGE 1</h1>
                <p className="text-gray-400 mb-8">Temporary implementation</p>
                <button
                    onClick={onStageComplete}
                    className="btn-stage0"
                >
                    PROCEED TO STAGE 2
                </button>
            </div>
        </div>
    );
};

export default Stage1; 
