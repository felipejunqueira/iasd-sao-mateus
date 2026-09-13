import os

pt_additions = """
    // Lideres extras
    "lideres.lbl_lideres": "Líderes:",
    "lideres.lbl_diretoria": "Diretoria:",
    "lideres.lbl_diretor": "Diretor:",
    "lideres.lbl_diretora": "Diretora:",

    // Ministerios
    "minis.eyebrow": "Desenvolvimento & Comunidade",
    "minis.title": "Clubes e Ministérios",
    "minis.lead": "Atividades formativas para crianças, adolescentes, jovens e famílias em São Mateus.",
    "minis.tag_desbrav": "10 a 15 anos",
    "minis.title_desbrav": "Clube de Desbravadores Saturno",
    "minis.desc_desbrav": "Acampamentos, pioneiria, cidadania, sobrevivência e formação do caráter cristão.",
    "minis.btn_desbrav": "Inscrever meu filho",
    "minis.tag_avent": "6 a 9 anos",
    "minis.title_avent": "Clube de Aventureiros",
    "minis.desc_avent": "Atividades recreativas, contato com a natureza e fortalecimento dos vínculos familiares.",
    "minis.btn_avent": "Inscrever meu filho",
    "minis.tag_artes": "Comunidade",
    "minis.title_artes": "Curso de Artesanato",
    "minis.desc_artes": "Oficinas práticas de pintura, costura e manualidades gratuitas para promover a união e o aprendizado.",
    "minis.btn_artes": "Saber Mais",
    "minis.tag_asa": "Solidariedade",
    "minis.title_asa": "Ação Solidária Adventista (ASA)",
    "minis.desc_asa": "Assistência a famílias em vulnerabilidade com alimentos, roupas e apoio emocional contínuo.",
    "minis.btn_asa": "Quero Ajudar",
    "minis.tag_ja": "Música & Jovens",
    "minis.title_ja": "Louvor e Jovens Adventistas",
    "minis.desc_ja": "Equipe instrumental e encontros dinâmicos da juventude de fé aos sábados à tarde (JA).",
    "minis.btn_ja": "Participar",

    // Remedies
    "remedies.eyebrow": "Estilo de Vida Saudável",
    "remedies.title": "Os 8 Remédios Naturais de Deus",
    "remedies.lead": "Princípios comprovados de saúde integral promovidos pela Igreja Adventista mundialmente.",
    "remedies.r1": "Água Pura",
    "remedies.r1_desc": "Beba bastante água pura para hidratar as células e purificar o corpo.",
    "remedies.r2": "Ar Puro",
    "remedies.r2_desc": "Oxigenação profunda em contato com áreas verdes para clareza mental.",
    "remedies.r3": "Luz Solar",
    "remedies.r3_desc": "Ativação de vitamina D, fortalecimento imunológico e bem-estar.",
    "remedies.r4": "Exercício",
    "remedies.r4_desc": "Caminhadas regulares para fortalecer o coração e o corpo.",
    "remedies.r5": "Repouso",
    "remedies.r5_desc": "Sono de qualidade e o descanso semanal do sábado sagrado.",
    "remedies.r6": "Nutrição",
    "remedies.r6_desc": "Alimentos integrais, frutas e verduras com redução de ultraprocessados.",
    "remedies.r7": "Temperança",
    "remedies.r7_desc": "Equilíbrio no trabalho e abstenção de substâncias nocivas.",
    "remedies.r8": "Confiança em Deus",
    "remedies.r8_desc": "Fé e oração que trazem paz interior nas tribulações.",

    // Marcos
    "marcos.eyebrow": "Fundamentos e Documentos",
    "marcos.title": "Referências Oficiais",
    "marcos.lead": "Documentos da Igreja Adventista do Sétimo Dia para estudo e consulta pública.",
    "marcos.link1": "28 Crenças Fundamentais",
    "marcos.link1_desc": "Pilares bíblicos da fé adventista",
    "marcos.link2": "Manual da Igreja",
    "marcos.link2_desc": "Normas e procedimentos oficiais",
    "marcos.link3": "Agência de Notícias (ANN)",
    "marcos.link3_desc": "Informativos da igreja mundial",
    "marcos.link4": "Associação Paulista Leste",
    "marcos.link4_desc": "Sede regional das congregações",
"""

