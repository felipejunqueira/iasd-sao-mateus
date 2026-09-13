import os
import glob
from PIL import Image, ImageDraw, ImageFont
import math

# Get ALL screenshots not used in the first collage
folder = '/home/felipe/Pictures/Screenshots'
all_files = sorted(glob.glob(os.path.join(folder, '*.png')))

# exclude the 39 we already processed (they start with 2026-09-12 20-4)
files = [f for f in all_files if '2026-09-12 20-4' not in os.path.basename(f)]

if not files:
    print("No files found!")
    exit(1)

num_files = len(files)
cols = 8
rows = math.ceil(num_files / cols)

thumb_width = 300
thumb_height = 600

collage_width = cols * thumb_width
collage_height = rows * thumb_height

collage = Image.new('RGB', (collage_width, collage_height), color='black')

try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 40)
except:
    font = ImageFont.load_default()

for i, filepath in enumerate(files):
    try:
        img = Image.open(filepath)
        img.thumbnail((thumb_width, thumb_height), Image.Resampling.LANCZOS)
        
        x_offset = (i % cols) * thumb_width + (thumb_width - img.width) // 2
        y_offset = (i // cols) * thumb_height + (thumb_height - img.height) // 2
        
        collage.paste(img, (x_offset, y_offset))
        
        draw = ImageDraw.Draw(collage)
        text = str(i + 1)
        
        box_x = (i % cols) * thumb_width
        box_y = (i // cols) * thumb_height
        draw.rectangle([box_x, box_y, box_x + 60, box_y + 60], fill="blue")
        draw.text((box_x + 10, box_y + 10), text, fill="white", font=font)
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

# save a list mapping numbers to filenames
with open('/home/felipe/mycodes/igreja/.screenshots/map2.txt', 'w') as f:
    for i, filepath in enumerate(files):
        f.write(f"{i+1}: {os.path.basename(filepath)}\n")

output_path = '/home/felipe/mycodes/igreja/.screenshots/collage2.png'
collage.save(output_path)
print(f"Collage 2 saved to {output_path} with {num_files} images.")
