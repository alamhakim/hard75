function TaskEditor({ tasks, currentDate, onSave, onClose }) {
    const [editedTasks, setEditedTasks] = React.useState(tasks);

    const handleTaskChange = (taskId, field, value) => {
        try {
            setEditedTasks(prevTasks =>
                prevTasks.map(task =>
                    task.id === taskId
                        ? { ...task, [field]: value }
                        : task
                )
            );
        } catch (error) {
            reportError(error);
        }
    };

    const handleAddTask = () => {
        try {
            const newTask = {
                id: Date.now(),
                title: "New Task",
                startTime: "9:00 AM",
                endTime: "10:00 AM",
                completed: false
            };
            setEditedTasks([...editedTasks, newTask]);
        } catch (error) {
            reportError(error);
        }
    };

    const handleDeleteTask = (taskId) => {
        try {
            setEditedTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        } catch (error) {
            reportError(error);
        }
    };

    const handleSave = () => {
        try {
            const historicalData = loadFromLocalStorage('historicalData', {});
            const currentDateStr = currentDate.toISOString().split('T')[0];
            
            // Create a map of dates from current date onwards
            const futureDates = {};
            let date = new Date(currentDate);
            for (let i = 0; i < 365; i++) {
                const dateStr = date.toISOString().split('T')[0];
                futureDates[dateStr] = true;
                date.setDate(date.getDate() + 1);
            }

            // Update only current and future dates, preserve past dates
            const updatedHistoricalData = Object.keys(historicalData).reduce((acc, dateStr) => {
                if (futureDates[dateStr]) {
                    // Update future dates with new tasks
                    acc[dateStr] = {
                        ...historicalData[dateStr],
                        tasks: editedTasks.map(task => ({ ...task, completed: false }))
                    };
                } else {
                    // Preserve past dates
                    acc[dateStr] = historicalData[dateStr];
                }
                return acc;
            }, {});

            // Add current date if it doesn't exist
            if (!updatedHistoricalData[currentDateStr]) {
                updatedHistoricalData[currentDateStr] = {
                    tasks: editedTasks,
                    status: 'pending'
                };
            }

            saveToLocalStorage('historicalData', updatedHistoricalData);
            onSave(editedTasks);
            onClose();
        } catch (error) {
            reportError(error);
        }
    };

    return (
        <div data-name="task-editor" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Edit Tasks</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-4">
                    {editedTasks.map(task => (
                        <div
                            key={task.id}
                            data-name={`task-edit-${task.id}`}
                            className="bg-gray-700 p-4 rounded-lg flex flex-col space-y-3"
                        >
                            <div className="flex justify-between">
                                <input
                                    type="text"
                                    value={task.title}
                                    onChange={(e) => handleTaskChange(task.id, 'title', e.target.value)}
                                    className="bg-transparent border-b border-gray-600 focus:border-purple-500 outline-none flex-1 mr-4"
                                />
                                <button
                                    onClick={() => handleDeleteTask(task.id)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    🗑️
                                </button>
                            </div>
                            <div className="flex space-x-4">
                                <input
                                    type="text"
                                    value={task.startTime}
                                    onChange={(e) => handleTaskChange(task.id, 'startTime', e.target.value)}
                                    className="bg-transparent border-b border-gray-600 focus:border-purple-500 outline-none w-24"
                                    placeholder="Start Time"
                                />
                                <input
                                    type="text"
                                    value={task.endTime}
                                    onChange={(e) => handleTaskChange(task.id, 'endTime', e.target.value)}
                                    className="bg-transparent border-b border-gray-600 focus:border-purple-500 outline-none w-24"
                                    placeholder="End Time"
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 flex justify-between">
                    <button
                        onClick={handleAddTask}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
                    >
                        + Add Task
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}
