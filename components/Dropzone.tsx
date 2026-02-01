import { Download, Plus, CheckCircle, Copy, Folder } from "lucide-react"
import toast from "react-hot-toast"
import { v4 as uuidv4 } from 'uuid' 

const Dropzone = ({ isPanel = false }) => {
    const { projects, setActiveProject, activeProject } = useProjectStore()
    const { moveAsset, unzipAsset } = useSettingsStore()
    const { addItem } = useHistoryStore() 

    const [droppedLink, setDroppedLink] = useState<string | null>(null)
    const [assetName, setAssetName] = useState<string | null>(null)
    const [assetSize, setAssetSize] = useState<string | null>(null)

    const [isDragging, setIsDragging] = useState(false)
    const [hasDownloaded, setHasDownloaded] = useState(false)
    const [scraping, setScraping] = useState(true)
    const [processing, setProcessing] = useState(moveAsset || unzipAsset)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        const handleRuntimeMessage = (message: any) => {

            if (message.type === 'DOWNLOAD_STARTED') {
                setScraping(false)
            }

            if (message.type === 'DOWNLOAD_PROGRESS') {
                setProgress(message.progress)
                setAssetName(message.filename)
                const sizeInMB = (message.totalBytes / (1024 * 1024)).toFixed(2)
                setAssetSize(`${sizeInMB} MB`)
            }

            if (message.type === 'DOWNLOAD_COMPLETE') {
                setProgress(100)
                setHasDownloaded(true)
                
                if (assetName) {
                    addItem({
                        id: uuidv4(),
                        filename: assetName,
                        url: droppedLink || 'Unknown Source',
                        projectName: activeProject?.name || 'Unknown Project',
                        destinationPath: activeProject?.filePath || '',
                        date: new Date().toISOString(),
                        size: assetSize || 'Unknown',
                        status: 'success'
                    })
                }

                if (!moveAsset && !unzipAsset) {
                    setProcessing(false)
                }
            }

            if (message.type == 'DOWNLOAD_PROCESSED') {
                setProcessing(false)
                toast.success(message.message || "Processed successfully!")
            }

            if (message.type === 'DOWNLOAD_INTERRUPTED') {
                toast.error("Error: " + (message.error || "Interrupted"))
                
                addItem({
                    id: uuidv4(),
                    filename: assetName || 'Unknown File',
                    url: droppedLink || 'Unknown Source',
                    projectName: activeProject?.name || 'Unknown Project',
                    destinationPath: activeProject?.filePath || '',
                    date: new Date().toISOString(),
                    size: '-',
                    status: 'failed',
                    error: message.error
                })

                handleReset()
            }
        }

        browser.runtime.onMessage.addListener(handleRuntimeMessage)

        return () => browser.runtime.onMessage.removeListener(handleRuntimeMessage)
    }, [activeProject, droppedLink, assetName, assetSize, moveAsset, unzipAsset]) 

    const copyToClipboard = () => {
        if (droppedLink) {
            navigator.clipboard.writeText(droppedLink)
            toast.success('Copied to clipboard!')
        } else {
            toast.error('No link to copy!')
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const link = e.dataTransfer.getData("text/uri-list") || e.dataTransfer.getData("text/plain")

        const error = checkLink(link)
        if (error) {
            toast.error(error)
            return
        }

        setDroppedLink(link)
        setScraping(true)
        setHasDownloaded(false)
        setProcessing(moveAsset || unzipAsset)
        setProgress(0)

        browser.runtime.sendMessage({
            type: 'PROCESS_ASSET',
            url: link,
            targetProject: activeProject?.filePath
        })
    }

    const handleReset = () => {
        setDroppedLink(null)
        setAssetName(null)
        setAssetSize(null)
        setProgress(0)
        setHasDownloaded(false)
        setProcessing(moveAsset || unzipAsset)
    }

    return (
        <div className="flex flex-col flex-1 gap-4">
            {
                isPanel && !droppedLink &&
                <div className="flex justify-between items-center gap-4">
                    <div>
                        <h4>Send to Project</h4>
                        <p>Drop Assets directly into your project</p>
                    </div>

                    <select
                        onChange={(e) => setActiveProject(e.target.value)}
                        value={activeProject?.id || ''}
                        className="self-center p-3 border-2 border-gray-300 hover:border-gray-500 rounded-lg w-48"
                    >
                         <option value="" disabled>Select Project</option>
                        {
                            projects.map((project, index) => (
                                <option key={index} value={project.id} className="font-bold">{project.name}</option>
                            ))
                        }
                    </select>
                </div>
            }

            {
                hasDownloaded && !processing ?
                    <div className="flex flex-col flex-1 gap-6 animate-in duration-300 fade-in">
                        <div className="flex flex-1 justify-center items-center grid-pattern grid-sm bg-gray-50/50 border border-gray-100 rounded-xl w-full">
                            <div className="relative">
                                <div className="bg-blue-500/10 p-6 rounded-2xl">
                                    <Folder size={80} className="fill-blue-500 text-blue-500" />
                                </div>
                                <div className="-right-2 -bottom-2 absolute bg-secondary-dark p-1.5 border-4 border-white rounded-full text-white">
                                    <CheckCircle size={16} />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <h2 className="font-bold text-secondary-dark text-2xl">Complete!</h2>
                            <p className="text-gray-500">Copy your link or <span className="hover:text-gray-700 underline cursor-pointer">look what's inside.</span></p>
                        </div>

                        <div className="flex gap-2">
                            <div className="flex flex-1 items-center gap-3 bg-white shadow-sm px-3 py-3 border border-gray-200 rounded-lg w-10">
                                <p className="flex-1 text-gray-600 text-sm truncate">{droppedLink}</p>
                                <button onClick={copyToClipboard} className="text-gray-400 hover:text-gray-700">
                                    <Copy size={18} />
                                </button>
                            </div>
                            <button
                                onClick={handleReset}
                                className="bg-secondary-dark hover:bg-black px-6 py-3 rounded-lg font-medium text-white transition-colors"
                            >
                                Send another?
                            </button>
                        </div>
                    </div>
                    : droppedLink ?
                        <div className="flex flex-col flex-1 gap-8">
                            <div className="flex flex-col flex-1 justify-center items-center gap-6 grid-pattern grid-sm bg-gray-50/50 border border-gray-100 rounded-xl w-full">
                                <CircleProgress progress={progress} />
                                {
                                    <p className="text-primary-dark animate-pulse">
                                        {
                                            scraping ? 'Finding Asset...' :
                                            !hasDownloaded ? 'Downloading...' :
                                            'Processing...'
                                        }
                                    </p>
                                }
                            </div>

                            <div className="flex justify-between">
                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-400 uppercase">Asset</p>
                                    <p className="max-w-[150px] truncate">{assetName || '-'}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-400 uppercase">Size</p>
                                    <p>{assetSize || '-'}</p>
                                </div>
                            </div>

                            <div className="bg-gray-200 w-full h-[.1rem]"></div>

                            <button
                                onClick={handleReset}
                                className="shadow-2xl shadow-gray-500 p-4 border-2 border-gray-400 rounded-xl w-fit">
                                Cancel
                            </button>
                        </div>
                        :
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={cn(
                                "flex flex-col flex-1 justify-center items-center gap-4 transition-all duration-300 ease-in-out cursor-pointer",
                                "border-2 rounded-lg p-4",
                                isDragging && "grid-pattern grid-sm",
                                isDragging
                                    ? "border-accent-light bg-blue-50 scale-[1.02] shadow-xl border-dashed"
                                    : !isPanel
                                        ? "border-red-100 bg-red-50 border-dashed"
                                        : "bg-gray-50 border-gray-300 border-dashed hover:border-gray-400 hover:bg-gray-100",

                                isDragging ? "text-accent-light" : (!isPanel ? "text-red-300" : "text-gray-400")
                            )}
                        >
                            {isDragging ? (
                                <Plus size={30} className="mt- animate-bounce" />
                            ) : (
                                <Download size={80} strokeWidth={1.5} />
                            )}
                            {
                                !isDragging &&
                                <p >Drag and Drop Links Here</p>
                            }
                        </div>
            }
        </div>
    )
}

export default Dropzone