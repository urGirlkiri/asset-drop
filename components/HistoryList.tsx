import { useHistoryStore } from "@/stores/useHistoryStore"
import { Trash2, ExternalLink, CheckCircle, XCircle, FileClock, FolderOpen } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const HistoryList = () => {
    const { items, clearHistory, removeItem } = useHistoryStore()

    if (items.length === 0) {
        return (
            <div className="flex flex-col flex-1 justify-center items-center gap-4 h-full text-gray-300">
                <div className="bg-gray-50 p-6 rounded-full">
                    <FileClock size={48} strokeWidth={1.5} />
                </div>
                <p>No history yet</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col flex-1 gap-4 w-full h-full overflow-hidden">
            <div className="flex justify-between items-center px-1 shrink-0">
                <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wider">Recent Activity</h3>
                <button 
                    onClick={clearHistory}
                    className="text-red-400 hover:text-red-600 text-xs hover:underline"
                >
                    Clear All
                </button>
            </div>

            <div className="flex flex-col gap-3 pr-2 pb-4 h-full overflow-y-auto custom-scrollbar">
                {items.map((item) => (
                    <div 
                        key={item.id} 
                        className="group relative flex flex-col gap-2 bg-white shadow-sm hover:shadow-md p-3 border border-gray-200 rounded-lg w-full transition-all shrink-0"
                    >
                        <div className="flex justify-between items-start gap-3 w-full">
                            <div className="mt-1 shrink-0">
                                {item.status === 'success' ? (
                                    <CheckCircle size={18} className="text-green-500" />
                                ) : (
                                    <XCircle size={18} className="text-red-500" />
                                )}
                            </div>

                            <div className="flex flex-col flex-1 gap-0.5 min-w-0 overflow-hidden">
                                <p className="font-medium text-gray-800 text-sm truncate" title={item.filename}>
                                    {item.filename}
                                </p>
                                
                                <div className="flex items-center gap-2 font-medium text-[10px] text-gray-400 uppercase whitespace-nowrap">
                                    <span>{item.size}</span>
                                    <span>•</span>
                                    <span>{formatDistanceToNow(new Date(item.date))} ago</span>
                                </div>

                                <div className="flex items-center gap-1 mt-1 text-blue-500 text-xs truncate" title={item.destinationPath}>
                                    <FolderOpen size={12} className="shrink-0" />
                                    <span className="truncate">{item.projectName}</span>
                                </div>
                            </div>

                            <button 
                                onClick={() => removeItem(item.id)}
                                className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all shrink-0"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                        
                        {item.status === 'failed' && item.error && (
                            <div className="bg-red-50 mt-1 p-2 rounded text-red-600 text-xs wrap-break-word">
                                {item.error}
                            </div>
                        )}
                        
                        <a 
                            href={item.url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="flex items-center gap-1 bg-gray-50 hover:bg-gray-100 mt-1 px-2 py-1.5 rounded w-full max-w-full text-[10px] text-gray-400 transition-colors"
                        >
                            <ExternalLink size={10} className="shrink-0" />
                            <span className="truncate">{item.url}</span>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HistoryList