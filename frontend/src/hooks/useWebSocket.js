import { useEffect, useRef, useState } from 'react';

export const useWebSocket = (url) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => setIsConnected(true);
    ws.current.onmessage = (event) => setData(JSON.parse(event.data));
    ws.current.onerror = (event) => setError(event.message);
    ws.current.onclose = () => setIsConnected(false);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const send = (message) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { data, error, isConnected, send };
};

export default useWebSocket;
