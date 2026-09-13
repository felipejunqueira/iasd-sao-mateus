import os
import re

def check_files():
    broken_images = []
    broken_links = []
    
    html_files = []
    for root, _, files in os.walk('.'):
        for f in files:
            if f.endswith('.html'):
                html_files.append(os.path.join(root, f))
                
    for html in html_files:
        with open(html, 'r', encoding='utf-8') as f:
            content = f.read()
            
            # Check images
            images = re.findall(r'src="([^"]+)"', content)
            for img in images:
                if not img.startswith('http') and not img.startswith('data:'):
                    # Local image
                    # Ignore template vars or placeholder strings
                    img_path = os.path.normpath(os.path.join(os.path.dirname(html), img))
                    if not os.path.exists(img_path) and not os.path.exists(img): # fallback to root
                        broken_images.append((html, img))
                        
            # Check links
            links = re.findall(r'href="([^"]+)"', content)
            for link in links:
                if link.startswith('#') and len(link) > 1:
                    # Anchor link inside the same page is hard to test statically for a SPA
                    pass
                elif not link.startswith('http') and not link.startswith('#') and not link.startswith('mailto:'):
                    # Local link
                    link_path = os.path.normpath(os.path.join(os.path.dirname(html), link.split('#')[0]))
                    if link.split('#')[0] and not os.path.exists(link_path) and not os.path.exists(link.split('#')[0]):
                        broken_links.append((html, link))

    print("Broken Images:")
    for html, img in broken_images:
        print(f"  {html}: {img}")
        
    print("\nBroken Links:")
    for html, link in broken_links:
        print(f"  {html}: {link}")

check_files()
