import DappQLCacheProvider from './DappQLCacheProvider'

export { useCache, useStale } from './DappQLCacheProvider'

export { useCall } from './hooks/useCall'
export { useCalls } from './hooks/useCalls'
export { useEtherBalance } from './hooks/useEtherBalance'
export { useLookupAddress } from './hooks/useLookupAddress'
export { useStaleData } from './hooks/useStaleData'
export { useToken } from './hooks/useToken'
export { useTokenAllowance } from './hooks/useTokenAllowance'
export { useTokenBalance } from './hooks/useTokenBalance'

export default DappQLCacheProvider

export { DBItem } from './types'
export { CacheOptions } from './types'
export { QueryEthAddress } from './types'
