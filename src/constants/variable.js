export const HTTP_METHOD = {
  GET: {
    request_body: false,
    default_tab: 'query'
  },
  POST: {
    request_body: true,
    default_tab: 'body'
  },
  PUT: {
    request_body: true,
    default_tab: 'body'
  },
  DELETE: {
    request_body: true,
    default_tab: 'body'
  },
  HEAD: {
    request_body: false,
    default_tab: 'query'
  },
  OPTIONS: {
    request_body: false,
    default_tab: 'query'
  },
  PATCH: {
    request_body: true,
    default_tab: 'body'
  }
}
