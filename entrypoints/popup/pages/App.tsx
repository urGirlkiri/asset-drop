import assetDropLogo from '@/assets/LightIcon.svg';

const tabs = [
  'Dropzone',
  'Projects',
  'History',
  'Settings'
]

function App() {

  const [currentTab, setCurrentTab] = useState(tabs[0])

  return (
    <main className='flex flex-col gap-2 bg-primary-light w-[500px] h-[500px]' >

      <div className='flex items-center gap-2 bg-light-fill p-2 border-light-fill border-b'>
        <div className='mt-1'>
          <img src={assetDropLogo} className="logo" alt="Asset Drop logo" />
        </div>
        <h2 className='font-semibold text-secondary-dark text-2xl'>Asset Drop</h2>
      </div>

      <div className='flex flex-col flex-1 p-4'>
        <ul className='flex justify-center items-center gap-4 bg-light-fill p-4 rounded-lg'>
          {
            tabs.map((tab, index) => (
              <li
                key={index}
                onClick={() => setCurrentTab(tab)}
                className={cn(
                  'p-4 rounded-lg transition-colors cursor-pointer',
                  tab === currentTab ? ' text-black bg-primary-light' 
                    : 'text-secondary-dark hover:bg-primary-light/30 hover:text-black'
                )}
              >
                <p>{tab}</p>
              </li>
            ))
          }
        </ul>

        <div className='flex flex-1 justify-center items-center'>
          <p className="font-medium text-secondary-dark text-xl">{currentTab}</p>
        </div>
      </div>
    </main>
  );
}

export default App;