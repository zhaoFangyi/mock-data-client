import queryString from 'query-string'

const curQuery = queryString.parse(window.location.search)

const state = {
  test: {},
  repository: {},
  curItfId: curQuery.itf,
  mockData: [],
  curMockId: curQuery.mock
}
export default state
