import {
    tidyData,
    omit
} from './tools'

describe('tools...', () => {
    it('tidyData should work', () => {
        expect(tidyData({})).toEqual({})
        expect(tidyData(null)).toEqual({})
        expect(
            tidyData({
                isActive: false,
                list: [],
                id: 1,
                name: 'hh',
                age: null,
                user: ''
            })
        )
            .toEqual({
                isActive: false,
                id: 1,
                name: 'hh'
            })
        expect(
            tidyData({
                isActive: false,
                list: [],
                id: 1,
                name: 'hh',
                age: null,
                user: ''
            }, { removeEmptyArray: false })
        )
            .toEqual({
                isActive: false,
                list: [],
                id: 1,
                name: 'hh'
            })
    })

    it('omit should work', () => {
        expect(
            omit({
                isActive: false,
                list: [],
                id: 1,
                name: 'hh',
                age: null,
                user: ''
            }, ['isActive', 'name'])
        )
            .toEqual({
                list: [],
                id: 1,
                age: null,
                user: ''
            })
    })
})