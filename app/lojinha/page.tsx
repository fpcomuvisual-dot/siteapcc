"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image";

const PRODUCTS = [
    {
        id: 1,
        name: "Camiseta APCC",
        price: "R$ 49,90",
        description: "Camiseta 100% algodão com a logo da APCC. Vista essa causa!",
        image: "https://placehold.co/400x400/e91e63/ffffff?text=Camiseta+APCC"
    },
    {
        id: 2,
        name: "Caneca Personalizada",
        price: "R$ 29,90",
        description: "Caneca de cerâmica perfeita para seu café. Ajude a instituição.",
        image: "https://placehold.co/400x400/9c27b0/ffffff?text=Caneca+APCC"
    },
    {
        id: 3,
        name: "Ecobag Solidária",
        price: "R$ 35,00",
        description: "Ecobag sustentável e resistente. Ideal para o dia a dia.",
        image: "https://placehold.co/400x400/2196f3/ffffff?text=Ecobag"
    },
    {
        id: 4,
        name: "Kit Artesanato",
        price: "R$ 59,90",
        description: "Kit com produtos artesanais feitos por nossos voluntários.",
        image: "https://placehold.co/400x400/4caf50/ffffff?text=Kit+Artesanato"
    }
];

export default function LojinhaPage() {
    return (
        <div className="min-h-screen bg-background pb-20">
            {/* Header / Intro */}
            <div className="bg-muted/30 border-b border-border py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold text-primary mb-4">
                        Lojinha da APCC
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Adquira produtos exclusivos e ajude a manter nossos projetos.
                        Toda a renda é revertida para o tratamento dos pacientes.
                    </p>
                </div>
            </div>

            {/* Products Grid */}
            <div className="container mx-auto px-4 mt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PRODUCTS.map((product) => (
                        <Card key={product.id} className="hover:shadow-lg transition-shadow border-border overflow-hidden group">
                            <CardHeader className="p-0">
                                <div className="aspect-square relative bg-muted">
                                    <Image
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <CardTitle className="text-xl font-bold text-foreground">
                                        {product.name}
                                    </CardTitle>
                                    <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-full">
                                        {product.price}
                                    </span>
                                </div>
                                <p className="text-muted-foreground text-sm line-clamp-2">
                                    {product.description}
                                </p>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white gap-2 group-hover:bg-primary transition-colors">
                                    <ShoppingBag className="w-4 h-4" />
                                    Comprar
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="container mx-auto px-4 mt-20 text-center">
                <div className="bg-gradient-to-r from-muted to-muted/50 rounded-2xl p-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                        Quer ver mais produtos?
                    </h2>
                    <p className="text-muted-foreground mb-8">
                        Visite nossa sede física e conheça todo o nosso bazar beneficente.
                    </p>
                    <Button variant="outline" className="border-primary text-primary hover:bg-primary/10">
                        Ver endereço e horários <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
