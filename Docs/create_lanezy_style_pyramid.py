import os
import sys
from PIL import Image, ImageDraw, ImageFont

out_desktop = r"C:\Users\aryan\OneDrive\Desktop\aura_pyramid_cyber.png"
out_assets = r"C:\Users\aryan\OneDrive\Desktop\Aura\Docs\assets\aura_pyramid_cyber.png"
dup_path = r"C:\Users\aryan\OneDrive\Desktop\AURA_PYRAMID_SLIDE2.png"

# Canvas dimensions
W, H = 3000, 2600
img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

def get_font(size, bold=True):
    font_names = [
        "segoeuib.ttf" if bold else "segoeui.ttf",
        "arialbd.ttf" if bold else "arial.ttf",
        "calibrib.ttf" if bold else "calibri.ttf"
    ]
    for fn in font_names:
        try:
            return ImageFont.truetype(fn, size)
        except:
            pass
    return ImageFont.load_default()

# -------------------------------------------------------------
# HIGH READABILITY BOLD FONTS (Enlarged for Maximum PPT Clarity)
# -------------------------------------------------------------
# Tier 1 (Apex)
font_apex_pill   = get_font(24, bold=True)
font_apex_t1     = get_font(38, bold=True)
font_apex_t2     = get_font(48, bold=True)
font_apex_t3     = get_font(58, bold=True)
font_apex_sub1   = get_font(30, bold=True)
font_apex_sub2   = get_font(28, bold=True)
font_apex_sub3   = get_font(30, bold=True)

# Tier Header Pills
font_tier_hdr    = get_font(32, bold=True)

# Tier 2
font_t2_title    = get_font(42, bold=True)
font_t2_sub      = get_font(26, bold=True)
font_t2_bullet   = get_font(28, bold=True)

# Tier 3
font_t3_title    = get_font(36, bold=True)
font_t3_sub      = get_font(26, bold=True)
font_t3_bullet   = get_font(28, bold=True)

# Tier 4
font_t4_num      = get_font(28, bold=True)
font_t4_title    = get_font(34, bold=True)
font_t4_sub      = get_font(28, bold=True)
font_t4_desc     = get_font(26, bold=True)

# Pyramid Geometry
top_x, top_y = W // 2, 70
base_y = 2440
base_half_w = 1400

y_cuts = [70, 710, 1260, 1810, 2440]

def get_x_bounds(y):
    t = (y - top_y) / (base_y - top_y)
    hw = t * base_half_w
    return top_x - hw, top_x + hw

col_t1_bg = "#0A172E"
col_t1_border = "#0284C7"

col_t2_bg = "#0B2246"
col_t2_border = "#0284C7"

col_t3_bg = "#083326"
col_t3_border = "#10B981"

col_t4_bg = "#0E1A32"
col_t4_border = "#38BDF8"

tier_colors = [
    (col_t1_bg, col_t1_border),
    (col_t2_bg, col_t2_border),
    (col_t3_bg, col_t3_border),
    (col_t4_bg, col_t4_border)
]

# 1. DRAW TIER TRAPEZOIDS
for i in range(4):
    y_top = y_cuts[i]
    y_bot = y_cuts[i+1]
    xl_top, xr_top = get_x_bounds(y_top)
    xl_bot, xr_bot = get_x_bounds(y_bot)
    
    bg_col, border_col = tier_colors[i]
    
    if i == 0:
        pts = [(top_x, top_y), (xr_bot, y_bot), (xl_bot, y_bot)]
    else:
        pts = [(xl_top, y_top), (xr_top, y_top), (xr_bot, y_bot), (xl_bot, y_bot)]
        
    draw.polygon(pts, fill=bg_col, outline=border_col)

# 2. DRAW DIAGONAL CYBER HAZARD STRIPES (Black & Neon Cyan)
stripe_w = 50
num_stripes = 52
for side in [-1, 1]:
    for s_idx in range(num_stripes):
        t1 = s_idx / num_stripes
        t2 = (s_idx + 1) / num_stripes
        y1 = top_y + t1 * (base_y - top_y)
        y2 = top_y + t2 * (base_y - top_y)
        
        xl1, xr1 = get_x_bounds(y1)
        xl2, xr2 = get_x_bounds(y2)
        
        edge_x1 = xr1 if side == 1 else xl1
        edge_x2 = xr2 if side == 1 else xl2
        
        col = "#22D3EE" if (s_idx % 2 == 0) else "#060D18"
        
        pts = [
            (edge_x1, y1),
            (edge_x1 + side * stripe_w, y1),
            (edge_x2 + side * stripe_w, y2),
            (edge_x2, y2)
        ]
        draw.polygon(pts, fill=col, outline="#0284C7")

