import axios from 'axios'

type ApiErrorEnvelope = {
  error?: { message?: string; details?: string[] | null; requestId?: string }
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const status = err.response?.status
    const data = err.response?.data as ApiErrorEnvelope | undefined
    const backendMessage = data?.error?.message

    if (backendMessage) {
      return backendMessage
    }

    if (status === 401) {
      return 'You are not authorized to perform this action.'
    }
    if (status === 403) {
      return 'You do not have permission to access this resource.'
    }
    if (status === 404) {
      return 'Requested resource was not found.'
    }
    if (status && status >= 500) {
      return 'Server error. Please try again later.'
    }

    if (err.message) {
      return err.message
    }
  }

  if (err instanceof Error) return err.message
  return 'Unknown error'
}
