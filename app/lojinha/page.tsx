"use client";

import { useEffect, useState } from "react";
import { getProdutosAtivos, getPreVendaSettings } from "../admin/actions";
import PreVenda from "@/components/features/PreVenda";
import { Syne, Outfit } from "next/font/google";
import { 
    Shirt, ShoppingBag, ArrowLeft, Copy, Check, 
    Smartphone, User, Info, CheckCircle2, QrCode, Sparkles 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";

const syne = Syne({
    subsets: ["latin"],
    weight: ["700", "800"],
    variable: "--font-syne",
});

const outfit = Outfit({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
    variable: "--font-outfit",
});

// Algoritmo CRC16-CCITT (Polinômio 0x1021, Inicial 0xFFFF) exigido pelo padrão EMVCo do PIX
function calcularCRC16(str: string): string {
    let crc = 0xFFFF;
    const polynomial = 0x1021;
    
    for (let i = 0; i < str.length; i++) {
        let b = str.charCodeAt(i);
        for (let j = 0; j < 8; j++) {
            let bit = ((b >> (7 - j)) & 1) === 1;
            let c15 = ((crc >> 15) & 1) === 1;
            crc <<= 1;
            if (c15 !== bit) {
                crc ^= polynomial;
            }
        }
    }
    
    crc &= 0xFFFF;
    let hex = crc.toString(16).toUpperCase();
    return hex.padStart(4, "0");
}

// Gerador de string do Pix Estático BR Code (EMVCo)
function gerarCodigoPix(valor: number, txid: string): string {
    const f = (tag: string, value: string): string => {
        const len = value.length.toString().padStart(2, "0");
        return `${tag}${len}${value}`;
    };

    const tag00 = f("00", "01"); // Payload Format Indicator
    
    // Tag 26 - Merchant Account Info (PIX)
    const subTag00 = f("00", "br.gov.bcb.pix");
    const subTag01 = f("01", "+5518996958159"); // Chave PIX celular APCC
    const tag26 = f("26", subTag00 + subTag01);

    const tag52 = f("52", "0000"); // Merchant Category Code
    const tag53 = f("53", "986");  // Currency (Real)
    const tag54 = f("54", valor.toFixed(2)); // Amount
    const tag58 = f("58", "BR");    // Country
    const tag59 = f("59", "APCC PARAGUACU"); // Nome
    const tag60 = f("60", "PARAGUACU PTA");   // Cidade

    // Tag 62 - Additional Data Field Template (TXID)
    const subTag05 = f("05", txid);
    const tag62 = f("62", subTag05);

    const prePix = `${tag00}${tag26}${tag52}${tag53}${tag54}${tag58}${tag59}${tag60}${tag62}6304`;
    const crc = calcularCRC16(prePix);

    return `${prePix}${crc}`;
}

export default function LojinhaPage() {
    const [produtos, setProdutos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [preVendaSettings, setPreVendaSettings] = useState<any>(null);
    
    // Modelo selecionado (Rosa ou Azul)
    const [selectedColor, setSelectedColor] = useState<"Rosa" | "Azul">("Rosa");
    
    // Tamanho selecionado no modelo atual
    const [selectedSize, setSelectedSize] = useState<string>("");
    
    // Dados do formulário
    const [nomeComprador, setNomeComprador] = useState("");
    const [telefoneComprador, setTelefoneComprador] = useState("");
    
    // Estados do pedido gerado
    const [pedidoGerado, setPedidoGerado] = useState<any>(null);
    const [pixCopiaCola, setPixCopiaCola] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [copiado, setCopiado] = useState(false);

    useEffect(() => {
        let mounted = true;
        Promise.all([
            getProdutosAtivos(),
            getPreVendaSettings()
        ]).then(([produtosData, preVendaData]) => {
            if (mounted) {
                setProdutos(produtosData || []);
                setPreVendaSettings(preVendaData || null);
                setLoading(false);
                
                // Seleciona por padrão o modelo da cor que estiver disponível
                const temRosa = produtosData?.some((p: any) => p.cor?.toLowerCase() === "rosa");
                const temAzul = produtosData?.some((p: any) => p.cor?.toLowerCase() === "azul");
                if (!temRosa && temAzul) {
                    setSelectedColor("Azul");
                }
            }
        }).catch((err) => {
            console.error("Erro ao carregar produtos:", err);
            if (mounted) setLoading(false);
        });
        return () => { mounted = false; };
    }, []);

    // Identifica o produto correspondente à cor selecionada
    const currentProduct = produtos.find(
        (p) => p.cor?.toLowerCase() === selectedColor.toLowerCase()
    );

    // Limpa o tamanho selecionado ao mudar de cor/modelo
    const handleColorChange = (color: "Rosa" | "Azul") => {
        setSelectedColor(color);
        setSelectedSize("");
    };

    // Submete o formulário e gera os dados do PIX
    const handleGerarPedido = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProduct) return;
        if (!selectedSize) {
            alert("Por favor, selecione um tamanho.");
            return;
        }
        if (!nomeComprador.trim() || !telefoneComprador.trim()) {
            alert("Por favor, preencha seu nome e telefone de contato.");
            return;
        }

        // Validação adicional de estoque no cliente antes de prosseguir
        const gradeTam = currentProduct.tamanhos?.find((t: any) => t.tamanho === selectedSize);
        if (!gradeTam || gradeTam.quantidade <= 0) {
            alert("Este tamanho esgotou recentemente. Por favor, escolha outro.");
            return;
        }

        const txid = "PCC" + Math.floor(10000 + Math.random() * 90000); // Ex: PCC54321 (8 chars)
        const valor = currentProduct.preco || 40.00;
        const stringPix = gerarCodigoPix(valor, txid);

        try {
            const qrUrl = await QRCode.toDataURL(stringPix, { width: 300, margin: 1 });
            setPixCopiaCola(stringPix);
            setQrCodeUrl(qrUrl);
            setPedidoGerado({
                txid,
                produtoNome: currentProduct.nome,
                cor: selectedColor,
                tamanho: selectedSize,
                preco: valor,
                comprador: nomeComprador,
                telefone: telefoneComprador
            });
        } catch (err) {
            console.error("Erro ao gerar QR Code:", err);
            alert("Ocorreu um erro ao gerar os dados de pagamento PIX.");
        }
    };

    const handleCopyPix = () => {
        if (!pixCopiaCola) return;
        navigator.clipboard.writeText(pixCopiaCola);
        setCopiado(true);
        setTimeout(() => setCopiado(false), 2000);
    };

    const handleWhatsAppRedirect = () => {
        if (!pedidoGerado) return;
        const phoneNumber = "5518996958159";
        const msg = `Olá! Acabei de gerar um pedido de camiseta pelo site da APCC:\n\n` +
                    `📦 *Pedido:* ${pedidoGerado.produtoNome}\n` +
                    `👕 *Tamanho:* ${pedidoGerado.tamanho} (${pedidoGerado.cor})\n` +
                    `👤 *Comprador:* ${pedidoGerado.comprador}\n` +
                    `📱 *Contato:* ${pedidoGerado.telefone}\n` +
                    `💰 *Valor:* R$ ${pedidoGerado.preco.toFixed(2)}\n` +
                    `🔢 *Código do Pedido:* ${pedidoGerado.txid}\n\n` +
                    `Estou enviando o comprovante do PIX em anexo para validação e reserva das peças no estoque físico!`;
        
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
    };

    const handleVoltar = () => {
        setPedidoGerado(null);
        setPixCopiaCola("");
        setQrCodeUrl("");
        setSelectedSize("");
        setNomeComprador("");
        setTelefoneComprador("");
    };

    // Cores de realce para botões e links baseadas no modelo ativo
    const activeColorHex = selectedColor === "Rosa" ? "#FF1A6C" : "#1A7BFF";
    const activeBgClass = selectedColor === "Rosa" 
        ? "bg-pink-600 hover:bg-pink-700 text-white shadow-pink-200" 
        : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200";
    const activeBorderClass = selectedColor === "Rosa" ? "border-pink-600" : "border-blue-600";
    const activeTextClass = selectedColor === "Rosa" ? "text-pink-600" : "text-blue-600";
    const activeRingClass = selectedColor === "Rosa" ? "focus:ring-pink-500/20" : "focus:ring-blue-500/20";

    if (loading) {
        return (
            <div className={`min-h-screen bg-slate-100/50 flex flex-col items-center justify-start ${outfit.variable} ${syne.variable} font-sans py-0 md:py-10`}>
                <div className="w-full max-w-[480px] bg-white min-h-screen md:min-h-[850px] shadow-2xl md:rounded-3xl border border-slate-100 flex flex-col pb-16 overflow-hidden relative">
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-slate-400 gap-4 px-6">
                        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-pink-500 animate-spin" />
                        <p className="text-sm font-semibold text-slate-500">Carregando bazar da lojinha...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (preVendaSettings?.ativo) {
        return <PreVenda settings={preVendaSettings} produtos={produtos} />;
    }

    return (
        <div className={`min-h-screen bg-slate-100/50 flex flex-col items-center justify-start ${outfit.variable} ${syne.variable} font-sans py-0 md:py-10`}>
            
            {/* Contêiner Mobile-First centralizado */}
            <div className="w-full max-w-[480px] bg-white min-h-screen md:min-h-[850px] shadow-2xl md:rounded-3xl border border-slate-100 flex flex-col pb-16 overflow-hidden relative">
                
                {!currentProduct && produtos.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                        <ShoppingBag className="w-16 h-16 text-slate-300 mb-4" />
                        <h3 className="font-extrabold text-slate-800 text-lg">Sem produtos ativos</h3>
                        <p className="text-sm text-slate-500 mt-2">Nossos voluntários estão preparando um novo lote de camisetas. Por favor, volte mais tarde!</p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {!pedidoGerado ? (
                            /* --- TELA 1: VITRINE E DETALHES --- */
                            <motion.div
                                key="vitrine"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col flex-1"
                            >
                                {/* HERO Card */}
                                <div className="p-6 pb-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100 relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-pink-50 text-pink-600 uppercase tracking-widest border border-pink-100">
                                            <Sparkles className="w-2.5 h-2.5" /> Bazar Oficial APCC
                                        </span>
                                        <div className="bg-slate-100 rounded-full px-3.5 py-1 text-xs font-extrabold text-slate-800 flex items-center shadow-sm">
                                            R$ {(currentProduct?.preco || 40.00).toFixed(2)}
                                        </div>
                                    </div>
                                    <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-tight font-display mb-2">
                                        Camiseta Oficial APCC
                                    </h1>
                                    <p className="text-xs text-slate-500 font-medium leading-relaxed">
                                        Adquira nossas camisetas e ajude a apoiar pacientes em tratamento contra o câncer. Todo o valor arrecadado é revertido à instituição.
                                    </p>
                                </div>

                                {/* Imagem de Destaque */}
                                <div className="px-6 py-3">
                                    <div className="aspect-[4/3] w-full rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden relative shadow-sm">
                                        {currentProduct?.fotoUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={currentProduct.fotoUrl}
                                                alt={currentProduct.nome}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                                <Shirt className="w-16 h-16 stroke-[1.2]" />
                                                <span className="text-[10px] uppercase font-bold text-slate-400 mt-2">Sem imagem disponível</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <form onSubmit={handleGerarPedido} className="px-6 flex-1 flex flex-col gap-6 mt-2">
                                    
                                    {/* SEÇÃO 1: Escolha do Modelo */}
                                    <div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 after:content-[''] after:flex-1 after:h-px after:bg-slate-100">
                                            Escolha o Modelo
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            {/* Modelo Rosa */}
                                            <button
                                                type="button"
                                                onClick={() => handleColorChange("Rosa")}
                                                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border font-bold text-xs transition-all ${
                                                    selectedColor === "Rosa"
                                                        ? "border-pink-500 bg-pink-50/40 text-pink-600 shadow-sm"
                                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 active:scale-98"
                                                }`}
                                            >
                                                <Shirt className={`w-4 h-4 ${selectedColor === "Rosa" ? "text-pink-600" : "text-slate-400"}`} />
                                                Camiseta Rosa
                                            </button>
                                            
                                            {/* Modelo Azul */}
                                            <button
                                                type="button"
                                                onClick={() => handleColorChange("Azul")}
                                                className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl border font-bold text-xs transition-all ${
                                                    selectedColor === "Azul"
                                                        ? "border-blue-500 bg-blue-50/40 text-blue-600 shadow-sm"
                                                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 active:scale-98"
                                                }`}
                                            >
                                                <Shirt className={`w-4 h-4 ${selectedColor === "Azul" ? "text-blue-600" : "text-slate-400"}`} />
                                                Camiseta Azul
                                            </button>
                                        </div>
                                    </div>

                                    {/* SEÇÃO 2: Grade de Tamanhos */}
                                    <div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 after:content-[''] after:flex-1 after:h-px after:bg-slate-100">
                                            Selecione o Tamanho
                                        </div>
                                        {currentProduct ? (
                                            <div className="grid grid-cols-3 gap-2">
                                                {currentProduct.tamanhos?.map((t: any) => {
                                                    const isEsgotado = t.quantidade <= 0;
                                                    const isSelected = selectedSize === t.tamanho;
                                                    return (
                                                        <button
                                                            key={t.tamanho}
                                                            type="button"
                                                            disabled={isEsgotado}
                                                            onClick={() => setSelectedSize(t.tamanho)}
                                                            style={{
                                                                borderColor: isSelected ? activeColorHex : "",
                                                                backgroundColor: isSelected ? activeColorHex : "",
                                                            }}
                                                            className={`py-2 px-2.5 rounded-xl border text-center font-bold transition-all text-xs flex flex-col items-center justify-center min-h-[48px] ${
                                                                isEsgotado
                                                                    ? "bg-slate-50 border-slate-200/50 text-slate-300 cursor-not-allowed line-through"
                                                                    : isSelected
                                                                    ? "text-white shadow-md shadow-slate-200/50 scale-[1.03]"
                                                                    : "bg-white border-slate-200 hover:border-slate-300 text-slate-700 active:scale-95"
                                                            }`}
                                                        >
                                                            <span className="text-sm font-extrabold">{t.tamanho}</span>
                                                            <span className="text-[8px] opacity-75 mt-0.5">
                                                                {isEsgotado ? "Esgotado" : `${t.quantidade} rest.`}
                                                            </span>
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-400 text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl">
                                                Modelo indisponível no estoque central.
                                            </p>
                                        )}
                                    </div>

                                    {/* SEÇÃO 3: Informações do Cliente */}
                                    <div>
                                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3 after:content-[''] after:flex-1 after:h-px after:bg-slate-100">
                                            Dados para Contato
                                        </div>
                                        <div className="space-y-3">
                                            <div className="relative">
                                                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                                                <input
                                                    type="text"
                                                    required
                                                    placeholder="Seu Nome Completo"
                                                    value={nomeComprador}
                                                    onChange={e => setNomeComprador(e.target.value)}
                                                    className={`w-full pl-9 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-4 ${activeRingClass} focus:border-slate-300 transition-all font-medium text-slate-800`}
                                                />
                                            </div>
                                            <div className="relative">
                                                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                                                <input
                                                    type="tel"
                                                    required
                                                    placeholder="WhatsApp (ex: 18999999999)"
                                                    value={telefoneComprador}
                                                    onChange={e => setTelefoneComprador(e.target.value)}
                                                    className={`w-full pl-9 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-4 ${activeRingClass} focus:border-slate-300 transition-all font-medium text-slate-800`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botão de Encomenda */}
                                    <div className="pt-4 border-t border-slate-50 mt-2">
                                        <button
                                            type="submit"
                                            disabled={!selectedSize || !nomeComprador.trim() || !telefoneComprador.trim()}
                                            className={`w-full font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-slate-100/10 active:scale-98 transition-all ${
                                                selectedSize && nomeComprador.trim() && telefoneComprador.trim()
                                                    ? activeBgClass
                                                    : "bg-slate-100 text-slate-400 border border-slate-200/50 cursor-not-allowed shadow-none"
                                            }`}
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Gerar pedido / Pagar com PIX
                                        </button>
                                        
                                        {/* Detalhes de conformidade (Fase 1 manual) */}
                                        <div className="flex gap-2 items-start mt-3.5 px-1">
                                            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                                            <p className="text-[10px] text-slate-400 leading-normal font-medium">
                                                O pagamento é realizado via Pix manual. Após efetuar o pagamento, envie o comprovante para efetuarmos a baixa e a reserva no estoque físico.
                                            </p>
                                        </div>
                                    </div>

                                </form>
                            </motion.div>
                        ) : (
                            /* --- TELA 2: CONFIRMAÇÃO DO PEDIDO E PIX --- */
                            <motion.div
                                key="confirmacao"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.3 }}
                                className="flex flex-col p-6"
                            >
                                {/* Header da Confirmação */}
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100 mb-3">
                                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                                    </div>
                                    <h2 className="text-xl font-black text-slate-900 leading-tight font-display">
                                        Pedido Gerado!
                                    </h2>
                                    <p className="text-[11px] text-slate-500 font-bold mt-1 uppercase tracking-wider">
                                        Código: #{pedidoGerado.txid}
                                    </p>
                                </div>

                                {/* Resumo do Pedido */}
                                <div className="bg-slate-50/50 border border-slate-100 rounded-2xl p-4 space-y-2 mt-2">
                                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                                        <span className="text-slate-400">Produto</span>
                                        <span>{pedidoGerado.produtoNome} ({pedidoGerado.cor})</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                                        <span className="text-slate-400">Tamanho</span>
                                        <span>Tamanho {pedidoGerado.tamanho}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                                        <span className="text-slate-400">Comprador</span>
                                        <span>{pedidoGerado.comprador}</span>
                                    </div>
                                    <div className="flex justify-between text-xs font-semibold text-slate-700">
                                        <span className="text-slate-400">Contato</span>
                                        <span>{pedidoGerado.telefone}</span>
                                    </div>
                                    <div className="border-t border-slate-200/50 pt-2.5 mt-1.5 flex justify-between text-xs font-extrabold text-slate-800">
                                        <span>Valor Total</span>
                                        <span className={activeTextClass}>R$ {pedidoGerado.preco.toFixed(2)}</span>
                                    </div>
                                </div>

                                {/* QR Code Container */}
                                <div className="my-6 text-center">
                                    <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 after:content-[''] after:flex-1 after:h-px after:bg-slate-100 before:content-[''] before:flex-1 before:h-px before:bg-slate-100">
                                        Pague via QR Code PIX
                                    </div>
                                    <div className="w-52 h-52 bg-white rounded-2xl shadow-md border border-slate-100 mx-auto p-3 flex items-center justify-center">
                                        {qrCodeUrl ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={qrCodeUrl}
                                                alt="QR Code do PIX"
                                                className="w-full h-full object-contain"
                                            />
                                        ) : (
                                            <QrCode className="w-12 h-12 text-slate-200 animate-pulse" />
                                        )}
                                    </div>
                                </div>

                                {/* Pix Copia e Cola */}
                                <div className="space-y-2 mb-6">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Código Copia e Cola</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            readOnly
                                            value={pixCopiaCola}
                                            onClick={handleCopyPix}
                                            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3 text-[10px] font-mono text-slate-500 overflow-ellipsis truncate select-all focus:outline-none focus:ring-1 focus:ring-slate-300"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleCopyPix}
                                            className={`px-4 rounded-xl border flex items-center justify-center gap-1.5 text-xs font-bold transition-all ${
                                                copiado
                                                    ? "bg-green-50 border-green-200 text-green-600"
                                                    : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 active:scale-95"
                                            }`}
                                        >
                                            {copiado ? (
                                                <>
                                                    <Check className="w-4 h-4" />
                                                    Copiado
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-4 h-4" />
                                                    Copiar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Botão de Envio de Comprovante */}
                                <div className="space-y-4 pt-4 border-t border-slate-100">
                                    <button
                                        type="button"
                                        onClick={handleWhatsAppRedirect}
                                        className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 text-xs shadow-lg shadow-green-100/15 active:scale-98 transition-all"
                                    >
                                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                            <path d="M12.012 2c-5.506 0-9.988 4.479-9.988 9.984 0 1.761.461 3.475 1.336 4.992L2 22l5.148-1.348c1.461.796 3.109 1.214 4.852 1.214h.012c5.505 0 9.989-4.48 9.989-9.986 0-2.668-1.037-5.177-2.923-7.065C17.19 3.029 14.685 2 12.012 2zm6.936 14.135c-.302.846-1.505 1.547-2.073 1.662-.516.104-1.189.176-3.832-.916-3.38-1.396-5.556-4.839-5.726-5.064-.168-.225-1.353-1.802-1.353-3.439 0-1.636.857-2.441 1.161-2.775.302-.335.662-.418.883-.418h.635c.201 0 .468-.007.674.484.21.503.717 1.748.777 1.874.06.126.1.272.016.442-.084.17-.184.288-.309.432-.125.145-.26.3-.372.41-.122.12-.25.251-.108.496.142.245.632 1.04 1.357 1.684.933.829 1.716 1.085 1.957 1.205.241.121.383.101.524-.06.142-.162.607-.705.77-1.018.163-.312.327-.26.549-.176.224.084 1.42.671 1.666.793.246.121.411.182.471.288.061.104.061.605-.241 1.451z"/>
                                        </svg>
                                        Enviar comprovante pelo WhatsApp
                                    </button>

                                    <button
                                        type="button"
                                        onClick={handleVoltar}
                                        className="w-full bg-white border border-slate-200 text-slate-600 hover:border-slate-300 font-bold py-4 rounded-2xl flex items-center justify-center gap-1.5 text-xs active:scale-98 transition-all"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        Fazer Novo Pedido
                                    </button>
                                </div>

                                {/* Alertas e Rodapé explicativo */}
                                <div className="mt-8 bg-slate-50 border border-slate-100 rounded-2xl p-4">
                                    <h4 className="text-[10px] font-extrabold text-slate-700 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                        <Info className="w-3.5 h-3.5 text-slate-500" /> Nota sobre Confirmação
                                    </h4>
                                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                        Nesta primeira fase (PIX manual), a reserva do seu produto no estoque central e a confirmação do pedido dependem do envio do comprovante acima. Nossa equipe fará a validação física e fará a baixa manual no estoque do sistema de forma rápida.
                                    </p>
                                    <p className="text-[9px] text-slate-400 mt-2 font-medium italic">
                                        Nota técnica: A Fase 2 automatizará a baixa via webhook com gateway Mercado Pago.
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                )}

            </div>
        </div>
    );
}
