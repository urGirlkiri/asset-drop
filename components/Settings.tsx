import { Trash2, Archive, MoveRight, Download } from "lucide-react"

const Settings = () => {
    const { 
        moveAsset, setMoveAsset, 
        unzipAsset, setUnzipAsset,
        deleteAfterUnzip, setDeleteAfterUnzip 
    } = useSettingsStore()

    const ToggleRow = ({ label, description, checked, onChange, icon: Icon }: any) => (
        <div className="flex justify-between items-center gap-4 py-3 border-gray-100 last:border-0 border-b">
            <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-2 rounded-lg text-gray-500">
                    <Icon size={18} />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium text-gray-700 text-sm">{label}</span>
                    <span className="text-gray-400 text-xs">{description}</span>
                </div>
            </div>
            
            <label className="inline-flex relative items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={checked} 
                    onChange={(e) => onChange(e.target.checked)} 
                />
                <div className="peer after:top-0.5 after:left-0.5 after:absolute bg-gray-200 after:bg-white peer-checked:bg-blue-600 after:border after:border-gray-300 peer-checked:after:border-white rounded-full after:rounded-full peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 w-11 after:w-5 h-6 after:h-5 after:content-[''] after:transition-all peer-checked:after:translate-x-full"></div>
            </label>
        </div>
    )

    return (
        <div className="flex flex-col flex-1 gap-6 p-1">
            <div className="flex flex-col gap-1">
                <h3 className="font-bold text-gray-800 text-lg">Configuration</h3>
                <p className="text-gray-400 text-sm">Manage how assets are handled.</p>
            </div>

            <div className="flex flex-col bg-white shadow-sm p-4 border border-gray-200 rounded-xl">
                <ToggleRow 
                    label="Move to Project"
                    description="Move file from Downloads folder to Project path"
                    icon={MoveRight}
                    checked={moveAsset}
                    onChange={setMoveAsset}
                />
                
                <ToggleRow 
                    label="Auto Unzip"
                    description="Extract .zip files automatically"
                    icon={Archive}
                    checked={unzipAsset}
                    onChange={setUnzipAsset}
                />

                <div className={`transition-all duration-300 overflow-hidden ${unzipAsset ? 'max-h-20 opacity-100' : 'max-h-0 opacity-50'}`}>
                    <ToggleRow 
                        label="Delete Zip after Extract"
                        description="Remove the original .zip file to save space"
                        icon={Trash2}
                        checked={deleteAfterUnzip}
                        onChange={setDeleteAfterUnzip}
                    />
                </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-blue-600 text-xs">
                <p><strong>Note:</strong> Settings apply immediately to the next download.</p>
            </div>
        </div>
    )
}

export default Settings