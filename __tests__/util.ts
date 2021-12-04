import { toCamelCase, upperFirst, isCamelCase } from '../src/utils'

describe('test utils', () => {
    it('upperFirst should work', () => {
        expect(upperFirst('abc')).toBe('Abc')
        expect(upperFirst('aBC')).toBe('ABC')
        expect(upperFirst('ABC')).toBe('ABC')
    })

    it('toCamel should work', () => {
        expect(toCamelCase('auth')).toBe('auth')
        expect(toCamelCase('order-detail')).toBe('orderDetail')
        expect(toCamelCase('-detail')).toBe('Detail')
        expect(toCamelCase('detail-')).toBe('detail')
        expect(toCamelCase('detail-a')).toBe('detailA')
        expect(toCamelCase('order-detail-orders')).toBe('orderDetailOrders')

        expect(toCamelCase('auth')).toBe('auth')
        expect(toCamelCase('order_detail')).toBe('orderDetail')
        expect(toCamelCase('_detail')).toBe('Detail')
        expect(toCamelCase('detail_')).toBe('detail')
        expect(toCamelCase('detail_a')).toBe('detailA')
        expect(toCamelCase('order_detail_orders')).toBe('orderDetailOrders')
    })

    it('isCamelCase should work', () => {
        expect(isCamelCase('abc')).toBe(false)
        expect(isCamelCase('Abc')).toBe(false)
        expect(isCamelCase('aBc')).toBe(true)
        expect(isCamelCase('ABc')).toBe(true)
        expect(isCamelCase('ABc')).toBe(true)
        expect(isCamelCase('AB_c')).toBe(false)
        expect(isCamelCase('AB-c')).toBe(false)
    })
})
