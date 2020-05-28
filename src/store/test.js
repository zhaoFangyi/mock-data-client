import Bridge from './bridge'
console.log('test')

window.addEventListener('message', handshake)

function sendListening () {
  window.postMessage({
    source: 'good',
    payload: 'listening'
  }, '*')
}

sendListening()

function handshake (e) {
  console.log('handshake -> e', e)
  window.removeEventListener('message', handshake)

  let listeners = []
  const bridge = new Bridge({
    listen (fn) {
      const listener = evt => {
        fn(evt.data.payload)
      }
      window.addEventListener('message', listener)
      listeners.push(listener)
    },
    send (data) {
      window.postMessage({
        source: 'test',
        payload: data
      }, '*')
    }
  })

  bridge.on('set-instance-data', ({ index, value, path }) => {
    console.log(11111111)
    console.log(index, value, path)
  })

  bridge.on('shutdown', () => {
    listeners.forEach(l => {
      window.removeEventListener('message', l)
    })
    listeners = []
  })
}
