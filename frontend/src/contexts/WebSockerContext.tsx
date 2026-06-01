import React, { createContext, useContext, useEffect, useState } from 'react'
import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useAuth } from './AuthContext'
import { authStorage } from '../shared/auth/auth.storage'

const WebSocketContext = createContext<Client | null>(null)

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  // useState ao invés de useRef — dispara re-render quando o client muda
  const [client, setClient] = useState<Client | null>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      setClient((prev) => {
        prev?.deactivate()
        return null
      })
      return
    }

    const token = authStorage.getAccessToken()
    // URL deve bater com o endpoint registrado no WebSocketConfig
    const socketUrl = `${import.meta.env.VITE_BACKEND_URL}/spif-websocket`

    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    })

    stompClient.onConnect = () => {
      console.log('[ws] conectado')
      // Atualiza o estado — consumidores recebem o client conectado
      setClient(stompClient)
    }

    stompClient.onDisconnect = () => {
      console.log('[ws] desconectado')
      setClient(null)
    }

    stompClient.onStompError = (frame) => {
      console.error('[ws] erro STOMP:', frame.headers['message'])
    }

    stompClient.activate()

    return () => {
      stompClient.deactivate()
      setClient(null)
    }
  }, [isAuthenticated])

  return (
    <WebSocketContext.Provider value={client}>
      {children}
    </WebSocketContext.Provider>
  )
}

export const useWebSocket = () => useContext(WebSocketContext)