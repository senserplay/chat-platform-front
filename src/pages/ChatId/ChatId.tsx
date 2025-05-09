import { useParams } from "react-router-dom"
import { useGetChatId } from "./hooks/useGetChatId";
import { LoaderSpinner } from "@/features/LoaderSpinner";
import { Text } from "@chakra-ui/react";

export const ChatId=()=>{
    const {chat_uuid}=useParams();
    console.log(chat_uuid)
    const { data, isLoading, isError } = useGetChatId(chat_uuid || '');
console.log(data)
    if (!data || isLoading || isError) return <LoaderSpinner />;

    return(
        <><Text>{data.title}</Text></>
    )
}