import { QueryStore } from './query'

describe('QueryStore', () => {
    it('QueryStore should work', () => {
        const q1 = new QueryStore({
            id: 1,
            name: 'hh',
            list: [],
            isActive: false,
            pageSize: 10,
            current: 1,
            total: 0
        })

        q1.merge({
            age: 18
        })
        q1.merge({
            id: 2
        })
        expect(q1.params).toEqual({
            id: 2,
            name: 'hh',
            isActive: false,
            age: 18,
            pageSize: 10,
            pageNumber: 1
        })

        q1.mergeInit({
            age: 18
        })
        expect(q1.params).toEqual({
            id: 1,
            name: 'hh',
            isActive: false,
            age: 18,
            pageSize: 10,
            pageNumber: 1
        })

        q1.replace({
            age: 16
        })
        expect(q1.params).toEqual({
            age: 16
        })

        q1.reset()
        expect(q1.params).toEqual({
            id: 1,
            name: 'hh',
            isActive: false,
            pageSize: 10,
            pageNumber: 1
        })

        const q2 = new QueryStore({
            id: 1,
            name: 'hh',
            list: [],
            isActive: false,
            pageSize: 10,
            current: 1,
            total: 0
        }, {
            removeEmptyArray: false,
            pageSizePropName: 'pz',
            pageNumberPropName: 'pn'
        })

        expect(q2.params).toEqual({
            id: 1,
            name: 'hh',
            list: [],
            isActive: false,
            pz: 10,
            pn: 1
        })
    })
})