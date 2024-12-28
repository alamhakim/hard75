function TaskNotification({ task, onClose }) {
    React.useEffect(() => {
        try {
            const timer = setTimeout(() => {
                onClose();
            }, 10000); // 10 seconds
            
            return () => clearTimeout(timer);
        } catch (error) {
            reportError(error);
        }
    }, [onClose]);

    return (
        <div 
            data-name="task-notification"
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-notification"
        >
            <div className="flex items-center space-x-3">
                <span className="text-2xl">⏰</span>
                <div>
                    <p className="font-bold text-lg">{task.title}</p>
                    <p className="text-sm opacity-90">{task.startTime} - {task.endTime}</p>
                </div>
            </div>
        </div>
    );
}
