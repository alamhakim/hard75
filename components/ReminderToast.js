function ReminderToast({ onClose }) {
    React.useEffect(() => {
        try {
            const timer = setTimeout(() => {
                onClose();
            }, 60000); // 1 minute
            
            return () => clearTimeout(timer);
        } catch (error) {
            reportError(error);
        }
    }, [onClose]);

    return (
        <div 
            data-name="reminder-toast"
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-reminder"
        >
            <div className="flex items-center space-x-3">
                <span className="text-2xl">⚠️</span>
                <div>
                    <p className="font-bold">Andy Elliott Review</p>
                    <p className="text-sm opacity-90">Are you on target for all your goals? Focus!</p>
                </div>
            </div>
        </div>
    );
}
