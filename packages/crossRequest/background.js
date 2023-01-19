// 4
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  // console.log('bg received(from content)', msg)
  if (msg && msg.action !== 'crossRequest_content_post') return
  const data = msg.data
  fetch(data.url, data.request)
    .then(res => res.json())
    .then(res => {
      // console.log('bg send(to content)', res)
      // 5
      sendResponse(res)
    })
  return true
})
