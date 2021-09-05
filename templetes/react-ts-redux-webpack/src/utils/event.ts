type Listener = (...params: any[]) => void;

class CustomizedEvent {
    private listenerMap: Map<string, Listener[]>;

    constructor() {
        this.listenerMap = new Map()
    }

    addListener(eventName: string, listener: Listener): void {
        const oldListeners = this.listenerMap.get(eventName) || []
        this.listenerMap.set(eventName, [...oldListeners, listener])
    }

    removeListener(eventName: string, listener: Listener): void {
        const oldListeners = this.listenerMap.get(eventName)

        if (!oldListeners || !oldListeners.length) {
            return
        }

        const listeners = oldListeners.filter(l => l !== listener)
        this.listenerMap.set(eventName, listeners)
    }

    emit(eventName: string, ...params: any[]): void {
        const listeners = this.listenerMap.get(eventName)

        if (!listeners || !listeners.length) {
            return
        }

        listeners.forEach(listener => {
            listener(...params)
        })
    }
}

export { CustomizedEvent }