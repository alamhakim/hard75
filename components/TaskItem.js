function TaskItem({ task, onToggle }) {
    return (
        <div
            data-name={`task-${task.id}`}
            className="task-item flex items-center justify-between p-4 bg-gray-800 rounded-lg mb-2 cursor-pointer"
            onClick={() => onToggle(task.id)}
        >
            <div className="flex items-center space-x-4 min-w-0">
                <div
                    data-name={`task-checkbox-${task.id}`}
                    className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200
                        ${task.completed ? 'bg-purple-500 border-purple-500' : 'border-gray-600'}`}
                />
                <span 
                    data-name={`task-title-${task.id}`} 
                    className="text-base font-medium text-gray-100 truncate pr-4"
                >
                    {task.title}
                </span>
            </div>
            <span 
                data-name={`task-time-${task.id}`} 
                className="text-sm text-gray-400 flex-shrink-0"
            >
                {task.startTime} - {task.endTime}
            </span>
        </div>
    );
}
