function TaskList({ tasks, onToggleTask }) {
    return (
        <div data-name="task-list" className="p-4 space-y-2">
            {tasks.map(task => (
                <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={onToggleTask}
                />
            ))}
            <div data-name="non-negotiables" className="mt-8">
                <h3 className="text-center text-gray-400 text-lg mb-4">Non-negotiables</h3>
            </div>
        </div>
    );
}
