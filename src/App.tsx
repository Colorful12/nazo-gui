import { useState, useEffect } from 'react'
import StageManager from './components/common/StageManager'
import { GameState } from './types'

function App() {
    const [gameState, setGameState] = useState<GameState>({
        currentStage: 0,
        stageProgress: {},
        globalFlags: {}
    })

    // Development: Allow stage switching via URL query params
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const stageParam = urlParams.get('stage')
        if (stageParam && !isNaN(Number(stageParam))) {
            const stage = Number(stageParam)
            if (stage >= 0 && stage <= 5) {
                setGameState(prev => ({ ...prev, currentStage: stage }))
            }
        }
    }, [])

    const handleStageComplete = () => {
        setGameState(prev => ({
            ...prev,
            currentStage: Math.min(prev.currentStage + 1, 5)
        }))
    }



    return (
        <div className="min-h-screen bg-black text-white overflow-hidden">
            <StageManager
                gameState={gameState}
                onStageComplete={handleStageComplete}
            />
        </div>
    )
}

export default App 
