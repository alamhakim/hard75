function GoalPlanner({ onBack }) {
    const [goals, setGoals] = React.useState(() => 
        loadFromLocalStorage('goals', [])
    );
    const [showNewGoalForm, setShowNewGoalForm] = React.useState(false);

    const handleAddGoal = (newGoal) => {
        try {
            const updatedGoals = [...goals, {
                ...newGoal,
                id: Date.now(),
                progress: 0,
                createdAt: new Date().toISOString()
            }];
            setGoals(updatedGoals);
            saveToLocalStorage('goals', updatedGoals);
            setShowNewGoalForm(false);
        } catch (error) {
            reportError(error);
        }
    };

    const handleUpdateGoal = (goalId, updates) => {
        try {
            const updatedGoals = goals.map(goal =>
                goal.id === goalId ? { ...goal, ...updates } : goal
            );
            setGoals(updatedGoals);
            saveToLocalStorage('goals', updatedGoals);
        } catch (error) {
            reportError(error);
        }
    };

    const handleDeleteGoal = (goalId) => {
        try {
            const updatedGoals = goals.filter(goal => goal.id !== goalId);
            setGoals(updatedGoals);
            saveToLocalStorage('goals', updatedGoals);
        } catch (error) {
            reportError(error);
        }
    };

    return (
        <div data-name="goal-planner" className="min-h-screen p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        ← Back to Tasks
                    </button>
                    <button
                        onClick={() => setShowNewGoalForm(true)}
                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-colors"
                    >
                        <span className="flex items-center">
                            <span className="text-xl mr-2">+</span>
                            Add New Goal
                        </span>
                    </button>
                </div>

                <h1 className="text-3xl font-bold mb-8 text-center">Goal Planner</h1>

                {showNewGoalForm && (
                    <GoalCard
                        isNew={true}
                        onSave={handleAddGoal}
                        onCancel={() => setShowNewGoalForm(false)}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {goals.map(goal => (
                        <GoalCard
                            key={goal.id}
                            goal={goal}
                            onUpdate={(updates) => handleUpdateGoal(goal.id, updates)}
                            onDelete={() => handleDeleteGoal(goal.id)}
                        />
                    ))}
                </div>

                {goals.length === 0 && !showNewGoalForm && (
                    <div className="text-center text-gray-400 py-12">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-xl">Start planning your goals</p>
                        <p className="text-sm mt-2">Click "Add New Goal" to begin your journey</p>
                    </div>
                )}
            </div>
        </div>
    );
}
