import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/shared/services/authService";
import { MessageResponse } from "@/entities/Message";
import { API_URL } from "@/shared/api/apiConfig";

export interface UseChatSocketResult {
  live: MessageResponse[];
  sendMessage: (text: string) => void;
  status: "connecting" | "connected" | "error";
}

export function useChatSocket(
  chatUuid: string,
  enabled: boolean
): UseChatSocketResult {
  const queryClient = useQueryClient();
  const socketRef = useRef<WebSocket | null>(null);
  const [live, setLive] = useState<MessageResponse[]>([]);
  const [status, setStatus] = useState<UseChatSocketResult["status"]>("connecting");
  const reconnectTimeoutRef = useRef<number | undefined>(undefined);
  const queryKey = useMemo(() => ["getMessageChat", chatUuid], [chatUuid]);

  const connect = useCallback(() => {
    if (!enabled || !chatUuid) return;
    
    const token = getToken();
    if (!token) {
      console.error("No auth token, WS not connected");
      setStatus("error");
      return;
    }

    try {
      const ws = new WebSocket(
        `${API_URL}/message/ws/${chatUuid}?token=${token}`
      );
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("WS connected, readyState =", ws.readyState);
        setStatus("connected");
      };

      ws.onerror = (e) => {
        console.error("WS error:", e);
        setStatus("error");
      };

      ws.onclose = (e) => {
        console.log("WS closed:", e.code, e.reason, "clean?", e.wasClean);
        setStatus("error");
        socketRef.current = null;
        
        // Попытка переподключения через 3 секунды
        reconnectTimeoutRef.current = window.setTimeout(() => {
          console.log("Attempting to reconnect...");
          connect();
        }, 3000);
      };

      ws.onmessage = (event) => {
        try {
          // Проверяем, является ли входящее сообщение строкой
          const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
          const msg: MessageResponse = typeof data === 'string' ? JSON.parse(data) : data;
          
          console.log("Received message:", msg);

          if (!msg || !msg.id) {
            console.error("Invalid message format:", msg);
            return;
          }

          // Avoid duplicates in live buffer
          setLive((prev) =>
            prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]
          );
          // Update React Query cache
          queryClient.setQueryData<MessageResponse[]>(queryKey, (old = []) =>
            old.find((m) => m.id === msg.id) ? old : [...old, msg]
          );
        } catch (err) {
          if (err instanceof Error) {
            console.error("Failed to parse WS message", err.message, "Raw data:", event.data);
          } else {
            console.error("Failed to parse WS message", String(err), "Raw data:", event.data);
          }
        }
      };
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to create WebSocket connection:", err.message);
      } else {
        console.error("Failed to create WebSocket connection:", String(err));
      }
      setStatus("error");
    }
  }, [chatUuid, enabled, queryClient, queryKey]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((text: string) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WS not open, attempting to reconnect...");
      connect();
      return;
    }
    const payload = {
      chat_uuid: chatUuid,
      text,
      created_at: new Date().toISOString(),
    };
    ws.send(JSON.stringify(payload));
    
    // Optimistic update in cache
    const optimistic: MessageResponse = {
      id: Date.now(), // Используем timestamp как временный числовой id
      user_id: 0, // Временный ID, будет заменен реальным после ответа сервера
      chat_uuid: chatUuid,
      text,
      created_at: new Date().toISOString(),
    };

    queryClient.setQueryData<MessageResponse[]>(queryKey, (old = []) => [
      ...old,
      optimistic,
    ]);
  }, [chatUuid, connect, queryClient, queryKey]);

  return { live, sendMessage, status };
}

// export const useChatSocket = (
//   chatUuid: string,
//   user_id: number,
//   enabled: boolean
// )=> {
//   const queryClient = useQueryClient();
//   const queryKey = ["getMessageChat", chatUuid];
//   // const sendMessage = (text: string) => {
//   //   const socketRef = useRef<WebSocket | null>(null);

//   //   if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
//   //   const payload = { chatUuid, user_id, text, created_at: new Date().toISOString() };
//   //   socketRef.current.send(JSON.stringify(payload));
//   //   // оптимистично пишем в кеш
//   //   queryClient.setQueryData<MessageResponse[]>(queryKey, old => [
//   //     ...(old||[]),
//   //     { ...payload, id: `temp-${Date.now()}` },
//   //   ]);
//   // };
//   const socketRef = useRef<WebSocket | null>(null);
//   const [live, setLive] = useState<MessageResponse[]>([]);

//   useEffect(() => {
//     if (!enabled||!chatUuid || !user_id) return;

//     const token = getToken();
//     if (!token) {
//       console.error("Нет токена — соединение WS не будет установлено");
//       return;
//     }
//     console.log(
//       "Connecting WS to",
//       `${API_URL}/message/ws/${user_id}/${chatUuid}?token=${token}`
//     );
//     try {
//       const ws = new WebSocket(
//         `${API_URL}/message/ws/${user_id}/${chatUuid}?token=${token}`
//       );
//       socketRef.current = ws;

//       ws.onmessage = (event) => {
//         const msg: MessageResponse = JSON.parse(event.data);
//         const queryKey: [string, string] = ["getMessageChat", msg.chat_uuid];
//         console.log("newMsg", msg);
//         // queryClient.setQueryData<MessageResponse[]>(queryKey, (old = []) => {
//         //   // если вдруг дубли, фильтруем
//         //   if (old.find((m) => m.id === newMsg.id)) return old;
//         //   return [...old, newMsg];
//         // });
//         setLive(prev => prev.find(m=>m.id===msg.id) ? prev : [...prev, msg]);
//       // **и** пушим в кеш, чтобы useGetMessageChat.data тоже обновился
//       queryClient.setQueryData(queryKey, (old: MessageResponse[] = []) =>
//         old.find(m=>m.id===msg.id) ? old : [...old, msg]
//       );
//       };
//       ws.onopen = () => console.log("WS opened, readyState =", ws.readyState);

//       ws.onerror = (e) => console.error("WS error:", e);
//       ws.onclose = (e) => {
//         console.log("WS closed:", e.code, e.reason, "clean?", e.wasClean);
//       };

//       return () => {
//         ws.close();
//       };
//     } catch (err) {
//       console.error("Failed to construct WebSocket:", err);
//     }
//   }, [chatUuid, user_id,enabled, queryClient ]);
//   const sendMessage = (text: string) => {
//     if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) return;
//     const payload = { chatUuid, user_id, text, created_at: new Date().toISOString() };
//     socketRef.current.send(JSON.stringify(payload));
//     // оптимистично пишем в кеш
//     // queryClient.setQueryData<MessageResponse[]>(queryKey, old => [
//     //   ...(old||[]),
//     //   { ...payload, id: `temp-${Date.now()}` },
//     // ]);
//   };

//   return { sendMessage }}
