import { getTransparencyDocs } from '@/app/admin/actions'
import TransparenciaContent from '@/components/features/TransparenciaContent'
import { Shield } from 'lucide-react'

export const revalidate = 60

export const metadata = {
    title: 'Transparência | APCC',
    description: 'Documentos públicos e prestação de contas da APCC em conformidade com a Lei 13.019/2014.',
}

export default async function TransparenciaPage() {
    const docs = await getTransparencyDocs()

    return (
        <div className="min-h-screen bg-background">
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-azul-100 rounded-full mb-4">
                            <Shield className="h-8 w-8 text-azul-600" />
                        </div>
                        <h1 className="text-5xl font-black text-foreground mb-4">
                            <span className="text-azul-600">Transparência</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            Em conformidade com a <strong>Lei 13.019/2014</strong>, disponibilizamos
                            documentos financeiros, estatutos e relatórios de atividades para consulta pública.
                        </p>
                    </div>

                    <TransparenciaContent docs={docs as any[]} />

                    <p className="text-center text-sm text-muted-foreground mt-16 pt-8 border-t border-border">
                        © {new Date().getFullYear()} APCC — Associação Paraguaçuense de Combate ao Câncer
                        &nbsp;|&nbsp; Lei 13.019/2014
                    </p>
                </div>
            </section>
        </div>
    )
}
