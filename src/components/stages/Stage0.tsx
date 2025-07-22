import { useState, useEffect, useRef } from 'react'
import { StageProps } from '../../types'

const Stage0 = ({ onStageComplete }: StageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [showFakeButtons, setShowFakeButtons] = useState(false)
    const [realButtonVisible, setRealButtonVisible] = useState(false)
    const animationRef = useRef<number | undefined>(undefined)

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        // Initial loading animation
        setTimeout(() => {
            setShowFakeButtons(true)
            setTimeout(() => {
                setRealButtonVisible(true)
            }, 2000)
        }, 1000)

        // Noise animation
        const animate = () => {
            ctx.fillStyle = '#000'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw noise
            for (let i = 0; i < 500; i++) {
                const x = Math.random() * canvas.width
                const y = Math.random() * canvas.height
                const size = Math.random() * 3
                const alpha = Math.random() * 0.5

                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                ctx.fillRect(x, y, size, size)
            }

            // Draw fake UI elements
            if (showFakeButtons) {
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
                ctx.fillRect(100, 100, 200, 50)
                ctx.fillRect(100, 200, 200, 50)
                ctx.fillRect(100, 300, 200, 50)

                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
                ctx.font = '16px monospace'
                ctx.fillText('LOADING...', 150, 130)
                ctx.fillText('INITIALIZING...', 150, 230)
                ctx.fillText('PROCESSING...', 150, 330)
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [showFakeButtons])

    const handleRealButtonClick = () => {
        onStageComplete()
    }

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10"
            />

            {/* Fake buttons */}
            {showFakeButtons && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center space-y-4">
                    <button className="px-8 py-3 bg-gray-800 text-white border border-gray-600 opacity-50 cursor-not-allowed">
                        START
                    </button>
                    <button className="px-8 py-3 bg-gray-800 text-white border border-gray-600 opacity-50 cursor-not-allowed">
                        OPTIONS
                    </button>
                    <button className="px-8 py-3 bg-gray-800 text-white border border-gray-600 opacity-50 cursor-not-allowed">
                        EXIT
                    </button>
                </div>
            )}

            {/* Real hidden START button */}
            {realButtonVisible && (
                <button
                    onClick={handleRealButtonClick}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                     px-8 py-3 bg-transparent text-transparent border-transparent 
                     hover:bg-green-500 hover:text-white hover:border-green-500 
                     transition-all duration-300 z-30"
                    style={{
                        marginLeft: '150px', // 偽ボタンからずらした位置
                        marginTop: '-100px'
                    }}
                >
                    START
                </button>
            )}

            {/* Hint text */}
            <div className="absolute bottom-10 left-10 z-30 text-green-400 text-sm font-mono opacity-30">
                ヒント: 本物のSTARTボタンを見つけてください...
            </div>
        </div>
    )
}

export default Stage0 
