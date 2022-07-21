import queryString from 'query-string'

const curQuery = queryString.parse(window.location.search)

const state = {
  test: {},
  repositories: [],
  repository: {},
  expects: [],
  curItfId: curQuery.itf,
  mockData: [],
  curMockId: curQuery.mock,
  curExpectId: curQuery.expect
}
export default state
