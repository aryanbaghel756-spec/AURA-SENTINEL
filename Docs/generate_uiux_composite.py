import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

out_dir = r'C:\Users\aryan\OneDrive\Desktop\Aura\Docs\assets'
shot_overview = r'C:\Users\aryan\OneDrive\Desktop\Aura\Docs\dashboard_screenshots\1_executive_overview.png'
shot_budget = r'C:\Users\aryan\OneDrive\Desktop\Aura\Docs\dashboard_screenshots\2_budget_optimizer.png'

# Create composite dashboard showcase
w, h = 1800, 1000
canvas = Image.new('RGB', (w, h), '#0B1220')
draw = ImageDraw.Draw(canvas)

# Border & background
draw.rounded_rectangle([10, 10, w - 10, h - 10], radius=16, fill='#16213A', outline='#22D3EE', width=3)

# Top Banner
draw.rounded_rectangle([15, 15, w - 15, 80], radius=10, fill='#0B1220', outline='#1F2E4D', width=1)

# Title
try:
    font_lg = ImageFont.truetype("arial.ttf", 28)
    font_md = ImageFont.truetype("arial.ttf", 20)
    font_sm = ImageFont.truetype("arial.ttf", 16)
except:
    font_lg = font_md = font_sm = ImageFont.load_default()

draw.text((35, 32), "AURA SENTINEL // LIVE EXECUTIVE SOC CONSOLE PROTOTYPE", fill='#22D3EE', font=font_lg)
draw.text((w - 360, 36), "● LIVE TELEMETRY STREAM", fill='#10B981', font=font_md)

# Embed Dashboard Screenshot on the left
if os.path.exists(shot_overview):
    im_shot = Image.open(shot_overview)
    # Crop to main interesting part (VaR + Monte Carlo chart)
    # 1920x1080 -> crop top header a bit
    cropped = im_shot.crop((40, 70, 1880, 1040))
    cropped = cropped.resize((1750, 880), Image.Resampling.LANCZOS)
    canvas.paste(cropped, (25, 95))

composite_path = os.path.join(out_dir, 'slide6_uiux_composite.png')
canvas.save(composite_path, quality=95)
print("Saved slide6_uiux_composite.png successfully!")
