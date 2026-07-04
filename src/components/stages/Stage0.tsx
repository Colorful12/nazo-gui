import { useState, useEffect, useRef } from 'react'
import { StageProps } from '../../types'
import CursorCoordinates from '../common/CursorCoordinates'
import { Coordinate, generateTargetCoordinate, isWithinTolerance } from '../../utils/targetCoordinate'

const TARGET_MARGIN = 40
const HIT_TOLERANCE = 20
const DECOY_COUNT = 3

const Stage0 = ({ onStageComplete }: StageProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationRef = useRef<number | undefined>(undefined)
    const hasGeneratedTarget = useRef(false)
    const [targetCoordinate, setTargetCoordinate] = useState<Coordinate | null>(null)
    const [decoyCoordinates, setDecoyCoordinates] = useState<Coordinate[]>([])

    // Noise background animation
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        const handleResize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }

        window.addEventListener('resize', handleResize)

        const animate = () => {
            ctx.fillStyle = '#000'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            for (let i = 0; i < 500; i++) {
                const x = Math.random() * canvas.width
                const y = Math.random() * canvas.height
                const size = Math.random() * 3
                const alpha = Math.random() * 0.5

                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`
                ctx.fillRect(x, y, size, size)
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
    }, [])

    // Target coordinate: the real clear condition, only ever surfaced via console.
    // Guarded against StrictMode's double-invoke, since the value is random and
    // must not be silently regenerated after being logged.
    useEffect(() => {
        if (hasGeneratedTarget.current) return
        hasGeneratedTarget.current = true

        const target = generateTargetCoordinate(window.innerWidth, window.innerHeight, TARGET_MARGIN)
        const decoys = Array.from({ length: DECOY_COUNT }, () =>
            generateTargetCoordinate(window.innerWidth, window.innerHeight, TARGET_MARGIN)
        )

        setTargetCoordinate(target)
        setDecoyCoordinates(decoys)

        console.log(
            `%c[SYSTEM] target coordinate: ${target.x}, ${target.y}`,
            'color: #22c55e; font-family: monospace'
        )
    }, [])

    const handleClick = (e: React.MouseEvent) => {
        if (!targetCoordinate) return
        if (isWithinTolerance(targetCoordinate, { x: e.clientX, y: e.clientY }, HIT_TOLERANCE)) {
            onStageComplete()
        }
    }

    return (
        <div
            className="relative h-screen w-screen bg-black overflow-hidden cursor-crosshair"
            onClick={handleClick}
        >
            <CursorCoordinates />
            <canvas
                ref={canvasRef}
                className="absolute inset-0 z-10"
            />

            <div className="absolute top-10 left-10 z-20 text-white/60 font-mono text-sm tracking-widest">
                STAGE 0
            </div>

            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-white font-mono text-center text-2xl tracking-wide whitespace-nowrap">
                FIND THE REAL ONE.
            </div>

            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 space-y-6">
                {decoyCoordinates.map((coord, index) => (
                    <div
                        key={index}
                        data-testid="decoy-coordinate"
                        className="text-white/80 font-mono text-center whitespace-nowrap"
                    >
                        {coord.x}, {coord.y}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Stage0
