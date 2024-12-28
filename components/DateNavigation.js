function DateNavigation({ currentDate, onPrevDay, onNextDay }) {
    return (
        <div data-name="date-navigation" className="flex justify-between items-center px-4 py-2">
            <button
                data-name="prev-day"
                onClick={onPrevDay}
                className="date-nav-button p-2 rounded-lg"
            >
                ←
            </button>
            <h2 data-name="current-date" className="text-xl font-semibold">
                {currentDate.toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })}
            </h2>
            <button
                data-name="next-day"
                onClick={onNextDay}
                className="date-nav-button p-2 rounded-lg"
            >
                →
            </button>
        </div>
    );
}
