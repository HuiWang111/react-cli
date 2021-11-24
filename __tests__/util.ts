import { toCamel, upperFirst } from '../src/utils'

describe('test utils', () => {
    it('upperFirst should work', () => {
        expect(upperFirst('abc')).toBe('Abc')
        expect(upperFirst('aBC')).toBe('ABC')
        expect(upperFirst('ABC')).toBe('ABC')
    })

    it('toCamel should work', () => {
        expect(toCamel('auth')).toBe('auth')
        expect(toCamel('order-detail')).toBe('orderDetail')
        expect(toCamel('-detail')).toBe('-detail')
        expect(toCamel('detail-')).toBe('detail-')
        expect(toCamel('detail-a')).toBe('detailA')
    })
})
