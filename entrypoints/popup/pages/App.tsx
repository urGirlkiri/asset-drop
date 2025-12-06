import { useState } from 'react';
import assetDropLogo from '@/assets/icon.svg';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className='bg-black h-fit w-fit' >
      <div>
        <h1 className='text-shadow-white'>Asset Drop</h1>
        <div className='w-28 h-28'>
        <img src={assetDropLogo} className="logo" alt="Asset Drop logo" />
        </div>
      </div>
    </main>
  );
}

export default App;
