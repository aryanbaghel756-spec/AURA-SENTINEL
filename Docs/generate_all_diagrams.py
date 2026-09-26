import os
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as patches
import numpy as np
from PIL import Image, ImageDraw, ImageFont

out_dir = r'C:\Users\aryan\OneDrive\Desktop\Aura\Docs\assets'
os.makedirs(out_dir, exist_ok=True)

# -------------------------------------------------------------
# 1. SLIDE 1: High-Tech Cyber Core Shield Graphic
# -------------------------------------------------------------
def make_slide1_visual():
    fig, ax = plt.subplots(figsize=(8.5, 8.5), dpi=300)
    ax.set_facecolor('#0B1220')
    fig.patch.set_facecolor('#0B1220')
    ax.set_xlim(-4.2, 4.2)
    ax.set_ylim(-4.2, 4.2)
    ax.axis('off')

    # Cyber grid background lines
    for val in np.linspace(-4, 4, 17):
        ax.axhline(val, color='#1F2E4D', lw=0.5, alpha=0.3)
        ax.axvline(val, color='#1F2E4D', lw=0.5, alpha=0.3)

    # Concentric orbital rings
    for r, col, ls, a in [(3.6, '#22D3EE', ':', 0.25), (2.8, '#8B5CF6', '--', 0.35), (2.0, '#22D3EE', '-', 0.45)]:
        circ = plt.Circle((0, 0), r, color=col, fill=False, lw=1.8, linestyle=ls, alpha=a)
        ax.add_patch(circ)

    # 4 Satellite Nodes
    nodes = [
        (0, 2.9, "FAIR Cyber Risk Engine", "Loss Frequency × Loss Magnitude", "#22D3EE", "Actuarial ₹ VaR"),
        (2.9, 0, "0/1 Knapsack Optimizer", "Bounded Dynamic Programming", "#10B981", "Max Security ROI"),
        (0, -2.9, "Merkle Blockchain Ledger", "SHA-256 State Anchoring", "#8B5CF6", "Zero-Trust Audit"),
        (-2.9, 0, "10k Monte Carlo Engine", "Lognormal Path Sampling", "#F59E0B", "Tail Risk Distribution")
    ]

    for x, y, title, subtitle, col, badge in nodes:
        # Connecting line to center
        ax.plot([0, x], [0, y], color=col, lw=2.2, alpha=0.7, zorder=3)
        
        # Node container card
        box = patches.FancyBboxPatch((x - 1.25, y - 0.65), 2.5, 1.3,
                                     boxstyle="round,pad=0.1,rounding_size=0.2",
                                     edgecolor=col, facecolor='#16213A', lw=2.2, zorder=4)
        ax.add_patch(box)
        
        # Title
        ax.text(x, y + 0.22, title, color='#FFFFFF', fontsize=9.5, fontweight='bold',
                ha='center', va='center', zorder=5)
        # Subtitle
        ax.text(x, y - 0.05, subtitle, color='#94A3B8', fontsize=7.2, fontweight='medium',
                ha='center', va='center', zorder=5)
        
        # Small Accent Badge
        badge_box = patches.FancyBboxPatch((x - 0.85, y - 0.48), 1.7, 0.32,
                                           boxstyle="round,pad=0.05,rounding_size=0.1",
                                           edgecolor='none', facecolor=col, alpha=0.25, zorder=5)
        ax.add_patch(badge_box)
        ax.text(x, y - 0.32, badge, color=col, fontsize=7.8, fontweight='bold',
                ha='center', va='center', zorder=6)

    # Central Core Shield
    core = patches.Circle((0, 0), 1.35, edgecolor='#22D3EE', facecolor='#0B1220', lw=3.5, zorder=6)
    ax.add_patch(core)
    core_inner = patches.Circle((0, 0), 1.18, edgecolor='#0284C7', facecolor='#16213A', lw=1.8, zorder=7)
    ax.add_patch(core_inner)

    ax.text(0, 0.38, "AURA", color='#FFFFFF', fontsize=24, fontweight='heavy', ha='center', va='center', zorder=8)
    ax.text(0, -0.05, "SENTINEL", color='#22D3EE', fontsize=15, fontweight='bold', ha='center', va='center', zorder=8)
    ax.text(0, -0.45, "SOC CONSOLE // SIH26105", color='#94A3B8', fontsize=7.5, fontweight='bold', ha='center', va='center', zorder=8)

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide1_visual.png')
    plt.savefig(path, bbox_inches='tight', dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide1_visual.png")

# -------------------------------------------------------------
# 2. SLIDE 2: Cyber Defense Hierarchy Pyramid
# -------------------------------------------------------------
def make_slide2_pyramid():
    fig, ax = plt.subplots(figsize=(8.5, 7.5), dpi=300)
    ax.set_facecolor('#FFFFFF')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_xlim(-5.5, 5.5)
    ax.set_ylim(-0.5, 6.5)
    ax.axis('off')

    tiers = [
        # (y_b, y_t, w_b, w_t, color, level, title, desc)
        (4.5, 5.8, 3.4, 1.6, '#0284C7', 'LEVEL 4: BOARDROOM GOVERNANCE', 'ACTUARIAL FINANCIAL VaR', 'Loss Exceedance Distributions in ₹ Lakhs & Crores'),
        (3.0, 4.3, 5.6, 3.8, '#0D9488', 'LEVEL 3: STRATEGIC CAPITAL ALLOCATION', '0/1 KNAPSACK OPTIMIZER', 'Bounded DP Maximizes Risk Reduction per Rupee'),
        (1.5, 2.8, 7.8, 6.0, '#4F46E5', 'LEVEL 2: TACTICAL THREAT QUANTIFICATION', 'CONTINUOUS FAIR ENGINE', 'Loss Event Frequency (LEF) × Loss Magnitude (LM)'),
        (0.0, 1.3, 10.0, 8.2, '#0B1220', 'LEVEL 1: CRYPTOGRAPHIC TRUST FOUNDATION', 'MERKLE BLOCKCHAIN LEDGER', 'Immutable SHA-256 State Anchoring & Zero-Trust Audit')
    ]

    for y_b, y_t, w_b, w_t, col, lvl, title, desc in tiers:
        x_coords = [-w_b/2, w_b/2, w_t/2, -w_t/2]
        y_coords = [y_b, y_b, y_t, y_t]
        trap = patches.Polygon(list(zip(x_coords, y_coords)), closed=True,
                               facecolor=col, edgecolor='#0B1220', lw=1.6, alpha=0.95)
        ax.add_patch(trap)

        y_mid = (y_b + y_t) / 2
        ax.text(0, y_mid + 0.28, lvl, color='#BAE6FD', fontsize=7.2, fontweight='bold', ha='center', va='center')
        ax.text(0, y_mid + 0.05, title, color='#FFFFFF', fontsize=10.5, fontweight='bold', ha='center', va='center')
        ax.text(0, y_mid - 0.24, desc, color='#E2E8F0', fontsize=8.0, fontweight='normal', ha='center', va='center')

    ax.text(0, 6.2, "AURA CYBER DEFENSE MATURITY PYRAMID", color='#0B1220', fontsize=13, fontweight='heavy', ha='center', va='center')

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide2_pyramid.png')
    plt.savefig(path, bbox_inches='tight', dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide2_pyramid.png")

# -------------------------------------------------------------
# 3. SLIDE 3: 6-Step Circular Lifecycle Flowchart
# -------------------------------------------------------------
def make_slide3_circular_flow():
    fig, ax = plt.subplots(figsize=(8.5, 8.5), dpi=300)
    ax.set_facecolor('#FFFFFF')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_xlim(-4.2, 4.2)
    ax.set_ylim(-4.2, 4.2)
    ax.axis('off')

    steps = [
        (0, 2.95, "1. Asset Ingestion", "Endpoints, Cloud & Assets", "#0284C7"),
        (2.65, 1.45, "2. FAIR Translation", "Threat Frequency & Vuln", "#0D9488"),
        (2.65, -1.45, "3. Monte Carlo", "10,000 Iterations & VaR", "#4F46E5"),
        (0, -2.95, "4. Knapsack DP", "Budget & Control Opt", "#D97706"),
        (-2.65, -1.45, "5. Merkle Ledger", "SHA-256 Cryptographic Log", "#7C3AED"),
        (-2.65, 1.45, "6. SOC & Telemetry", "Real-Time Board Push", "#2563EB")
    ]

    # Center Hub
    center_hub = patches.Circle((0, 0), 1.2, facecolor='#0B1220', edgecolor='#0284C7', lw=2.5)
    ax.add_patch(center_hub)
    ax.text(0, 0.22, "AURA", color='#22D3EE', fontsize=15, fontweight='heavy', ha='center', va='center')
    ax.text(0, -0.15, "LIFECYCLE", color='#FFFFFF', fontsize=11, fontweight='bold', ha='center', va='center')

    angles = [90, 30, 330, 270, 210, 150]
    r = 2.95

    for idx, (x, y, title, sub, col) in enumerate(steps):
        # Step card
        box = patches.FancyBboxPatch((x - 1.25, y - 0.48), 2.5, 0.96,
                                     boxstyle="round,pad=0.08,rounding_size=0.15",
                                     facecolor='#F8FAFC', edgecolor=col, lw=2.2)
        ax.add_patch(box)
        
        # Number badge
        num_circ = patches.Circle((x - 0.95, y), 0.26, facecolor=col, edgecolor='none')
        ax.add_patch(num_circ)
        ax.text(x - 0.95, y, str(idx + 1), color='#FFFFFF', fontsize=9.5, fontweight='bold', ha='center', va='center')

        # Text
        ax.text(x + 0.2, y + 0.12, title[3:], color='#0B1220', fontsize=9.2, fontweight='bold', ha='center', va='center')
        ax.text(x + 0.2, y - 0.18, sub, color='#64748B', fontsize=7.2, fontweight='medium', ha='center', va='center')

        # Directional arrows between steps
        a1 = np.deg2rad(angles[idx] - 22)
        a2 = np.deg2rad(angles[(idx + 1) % 6] + 22)
        x1, y1 = r * np.cos(a1), r * np.sin(a1)
        x2, y2 = r * np.cos(a2), r * np.sin(a2)
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.45",
                                    color='#94A3B8', lw=2.0, connectionstyle="arc3,rad=-0.18"))

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide3_circular_flow.png')
    plt.savefig(path, bbox_inches='tight', dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide3_circular_flow.png")

# -------------------------------------------------------------
# 4. SLIDE 3: End-to-End System Pipeline Architecture
# -------------------------------------------------------------
def make_slide3_architecture():
    fig, ax = plt.subplots(figsize=(9.2, 7.8), dpi=300)
    ax.set_facecolor('#FFFFFF')
    fig.patch.set_facecolor('#FFFFFF')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8.6)
    ax.axis('off')

    layers = [
        ("LAYER 4: EXECUTIVE SOC & GOVERNANCE UI",
         "React 18  •  Tailwind CSS  •  Recharts  •  WebSocket Real-Time Stream",
         "#0284C7", 6.8),
        ("LAYER 3: VERIFICATION & PERSISTENCE",
         "SQLite Database  •  SHA-256 Merkle Hash Tree  •  Cryptographic Audit Ledger",
         "#7C3AED", 4.7),
        ("LAYER 2: ANALYTIC & OPTIMIZATION BACKEND",
         "FastAPI (Python 3.10)  •  FAIR Standard (O-RT)  •  Monte Carlo (10k)  •  0/1 Knapsack DP",
         "#0D9488", 2.6),
        ("LAYER 1: TELEMETRY & DATA INGESTION",
         "Vulnerability Scanners (Nessus/Qualys)  •  Cloud Assets (AWS/GCP)  •  Active Directory  •  NVD Feeds",
         "#334155", 0.5)
    ]

    for title, details, col, y in layers:
        card = patches.FancyBboxPatch((0.5, y), 9.0, 1.5,
                                      boxstyle="round,pad=0.1,rounding_size=0.18",
                                      facecolor='#F8FAFC', edgecolor=col, lw=2.2)
        ax.add_patch(card)

        header_pill = patches.FancyBboxPatch((0.7, y + 0.95), 8.6, 0.42,
                                             boxstyle="round,pad=0.05,rounding_size=0.1",
                                             facecolor=col, edgecolor='none')
        ax.add_patch(header_pill)
        ax.text(5.0, y + 1.16, title, color='#FFFFFF', fontsize=9.8, fontweight='bold', ha='center', va='center')
        ax.text(5.0, y + 0.5, details, color='#1E293B', fontsize=8.6, fontweight='semibold', ha='center', va='center')

    for y_arrow in [2.15, 4.25, 6.35]:
        ax.annotate('', xy=(5.0, y_arrow + 0.4), xytext=(5.0, y_arrow - 0.1),
                    arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.45", color='#0284C7', lw=2.2))

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide3_architecture.png')
    plt.savefig(path, bbox_inches='tight', dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide3_architecture.png")

# -------------------------------------------------------------
# 5. SLIDE 5: Comparative Horizontal Bar Chart
# -------------------------------------------------------------
def make_slide5_chart():
    fig, ax = plt.subplots(figsize=(8.5, 6.2), dpi=300)
    ax.set_facecolor('#FFFFFF')
    fig.patch.set_facecolor('#FFFFFF')

    metrics = [
        "Boardroom Decision Confidence",
        "Risk Assessment Speed / Latency",
        "Threat & Asset Coverage",
        "Security Budget Efficiency"
    ]
    legacy_scores = [28, 10, 32, 52]
    aura_scores = [96, 99, 95, 94]

    y = np.arange(len(metrics))
    height = 0.32

    bars_leg = ax.barh(y - height/2, legacy_scores, height, label='Legacy Heatmaps (Subjective Guesswork)',
                       color='#E2E8F0', edgecolor='#94A3B8', lw=1.2)
    bars_aura = ax.barh(y + height/2, aura_scores, height, label='AURA Sentinel (Actuarial Quantitative AI)',
                        color='#0284C7', edgecolor='#0369A1', lw=1.2)

    for bar in bars_leg:
        w = bar.get_width()
        ax.text(w + 2, bar.get_y() + bar.get_height()/2, f'{int(w)}%',
                ha='left', va='center', fontsize=8.8, color='#64748B', fontweight='bold')

    for bar in bars_aura:
        w = bar.get_width()
        ax.text(w - 7, bar.get_y() + bar.get_height()/2, f'{int(w)}%',
                ha='left', va='center', fontsize=8.8, color='#FFFFFF', fontweight='bold')

    ax.set_yticks(y)
    ax.set_yticklabels(metrics, fontsize=9.5, fontweight='bold', color='#0F172A')
    ax.set_xlim(0, 115)
    ax.set_xlabel('Effectiveness & Governance Benchmark (%)', fontsize=9.5, fontweight='bold', color='#334155')
    ax.set_title('PERFORMANCE BENCHMARK: LEGACY VS AURA SENTINEL', fontsize=11, fontweight='heavy', color='#0F172A', pad=12)

    ax.legend(loc='lower right', framealpha=0.95, facecolor='#F8FAFC', edgecolor='#CBD5E1', fontsize=8.5)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#CBD5E1')
    ax.spines['bottom'].set_color('#CBD5E1')
    ax.grid(axis='x', linestyle='--', alpha=0.3)

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide5_chart.png')
    plt.savefig(path, bbox_inches='tight', dpi=300, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide5_chart.png")

if __name__ == '__main__':
    make_slide1_visual()
    make_slide2_pyramid()
    make_slide3_circular_flow()
    make_slide3_architecture()
    make_slide5_chart()
    print("ALL HIGH-RESOLUTION DIAGRAMS GENERATED SUCCESSFULLY!")
