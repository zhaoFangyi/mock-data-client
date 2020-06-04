export const test = state => state.test

export const itfs = state => state.repository.interfaces || []

export const curItf = (state, getter) => {
  const itfs = getter.itfs || []
  if (itfs.length) {
    const defaultValue = itfs[0]
    return itfs.find(item => item.id === state.curItfId) || defaultValue
  } else {
    return {}
  }
}

export const curMockData = (state, getter) => {
  const mockData = state.mockData || []
  if (mockData.length) {
    const defaultValue = mockData[0]
    return mockData.find(item => item.id === state.curMockId) || defaultValue
  } else {
    return {}
  }
}
