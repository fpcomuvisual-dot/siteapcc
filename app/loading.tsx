export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="text-center space-y-4">
                {/* Spinner animado */}
                <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-rosa-500 rounded-full animate-spin"></div>
                </div>

                {/* Texto */}
                <div className="space-y-2">
                    <h2 className="text-xl font-bold bg-gradient-to-r from-rosa-400 to-azul-400 bg-clip-text text-transparent">
                        Carregando...
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Aguarde um momento
                    </p>
                </div>
            </div>
        </div>
    )
}
