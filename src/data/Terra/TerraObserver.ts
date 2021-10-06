import { useEffect, useRef, useState } from 'react'
import { Block } from '@terra-money/terra.js'
import { OBSERVER } from '../../constants'
import { useChainID } from '../chain'

export const useTerraObserver = () => {
  const ws = useRef<WebSocket | null>(null)
  const chainID = useChainID()
  const [block, setBlock] = useState<Block>()
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState<Event | CloseEvent>()

  useEffect(() => {
    ws.current = new WebSocket(OBSERVER)

    ws.current.onopen = () => {
      setConnected(true)
      ws.current?.send(
        JSON.stringify({ subscribe: 'new_block', chain_id: chainID })
      )
    }

    ws.current.onclose = (error) => {
      setConnected(false)
      setError(error)
    }

    ws.current.onerror = (error) => {
      setConnected(false)
      setError(error)
    }

    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data)
      setBlock(message.data.block)
    }
  }, [chainID, setBlock])

  return { connected, error, block }
}