# Bottom Hazard bar
b_count = 56
b_start_x = top_x - base_half_w - stripe_w
b_w = (base_half_w * 2 + stripe_w * 2) / b_count
for b_idx in range(b_count):
    x1 = b_start_x + b_idx * b_w
    x2 = x1 + b_w
    col = "#22D3EE" if (b_idx % 2 == 0) else "#060D18"
    pts = [(x1, base_y), (x2, base_y), (x2 + 24, base_y + 46), (x1 + 24, base_y + 46)]
    draw.polygon(pts, fill=col, outline="#0284C7")

# -------------------------------------------------------------
# CONTENT RENDERING (Guaranteed Zero Overlap + Large Fonts)
# -------------------------------------------------------------

# --- TIER 1: CORE INNOVATION (APEX) ---
# Decorative top cyber pinnacle
draw.polygon([(top_x, top_y + 12), (top_x + 28, top_y + 62), (top_x - 28, top_y + 62)], fill="#0284C7")
draw.ellipse([top_x - 14, top_y + 36, top_x + 14, top_y + 64], fill="#22D3EE")

# Cyber Emblem (Lock/Shield) at Y = 210
emblem_y = 210
draw.ellipse([top_x - 30, emblem_y - 30, top_x + 30, emblem_y + 30], fill="#08203E", outline="#38BDF8", width=3)
draw.polygon([(top_x, emblem_y - 16), (top_x + 16, emblem_y - 6), (top_x + 12, emblem_y + 12), (top_x, emblem_y + 20), (top_x - 12, emblem_y + 12), (top_x - 16, emblem_y - 6)], fill="#22D3EE")

