import { Call, Falsy, QueryParams } from '@usedapp/core'
import {
  ContractMethodNames,
  TypedContract,
} from '@usedapp/core/dist/esm/src/model'

import { useCalls } from './useCalls'

export type CacheOptions = {
  disableCache?: boolean
  cacheExpiringTime?: number
}

export function useCall<
  T extends TypedContract,
  MN extends ContractMethodNames<T>,
>(call: Call<T, MN> | Falsy, queryParams: QueryParams = {}) {
  const result = useCalls([call], queryParams)
  return {
    ...result,
    value: result?.value?.[0]?.value,
    error: result?.value?.[0]?.error,
  }
}
