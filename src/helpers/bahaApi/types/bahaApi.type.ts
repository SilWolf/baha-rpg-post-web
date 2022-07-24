export type BahaAPIResponse<T = unknown> = {
  data: T
  error?: {
    code: number
    message: string
    status: string
    details: string[]
  }
}
