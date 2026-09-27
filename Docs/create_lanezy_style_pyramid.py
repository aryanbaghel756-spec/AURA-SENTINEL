import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

out_desktop = r"C:\Users\aryan\OneDrive\Desktop\aura_pyramid_cyber.png"
out_assets = r"C:\Users\aryan\OneDrive\Desktop\Aura\Docs\assets\aura_pyramid_cyber.png"

# Canvas dimensions (High-Res 3000x2500)
W, H = 3000, 2500
img = Image.new("RGBA", (W, H), (0, 0, 0, 0)) # Transparent background
draw = ImageDraw.Draw(img)

# Load fonts safely
def get_font(size, bold=False):
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

font_apex_title = get_font(34, bold=True)
font_apex_sub = get_font(20, bold=False)

font_tier_hdr = get_font(23, bold=True)

font_title_t2 = get_font(26, bold=True)
font_sub_t2 = get_font(19, bold=False)

font_title_t3 = get_font(24, bold=True)
font_sub_t3 = get_font(18, bold=False)

font_title_t4 = get_font(22, bold=True)
font_sub_t4 = get_font(17, bold=False)

# Pyramid Geometry
top_x, top_y = W // 2, 90
base_y = 2340
base_half_w = 1320

y_cuts = [90, 680, 1220, 1750, 2340]

def get_x_bounds(y):
    t = (y - top_y) / (base_y - top_y)
    hw = t * base_half_w
    return top_x - hw, top_x + hw

col_t1_bg = "#0B172E"
col_t1_border = "#0284C7"

col_t2_bg = "#0E2954"
col_t2_border = "#0284C7"

col_t3_bg = "#0B3C2D"
col_t3_border = "#10B981"

col_t4_bg = "#121E36"
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

# 2. DRAW DIAGONAL CYBER HAZARD STRIPES
stripe_w = 46
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
        
        col = "#22D3EE" if (s_idx % 2 == 0) else "#0B1220"
        
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
    col = "#22D3EE" if (b_idx % 2 == 0) else "#0B1220"
    pts = [(x1, base_y), (x2, base_y), (x2 + 22, base_y + 40), (x1 + 22, base_y + 40)]
    draw.polygon(pts, fill=col, outline="#0284C7")

# -------------------------------------------------------------
# CONTENT RENDERING (Guaranteed Zero Overflow)
# -------------------------------------------------------------

# --- TIER 1: CORE INNOVATION (APEX) ---
# Decorative top cyber cap (Y: 100 to 190)
draw.polygon([(top_x, top_y + 15), (top_x + 28, top_y + 60), (top_x - 28, top_y + 60)], fill="#0284C7")
draw.ellipse([top_x - 12, top_y + 40, top_x + 12, top_y + 64], fill="#22D3EE")

