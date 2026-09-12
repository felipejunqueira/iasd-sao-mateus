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
│       ├── nav.css & nav-tabs   # Navegação, menu mobile e 3 abas
│       ├── buttons.css          # Botões reutilizáveis
│       ├── hero & quick-links   # Banner e hub de links da bio
│       ├── services.css         # Horários e cálculo de culto
│       ├── series (tabs & cards)# Abas e cards da central de séries
│       ├── dizimos.css          # Dízimos, PIX e 7me
│       ├── timeline & remedies  # Linha do tempo e 8 remédios
│       ├── ministries & gallery # Desbravadores, ASA, JA e galeria
│       ├── forms.css            # Estudo bíblico e oração
│       ├── modals.css           # Lightbox e player de vídeo
│       └── footer.css           # Rodapé e créditos de Felipe
│
├── js/
│   ├── main.js                  # Ponto de entrada modular
│   └── modules/
│       ├── utils.js             # Sanitização, safeStorage e debounce
│       ├── menu & tab-router    # Menu mobile e roteador de 3 abas
│       ├── services & series    # Próximo culto e séries bíblicas
│       ├── pix, gallery & light # Chave PIX, galeria e lightbox
│       ├── forms.js             # Formulários anti-spam
│       └── a11y & vlibras       # Alto contraste, voz e VLibras
│
└── assets/
    └── images/                  # Fotos documentais e logo oficial IASD
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
