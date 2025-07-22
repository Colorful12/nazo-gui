import { GameState } from '../../types'
import Stage0 from '../stages/Stage0'
import Stage1 from '../stages/Stage1'
import Stage2 from '../stages/Stage2'
import Stage3 from '../stages/Stage3'
import Stage4 from '../stages/Stage4'
import Stage5 from '../stages/Stage5'

interface StageManagerProps {
    gameState: GameState
    onStageComplete: () => void
}

const StageManager = ({
    gameState,
    onStageComplete,
}: StageManagerProps) => {
    const stageProps = {
        onStageComplete,
        stageData: gameState.stageProgress[gameState.currentStage]
    }

    switch (gameState.currentStage) {
        case 0:
            return <Stage0 {...stageProps} />
        case 1:
            return <Stage1 {...stageProps} />
        case 2:
            return <Stage2 {...stageProps} />
        case 3:
            return <Stage3 {...stageProps} />
        case 4:
            return <Stage4 {...stageProps} />
        case 5:
            return <Stage5 {...stageProps} />
        default:
            return (
                <div className="h-screen bg-black text-green-400 font-mono flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-4">*** GAME COMPLETE ***</div>
                        <div className="text-xl">CONGRATULATIONS</div>
                        <div className="text-sm text-gray-500 mt-2">ALL SYSTEMS BREACHED</div>
                    </div>
                </div>
            )
    }
}

export default StageManager 
