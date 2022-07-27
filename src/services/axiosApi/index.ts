import axios, { AxiosRequestConfig } from 'axios'

const api = axios.create({
  baseURL: 'https://api.gamer.com.tw',
  withCredentials: true,
})

api.interceptors.response.use((res) => {
  console.log(`executed API: ${res.config.url}`)

  if (res.data.error) {
    throw new Error(res.data.error.message ?? '未知的錯誤')
  }

  return res
})

// Set initial cookies
// api.defaults.headers.common.Cookie = `BAHARUNE=${process.env.REACT_APP_BAHA_TOKEN};`

const methods = {
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config).then((res) => res.data),
  post: async <T = unknown>(url: string, data?: AxiosRequestConfig, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config).then((res) => res.data),
}

export default methods
