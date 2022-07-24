import qs from 'qs'

type APIConfig = {
  errorHandler: (e: Error) => void
}

type APIRequestOption = RequestInit & {
  params?: Record<string, string | number | undefined>
}

const formatParams = (params: APIRequestOption['params']) => qs.stringify(params)

class API {
  baseUrl: string
  errorHandler: APIConfig['errorHandler'] = (e) => {
    console.error(e.message)
  }

  constructor(baseUrl: string, config?: APIConfig) {
    this.baseUrl = baseUrl

    if (config) {
      if (config.errorHandler) {
        this.errorHandler = config.errorHandler
      }
    }
  }

  async get<T = unknown>(path: string, option?: APIRequestOption) {
    const url = option?.params
      ? `${this.baseUrl}${path}?${formatParams(option.params)}`
      : `${this.baseUrl}${path}`

    return fetch(url, {
      method: 'GET',
      credentials: 'include',
      ...option,

      headers: {
        'Content-Type': 'application/json',
        ...option?.headers
      }
    })
      .then((res) => res.json() as Promise<T>)
      .catch(this.errorHandler)
  }

  async post<T = unknown>(path: string, data: Record<string, unknown>, option?: APIRequestOption) {
    const url = option?.params
      ? `${this.baseUrl}${path}?${formatParams(option.params)}`
      : `${this.baseUrl}${path}`

    return fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data),
      ...option,

      headers: {
        'Content-Type': 'application/json',
        ...option?.headers
      }
    })
      .then((res) => res.json() as Promise<T>)
      .catch(this.errorHandler)
  }
}

const api = new API(process.env.REACT_APP_BAHA_API_URL ?? '')

export default api
