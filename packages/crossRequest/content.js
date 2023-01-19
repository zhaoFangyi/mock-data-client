const script = document.createElement('script')
const path = chrome.extension.getURL('inject.js')
script.src = path
document.head.append(script)

// 2
window.addEventListener('message', event => {
  try {
    msg = JSON.parse(event && event.data)
    // console.log('content received(from inject)', msg)
    if (msg && msg.action !== 'crossRequest_inject_post') return

    // console.log('content sent(to bg)', msg.data)
    // 3
    chrome.runtime.sendMessage(
      {
        action: 'crossRequest_content_post',
        data: msg.data,
      },
      // 6
      data => {
        // console.log('content received(from bg): ', data)
        // console.log('content send(to inject): ', data)
        window.postMessage({
          action: 'crossRequest_content_post',
          data,
        })
      },
    )
  } catch (err) {
    // console.error(err)
  }
})
