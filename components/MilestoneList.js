function MilestoneList({ milestones, onUpdate, isEditing }) {
    const handleMilestoneChange = (index, field, value) => {
        try {
            const updatedMilestones = milestones.map((milestone, i) =>
                i === index ? { ...milestone, [field]: value } : milestone
            );
            onUpdate(updatedMilestones);
        } catch (error) {
            reportError(error);
        }
    };

    const handleDeleteMilestone = (index) => {
        try {
            const updatedMilestones = milestones.filter((_, i) => i !== index);
            onUpdate(updatedMilestones);
        } catch (error) {
            reportError(error);
        }
    };

    const handleAddStep = (milestoneIndex) => {
        try {
            const updatedMilestones = milestones.map((milestone, index) => {
                if (index === milestoneIndex) {
                    return {
                        ...milestone,
                        steps: [
                            ...milestone.steps,
                            {
                                id: Date.now(),
                                title: '',
                                completed: false
                            }
                        ]
                    };
                }
                return milestone;
            });
            onUpdate(updatedMilestones);
        } catch (error) {
            reportError(error);
        }
    };

    if (isEditing) {
        return (
            <div className="space-y-4">
                {milestones.map((milestone, index) => (
                    <div key={milestone.id} className="bg-gray-700 p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                            <input
                                type="text"
                                value={milestone.title}
                                onChange={(e) => handleMilestoneChange(index, 'title', e.target.value)}
                                className="bg-transparent border-b border-gray-600 focus:border-purple-500 outline-none flex-1 mr-2"
                                placeholder="Milestone title"
                            />
                            <button
                                type="button"
                                onClick={() => handleDeleteMilestone(index)}
                                className="text-red-400 hover:text-red-300"
                            >
                                🗑️
                            </button>
                        </div>
                        
                        <input
                            type="date"
                            value={milestone.deadline}
                            onChange={(e) => handleMilestoneChange(index, 'deadline', e.target.value)}
                            className="bg-transparent border-b border-gray-600 focus:border-purple-500 outline-none w-full mt-2"
                        />

                        <div className="mt-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm text-gray-400">Action Steps</span>
                                <button
                                    type="button"
                                    onClick={() => handleAddStep(index)}
                                    className="text-sm text-purple-400 hover:text-purple-300"
                                >
                                    + Add Step
                                </button>
                            </div>
                            <ActionStep
                                steps={milestone.steps}
                                onUpdate={(steps) => handleMilestoneChange(index, 'steps', steps)}
                                isEditing={true}
                            />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {milestones.map((milestone, index) => (
                <div key={milestone.id} className="bg-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{milestone.title}</h4>
                        <input
                            type="checkbox"
                            checked={milestone.completed}
                            onChange={(e) => handleMilestoneChange(index, 'completed', e.target.checked)}
                            className="w-4 h-4 rounded border-gray-300"
                        />
                    </div>
                    <ActionStep
                        steps={milestone.steps}
                        onUpdate={(steps) => handleMilestoneChange(index, 'steps', steps)}
                    />
                    <div className="text-sm text-gray-400 mt-2">
                        Due: {new Date(milestone.deadline).toLocaleDateString()}
                    </div>
                </div>
            ))}
        </div>
    );
}
