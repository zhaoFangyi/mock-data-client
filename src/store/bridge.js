import { EventEmitter } from 'events'

// const BATCH_DURATION = 100

export default class Bridge extends EventEmitter {
  constructor (wall) {
    super()
    this.setMaxListeners(Infinity)
    this.wall = wall
    wall.listen(messages => {
      if (Array.isArray(messages)) {
        messages.forEach(message => this._emit(message))
      } else {
        this._emit(messages)
      }
    })
    this._batchingQueue = []
    this._sendingQueue = []
    this._receivingQueue = []
    this._sending = false
    this._time = null
  }

  send (event, payload) {}

  log (message) {}

  _flush () {}

  _emit (message) {
    if (typeof message === 'string') {
      this.emit(message)
    } else if (message._chunk) {
      this._receivingQueue.push(message._chunk)
      if (message.last) {
        this.emit(message.event, this._receivingQueue)
        this._receivingQueue = []
      }
    } else {
      this.emit(message.event, message.payload)
    }
  }

  _send () {}

  _nextSend () {}
}
