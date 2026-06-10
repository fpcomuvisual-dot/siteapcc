"use client";

import { useEffect, useState } from "react";
import { getProdutosAtivos } from "../admin/actions";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight, Sparkles, MessageCircle, HelpCircle, ShieldCheck, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function LojinhaPage() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});

    useEffect(() => {
        let mounted = true;
        getProdutosAtivos().then((data) => {
            if (mounted) {
                setProdutos(data || []);
                setLoading(false);
            }
        }).catch((err) => {
            console.error("Erro ao carregar produtos:", err);
            if (mounted) setLoading(false);
        });
        return () => { mounted = false; };
    }, []);

    const handleSelectSize = (productId: string, size: string) => {
        setSelectedSizes({
            ...selectedSizes,
            [productId]: size,
        });
    };

    const handleBuy = (product: any) => {
        const size = selectedSizes[product.id];
        if (!size) {
            alert("Por favor, selecione um tamanho antes de comprar.");
            return;
        }

        // TODO: Fase 2 - Integrar gateway do Mercado Pago (checkout automático + baixa via webhook)
        // Por enquanto, fluxo PIX manual com contato no WhatsApp.
        const phoneNumber = "5518996958159";
        const message = encodeURIComponent(
            `Olá! Vi o site da APCC e quero comprar a "${product.nome}" no tamanho "${size}". Como faço para realizar o pagamento via PIX?`
        );
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-20 selection:bg-pink-500/20 selection:text-pink-600">
            {/* Header / Intro */}
            <div className="relative overflow-hidden bg-gradient-to-tr from-pink-500 via-pink-600 to-purple-700 py-20 text-white shadow-md">
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,transparent)]" />
                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md mb-4 border border-white/10 uppercase tracking-wider">
                            <Sparkles className="w-3.5 h-3.5 text-pink-200" /> Bazar Beneficente Oficial
                        </span>
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                            Lojinha da APCC
                        </h1>
                        <p className="text-pink-100 text-base md:text-lg max-w-2xl mx-auto font-medium leading-relaxed">
                            Adquira nossas camisetas oficiais e ajude a apoiar pacientes em tratamento contra o câncer. 
                            Todo o valor arrecadado é integralmente revertido aos nossos projetos sociais.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Informações da compra */}
            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="bg-white border border-slate-100 shadow-xl rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 border border-pink-100">
                            <MessageCircle className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">1. Escolha e Peça</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Escolha o produto e o tamanho desejado. O botão lhe redirecionará ao nosso WhatsApp.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 border border-pink-100">
                            <ShieldCheck className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">2. Pagamento via PIX</h4>
                            <p className="text-xs text-slate-500 mt-0.5">O acerto e envio dos dados para pagamento PIX ocorrem de forma direta e manual.</p>
                        </div>
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center shrink-0 border border-pink-100">
                            <HelpCircle className="w-5 h-5 text-pink-600" />
                        </div>
                        <div>
                            <h4 className="font-bold text-slate-800 text-sm">3. Retirada / Envio</h4>
                            <p className="text-xs text-slate-500 mt-0.5">Após a confirmação do pagamento, acertamos a entrega e nosso gestor fará a baixa manual do estoque.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 mt-16 max-w-6xl">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                        <Sparkles className="w-8 h-8 animate-spin text-pink-600" />
                        <p className="text-sm font-semibold">Carregando camisetas exclusivas...</p>
                    </div>
                ) : produtos.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-slate-200 bg-white rounded-2xl max-w-xl mx-auto shadow-sm">
                        <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="font-bold text-slate-800 text-lg">Nenhum produto ativo no momento</h3>
                        <p className="text-sm text-slate-500 mt-1">Nossos voluntários estão preparando um novo lote de camisetas. Volte em breve!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {produtos.map((product) => {
                            const isSelected = !!selectedSizes[product.id];
                            return (
                                <motion.div
                                    key={product.id}
                                    whileHover={{ y: -6 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <Card className="bg-white border-slate-200/60 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col h-full rounded-2xl group">
                                        <CardHeader className="p-0">
                                            <div className="aspect-[4/3] w-full relative bg-slate-100 overflow-hidden">
                                                {product.fotoUrl ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={product.fotoUrl}
                                                        alt={product.nome}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                        <ImageIcon className="w-16 h-16" />
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3 bg-slate-900/90 text-white font-extrabold text-sm px-3 py-1 rounded-full shadow border border-white/15">
                                                    R$ {product.preco.toFixed(2)}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-6 flex-1 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <CardTitle className="text-xl font-extrabold text-slate-800 leading-tight">
                                                        {product.nome}
                                                    </CardTitle>
                                                    <span className="text-[11px] bg-pink-50 text-pink-600 border border-pink-100 rounded-full px-2.5 py-0.5 font-bold uppercase tracking-wider">
                                                        {product.cor}
                                                    </span>
                                                </div>
                                                <p className="text-slate-500 text-sm leading-relaxed mb-6 font-medium">
                                                    {product.description || product.descricao}
                                                </p>

                                                {/* Seletor de Tamanhos */}
                                                <div className="mb-6">
                                                    <p className="text-xs uppercase font-extrabold text-slate-400 tracking-wider mb-2.5">
                                                        Escolha o Tamanho:
                                                    </p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {product.tamanhos?.map((t: any) => {
                                                            const isEsgotado = t.quantidade <= 0;
                                                            const isCurrent = selectedSizes[product.id] === t.tamanho;
                                                            return (
                                                                <button
                                                                    key={t.tamanho}
                                                                    disabled={isEsgotado}
                                                                    onClick={() => handleSelectSize(product.id, t.tamanho)}
                                                                    className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all text-center flex flex-col items-center justify-center min-w-[70px] ${
                                                                        isEsgotado
                                                                            ? "bg-slate-50 border-slate-200/50 text-slate-300 cursor-not-allowed line-through"
                                                                            : isCurrent
                                                                            ? "bg-pink-600 border-pink-600 text-white shadow-md shadow-pink-600/10 scale-105"
                                                                            : "bg-white border-slate-200 hover:border-pink-300 text-slate-700 active:scale-95"
                                                                    }`}
                                                                >
                                                                    <span className="uppercase text-sm">{t.tamanho}</span>
                                                                    <span className="text-[9px] mt-0.5 opacity-80">
                                                                        {isEsgotado ? "Esgotado" : `${t.quantidade} rest.`}
                                                                    </span>
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <CardFooter className="p-0 border-t border-slate-100 pt-4">
                                                <Button
                                                    onClick={() => handleBuy(product)}
                                                    className={`w-full font-bold py-5 rounded-xl gap-2 transition-all ${
                                                        isSelected
                                                            ? "bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white shadow-lg shadow-pink-600/20 active:scale-98"
                                                            : "bg-slate-100 hover:bg-slate-200 text-slate-500 border border-slate-200"
                                                    }`}
                                                >
                                                    <ShoppingBag className="w-4.5 h-4.5" />
                                                    {isSelected ? "Encomendar via WhatsApp" : "Selecione o Tamanho"}
                                                </Button>
                                            </CardFooter>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 mt-20 text-center max-w-4xl">
                <div className="bg-white border border-slate-200/60 shadow-lg rounded-3xl p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute right-0 bottom-0 w-48 h-48 bg-gradient-to-tr from-pink-100 to-purple-100 rounded-full blur-3xl -z-10 opacity-70" />
                    <h2 className="text-2xl font-bold text-slate-800 mb-3">
                        Quer ver outros tamanhos ou modelos?
                    </h2>
                    <p className="text-slate-500 mb-6 max-w-lg mx-auto text-sm md:text-base font-medium">
                        Você também pode fazer uma visita à nossa sede física e conhecer nosso bazar beneficente com dezenas de itens.
                    </p>
                    <Button variant="outline" className="border-pink-600 text-pink-600 hover:bg-pink-50 rounded-xl" asChild>
                        <a href="https://wa.me/5518996958159" target="_blank" rel="noopener noreferrer">
                            Falar com a Instituição <ArrowRight className="w-4 h-4 ml-2" />
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    );
}
