import os

# --- Update 14-dizimos.html ---
dizimos_file = "/home/felipe/mycodes/igreja/partials/14-dizimos.html"
with open(dizimos_file, "r") as f:
    d = f.read()

d = d.replace('<span class="section-eyebrow">Fidelidade e Missão</span>', '<span class="section-eyebrow" data-i18n="dizimos.eyebrow">Fidelidade e Missão</span>')
d = d.replace('<h2 id="dizimos-heading" class="section-title">Dízimos e Ofertas</h2>', '<h2 id="dizimos-heading" class="section-title" data-i18n="dizimos.title">Dízimos e Ofertas</h2>')
d = d.replace('<p>Na Igreja Adventista, a devolução dos dízimos sustenta o anúncio do evangelho, a ação social e o avanço da missão de Cristo.</p>', '<p data-i18n="dizimos.lead">Na Igreja Adventista, a devolução dos dízimos sustenta o anúncio do evangelho, a ação social e o avanço da missão de Cristo.</p>')
d = d.replace('"Trazei todos os dízimos à casa do tesouro, para que haja mantimento na minha casa, e depois fazei prova de mim, diz o Senhor dos Exércitos." — Malaquias 3:10', '<span data-i18n="dizimos.verse">"Trazei todos os dízimos à casa do tesouro, para que haja mantimento na minha casa, e depois fazei prova de mim, diz o Senhor dos Exércitos." — Malaquias 3:10</span>')
d = d.replace('<p>Você pode devolver seu dízimo pelo aplicativo oficial <strong>7me</strong> ou diretamente via <strong>PIX</strong> da congregação.</p>', '<p data-i18n="dizimos.pix_desc">Você pode devolver seu dízimo pelo aplicativo oficial <strong>7me</strong> ou diretamente via <strong>PIX</strong> da congregação.</p>')
d = d.replace('<div class="pix-card-label">Chave PIX Oficial</div>', '<div class="pix-card-label" data-i18n="dizimos.pix_key">Chave PIX Oficial</div>')
d = d.replace('Copiar Chave PIX', '<span data-i18n="dizimos.btn_copy">Copiar Chave PIX</span>')
d = d.replace('<strong>App 7me</strong>', '<strong data-i18n="dizimos.7me_title">App 7me</strong>')
d = d.replace('<p>Dízimos com comprovante oficial da igreja.</p>', '<p data-i18n="dizimos.7me_desc">Dízimos com comprovante oficial da igreja.</p>')
d = d.replace('Acessar 7me', '<span data-i18n="dizimos.btn_7me">Acessar 7me</span>')

with open(dizimos_file, "w") as f:
    f.write(d)

# --- Update 15-gallery.html ---
gallery_file = "/home/felipe/mycodes/igreja/partials/15-gallery.html"
with open(gallery_file, "r") as f:
    g = f.read()

g = g.replace('<span class="section-eyebrow">Nossa Comunidade</span>', '<span class="section-eyebrow" data-i18n="gallery.eyebrow">Nossa Comunidade</span>')
g = g.replace('<h2 id="galeria-heading" class="section-title">Galeria de Fotos</h2>', '<h2 id="galeria-heading" class="section-title" data-i18n="gallery.title">Galeria de Fotos</h2>')
g = g.replace('<p class="section-lead">Registros autênticos dos cultos, acampamentos e encontros de oração.</p>', '<p class="section-lead" data-i18n="gallery.lead">Registros autênticos dos cultos, acampamentos e encontros de oração.</p>')
g = g.replace('Todos</button>', '<span data-i18n="gallery.f_all">Todos</span></button>')
g = g.replace('Cultos</button>', '<span data-i18n="gallery.f_cultos">Cultos</span></button>')
g = g.replace('Desbravadores</button>', '<span data-i18n="gallery.f_desbravadores">Desbravadores</span></button>')
g = g.replace('Ação Social</button>', '<span data-i18n="gallery.f_social">Ação Social</span></button>')
g = g.replace('Estudos Bíblicos</button>', '<span data-i18n="gallery.f_estudos">Estudos Bíblicos</span></button>')
g = g.replace('Jovens & Louvor</button>', '<span data-i18n="gallery.f_jovens">Jovens & Louvor</span></button>')
g = g.replace('Saúde</button>', '<span data-i18n="gallery.f_saude">Saúde</span></button>')

