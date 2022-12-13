import {
  QueryParams,
  useEtherBalance as useEtherBalanceCore,
} from '@usedapp/core'

import { useStaleData } from './useStaleData'

export function useEtherBalance(
  address: QueryEthAddress,
  queryParams: QueryParams & CacheOptions = {},
) {
  const balance = useEtherBalanceCore(address, queryParams)
  const key = JSON.stringify({ name: 'useEtherBalance', address, queryParams })

  const isLoading = !balance && !!address

  return useStaleData(key, balance, false, isLoading, queryParams)
}
