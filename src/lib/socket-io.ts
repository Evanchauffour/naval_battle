import { io } from "socket.io-client";

async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const response = await fetch('/api/socket-token', {
      credentials: 'include',
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.token || null;
  } catch (error) {
    return null;
  }
}

export const getSocket = async () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    console.warn('Missing NEXT_PUBLIC_API_URL, socket not initialised.');
    return null;
  }

  const token = await getAccessToken();
  if (!token) {
    return null;
  }

  return io(`${baseUrl}/`, {
    auth: {
      token,
    },
    withCredentials: true,
    transports: ['websocket'],
  });
};
