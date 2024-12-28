function ActionStep({ steps, onUpdate, isEditing }) {
    const handleStepChange = (index, field, value) => {
        try {
            const updatedSteps = steps.map((step, i) =>
                i === index ? { ...step, [field]: value } : step
            );
            onUpdate(updatedSteps);
        } catch (error) {
            reportError(error);
        }
    };

    const handleDeleteStep = (index) => {
        try {
            const updatedSteps = steps.filter((_, i) => i !== index);
            onUpdate(updatedSteps);
        } catch (error) {
            reportError(error);
        }
    };

    if (isEditing) {
        return (
            <div className="space-y-2">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center space-x-2">
                        <input
                            type="text"
                            value={step.title}
                            onChange={(e) => handleStepChange(index, 'title', e.target.value)}
                            className="bg-transparent border-b border-gray-600 focus:border-purple-500 outline-none flex-1"
                            placeholder="Action step"
                        />
                        <button
                            type="button"
                            onClick={() => handleDeleteStep(index)}
                            className="text-red-400 hover:text-red-300"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {steps.map((step, index) => (
                <div key={step.id} className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={step.completed}
                        onChange={(e) => handleStepChange(index, 'completed', e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300"
                    />
                    <span className={step.completed ? 'line-through text-gray-400' : ''}>
                        {step.title}
                    </span>
                </div>
            ))}
        </div>
    );
}
