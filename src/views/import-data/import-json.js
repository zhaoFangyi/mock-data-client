const importJson = function importJson (res) {
  try {
    const interfaceData = { apis: [] }
    res = JSON.parse(res)
    res.interfaces.forEach(item => {
      const res = {
        method: item.method,
        path: item.url,
        res_body: (item.mockData || [{ res_body: '' }])[0].res_body,
        title: item.name
      }
      interfaceData.apis = interfaceData.apis.concat(res)
    })
    return interfaceData
  } catch (e) {
    console.log(e)
  }
}
export default importJson
