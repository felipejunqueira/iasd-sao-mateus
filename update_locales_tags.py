import os

pt_additions = """
    "lideres.desbrav_phrase": "\\"Salvando do pecado e guiando no serviço.\\"",
    "lideres.asa_phrase": "\\"Amor em ação, transformando vidas na comunidade.\\"",
    "lideres.artes_phrase": "\\"Mãos que criam, corações que se unem.\\"",
    "minis.tag_ancionato": "Administração Espiritual",
    "minis.tag_teens": "Novas Gerações",
    "minis.tag_kids": "Bebês e Crianças",
    "minis.tag_escola": "Ensino Bíblico",
    "minis.tag_mipes": "Missão",
    "minis.tag_mulher": "Comunhão e Ação",
    "minis.tag_saude": "Qualidade de Vida",
    "minis.tag_possib": "Inclusão",
    "minis.tag_musica": "Louvor e Adoração",
    "minis.tag_midia": "Comunicação e Tecnologia",
"""

en_additions = """
    "lideres.desbrav_phrase": "\\"Saving from sin and guiding in service.\\"",
    "lideres.asa_phrase": "\\"Love in action, transforming lives in the community.\\"",
    "lideres.artes_phrase": "\\"Hands that create, hearts that unite.\\"",
    "minis.tag_ancionato": "Spiritual Administration",
    "minis.tag_teens": "New Generations",
    "minis.tag_kids": "Babies and Children",
    "minis.tag_escola": "Bible Teaching",
    "minis.tag_mipes": "Mission",
    "minis.tag_mulher": "Fellowship and Action",
    "minis.tag_saude": "Quality of Life",
    "minis.tag_possib": "Inclusion",
    "minis.tag_musica": "Praise and Worship",
    "minis.tag_midia": "Communication and Tech",
"""

with open('/home/felipe/mycodes/igreja/js/locales.js', 'r') as f:
    content = f.read()

pt_insertion_point = '    "footer.nav": "Navegação",'
content = content.replace(pt_insertion_point, pt_additions + pt_insertion_point)

en_insertion_point = '    "footer.nav": "Navigation",'
content = content.replace(en_insertion_point, en_additions + en_insertion_point)

with open('/home/felipe/mycodes/igreja/js/locales.js', 'w') as f:
    f.write(content)
