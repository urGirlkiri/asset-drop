import { useState, useEffect } from "react"
import { useProjectStore } from "@/stores/useProjectStore"
import { FolderPlus, Trash2, FolderSearch, Check, FolderOpen } from "lucide-react"
import toast from "react-hot-toast"

const Projects = () => {
    const { projects, addProject, removeProject, setActiveProject, activeProject } = useProjectStore()
    
    const [isAdding, setIsAdding] = useState(false)
    const [newName, setNewName] = useState("")
    const [newPath, setNewPath] = useState("")

    useEffect(() => {
        const handleMsg = (msg: any) => {
            if (msg.type === 'FOLDER_PICKED_RESULT') { 
                setNewPath(msg.path)
                toast.success("Folder selected!")
            }
        }
        browser.runtime.onMessage.addListener(handleMsg)
        return () => browser.runtime.onMessage.removeListener(handleMsg)
    }, [])

    const handleBrowse = () => {
        browser.runtime.sendMessage({ type: 'TRIGGER_FOLDER_PICKER' })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newName || !newPath) return

        addProject({
            id: crypto.randomUUID(),
            name: newName,
            filePath: newPath
        })

        setNewName("")
        setNewPath("")
        setIsAdding(false)
        toast.success("Project added!")
    }

    return (
        <div className="flex flex-col flex-1 gap-4 h-full overflow-hidden">
            
            <div className="flex justify-between items-center px-1 shrink-0">
                <h3 className="font-bold text-gray-800 text-lg">My Projects</h3>
                <button 
                    onClick={() => setIsAdding(!isAdding)}
                    className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium text-sm transition-all",
                        isAdding 
                            ? "bg-gray-100 text-gray-600 hover:bg-gray-200" 
                            : "bg-accent-light text-white hover:brightness-90 shadow-sm shadow-accent-light/20"
                    )}
                >
                    {isAdding ? 'Cancel' : (
                        <>
                            <FolderPlus size={16} />
                            Add Project
                        </>
                    )}
                </button>
            </div>

            <div className={cn(
                "flex flex-col gap-3 border border-accent-light/20 rounded-xl overflow-hidden transition-all duration-300 ease-in-out bg-accent-light/5 shrink-0",
                isAdding ? "max-h-[500px] opacity-100 mb-2 p-4 border" : "max-h-0 opacity-0 p-0 border-0"
            )}>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-600 text-xs uppercase">Project Name</label>
                    <input 
                        type="text" 
                        placeholder="e.g. My RPG Game"
                        className="bg-white p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 w-full text-sm focus:ring-accent-light/50"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-600 text-xs uppercase">Project Path</label>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            placeholder="/home/kiri/GodotProjects/RPG"
                            className="flex-1 bg-white p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 font-mono text-xs focus:ring-accent-light/50"
                            value={newPath}
                            onChange={(e) => setNewPath(e.target.value)}
                        />
                        <button 
                            type="button"
                            onClick={handleBrowse}
                            title="Browse Folders"
                            className="bg-gray-100 hover:bg-gray-200 px-3 rounded-lg text-gray-600 transition-colors"
                        >
                            <FolderSearch size={18} />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-400">
                        We'll try to auto-detect an /assets folder if you pick the root.
                    </p>
                </div>

                <button 
                    onClick={handleSubmit}
                    disabled={!newName || !newPath}
                    className={cn(
                        "w-max",
                    "disabled:bg-gray-300 shadow-md disabled:shadow-none hover:brightness-90",
                    " mt-2 p-2 rounded-lg font-medium text-white text-sm transition-colors bg-accent-light shadow-accent-light/20 disabled:cursor-not-allowed"

                    )}
                >
                    Save Project
                </button>
            </div>

            {projects.length === 0 && !isAdding ? (
                <div className="flex flex-col flex-1 justify-center items-center gap-4 h-full text-gray-300">
                    <div className="bg-gray-50 p-6 rounded-full">
                        <FolderOpen size={48} strokeWidth={1.5} />
                    </div>
                    <p>No projects configured.</p>
                </div>
            ) : (
                <div className="flex flex-col flex-1 gap-3 pr-2 pb-4 min-h-0 overflow-y-auto custom-scrollbar">
                    {projects.map((p) => (
                        <div 
                            key={p.id}
                            onClick={() => setActiveProject(p.id)}
                            className={cn(
                                "group relative flex items-center gap-4 p-4 border rounded-xl transition-all cursor-pointer shrink-0",
                                activeProject?.id === p.id 
                                    ? "bg-accent-light/10 border-accent-light shadow-sm" 
                                    : "bg-white border-gray-200 hover:border-accent-light/50 hover:shadow-md"
                            )}
                        >
                            <div className={cn(
                                "p-3 rounded-full transition-colors",
                                activeProject?.id === p.id 
                                    ? "bg-accent-light text-white" 
                                    : "bg-gray-100 text-gray-400"
                            )}>
                                {activeProject?.id === p.id ? <Check size={20} /> : <FolderOpen size={20} />}
                            </div>

                            <div className="flex flex-col flex-1 min-w-0">
                                <h4 className={cn(
                                    "font-bold truncate transition-colors",
                                    activeProject?.id === p.id ? "text-gray-900" : "text-gray-700"
                                )}>
                                    {p.name}
                                </h4>
                                <p className="text-gray-400 text-xs truncate" title={p.filePath}>
                                    {p.filePath}
                                </p>
                            </div>

                            <button 
                                onClick={(e) => {
                                    e.stopPropagation()
                                    removeProject(p.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 p-2 text-gray-300 hover:text-red-500 transition-all"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Projects