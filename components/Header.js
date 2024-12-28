function Header({ onEditTasks, onLogout }) {
    return (
        <div data-name="header" className="flex justify-between items-center p-4">
            <div data-name="header-left" className="flex items-center space-x-2">
                <div data-name="trophy-icon" className="text-purple-400 text-2xl bounce-animation">🏆</div>
                <div>
                    <h1 data-name="app-title" className="text-xl font-bold">Power List</h1>
                    <p data-name="app-subtitle" className="text-sm text-gray-400">Focus on what matters most</p>
                </div>
            </div>
            <div data-name="header-actions" className="flex space-x-4">
                <button
                    data-name="edit-button"
                    onClick={onEditTasks}
                    className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    ✏️ Edit Tasks
                </button>
                <button
                    data-name="logout-button"
                    onClick={onLogout}
                    className="px-4 py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
                >
                    👋 Logout
                </button>
            </div>
        </div>
    );
}
