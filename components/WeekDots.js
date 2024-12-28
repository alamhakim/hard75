function WeekDots({ currentDayIndex, completionStatus }) {
    const dots = ['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => {
        const isActive = index === currentDayIndex;
        const status = completionStatus[index];
        
        let bgColor = 'bg-gray-700';
        if (isActive) {
            bgColor = 'bg-blue-500';
        } else if (status === 'win') {
            bgColor = 'bg-green-500';
        } else if (status === 'loss') {
            bgColor = 'bg-red-500';
        }
        
        const classes = `w-8 h-8 rounded-full flex items-center justify-center ${bgColor} text-white`;
        
        return (
            <div
                data-name={`week-dot-${day}`}
                key={index}
                className={classes}
            >
                {status === 'win' ? 'W' : status === 'loss' ? 'L' : day}
            </div>
        );
    });

    return (
        <div data-name="week-dots" className="flex justify-center space-x-2 my-4">
            {dots}
        </div>
    );
}
