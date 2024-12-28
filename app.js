function App() {
    // ... (previous state declarations remain the same)

    // Check time for reminders and task notifications
    React.useEffect(() => {
        try {
            const checkTime = () => {
                const now = new Date();
                const hours = now.getHours();
                const minutes = now.getMinutes();
                
                // Show reminder at 12:10 AM, 2 PM and 5 PM
                if ((hours === 0 && minutes === 10) || // 12:10 AM
                    (hours === 14 && minutes === 0) || // 2 PM
                    (hours === 17 && minutes === 0))   // 5 PM
                {
                    setShowReminder(true);
                }

                // Check for task notifications
                tasks.forEach(task => {
                    if (task.completed) return; // Skip completed tasks

                    const [time, period] = task.startTime.split(' ');
                    const [hours, minutes] = time.split(':').map(num => parseInt(num));
                    
                    let taskHour = hours;
                    if (period === 'PM' && hours !== 12) {
                        taskHour += 12;
                    } else if (period === 'AM' && hours === 12) {
                        taskHour = 0;
                    }

                    const now = new Date();
                    const currentHour = now.getHours();
                    const currentMinute = now.getMinutes();

                    if (currentHour === taskHour && currentMinute === minutes) {
                        setCurrentNotification(task);
                        setShowTaskNotification(true);
                        
                        // Auto-hide after 10 seconds
                        setTimeout(() => {
                            setShowTaskNotification(false);
                            setCurrentNotification(null);
                        }, 10000);
                    }
                });
            };

            // Check every minute
            const timer = setInterval(checkTime, 60000);
            
            // Initial check
            checkTime();

            return () => clearInterval(timer);
        } catch (error) {
            reportError(error);
        }
    }, [tasks]);

    // ... (rest of the component remains the same)
}
