const CircleProgress = ({ progress, size = 120 }: { progress: number, size?: number}) => {
    const strokeWidth = 12
    const center = size / 2
    const radius = size / 2 - strokeWidth / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (progress / 100) * circumference

    return (
        <div className="relative flex justify-center items-center">
            <svg width={size} height={size} className="-rotate-90 transform">
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="stroke-gray-100"
                />
                {/* Progress Ring */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="stroke-accent-light transition-all duration-300 ease-out"
                />
            </svg>
            <div className="absolute flex flex-col items-center">
                <span className="font-bold text-gray-800 text-xl">{progress}%</span>
            </div>
        </div>
    )
}

export default CircleProgress