type APIConfig = {
  errorHandler: (e: Error) => void
}

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

  async get(path: string, options: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'GET',
      credentials: 'include',
      ...options,

      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
      .then((res) => res.json())
      .catch(this.errorHandler)
  }

  async post(path: string, data: Record<string, unknown>, options: RequestInit) {
    return fetch(`${this.baseUrl}${path}`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data),
      ...options,

      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    })
      .then((res) => res.json())
      .catch(this.errorHandler)
  }
}

const api = new API(process.env.REACT_APP_BAHA_API_URL ?? '')

export default api
