class CustomEventEmitter {
    constructor() {
        this.events = {};
    }

    on(event, listener) {
        if (!this.events[event]) {
            this.events[event] = [];
        }
        this.events[event].push(listener);
    }

    emit(event, ...args) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(...args));
        }
    }

    off(event, listenerToRemove) {
        if (!this.events[event]) return;
        this.events[event] = this.events[event].filter(listener => listener !== listenerToRemove);
    }

    setMaxListeners() {
        // Hỗ trợ hàm dọn dẹp tương thích
    }
}

const _emitter = new CustomEventEmitter();
_emitter.setMaxListeners(0);

export const emitter = _emitter;
