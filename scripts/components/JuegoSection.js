function JuegoSection() {
    const [playerPosition, setPlayerPosition] = useState({ x: 50, y: 50 });
    const [pets, setPets] = useState([]);
    const [collected, setCollected] = useState(0);
    const [level, setLevel] = useState(1);
    const [gameStarted, setGameStarted] = useState(false);
    const [joystickActive, setJoystickActive] = useState(false);
    const [joystickPosition, setJoystickPosition] = useState({ x: 75, y: 75 });
    const [joystickDirection, setJoystickDirection] = useState({ x: 0, y: 0 });
    const joystickAreaRef = useRef(null);
    const joystickRef = useRef(null);
    const gameAreaRef = useRef(null);
    
    const petTypes = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const isMobile = window.innerWidth <= 768;
    const gameAreaSize = isMobile ? { width: window.innerWidth - 40, height: 300 } : { width: 800, height: 500 };
    const playerSize = isMobile ? 30 : 40;
    const petSize = isMobile ? 25 : 30;
    const speed = isMobile ? 4 : 5;
    
    // Inicializar el juego
    const startGame = () => {
        setPlayerPosition({ x: gameAreaSize.width / 2, y: gameAreaSize.height / 2 });
        setPets(generatePets(5));
        setCollected(0);
        setLevel(1);
        setGameStarted(true);
    };
    
    // Generar mascotas aleatorias
    const generatePets = (count) => {
        const newPets = [];
        for (let i = 0; i < count; i++) {
            newPets.push({
                id: Math.random().toString(36).substring(7),
                x: Math.random() * (gameAreaSize.width - petSize),
                y: Math.random() * (gameAreaSize.height - petSize),
                type: petTypes[Math.floor(Math.random() * petTypes.length)],
                collected: false
            });
        }
        return newPets;
    };
    
    // Mover al jugador
    const movePlayer = (dx, dy) => {
        setPlayerPosition(prev => {
            let newX = prev.x + dx;
            let newY = prev.y + dy;
            
            // Limitar al área de juego
            newX = Math.max(0, Math.min(gameAreaSize.width - playerSize, newX));
            newY = Math.max(0, Math.min(gameAreaSize.height - playerSize, newY));
            
            return { x: newX, y: newY };
        });
    };
    
    // Detectar colisiones
    const checkCollisions = () => {
        setPets(prevPets => {
            const newPets = [...prevPets];
            let collectedCount = 0;
            
            newPets.forEach(pet => {
                if (!pet.collected &&
                    playerPosition.x < pet.x + petSize &&
                    playerPosition.x + playerSize > pet.x &&
                    playerPosition.y < pet.y + petSize &&
                    playerPosition.y + playerSize > pet.y) {
                    pet.collected = true;
                    collectedCount++;
                }
            });
            
            if (collectedCount > 0) {
                setCollected(prev => {
                    const newCollected = prev + collectedCount;
                    // Subir de nivel cada 10 mascotas
                    if (Math.floor(newCollected / 10) + 1 > level) {
                        setLevel(Math.floor(newCollected / 10) + 1);
                    }
                    return newCollected;
                });
            }
            
            // Filtrar mascotas recolectadas y agregar nuevas si es necesario
            const remainingPets = newPets.filter(pet => !pet.collected);
            if (remainingPets.length < 3) {
                return [...remainingPets, ...generatePets(5 - remainingPets.length)];
            }
            
            return remainingPets;
        });
    };
    
    // Controles de teclado (solo para desktop)
    useEffect(() => {
        if (!gameStarted || isMobile) return;
        
        const handleKeyDown = (e) => {
            let dx = 0, dy = 0;
            
            switch(e.key) {
                case 'ArrowUp': dy = -speed; break;
                case 'ArrowDown': dy = speed; break;
                case 'ArrowLeft': dx = -speed; break;
                case 'ArrowRight': dx = speed; break;
                default: return;
            }
            
            movePlayer(dx, dy);
        };
        
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameStarted, isMobile]);
    
    // Controles táctiles (joystick)
    useEffect(() => {
        if (!gameStarted || !isMobile || !joystickAreaRef.current || !joystickRef.current) return;
        
        const joystickArea = joystickAreaRef.current;
        const joystick = joystickRef.current;
        
        const handleTouchStart = (e) => {
            e.preventDefault();
            setJoystickActive(true);
            updateJoystickPosition(e);
        };
        
        const handleTouchMove = (e) => {
            e.preventDefault();
            if (joystickActive) {
                updateJoystickPosition(e);
            }
        };
        
        const handleTouchEnd = (e) => {
            e.preventDefault();
            setJoystickActive(false);
            setJoystickPosition({ x: 75, y: 75 });
            setJoystickDirection({ x: 0, y: 0 });
        };
        
        const updateJoystickPosition = (e) => {
            const rect = joystickArea.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const touch = e.touches[0] || e.changedTouches[0];
            const touchX = touch.clientX;
            const touchY = touch.clientY;
            
            // Calcular distancia desde el centro
            let dx = touchX - centerX;
            let dy = touchY - centerY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Limitar al área del joystick
            const maxDistance = 75;
            if (distance > maxDistance) {
                dx = dx * maxDistance / distance;
                dy = dy * maxDistance / distance;
            }
            
            // Actualizar posición visual del joystick
            setJoystickPosition({
                x: 75 + dx,
                y: 75 + dy
            });
            
            // Calcular dirección (normalizada)
            setJoystickDirection({
                x: dx / maxDistance,
                y: dy / maxDistance
            });
        };
        
        joystickArea.addEventListener('touchstart', handleTouchStart, { passive: false });
        joystickArea.addEventListener('touchmove', handleTouchMove, { passive: false });
        joystickArea.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        return () => {
            joystickArea.removeEventListener('touchstart', handleTouchStart);
            joystickArea.removeEventListener('touchmove', handleTouchMove);
            joystickArea.removeEventListener('touchend', handleTouchEnd);
        };
    }, [gameStarted, isMobile, joystickActive]);
    
    // Mover jugador con joystick
    useEffect(() => {
        if (!gameStarted || !joystickActive) return;
        
        const moveInterval = setInterval(() => {
            movePlayer(joystickDirection.x * speed, joystickDirection.y * speed);
        }, 16); // ~60fps
            
        return () => clearInterval(moveInterval);
    }, [gameStarted, joystickActive, joystickDirection]);
    
    // Verificar colisiones en cada actualización
    useEffect(() => {
        if (!gameStarted) return;
        
        const gameLoop = setInterval(() => {
            checkCollisions();
        }, 100);
        
        return () => clearInterval(gameLoop);
    }, [gameStarted, playerPosition]);
    
    return (
        <div className="w-full flex flex-col items-center px-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4">Colección de Mascotas</h1>
            
            {!gameStarted ? (
                <div className="text-center">
                    <p className="mb-6 text-sm sm:text-base">
                        {isMobile ? "Toca el joystick para moverte y recolectar mascotas" : "Usa las flechas del teclado para moverte y recolectar mascotas"}
                    </p>
                    <button 
                        onClick={startGame}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-full text-sm sm:text-lg transition"
                    >
                        Comenzar Juego
                    </button>
                </div>
            ) : (
                <>
                    <div className="flex justify-between w-full mb-2 sm:mb-4 gap-2">
                        <div className="bg-blue-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-base">
                            <span className="font-bold">Nivel:</span> {level}
                        </div>
                        <div className="bg-green-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-base">
                            <span className="font-bold">Recolectadas:</span> {collected}
                        </div>
                        <div className="bg-yellow-100 px-2 sm:px-4 py-1 sm:py-2 rounded-lg text-xs sm:text-base">
                            <span className="font-bold">Objetivo:</span> {level * 10}
                        </div>
                    </div>
                    
                    <div 
                        ref={gameAreaRef}
                        className="relative bg-blue-200 border-4 border-blue-300 rounded-lg overflow-hidden"
                        style={{ 
                            width: `${gameAreaSize.width}px`, 
                            height: `${gameAreaSize.height}px`,
                            maxWidth: '100%'
                        }}
                    >
                        {/* Jugador */}
                        <div 
                            className="absolute bg-red-500 rounded-full flex items-center justify-center text-xl font-bold text-white pet"
                            style={{
                                left: `${playerPosition.x}px`,
                                top: `${playerPosition.y}px`,
                                width: `${playerSize}px`,
                                height: `${playerSize}px`,
                            }}
                        >
                            🧍
                        </div>
                        
                        {/* Mascotas */}
                        {pets.map(pet => (
                            <div
                                key={pet.id}
                                className={`absolute flex items-center justify-center text-2xl pet ${pet.collected ? 'pet-collected' : ''}`}
                                style={{
                                    left: `${pet.x}px`,
                                    top: `${pet.y}px`,
                                    width: `${petSize}px`,
                                    height: `${petSize}px`,
                                }}
                            >
                                {pet.type}
                            </div>
                        ))}
                    </div>
                    
                    {/* Joystick para móvil */}
                    {isMobile && (
                        <div className="mt-4">
                            <div 
                                ref={joystickAreaRef}
                                className="joystick-area"
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                                    borderRadius: '50%',
                                    position: 'relative',
                                    touchAction: 'none'
                                }}
                            >
                                <div 
                                    ref={joystickRef}
                                    className="joystick"
                                    style={{
                                        position: 'absolute',
                                        width: '60px',
                                        height: '60px',
                                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                                        borderRadius: '50%',
                                        left: `${joystickPosition.x - 30}px`,
                                        top: `${joystickPosition.y - 30}px`,
                                        touchAction: 'none'
                                    }}
                                ></div>
                            </div>
                            <p className="text-center mt-2 text-gray-600 text-sm">Mueve el círculo para controlar al personaje</p>
                        </div>
                    )}
                    
                    {/* Instrucciones para desktop */}
                    {!isMobile && (
                        <div className="mt-4">
                            <p className="text-center text-gray-600 text-sm sm:text-base">
                                Usa las flechas del teclado para moverte
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}