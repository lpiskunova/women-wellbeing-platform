import axios from 'axios'

type ApiErrorEnvelope = {
  error?: { message?: string; details?: string[] | null; requestId?: string }
}

export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as ApiErrorEnvelope | undefined
    const msg = data?.error?.message
    if (msg) return msg
    if (err.message) return err.message
  }
  if (err instanceof Error) return err.message
  return 'Unknown error'
}
