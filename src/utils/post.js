import config from '@config'

const post = (url, data, options = {}) => {
  if (url.indexOf('http') === -1) {
    url = `${config.API_URL}/${url}`
  }

  let headers = {}

  if (options.headers) {
    headers = options.headers
  } else {
    headers = {
      'Content-Type': 'application/json'
    }
  }

  const token = localStorage.authToken

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let body = null

  if (options.customBody) {
    body = data
  } else {
    body = JSON.stringify(data)
  }

  let method = 'POST'

  if (options.metthod) {
    method = options.metthod
  }

  return fetch(url, {
    method,
    headers,
    body
  })
}

export default post
