import { Info } from 'lucide-react'

const SidePanelBtn = () => {

    const handleOpenSidePanel = () => {
        const browserAPI = browser as any
        if (browserAPI.sidebarAction && browserAPI.sidebarAction.open) {
            browserAPI.sidebarAction.open()
            window.close()
            return
        }

        if (browser.sidePanel && browser.sidePanel.open) {
            browser.windows.getCurrent().then((windowObj) => {
                if (windowObj.id) {
                    browser.sidePanel.open({ windowId: windowObj.id })
                    window.close()
                }
            })
        }
    }

    return (
        <button
            onClick={handleOpenSidePanel}
            className="flex flex-row justify-center items-center self-center gap-2 bg-red-500 hover:bg-red-400 p-2 rounded-lg w-fit text-white">
            <Info />
            <p className="font-semibold text-sm text-center">Use Extension In SidePanel To Activate Dropzone</p>
        </button>
    )
}

export default SidePanelBtn