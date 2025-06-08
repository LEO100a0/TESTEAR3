function PerrosSection({ addToCart }) {
    const [products, setProducts] = useState([]);
    
    useEffect(() => {
        fetch('../data/perros.json')
            .then(response => response.json())
            .then(data => setProducts(data))
            .catch(error => console.error('Error loading products:', error));
    }, []);

    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-800">Productos para Perros</h2>
            <div className="grid product-grid gap-6">
                {products.map(product => (
                    <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden pet-card">
                        <img src={product.image} 
                             alt={product.name} 
                             className="w-full h-48 object-cover"/>
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-2">{product.name}</h3>
                            <p className="text-gray-600 mb-4 text-sm sm:text-base">{product.description}</p>
                            <div className="flex justify-between items-center flex-col sm:flex-row gap-2 sm:gap-0">
                                <span className="font-bold text-blue-600 text-sm sm:text-base">${product.price.toFixed(2)}</span>
                                <button 
                                    onClick={() => addToCart(product)}
                                    className="bg-blue-600 text-white px-3 sm:px-4 py-1 sm:py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
                                >
                                    Añadir al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}