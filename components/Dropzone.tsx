import { Download, Plus, Link as LinkIcon, CheckCircle, Copy, Folder } from "lucide-react"
import toast from "react-hot-toast"


const projects = [
    'Project 1',
    'Project 2',
    'Project 3',
    'Project 4',
    'Project 5',
]

const Dropzone = ({ isPanel = false }) => {
    const [selectedProject, setSelectedProject] = useState(projects[0])
    const [droppedLink, setDroppedLink] = useState<string | null>(null)

    const [assetName, setAssetName] = useState<string | null>(null)
    const [assetSize, setAssetSize] = useState<string | null>(null)

    const [isDragging, setIsDragging] = useState(false)
    const [hasDownloaded, setHasDownloaded] = useState(false)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (droppedLink && !hasDownloaded) {
            setProgress(0)
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        setTimeout(() => setHasDownloaded(true), 500)
                        return 100
                    }
                    return prev + 2
                })
            }, 50)
            return () => clearInterval(interval)
        }
    }, [droppedLink, hasDownloaded])


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
        try {
            const urlObj = new URL(link)
            const filename = urlObj.pathname.split('/').pop() || "downloaded_asset"
            setAssetName(filename)
        } catch (e) {
            setAssetName("Asset Link")
        }
        setAssetSize("128 KB")
    }

    const handleReset = () => {
        setDroppedLink(null)
        setAssetName(null)
        setAssetSize(null)
        setProgress(0)
        setHasDownloaded(false)
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
                        onChange={(e) => setSelectedProject(e.target.value)}
                        value={selectedProject}
                        className="self-center p-3 border-2 border-gray-300 hover:border-gray-500 rounded-lg w-48"
                    >
                        {
                            projects.map((project, index) => (
                                <option key={index} value={project} className="font-bold">{project}</option>
                            ))
                        }
                    </select>
                </div>
            }

            {
                hasDownloaded ?
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
                            <div className="flex flex-1 items-center gap- bg-white shadow-sm px-3 py-3 border border-gray-200 rounded-lg">
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
                            <div className="flex flex-1 justify-center items-center grid-pattern grid-sm bg-gray-50/50 border border-gray-100 rounded-xl w-full">
                                <CircleProgress progress={progress} />
                            </div>

                            <div className="flex justify-between">
                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-400 uppercase">Asset</p>
                                    <p>{assetName}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <p className="text-gray-400 uppercase">Size</p>
                                    <p>{assetSize}</p>
                                </div>


                            </div>

                            <div className="bg-gray bg-gray-200 w-full h-[.1rem]"></div>

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
                                "flex flex-col flex-1 justify-center items-center gap-4 transition-all duration-300 ease-in-out",
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
                                <Download size={100} />
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