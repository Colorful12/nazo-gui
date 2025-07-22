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

        // Handle window resize
        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)

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

            // Draw fake UI elements (centered)
            if (showFakeButtons) {
                const rectWidth = 200
                const rectHeight = 50
                const spacing = 50

                const startX = (canvas.width - rectWidth) / 2
                const startY = canvas.height / 2 - rectHeight - spacing / 2

                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)'
                for (let i = 0; i < 3; i++) {
                    ctx.fillRect(startX, startY + i * (rectHeight + spacing), rectWidth, rectHeight)
                }

                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
                ctx.font = '16px monospace'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'

                const centerX = canvas.width / 2
                ctx.fillText('LOADING...', centerX, startY + rectHeight / 2)
                ctx.fillText('INITIALIZING...', centerX, startY + (rectHeight + spacing) + rectHeight / 2)
                ctx.fillText('PROCESSING...', centerX, startY + 2 * (rectHeight + spacing) + rectHeight / 2)
            }

            animationRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            window.removeEventListener('resize', handleResize)
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

            {/* Instruction text above fake buttons */}
            {showFakeButtons && (
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                    <div className="text-white font-mono text-center whitespace-nowrap" style={{ fontSize: '24px' }}>
                        You need to start the system
                    </div>
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

        </div>
    )
}

export default Stage0 
