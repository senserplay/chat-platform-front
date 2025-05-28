import { useEffect, useRef, useState } from "react";
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
  const queryKey = ["getMessageChat", chatUuid];

  useEffect(() => {
    if (!enabled || !chatUuid) return;
    const token = getToken();
    if (!token) {
      console.error("No auth token, WS not connected");
      return;
    }

    const ws = new WebSocket(
      `${API_URL}/message/ws/${chatUuid}?token=${token}`
    );
    socketRef.current = ws;

    ws.onopen = () => console.log("WS connected, readyState =", ws.readyState);
    ws.onerror = (e) => console.error("WS error:", e);
    ws.onclose = (e) =>
      console.log("WS closed:", e.code, e.reason, "clean?", e.wasClean);

    ws.onmessage = (event) => {
      try {
        const msg: MessageResponse = JSON.parse(event.data);
        // Avoid duplicates in live buffer
        setLive((prev) =>
          prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]
        );
        // Update React Query cache
        queryClient.setQueryData<MessageResponse[]>(queryKey, (old = []) =>
          old.find((m) => m.id === msg.id) ? old : [...old, msg]
        );
      } catch (err) {
        console.error("Failed to parse WS message", err);
      }
    };

    return () => {
      ws.close();
      socketRef.current = null;
    };
  }, [chatUuid, enabled, queryClient]);

  const sendMessage = (text: string) => {
    const ws = socketRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.error("WS not open");
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
      ...payload,
      id: `temp-${Date.now()}`,
    } as any;
    queryClient.setQueryData<MessageResponse[]>(queryKey, (old = []) => [
      ...old,
      optimistic,
    ]);
  };

  const status: UseChatSocketResult["status"] = socketRef.current
    ? socketRef.current.readyState === WebSocket.OPEN
      ? "connected"
      : "connecting"
    : "error";

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
