import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { BigNumber } from 'ethers'

import { COLLLECTION_NAME, DB_NAME, DB_VERSION } from './constants'

type DBContextType = {
  set: (key: DBItem['key'], value: DBItem['value']) => Promise<boolean>
  get: (
    key: DBItem['key'],
    cacheExpiringTime?: number,
  ) => Promise<DBItem | undefined>
  setStaleStatus: (key: DBItem['key'], value: boolean) => any
  stale?: boolean
}

const DBContext = createContext<DBContextType>({
  set: async () => false,
  get: async () => ({ key: '', value: [], timestamp: 0 }),
  setStaleStatus: () => {},
})

function parseBignumber(v: any): any {
  if (!v) return v

  if (v._isBigNumber) {
    return BigNumber.from(v._hex)
  }

  if (Array.isArray(v) || typeof v === 'object') {
    Object.keys(v).forEach((k) => (v[k] = parseBignumber(v[k])))
  }

  return v
}

export default function DappQLCacheProvider(
  props: {
    children: any
  } & CacheOptions,
) {
  const db = useRef<IDBDatabase | undefined>(undefined)
  const [ready, setReady] = useState(false)

  const [staleStatus, setStaleStatus] = useState<
    Record<DBItem['key'], boolean>
  >({})

  useEffect(() => {
    if (props.disableCache || !window?.indexedDB) {
      setReady(true)
      return
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => {
      // Do something with request.errorCode!
      setReady(true)
    }

    request.onsuccess = () => {
      db.current = request.result
      if (db.current?.objectStoreNames.length) {
        setReady(true)
      }
    }

    request.onupgradeneeded = () => {
      db.current = request.result
      db.current.createObjectStore(COLLLECTION_NAME, { keyPath: 'key' })
      setReady(true)
    }
  }, [props.disableCache])

  const set = useCallback(
    (key: DBItem['key'], value: DBItem['value']) => {
      return new Promise<boolean>((resolve, reject) => {
        if (props.disableCache) return resolve(false)

        if (!db.current) return reject(new Error('No Database'))

        const dbTransaction = db.current.transaction(
          COLLLECTION_NAME,
          'readwrite',
        )
        const store = dbTransaction.objectStore(COLLLECTION_NAME)

        const request = store.put({
          key,
          value,
          timestamp: Date.now(),
        })

        request.onsuccess = () => {
          resolve(true)
        }

        request.onerror = () => {
          reject(new Error('Unable to save data'))
        }
      })
    },
    [ready, props.disableCache],
  )

  const get = useCallback(
    (
      key: DBItem['key'],
      cacheExpiringTime: number = props.cacheExpiringTime,
    ) => {
      return new Promise<DBItem | undefined>((resolve, reject) => {
        if (props.disableCache) return resolve(undefined)

        if (!db.current) return reject(new Error('No Database'))

        const dbTransaction = db.current.transaction(COLLLECTION_NAME)
        const store = dbTransaction.objectStore(COLLLECTION_NAME)
        const request = store.get(key)

        request.onsuccess = () => {
          if (
            !request.result ||
            (cacheExpiringTime &&
              Date.now() - cacheExpiringTime < request.result.timestamp)
          ) {
            return resolve(undefined)
          }

          return resolve({
            ...request.result,
            value: parseBignumber(request.result.value),
          })
        }

        request.onerror = () => {
          reject(new Error('Unable to save data'))
        }
      })
    },
    [ready, props.disableCache],
  )

  const updateStale = useCallback((key: DBItem['key'], value: boolean) => {
    setStaleStatus((s) => ({ ...s, [key]: value }))
  }, [])

  const stale = useMemo(() => {
    return !!Object.keys(staleStatus).find((k) => staleStatus[k])
  }, [staleStatus])

  if (!ready) return null

  return (
    <DBContext.Provider
      value={{
        set,
        get,
        setStaleStatus: updateStale,
        stale,
      }}>
      {props.children}
    </DBContext.Provider>
  )
}

export function useCache() {
  return useContext(DBContext)
}

export function useStale() {
  return useCache().stale
}
