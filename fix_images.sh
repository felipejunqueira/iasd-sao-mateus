#!/bin/bash
DIR="/home/felipe/.gemini/antigravity-ide/brain/230e6747-d994-4941-96ab-e2b3a3eb4f9c/.user_uploaded"
DEST="/home/felipe/mycodes/igreja/assets/images"

# Fix previously incorrect mappings
cp "$DIR/media_1789311199929.jpg" "$DEST/clube_saturno.png" 2>/dev/null || cp "$DIR/media_1789311199929.jpg" "$DEST/clube_saturno.jpg"
cp "$DIR/media_1789311229317.png" "$DEST/clube_aventureiros.png"
cp "$DIR/media_1789311273664.png" "$DEST/ministerio_adolescente.png"
cp "$DIR/media_1789311298702.png" "$DEST/asa.png"
cp "$DIR/media_1789311321385.png" "$DEST/ministerio_musica.png"
cp "$DIR/media_1789311406933.png" "$DEST/sonoplastia.png"
cp "$DIR/media_1789311455823.png" "$DEST/comunicacao.png"
cp "$DIR/media_1789311483981.png" "$DEST/ministerio_jovens.png"

# And finally, the new one for Escola Sabatina
cp "$DIR/media_1789311740721.png" "$DEST/escola_sabatina.png"

git add .
git commit -m "Fix mismatched ministry logos and add Escola Sabatina logo"
git push origin main
