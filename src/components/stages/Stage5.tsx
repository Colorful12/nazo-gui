import { StageProps } from '../../types'

const Stage5 = ({ onStageComplete }: StageProps) => {
    return (
        <div className="min-h-screen bg-black text-green-400 font-mono flex items-center justify-center">
            <div className="text-center">
                <div className="text-2xl mb-4">*** STAGE 5 ***</div>
                <div className="text-lg mb-6">UNDER CONSTRUCTION</div>
                <button
                    onClick={onStageComplete}
                    className="px-6 py-3 bg-green-700 text-black font-bold rounded"
                >
                    [COMPLETE GAME]
                </button>
            </div>
        </div>
    )
}

export default Stage5 
