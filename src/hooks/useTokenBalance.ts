import {
  QueryParams,
  useTokenBalance as useTokenBalanceCore,
} from '@usedapp/core'

import { CacheOptions, QueryEthAddress } from '../types'
import { useStaleData } from './useStaleData'

export function useTokenBalance(
  tokenAddress: QueryEthAddress,
  address: QueryEthAddress,
  queryParams: QueryParams & CacheOptions = {},
) {
  const balance = useTokenBalanceCore(tokenAddress, address, queryParams)

  const key = JSON.stringify({
    name: 'useTokenBalance',
    tokenAddress,
    address,
    queryParams,
  })

  const isLoading = !balance && !!address && !!tokenAddress

  return useStaleData(key, balance, false, isLoading, queryParams)
}
