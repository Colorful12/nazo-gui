export interface Coordinate {
    x: number
    y: number
}

export const generateTargetCoordinate = (width: number, height: number, margin: number): Coordinate => {
    const x = Math.round(margin + Math.random() * (width - margin * 2))
    const y = Math.round(margin + Math.random() * (height - margin * 2))
    return { x, y }
}

export const isWithinTolerance = (target: Coordinate, click: Coordinate, tolerance: number): boolean => {
    const dx = target.x - click.x
    const dy = target.y - click.y
    return Math.sqrt(dx * dx + dy * dy) <= tolerance
}