with open(gallery_file, "w") as f:
    f.write(g)

# --- Update 16-forms.html ---
forms_file = "/home/felipe/mycodes/igreja/partials/16-forms.html"
with open(forms_file, "r") as f:
    fo = f.read()

fo = fo.replace('<span class="section-eyebrow">Crescimento Espiritual</span>', '<span class="section-eyebrow" data-i18n="forms.eyebrow">Crescimento Espiritual</span>')
fo = fo.replace('<h2 id="form-heading" class="section-title">Como Podemos Ajudar?</h2>', '<h2 id="form-heading" class="section-title" data-i18n="forms.title">Como Podemos Ajudar?</h2>')
fo = fo.replace('<p class="section-lead">Solicite estudos bíblicos gratuitos ou envie seu pedido confidencial de oração.</p>', '<p class="section-lead" data-i18n="forms.lead">Solicite estudos bíblicos gratuitos ou envie seu pedido confidencial de oração.</p>')
fo = fo.replace('Quero Estudar a Bíblia</button>', '<span data-i18n="forms.tab_bible">Quero Estudar a Bíblia</span></button>')
fo = fo.replace('Pedido de Oração</button>', '<span data-i18n="forms.tab_prayer">Pedido de Oração</span></button>')
fo = fo.replace('<label for="bible-name">Seu Nome *</label>', '<label for="bible-name" data-i18n="forms.lbl_name">Seu Nome *</label>')
fo = fo.replace('placeholder="João da Silva"', 'placeholder="João da Silva" data-i18n="forms.ph_name"')
fo = fo.replace('<label for="bible-modality">Modalidade</label>', '<label for="bible-modality" data-i18n="forms.lbl_mod">Modalidade</label>')
fo = fo.replace('<label for="bible-topic">Tema de Interesse</label>', '<label for="bible-topic" data-i18n="forms.lbl_topic">Tema de Interesse</label>')
fo = fo.replace('Enviar Solicitação Gratuita</button>', '<span data-i18n="forms.btn_bible">Enviar Solicitação Gratuita</span></button>')
fo = fo.replace('<label for="prayer-name">Seu Nome (opcional)</label>', '<label for="prayer-name" data-i18n="forms.lbl_name_opt">Seu Nome (opcional)</label>')
fo = fo.replace('<label for="prayer-category">Motivo</label>', '<label for="prayer-category" data-i18n="forms.lbl_reason">Motivo</label>')
fo = fo.replace('<label for="prayer-details">Pedido de Oração *</label>', '<label for="prayer-details" data-i18n="forms.lbl_req">Pedido de Oração *</label>')
fo = fo.replace('Enviar para a Equipe de Oração', '<span data-i18n="forms.btn_prayer">Enviar para a Equipe de Oração</span>')

with open(forms_file, "w") as f:
    f.write(fo)

