import os

for root, _, files in os.walk('.'):
    if any(ignored in root for ignored in ('.git', '.user_uploaded', 'dist', 'node_modules')):
        continue
    for f in files:
        if f.endswith(('.html', '.css', '.js')):
            path = os.path.join(root, f)
            with open(path, 'r', encoding='utf-8') as file:
                lines = len(file.readlines())
                if lines > 100:
                    print(f"{path}: {lines} lines")
