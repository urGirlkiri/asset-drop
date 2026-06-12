import assetDropLogo from '@/assets/LightIcon.svg';

const Header = () => {
    return (
        <div className='flex items-center gap-2 bg-light-fill p-2 border-gray-500 border-b'>
            <div className='mt-1'>
                <img src={assetDropLogo} className="logo" alt="Asset Drop logo" />
            </div>
            <h2 className='font-semibold text-secondary-dark text-2xl'>Asset Drop</h2>
        </div>
    )
}

export default Header