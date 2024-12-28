function VisionBoard({ onBack }) {
    const [visionItems, setVisionItems] = React.useState(() => 
        loadFromLocalStorage('visionItems', [
            {
                id: 1,
                title: "David Goggins Quote",
                image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&h=600&fit=crop",
                quote: "Stay hard! When you think you're done, you're only at 40% of your body's capability."
            },
            {
                id: 2,
                title: "Andy Frisella",
                image: "https://images.unsplash.com/photo-1553484771-371a605b060b?w=800&h=600&fit=crop",
                quote: "Success isn't about being the best. It's about being better than you were yesterday."
            },
            {
                id: 3,
                title: "Dubai Luxury",
                image: "https://images.unsplash.com/photo-1582672752486-dab67774f3f3?w=800&h=600&fit=crop",
                description: "5-star luxury experience in Dubai"
            },
            {
                id: 4,
                title: "Family Happiness",
                image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&h=600&fit=crop",
                description: "Creating lasting memories with loved ones"
            },
            {
                id: 5,
                title: "Islamic Inspiration",
                image: "https://images.unsplash.com/photo-1564683214965-3619addd900d?w=800&h=600&fit=crop",
                description: "Finding peace and purpose through faith"
            }
        ])
    );
    const [cropData, setCropData] = React.useState(null);

    React.useEffect(() => {
        try {
            saveToLocalStorage('visionItems', visionItems);
        } catch (error) {
            reportError(error);
        }
    }, [visionItems]);

    const handleImageUpload = async (itemId, file) => {
        try {
            if (!file) return;
            
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                setCropData({
                    itemId,
                    image: e.target.result
                });
            };
            reader.readAsDataURL(file);
        } catch (error) {
            reportError(error);
        }
    };

    const handleCrop = (croppedImage) => {
        try {
            setVisionItems(prevItems =>
                prevItems.map(item =>
                    item.id === cropData.itemId
                        ? { ...item, image: croppedImage }
                        : item
                )
            );
            setCropData(null);
        } catch (error) {
            reportError(error);
        }
    };

    const handleImagePaste = (itemId) => async (event) => {
        try {
            const items = event.clipboardData.items;
            const item = Array.from(items).find(item => item.type.indexOf('image') !== -1);
            
            if (item) {
                const file = item.getAsFile();
                await handleImageUpload(itemId, file);
            }
        } catch (error) {
            reportError(error);
        }
    };

    const handleTextChange = (itemId, field) => (event) => {
        try {
            setVisionItems(prevItems =>
                prevItems.map(item =>
                    item.id === itemId
                        ? { ...item, [field]: event.target.value }
                        : item
                )
            );
        } catch (error) {
            reportError(error);
        }
    };

    const handleDrop = (itemId) => (event) => {
        try {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            
            if (file && file.type.startsWith('image/')) {
                handleImageUpload(itemId, file);
            }
        } catch (error) {
            reportError(error);
        }
    };

    const triggerFileInput = (itemId) => {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e) => {
                if (e.target.files[0]) {
                    handleImageUpload(itemId, e.target.files[0]);
                }
            };
            input.click();
        } catch (error) {
            reportError(error);
        }
    };

    const handleAddItem = () => {
        try {
            const newItem = {
                id: Date.now(),
                title: "New Vision",
                image: "https://images.unsplash.com/photo-1614032686163-bdc24c13d0b6?w=800&h=600&fit=crop",
                description: "Add your vision description"
            };
            setVisionItems([...visionItems, newItem]);
        } catch (error) {
            reportError(error);
        }
    };

    const handleDeleteItem = (itemId) => {
        try {
            setVisionItems(prevItems => prevItems.filter(item => item.id !== itemId));
        } catch (error) {
            reportError(error);
        }
    };

    return (
        <div data-name="vision-board" className="min-h-screen bg-gray-900 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <button
                        data-name="back-button"
                        onClick={onBack}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        ← Back to Tasks
                    </button>
                    <button
                        data-name="add-vision-button"
                        onClick={handleAddItem}
                        className="px-6 py-3 bg-purple-600 bg-opacity-90 hover:bg-opacity-100 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                        <span className="flex items-center">
                            <span className="text-xl mr-2">+</span>
                            <span>Add Vision</span>
                        </span>
                    </button>
                </div>
                
                <h1 data-name="vision-title" className="text-3xl font-bold mb-8 text-center">Vision Board</h1>
                
                <div data-name="vision-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {visionItems.map((item) => (
                        <div
                            data-name={`vision-item-${item.id}`}
                            key={item.id}
                            className="bg-gray-800 rounded-lg overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.02]"
                        >
                            <div
                                data-name={`vision-image-container-${item.id}`}
                                className="relative h-48 group cursor-pointer"
                                onPaste={handleImagePaste(item.id)}
                                onDrop={handleDrop(item.id)}
                                onDragOver={(e) => e.preventDefault()}
                                onClick={() => triggerFileInput(item.id)}
                            >
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-center p-4">
                                    <p className="text-white text-sm">
                                        Click to upload image<br />
                                        or<br />
                                        Paste/Drag & Drop
                                    </p>
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-2">
                                    <input
                                        type="text"
                                        value={item.title}
                                        onChange={handleTextChange(item.id, 'title')}
                                        className="text-xl font-bold bg-transparent border-b border-gray-700 focus:border-purple-500 outline-none flex-1 mr-2"
                                    />
                                    <button
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                    >
                                        🗑️
                                    </button>
                                </div>
                                {item.quote !== undefined ? (
                                    <textarea
                                        value={item.quote}
                                        onChange={handleTextChange(item.id, 'quote')}
                                        className="w-full bg-transparent text-gray-300 italic resize-none min-h-[80px] border-b border-gray-700 focus:border-purple-500 outline-none"
                                        placeholder="Enter an inspiring quote..."
                                    />
                                ) : (
                                    <textarea
                                        value={item.description}
                                        onChange={handleTextChange(item.id, 'description')}
                                        className="w-full bg-transparent text-gray-300 resize-none min-h-[80px] border-b border-gray-700 focus:border-purple-500 outline-none"
                                        placeholder="Enter a description..."
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {cropData && (
                <ImageCropper
                    image={cropData.image}
                    onCrop={handleCrop}
                    onCancel={() => setCropData(null)}
                />
            )}
        </div>
    );
}
