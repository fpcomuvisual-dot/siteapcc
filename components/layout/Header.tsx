"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingBag, Lock } from "lucide-react";
import { useState } from "react";
import { LoginDialog } from "@/components/auth/LoginDialog";

export function Header() {
    const [isLoginOpen, setIsLoginOpen] = useState(false);

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
                        <Link href="/" className="flex items-center space-x-2">
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
                        <div className="flex items-center space-x-6">
                            <Link href="/" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                                Início
                            </Link>
                            <Link href="/transparencia" className="text-foreground/80 hover:text-primary transition-colors font-medium">
                                Transparência
                            </Link>

                            {/* Lojinha Link */}
                            <Link href="/lojinha" className="text-foreground/80 hover:text-primary transition-colors font-medium flex items-center gap-1">
                                <ShoppingBag className="w-4 h-4" />
                                Lojinha
                            </Link>

                            {/* Dashboard / Login Button */}
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
                    </div>
                </div>
            </motion.nav>

            <LoginDialog open={isLoginOpen} onOpenChange={setIsLoginOpen} />
        </>
    );
}
