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
# 1. SLIDE 1 VISUAL GRAPHIC: Cyber Shield Core & Radiating Nodes
# -------------------------------------------------------------
def make_slide1_visual():
    fig, ax = plt.subplots(figsize=(8, 8), dpi=200)
    ax.set_facecolor('#0f172a')
    fig.patch.set_facecolor('#0f172a')
    ax.set_xlim(-4, 4)
    ax.set_ylim(-4, 4)
    ax.axis('off')

    # Concentric circles
    for r, alpha, ls in [(3.4, 0.15, ':'), (2.6, 0.25, '--'), (1.8, 0.4, '-')]:
        circle = plt.Circle((0, 0), r, color='#0284c7', fill=False, lw=1.5, linestyle=ls, alpha=alpha)
        ax.add_patch(circle)

    # 4 Radiating Nodes
    nodes = [
        (0, 2.7, "FAIR Model\nQuantification", "#38bdf8", "₹ Loss VaR"),
        (2.7, 0, "0/1 Knapsack\nBudget Optimizer", "#34d399", "Max ROI"),
        (0, -2.7, "Merkle Tree\nBlockchain Ledger", "#a78bfa", "SHA-256 Proof"),
        (-2.7, 0, "10k Monte Carlo\nSimulation", "#fbbf24", "Actuarial Dist")
    ]

    for x, y, title, col, badge in nodes:
        # Connecting lines
        ax.plot([0, x], [0, y], color=col, lw=2, alpha=0.6, linestyle='-')
        # Node box
        box = patches.FancyBboxPatch((x-1.1, y-0.6), 2.2, 1.2,
                                     boxstyle="round,pad=0.1,rounding_size=0.2",
                                     edgecolor=col, facecolor='#1e293b', lw=2, zorder=4)
        ax.add_patch(box)
        ax.text(x, y+0.12, title, color='#ffffff', fontsize=9.5, fontweight='bold',
                ha='center', va='center', zorder=5)
        # Small badge
        badge_box = patches.FancyBboxPatch((x-0.75, y-0.45), 1.5, 0.3,
                                           boxstyle="round,pad=0.05,rounding_size=0.1",
                                           edgecolor='none', facecolor=col, alpha=0.3, zorder=5)
        ax.add_patch(badge_box)
        ax.text(x, y-0.3, badge, color=col, fontsize=8, fontweight='bold',
                ha='center', va='center', zorder=6)

    # Center Core Shield
    core = patches.Circle((0, 0), 1.25, edgecolor='#38bdf8', facecolor='#0369a1', lw=3, zorder=6)
    ax.add_patch(core)
    core_inner = patches.Circle((0, 0), 1.1, edgecolor='#7dd3fc', facecolor='#0c4a6e', lw=1.5, zorder=7)
    ax.add_patch(core_inner)

    ax.text(0, 0.35, "AURA", color='#ffffff', fontsize=22, fontweight='heavy', ha='center', va='center', zorder=8)
    ax.text(0, -0.05, "SENTINEL", color='#38bdf8', fontsize=14, fontweight='bold', ha='center', va='center', zorder=8)
    ax.text(0, -0.45, "CYBER RISK ENGINE", color='#94a3b8', fontsize=8, fontweight='semibold', ha='center', va='center', zorder=8)

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide1_visual.png')
    plt.savefig(path, bbox_inches='tight', dpi=200, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide1_visual.png")

# -------------------------------------------------------------
# 2. SLIDE 2 PYRAMID: Cyber Risk Hierarchy Pyramid
# -------------------------------------------------------------
def make_slide2_pyramid():
    fig, ax = plt.subplots(figsize=(8.5, 7.5), dpi=200)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')
    ax.set_xlim(-5.5, 5.5)
    ax.set_ylim(-0.5, 6.5)
    ax.axis('off')

    tiers = [
        # (y_bottom, y_top, w_bottom, w_top, color, title, desc)
        (4.5, 5.8, 3.2, 1.4, '#0284c7', 'BOARD LEVEL: FINANCIAL VaR', 'Actuarial Loss Exceedance in ₹ Lakhs & Crores'),
        (3.0, 4.3, 5.4, 3.6, '#0f766e', 'STRATEGIC: KNAPSACK OPTIMIZER', '0/1 DP Algorithmic Control & Budget Allocation'),
        (1.5, 2.8, 7.6, 5.8, '#4338ca', 'TACTICAL: FAIR RISK ENGINE', 'Continuous Threat Frequency (TEF) × Loss Magnitude (LM)'),
        (0.0, 1.3, 9.8, 8.0, '#1e293b', 'FOUNDATION: CRYPTOGRAPHIC MERKLE LEDGER', 'Immutable SHA-256 Zero-Knowledge Compliance Logs')
    ]

    for y_b, y_t, w_b, w_t, col, title, desc in tiers:
        # Trapezoid coordinates
        x_coords = [-w_b/2, w_b/2, w_t/2, -w_t/2]
        y_coords = [y_b, y_b, y_t, y_t]
        trap = patches.Polygon(list(zip(x_coords, y_coords)), closed=True,
                               facecolor=col, edgecolor='#0f172a', lw=1.5, alpha=0.92)
        ax.add_patch(trap)

        # Labels
        y_mid = (y_b + y_t) / 2
        ax.text(0, y_mid + 0.15, title, color='#ffffff', fontsize=10.5, fontweight='bold',
                ha='center', va='center')
        ax.text(0, y_mid - 0.22, desc, color='#e2e8f0', fontsize=8.5, fontweight='normal',
                ha='center', va='center')

    # Title above pyramid
    ax.text(0, 6.2, "CYBER DEFENSE HIERARCHY", color='#0f172a', fontsize=13, fontweight='heavy',
            ha='center', va='center')

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide2_pyramid.png')
    plt.savefig(path, bbox_inches='tight', dpi=200, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide2_pyramid.png")

# -------------------------------------------------------------
# 3. SLIDE 3 FLOWCHART: 6-Step Circular Lifecycle
# -------------------------------------------------------------
def make_slide3_circular_flow():
    fig, ax = plt.subplots(figsize=(8, 8), dpi=200)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')
    ax.set_xlim(-4.2, 4.2)
    ax.set_ylim(-4.2, 4.2)
    ax.axis('off')

    steps = [
        (0, 2.9, "1. Asset Ingestion", "Endpoints, Cloud & Assets", "#0284c7"),
        (2.6, 1.4, "2. FAIR Translation", "Threat Frequency & Vuln", "#0f766e"),
        (2.6, -1.4, "3. Monte Carlo", "10,000 Iterations & VaR", "#4338ca"),
        (0, -2.9, "4. Knapsack DP", "Budget & Control Opt", "#d97706"),
        (-2.6, -1.4, "5. Merkle Ledger", "SHA-256 Cryptographic Log", "#7c3aed"),
        (-2.6, 1.4, "6. SOC & Telemetry", "Real-Time Board Push", "#2563eb")
    ]

    # Center Hub
    center_hub = patches.Circle((0, 0), 1.15, facecolor='#0f172a', edgecolor='#0284c7', lw=2)
    ax.add_patch(center_hub)
    ax.text(0, 0.2, "AURA", color='#38bdf8', fontsize=14, fontweight='heavy', ha='center', va='center')
    ax.text(0, -0.15, "LIFECYCLE", color='#ffffff', fontsize=11, fontweight='bold', ha='center', va='center')

    # Draw steps and curved connections
    angles = [90, 30, 330, 270, 210, 150]
    r = 2.9

    for idx, (x, y, title, sub, col) in enumerate(steps):
        # Step card
        box = patches.FancyBboxPatch((x-1.25, y-0.48), 2.5, 0.96,
                                     boxstyle="round,pad=0.08,rounding_size=0.15",
                                     facecolor='#f8fafc', edgecolor=col, lw=2)
        ax.add_patch(box)
        # Number badge
        num_circ = patches.Circle((x-0.95, y), 0.25, facecolor=col, edgecolor='none')
        ax.add_patch(num_circ)
        ax.text(x-0.95, y, str(idx+1), color='#ffffff', fontsize=9, fontweight='bold', ha='center', va='center')

        # Text
        ax.text(x+0.2, y+0.12, title[3:], color='#0f172a', fontsize=9, fontweight='bold', ha='center', va='center')
        ax.text(x+0.2, y-0.18, sub, color='#64748b', fontsize=7.2, fontweight='medium', ha='center', va='center')

        # Directional arrows between steps
        a1 = np.deg2rad(angles[idx] - 22)
        a2 = np.deg2rad(angles[(idx+1)%6] + 22)
        x1, y1 = r * np.cos(a1), r * np.sin(a1)
        x2, y2 = r * np.cos(a2), r * np.sin(a2)
        ax.annotate('', xy=(x2, y2), xytext=(x1, y1),
                    arrowprops=dict(arrowstyle="->,head_width=0.3,head_length=0.4",
                                    color='#94a3b8', lw=1.8, connectionstyle="arc3,rad=-0.18"))

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide3_circular_flow.png')
    plt.savefig(path, bbox_inches='tight', dpi=200, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide3_circular_flow.png")

# -------------------------------------------------------------
# 4. SLIDE 3 ARCHITECTURE: End-to-End System Pipeline
# -------------------------------------------------------------
def make_slide3_architecture():
    fig, ax = plt.subplots(figsize=(9, 7.5), dpi=200)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 8.5)
    ax.axis('off')

    layers = [
        ("LAYER 4: EXECUTIVE SOC & GOVERNANCE UI",
         "React 18  •  Tailwind CSS  •  Recharts  •  WebSocket Real-Time Stream",
         "#0284c7", 6.8),
        ("LAYER 3: VERIFICATION & PERSISTENCE",
         "SQLite Database  •  SHA-256 Merkle Hash Tree  •  Cryptographic Audit Ledger",
         "#7c3aed", 4.7),
        ("LAYER 2: ANALYTIC & OPTIMIZATION BACKEND",
         "FastAPI (Python 3.10)  •  FAIR Standard (O-RT)  •  Monte Carlo (10k)  •  0/1 Knapsack DP",
         "#0f766e", 2.6),
        ("LAYER 1: TELEMETRY & DATA INGESTION",
         "Vulnerability Scanners (Nessus/Qualys)  •  Cloud Assets (AWS/GCP)  •  Active Directory  •  NVD Feeds",
         "#334155", 0.5)
    ]

    for title, details, col, y in layers:
        # Box
        card = patches.FancyBboxPatch((0.5, y), 9.0, 1.5,
                                      boxstyle="round,pad=0.1,rounding_size=0.18",
                                      facecolor='#f8fafc', edgecolor=col, lw=2.2)
        ax.add_patch(card)

        # Header Pill inside card
        header_pill = patches.FancyBboxPatch((0.7, y + 0.95), 8.6, 0.42,
                                             boxstyle="round,pad=0.05,rounding_size=0.1",
                                             facecolor=col, edgecolor='none')
        ax.add_patch(header_pill)
        ax.text(5.0, y + 1.16, title, color='#ffffff', fontsize=9.5, fontweight='bold',
                ha='center', va='center')

        # Details text
        ax.text(5.0, y + 0.5, details, color='#1e293b', fontsize=8.5, fontweight='semibold',
                ha='center', va='center')

    # Connecting vertical arrows between layers
    for y_arrow in [2.15, 4.25, 6.35]:
        ax.annotate('', xy=(5.0, y_arrow + 0.4), xytext=(5.0, y_arrow - 0.1),
                    arrowprops=dict(arrowstyle="->,head_width=0.35,head_length=0.45",
                                    color='#0284c7', lw=2.2))

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide3_architecture.png')
    plt.savefig(path, bbox_inches='tight', dpi=200, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide3_architecture.png")

# -------------------------------------------------------------
# 5. SLIDE 5 COMPARATIVE BAR CHART: Legacy vs AURA Sentinel
# -------------------------------------------------------------
def make_slide5_chart():
    fig, ax = plt.subplots(figsize=(8.5, 6.2), dpi=200)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')

    metrics = [
        "Boardroom Decision Confidence",
        "Risk Assessment Speed / Latency",
        "Threat & Asset Coverage",
        "Security Budget Efficiency"
    ]
    legacy_scores = [28, 10, 32, 52] # Legacy scores %
    aura_scores = [96, 99, 95, 94]   # AURA Sentinel scores %

    y = np.arange(len(metrics))
    height = 0.32

    # Bars
    bars_leg = ax.barh(y - height/2, legacy_scores, height, label='Legacy Heatmaps (Guesswork)',
                       color='#e2e8f0', edgecolor='#94a3b8', lw=1.2)
    bars_aura = ax.barh(y + height/2, aura_scores, height, label='AURA Sentinel (Actuarial AI)',
                        color='#0284c7', edgecolor='#0369a1', lw=1.2)

    # Annotations
    for bar in bars_leg:
        w = bar.get_width()
        ax.text(w + 2, bar.get_y() + bar.get_height()/2, f'{int(w)}%',
                ha='left', va='center', fontsize=8.5, color='#64748b', fontweight='bold')

    for bar in bars_aura:
        w = bar.get_width()
        ax.text(w - 7, bar.get_y() + bar.get_height()/2, f'{int(w)}%',
                ha='left', va='center', fontsize=8.5, color='#ffffff', fontweight='bold')

    ax.set_yticks(y)
    ax.set_yticklabels(metrics, fontsize=9.5, fontweight='bold', color='#0f172a')
    ax.set_xlim(0, 115)
    ax.set_xlabel('Effectiveness & Governance Benchmark (%)', fontsize=9.5, fontweight='bold', color='#334155')
    ax.set_title('PERFORMANCE BENCHMARK: LEGACY VS AURA SENTINEL', fontsize=11, fontweight='heavy', color='#0f172a', pad=12)

    ax.legend(loc='lower right', framealpha=0.95, facecolor='#f8fafc', edgecolor='#cbd5e1', fontsize=8.5)
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['left'].set_color('#cbd5e1')
    ax.spines['bottom'].set_color('#cbd5e1')
    ax.grid(axis='x', linestyle='--', alpha=0.3)

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide5_chart.png')
    plt.savefig(path, bbox_inches='tight', dpi=200, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide5_chart.png")

# -------------------------------------------------------------
# 6. SLIDE 6 UI/UX MOCKUP: Live Dashboard Preview
# -------------------------------------------------------------
def make_slide6_uiux():
    fig, ax = plt.subplots(figsize=(10, 6.2), dpi=200)
    ax.set_facecolor('#0b1120')
    fig.patch.set_facecolor('#0b1120')
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 6.2)
    ax.axis('off')

    # Top Navigation Bar
    nav = patches.FancyBboxPatch((0.2, 5.5), 9.6, 0.55,
                                 boxstyle="round,pad=0.05,rounding_size=0.1",
                                 facecolor='#1e293b', edgecolor='#334155', lw=1)
    ax.add_patch(nav)
    ax.text(0.5, 5.78, "AURA SENTINEL // EXECUTIVE SOC & RISK QUANTIFICATION CONSOLE",
            color='#38bdf8', fontsize=9, fontweight='heavy', ha='left', va='center')
    ax.text(9.5, 5.78, "● LIVE TELEMETRY", color='#34d399', fontsize=8, fontweight='bold', ha='right', va='center')

    # Left Panel: Loss Exceedance Curve (VaR)
    p_left = patches.FancyBboxPatch((0.2, 0.3), 4.6, 5.0,
                                    boxstyle="round,pad=0.08,rounding_size=0.12",
                                    facecolor='#0f172a', edgecolor='#1e293b', lw=1.2)
    ax.add_patch(p_left)
    ax.text(0.4, 5.0, "MONTE CARLO FINANCIAL LOSS EXCEEDANCE", color='#ffffff', fontsize=8.5, fontweight='bold', ha='left')
    ax.text(0.4, 4.75, "10,000 Iterations  |  95% Confidence VaR: ₹14.82 Crores", color='#38bdf8', fontsize=7.5, fontweight='medium', ha='left')

    # Draw simulated Loss Exceedance Curve inside left panel
    xs = np.linspace(0.6, 4.4, 60)
    ys = 0.8 + 3.4 / (1 + np.exp(2.8 * (xs - 2.5)))
    ax.plot(xs, ys, color='#0284c7', lw=2.5)
    ax.fill_between(xs, 0.8, ys, color='#0284c7', alpha=0.25)
    ax.axvline(x=3.4, ymin=0.15, ymax=0.6, color='#f43f5e', linestyle='--', lw=1.5)
    ax.text(3.45, 2.7, "95% VaR (₹14.8 Cr)", color='#f43f5e', fontsize=7.5, fontweight='bold')

    # Right Top Panel: Knapsack Optimization
    p_rt = patches.FancyBboxPatch((5.0, 3.0), 4.8, 2.3,
                                  boxstyle="round,pad=0.08,rounding_size=0.12",
                                  facecolor='#0f172a', edgecolor='#1e293b', lw=1.2)
    ax.add_patch(p_rt)
    ax.text(5.2, 5.0, "KNAPSACK OPTIMAL BUDGET ALLOCATION", color='#ffffff', fontsize=8.5, fontweight='bold', ha='left')
    ax.text(5.2, 4.75, "Budget: ₹2.5 Cr  |  Risk Reduction: ₹11.2 Cr (4.48x ROI)", color='#34d399', fontsize=7.5, fontweight='semibold', ha='left')

    # Table preview
    ctrls = [
        ("MFA & Privileged Access Control", "₹45 Lakhs", "₹3.80 Cr", "SELECTED"),
        ("Immutable Backup & EDR Agent", "₹65 Lakhs", "₹4.50 Cr", "SELECTED"),
        ("Cloud Micro-Segmentation (WAF)", "₹50 Lakhs", "₹2.90 Cr", "SELECTED")
    ]
    y_row = 4.3
    for name, cost, red, status in ctrls:
        ax.text(5.2, y_row, f"• {name}", color='#e2e8f0', fontsize=7.2, ha='left')
        ax.text(8.3, y_row, f"{cost} → {red}", color='#94a3b8', fontsize=7.0, ha='left')
        ax.text(9.6, y_row, status, color='#34d399', fontsize=6.8, fontweight='bold', ha='right')
        y_row -= 0.35

    # Right Bottom Panel: Merkle Tree Cryptographic Ledger
    p_rb = patches.FancyBboxPatch((5.0, 0.3), 4.8, 2.5,
                                  boxstyle="round,pad=0.08,rounding_size=0.12",
                                  facecolor='#0f172a', edgecolor='#1e293b', lw=1.2)
    ax.add_patch(p_rb)
    ax.text(5.2, 2.5, "BLOCKCHAIN IMMUTABLE AUDIT LOG (SHA-256)", color='#ffffff', fontsize=8.5, fontweight='bold', ha='left')

    logs = [
        ("Block #1042", "0x8f4d...a29e", "Root anchored: Assessment Run #88", "VERIFIED"),
        ("Block #1041", "0x3e1c...bb74", "Risk register state committed", "VERIFIED"),
        ("Block #1040", "0x91da...554a", "Knapsack allocation locked", "VERIFIED")
    ]
    y_log = 2.05
    for blk, hsh, desc, stat in logs:
        ax.text(5.2, y_log, blk, color='#38bdf8', fontsize=7.2, fontweight='bold', ha='left')
        ax.text(6.2, y_log, hsh, color='#64748b', fontsize=7.0, ha='left')
        ax.text(7.6, y_log, desc, color='#cbd5e1', fontsize=6.8, ha='left')
        ax.text(9.6, y_log, "✓ " + stat, color='#34d399', fontsize=7.0, fontweight='bold', ha='right')
        y_log -= 0.42

    plt.tight_layout()
    path = os.path.join(out_dir, 'slide6_uiux.png')
    plt.savefig(path, bbox_inches='tight', dpi=200, facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close()
    print("Saved slide6_uiux.png")

if __name__ == '__main__':
    make_slide1_visual()
    make_slide2_pyramid()
    make_slide3_circular_flow()
    make_slide3_architecture()
    make_slide5_chart()
    make_slide6_uiux()
    print("ALL DIAGRAMS GENERATED SUCCESSFULLY!")
