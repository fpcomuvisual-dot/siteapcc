"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heart, Copy, Check, Building2, Smartphone, MapPin, Mail, Phone } from "lucide-react";

// Chave PIX de telefone. Validar com uma transferência de R$ 0,01 antes de divulgar amplamente,
// pois alguns bancos exigem o prefixo +55 dependendo da configuração da chave.
const PIX_KEY = "18996958159";
const PIX_DISPLAY = "(18) 99695-8159";

export default function DoarPage() {
    const [copied, setCopied] = useState(false);

    const handleCopyPix = () => {
        navigator.clipboard.writeText(PIX_KEY);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-rosa-50 via-white to-azul-50">
            {/* Hero */}
            <section className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-rosa-100 rounded-full mb-4">
                        <Heart className="h-10 w-10 text-rosa-600" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold">
                        <span className="bg-gradient-to-r from-rosa-600 to-rosa-500 bg-clip-text text-transparent">
                            Faça a Diferença ❤️
                        </span>
                    </h1>
                    <p className="text-xl text-gray-700 leading-relaxed">
                        Sua doação ajuda a salvar vidas e oferecer esperança para quem enfrenta o câncer.
                        <strong> Juntos somos mais fortes!</strong> 💪
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-4 py-12 mb-16">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* PIX */}
                    <Card className="shadow-xl border-rosa-200">
                        <CardHeader className="bg-gradient-to-r from-rosa-50 to-rosa-100">
                            <CardTitle className="text-3xl flex items-center gap-2">
                                <Smartphone className="h-8 w-8 text-rosa-600" />
                                Doar via PIX (Recomendado) 🚀
                            </CardTitle>
                            <CardDescription className="text-base">
                                Forma mais rápida e segura de contribuir
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-6">
                                <div>
                                    <Label htmlFor="pix-key" className="text-lg font-semibold mb-2 block">
                                        Chave PIX (Telefone) — Favorecido: APCC
                                    </Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="pix-key"
                                            value={PIX_DISPLAY}
                                            readOnly
                                            className="text-lg font-mono"
                                        />
                                        <Button
                                            onClick={handleCopyPix}
                                            className="bg-rosa-600 hover:bg-rosa-700 shrink-0"
                                        >
                                            {copied ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                                        </Button>
                                    </div>
                                    {copied && (
                                        <p className="text-sm text-green-600 mt-2 font-medium">✓ Chave PIX copiada!</p>
                                    )}
                                    <p className="text-xs text-gray-500 mt-2">
                                        Banco: <strong>SICREDI</strong>
                                    </p>
                                </div>

                                <div className="bg-azul-50 p-4 rounded-lg border border-azul-200">
                                    <h4 className="font-semibold text-azul-900 mb-2">Como doar:</h4>
                                    <ol className="list-decimal list-inside space-y-1 text-sm text-azul-800">
                                        <li>Abra o app do seu banco</li>
                                        <li>Escolha a opção PIX</li>
                                        <li>Cole a chave copiada acima</li>
                                        <li>Insira o valor da doação</li>
                                        <li>Confirme a transação ✅</li>
                                    </ol>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Transferência bancária */}
                    <Card className="shadow-xl border-azul-200">
                        <CardHeader className="bg-gradient-to-r from-azul-50 to-azul-100">
                            <CardTitle className="text-3xl flex items-center gap-2">
                                <Building2 className="h-8 w-8 text-azul-600" />
                                Transferência Bancária 🏦
                            </CardTitle>
                            <CardDescription className="text-base">
                                Para doações via TED
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="space-y-3">
                                <div>
                                    <Label className="text-sm text-gray-600">Banco:</Label>
                                    <p className="font-semibold text-lg">SICREDI</p>
                                </div>
                                <div>
                                    <Label className="text-sm text-gray-600">Favorecido:</Label>
                                    <p className="font-semibold text-lg">Associação Paraguaçuense de Combate ao Câncer (APCC)</p>
                                </div>
                                {/* TODO: usuário preencher CNPJ/agência/conta reais */}
                                <p className="text-sm text-gray-500 italic">
                                    Para demais dados bancários (agência e conta), entre em contato via WhatsApp:{" "}
                                    <a href="https://wa.me/5518996958159" className="text-azul-600 underline font-medium">
                                        (18) 99695-8159
                                    </a>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Impacto */}
                    <Card className="bg-gradient-to-r from-rosa-600 to-azul-600 border-0 text-white">
                        <CardContent className="p-8 text-center">
                            <h3 className="text-2xl font-bold mb-3">Cada doação conta! 🌟</h3>
                            <p className="text-lg opacity-90">
                                Com R$ 50 você ajuda a custear uma sessão de quimioterapia.<br />
                                Com R$ 100 você contribui para exames essenciais.<br />
                                Com R$ 200 você apoia o tratamento completo de um paciente.
                            </p>
                        </CardContent>
                    </Card>

                    <div className="text-center">
                        <p className="text-gray-600 mb-4">Quer saber como usamos as doações?</p>
                        <Link href="/transparencia">
                            <Button variant="outline" size="lg" className="border-azul-600 text-azul-600 hover:bg-azul-50">
                                Ver Relatórios de Transparência
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-50 border-t border-gray-200 py-12">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="flex items-center space-x-2 mb-4">
                                <Heart className="h-6 w-6 text-rosa-400" />
                                <span className="text-xl font-bold bg-gradient-to-r from-rosa-500 to-azul-500 bg-clip-text text-transparent">APCC</span>
                            </div>
                            <p className="text-gray-600">Associação Paraguaçuense de Combate ao Câncer</p>
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
                            <ul className="space-y-2 text-gray-600 text-sm">
                                <li className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-primary shrink-0" />
                                    <a href="mailto:apcc95@gmail.com" className="hover:text-primary">apcc95@gmail.com</a>
                                </li>
                                <li className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary shrink-0" />
                                    <a href="https://wa.me/5518996958159" className="hover:text-primary">(18) 99695-8159</a>
                                </li>
                                <li className="flex items-start gap-2">
                                    <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <span>Rua Assad Salum, 458 — Paraguaçu Paulista (SP), CEP 19700-388</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500 text-sm">
                        <p>© {new Date().getFullYear()} APCC — Todos os direitos reservados | Lei 13.019/2014</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
