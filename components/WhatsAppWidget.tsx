"use client";

import { FloatingWhatsApp } from 'react-floating-whatsapp';

export default function WhatsAppWidget() {
    return (
        <FloatingWhatsApp
            phoneNumber="5513347100000" // Substitua pelo número da APCC (DDI + DDD + Número)
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
