import {
  Call,
  CallResult,
  Falsy,
  QueryParams,
  useCalls as useCallsCore,
} from '@usedapp/core'
import { Contract } from 'ethers'

import { useStaleData } from './useStaleData'

type CallResponse = CallResult<Contract, string>[]

export function useCalls(
  calls: (Call | Falsy)[],
  queryParams: QueryParams & CacheOptions = {},
): {
  value: CallResult<Contract, string>[]
  stale: boolean
  isLoading: boolean
} {
  const callsIndex = JSON.stringify(
    calls.map((c) =>
      c
        ? {
            ...c,
            contract: c.contract.address,
          }
        : undefined,
    ),
  )

  const key = JSON.stringify({ callsIndex, queryParams })

  const value = useCallsCore(calls, queryParams) as CallResult<
    Contract,
    string
  >[]

  const isLoading = value.filter((v) => !v?.value).length > 0
  const hasError = !!value.find((v) => v?.error)

  return useStaleData<CallResponse>(
    key,
    value,
    hasError,
    isLoading,
    queryParams,
  )
}
