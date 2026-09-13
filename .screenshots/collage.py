import os
import glob
from PIL import Image, ImageDraw, ImageFont
import math

# Get the 36 screenshots
folder = '/home/felipe/mycodes/igreja/.screenshots/to_sort'
files = sorted(glob.glob(os.path.join(folder, '*.png')))

if not files:
    print("No files found!")
    exit(1)

# We want to make a grid. 36 images = 6x6 grid.
num_files = len(files)
cols = 6
rows = math.ceil(num_files / cols)

# Target size for each thumbnail
thumb_width = 400
thumb_height = 800

# Total collage size
collage_width = cols * thumb_width
collage_height = rows * thumb_height

collage = Image.new('RGB', (collage_width, collage_height), color='black')

# Try to use a default font, otherwise default to basic
try:
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
except:
    font = ImageFont.load_default()

for i, filepath in enumerate(files):
    try:
        img = Image.open(filepath)
        # Resize/crop to thumbnail size while maintaining aspect ratio
        img.thumbnail((thumb_width, thumb_height), Image.Resampling.LANCZOS)
        
        # Center the thumbnail in its grid cell
        x_offset = (i % cols) * thumb_width + (thumb_width - img.width) // 2
        y_offset = (i // cols) * thumb_height + (thumb_height - img.height) // 2
        
        # Paste image
        collage.paste(img, (x_offset, y_offset))
        
        # Draw a big red rectangle with the number on top left
        draw = ImageDraw.Draw(collage)
        text = str(i + 1)
        # Draw red box
        box_x = (i % cols) * thumb_width
        box_y = (i // cols) * thumb_height
        draw.rectangle([box_x, box_y, box_x + 100, box_y + 100], fill="red")
        # Draw text
        draw.text((box_x + 20, box_y + 20), text, fill="white", font=font)
        
    except Exception as e:
        print(f"Error processing {filepath}: {e}")

output_path = '/home/felipe/mycodes/igreja/.screenshots/collage.png'
collage.save(output_path)
print(f"Collage saved to {output_path} with {num_files} images.")
