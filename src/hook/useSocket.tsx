'use client';

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from 'react';
import { Socket } from 'socket.io-client';
import { getSocket } from '../lib/socket-io';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
}

const SocketContext = createContext<SocketContextType>({ socket: null, connected: false });

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const latestSocket = useRef<Socket | null>(null);

  useEffect(() => {
    let cancelled = false;
    let teardown: (() => void) | null = null;

    const attachSocket = async () => {
      const client = await getSocket();
      if (!client || cancelled) {
        client?.disconnect();
        return;
      }

      const handleConnect = () => {
        setConnected(true);
        console.log('[socket] connected');
      };
      const handleDisconnect = () => {
        setConnected(false);
        console.log('[socket] disconnected');
      };
      const handleError = (error: Error) => console.error('[socket] connection error', error);

      client.on('connect', handleConnect);
      client.on('disconnect', handleDisconnect);
      client.on('connect_error', handleError);

      if (client.connected) {
        setConnected(true);
      }

      latestSocket.current = client;
      setSocket(client);

      teardown = () => {
        client.off('connect', handleConnect);
        client.off('disconnect', handleDisconnect);
        client.off('connect_error', handleError);
        client.disconnect();
        if (latestSocket.current === client) {
          latestSocket.current = null;
          setSocket(null);
          setConnected(false);
        }
      };
    };

    attachSocket();

    return () => {
      cancelled = true;
      teardown?.();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, connected }}>
      {children}
    </SocketContext.Provider>
  );
};
