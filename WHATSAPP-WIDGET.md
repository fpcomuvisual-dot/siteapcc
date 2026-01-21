# 📱 WhatsApp Widget - Guia de Configuração

## ✅ Implementado com Sucesso!

O widget do WhatsApp foi implementado usando a biblioteca moderna **`react-floating-whatsapp`**.

---

## 🎯 Funcionalidades

✅ **Janela flutuante** no canto inferior direito
✅ **Animação suave** ao abrir/fechar
✅ **Notificação** com badge vermelho
✅ **Mensagem de boas-vindas** personalizada
✅ **Responsivo** - funciona em mobile e desktop
✅ **Acessível** - suporta teclado e screen readers

---

## ⚙️ Configuração do Número

### 1. Edite o arquivo `.env.local` (ou crie se não existir):

```bash
NEXT_PUBLIC_WHATSAPP=5513347100000
```

**Formato do número:**
- **55** = Código do Brasil (DDI)
- **13** = DDD de Paraguaçu Paulista
- **34710000** = Número do WhatsApp (sem espaços ou traços)

### 2. Atualize o componente (se necessário):

Arquivo: `components/WhatsAppWidget.tsx`

```tsx
phoneNumber="5513347100000" // Substitua pelo número real da APCC
```

---

## 🎨 Personalização

### Mensagem de Boas-Vindas:
```tsx
chatMessage="Olá! 👋 Bem-vindo à APCC. Como podemos ajudar você hoje?"
```

### Nome da Conta:
```tsx
accountName="APCC"
```

### Status:
```tsx
statusMessage="Responde rápido"
```

### Avatar/Logo:
```tsx
avatar="/icon-192.png" // Pode usar o logo da APCC
```

### Tempo de Notificação:
```tsx
notificationDelay={60} // Segundos até mostrar notificação
```

---

## 🧪 Como Testar

1. **Rode o servidor:**
   ```bash
   npm run dev
   ```

2. **Acesse:** `http://localhost:3000`

3. **Procure o botão verde** no canto inferior direito

4. **Clique para abrir** a janela do chat

5. **Digite uma mensagem** e clique em enviar

6. **Você será redirecionado** para o WhatsApp Web/App

---

## 📱 Como Funciona

1. Usuário clica no botão verde flutuante
2. Abre uma janela de chat estilo WhatsApp
3. Usuário digita a mensagem
4. Ao enviar, abre o WhatsApp real com a mensagem pré-preenchida
5. Conversa continua no WhatsApp oficial

---

## 🎨 Customizações Avançadas

### Mudar Cor do Botão:
Edite o CSS global em `app/globals.css`:

```css
.whatsapp-button {
  background-color: #25D366 !important;
}
```

### Desabilitar Notificação:
```tsx
notification={false}
```

### Desabilitar Som:
```tsx
notificationSound={false}
```

### Permitir Fechar Clicando Fora:
```tsx
allowClickAway={true}
```

---

## 🔧 Troubleshooting

### Widget não aparece?
- Verifique se o componente está no `layout.tsx`
- Verifique o console do navegador por erros
- Certifique-se que `npm run dev` está rodando

### Número não funciona?
- Verifique o formato: `55` + `DDD` + `Número`
- Não use espaços, traços ou parênteses
- Exemplo correto: `5513912345678`

### Widget aparece mas não abre WhatsApp?
- Verifique se o número está correto
- Teste o link manualmente: `https://wa.me/5513347100000`

---

## 📚 Documentação da Biblioteca

**react-floating-whatsapp**
- GitHub: https://github.com/awran5/react-floating-whatsapp
- NPM: https://www.npmjs.com/package/react-floating-whatsapp

---

## 🚀 Deploy

O widget funciona automaticamente em produção!

Apenas certifique-se de:
1. ✅ Número do WhatsApp configurado corretamente
2. ✅ Avatar/logo da APCC no `/public`
3. ✅ Mensagens personalizadas

---

## 💡 Dicas

- **Teste o número** antes do deploy
- **Personalize as mensagens** para sua audiência
- **Monitore as conversas** no WhatsApp Business
- **Responda rápido** para manter o status "Online"

---

Criado para: APCC - Associação Paraguaçuense de Combate ao Câncer
Data: 2025-12-05
