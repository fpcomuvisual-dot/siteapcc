"use client";

import { useState } from "react";
import { Syne, Outfit } from "next/font/google";
import { 
    Shirt, ShoppingBag, Copy, Check, 
    CheckCircle2, Sparkles, MapPin, CalendarDays
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCode from "qrcode";

// Configurando as fontes
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

// CRC e PIX logica
function calcularCRC16(str: string): string {
    let crc = 0xFFFF;
    const polynomial = 0x1021;
    for (let i = 0; i < str.length; i++) {
        let b = str.charCodeAt(i);
        for (let j = 0; j < 8; j++) {
            let bit = ((b >> (7 - j)) & 1) === 1;
            let c15 = ((crc >> 15) & 1) === 1;
            crc <<= 1;
            if (c15 !== bit) { crc ^= polynomial; }
        }
    }
    crc &= 0xFFFF;
    let hex = crc.toString(16).toUpperCase();
    return hex.padStart(4, "0");
}

function gerarCodigoPix(valor: number, txid: string): string {
    const f = (tag: string, value: string): string => {
        const len = value.length.toString().padStart(2, "0");
        return `${tag}${len}${value}`;
    };
    const tag00 = f("00", "01"); 
    const subTag00 = f("00", "br.gov.bcb.pix");
    const subTag01 = f("01", "+5518996958159"); 
    const tag26 = f("26", subTag00 + subTag01);
    const tag52 = f("52", "0000"); 
    const tag53 = f("53", "986");  
    const tag54 = f("54", valor.toFixed(2)); 
    const tag58 = f("58", "BR");    
    const tag59 = f("59", "APCC PARAGUACU"); 
    const tag60 = f("60", "PARAGUACU PTA");   
    const subTag05 = f("05", txid);
    const tag62 = f("62", subTag05);
    const prePix = `${tag00}${tag26}${tag52}${tag53}${tag54}${tag58}${tag59}${tag60}${tag62}6304`;
    return `${prePix}${calcularCRC16(prePix)}`;
}

export default function PreVenda({ settings, produtos }: { settings: any, produtos: any[] }) {
    const [selectedColor, setSelectedColor] = useState<"Rosa" | "Azul">("Rosa");
    const [selectedSize, setSelectedSize] = useState<string>("");
    
    const [nomeComprador, setNomeComprador] = useState("");
    const [telefoneComprador, setTelefoneComprador] = useState("");
    
    const [pedidoGerado, setPedidoGerado] = useState<any>(null);
    const [pixCopiaCola, setPixCopiaCola] = useState("");
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [copiado, setCopiado] = useState(false);
    
    // Corousel de imagens da prevenda
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const currentProduct = produtos.find(
        (p) => p.cor?.toLowerCase() === selectedColor.toLowerCase()
    );

    const handleColorChange = (color: "Rosa" | "Azul") => {
        setSelectedColor(color);
        setSelectedSize("");
    };

    const handleGerarPedido = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentProduct) return;
        if (!selectedSize) { alert("Por favor, selecione um tamanho."); return; }
        if (!nomeComprador.trim() || !telefoneComprador.trim()) { alert("Preencha nome e telefone."); return; }

        const gradeTam = currentProduct.tamanhos?.find((t: any) => t.tamanho === selectedSize);
        if (!gradeTam || gradeTam.quantidade <= 0) {
            alert("Este tamanho esgotou recentemente. Por favor, escolha outro.");
            return;
        }

        const txid = "PVPCC" + Math.floor(1000 + Math.random() * 9000); 
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
            console.error(err);
            alert("Ocorreu um erro ao gerar PIX.");
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
        const msg = `Olá! Acabei de garantir minha camiseta na PRÉ-VENDA da APCC:\n\n` +
                    `📦 *Produto:* ${pedidoGerado.produtoNome}\n` +
                    `👕 *Tamanho:* ${pedidoGerado.tamanho} (${pedidoGerado.cor})\n` +
                    `👤 *Comprador:* ${pedidoGerado.comprador}\n` +
                    `📱 *Contato:* ${pedidoGerado.telefone}\n` +
                    `💰 *Valor:* R$ ${pedidoGerado.preco.toFixed(2)}\n` +
                    `🔢 *Código:* ${pedidoGerado.txid}\n\n` +
                    `Estou enviando o comprovante para confirmar a reserva.`;
        window.open(`https://wa.me/5518996958159?text=${encodeURIComponent(msg)}`, "_blank");
    };

    const activeColorHex = selectedColor === "Rosa" ? "#FF1A6C" : "#1A7BFF";
    const activeBgClass = selectedColor === "Rosa" ? "bg-pink-600 hover:bg-pink-700" : "bg-blue-600 hover:bg-blue-700";
    const activeTextClass = selectedColor === "Rosa" ? "text-pink-600" : "text-blue-600";
    
    return (
        <div className={`min-h-screen bg-slate-50 flex flex-col items-center justify-start ${outfit.variable} ${syne.variable} font-sans py-0 md:py-10`}>
            <div className="w-full max-w-[480px] bg-white min-h-screen md:min-h-[850px] shadow-[0_12px_40px_rgba(0,0,0,0.08)] md:rounded-3xl border border-slate-100 flex flex-col pb-16 overflow-hidden relative">
                
                <AnimatePresence mode="wait">
                    {!pedidoGerado ? (
                        <motion.div key="vitrine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col flex-1">
                            
                            {/* HERO Image Carousel */}
                            <div className="relative w-full aspect-[4/5] bg-slate-100 overflow-hidden">
                                {settings.imagens && settings.imagens.length > 0 ? (
                                    <>
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={settings.imagens[currentImageIndex]} alt="Campanha Pré-venda" className="w-full h-full object-cover transition-opacity duration-500" />
                                        {settings.imagens.length > 1 && (
                                            <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2">
                                                {settings.imagens.map((_: any, idx: number) => (
                                                    <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
                                                ))}
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-300">
                                        <Shirt className="w-16 h-16" />
                                    </div>
                                )}
                                
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-white text-slate-900 uppercase tracking-widest shadow-md">
                                        <Sparkles className="w-3 h-3 text-pink-500" /> Pré-venda Oficial
                                    </span>
                                </div>
                            </div>

                            {/* Header Info */}
                            <div className="px-6 py-6 border-b border-slate-100 bg-white">
                                <p className="text-xs font-bold text-pink-500 uppercase tracking-wider mb-2">{settings.subtitulo}</p>
                                <h1 className="text-3xl font-black text-slate-900 leading-tight font-display mb-3">
                                    {settings.titulo}
                                </h1>
                                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                                    {settings.descricao}
                                </p>
                            </div>

                            {/* Retirada Box */}
                            <div className="px-6 py-5 bg-slate-50 border-b border-slate-100 space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm"><MapPin className="w-4 h-4 text-slate-700" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Local de Retirada</p>
                                        <p className="text-xs font-bold text-slate-800 mt-0.5">{settings.localRetirada}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm"><CalendarDays className="w-4 h-4 text-slate-700" /></div>
                                    <div>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Data / Horário</p>
                                        <p className="text-xs font-bold text-slate-800 mt-0.5">{settings.dataRetirada}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Purchase Form */}
                            <form onSubmit={handleGerarPedido} className="px-6 flex-1 flex flex-col gap-6 py-6 bg-white">
                                
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display font-black text-xl text-slate-900">Garanta a sua</h3>
                                    <div className="bg-slate-900 text-white rounded-xl px-4 py-1.5 font-black text-lg shadow-[4px_4px_0px_#FF1A6C]">
                                        R$ {(currentProduct?.preco || 40.00).toFixed(2)}
                                    </div>
                                </div>

                                <div>
                                    <div className="grid grid-cols-2 gap-3 mt-2">
                                        <button type="button" onClick={() => handleColorChange("Rosa")} className={`py-3.5 px-4 rounded-xl border-2 font-bold text-xs transition-all ${selectedColor === "Rosa" ? "border-pink-500 bg-pink-50/50 text-pink-600" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"}`}>Camiseta Rosa</button>
                                        <button type="button" onClick={() => handleColorChange("Azul")} className={`py-3.5 px-4 rounded-xl border-2 font-bold text-xs transition-all ${selectedColor === "Azul" ? "border-blue-500 bg-blue-50/50 text-blue-600" : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"}`}>Camiseta Azul</button>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Tamanho</p>
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
                                                        className={`py-2 px-2.5 rounded-xl border-2 text-center font-bold transition-all text-xs flex flex-col items-center justify-center min-h-[48px] ${
                                                            isEsgotado ? "bg-slate-50 border-slate-100 text-slate-300 opacity-50 line-through" 
                                                            : isSelected ? "text-white shadow-md scale-[1.02]" 
                                                            : "bg-white border-slate-100 hover:border-slate-200 text-slate-700"
                                                        }`}
                                                    >
                                                        <span className="text-sm font-extrabold">{t.tamanho}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <p className="text-xs text-slate-400 bg-slate-50 p-4 rounded-xl text-center">Modelo indisponível.</p>
                                    )}
                                </div>

                                <div>
                                    <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-3">Seus Dados</p>
                                    <div className="space-y-3">
                                        <input type="text" required placeholder="Seu Nome Completo" value={nomeComprador} onChange={e => setNomeComprador(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all" />
                                        <input type="tel" required placeholder="WhatsApp (ex: 18999999999)" value={telefoneComprador} onChange={e => setTelefoneComprador(e.target.value)} className="w-full px-4 py-3.5 bg-slate-50 border-none rounded-xl text-xs font-bold text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-slate-200 focus:bg-white transition-all" />
                                    </div>
                                </div>

                                <div className="mt-2">
                                    <button
                                        type="submit"
                                        disabled={!selectedSize || !nomeComprador.trim() || !telefoneComprador.trim()}
                                        className={`w-full font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-sm shadow-[0_6px_0_rgba(0,0,0,0.1)] active:translate-y-1 active:shadow-[0_0px_0_rgba(0,0,0,0.1)] transition-all ${
                                            selectedSize && nomeComprador.trim() && telefoneComprador.trim()
                                                ? `${activeBgClass} text-white`
                                                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none active:translate-y-0"
                                        }`}
                                    >
                                        <ShoppingBag className="w-4 h-4" />
                                        Comprar na Pré-venda
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    ) : (
                        // CONFIRMAÇÃO DO PEDIDO
                        <motion.div key="confirmacao" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col p-6 py-12">
                            <div className="text-center py-4">
                                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30 mb-4">
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 font-display">Reserva Criada!</h2>
                                <p className="text-xs text-slate-500 font-bold mt-2 uppercase tracking-wider">Cód. {pedidoGerado.txid}</p>
                            </div>

                            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3 mt-4">
                                <div className="flex justify-between text-sm font-semibold text-slate-700">
                                    <span className="text-slate-400">Produto</span>
                                    <span>{pedidoGerado.produtoNome} ({pedidoGerado.cor})</span>
                                </div>
                                <div className="flex justify-between text-sm font-semibold text-slate-700">
                                    <span className="text-slate-400">Tamanho</span>
                                    <span>{pedidoGerado.tamanho}</span>
                                </div>
                                <div className="border-t border-slate-200/50 pt-3 mt-2 flex justify-between text-sm font-black text-slate-900">
                                    <span>Total</span>
                                    <span className={activeTextClass}>R$ {pedidoGerado.preco.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="my-8 text-center">
                                <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-4">Escaneie para Pagar</p>
                                <div className="w-48 h-48 bg-white rounded-3xl shadow-xl shadow-slate-200/50 mx-auto p-4 border border-slate-100">
                                    {qrCodeUrl && <img src={qrCodeUrl} alt="PIX" className="w-full h-full" />}
                                </div>
                            </div>

                            <div className="space-y-3 mb-8">
                                <button onClick={handleCopyPix} className={`w-full py-4 rounded-xl border-2 flex items-center justify-center gap-2 text-sm font-bold transition-all ${copiado ? "bg-green-50 border-green-200 text-green-600" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                                    {copiado ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar PIX Copia e Cola</>}
                                </button>
                                
                                <button onClick={handleWhatsAppRedirect} className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 text-sm shadow-[0_4px_0_#1da850] active:translate-y-1 active:shadow-[0_0px_0_#1da850] transition-all">
                                    Enviar Comprovante
                                </button>
                            </div>

                            <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                                <p className="text-[11px] font-bold text-amber-700 leading-relaxed">
                                    Sua reserva só será garantida no estoque após o envio do comprovante. 
                                    A retirada acontecerá em: <span className="font-black">{settings.localRetirada}</span> no dia <span className="font-black">{settings.dataRetirada}</span>.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
