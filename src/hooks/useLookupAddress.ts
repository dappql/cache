import { useLookupAddress as useLookupAddressCore } from '@usedapp/core'

import { CacheOptions } from '../types'
import { useStaleData } from './useStaleData'

export function useLookupAddress(
  address: string,
  cacheOptions: CacheOptions = {},
) {
  const { ens, isLoading } = useLookupAddressCore(address)

  const key = JSON.stringify({
    name: 'useLookupAddress',
    address,
    cacheOptions,
  })

  return useStaleData(key, ens, false, isLoading, cacheOptions)
}
