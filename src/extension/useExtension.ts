import { useState, useEffect } from 'react'
import { without, uniq, update, isNil } from 'ramda'
import extension from 'extensionizer'
import { createContext } from '@terra-money/use-station'

/* request & response */
export interface TxOptionsData {
  msgs: string[]
  fee?: string
  memo?: string
  gasPrices?: string
  gasAdjustment?: string
  account_number?: number
  sequence?: number
}

export interface ExtSign extends TxOptionsData {
  /* request */
  id: number
  origin: string
  purgeQueue?: boolean
  waitForConfirmation?: boolean

  /* response */
  success?: boolean
  error?: { code: number; message?: string }
  result?: any
}

export type RequestType = 'post' | 'sign'
export type RequestList = Record<RequestType, ExtSign[]>

export interface RecordedExtSign {
  requestType: RequestType
  details: ExtSign
}

/* App interface */
interface Extension {
  connect: {
    list: string[]
    allow: (origin: string, allow?: boolean) => void
  }

  request: {
    list: RequestList
    sorted: RecordedExtSign[]
    onFinish: (type: RequestType, params: ExtSign) => void
  }

  goBack?: () => void
  setGoBack: (fn?: () => void) => void
  resetGoBack: () => void
}

export const useExtensionRequested = (): Extension => {
  const initial = { sign: [], post: [] }
  const [connectRequested, setConnectRequested] = useState<string[]>([])
  const [requested, setRequested] = useState<RequestList>(initial)

  const filterRequested = (list: ExtSign[]) =>
    list.filter(({ success }) => isNil(success))

  useEffect(() => {
    // Get values from storage except for transactions that have already been made (success or failure).
    extension.storage?.local.get(
      ['connect', 'post', 'sign'],
      ({ connect = { request: [] }, sign = [], post = [] }) => {
        setConnectRequested(connect.request)
        setRequested({
          sign: filterRequested(sign),
          post: filterRequested(post),
        })
      }
    )
  }, [])

  /* connect */
  const allow = (origin: string, allow: boolean = true) => {
    // Record which addresses are allowed on the storage.
    // If refused, do not blacklist, just delete the request (for future requests).
    const next = without([origin], connectRequested)
    extension.storage.local.get(['connect'], ({ connect = { allowed: [] } }) =>
      extension.storage.local.set(
        {
          connect: {
            request: next,
            allowed: uniq(
              allow ? [...connect.allowed, origin] : connect.allowed
            ),
          },
        },
        () => setConnectRequested(next)
      )
    )
  }

  /* sign & post */
  const onFinish = (requestType: RequestType, result: ExtSign) => {
    // Receive the results and record them on the storage.
    // Find out what kind of request it is.
    extension.storage.local.get([requestType], (storage) => {
      const list: ExtSign[] = storage[requestType] || []
      const index = list.findIndex(
        ({ id, origin }) => id === result.id && origin === result.origin
      )

      const next = update(index, result, list)
      extension.storage.local.set({ [requestType]: next })
      setRequested({ ...requested, [requestType]: filterRequested(next) })
    })
  }

  /* goBack */
  const [goBack, setGoBack] = useState<() => void>()
  const resetGoBack = () => setGoBack(undefined)

  return {
    connect: { list: connectRequested, allow },
    request: { list: requested, sorted: sort(requested), onFinish },
    goBack,
    setGoBack,
    resetGoBack,
  }
}

/* Context */
export const [useExtension, ExtensionProvider] = createContext<Extension>()

/* Redirect */
export const useExtensionGoBack = (fn?: () => void) => {
  const { setGoBack, resetGoBack } = useExtension()

  useEffect(() => {
    setGoBack(fn)
    return () => resetGoBack()
  }, [fn, setGoBack, resetGoBack])
}

/* Sort */
const recordKey = (
  requestType: RequestType,
  list: ExtSign[]
): RecordedExtSign[] =>
  list.map((details: ExtSign) => ({ requestType, details }))

const sortByTimestamp = (list: RecordedExtSign[]) =>
  list.sort(({ details: { id: a } }, { details: { id: b } }) => a - b)

const sort = ({ sign, post }: RequestList) =>
  sortByTimestamp([...recordKey('sign', sign), ...recordKey('post', post)])
