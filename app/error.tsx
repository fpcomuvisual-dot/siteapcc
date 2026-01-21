'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle } from 'lucide-react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log do erro para serviço de monitoramento (ex: Sentry)
        console.error('Error boundary caught:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
            <Card className="max-w-md w-full bg-gray-900 border-red-500/50">
                <CardHeader className="text-center">
                    <div className="mx-auto w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-8 w-8 text-red-500" />
                    </div>
                    <CardTitle className="text-white text-2xl">Algo deu errado</CardTitle>
                    <CardDescription className="text-gray-400">
                        Desculpe, ocorreu um erro inesperado. Nossa equipe foi notificada.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {process.env.NODE_ENV === 'development' && (
                        <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-xs text-red-400 font-mono break-all">
                                {error.message}
                            </p>
                        </div>
                    )}
                    <div className="flex gap-3">
                        <Button
                            onClick={reset}
                            className="flex-1 bg-gradient-to-r from-rosa-600 to-azul-600 hover:from-rosa-700 hover:to-azul-700"
                        >
                            Tentar Novamente
                        </Button>
                        <Button
                            onClick={() => window.location.href = '/'}
                            variant="outline"
                            className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                            Voltar ao Início
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
