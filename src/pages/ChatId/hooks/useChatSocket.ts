import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getToken } from "@/shared/services/authService";
import { MessageResponse } from "@/entities/Message";
import { API_URL, WS_URL } from "@/shared/api/apiConfig";
import { useGetUser } from "@/features/hooks/useGetUser";

export const useChatSocket = (
  chatUuid: string,
  user_id: number,
  enabled: boolean
) => {
  const queryClient = useQueryClient();
  const queryKey = ["getMessageChat", chatUuid];

  useEffect(() => {
    if (!enabled||!chatUuid || !user_id) return;

    const token = getToken();
    if (!token) {
      console.error("Нет токена — соединение WS не будет установлено");
      return;
    }
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
        const queryKey: [string, string] = ["getMessageChat", newMsg.chat_uuid];
        console.log("newMsg", newMsg);
        queryClient.setQueryData<MessageResponse[]>(queryKey, (old = []) => {
          // если вдруг дубли, фильтруем
          if (old.find((m) => m.id === newMsg.id)) return old;
          return [...old, newMsg];
        });
      };
      ws.onopen = () => console.log("WS opened, readyState =", ws.readyState);

      ws.onerror = (e) => console.error("WS error:", e);
      ws.onclose = (e) => {
        console.log("WS closed:", e.code, e.reason, "clean?", e.wasClean);
      };

      return () => {
        ws.close();
      };
    } catch (err) {
      console.error("Failed to construct WebSocket:", err);
    }
  }, [chatUuid, user_id,enabled, queryClient]);
};
