import {
  QueryParams,
  useTokenAllowance as useTokenAllowanceCore,
} from '@usedapp/core'

import { useStaleData } from './useStaleData'

export function useTokenAllowance(
  tokenAddress: QueryEthAddress,
  ownerAddress: QueryEthAddress,
  spenderAddress: QueryEthAddress,
  queryParams: QueryParams & CacheOptions = {},
) {
  const allowance = useTokenAllowanceCore(
    tokenAddress,
    ownerAddress,
    spenderAddress,
    queryParams,
  )

  const key = JSON.stringify({
    name: 'useTokenAllowance',
    tokenAddress,
    owner: ownerAddress,
    spender: spenderAddress,
    queryParams,
  })

  const isLoading =
    !allowance && !!ownerAddress && !!spenderAddress && !!tokenAddress

  return useStaleData(key, allowance, false, isLoading, queryParams)
}
