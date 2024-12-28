function ImageCropper({ image, onCrop, onCancel }) {
    const [crop, setCrop] = React.useState({ x: 0, y: 0, scale: 1 });
    const imageRef = React.useRef(null);

    const handleMouseDown = (e) => {
        try {
            const startX = e.clientX - crop.x;
            const startY = e.clientY - crop.y;

            const handleMouseMove = (e) => {
                const x = Math.max(Math.min(e.clientX - startX, 0), -imageRef.current.width * (crop.scale - 1));
                const y = Math.max(Math.min(e.clientY - startY, 0), -imageRef.current.height * (crop.scale - 1));
                setCrop(prev => ({ ...prev, x, y }));
            };

            const handleMouseUp = () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } catch (error) {
            reportError(error);
        }
    };

    const handleWheel = (e) => {
        try {
            e.preventDefault();
            const scale = Math.max(1, Math.min(3, crop.scale + (e.deltaY > 0 ? -0.1 : 0.1)));
            setCrop(prev => ({ ...prev, scale }));
        } catch (error) {
            reportError(error);
        }
    };

    const handleTouchStart = (e) => {
        try {
            if (e.touches.length === 2) {
                const touch1 = e.touches[0];
                const touch2 = e.touches[1];
                const distance = Math.hypot(touch2.clientX - touch1.clientX, touch2.clientY - touch1.clientY);

                const handleTouchMove = (e) => {
                    if (e.touches.length === 2) {
                        const newTouch1 = e.touches[0];
                        const newTouch2 = e.touches[1];
                        const newDistance = Math.hypot(newTouch2.clientX - newTouch1.clientX, newTouch2.clientY - newTouch1.clientY);
                        const scale = Math.max(1, Math.min(3, crop.scale * (newDistance / distance)));
                        setCrop(prev => ({ ...prev, scale }));
                    }
                };

                const handleTouchEnd = () => {
                    document.removeEventListener('touchmove', handleTouchMove);
                    document.removeEventListener('touchend', handleTouchEnd);
                };

                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', handleTouchEnd);
            }
        } catch (error) {
            reportError(error);
        }
    };

    const handleSave = () => {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = 800;
            canvas.height = 600;
            
            ctx.drawImage(
                imageRef.current,
                -crop.x / crop.scale,
                -crop.y / crop.scale,
                imageRef.current.width,
                imageRef.current.height,
                0,
                0,
                canvas.width,
                canvas.height
            );
            
            const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
            onCrop(croppedImage);
        } catch (error) {
            reportError(error);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-4xl w-full mx-4">
                <h3 className="text-xl font-bold mb-4">Adjust Image</h3>
                <div 
                    className="relative overflow-hidden h-[60vh] mb-4 cursor-move"
                    onMouseDown={handleMouseDown}
                    onWheel={handleWheel}
                    onTouchStart={handleTouchStart}
                >
                    <img
                        ref={imageRef}
                        src={image}
                        alt="Crop preview"
                        className="transform origin-top-left"
                        style={{
                            transform: `translate(${crop.x}px, ${crop.y}px) scale(${crop.scale})`,
                            maxHeight: '100%',
                            maxWidth: '100%'
                        }}
                        draggable="false"
                    />
                </div>
                <div className="text-sm text-gray-400 mb-4 text-center">
                    Drag to move • Scroll to zoom • Pinch to zoom on mobile
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}