# --- Update locales.js ---
pt_additions = """
    // Comunidade / Dizimos / Forms
    "dizimos.eyebrow": "Fidelidade e Missão",
    "dizimos.title": "Dízimos e Ofertas",
    "dizimos.lead": "Na Igreja Adventista, a devolução dos dízimos sustenta o anúncio do evangelho, a ação social e o avanço da missão de Cristo.",
    "dizimos.verse": '"Trazei todos os dízimos à casa do tesouro, para que haja mantimento na minha casa, e depois fazei prova de mim, diz o Senhor dos Exércitos." — Malaquias 3:10',
    "dizimos.pix_desc": "Você pode devolver seu dízimo pelo aplicativo oficial <strong>7me</strong> ou diretamente via <strong>PIX</strong> da congregação.",
    "dizimos.pix_key": "Chave PIX Oficial",
    "dizimos.btn_copy": "Copiar Chave PIX",
    "dizimos.7me_title": "App 7me",
    "dizimos.7me_desc": "Dízimos com comprovante oficial da igreja.",
    "dizimos.btn_7me": "Acessar 7me",

    "gallery.eyebrow": "Nossa Comunidade",
    "gallery.title": "Galeria de Fotos",
    "gallery.lead": "Registros autênticos dos cultos, acampamentos e encontros de oração.",
    "gallery.f_all": "Todos",
    "gallery.f_cultos": "Cultos",
    "gallery.f_desbravadores": "Desbravadores",
    "gallery.f_social": "Ação Social",
    "gallery.f_estudos": "Estudos Bíblicos",
    "gallery.f_jovens": "Jovens & Louvor",
    "gallery.f_saude": "Saúde",

    "forms.eyebrow": "Crescimento Espiritual",
    "forms.title": "Como Podemos Ajudar?",
    "forms.lead": "Solicite estudos bíblicos gratuitos ou envie seu pedido confidencial de oração.",
    "forms.tab_bible": "Quero Estudar a Bíblia",
    "forms.tab_prayer": "Pedido de Oração",
    "forms.lbl_name": "Seu Nome *",
    "forms.ph_name": "João da Silva",
    "forms.lbl_mod": "Modalidade",
    "forms.lbl_topic": "Tema de Interesse",
    "forms.btn_bible": "Enviar Solicitação Gratuita",
    "forms.lbl_name_opt": "Seu Nome (opcional)",
    "forms.lbl_reason": "Motivo",
    "forms.lbl_req": "Pedido de Oração *",
    "forms.btn_prayer": "Enviar para a Equipe de Oração",
"""

en_additions = """
    // Comunidade / Dizimos / Forms
    "dizimos.eyebrow": "Faithfulness and Mission",
    "dizimos.title": "Tithes and Offerings",
    "dizimos.lead": "In the Adventist Church, returning tithes supports preaching the gospel, social action, and advancing Christ's mission.",
    "dizimos.verse": '"Bring the whole tithe into the storehouse, that there may be food in my house. Test me in this, says the Lord Almighty." — Malachi 3:10',
    "dizimos.pix_desc": "You can return your tithe through the official <strong>7me</strong> app or directly via the congregation's <strong>PIX</strong>.",
    "dizimos.pix_key": "Official PIX Key",
    "dizimos.btn_copy": "Copy PIX Key",
    "dizimos.7me_title": "7me App",
    "dizimos.7me_desc": "Tithes with official church receipt.",
    "dizimos.btn_7me": "Access 7me",

    "gallery.eyebrow": "Our Community",
    "gallery.title": "Photo Gallery",
    "gallery.lead": "Authentic records of worship services, camps, and prayer meetings.",
    "gallery.f_all": "All",
    "gallery.f_cultos": "Services",
    "gallery.f_desbravadores": "Pathfinders",
    "gallery.f_social": "Social Action",
    "gallery.f_estudos": "Bible Studies",
    "gallery.f_jovens": "Youth & Worship",
    "gallery.f_saude": "Health",

    "forms.eyebrow": "Spiritual Growth",
    "forms.title": "How Can We Help?",
    "forms.lead": "Request free Bible studies or submit your confidential prayer request.",
    "forms.tab_bible": "I Want to Study the Bible",
    "forms.tab_prayer": "Prayer Request",
    "forms.lbl_name": "Your Name *",
    "forms.ph_name": "John Doe",
    "forms.lbl_mod": "Modality",
    "forms.lbl_topic": "Topic of Interest",
    "forms.btn_bible": "Send Free Request",
    "forms.lbl_name_opt": "Your Name (optional)",
    "forms.lbl_reason": "Reason",
    "forms.lbl_req": "Prayer Request *",
    "forms.btn_prayer": "Send to Prayer Team",
"""

with open('/home/felipe/mycodes/igreja/js/locales.js', 'r') as f:
    content = f.read()

pt_insertion_point = '    "footer.nav": "Navegação",'
content = content.replace(pt_insertion_point, pt_additions + pt_insertion_point)

en_insertion_point = '    "footer.nav": "Navigation",'
content = content.replace(en_insertion_point, en_additions + en_insertion_point)

with open('/home/felipe/mycodes/igreja/js/locales.js', 'w') as f:
    f.write(content)

print("Final translations added!")
