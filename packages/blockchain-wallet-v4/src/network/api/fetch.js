import 'isomorphic-fetch'
import Promise from 'es6-promise'
import queryString from 'query-string'
import { isNil, merge } from 'ramda'

Promise.polyfill()

// checkStatus :: Response -> Promise Response
const checkStatus = (r) => r.ok ? Promise.resolve(r) : r.text().then(j => Promise.reject(j))

// extractData :: Response -> Promise (JSON | BLOB | TEXT)
const extractData = (r) => {
  const responseOfType = (t) => r.headers.get('content-type') && r.headers.get('content-type').indexOf(t) > -1
  switch (true) {
    case responseOfType('application/json'): return r.json()
    case responseOfType('image/jpeg'): return r.blob()
    default: return r.text()
  }
}

const encodeData = (contentType, data) => {
  switch (contentType) {
    case 'application/json': return JSON.stringify(data)
    default: return queryString.stringify(data)
  }
}

export default ({ apiCode }) => {
  // Generic request object
  const request = ({ method, url, endPoint, data, sessionToken, contentType = 'application/x-www-form-urlencoded' }) => {
    const defaultHeaders = { 'Content-Type': contentType }

    const formEncodedData = encodeData(contentType, { ...data })

    const finalHeaders = isNil(sessionToken)
      ? defaultHeaders
      : merge({ 'Authorization': `Bearer ${sessionToken}` }, defaultHeaders)

    const finalOptions = method === 'GET' ? {
      method,
      headers: finalHeaders,
      credentials: 'omit'
    } : {
      method,
      headers: finalHeaders,
      credentials: 'omit',
      body: formEncodedData
    }

    const finalUrl = method === 'GET'
      ? `${url}${endPoint}?${formEncodedData}`
      : `${url}${endPoint}`

    return fetch(finalUrl, finalOptions).then(checkStatus).then(extractData)
  }

  // Get request
  const get = ({ url, endPoint, data, sessionToken, contentType }) => request({ method: 'GET', url, endPoint, data, sessionToken, contentType })

  // Post request
  const post = ({ url, endPoint, data, sessionToken, contentType }) => request({ method: 'POST', url, endPoint, data, sessionToken, contentType })

  return {
    get,
    post
  }
}
