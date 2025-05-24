import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/shared/services/authService";
import { MessageResponse } from "@/entities/Message";
import { API_URL, WS_URL } from "@/shared/api/apiConfig";
import { useGetUser } from "@/features/hooks/useGetUser";

export const useChatSocket = (chatUuid: string, user_id: number) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!chatUuid || !user_id) return;

    // 2. Достаём токен авторизации
    const token = getToken();
    if (!token) {
      console.error("Нет токена — соединение WS не будет установлено");
      return;
    }
    // адрес вашего WS-сервера
    console.log(
      "Connecting WS to",
      `${API_URL}/message/ws/${user_id}/${chatUuid}?token=${token}`
    );
    try {
      const ws = new WebSocket(
        `${API_URL}/message/ws/${user_id}/${chatUuid}?token=${token}`
      );

      ws.onmessage = (event) => {
        const newMsg: MessageResponse = JSON.parse(event.data);
        // добавляем в кэш React Query
        queryClient.setQueryData<MessageResponse[]>(
          ["getMessageChat", chatUuid],
          (old = []) => [...old, newMsg]
        );
      };

      ws.onerror = (e) => console.error("WS error:", e);
      ws.onclose = (e) => {
        console.log('WS closed:', e.code, e.reason, 'clean?', e.wasClean);
    };
      
      return () => {
        ws.close();
      };
    } catch (err) {
      console.error("Failed to construct WebSocket:", err);
    }
  }, [chatUuid, user_id, queryClient]);
};
