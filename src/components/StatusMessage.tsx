interface StatusMessageProps{
    type : "loading" | "error" | "empty",
    message : string,
}

const Color_Map: Record<StatusMessageProps["type"], string> = {
    loading: "text-gray-600",
    error: "text-red-700",
    empty: "text-gray-400"
}

function StatusMessage({type, message}: StatusMessageProps) {
    return (
        <div className={`py-10 px-4 text-center text-sm ${Color_Map[type]}`}>
            {message}
        </div>
    )
}

export default StatusMessage;