import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '@/shared/api/apiError'

export function useApi<T>(fn: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await fn()
      setData(result)
      return result
    } catch (err) {
      setError(getErrorMessage(err))
      throw err
    } finally {
      setLoading(false)
    }
  }, [fn])

  useEffect(() => {
    void execute()
  }, [execute])

  return { data, loading, error, refetch: execute }
}
