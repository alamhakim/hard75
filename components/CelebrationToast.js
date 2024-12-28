function CelebrationToast({ onClose }) {
    React.useEffect(() => {
        try {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            
            return () => clearTimeout(timer);
        } catch (error) {
            reportError(error);
        }
    }, [onClose]);

    return (
        <div 
            data-name="celebration-toast"
            className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-lg shadow-xl z-50 animate-celebration"
        >
            <div className="flex items-center space-x-3">
                <span className="text-2xl">🏆</span>
                <div>
                    <p className="font-bold">Another day completed in 75 hard!</p>
                    <p className="text-sm opacity-90">One day closer to your Goals</p>
                </div>
            </div>
        </div>
    );
}
