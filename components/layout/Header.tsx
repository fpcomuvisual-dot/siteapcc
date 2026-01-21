"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Menu, X, Heart, ShoppingBag, Lock } from "lucide-react";
import { useState } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";

export function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

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
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Heart className="h-8 w-8 text-primary" />
                            </motion.div>
                            <span className="text-2xl font-bold text-primary">
                                APCC
                            </span>
                        </Link>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-6">
                            <Link href="/sobre" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                                Sobre
                            </Link>
                            <Link href="/transparencia" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                                Transparência
                            </Link>
                            <Link href="/lojinha" className="text-foreground/80 hover:text-primary transition-colors font-medium flex items-center gap-1">
                                <ShoppingBag className="w-4 h-4" />
                                Lojinha
                            </Link>

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

                        {/* Mobile Actions (Doar + Menu) */}
                        <div className="md:hidden z-50 flex items-center gap-2">
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
                                <Link
                                    href="/sobre"
                                    className="text-foreground hover:text-primary transition-colors py-2"
                                    onClick={toggleMenu}
                                >
                                    Sobre
                                </Link>
                                <Link
                                    href="/transparencia"
                                    className="text-foreground hover:text-primary transition-colors py-2"
                                    onClick={toggleMenu}
                                >
                                    Transparência
                                </Link>
                                <Link
                                    href="/lojinha"
                                    className="text-foreground hover:text-primary transition-colors py-2 flex items-center justify-center gap-2"
                                    onClick={toggleMenu}
                                >
                                    <ShoppingBag className="w-6 h-6" />
                                    Lojinha
                                </Link>

                                <div className="pt-8 flex flex-col gap-4 w-full">
                                    <button
                                        onClick={() => {
                                            setIsLoginOpen(true);
                                            toggleMenu();
                                        }}
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

            <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
        </>
    );
}
