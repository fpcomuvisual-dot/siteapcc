"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Menu, X, Heart, ShoppingBag, Lock, Search } from "lucide-react";
import { useState, useRef } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";

export function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const router = useRouter();
    const searchInputRef = useRef<HTMLInputElement>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const q = searchInputRef.current?.value?.trim();
        if (q) {
            setIsSearchOpen(false);
            router.push(`/busca?q=${encodeURIComponent(q)}`);
        }
    };

    return (
        <>
            <motion.nav
                className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-40"
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center space-x-2 z-50 relative">
                            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }}>
                                <Heart className="h-8 w-8 text-primary" />
                            </motion.div>
                            <span className="text-2xl font-bold text-primary">APCC</span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/sobre" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                                Sobre
                            </Link>
                            <Link href="/calendario" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                                Calendário
                            </Link>
                            <Link href="/noticias" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                                Notícias
                            </Link>
                            <Link href="/transparencia" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                                Transparência
                            </Link>
                            <Link href="/lojinha" className="text-foreground/80 hover:text-primary transition-colors font-medium flex items-center gap-1">
                                <ShoppingBag className="w-4 h-4" />
                                Lojinha
                            </Link>

                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Buscar"
                            >
                                <Search className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setIsLoginOpen(true)}
                                className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center gap-1 text-sm"
                            >
                                <Lock className="w-3 h-3" />
                                Área Restrita
                            </button>

                            <Link href="/doar">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button className="bg-primary hover:bg-primary/90 border-0 font-bold text-primary-foreground shadow-lg shadow-primary/20">
                                        Doar
                                    </Button>
                                </motion.div>
                            </Link>
                        </div>

                        {/* Mobile Actions */}
                        <div className="md:hidden z-50 flex items-center gap-2">
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="text-primary p-2"
                                aria-label="Buscar"
                            >
                                <Search className="h-6 w-6" />
                            </button>
                            <Link href="/doar">
                                <Button size="sm" className="bg-primary hover:bg-primary/90 border-0 font-bold text-primary-foreground shadow-md shadow-primary/20 text-xs px-3 h-8">
                                    Doar
                                </Button>
                            </Link>
                            <button onClick={toggleMenu} className="text-primary p-2">
                                {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "100vh" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="fixed inset-0 bg-background/95 backdrop-blur-xl z-40 pt-24 px-6 md:hidden overflow-hidden"
                        >
                            <div className="flex flex-col space-y-6 text-2xl font-bold text-center">
                                <Link href="/sobre" className="text-foreground hover:text-primary transition-colors py-2" onClick={toggleMenu}>Sobre</Link>
                                <Link href="/calendario" className="text-foreground hover:text-primary transition-colors py-2" onClick={toggleMenu}>Calendário</Link>
                                <Link href="/noticias" className="text-foreground hover:text-primary transition-colors py-2" onClick={toggleMenu}>Notícias</Link>
                                <Link href="/transparencia" className="text-foreground hover:text-primary transition-colors py-2" onClick={toggleMenu}>Transparência</Link>
                                <Link href="/lojinha" className="text-foreground hover:text-primary transition-colors py-2 flex items-center justify-center gap-2" onClick={toggleMenu}>
                                    <ShoppingBag className="w-6 h-6" />
                                    Lojinha
                                </Link>
                                <div className="pt-8 flex flex-col gap-4 w-full">
                                    <button
                                        onClick={() => { setIsLoginOpen(true); toggleMenu(); }}
                                        className="text-muted-foreground hover:text-foreground transition-colors font-medium flex items-center justify-center gap-2 text-lg"
                                    >
                                        <Lock className="w-5 h-5" />
                                        Área Restrita
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>

            {/* Search Dialog */}
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
                <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
                    <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b">
                        <Search className="h-5 w-5 text-muted-foreground shrink-0" />
                        <Input
                            ref={searchInputRef}
                            placeholder="Buscar notícias, documentos..."
                            className="border-0 shadow-none focus-visible:ring-0 text-lg"
                            autoFocus
                        />
                        <Button type="submit" size="sm">Buscar</Button>
                    </form>
                    <div className="px-4 py-3 text-xs text-muted-foreground">
                        Pressione Enter para buscar ou clique em Buscar
                    </div>
                </DialogContent>
            </Dialog>

            <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
        </>
    );
}
