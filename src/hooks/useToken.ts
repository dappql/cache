import {
  Call,
  ERC20Interface,
  Falsy,
  QueryParams,
  useCalls,
} from '@usedapp/core'
import { TokenInfo } from '@usedapp/core/dist/esm/src/model/TokenInfo'
import { Contract } from 'ethers'

import { useStaleData } from './useStaleData'

// TODO:   Remove when useDapp deploys the version with this commit:
// https://github.com/TrueFiEng/useDApp/commit/737d43c0c36ef53b9c598a94d058ad3831103f9a

export function useTokenCore(
  tokenAddress: string | Falsy,
  queryParams: QueryParams = {},
): TokenInfo | undefined {
  const partialCall = tokenAddress && {
    contract: new Contract(tokenAddress, ERC20Interface),
    address: tokenAddress,
    args: [],
  }
  const args = ['name', 'symbol', 'decimals', 'totalSupply'].map(
    (method): Call | Falsy => partialCall && { ...partialCall, method },
  )
  const [name, symbol, decimals, totalSupply] = useCalls(args, queryParams)

  if (!name && !symbol && !decimals && !totalSupply) {
    return undefined
  }

  return {
    name: name?.value[0] ?? '',
    symbol: symbol?.value[0] ?? '',
    decimals: decimals?.value[0],
    totalSupply: totalSupply?.value[0],
  }
}

export function useToken(
  tokenAddress: QueryEthAddress,
  queryParams: QueryParams & CacheOptions = {},
) {
  const tokenInfo = useTokenCore(tokenAddress, queryParams)

  const key = JSON.stringify({
    name: 'useToken',
    tokenAddress,
    queryParams,
  })

  const isLoading =
    (!tokenInfo?.decimals || !tokenInfo?.totalSupply) && !!tokenAddress

  return useStaleData(key, tokenInfo, false, isLoading, queryParams)
}
