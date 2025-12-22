import axios, { AxiosError } from 'axios'
import { env } from '@/shared/config/env'
import { getErrorMessage } from './apiError'

export const http = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

export type HttpErrorInfo = {
  status?: number
  message: string
  url?: string
}

type HttpErrorListener = (err: HttpErrorInfo) => void

const httpErrorListeners = new Set<HttpErrorListener>()

export function subscribeHttpErrors(listener: HttpErrorListener) {
  httpErrorListeners.add(listener)
  return () => {
    httpErrorListeners.delete(listener)
  }
}

function notifyHttpError(err: HttpErrorInfo) {
  httpErrorListeners.forEach((listener) => {
    try {
      listener(err)
    } catch {
      console.error('Http error listener failed', listener, err)
    }
  })
}

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const url = error.config?.url
    const rawMessage = getErrorMessage(error)

    let friendly = rawMessage

    if (status === 401) {
      friendly = 'You are not authorized. Please sign in to continue.'
    } else if (status === 403) {
      friendly = 'You do not have access to this resource.'
    } else if (status === 404) {
      friendly = 'Requested data was not found.'
    } else if (status && status >= 500) {
      friendly = 'Server error. Please try again later.'
    }

    notifyHttpError({ status, message: friendly, url })

    return Promise.reject(error)
  },
)
