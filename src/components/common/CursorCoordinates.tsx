import { useEffect, useState } from 'react'

const CursorCoordinates = () => {
    const [position, setPosition] = useState<{ x: number; y: number } | null>(null)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY })
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    if (!position) return null

    return (
        <div
            className="fixed z-[9999] pointer-events-none text-xs font-mono text-white bg-black/70 px-1 rounded"
            style={{ left: position.x + 12, top: position.y + 12 }}
        >
            {position.x}, {position.y}
        </div>
    )
}

export default CursorCoordinates
