import { Download, Plus, Link as LinkIcon, CheckCircle } from "lucide-react"

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

        if (link) {
            setDroppedLink(link)
            console.log("Captured Link:", link)
        }
    }

    const handleReset = () => setDroppedLink(null)

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
                    <div className="flex flex-col flex-1 gap-8">
                        <div className="grid-pattern grid-sm w-full h-3/4">

                        </div>

                        <div>

                        </div>

                        <div>

                        </div>

                    </div>
                    : droppedLink ?
                        <div className="flex flex-col flex-1 gap-8">
                            <div className="grid-pattern grid-sm w-full h-3/4">

                            </div>


                            <div className="flex justify-between">
                                <div>
                                    <p className="text-gray-400 uppercase">Title</p>
                                    <p>{assetName}</p>
                                </div>
                                <div>
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