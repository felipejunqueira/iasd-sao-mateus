import re

with open('partials/21-ministries.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Try to find all ministry cards
cards = re.split(r'class="ministry-card"', content)[1:]

data = []
for card in cards:
    img_match = re.search(r'<img[^>]+src="([^"]+)"', card)
    title_match = re.search(r'<h3[^>]+data-i18n="([^"]+)"[^>]*>(.*?)</h3>', card)
    # The leader name is usually the div after the strong tag, but it's simpler to just grab the raw name
    leader_match = re.search(r'<div style="font-weight: 600;[^>]*>(.*?)</div>', card)
    
    if img_match and title_match and leader_match:
        img_src = img_match.group(1)
        title_key = title_match.group(1)
        title_text = title_match.group(2)
        leader = leader_match.group(1)
        data.append({
            'img': img_src,
            'title': title_text,
            'leader': leader
        })

markdown = "# Auditoria dos Ministérios\n\nVerifique se a imagem corresponde ao ministério correto.\n\n"
markdown += "| Imagem | Ministério | Líder(es) |\n|---|---|---|\n"

for item in data:
    img_url = item['img']
    # if it's relative, we need to make it absolute or just use the github pages link if we can't embed it,
    # wait, the artifact viewer can read absolute paths on the file system!
    abs_img_path = f"/home/felipe/mycodes/igreja/{img_url}"
    markdown += f"| ![{item['title']}]({abs_img_path}) | **{item['title']}** | {item['leader']} |\n"

with open('/home/felipe/.gemini/antigravity-ide/brain/230e6747-d994-4941-96ab-e2b3a3eb4f9c/ministries_audit.md', 'w') as f:
    f.write(markdown)
