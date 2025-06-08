function ContactoSection() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Formulario enviado con éxito! Nos pondremos en contacto contigo pronto.');
        setFormData({
            name: '',
            email: '',
            phone: '',
            message: ''
        });
    };

    return (
        <div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-blue-800">Contacto</h2>
            
            <div className="grid contact-grid gap-8">
                {/* Formulario de contacto */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-700">Envíanos un mensaje</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Nombre</label>
                            <input 
                                type="text" 
                                id="name" 
                                name="name" 
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                name="email" 
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="phone" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Teléfono</label>
                            <input 
                                type="tel" 
                                id="phone" 
                                name="phone" 
                                value={formData.phone}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-gray-700 font-medium mb-2 text-sm sm:text-base">Mensaje</label>
                            <textarea 
                                id="message" 
                                name="message" 
                                rows="4"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                                required
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 font-medium w-full text-sm sm:text-base"
                        >
                            Enviar Mensaje
                        </button>
                    </form>
                </div>
                
                {/* Información de contacto y mapa */}
                <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
                    <h3 className="text-xl sm:text-2xl font-bold mb-4 text-blue-700">Información de contacto</h3>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <i className="fas fa-map-marker-alt text-blue-600 mt-1 mr-3"></i>
                            <div>
                                <h4 className="font-bold text-sm sm:text-base">Dirección</h4>
                                <p className="text-gray-600 text-sm sm:text-base">Calle Mascotas 123, Col. Animales Felices, Ciudad de México, 12345</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-phone text-blue-600 mr-3"></i>
                            <div>
                                <h4 className="font-bold text-sm sm:text-base">Teléfono</h4>
                                <p className="text-gray-600 text-sm sm:text-base">+52 55 1234 5678</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-envelope text-blue-600 mr-3"></i>
                            <div>
                                <h4 className="font-bold text-sm sm:text-base">Email</h4>
                                <p className="text-gray-600 text-sm sm:text-base">contacto@petstore.com</p>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <i className="fas fa-clock text-blue-600 mr-3"></i>
                            <div>
                                <h4 className="font-bold text-sm sm:text-base">Horario</h4>
                                <p className="text-gray-600 text-sm sm:text-base">Lunes a Viernes: 9:00 - 20:00<br/>Sábado y Domingo: 10:00 - 18:00</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Mapa */}
                    <div className="mt-6">
                        <div className="map-container rounded-lg overflow-hidden">
                            <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.88861477103!2d-99.1698386845336!3d19.427020746123914!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff3765e1f8a5%3A0x1a2d6b8e3a6e3a6e!2sPalacio%20de%20Bellas%20Artes!5e0!3m2!1ses!2smx!4v1621553820502!5m2!1ses!2smx" 
                                width="100%" 
                                height="300" 
                                style={{border:0}} 
                                allowFullScreen="" 
                                loading="lazy"
                                title="Ubicación de PetStore"
                            ></iframe>
                        </div>
                    </div>
                    
                    {/* Redes sociales */}
                    <div className="mt-6">
                        <h4 className="font-bold mb-3 text-sm sm:text-base">Síguenos en redes sociales</h4>
                        <div className="flex space-x-4">
                            <a href="#" className="bg-blue-600 text-white p-2 sm:p-3 rounded-full hover:bg-blue-700">
                                <i className="fab fa-facebook-f text-sm sm:text-base"></i>
                            </a>
                            <a href="#" className="bg-pink-600 text-white p-2 sm:p-3 rounded-full hover:bg-pink-700">
                                <i className="fab fa-instagram text-sm sm:text-base"></i>
                            </a>
                            <a href="#" className="bg-green-600 text-white p-2 sm:p-3 rounded-full hover:bg-green-700">
                                <i className="fab fa-whatsapp text-sm sm:text-base"></i>
                            </a>
                            <a href="#" className="bg-blue-400 text-white p-2 sm:p-3 rounded-full hover:bg-blue-500">
                                <i className="fab fa-twitter text-sm sm:text-base"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}