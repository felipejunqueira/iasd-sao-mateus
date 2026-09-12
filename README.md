# ⛪ Website Oficial - Igreja Adventista do Sétimo Dia (São Mateus)

> Portal moderno, inclusivo, seguro e mobile-first da IASD São Mateus (Zona Leste de São Paulo). Desenvolvido sob a **Filosofia Unix**: código modular, funções concisas, alta segurança defensiva e **estritamente menos de 100 linhas por arquivo**.

---

## 🌟 Destaques do Projeto

- **Localização Oficial**: **Rua Antônio Previato, 1001 - São Mateus, São Paulo - SP** (com integração direta para Google Maps e Waze).
- **Filosofia Unix na Prática**:
  - Arquitetura 100% modular dividida em módulos independentes (`css/core/`, `css/components/`, `js/modules/`).
  - **Zero arquivos com mais de 100 linhas**: facilidade máxima para auditoria, leitura e manutenção.
- **Mobile-First & Resiliente**:
  - Interface desenvolvida primariamente para smartphones (menu drawer, botões com área de toque ampla > 44px).
  - Proteção defensiva contra toques repetidos acidentais (debounce de 3s no envio de formulários e no botão do PIX).
  - Sanitização de strings contra ataques de injeção XSS.
  - Armazenamento em `safeStorage` com tolerância a falhas (funciona sem quebrar mesmo em aba anônima).
- **Novas Funcionalidades Reais**:
  - 🎬 **Central de Séries Bíblicas em Temporadas**: Catálogo interativo com temporadas de estudos bíblicos e player modal.
  - 💳 **Módulo de Dízimos & Ofertas com PIX**: Chave PIX da igreja com botão **"Copiar Chave PIX"** de 1 clique, QR Code e link para o app oficial **7me**.
  - 🔗 **Hub de Links da Bio**: Atalhos rápidos pensados para quem vem do Instagram da igreja.
  - 📸 **Fotografias Documentais Reais**: Registros autênticos de templos adventistas, cultos e acampamentos.
  - ♿ **Acessibilidade Completa (WCAG 2.1)**: Suporte a **VLibras**, modo **Alto Contraste**, escala de fontes e **Leitor de Voz Nativo** em português.

---

## 📁 Arquitetura Modular (< 100 linhas por arquivo)

```
igreja/
├── index.html                   # HTML semântico e estruturado
├── server.js                    # Servidor local Node.js seguro
├── package.json                 # Scripts do projeto
├── README.md                    # Documentação técnica
│
├── data/
│   ├── feed.json                # Publicações reais da galeria
│   └── series.json              # Temporadas e episódios bíblicos
│
├── css/
│   ├── main.css                 # Importador central
│   ├── core/
│   │   ├── variables.css        # Cores, raios e sombras
│   │   ├── reset.css            # Reset global e container
│   │   └── accessibility.css    # Alto contraste e escalas
│   └── components/
│       ├── nav.css              # Barra de navegação e menu mobile
│       ├── buttons.css          # Botões reutilizáveis
│       ├── hero.css             # Banner hero com imagem real
│       ├── quick-links.css      # Hub de links para bio do Instagram
│       ├── services.css         # Horários e cálculo de culto
│       ├── series-tabs.css      # Abas da central de séries
│       ├── series-cards.css     # Cards de episódios e thumbnails
│       ├── dizimos.css          # Dízimos, PIX e 7me
│       ├── timeline.css         # Linha do tempo de São Mateus
│       ├── remedies.css         # 8 Remédios naturais
│       ├── ministries.css       # Desbravadores, ASA e Jovens
│       ├── gallery.css          # Galeria com filtros
│       ├── forms.css            # Estudo bíblico e oração
│       ├── modals.css           # Lightbox e player de vídeo
│       └── footer.css           # Rodapé e créditos de Felipe
│
├── js/
│   ├── main.js                  # Ponto de entrada modular
│   └── modules/
│       ├── utils.js             # Sanitização, safeStorage, debounce e toast
│       ├── menu.js              # Menu mobile drawer
│       ├── services.js          # Próximo culto inteligente
│       ├── series.js            # Central de séries bíblicas
│       ├── pix.js               # Cópia segura da chave PIX
│       ├── gallery.js           # Filtros da galeria
│       ├── lightbox.js          # Modal de fotos
│       ├── forms.js             # Formulários com debounce anti-spam
│       ├── a11y-theme.js        # Alto contraste e fontes
│       ├── a11y-voice.js        # Leitor de texto com Web Speech API
│       └── vlibras.js           # Widget oficial VLibras
│
└── assets/
    └── images/                  # Fotos documentais reais de alta resolução
```

---

## 🚀 Como Executar

```bash
# Na pasta raiz do projeto:
npm start
# ou:
node server.js
```
Acesse no seu navegador: **`http://localhost:3000`**

---

## 👨‍💻 Créditos do Desenvolvedor

Projeto concebido e implementado por **Felipe** como trabalho voluntário dedicado à Igreja Adventista do Sétimo Dia de São Mateus e demonstração técnica para portfólio profissional de engenharia web.
