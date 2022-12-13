type DBItem = {
  key: string
  value: any
  timestamp: number
}

type CacheOptions = {
  disableCache?: boolean
  cacheExpiringTime?: number
}

type QueryEthAddress = string | false | 0 | undefined