en_additions = """
    // Lideres extras
    "lideres.lbl_lideres": "Leaders:",
    "lideres.lbl_diretoria": "Board:",
    "lideres.lbl_diretor": "Director:",
    "lideres.lbl_diretora": "Director:",

    // Ministerios
    "minis.eyebrow": "Development & Community",
    "minis.title": "Clubs and Ministries",
    "minis.lead": "Formative activities for children, teens, youth, and families in São Mateus.",
    "minis.tag_desbrav": "10 to 15 years",
    "minis.title_desbrav": "Saturn Pathfinder Club",
    "minis.desc_desbrav": "Camping, pioneering, citizenship, survival, and Christian character formation.",
    "minis.btn_desbrav": "Enroll my child",
    "minis.tag_avent": "6 to 9 years",
    "minis.title_avent": "Adventurer Club",
    "minis.desc_avent": "Recreational activities, contact with nature, and strengthening family bonds.",
    "minis.btn_avent": "Enroll my child",
    "minis.tag_artes": "Community",
    "minis.title_artes": "Crafts Course",
    "minis.desc_artes": "Practical painting, sewing, and crafts workshops to promote unity and learning.",
    "minis.btn_artes": "Learn More",
    "minis.tag_asa": "Solidarity",
    "minis.title_asa": "Adventist Solidarity Action (ASA)",
    "minis.desc_asa": "Assistance to vulnerable families with food, clothing, and continuous emotional support.",
    "minis.btn_asa": "I Want to Help",
    "minis.tag_ja": "Music & Youth",
    "minis.title_ja": "Worship and Adventist Youth",
    "minis.desc_ja": "Instrumental team and dynamic faith youth gatherings on Saturday afternoons (JA).",
    "minis.btn_ja": "Join",

    // Remedies
    "remedies.eyebrow": "Healthy Lifestyle",
    "remedies.title": "God's 8 Natural Remedies",
    "remedies.lead": "Proven principles of holistic health promoted by the Adventist Church worldwide.",
    "remedies.r1": "Pure Water",
    "remedies.r1_desc": "Drink plenty of pure water to hydrate cells and purify the body.",
    "remedies.r2": "Fresh Air",
    "remedies.r2_desc": "Deep oxygenation in contact with green areas for mental clarity.",
    "remedies.r3": "Sunlight",
    "remedies.r3_desc": "Vitamin D activation, immune strengthening, and well-being.",
    "remedies.r4": "Exercise",
    "remedies.r4_desc": "Regular walks to strengthen the heart and body.",
    "remedies.r5": "Rest",
    "remedies.r5_desc": "Quality sleep and weekly rest on the sacred Sabbath.",
    "remedies.r6": "Nutrition",
    "remedies.r6_desc": "Whole foods, fruits, and vegetables, reducing ultra-processed foods.",
    "remedies.r7": "Temperance",
    "remedies.r7_desc": "Balance in work and abstinence from harmful substances.",
    "remedies.r8": "Trust in God",
    "remedies.r8_desc": "Faith and prayer that bring inner peace in tribulations.",

    // Marcos
    "marcos.eyebrow": "Foundations and Documents",
    "marcos.title": "Official References",
    "marcos.lead": "Documents of the Seventh-day Adventist Church for study and public consultation.",
    "marcos.link1": "28 Fundamental Beliefs",
    "marcos.link1_desc": "Biblical pillars of the Adventist faith",
    "marcos.link2": "Church Manual",
    "marcos.link2_desc": "Official rules and procedures",
    "marcos.link3": "Adventist News Network (ANN)",
    "marcos.link3_desc": "Bulletins from the world church",
    "marcos.link4": "São Paulo East Conference",
    "marcos.link4_desc": "Regional headquarters of congregations",
"""

with open('/home/felipe/mycodes/igreja/js/locales.js', 'r') as f:
    content = f.read()

# insert PT before the end of the PT block
pt_insertion_point = '    "footer.nav": "Navegação",'
content = content.replace(pt_insertion_point, pt_additions + pt_insertion_point)

# insert EN before the end of the EN block
en_insertion_point = '    "footer.nav": "Navigation",'
content = content.replace(en_insertion_point, en_additions + en_insertion_point)

with open('/home/felipe/mycodes/igreja/js/locales.js', 'w') as f:
    f.write(content)

print("Translations successfully injected.")
