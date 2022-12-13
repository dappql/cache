export type DBItem = {
  key: string
  value: any
  timestamp: number
}

export type CacheOptions = {
  disableCache?: boolean
  cacheExpiringTime?: number
}

export type QueryEthAddress = string | false | 0 | undefined
