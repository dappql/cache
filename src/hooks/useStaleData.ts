import { useEffect, useState } from 'react'

import { useCache } from '../DappQLCacheProvider'

export function useStaleData<T>(
  key: DBItem['key'],
  value: T,
  hasError: boolean,
  isLoading: boolean,
  cacheOptions: CacheOptions = {},
) {
  const [stale, setStale] = useState<T | undefined>(undefined)
  const { get, set, setStaleStatus } = useCache()

  useEffect(() => {
    if (cacheOptions.disableCache) {
      setStale(undefined)
      return
    }
    if (isLoading) {
      get(key, cacheOptions.cacheExpiringTime)
        .then((staleData) => {
          if (staleData) {
            if (Array.isArray(value)) {
              setStale(
                value.map((v, i) => (v?.value ? v : staleData.value[i])) as T,
              )
            } else {
              setStale(staleData.value as T)
            }
          }
        })
        .catch(() => setStale(undefined))
    } else {
      if (!hasError) {
        set(key, value).catch()
      }
      setStale(undefined)
    }
  }, [
    isLoading,
    hasError,
    value,
    cacheOptions.disableCache,
    cacheOptions.cacheExpiringTime,
  ])

  useEffect(() => {
    setStaleStatus(key, !!stale)
    return () => setStaleStatus(key, false)
  }, [key, !!stale])

  if (!isLoading || !stale || hasError)
    return { stale: false, value, isLoading }

  return { stale: true, value: stale, isLoading: true }
}
