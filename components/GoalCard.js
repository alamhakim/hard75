function GoalCard({ goal, isNew, onSave, onUpdate, onDelete, onCancel }) {
    const [editing, setEditing] = React.useState(isNew);
    const [formData, setFormData] = React.useState(
        goal || {
            title: '',
            description: '',
            deadline: '',
            milestones: [],
            category: 'personal'
        }
    );

    const handleSubmit = (e) => {
        try {
            e.preventDefault();
            if (isNew) {
                onSave(formData);
            } else {
                onUpdate(formData);
                setEditing(false);
            }
        } catch (error) {
            reportError(error);
        }
    };

    const handleAddMilestone = () => {
        try {
            setFormData(prev => ({
                ...prev,
                milestones: [
                    ...prev.milestones,
                    {
                        id: Date.now(),
                        title: '',
                        deadline: '',
                        completed: false,
                        steps: []
                    }
                ]
            }));
        } catch (error) {
            reportError(error);
        }
    };

    if (!editing && !isNew) {
        return (
            <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <span className="text-sm text-gray-400">{goal.category}</span>
                        <h3 className="text-xl font-bold">{goal.title}</h3>
                    </div>
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setEditing(true)}
                            className="p-2 hover:bg-gray-700 rounded"
                        >
                            ✏️
                        </button>
                        <button
                            onClick={onDelete}
                            className="p-2 hover:bg-gray-700 rounded text-red-400"
                        >
                            🗑️
                        </button>
                    </div>
                </div>

                <p className="text-gray-300 mb-4">{goal.description}</p>

                <div className="mb-4">
                    <div className="h-2 bg-gray-700 rounded-full">
                        <div
                            className="h-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"
                            style={{ width: `${goal.progress}%` }}
                        />
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                        {goal.progress}% Complete
                    </div>
                </div>

                <MilestoneList
                    milestones={goal.milestones}
                    onUpdate={(milestones) => onUpdate({ ...goal, milestones })}
                />

                <div className="mt-4 text-sm text-gray-400">
                    Deadline: {new Date(goal.deadline).toLocaleDateString()}
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="bg-gray-800 rounded-lg p-6 shadow-xl">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Category
                    </label>
                    <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                    >
                        <option value="personal">Personal</option>
                        <option value="career">Career</option>
                        <option value="health">Health</option>
                        <option value="financial">Financial</option>
                        <option value="spiritual">Spiritual</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Goal Title
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                        placeholder="Enter your goal"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                        rows="3"
                        placeholder="Describe your goal"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                        Deadline
                    </label>
                    <input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        className="w-full bg-gray-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
                        required
                    />
                </div>

                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-400">
                            Milestones
                        </label>
                        <button
                            type="button"
                            onClick={handleAddMilestone}
                            className="text-sm text-purple-400 hover:text-purple-300"
                        >
                            + Add Milestone
                        </button>
                    </div>
                    <MilestoneList
                        milestones={formData.milestones}
                        onUpdate={(milestones) => setFormData({ ...formData, milestones })}
                        isEditing={true}
                    />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                    {!isNew && (
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    {isNew && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                    >
                        {isNew ? 'Create Goal' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </form>
    );
}
