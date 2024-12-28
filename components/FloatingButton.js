function FloatingButton({ onClick, icon, label }) {
    return (
        <button
            data-name={`floating-button-${label}`}
            onClick={onClick}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-200 hover:scale-110 flex items-center space-x-2"
            title={label}
        >
            <span className="text-xl">{icon}</span>
            <span className="text-sm hidden md:inline">{label}</span>
        </button>
    );
}
