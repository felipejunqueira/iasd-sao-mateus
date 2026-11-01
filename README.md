# ⛪ Website Oficial - Igreja Adventista do Sétimo Dia (São Mateus)

> Portal comunitário, litúrgico, acessível e PWA da IASD São Mateus (Zona Leste de SP).
> Desenvolvido sob a **Filosofia Unix**: código 100% modular, foco no usuário e **zero arquivos com mais de 100 linhas**.

---

## 🌟 Funcionalidades e Inovações Comunitárias

- **Localização Oficial**: **Rua Antônio Previato, 1001 - São Mateus, SP** (Google Maps & Waze).
- **Pôr do Sol & Boas-Vindas ao Sábado**: Cálculo astronômico NOAA para São Mateus com contagem regressiva para sexta-feira e compartilhamento de Feliz Sábado no WhatsApp.
- **Hinário Adventista Interativo**: Busca instantânea por número e título, modal com letra completa, ajuste de fonte cíclico para leitura durante o culto e compartilhamento.
- **Mural de Oração Comunitário**: Pedidos reais da congregação com contadores de intercessão ("🙏 Já orei por este pedido (+1)") e integração com o formulário confidencial.
- **Pequenos Grupos (PGs) nos Bairros**: Guia por bairros (São Mateus, São Rafael, Tietê, Iguatemi, Cidade Tiradentes) com contato direto via WhatsApp com os líderes.
- **Agenda & Calendário Litúrgico**: Santa Ceia, Desbravadores, ASA, Jovens JA e Semanas Especiais com geração de link "Adicionar ao Google Agenda" de 1 clique.
- **Check-up Diário dos 8 Remédios Naturais**: Avaliação interativa de estilo de vida com cálculo de pontuação, prescrição bíblico-pastoral e salvamento em `safeStorage`.
- **Versículo Diário ("Pão da Palavra")**: Inspiração diária determinística com compartilhamento formatado no WhatsApp.
- **Dízimos, Ofertas & PIX**: Chave PIX oficial com cópia em 1 clique, QR Code e link direto para o app 7me.
- **PWA & Funcionamento Offline**: Service Worker com estratégia Cache-First para recursos da igreja funcionarem mesmo sem sinal de internet no santuário.
- **Acessibilidade Universal (WCAG 2.1 AAA)**: Contraste verificado (17:1), VLibras, Leitor de Voz Nativo (Web Speech API), Focus Trap e navegação total por teclado (WAI-ARIA).

---

## 📁 Arquitetura Modular (< 100 linhas por arquivo)

```
iasd-sao-mateus/
├── index.html                   # HTML semântico com carregador de partials
├── sw.js & manifest.webmanifest # Progressive Web App e cache offline
├── server.js                    # Servidor local Node.js com MIME types
├── data/                        # hinario, events, pgs, prayers, verses, series, feed
├── css/core/ & components/      # Paleta nobre adventista, botões, modais, pwa, sunset
├── js/modules/ & locales/       # Módulos puros desacoplados, i18n bilíngue modular
└── partials/                    # 27 partials modulares temáticas e acessíveis
```

---

## 🚀 Como Executar

```bash
# Na pasta raiz do projeto:
npm run dev
# ou:
node server.js
```
Acesse no navegador: **`http://localhost:3000`**

---

## 👨‍💻 Créditos do Desenvolvedor

Projeto concebido e implementado por **Felipe** como trabalho voluntário dedicado à Igreja Adventista do Sétimo Dia de São Mateus e demonstração técnica para portfólio profissional de engenharia web.
