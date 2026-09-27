import os
import sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

out_dir = r"C:\Users\aryan\OneDrive\Desktop\Aura\Docs\designer_slides"
os.makedirs(out_dir, exist_ok=True)
assets_dir = r"C:\Users\aryan\OneDrive\Desktop\Aura\Docs\assets"
qr_path = r"C:\Users\aryan\OneDrive\Desktop\Aura\Docs\github_qr.png"
logo_path = r"C:\Users\aryan\OneDrive\Desktop\Aura\Docs\lanezy_extracted_images\p1_img2_384.png"

W, H = 3000, 1688

# Load fonts
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

font_title_lg = get_font(52, bold=True)
font_title_md = get_font(40, bold=True)
font_sub = get_font(26, bold=False)
font_h1 = get_font(32, bold=True)
font_h2 = get_font(26, bold=True)
font_body = get_font(22, bold=False)
font_body_bold = get_font(22, bold=True)
font_body_sm = get_font(19, bold=False)
font_body_sm_bold = get_font(19, bold=True)
font_badge = get_font(17, bold=True)
font_meta_lbl = get_font(25, bold=True)
font_meta_val = get_font(25, bold=False)

def draw_header_footer(draw, img, slide_num, slide_title=""):
    # Official top banner line or clean white bg
    # SIH Logo at top right
    if os.path.exists(logo_path):
        logo_im = Image.open(logo_path).convert("RGBA")
        logo_im = logo_im.resize((360, 180), Image.Resampling.LANCZOS)
        img.paste(logo_im, (W - 400, 25), logo_im if logo_im.mode == "RGBA" else None)

    # Top Left Team Oval (for slides 2-6)
    if slide_num > 1:
        # Team Oval
        draw.ellipse([70, 35, 330, 145], fill='#0F172A', outline='#0284C7', width=3)
        draw.text((200, 70), "ByteForce_1", fill='#FFFFFF', font=get_font(23, bold=True), anchor="mm")
        draw.text((200, 105), "(ID: 180219)", fill='#38BDF8', font=get_font(20, bold=True), anchor="mm")

        # Slide Title
        draw.text((370, 75), slide_title, fill='#0F172A', font=font_title_md, anchor="lm")

    # Bottom bar
    draw.rectangle([0, H - 75, W, H], fill='#0284C7')
    draw.text((W // 2, H - 38), "@SIH Idea submission- Template", fill='#FFFFFF', font=get_font(22, bold=True), anchor="mm")
    draw.text((W - 80, H - 38), str(slide_num), fill='#FFFFFF', font=get_font(24, bold=True), anchor="mm")

# -------------------------------------------------------------
# SLIDE 1: Title Page
# -------------------------------------------------------------
def make_slide_1():
    img = Image.new("RGB", (W, H), "#FFFFFF")
    draw = ImageDraw.Draw(img)

    # Top SIH Header
    draw.text((100, 70), "SMART INDIA HACKATHON 2026", fill='#0284C7', font=font_title_lg)
    draw.line([100, 145, 900, 145], fill='#0284C7', width=4)

    # Official Logo Top Right
    if os.path.exists(logo_path):
        logo_im = Image.open(logo_path).convert("RGBA")
        logo_im = logo_im.resize((420, 210), Image.Resampling.LANCZOS)
        img.paste(logo_im, (W - 480, 40), logo_im if logo_im.mode == "RGBA" else None)

    # Left Metadata Box (Clean card)
    card_x, card_y, card_w, card_h = 100, 210, 1480, 1370
    draw.rounded_rectangle([card_x, card_y, card_x + card_w, card_y + card_h], radius=24, fill='#F8FAFC', outline='#CBD5E1', width=3)

    # Metadata Header Pill
    draw.rounded_rectangle([card_x + 30, card_y + 30, card_x + card_w - 30, card_y + 110], radius=14, fill='#0F172A')
    draw.text((card_x + card_w // 2, card_y + 70), "OFFICIAL IDEA SUBMISSION DOSSIER // SIH26105", fill='#38BDF8', font=get_font(25, bold=True), anchor="mm")

    fields = [
        ("Problem Statement ID:", "SIH26105"),
        ("Problem Statement Title:", "AI-Powered Continuous Cyber Risk Quantification &\nInvestment Optimization Platform"),
        ("Theme:", "Blockchain & Cybersecurity"),
        ("Category:", "Software"),
        ("Team ID:", "180219"),
        ("Team Name:", "ByteForce_1"),
        ("Team Leader:", "Aryan Baghel"),
        ("Team Members:", "Kirti, Hitesh Chauhan, Avinav Jha,\nSharim Khan, Aman Sekh"),
        ("College / Institute:", "Skyline Institute of Engineering and Technology,\nGreater Noida, Uttar Pradesh"),
        ("Ministry / Org:", "AICTE (Cyber Security Cell) & MIC")
    ]

    curr_y = card_y + 145
    for lbl, val in fields:
        draw.text((card_x + 50, curr_y), lbl, fill='#0F172A', font=font_meta_lbl)
        lines = val.split('\n')
        for l_idx, line in enumerate(lines):
            draw.text((card_x + 460, curr_y + (l_idx * 34)), line, fill='#0284C7' if lbl.startswith("Problem Statement ID") else '#1E293B', font=font_meta_val)
        curr_y += max(50, len(lines) * 36 + 18)

    # Right Graphic (High-Res Shield)
    s1_img_path = os.path.join(assets_dir, "slide1_visual.png")
    if os.path.exists(s1_img_path):
        s1_im = Image.open(s1_img_path).convert("RGBA")
        s1_im = s1_im.resize((1240, 1240), Image.Resampling.LANCZOS)
        img.paste(s1_im, (W - 1340, 240), s1_im if s1_im.mode == "RGBA" else None)

    # Bottom bar
    draw.rectangle([0, H - 75, W, H], fill='#0284C7')
    draw.text((W // 2, H - 38), "@SIH Idea submission- Template", fill='#FFFFFF', font=get_font(22, bold=True), anchor="mm")
    draw.text((W - 80, H - 38), "1", fill='#FFFFFF', font=get_font(24, bold=True), anchor="mm")

    path = os.path.join(out_dir, "slide_1.png")
    img.save(path, quality=95)
    print("Generated designer slide_1.png")

# -------------------------------------------------------------
# SLIDE 2: Idea Title & Proposed Solution
# -------------------------------------------------------------
def make_slide_2():
    img = Image.new("RGB", (W, H), "#FFFFFF")
    draw = ImageDraw.Draw(img)
    draw_header_footer(draw, img, 2, "IDEA TITLE: AURA SENTINEL — CYBER RISK ENGINE")

    # LEFT COLUMN: 3 Sleek Dark Rounded Cards
    col1_x, col1_w = 70, 880
    left_cards = [
        ("Real-World Issue", 
         "Enterprises rely on static, qualitative 'High/Medium/Low' heatmaps that hide actual financial exposure, leaving boards unable to justify cyber budgets against dynamic threats.",
         "#E11D48", 180, 280),
        ("Why Important",
         "Cyber incidents cost Indian enterprises ₹25,000+ Cr annually. 68% of CISOs struggle to defend security ROI to corporate boards without quantified financial risk metrics.",
         "#0284C7", 490, 280),
        ("Proposed Solution: AURA Sentinel",
         "AI-powered continuous cyber risk quantification unifying the Open Group FAIR standard, Monte Carlo simulation, 0/1 Knapsack optimization, and SHA-256 Merkle blockchain.",
         "#10B981", 800, 280)
    ]

    for title, desc, acc_col, y_pos, card_h in left_cards:
        draw.rounded_rectangle([col1_x, y_pos, col1_x + col1_w, y_pos + card_h], radius=18, fill='#0F172A', outline=acc_col, width=3)
        draw.text((col1_x + 30, y_pos + 40), title, fill=acc_col, font=font_h2)
        # wrap text
        words = desc.split()
        lines = []
        cur = ""
        for w in words:
            if len(cur + " " + w) < 54:
                cur = cur + " " + w if cur else w
            else:
                lines.append(cur)
                cur = w
        if cur: lines.append(cur)
        for idx, line in enumerate(lines):
            draw.text((col1_x + 30, y_pos + 95 + (idx * 34)), line, fill='#F1F5F9', font=font_body)

    # 3 Prototype Buttons below Col 1
    btns = ["● Live SOC Console", "● GitHub Repo", "● REST API Docs"]
    bx = col1_x
    bw = (col1_w - 40) // 3
    for b_title in btns:
        draw.rounded_rectangle([bx, 1115, bx + bw, 1195], radius=12, fill='#1E293B', outline='#0284C7', width=2)
        draw.text((bx + bw // 2, 1155), b_title, fill='#38BDF8', font=get_font(20, bold=True), anchor="mm")
        bx += bw + 20

    # CENTER COLUMN: Cyber Defense Hierarchy Pyramid
    pyr_path = os.path.join(assets_dir, "slide2_pyramid.png")
    if os.path.exists(pyr_path):
        pyr_im = Image.open(pyr_path).convert("RGBA")
        pyr_im = pyr_im.resize((980, 1040), Image.Resampling.LANCZOS)
        img.paste(pyr_im, (1000, 175), pyr_im if pyr_im.mode == "RGBA" else None)

    # RIGHT COLUMN: 3 Risk vs Solution Comparison Cards
    col3_x, col3_w = 2030, 900
    rvs_items = [
        ("RISK: Static Annual Heatmaps", "Subjective High/Medium guesswork; stale within days; zero actuarial Rupee quantification.",
         "SOLUTION: Continuous FAIR Engine", "Automated continuous loss calculation (Threat Frequency × Loss Magnitude in ₹).",
         180, 310),
        ("RISK: Arbitrary Budget Guesswork", "Security budgets allocated via vendor hype & panic; no mathematical ROI justification.",
         "SOLUTION: 0/1 Knapsack Optimizer", "Bounded dynamic programming maximizes risk reduction per Rupee invested.",
         520, 310),
        ("RISK: Repudiable Audit Trails", "Editable database logs that fail rigorous regulatory scrutiny (DPDP & CERT-In).",
         "SOLUTION: Merkle Blockchain Ledger", "Cryptographically sealed SHA-256 state anchoring for zero-trust compliance.",
         860, 310)
    ]

    for r_title, r_desc, s_title, s_desc, y_pos, card_h in rvs_items:
        draw.rounded_rectangle([col3_x, y_pos, col3_x + col3_w, y_pos + card_h], radius=18, fill='#F8FAFC', outline='#BAE6FD', width=2)

        # Risk box (Top half)
        draw.rounded_rectangle([col3_x + 15, y_pos + 15, col3_x + col3_w - 15, y_pos + 125], radius=12, fill='#FFF1F2', outline='#FECDD3', width=2)
        draw.text((col3_x + 35, y_pos + 42), r_title, fill='#E11D48', font=get_font(21, bold=True))
        draw.text((col3_x + 35, y_pos + 80), r_desc, fill='#0F172A', font=font_body_sm)

        # VS Badge
        draw.ellipse([col3_x + col3_w // 2 - 32, y_pos + 122, col3_x + col3_w // 2 + 32, y_pos + 172], fill='#0F172A', outline='#0284C7', width=2)
        draw.text((col3_x + col3_w // 2, y_pos + 147), "vs", fill='#FFFFFF', font=get_font(18, bold=True), anchor="mm")

        # Solution box (Bottom half)
        draw.rounded_rectangle([col3_x + 15, y_pos + 170, col3_x + col3_w - 15, y_pos + 285], radius=12, fill='#F0FDF4', outline='#BBF7D0', width=2)
        draw.text((col3_x + 35, y_pos + 200), s_title, fill='#16A34A', font=get_font(21, bold=True))
        draw.text((col3_x + 35, y_pos + 238), s_desc, fill='#0F172A', font=font_body_sm)

    path = os.path.join(out_dir, "slide_2.png")
    img.save(path, quality=95)
    print("Generated designer slide_2.png")

# -------------------------------------------------------------
# SLIDE 3: Technical Approach & Architecture
# -------------------------------------------------------------
def make_slide_3():
    img = Image.new("RGB", (W, H), "#FFFFFF")
    draw = ImageDraw.Draw(img)
    draw_header_footer(draw, img, 3, "TECHNICAL APPROACH & SYSTEM ARCHITECTURE")

    # Left: 6-Step Circular Lifecycle Flowchart
    flow_path = os.path.join(assets_dir, "slide3_circular_flow.png")
    if os.path.exists(flow_path):
        flow_im = Image.open(flow_path).convert("RGBA")
        flow_im = flow_im.resize((960, 960), Image.Resampling.LANCZOS)
        img.paste(flow_im, (70, 180), flow_im if flow_im.mode == "RGBA" else None)

    # 2 Action Buttons below Flowchart
    draw.rounded_rectangle([100, 1160, 480, 1235], radius=12, fill='#0F172A', outline='#0284C7', width=2)
    draw.text((290, 1197), "● Lifecycle Specification", fill='#FFFFFF', font=get_font(20, bold=True), anchor="mm")

    draw.rounded_rectangle([520, 1160, 900, 1235], radius=12, fill='#0F172A', outline='#0284C7', width=2)
    draw.text((710, 1197), "● Algorithm Proofs", fill='#FFFFFF', font=get_font(20, bold=True), anchor="mm")

    # Center: End-to-End System Pipeline Diagram
    arch_path = os.path.join(assets_dir, "slide3_architecture.png")
    if os.path.exists(arch_path):
        arch_im = Image.open(arch_path).convert("RGBA")
        arch_im = arch_im.resize((1020, 1050), Image.Resampling.LANCZOS)
        img.paste(arch_im, (1030, 175), arch_im if arch_im.mode == "RGBA" else None)

    # Right: TECHNOLOGIES USED Stacked Cards
    tech_x, tech_w = 2100, 830
    draw.rounded_rectangle([tech_x, 180, tech_x + tech_w, 1235], radius=20, fill='#F8FAFC', outline='#BAE6FD', width=3)

    # Header Pill
    draw.rounded_rectangle([tech_x + 25, 205, tech_x + tech_w - 25, 275], radius=12, fill='#0F172A')
    draw.text((tech_x + tech_w // 2, 240), "TECHNOLOGIES USED", fill='#38BDF8', font=get_font(24, bold=True), anchor="mm")

    tech_stacks = [
        ("Backend & APIs", "Python 3.10, FastAPI, Pydantic, Uvicorn, SQLite 3", "#0284C7"),
        ("Quantification Engine", "Open Group FAIR (O-RT), NumPy, Monte Carlo (10k)", "#0D9488"),
        ("Optimization Logic", "0/1 Knapsack (Dynamic Programming), Multi-Constraint", "#D97706"),
        ("Blockchain & Audit", "SHA-256 Merkle Tree, Cryptographic Hash Chain", "#7C3AED"),
        ("Frontend & SOC UI", "React 18, Tailwind CSS, Lucide Icons, Recharts", "#2563EB")
    ]

    ty = 310
    for cat, items, col in tech_stacks:
        # Category box
        draw.rounded_rectangle([tech_x + 25, ty, tech_x + tech_w - 25, ty + 155], radius=14, fill='#FFFFFF', outline=col, width=2)
        draw.text((tech_x + 50, ty + 40), f"▪ {cat}", fill=col, font=get_font(23, bold=True))
        draw.text((tech_x + 50, ty + 85), items, fill='#1E293B', font=font_body_sm)
        ty += 175

    path = os.path.join(out_dir, "slide_3.png")
    img.save(path, quality=95)
    print("Generated designer slide_3.png")

# -------------------------------------------------------------
# SLIDE 4: Feasibility and Viability
# -------------------------------------------------------------
def make_slide_4():
    img = Image.new("RGB", (W, H), "#FFFFFF")
    draw = ImageDraw.Draw(img)
    draw_header_footer(draw, img, 4, "FEASIBILITY, VIABILITY & BUSINESS POTENTIAL")

    cards = [
        ("FEASIBILITY ANALYSIS", "#0284C7", 70, [
            ("Plug-and-Play Ingestion", "Seamlessly connects with existing tools (Nessus, Qualys, AWS, Active Directory) via standard REST APIs without hardware changes."),
            ("Sub-Second Computation", "10,000 Monte Carlo runs execute in <850ms in pure NumPy; dynamic programming knapsack completes in <50ms."),
            ("Modular Microservices", "Dockerized, container-ready architecture allows independent scaling of analytics workers and telemetry listeners."),
            ("Agentless Deployment", "Zero endpoint installation required, drastically reducing IT friction and operational overhead.")
        ]),
        ("VIABILITY & GOVERNANCE", "#0D9488", 1040, [
            ("Global Actuarial Standards", "Built strictly on Open Group FAIR & NIST SP 800-30 Rev 1, accepted by boards and cyber insurers globally."),
            ("Regulatory Compliance", "Merkle audit proofs satisfy DPDP Act 2023, RBI Cyber Security Framework, and CERT-In logging directives."),
            ("Boardroom Defensibility", "Converts ambiguous technical CVSS scores into CFO-ready ₹ Rupee loss distributions and justified ROI."),
            ("Zero Vendor Lock-In", "Open JSON/CSV data schemas and open-standards compliance ensure transparent, portable risk registers.")
        ]),
        ("BUSINESS POTENTIAL & ROI", "#7C3AED", 2010, [
            ("70%+ Audit Cost Reduction", "Automates manual third-party cyber risk assessments, saving ₹20L–₹50L per annual enterprise audit cycle."),
            ("Optimized Security Spend", "Dynamic knapsack allocation prevents overspending on low-impact controls, saving 25–40% of security budget."),
            ("Enterprise Market Scale", "Targeted at BFSI, Healthcare, Critical Infrastructure, and IT enterprises needing continuous compliance."),
            ("Cyber Insurance Alignment", "Empirical Value-at-Risk modeling accelerates policy underwriting and lowers corporate insurance premiums.")
        ])
    ]

    cw = 920
    for title, col, cx, points in cards:
        draw.rounded_rectangle([cx, 180, cx + cw, 1250], radius=20, fill='#F8FAFC', outline=col, width=3)
        # Header Pill
        draw.rounded_rectangle([cx + 25, 205, cx + cw - 25, 280], radius=14, fill=col)
        draw.text((cx + cw // 2, 242), title, fill='#FFFFFF', font=get_font(23, bold=True), anchor="mm")

        py = 320
        for p_title, p_desc in points:
            draw.text((cx + 35, py), f"✓ {p_title}", fill=col, font=font_h2)
            # wrap text
            words = p_desc.split()
            lines = []
            cur = ""
            for w in words:
                if len(cur + " " + w) < 48:
                    cur = cur + " " + w if cur else w
                else:
                    lines.append(cur)
                    cur = w
            if cur: lines.append(cur)
            for idx, line in enumerate(lines):
                draw.text((cx + 35, py + 42 + (idx * 30)), line, fill='#0F172A', font=font_body_sm)
            py += 42 + len(lines) * 30 + 28

    path = os.path.join(out_dir, "slide_4.png")
    img.save(path, quality=95)
    print("Generated designer slide_4.png")

# -------------------------------------------------------------
# SLIDE 5: Impact and Benefits
# -------------------------------------------------------------
def make_slide_5():
    img = Image.new("RGB", (W, H), "#FFFFFF")
    draw = ImageDraw.Draw(img)
    draw_header_footer(draw, img, 5, "IMPACT AND BENEFITS")

    # Left Container (Multi-Dimensional Impact Matrix)
    mx_x, mx_w = 70, 1650
    draw.rounded_rectangle([mx_x, 180, mx_x + mx_w, 1140], radius=22, fill='#F8FAFC', outline='#BAE6FD', width=3)

    # Matrix Header
    draw.rounded_rectangle([mx_x + 30, 205, mx_x + mx_w - 30, 285], radius=14, fill='#0F172A')
    draw.text((mx_x + mx_w // 2, 245), "AURA SENTINEL // MULTI-DIMENSIONAL IMPACT MATRIX", fill='#38BDF8', font=get_font(25, bold=True), anchor="mm")

    # Operational Box (Left inner)
    op_x, op_w = mx_x + 30, 760
    draw.rounded_rectangle([op_x, 310, op_x + op_w, 1020], radius=18, fill='#F0FDF4', outline='#BBF7D0', width=2)
    draw.text((op_x + op_w // 2, 355), "OPERATIONAL ADVANTAGES", fill='#16A34A', font=font_h2, anchor="mm")

    op_points = [
        ("24/7 Continuous Visibility", "Replaces periodic static audits with real-time dynamic risk quantification."),
        ("Optimal Budget ROI", "Knapsack algorithm maximizes security risk reduction per Rupee invested."),
        ("Impact Remediation", "Fixes vulnerabilities based on financial loss risk rather than CVSS noise alone."),
        ("Cryptographic Audit", "Tamper-proof Merkle ledger guarantees verifiable non-repudiation.")
    ]
    oy = 405
    for opt, opd in op_points:
        draw.text((op_x + 30, oy), f"● {opt}", fill='#065F46', font=get_font(22, bold=True))
        words = opd.split()
        lines = []
        cur = ""
        for w in words:
            if len(cur + " " + w) < 42:
                cur = cur + " " + w if cur else w
            else:
                lines.append(cur)
                cur = w
        if cur: lines.append(cur)
        for idx, line in enumerate(lines):
            draw.text((op_x + 30, oy + 36 + (idx * 28)), line, fill='#0F172A', font=font_body_sm)
        oy += 36 + len(lines) * 28 + 26

    # Strategic Box (Right inner)
    st_x, st_w = mx_x + 830, 790
    draw.rounded_rectangle([st_x, 310, st_x + st_w, 1020], radius=18, fill='#F0F9FF', outline='#BAE6FD', width=2)
    draw.text((st_x + st_w // 2, 355), "STRATEGIC & REGULATORY PILLARS", fill='#0284C7', font=font_h2, anchor="mm")

    st_points = [
        ("Boardroom Financial Clarity", "Translates cyber exposure into Value-at-Risk (₹ Crores) for executive consensus."),
        ("Compliance Readiness", "Automates reporting for DPDP Act 2023, RBI Cyber Guidelines, & CERT-In."),
        ("Cyber Insurance Underwriting", "Provides empirical loss exceedance curves required for favorable policy rates."),
        ("Unified C-Suite Vocabulary", "Bridges the technical communication gap between SOC analysts and CFO/Board.")
    ]
    sy = 405
    for stt, std in st_points:
        draw.text((st_x + 30, sy), f"● {stt}", fill='#0369A1', font=get_font(22, bold=True))
        words = std.split()
        lines = []
        cur = ""
        for w in words:
            if len(cur + " " + w) < 44:
                cur = cur + " " + w if cur else w
            else:
                lines.append(cur)
                cur = w
        if cur: lines.append(cur)
        for idx, line in enumerate(lines):
            draw.text((st_x + 30, sy + 36 + (idx * 28)), line, fill='#0F172A', font=font_body_sm)
        sy += 36 + len(lines) * 28 + 26

    # Bottom Transformation Banner
    draw.rounded_rectangle([mx_x, 1170, mx_x + mx_w, 1250], radius=14, fill='#0F172A', outline='#0284C7', width=2)
    draw.text((mx_x + mx_w // 2, 1210), "★ Paradigm Shift: From Subjective Guesswork to Actuarial Financial Precision ★", fill='#FFFFFF', font=get_font(23, bold=True), anchor="mm")

    # Right: Comparative Horizontal Bar Chart
    chart_path = os.path.join(assets_dir, "slide5_chart.png")
    if os.path.exists(chart_path):
        chart_im = Image.open(chart_path).convert("RGBA")
        chart_im = chart_im.resize((1180, 1070), Image.Resampling.LANCZOS)
        img.paste(chart_im, (1750, 180), chart_im if chart_im.mode == "RGBA" else None)

    path = os.path.join(out_dir, "slide_5.png")
    img.save(path, quality=95)
    print("Generated designer slide_5.png")

# -------------------------------------------------------------
# SLIDE 6: Research, References & Live Demonstration
# -------------------------------------------------------------
def make_slide_6():
    img = Image.new("RGB", (W, H), "#FFFFFF")
    draw = ImageDraw.Draw(img)
    draw_header_footer(draw, img, 6, "RESEARCH, REFERENCES & LIVE DEMONSTRATION")

    # Top Section: 7 Reference Banner Cards
    ref_x, ref_w = 70, 2860
    draw.rounded_rectangle([ref_x, 180, ref_x + ref_w, 690], radius=20, fill='#F8FAFC', outline='#BAE6FD', width=3)

    draw.rounded_rectangle([ref_x + 25, 200, ref_x + ref_w - 25, 260], radius=10, fill='#0F172A')
    draw.text((ref_x + ref_w // 2, 230), "STANDARDS, FORMAL RESEARCH & REGULATORY CITATIONS", fill='#38BDF8', font=get_font(22, bold=True), anchor="mm")

    ref_items = [
        ("The Open Group FAIR Standard", "Risk Taxonomy (O-RT) & Risk Analysis (O-RA) for quantitative information risk modeling.", "[opengroup.org]"),
        ("NIST SP 800-30 Rev. 1", "Guide for Conducting Risk Assessments in Federal Information Systems.", "[nist.gov]"),
        ("ISO/IEC 27005:2022", "Information security, cybersecurity and privacy protection — Managing risks.", "[iso.org]"),
        ("DPDP Act 2023", "Digital Personal Data Protection Act, Ministry of Electronics & IT (MeitY), India.", "[meity.gov.in]"),
        ("CERT-In Directions (2022)", "Section 70B mandate for cybersecurity posture and log retention guidelines.", "[cert-in.org.in]"),
        ("0/1 Knapsack Optimization", "Dynamic Programming algorithms for resource-constrained risk minimization.", "[ieee.org]"),
        ("RFC 6962: Merkle Trees", "Verifiable append-only data structures for immutable security telemetry logging.", "[rfc-editor.org]")
    ]

    ry = 285
    for name, desc, domain in ref_items:
        draw.text((ref_x + 40, ry), f"• {name}:", fill='#0284C7', font=get_font(20, bold=True))
        draw.text((ref_x + 440, ry), desc, fill='#1E293B', font=font_body_sm)
        draw.text((ref_x + ref_w - 220, ry), domain, fill='#16A34A', font=get_font(20, bold=True))
        ry += 54

    # Bottom Left: UI/UX Showcase Image (Real Dashboard Screenshot!)
    shot_path = os.path.join(assets_dir, "slide6_uiux_composite.png")
    if os.path.exists(shot_path):
        shot_im = Image.open(shot_path).convert("RGBA")
        shot_im = shot_im.resize((2000, 520), Image.Resampling.LANCZOS)
        img.paste(shot_im, (70, 725), shot_im if shot_im.mode == "RGBA" else None)

    # Bottom Right: Interactive Resources & GitHub QR Code Card
    qr_x, qr_w = 2110, 820
    draw.rounded_rectangle([qr_x, 725, qr_x + qr_w, 1245], radius=20, fill='#0F172A', outline='#0284C7', width=3)
    draw.text((qr_x + qr_w // 2, 760), "RESOURCES & SYSTEM REPOSITORY", fill='#38BDF8', font=get_font(21, bold=True), anchor="mm")

    # 3D Blueprint Banner Pill
    draw.rounded_rectangle([qr_x + 25, 785, qr_x + qr_w - 25, 835], radius=10, fill='#1E293B', outline='#22D3EE', width=2)
    draw.text((qr_x + qr_w // 2, 810), "🌐 Interactive 3D Blueprint: blueprint.html", fill='#22D3EE', font=get_font(18, bold=True), anchor="mm")

    if os.path.exists(qr_path):
        qr_im = Image.open(qr_path).convert("RGBA")
        qr_im = qr_im.resize((280, 280), Image.Resampling.LANCZOS)
        img.paste(qr_im, (qr_x + qr_w // 2 - 140, 850), qr_im if qr_im.mode == "RGBA" else None)

    draw.text((qr_x + qr_w // 2, 1150), "ByteForce_1 // AURA SENTINEL (ID: 180219)", fill='#FFFFFF', font=get_font(19, bold=True), anchor="mm")
    draw.text((qr_x + qr_w // 2, 1185), "github.com/aryanbaghel756-spec/AURA-SENTINEL", fill='#94A3B8', font=get_font(17, bold=False), anchor="mm")
    draw.text((qr_x + qr_w // 2, 1215), "★ Includes 3D Architecture Visualizer & Live Risk Simulator ★", fill='#10B981', font=get_font(14, bold=True), anchor="mm")

    path = os.path.join(out_dir, "slide_6.png")
    img.save(path, quality=95)
    print("Generated designer slide_6.png")

if __name__ == '__main__':
    make_slide_1()
    make_slide_2()
    make_slide_3()
    make_slide_4()
    make_slide_5()
    make_slide_6()
    print("ALL 6 DESIGNER-GRADE SLIDES GENERATED SUCCESSFULLY!")
