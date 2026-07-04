import { describe, it, expect, vi, afterEach } from 'vitest'
import { generateTargetCoordinate, isWithinTolerance } from './targetCoordinate'

describe('generateTargetCoordinate', () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it('Math.randomが0のとき、marginぶんだけ内側の座標を返す', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0)

        const result = generateTargetCoordinate(1000, 800, 40)

        expect(result).toEqual({ x: 40, y: 40 })
    })

    it('Math.randomが1に近いとき、右下marginぶんだけ内側の座標を返す', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999999)

        const result = generateTargetCoordinate(1000, 800, 40)

        expect(result).toEqual({ x: 960, y: 760 })
    })
})

describe('isWithinTolerance', () => {
    it('目標とクリック位置の距離がtolerance以内ならtrue', () => {
        const target = { x: 100, y: 100 }
        const click = { x: 110, y: 100 }

        expect(isWithinTolerance(target, click, 20)).toBe(true)
    })

    it('目標とクリック位置の距離がtoleranceを超えるならfalse', () => {
        const target = { x: 100, y: 100 }
        const click = { x: 130, y: 100 }

        expect(isWithinTolerance(target, click, 20)).toBe(false)
    })
})
