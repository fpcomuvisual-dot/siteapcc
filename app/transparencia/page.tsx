import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Heart, Download, FileText, Shield } from "lucide-react";

// Mock data for transparency documents
const documents = [
    {
        id: 1,
        date: "2024-11-15",
        type: "Balanço Financeiro",
        description: "Balanço Patrimonial - 3º Trimestre 2024",
        file: "balanco-q3-2024.pdf",
    },
    {
        id: 2,
        date: "2024-10-01",
        type: "Estatuto",
        description: "Estatuto Social da APCC (Atualizado)",
        file: "estatuto-apcc-2024.pdf",
    },
    {
        id: 3,
        date: "2024-09-20",
        type: "Relatório de Atividades",
        description: "Relatório de Atividades - Setembro 2024",
        file: "relatorio-set-2024.pdf",
    },
    {
        id: 4,
        date: "2024-08-15",
        type: "Balanço Financeiro",
        description: "Balanço Patrimonial - 2º Trimestre 2024",
        file: "balanco-q2-2024.pdf",
    },
    {
        id: 5,
        date: "2024-07-10",
        type: "Ata de Reunião",
        description: "Ata da Assembleia Geral Ordinária",
        file: "ata-ago-2024.pdf",
    },
    {
        id: 6,
        date: "2024-06-01",
        type: "Relatório de Auditoria",
        description: "Auditoria Externa - 1º Semestre 2024",
        file: "auditoria-s1-2024.pdf",
    },
];

export default function TransparenciaPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-azul-50 via-white to-rosa-50">
            {/* Navigation */}
            <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2">
                            <Heart className="h-8 w-8 text-rosa-600" />
                            <span className="text-2xl font-bold bg-gradient-to-r from-rosa-600 to-azul-600 bg-clip-text text-transparent">
                                APCC
                            </span>
                        </Link>
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="text-gray-700 hover:text-rosa-600 transition-colors font-medium">
                                Início
                            </Link>
                            <Link href="/transparencia" className="text-azul-600 font-bold">
                                Transparência
                            </Link>
                            <Link href="/doar">
                                <Button className="bg-gradient-to-r from-rosa-600 to-rosa-500 hover:from-rosa-700 hover:to-rosa-600">
                                    Doar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-azul-100 rounded-full mb-4">
                        <Shield className="h-10 w-10 text-azul-600" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold">
                        <span className="bg-gradient-to-r from-azul-600 to-azul-500 bg-clip-text text-transparent">
                            Transparência Total 🔍
                        </span>
                    </h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Em conformidade com a <strong>Lei 13.019/2014</strong>, disponibilizamos todos os nossos
                        documentos financeiros, estatutos e relatórios de atividades para consulta pública.
                    </p>
                </div>
            </section>

            {/* Documents Section */}
            <section className="container mx-auto px-4 py-12 mb-16">
                <Card className="shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <FileText className="h-8 w-8 text-azul-600" />
                            Documentos Públicos
                        </CardTitle>
                        <CardDescription className="text-base">
                            Todos os documentos estão disponíveis para download e consulta
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto -mx-6 sm:mx-0">
                            <div className="inline-block min-w-full align-middle">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="font-bold">Data</TableHead>
                                            <TableHead className="font-bold">Tipo</TableHead>
                                            <TableHead className="font-bold">Descrição</TableHead>
                                            <TableHead className="font-bold text-right">Ação</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {documents.map((doc) => (
                                            <TableRow key={doc.id} className="hover:bg-azul-50/50 transition-colors">
                                                <TableCell className="font-medium whitespace-nowrap">
                                                    {new Date(doc.date).toLocaleDateString("pt-BR")}
                                                </TableCell>
                                                <TableCell>
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-azul-100 text-azul-800 whitespace-nowrap">
                                                        {doc.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-gray-700">{doc.description}</TableCell>
                                                <TableCell className="text-right whitespace-nowrap">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-azul-600 text-azul-600 hover:bg-azul-600 hover:text-white transition-colors"
                                                    >
                                                        <Download className="mr-2 h-4 w-4" />
                                                        Download
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </section>

            {/* Call to Action */}
            <section className="container mx-auto px-4 py-16 mb-16">
                <Card className="bg-gradient-to-r from-azul-600 to-rosa-600 border-0 text-white">
                    <CardContent className="p-12 text-center">
                        <h2 className="text-4xl font-bold mb-4">
                            Confiança é a base do nosso trabalho 🤝
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Sua doação é gerida com total responsabilidade e transparência.
                        </p>
                        <Link href="/doar">
                            <Button size="lg" className="bg-white text-azul-600 hover:bg-gray-100 text-lg px-8 py-6">
                                <Heart className="mr-2 h-6 w-6" />
                                Doe com Confiança
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 text-gray-800 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Heart className="h-6 w-6 text-rosa-400" />
                                <span className="text-xl font-bold bg-gradient-to-r from-rosa-500 to-azul-500 bg-clip-text text-transparent">APCC</span>
                            </div>
                            <p className="text-gray-600">
                                Associação Paraguaçuense de Combate ao Câncer
                            </p>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4 text-rosa-600">Links Rápidos</h3>
                            <ul className="space-y-2 text-gray-600">
                                <li><Link href="/" className="hover:text-rosa-600 transition-colors">Início</Link></li>
                                <li><Link href="/transparencia" className="hover:text-azul-600 transition-colors">Transparência</Link></li>
                                <li><Link href="/doar" className="hover:text-rosa-600 transition-colors">Doar</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold mb-4 text-azul-600">Contato</h3>
                            <p className="text-gray-600">
                                Email: contato@apcc.org.br<br />
                                Telefone: (13) 3471-XXXX
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
                        <p>© 2024 APCC - Todos os direitos reservados | Lei 13.019/2014</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
