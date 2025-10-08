'use client';

import { useEffect, useState } from 'react';
import { socket } from '../lib/socket-io';

export function useSocket() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Set initial connection state
    setConnected(socket.connected);

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return { socket, connected };
}
