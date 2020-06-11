const importJson = function importJson (res) {
  console.log('importJson -> res', res)
  try {
    const interfaceData = { apis: [] }
    res = JSON.parse(res)
    console.log('importJson -> res', res)
    res.interfaces.forEach(item => {
      interfaceData.apis = interfaceData.apis.concat(item.mockData)
    })
    return interfaceData
  } catch (e) {
    console.log(e)
  }
}
export default importJson
