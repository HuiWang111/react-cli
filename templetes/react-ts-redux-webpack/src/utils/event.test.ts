import { CustomizedEvent } from './event'

describe('test event.ts', () => {
    let customizedEvent: CustomizedEvent
    beforeAll(() => {
        customizedEvent = new CustomizedEvent()
    })

    it('customizedEvent should work', () => {
        const testCallbackOne = jest.fn()
        customizedEvent.addListener('test', testCallbackOne)

        customizedEvent.emit('test')
        expect(testCallbackOne).toBeCalled()

        customizedEvent.emit('test')
        expect(testCallbackOne).toBeCalledTimes(2)

        customizedEvent.removeListener('test', testCallbackOne)
        
        customizedEvent.emit('test')
        expect(testCallbackOne).toBeCalledTimes(2)
    })
})