# Pill: CORE INNOVATION (Y = 300..344, Width = 230)
draw.rounded_rectangle([W//2 - 115, 300, W//2 + 115, 344], radius=12, fill="#0284C7", outline="#38BDF8", width=2)
draw.text((W//2, 322), "CORE INNOVATION", fill="#FFFFFF", font=font_apex_pill, anchor="mm")

# Large Bold Titles - Perfectly shaped into the pyramid slope!
draw.text((W//2, 395), "ACTUARIAL", fill="#38BDF8", font=font_apex_t1, anchor="mm")
draw.text((W//2, 455), "FINANCIAL VaR", fill="#38BDF8", font=font_apex_t2, anchor="mm")
draw.text((W//2, 520), "RISK ENGINE", fill="#FFFFFF", font=font_apex_t3, anchor="mm")

# Technical Proof Points (High-Contrast, Prominent, Inside Geometry)
draw.text((W//2, 580), "• Open Group FAIR Model (O-RT)", fill="#38BDF8", font=font_apex_sub1, anchor="mm")
draw.text((W//2, 630), "• Vectorized 10,000 Monte Carlo Paths", fill="#FFFFFF", font=font_apex_sub2, anchor="mm")
draw.text((W//2, 675), "• Quantifies Risk into ₹ Crores Loss", fill="#FBBF24", font=font_apex_sub3, anchor="mm")

draw.line([get_x_bounds(710)[0], 710, get_x_bounds(710)[1], 710], fill="#38BDF8", width=6)

# --- TIER 2: PRIMARY FUNCTIONS (2 COLUMNS) ---
# Header Pill
draw.rounded_rectangle([W//2 - 210, 735, W//2 + 210, 795], radius=14, fill="#0284C7", outline="#38BDF8", width=2)
draw.text((W//2, 765), "PRIMARY FUNCTIONS", fill="#FFFFFF", font=font_tier_hdr, anchor="mm")

draw.line([W//2, 810, W//2, 1245], fill="#0284C7", width=3)

# Column 1 (Left): Attack Surface Discovery
c1_cx = 1180
r_y = 855
draw.ellipse([c1_cx - 30, r_y - 30, c1_cx + 30, r_y + 30], fill="#05152D", outline="#38BDF8", width=3)
draw.ellipse([c1_cx - 16, r_y - 16, c1_cx + 16, r_y + 16], outline="#22D3EE", width=2)
draw.ellipse([c1_cx - 6, r_y - 6, c1_cx + 6, r_y + 6], fill="#22D3EE")

draw.text((c1_cx, 920), "ATTACK SURFACE", fill="#38BDF8", font=font_t2_title, anchor="mm")
draw.text((c1_cx, 965), "DISCOVERY", fill="#FFFFFF", font=font_t2_title, anchor="mm")
draw.text((c1_cx, 1012), "(Continuous Host Telemetry)", fill="#7DD3FC", font=font_t2_sub, anchor="mm")

draw.text((c1_cx, 1075), "• Live Open Port & Socket Tracking", fill="#FFFFFF", font=font_t2_bullet, anchor="mm")
draw.text((c1_cx, 1125), "• Automated CVE Telemetry Ingestion", fill="#FFFFFF", font=font_t2_bullet, anchor="mm")
draw.text((c1_cx, 1175), "• Real-Time Threat Feed Mapping", fill="#FFFFFF", font=font_t2_bullet, anchor="mm")

# Column 2 (Right): Knapsack Optimizer
c2_cx = 1820
k_y = 855
draw.ellipse([c2_cx - 30, k_y - 30, c2_cx + 30, k_y + 30], fill="#261700", outline="#F59E0B", width=3)
draw.rectangle([c2_cx - 18, k_y + 2, c2_cx - 9, k_y + 16], fill="#F59E0B")
draw.rectangle([c2_cx - 5, k_y - 8, c2_cx + 5, k_y + 16], fill="#FBBF24")
draw.rectangle([c2_cx + 9, k_y - 16, c2_cx + 18, k_y + 16], fill="#FDE68A")

draw.text((c2_cx, 920), "0/1 KNAPSACK", fill="#F59E0B", font=font_t2_title, anchor="mm")
draw.text((c2_cx, 965), "BUDGET OPTIMIZER", fill="#FFFFFF", font=font_t2_title, anchor="mm")
draw.text((c2_cx, 1012), "(Dynamic Capital ROI Logic)", fill="#FDE68A", font=font_t2_sub, anchor="mm")

draw.text((c2_cx, 1075), "• Bounded Multi-Constraint Logic", fill="#FFFFFF", font=font_t2_bullet, anchor="mm")
draw.text((c2_cx, 1125), "• Max Risk Reduction per ₹ Invested", fill="#FFFFFF", font=font_t2_bullet, anchor="mm")
draw.text((c2_cx, 1175), "• Defensible C-Suite ROI Metrics", fill="#FFFFFF", font=font_t2_bullet, anchor="mm")

draw.line([get_x_bounds(1260)[0], 1260, get_x_bounds(1260)[1], 1260], fill="#10B981", width=6)

# --- TIER 3: TRUST, SAFETY & COMPLIANCE (3 COLUMNS) ---
# Header Pill
draw.rounded_rectangle([W//2 - 270, 1285, W//2 + 270, 1345], radius=14, fill="#059669", outline="#34D399", width=2)
draw.text((W//2, 1315), "TRUST, SAFETY & COMPLIANCE", fill="#FFFFFF", font=font_tier_hdr, anchor="mm")

xl3, xr3 = get_x_bounds(1530)
w3 = xr3 - xl3
div1_x = xl3 + w3 * 0.33
div2_x = xl3 + w3 * 0.67

draw.line([div1_x, 1365, div1_x, 1790], fill="#059669", width=2)
draw.line([div2_x, 1365, div2_x, 1790], fill="#059669", width=2)

# Col 1: Blockchain Merkle Audit
c3_1_x = (xl3 + div1_x) // 2 + 10
draw.ellipse([c3_1_x - 26, 1405 - 26, c3_1_x + 26, 1405 + 26], fill="#042F22", outline="#34D399", width=2)
draw.text((c3_1_x, 1405), "#", fill="#34D399", font=get_font(28, bold=True), anchor="mm")

draw.text((c3_1_x, 1465), "MERKLE AUDIT", fill="#34D399", font=font_t3_title, anchor="mm")
draw.text((c3_1_x, 1505), "LEDGER", fill="#FFFFFF", font=font_t3_title, anchor="mm")
draw.text((c3_1_x, 1545), "(Cryptographic Trust)", fill="#A7F3D0", font=font_t3_sub, anchor="mm")

draw.text((c3_1_x, 1610), "• SHA-256 Merkle Tree", fill="#FFFFFF", font=font_t3_bullet, anchor="mm")
draw.text((c3_1_x, 1660), "• Tamper-Evident State Logs", fill="#FFFFFF", font=font_t3_bullet, anchor="mm")
draw.text((c3_1_x, 1710), "• CERT-In 180-Day Rule", fill="#A7F3D0", font=font_t3_bullet, anchor="mm")

# Col 2: DPDP Act 2023 Safeguards
c3_2_x = W // 2
draw.ellipse([c3_2_x - 26, 1405 - 26, c3_2_x + 26, 1405 + 26], fill="#381502", outline="#FBBF24", width=2)
draw.text((c3_2_x, 1405), "§", fill="#FBBF24", font=get_font(28, bold=True), anchor="mm")

draw.text((c3_2_x, 1465), "DPDP ACT 2023", fill="#FBBF24", font=font_t3_title, anchor="mm")
draw.text((c3_2_x, 1505), "SAFEGUARDS", fill="#FFFFFF", font=font_t3_title, anchor="mm")
draw.text((c3_2_x, 1545), "(Statutory Data Defense)", fill="#FDE68A", font=font_t3_sub, anchor="mm")

draw.text((c3_2_x, 1610), "• Personal Data Leak Shield", fill="#FFFFFF", font=font_t3_bullet, anchor="mm")
draw.text((c3_2_x, 1660), "• Secret & Token Hunter", fill="#FFFFFF", font=font_t3_bullet, anchor="mm")
draw.text((c3_2_x, 1710), "• Prevents ₹250 Cr Fines", fill="#FDE68A", font=font_t3_bullet, anchor="mm")

# Col 3: Zero-Trust Presence Lock
c3_3_x = (div2_x + xr3) // 2 - 10
draw.ellipse([c3_3_x - 26, 1405 - 26, c3_3_x + 26, 1405 + 26], fill="#230B4E", outline="#A78BFA", width=2)
draw.text((c3_3_x, 1405), "AI", fill="#A78BFA", font=get_font(24, bold=True), anchor="mm")

draw.text((c3_3_x, 1465), "ZERO-TRUST", fill="#A78BFA", font=font_t3_title, anchor="mm")
draw.text((c3_3_x, 1505), "PRESENCE LOCK", fill="#FFFFFF", font=font_t3_title, anchor="mm")
draw.text((c3_3_x, 1545), "(Console Vision Security)", fill="#DDD6FE", font=font_t3_sub, anchor="mm")

draw.text((c3_3_x, 1610), "• YOLOv8 Vision Model", fill="#FFFFFF", font=font_t3_bullet, anchor="mm")
draw.text((c3_3_x, 1660), "• Continuous Operator Track", fill="#FFFFFF", font=font_t3_bullet, anchor="mm")
draw.text((c3_3_x, 1710), "• Auto-Lock on Walkaway", fill="#DDD6FE", font=font_t3_bullet, anchor="mm")

draw.line([get_x_bounds(1810)[0], 1810, get_x_bounds(1810)[1], 1810], fill="#38BDF8", width=6)

# --- TIER 4: SOC MONITORING & UTILITIES (5 COLUMNS) ---
# Header Pill
draw.rounded_rectangle([W//2 - 270, 1835, W//2 + 270, 1895], radius=14, fill="#0284C7", outline="#38BDF8", width=2)
draw.text((W//2, 1865), "SOC MONITORING & UTILITIES", fill="#FFFFFF", font=font_tier_hdr, anchor="mm")

xl4, xr4 = get_x_bounds(2120)
w4 = xr4 - xl4
col_w = w4 / 5.0

boxes = [
    ("PORT INSPECTOR", "Active Sockets", "Maps open ports &\nflags RDP, SSH, SMB"),
    ("CREDENTIAL SCANNER", "Token Hunter", "Scans disk for exposed\n.env, keys & secrets"),
    ("QUARANTINE VAULT", "Encrypted Sandbox", "Instantly isolates\nmalware & threats"),
    ("WHAT-IF SIMULATOR", "Threat Scenarios", "Simulates cyber breaches\n& tests defense plans"),
    ("AI SOC COPILOT", "Groq AI Intelligence", "Plain-English incident\nremediation guidance")
]

for b_idx, (b_title, b_sub, b_desc) in enumerate(boxes):
    bx_left = xl4 + b_idx * col_w
    bx_right = bx_left + col_w
    bx_center = (bx_left + bx_right) / 2.0
    
    if b_idx > 0:
        draw.line([bx_left, 1920, bx_left, 2400], fill="#1E3A8A", width=3)
        
    draw.ellipse([bx_center - 28, 1965 - 28, bx_center + 28, 1965 + 28], fill="#081834", outline="#38BDF8", width=3)
    draw.text((bx_center, 1965), str(b_idx + 1), fill="#38BDF8", font=font_t4_num, anchor="mm")
    
    draw.text((bx_center, 2040), b_title, fill="#38BDF8", font=font_t4_title, anchor="mm")
    draw.text((bx_center, 2090), b_sub, fill="#FBBF24", font=font_t4_sub, anchor="mm")
    
    lines = b_desc.split('\n')
    draw.text((bx_center, 2170), lines[0], fill="#FFFFFF", font=font_t4_desc, anchor="mm")
    if len(lines) > 1:
        draw.text((bx_center, 2215), lines[1], fill="#E2E8F0", font=font_t4_desc, anchor="mm")

# Auto-crop tightly around bounding box
bbox = img.getbbox()
if bbox:
    pad = 20
    crop_box = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(W, bbox[2] + pad),
        min(H, bbox[3] + pad)
    )
    img_cropped = img.crop(crop_box)
else:
    img_cropped = img

img_cropped.save(out_desktop, "PNG")
img_cropped.save(out_assets, "PNG")
img_cropped.save(dup_path, "PNG")
print("Saved final readable, zero-overlap aura_pyramid_cyber.png successfully!")
