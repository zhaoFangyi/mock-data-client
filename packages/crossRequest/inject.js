window.crossRequest = function (options) {
  // console.log('inject send(to content)', options)
  // 1
  window.postMessage(
    JSON.stringify({
      action: 'crossRequest_inject_post',
      data: options,
    }),
  )
  // 7
  window.addEventListener('message', e => {
    const msg = e.data
    if (msg.action !== 'crossRequest_content_post') return
    // console.log('inject received(from content)', msg.data)
    options.success(
      msg.data,
      {},
      {
        res: {
          body: msg.data,
          header: {},
          status: 200,
        },
      },
    )
  })
}
