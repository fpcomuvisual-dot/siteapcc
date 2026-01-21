import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "@/components/WhatsAppWidget";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "APCC - Associação Paraguaçuense de Combate ao Câncer",
    description: "Oferecemos apoio, tratamento e esperança para quem enfrenta o câncer. Transparência, solidariedade e cuidado desde 1995. Doe agora e transforme vidas.",
    keywords: ["APCC", "câncer", "Paraguaçu Paulista", "doação", "tratamento oncológico", "outubro rosa", "novembro azul", "ONG", "saúde"],
    authors: [{ name: "APCC" }],
    creator: "APCC",
    publisher: "APCC",
    metadataBase: new URL("https://apcc.org.br"),
    alternates: {
        canonical: "/",
    },
    openGraph: {
        type: "website",
        locale: "pt_BR",
        url: "https://apcc.org.br",
        title: "APCC - Juntos Salvamos Vidas | Combate ao Câncer",
        description: "Oferecemos apoio, tratamento e esperança para quem enfrenta o câncer. Mais de 1.200 pacientes atendidos em 2024. Doe agora!",
        siteName: "APCC",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "APCC - Associação Paraguaçuense de Combate ao Câncer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "APCC - Juntos Salvamos Vidas",
        description: "Apoio, tratamento e esperança no combate ao câncer. Doe agora e transforme vidas!",
        images: ["/og-image.jpg"],
        creator: "@apcc_oficial",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    verification: {
        google: "seu-codigo-google-search-console",
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="pt-BR">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
                <meta name="theme-color" content="#ffffff" />
            </head>
            <body className={inter.className}>
                {children}
                <WhatsAppWidget />
            </body>
        </html>
    );
}