# Header Pill (Y = 270)
draw.rounded_rectangle([W//2 - 95, 252, W//2 + 95, 290], radius=10, fill="#0284C7")
draw.text((W//2, 271), "CORE INNOVATION", fill="#FFFFFF", font=get_font(16, bold=True), anchor="mm")

# Shield Icon (Y = 328)
icon_y = 328
draw.ellipse([W//2 - 20, icon_y - 20, W//2 + 20, icon_y + 20], fill="#1E293B", outline="#22D3EE", width=2)
draw.polygon([(W//2, icon_y - 10), (W//2 + 9, icon_y - 3), (W//2 + 7, icon_y + 8), (W//2, icon_y + 12), (W//2 - 7, icon_y + 8), (W//2 - 9, icon_y - 3)], fill="#22D3EE")

# Compact Main Title
draw.text((W//2, 380), "ACTUARIAL", fill="#38BDF8", font=get_font(26, bold=True), anchor="mm")
draw.text((W//2, 425), "VaR RISK ENGINE", fill="#FFFFFF", font=get_font(34, bold=True), anchor="mm")

# Technical Subtitles
draw.text((W//2, 495), "Open Group FAIR Model", fill="#38BDF8", font=get_font(19, bold=True), anchor="mm")
draw.text((W//2, 535), "10,000 Monte Carlo Paths", fill="#CBD5E1", font=get_font(18, bold=False), anchor="mm")
draw.text((W//2, 585), "Translates CVEs to ₹ Crores Loss", fill="#F8FAFC", font=get_font(20, bold=True), anchor="mm")

draw.line([get_x_bounds(680)[0], 680, get_x_bounds(680)[1], 680], fill="#38BDF8", width=5)

# --- TIER 2: PRIMARY FUNCTIONS (2 COLUMNS) ---
draw.rounded_rectangle([W//2 - 180, 705, W//2 + 180, 755], radius=12, fill="#0284C7")
draw.text((W//2, 730), "PRIMARY FUNCTIONS", fill="#FFFFFF", font=font_tier_hdr, anchor="mm")

draw.line([W//2, 770, W//2, 1205], fill="#0284C7", width=3)

# Column 1 (Left): Attack Surface
c1_cx = (get_x_bounds(950)[0] + W//2) // 2 + 15
r_y = 825
draw.ellipse([c1_cx - 26, r_y - 26, c1_cx + 26, r_y + 26], fill="#071326", outline="#38BDF8", width=2)
draw.ellipse([c1_cx - 14, r_y - 14, c1_cx + 14, r_y + 14], outline="#22D3EE", width=2)
draw.ellipse([c1_cx - 4, r_y - 4, c1_cx + 4, r_y + 4], fill="#22D3EE")

draw.text((c1_cx, 895), "ATTACK SURFACE DISCOVERY", fill="#38BDF8", font=font_title_t2, anchor="mm")
draw.text((c1_cx, 935), "(Continuous Agentless Ingestion)", fill="#94A3B8", font=font_sub_t2, anchor="mm")

draw.text((c1_cx, 1005), "• Real-time OS telemetry (CPU, RAM, Disks)", fill="#F1F5F9", font=font_sub_t2, anchor="mm")
draw.text((c1_cx, 1055), "• Network sockets & open ports (22, 3389, 445)", fill="#E2E8F0", font=font_sub_t2, anchor="mm")
draw.text((c1_cx, 1105), "• Automated CVE vulnerability threat mapping", fill="#CBD5E1", font=font_sub_t2, anchor="mm")

# Column 2 (Right): Knapsack Optimizer
c2_cx = (W//2 + get_x_bounds(950)[1]) // 2 - 15
k_y = 825
draw.ellipse([c2_cx - 26, k_y - 26, c2_cx + 26, k_y + 26], fill="#1F1300", outline="#F59E0B", width=2)
draw.rectangle([c2_cx - 16, k_y + 4, c2_cx - 8, k_y + 16], fill="#F59E0B")
draw.rectangle([c2_cx - 4, k_y - 4, c2_cx + 4, k_y + 16], fill="#FBBF24")
draw.rectangle([c2_cx + 8, k_y - 14, c2_cx + 16, k_y + 16], fill="#FDE68A")

draw.text((c2_cx, 895), "0/1 KNAPSACK BUDGET OPTIMIZER", fill="#F59E0B", font=font_title_t2, anchor="mm")
draw.text((c2_cx, 935), "(Dynamic Programming Capital ROI)", fill="#94A3B8", font=font_sub_t2, anchor="mm")

draw.text((c2_cx, 1005), "• Multi-constraint bounded capital allocation", fill="#F1F5F9", font=font_sub_t2, anchor="mm")
draw.text((c2_cx, 1055), "• Maximizes security risk reduction per ₹ spent", fill="#E2E8F0", font=font_sub_t2, anchor="mm")
draw.text((c2_cx, 1105), "• Generates defensible ROI metrics for CFO & board", fill="#CBD5E1", font=font_sub_t2, anchor="mm")

draw.line([get_x_bounds(1220)[0], 1220, get_x_bounds(1220)[1], 1220], fill="#10B981", width=5)

# --- TIER 3: TRUST, SAFETY & COMPLIANCE (3 COLUMNS) ---
draw.rounded_rectangle([W//2 - 240, 1245, W//2 + 240, 1295], radius=12, fill="#059669")
draw.text((W//2, 1270), "TRUST, SAFETY & COMPLIANCE", fill="#FFFFFF", font=font_tier_hdr, anchor="mm")

xl3, xr3 = get_x_bounds(1480)
w3 = xr3 - xl3
div1_x = xl3 + w3 * 0.33
div2_x = xl3 + w3 * 0.67

draw.line([div1_x, 1315, div1_x, 1730], fill="#059669", width=2)
draw.line([div2_x, 1315, div2_x, 1730], fill="#059669", width=2)

# Col 1: Blockchain Merkle Audit
c3_1_x = (xl3 + div1_x) // 2 + 10
draw.ellipse([c3_1_x - 24, 1365 - 24, c3_1_x + 24, 1365 + 24], fill="#064E3B", outline="#34D399", width=2)
draw.text((c3_1_x, 1365), "#", fill="#34D399", font=get_font(24, bold=True), anchor="mm")

draw.text((c3_1_x, 1425), "MERKLE AUDIT LEDGER", fill="#34D399", font=font_title_t3, anchor="mm")
draw.text((c3_1_x, 1465), "Cryptographic Trust Anchor", fill="#A7F3D0", font=font_sub_t3, anchor="mm")
draw.text((c3_1_x, 1535), "• SHA-256 Merkle Hash Tree", fill="#F1F5F9", font=font_sub_t3, anchor="mm")
draw.text((c3_1_x, 1585), "• Tamper-evident state anchoring", fill="#E2E8F0", font=font_sub_t3, anchor="mm")
draw.text((c3_1_x, 1635), "• CERT-In 180-day compliance", fill="#94A3B8", font=font_sub_t3, anchor="mm")

# Col 2: DPDP Act 2023 Safeguards
c3_2_x = W // 2
draw.ellipse([c3_2_x - 24, 1365 - 24, c3_2_x + 24, 1365 + 24], fill="#451A03", outline="#FBBF24", width=2)
draw.text((c3_2_x, 1365), "§", fill="#FBBF24", font=get_font(24, bold=True), anchor="mm")

draw.text((c3_2_x, 1425), "DPDP ACT 2023 SAFEGUARD", fill="#FBBF24", font=font_title_t3, anchor="mm")
draw.text((c3_2_x, 1465), "Statutory Data Protection", fill="#FDE68A", font=font_sub_t3, anchor="mm")
draw.text((c3_2_x, 1535), "• Personal data breach defense", fill="#F1F5F9", font=font_sub_t3, anchor="mm")
draw.text((c3_2_x, 1585), "• Exposed secret/credential hunter", fill="#E2E8F0", font=font_sub_t3, anchor="mm")
draw.text((c3_2_x, 1635), "• Prevents ₹250 Cr statutory fines", fill="#94A3B8", font=font_sub_t3, anchor="mm")

# Col 3: Zero-Trust Presence Lock
c3_3_x = (div2_x + xr3) // 2 - 10
draw.ellipse([c3_3_x - 24, 1365 - 24, c3_3_x + 24, 1365 + 24], fill="#2E1065", outline="#A78BFA", width=2)
draw.text((c3_3_x, 1365), "AI", fill="#A78BFA", font=get_font(20, bold=True), anchor="mm")

draw.text((c3_3_x, 1425), "ZERO-TRUST PRESENCE LOCK", fill="#A78BFA", font=font_title_t3, anchor="mm")
draw.text((c3_3_x, 1465), "Physical SOC Console Security", fill="#DDD6FE", font=font_sub_t3, anchor="mm")
draw.text((c3_3_x, 1535), "• YOLOv8 computer vision model", fill="#F1F5F9", font=font_sub_t3, anchor="mm")
draw.text((c3_3_x, 1585), "• Continuous operator tracking", fill="#E2E8F0", font=font_sub_t3, anchor="mm")
draw.text((c3_3_x, 1635), "• Instant auto-lock on walkaway", fill="#94A3B8", font=font_sub_t3, anchor="mm")

draw.line([get_x_bounds(1750)[0], 1750, get_x_bounds(1750)[1], 1750], fill="#38BDF8", width=5)

# --- TIER 4: SOC MONITORING & UTILITIES (5 COLUMNS) ---
draw.rounded_rectangle([W//2 - 240, 1775, W//2 + 240, 1825], radius=12, fill="#0284C7")
draw.text((W//2, 1800), "SOC MONITORING & UTILITIES", fill="#FFFFFF", font=font_tier_hdr, anchor="mm")

xl4, xr4 = get_x_bounds(2040)
w4 = xr4 - xl4
col_w = w4 / 5.0

boxes = [
    ("PORT INSPECTOR", "Active Sockets", "Maps listening ports &\nflags RDP, SSH, SMB"),
    ("CREDENTIAL SCANNER", "Token Hunter", "Scans drives for exposed\n.env, API keys & secrets"),
    ("QUARANTINE VAULT", "Encrypted Sandbox", "Instantly isolates malware\n& threats from system"),
    ("WHAT-IF SIMULATOR", "Threat Scenarios", "Simulates cyber breaches\n& tests defense plans"),
    ("AI SOC COPILOT", "Groq Intelligence", "Plain-English explanation\n& incident response guide")
]

for b_idx, (b_title, b_sub, b_desc) in enumerate(boxes):
    bx_left = xl4 + b_idx * col_w
    bx_right = bx_left + col_w
    bx_center = (bx_left + bx_right) / 2.0
    
    if b_idx > 0:
        draw.line([bx_left, 1845, bx_left, 2300], fill="#1E3A8A", width=2)
        
    draw.ellipse([bx_center - 20, 1890 - 20, bx_center + 20, 1890 + 20], fill="#0A1832", outline="#38BDF8", width=2)
    draw.text((bx_center, 1890), str(b_idx + 1), fill="#38BDF8", font=get_font(20, bold=True), anchor="mm")
    
    draw.text((bx_center, 1955), b_title, fill="#38BDF8", font=font_title_t4, anchor="mm")
    draw.text((bx_center, 1995), b_sub, fill="#F59E0B", font=get_font(18, bold=True), anchor="mm")
    
    lines = b_desc.split('\n')
    draw.text((bx_center, 2075), lines[0], fill="#FFFFFF", font=font_sub_t4, anchor="mm")
    if len(lines) > 1:
        draw.text((bx_center, 2115), lines[1], fill="#94A3B8", font=font_sub_t4, anchor="mm")

# Save high-res PNG
img.save(out_desktop, "PNG")
img.save(out_assets, "PNG")
# Also update duplicate convenience file
dup_path = r"C:\Users\aryan\OneDrive\Desktop\AURA_PYRAMID_SLIDE2.png"
img.save(dup_path, "PNG")
print("Saved 100% overflow-free aura_pyramid_cyber.png!")
