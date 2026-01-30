const tabs = [
  {
    name: 'Dropzone',
    component: <Dropzone />
  },
  {
    name: 'Projects',
    component: <p className="text-secondary-dark">Projects</p>
  },
  {
    name: 'History',
    component: <p className="text-secondary-dark">History</p>
  },
  {
    name: 'Settings',
    component: <p className="text-secondary-dark">Settings</p>
  }
];

function App({ isPanel = false }) {
  const [currentTab, setCurrentTab] = useState(tabs[0]);

  return (
    <main className='flex flex-col gap-2 bg-primary-light min-w-[400px] min-h-[500px]'>
      <Header />

      { !isPanel && <SidePanelBtn/> }

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

        <div className='flex flex-1 justify-center items-center mt-4'>
          {currentTab.component}
        </div>
      </div>
    </main>
  );
}

export default App;