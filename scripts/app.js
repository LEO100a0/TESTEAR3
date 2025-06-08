const { useState, useEffect, useRef } = React;

function PetStore() {
    const [activeTab, setActiveTab] = useState('novedades');
    const [darkMode, setDarkMode] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    
    // Cargar carrito desde localStorage al iniciar
    useEffect(() => {
        const savedCart = localStorage.getItem('petStoreCart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // Guardar carrito en localStorage cuando cambia
    useEffect(() => {
        localStorage.setItem('petStoreCart', JSON.stringify(cartItems));
    }, [cartItems]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
        if (!darkMode) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
    };

    const addToCart = (product) => {
        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === product.id);
            if (existingItem) {
                return prevItems.map(item =>
                    item.id === product.id 
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...prevItems, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (productId) => {
        setCartItems(prevItems => 
            prevItems.filter(item => item.id !== productId)
        );
    };

    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === productId 
                    ? { ...item, quantity: newQuantity }
                    : item
            )
        );
    };

    const calculateTotal = () => {
        return cartItems.reduce(
            (total, item) => total + (item.price * item.quantity),
            0
        ).toFixed(2);
    };

    const renderTabContent = () => {
        switch(activeTab) {
            case 'gatos':
                return <GatosSection addToCart={addToCart} />;
            case 'perros':
                return <PerrosSection addToCart={addToCart} />;
            case 'conejos':
                return <ConejosSection addToCart={addToCart} />;
            case 'juego':
                return <JuegoSection />;
            case 'contacto':
                return <ContactoSection />;
            default:
                return <NovedadesSection addToCart={addToCart} />;
        }
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="bg-blue-600 text-white shadow-lg">
                <div className="container mx-auto px-4 py-4 sm:py-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <i className="fas fa-paw text-2xl"></i>
                            <h1 className="text-xl sm:text-2xl font-bold">PetStore</h1>
                        </div>
                        <div className="hidden md:flex space-x-4 sm:space-x-6">
                            <button 
                                onClick={() => setActiveTab('novedades')} 
                                className={`py-2 px-2 sm:px-3 ${activeTab === 'novedades' ? 'active' : 'text-white hover:text-blue-200'}`}
                            >
                                Novedades
                            </button>
                            <button 
                                onClick={() => setActiveTab('gatos')} 
                                className={`py-2 px-2 sm:px-3 ${activeTab === 'gatos' ? 'active' : 'text-white hover:text-blue-200'}`}
                            >
                                Gatos
                            </button>
                            <button 
                                onClick={() => setActiveTab('perros')} 
                                className={`py-2 px-2 sm:px-3 ${activeTab === 'perros' ? 'active' : 'text-white hover:text-blue-200'}`}
                            >
                                Perros
                            </button>
                            <button 
                                onClick={() => setActiveTab('conejos')} 
                                className={`py-2 px-2 sm:px-3 ${activeTab === 'conejos' ? 'active' : 'text-white hover:text-blue-200'}`}
                            >
                                Conejos
                            </button>
                            <button 
                                onClick={() => setActiveTab('juego')} 
                                className={`py-2 px-2 sm:px-3 ${activeTab === 'juego' ? 'active' : 'text-white hover:text-blue-200'}`}
                            >
                                Juego
                            </button>
                            <button 
                                onClick={() => setActiveTab('contacto')} 
                                className={`py-2 px-2 sm:px-3 ${activeTab === 'contacto' ? 'active' : 'text-white hover:text-blue-200'}`}
                            >
                                Contacto
                            </button>
                        </div>
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="relative">
                                <button 
                                    onClick={() => setShowCart(!showCart)}
                                    className="p-2 rounded-full hover:bg-blue-700 relative"
                                >
                                    <i className="fas fa-shopping-cart"></i>
                                    {cartItems.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {cartItems.reduce((total, item) => total + item.quantity, 0)}
                                        </span>
                                    )}
                                </button>
                                {showCart && (
                                    <div className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-md shadow-lg z-50 cart-modal">
                                        <div className="p-4 border-b">
                                            <h3 className="font-bold text-gray-800">Tu Carrito</h3>
                                        </div>
                                        <div className="max-h-60 sm:max-h-96 overflow-y-auto">
                                            {cartItems.length === 0 ? (
                                                <div className="p-4 text-center text-gray-600">
                                                    El carrito está vacío
                                                </div>
                                            ) : (
                                                <ul>
                                                    {cartItems.map(item => (
                                                        <li key={item.id} className="border-b cart-item">
                                                            <div className="p-3 flex justify-between items-center">
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium text-gray-800 text-sm sm:text-base">{item.name}</h4>
                                                                    <p className="text-xs sm:text-sm text-gray-600">${item.price.toFixed(2)} x {item.quantity}</p>
                                                                </div>
                                                                <div className="flex items-center space-x-2">
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            updateQuantity(item.id, item.quantity - 1);
                                                                        }}
                                                                        className="text-gray-500 hover:text-blue-600 text-xs sm:text-sm"
                                                                    >
                                                                        <i className="fas fa-minus"></i>
                                                                    </button>
                                                                    <span className="text-xs sm:text-sm">{item.quantity}</span>
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            updateQuantity(item.id, item.quantity + 1);
                                                                        }}
                                                                        className="text-gray-500 hover:text-blue-600 text-xs sm:text-sm"
                                                                    >
                                                                        <i className="fas fa-plus"></i>
                                                                    </button>
                                                                    <button 
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            removeFromCart(item.id);
                                                                        }}
                                                                        className="text-red-500 hover:text-red-700 ml-2 text-xs sm:text-sm"
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                        {cartItems.length > 0 && (
                                            <div className="p-4 border-t">
                                                <div className="flex justify-between font-bold text-gray-800 mb-4 text-sm sm:text-base">
                                                    <span>Total:</span>
                                                    <span>${calculateTotal()}</span>
                                                </div>
                                                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 text-sm sm:text-base">
                                                    Finalizar Compra
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={toggleDarkMode}
                                className="p-2 rounded-full hover:bg-blue-700"
                                title={darkMode ? "Modo claro" : "Modo oscuro"}
                            >
                                {darkMode ? (
                                    <i className="fas fa-sun"></i>
                                ) : (
                                    <i className="fas fa-moon"></i>
                                )}
                            </button>
                            <button 
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className="md:hidden p-2 rounded-full hover:bg-blue-700"
                            >
                                <i className="fas fa-bars"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu */}
            {showMobileMenu && (
                <div className="md:hidden bg-blue-700 text-white py-2 px-4">
                    <div className="flex flex-col space-y-3">
                        <button 
                            onClick={() => {
                                setActiveTab('novedades');
                                setShowMobileMenu(false);
                            }} 
                            className={`py-2 px-3 text-left ${activeTab === 'novedades' ? 'active' : 'text-white hover:text-blue-200'}`}
                        >
                            Novedades
                        </button>
                        <button 
                            onClick={() => {
                                setActiveTab('gatos');
                                setShowMobileMenu(false);
                            }} 
                            className={`py-2 px-3 text-left ${activeTab === 'gatos' ? 'active' : 'text-white hover:text-blue-200'}`}
                        >
                            Gatos
                        </button>
                        <button 
                            onClick={() => {
                                setActiveTab('perros');
                                setShowMobileMenu(false);
                            }} 
                            className={`py-2 px-3 text-left ${activeTab === 'perros' ? 'active' : 'text-white hover:text-blue-200'}`}
                        >
                            Perros
                        </button>
                        <button 
                            onClick={() => {
                                setActiveTab('conejos');
                                setShowMobileMenu(false);
                            }} 
                            className={`py-2 px-3 text-left ${activeTab === 'conejos' ? 'active' : 'text-white hover:text-blue-200'}`}
                        >
                            Conejos
                        </button>
                        <button 
                            onClick={() => {
                                setActiveTab('juego');
                                setShowMobileMenu(false);
                            }} 
                            className={`py-2 px-3 text-left ${activeTab === 'juego' ? 'active' : 'text-white hover:text-blue-200'}`}
                        >
                            Juego
                        </button>
                        <button 
                            onClick={() => {
                                setActiveTab('contacto');
                                setShowMobileMenu(false);
                            }} 
                            className={`py-2 px-3 text-left ${activeTab === 'contacto' ? 'active' : 'text-white hover:text-blue-200'}`}
                        >
                            Contacto
                        </button>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="container mx-auto px-4 py-6 sm:py-8">
                {renderTabContent()}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-4">
                    <div className="grid footer-grid gap-8">
                        <div>
                            <h3 className="text-xl font-bold mb-4">PetStore</h3>
                            <p className="text-gray-300 text-sm sm:text-base">La mejor tienda para tus mascotas. Productos de calidad y atención personalizada.</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Enlaces rápidos</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-300 hover:text-white text-sm sm:text-base">Inicio</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white text-sm sm:text-base">Productos</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white text-sm sm:text-base">Servicios</a></li>
                                <li><a href="#" className="text-gray-300 hover:text-white text-sm sm:text-base">Contacto</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Contacto</h4>
                            <ul className="space-y-2">
                                <li className="flex items-center space-x-2 text-gray-300 text-sm sm:text-base">
                                    <i className="fas fa-map-marker-alt"></i>
                                    <span>Calle Mascotas 123, Ciudad</span>
                                </li>
                                <li className="flex items-center space-x-2 text-gray-300 text-sm sm:text-base">
                                    <i className="fas fa-phone"></i>
                                    <span>+1 234 567 890</span>
                                </li>
                                <li className="flex items-center space-x-2 text-gray-300 text-sm sm:text-base">
                                    <i className="fas fa-envelope"></i>
                                    <span>info@petstore.com</span>
                                </li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-4">Síguenos</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-300 hover:text-white text-xl"><i className="fab fa-facebook"></i></a>
                                <a href="#" className="text-gray-300 hover:text-white text-xl"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="text-gray-300 hover:text-white text-xl"><i className="fab fa-instagram"></i></a>
                                <a href="#" className="text-gray-300 hover:text-white text-xl"><i className="fab fa-tiktok"></i></a>
                            </div>
                            <div className="mt-4">
                                <p className="text-gray-300 text-sm sm:text-base">Suscríbete a nuestro newsletter</p>
                                <div className="flex mt-2">
                                    <input type="email" placeholder="Tu email" className="px-3 py-2 rounded-l text-gray-800 w-full text-sm sm:text-base"/>
                                    <button className="bg-blue-600 px-4 py-2 rounded-r hover:bg-blue-700">
                                        <i className="fas fa-paper-plane"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400 text-sm sm:text-base">
                        <p>&copy; {new Date().getFullYear()} PetStore. Todos los derechos reservados.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

// Renderizar la aplicación
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<PetStore />);