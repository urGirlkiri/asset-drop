import toast, { Toaster } from "react-hot-toast"

const tabs = [
  {
    name: 'Dropzone',
    component: Dropzone
  },
  {
    name: 'Projects',
    component: () => <p className="text-secondary-dark">Projects</p>
  },
  {
    name: 'History',
    component: HistoryList
  },
  {
    name: 'Settings',
    component: () => <p className="text-secondary-dark">Settings</p>
  }
]

function App({ isPanel = false }) {
  const [currentTab, setCurrentTab] = useState(tabs[0])

useEffect(() => {
    const loadingId = toast.loading("Connecting to bridge...")

    const handleMessage = (message: any) => {
      if (message.type === 'PING') {
        toast.dismiss(loadingId)

        if (message.success === true) {
          toast.success("Connected to bridge!", { id: 'bridge-status' })
        } else {
          const errorMsg = message.message || message.error || "Unknown error"
          toast.error(`Bridge Failed: ${errorMsg}`, { id: 'bridge-status' })
        }
      }
    }

    browser.runtime.onMessage.addListener(handleMessage)

    browser.runtime.sendMessage({ type: 'PING' }).catch(() => {
        toast.dismiss(loadingId)
        toast.error("Background script unreachable", { id: 'bridge-status' }) 
    })

    return () => {
      browser.runtime.onMessage.removeListener(handleMessage)
      toast.dismiss(loadingId)
    }
  }, [])

  const CurrentTabComp = tabs.find((tab) => tab.name === currentTab.name)!.component


  return (
    <main className='flex flex-col gap-2 bg-primary-light w-full min-w-[400px] h-screen min-h-[500px]'>
      <Header />
      <Toaster position="top-right" />
      {(!isPanel && currentTab.name === 'Dropzone') && <SidePanelBtn />}

      <div className='flex flex-col flex-1 p-4'>
        <ul className='flex justify-center items-center gap-4 bg-light-fill p-4 rounded-lg'>
          {
            tabs.map((tab, index) => (
              <li
                key={index}
                onClick={() => setCurrentTab(tab)}
                className={cn(
                  'p-4 rounded-lg transition-colors cursor-pointer',
                  tab.name === currentTab.name
                    ? 'text-black bg-primary-light'
                    : 'text-secondary-dark hover:bg-primary-light/30 hover:text-black'
                )}
              >
                <p>{tab.name}</p>
              </li>
            ))
          }
        </ul>

        <div className='flex flex-1 mt-4'>
          <CurrentTabComp isPanel={isPanel} />
        </div>
      </div>
    </main>
  )


}

export default App

