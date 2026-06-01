"use client";

import { FloatingWhatsApp } from 'react-floating-whatsapp';

export default function WhatsAppWidget() {
    return (
        <FloatingWhatsApp
            phoneNumber="5518996958159"
            accountName="APCC"
            avatar="/icon-192.png" // Pode usar o logo da APCC
            statusMessage="Responde rápido"
            chatMessage="Olá! 👋 Bem-vindo à APCC. Como podemos ajudar você hoje?"
            placeholder="Digite sua mensagem..."
            messageDelay={2}
            darkMode={false}
            allowClickAway={true}
            allowEsc={true}
            className="whatsapp-widget"
            buttonClassName="whatsapp-button"
            chatboxClassName="whatsapp-chatbox"
            notification={true}
            notificationDelay={60}
            notificationSound={false}
        />
    );
}
