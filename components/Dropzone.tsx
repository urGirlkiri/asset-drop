import { Download } from "lucide-react"

const projects = [
    'Project 1',
    'Project 2',
    'Project 3',
    'Project 4',
    'Project 5',
]

const Dropzone = ({ isPanel = false }) => {
    const [selectedProject, setSelectedProject] = useState(projects[0])

    return (
        <div className="flex flex-col flex-1 gap-4">

          {
            isPanel &&   <div className="flex justify-between items-center gap-4">
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

            <div className={cn(
                "flex flex-col flex-1 justify-center items-center gap-4",
                "border-2 p-4 rounded-lg",
                !isPanel ? "border-red-50" : "bg-gray-200  border-gray-300  hover:border-gray-600 ",
                !isPanel ? "text-red-300" : "text-gray-400 hover:text-secondary-dark"
            )}>
                <Download size={100} />

                <p >Drag and Drop Links Here</p>
            </div>
        </div>
    )
}

export default Dropzone