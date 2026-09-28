import os
import sys
from pathlib import Path
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
    PageBreak,
    KeepTogether,
    HRFlowable,
)
from reportlab.pdfgen import canvas

DOCS_DIR = Path(r"C:\Users\aryan\OneDrive\Desktop\Aura\Docs")
FRONTEND_PUBLIC_DIR = Path(r"C:\Users\aryan\OneDrive\Desktop\Aura\Frontend\public")
DOCS_DIR.mkdir(parents=True, exist_ok=True)
FRONTEND_PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

DOCX_OUTPUT = DOCS_DIR / "AURA_SENTINEL_TECHNOLOGY_RESEARCH_RESOURCE_PACK.docx"
PDF_OUTPUT = DOCS_DIR / "AURA_SENTINEL_TECHNOLOGY_RESEARCH_RESOURCE_PACK.pdf"
HTML_OUTPUT = DOCS_DIR / "AURA_SENTINEL_TECHNOLOGY_RESEARCH_RESOURCE_PACK.html"
HTML_PUBLIC_OUTPUT = FRONTEND_PUBLIC_DIR / "AURA_SENTINEL_RESOURCE_PACK.html"

# ==============================================================================
# 1. GENERATE DOCX FILE
# ==============================================================================
def create_docx():
    print("Generating DOCX resource pack...")
    doc = docx.Document()

    # Page Margins
    for section in doc.sections:
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    # Helper Styles
    NAVY_HEX = "0B1220"
    BLUE_HEX = "0284C7"
    CYAN_HEX = "0891B2"
    DARK_CARD = "16213A"
    TEXT_MUTED = "64748B"

    def set_cell_background(cell, fill_hex):
        tcPr = cell._tc.get_or_add_tcPr()
        shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
        tcPr.append(shd)

    def set_cell_margins(cell, top=120, bottom=120, left=150, right=150):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = parse_xml(
            f'<w:tcMar {nsdecls("w")}>'
            f'<w:top w:w="{top}" w:type="dxa"/>'
            f'<w:bottom w:w="{bottom}" w:type="dxa"/>'
            f'<w:left w:w="{left}" w:type="dxa"/>'
            f'<w:right w:w="{right}" w:type="dxa"/>'
            f'</w:tcMar>'
        )
        tcPr.append(tcMar)

    # --- TITLE / COVER BLOCK ---
    title_p = doc.add_paragraph()
    title_p.paragraph_format.space_before = Pt(10)
    title_p.paragraph_format.space_after = Pt(2)
    run_sub = title_p.add_run("SMART INDIA HACKATHON 2026 • PROBLEM STATEMENT SIH26105\n")
    run_sub.font.name = "Arial"
    run_sub.font.size = Pt(9.5)
    run_sub.font.bold = True
    run_sub.font.color.rgb = RGBColor(8, 145, 178)

    run_title = title_p.add_run("A.U.R.A. SENTINEL\n")
    run_title.font.name = "Arial"
    run_title.font.size = Pt(26)
    run_title.font.bold = True
    run_title.font.color.rgb = RGBColor(11, 18, 32)

    run_tag = title_p.add_run("Autonomous Unified Risk Analytics Platform\n")
    run_tag.font.name = "Arial"
    run_tag.font.size = Pt(13)
    run_tag.font.bold = True
    run_tag.font.color.rgb = RGBColor(2, 132, 199)

    run_sub2 = title_p.add_run("AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform\n")
    run_sub2.font.name = "Arial"
    run_sub2.font.size = Pt(10.5)
    run_sub2.font.italic = True
    run_sub2.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_paragraph() # Spacer

    # Metadata Box Table
    meta_table = doc.add_table(rows=2, cols=3)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_table.autofit = False

    meta_headers = ["PROBLEM STATEMENT", "SUBMITTING TEAM", "THEME & CATEGORY"]
    meta_values = [
        "SIH26105 (Enterprise Defense)",
        "ByteForce_1 (ID: 180219)",
        "Blockchain & Cybersecurity"
    ]

    for col_idx, text in enumerate(meta_headers):
        cell = meta_table.cell(0, col_idx)
        cell.text = text
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=100, bottom=80, left=120, right=120)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Arial"
            run.font.size = Pt(8.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(34, 211, 238)

    for col_idx, text in enumerate(meta_values):
        cell = meta_table.cell(1, col_idx)
        cell.text = text
        set_cell_background(cell, "F1F5F9")
        set_cell_margins(cell, top=120, bottom=120, left=120, right=120)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.CENTER
        for run in p.runs:
            run.font.name = "Arial"
            run.font.size = Pt(9.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(15, 23, 42)

    doc.add_paragraph() # Spacer

    # Document Purpose Banner
    d_banner = doc.add_paragraph()
    d_banner.paragraph_format.space_before = Pt(8)
    d_banner.paragraph_format.space_after = Pt(14)
    r_b = d_banner.add_run("DOCUMENT: Technology, Research & Implementation Resource Pack\n")
    r_b.font.name = "Arial"
    r_b.font.size = Pt(14)
    r_b.font.bold = True
    r_b.font.color.rgb = RGBColor(11, 18, 32)
    r_b2 = d_banner.add_run("Purpose: Provide SIH evaluators with rigorous algorithmic traceability, architectural justification, source code file links, and verified academic references for all implemented modules in AURA Sentinel.")
    r_b2.font.name = "Arial"
    r_b2.font.size = Pt(10)
    r_b2.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph() # Spacer

    # ==========================================================================
    # SECTION 1: TECHNOLOGY IMPLEMENTATION MATRIX
    # ==========================================================================
    h1 = doc.add_heading("1. Technology Implementation Matrix", level=1)
    h1.runs[0].font.name = "Arial"
    h1.runs[0].font.color.rgb = RGBColor(11, 18, 32)

    p_intro = doc.add_paragraph("The following matrix maps the verified technologies implemented in the current AURA Sentinel codebase directly to their operational purpose, functional usage, and official external documentation:")
    p_intro.paragraph_format.space_after = Pt(10)

    tech_data = [
        [
            "Technology / Model",
            "Purpose in AURA",
            "How AURA Uses It",
            "Implementation Status",
            "Official Research / Documentation"
        ],
        [
            "YOLOv8\n(Ultralytics)",
            "Real-Time Object Detection",
            "Used for computer-vision based operator presence detection, monitoring physical workstation boundaries and triggering auto-lock.",
            "IMPLEMENTED\n(Verified)",
            "https://docs.ultralytics.com/models/yolov8/"
        ],
        [
            "MITRE ATT&CK®\n(Enterprise)",
            "Threat Technique & Tactic Mapping",
            "Threat and port intelligence engines map detected conditions (e.g. open port 3389, anomalous process execution) to standard technique identifiers (T1046, T1021, T1059).",
            "IMPLEMENTED\n(Verified)",
            "https://attack.mitre.org/"
        ],
        [
            "psutil + OS APIs\n(Kernel Hooks)",
            "System & Network Telemetry",
            "Collects real-time kernel-level telemetry including CPU utilization, physical/virtual RAM saturation, disk throughput, active process tables, and listening network sockets.",
            "IMPLEMENTED\n(Verified)",
            "https://psutil.readthedocs.io/en/stable/"
        ],
        [
            "0/1 Knapsack DP\n(Dynamic Programming)",
            "Budget-Constrained Security Investment Optimization",
            "Selects a mathematically optimal subset of configured candidate cybersecurity defense controls under a discrete budget limit using a 2D dynamic programming table and state backtracker.",
            "IMPLEMENTED\n(Verified)",
            "https://www.cs.odu.edu/~zeil/cs361/f25-web/Public/knapsack/index.html"
        ],
        [
            "SHA-256 + Merkle Tree\n(FIPS 180-4 / RFC 6962)",
            "Tamper-Evident Audit Ledger",
            "Every security event, telemetry alert, and investment decision is hashed via SHA-256 and linked through a hierarchical Merkle tree structure, ensuring immutable local forensic auditability.",
            "IMPLEMENTED\n(Verified)",
            "SHA-256: https://csrc.nist.gov/pubs/fips/180-4/upd1/final\nMerkle Tree: https://datatracker.ietf.org/doc/rfc6962/"
        ],
        [
            "Groq Cloud SDK\n(Llama-3 / Mixtral)",
            "AURA Voice / Conversational AI Assistant",
            "Provides sub-second, low-latency conversational guidance, natural language risk queries, and contextual threat explanations through cloud LLM inference.",
            "IMPLEMENTED\n(Verified)",
            "https://console.groq.com/docs/"
        ]
    ]

    t_matrix = doc.add_table(rows=len(tech_data), cols=5)
    t_matrix.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_matrix.autofit = False

    # Widths: 1.2 in, 1.3 in, 2.0 in, 1.1 in, 1.8 in
    col_widths = [Inches(1.1), Inches(1.2), Inches(2.0), Inches(1.0), Inches(1.8)]

    for row_idx, row in enumerate(tech_data):
        for col_idx, text in enumerate(row):
            cell = t_matrix.cell(row_idx, col_idx)
            cell.width = col_widths[col_idx]
            cell.text = text
            set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
            p = cell.paragraphs[0]
            if row_idx == 0:
                set_cell_background(cell, "0F172A")
                for run in p.runs:
                    run.font.name = "Arial"
                    run.font.size = Pt(8.5)
                    run.font.bold = True
                    run.font.color.rgb = RGBColor(255, 255, 255)
            else:
                set_cell_background(cell, "FFFFFF" if row_idx % 2 != 0 else "F8FAFC")
                for run in p.runs:
                    run.font.name = "Arial"
                    run.font.size = Pt(8.5)
                    run.font.color.rgb = RGBColor(15, 23, 42)
                    if "IMPLEMENTED" in text:
                        run.font.bold = True
                        run.font.color.rgb = RGBColor(16, 185, 129)

    doc.add_page_break()

    # ==========================================================================
    # SECTION 2: AURA CORE PIPELINE & ARCHITECTURE
    # ==========================================================================
    h2 = doc.add_heading("2. AURA Core Pipeline & Architectural Flow", level=1)
    h2.runs[0].font.name = "Arial"
    h2.runs[0].font.color.rgb = RGBColor(11, 18, 32)

    p_pipe = doc.add_paragraph("AURA Sentinel establishes an automated, continuous operational pipeline transforming raw machine signals into auditable, mathematically optimized executive decisions:")
    p_pipe.paragraph_format.space_after = Pt(12)

    pipeline_stages = [
        ("1. SYSTEM / SECURITY TELEMETRY", "psutil + OS Sockets", "Asynchronous host ingestion of CPU, RAM, disk I/O, open listening sockets (e.g. 22, 3389, 443), and active OS process tables."),
        ("2. COLLECT & NORMALIZE", "FastAPI + Pydantic", "Multi-source log ingestion, schema standardization, timestamp synchronization, and structured JSON record creation."),
        ("3. THREAT / SIGNAL ANALYSIS", "MITRE ATT&CK Matrix", "Dynamic mapping of listening ports and abnormal process behaviors to MITRE ATT&CK technique IDs (T1046, T1021, T1059) and baseline deviation scoring."),
        ("4. RISK ENGINE", "Statistical Risk Scorer", "Composite multi-factor cyber risk scoring (0–100 scale), combining asset criticality, signal density, and threat severity."),
        ("5. FINANCIAL EXPOSURE", "Actuarial Loss Model", "Translation of technical risk severity (e.g. score 82/100) into potential enterprise rupee liability (e.g. ₹8L–₹15L illustrative prototype output)."),
        ("6. WHAT-IF SIMULATION", "Wargame Modeler", "Interactive scenario stress-testing across configurable threat vectors (open ports, simulated attack clusters, resource spikes) with real-time delta reporting."),
        ("7. 0/1 KNAPSACK OPTIMIZATION", "Dynamic Programming", "Exact discrete budget optimization maximizing defense mitigation value under hard budget constraints (∑ cost_i ≤ Budget) with zero greedy shortcuts."),
        ("8. AI EXPLANATION", "Groq LPU (Llama-3)", "Natural language justification, board-level risk driver summaries, and conversational Q&A assistance."),
        ("9. BLOCKCHAIN AUDIT LEDGER", "SHA-256 + Merkle Tree", "Cryptographic block sealing and parent-hash linking, guaranteeing tamper-evident forensic non-repudiation.")
    ]

    for title, tech, desc in pipeline_stages:
        p_st = doc.add_paragraph()
        p_st.paragraph_format.space_before = Pt(4)
        p_st.paragraph_format.space_after = Pt(4)
        r_t = p_st.add_run(f"• {title} ")
        r_t.font.name = "Arial"
        r_t.font.bold = True
        r_t.font.size = Pt(10)
        r_t.font.color.rgb = RGBColor(2, 132, 199)

        r_tech = p_st.add_run(f"[{tech}]: ")
        r_tech.font.name = "Arial"
        r_tech.font.bold = True
        r_tech.font.size = Pt(9.5)
        r_tech.font.color.rgb = RGBColor(11, 18, 32)

        r_desc = p_st.add_run(desc)
        r_desc.font.name = "Arial"
        r_desc.font.size = Pt(9.5)
        r_desc.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph() # Spacer

    # ==========================================================================
    # SECTION 3: IMPLEMENTED AURA MODULES
    # ==========================================================================
    h3 = doc.add_heading("3. Implemented AURA Modules", level=1)
    h3.runs[0].font.name = "Arial"
    h3.runs[0].font.color.rgb = RGBColor(11, 18, 32)

    doc.add_paragraph("Detailed specifications for all 12 operational modules present in the current build:")

    modules_data = [
        ("01. System Monitoring", "psutil + OS APIs", "Monitors real-time CPU, RAM, disk I/O, and active process telemetry.", "Backend/main.py, Frontend/src/components/modules/SystemMonitoring.jsx"),
        ("02. Risk Intelligence", "Statistical Scorer", "Computes composite cyber risk scores (0-100) from telemetry indicators.", "Ai_Engine/Risk_engine/risk_scorer.py, Backend/main.py"),
        ("03. Attack Surface & Threat Intel", "MITRE ATT&CK", "Scans listening ports, maps network exposure to MITRE tactics (T1046, T1021).", "Ai_Engine/Detection/threat_detector.py, Backend/main.py"),
        ("04. Financial Risk Engine", "Loss Modeling", "Translates technical cyber risk into potential monetary loss exposure (₹8L–₹15L prototype output).", "Ai_Engine/Risk_engine/financial_engine.py, Backend/services/financial_engine.py"),
        ("05. What-If Engine", "Sensitivity Analyzer", "Interactive wargame simulating attack vector shifts and compute saturation deltas.", "Backend/main.py, Frontend/src/components/modules/WhatIfEngine.jsx"),
        ("06. Investment Optimizer", "0/1 Knapsack DP", "Mathematically optimal discrete budget allocation maximizing security value under cost ceilings.", "Backend/investment_optimizer.py, Backend/test_knapsack.py"),
        ("07. Blockchain Audit Ledger", "SHA-256 + Merkle", "Tamper-evident cryptographic ledger hashing all decisions and events with Proof-of-Work sealing.", "Backend/blockchain_ledger.py, Database/blockchain_ledger.json"),
        ("08. AURA Voice / AI Assistant", "Groq LPU SDK", "Sub-second natural language risk query processing and conversational security co-pilot.", "Ai_Engine/providers/groq_provider.py, Backend/main.py"),
        ("09. YOLOv8 Object Detection", "Ultralytics YOLOv8", "Computer vision model detecting physical perimeter objects and operator workstation presence.", "Backend/main.py (yolov8n.pt), Ai_Engine/Tracking/vision_tracker.py"),
        ("10. MediaPipe Gesture Control", "MediaPipe Hands", "Touchless hand gesture recognition for contactless workstation locking and navigation.", "Ai_Engine/Detection/gesture_controller.py, Ai_Engine/Tracking/presence_lock.py"),
        ("11. Credential / Sensitive File Scan", "Heuristic Rules", "Detects unencrypted API keys, private keys (.pem), and leaked passwords on the host file system.", "Backend/main.py (/api/file-security/scan), Frontend/src/components/modules/FileSecurity.jsx"),
        ("12. Quarantine Vault", "send2trash / Isolation", "Safely moves identified malicious/suspicious files to an isolated quarantine directory with restore capability.", "Backend/main.py (/api/file-security/quarantine), Frontend/src/components/modules/FileSecurity.jsx")
    ]

    t_mod = doc.add_table(rows=len(modules_data) + 1, cols=4)
    t_mod.alignment = WD_TABLE_ALIGNMENT.CENTER
    t_mod.autofit = False

    mod_widths = [Inches(1.8), Inches(1.3), Inches(2.3), Inches(1.7)]
    mod_headers = ["Module Name", "Primary Technology", "Functional Capability", "Source Code Location"]

    for col_idx, h_text in enumerate(mod_headers):
        cell = t_mod.cell(0, col_idx)
        cell.width = mod_widths[col_idx]
        cell.text = h_text
        set_cell_background(cell, "0F172A")
        set_cell_margins(cell, top=100, bottom=100, left=100, right=100)
        p = cell.paragraphs[0]
        for run in p.runs:
            run.font.name = "Arial"
            run.font.size = Pt(8.5)
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    for row_idx, row_vals in enumerate(modules_data, start=1):
        for col_idx, text in enumerate(row_vals):
            cell = t_mod.cell(row_idx, col_idx)
            cell.width = mod_widths[col_idx]
            cell.text = text
            set_cell_background(cell, "FFFFFF" if row_idx % 2 != 0 else "F8FAFC")
            set_cell_margins(cell, top=80, bottom=80, left=90, right=90)
            p = cell.paragraphs[0]
            for run in p.runs:
                run.font.name = "Arial"
                run.font.size = Pt(8.5)
                run.font.color.rgb = RGBColor(15, 23, 42)
                if col_idx == 0:
                    run.font.bold = True

    doc.add_page_break()

    # ==========================================================================
    # SECTION 4: CODE / SOURCE TRACEABILITY
    # ==========================================================================
    h4 = doc.add_heading("4. Code / Source Traceability", level=1)
    h4.runs[0].font.name = "Arial"
    h4.runs[0].font.color.rgb = RGBColor(11, 18, 32)

    doc.add_paragraph("Every major capability in AURA Sentinel is verifiable against specific files in the project repository:")

    traceability_records = [
        ("0/1 Knapsack Investment Optimizer", "Backend/investment_optimizer.py", "Backend/test_knapsack.py", "Implements 2D dynamic programming table recurrence, backtracking, discretization, and financial exposure calculations. Verified by 10 automated unit tests (0.006s)."),
        ("Blockchain Audit Ledger", "Backend/blockchain_ledger.py", "Database/blockchain_ledger.json", "Implements SHA-256 block hashing, parent-hash validation, Merkle root calculation, Proof-of-Work mining, and tamper detection."),
        ("Financial Risk Engine", "Ai_Engine/Risk_engine/financial_engine.py", "Backend/services/financial_engine.py", "Actuarial formula transforming technical CVSS risk scores into lower/median/upper rupee liability estimates."),
        ("Threat & MITRE Detection", "Ai_Engine/Detection/threat_detector.py", "Backend/main.py", "Inspects listening sockets and network exposure, mapping anomalies to MITRE ATT&CK techniques (T1046, T1021)."),
        ("System Telemetry Engine", "Backend/main.py", "Ai_Engine/Anomaly/system_anomaly.py", "Uses psutil to stream CPU, RAM, disk I/O, process lists, and listening ports on a 1-second interval."),
        ("YOLOv8 & MediaPipe Tracking", "Backend/main.py, Ai_Engine/Detection/gesture_controller.py", "Backend/yolov8n.pt", "Performs real-time perimeter object tracking via Ultralytics YOLOv8 and touchless gesture control via MediaPipe."),
        ("What-If Simulation Engine", "Backend/main.py (/api/what-if/simulate)", "Frontend/src/components/modules/WhatIfEngine.jsx", "Simulates shifts in open ports, threat signals, and server load, calculating exposure deltas."),
        ("Sensitive File & Quarantine Engine", "Backend/main.py (/api/file-security/*)", "Frontend/src/components/modules/FileSecurity.jsx", "Heuristic scanning for credentials/tokens and isolated quarantine/restore using send2trash."),
        ("Frontend Application & UI/UX", "Frontend/src/App.jsx", "Frontend/src/components/showcase/", "React 19 client with Tailwind CSS dark enterprise theme, Judge Mode, Executive SOC Console, and live module views.")
    ]

    for feat, impl, test_f, desc in traceability_records:
        p_t = doc.add_paragraph()
        p_t.paragraph_format.space_before = Pt(4)
        p_t.paragraph_format.space_after = Pt(4)
        
        rf = p_t.add_run(f"• Feature: {feat}\n")
        rf.font.name = "Arial"
        rf.font.bold = True
        rf.font.size = Pt(9.5)
        rf.font.color.rgb = RGBColor(2, 132, 199)

        ri = p_t.add_run(f"  Implementation: ")
        ri.font.name = "Arial"
        ri.font.bold = True
        ri.font.size = Pt(9)
        ri2 = p_t.add_run(f"{impl}\n")
        ri2.font.name = "Courier New"
        ri2.font.size = Pt(8.5)
        ri2.font.color.rgb = RGBColor(15, 23, 42)

        rt = p_t.add_run(f"  Verification Path: ")
        rt.font.name = "Arial"
        rt.font.bold = True
        rt.font.size = Pt(9)
        rt2 = p_t.add_run(f"{test_f}\n")
        rt2.font.name = "Courier New"
        rt2.font.size = Pt(8.5)
        rt2.font.color.rgb = RGBColor(71, 85, 105)

        rd = p_t.add_run(f"  Description: {desc}")
        rd.font.name = "Arial"
        rd.font.size = Pt(9)
        rd.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_paragraph() # Spacer

    # ==========================================================================
    # SECTION 5: RESEARCH REFERENCES & STANDARDS
    # ==========================================================================
    h5 = doc.add_heading("5. Research References & Standards", level=1)
    h5.runs[0].font.name = "Arial"
    h5.runs[0].font.color.rgb = RGBColor(11, 18, 32)

    doc.add_paragraph("Authoritative academic papers, federal standards, and technical documentation referenced in AURA Sentinel:")

    references_list = [
        ("YOLOv8 — Real-Time Object Detection", "Ultralytics", "Provides the vision architecture for operator presence tracking and workstation boundary surveillance.", "https://docs.ultralytics.com/models/yolov8/"),
        ("MITRE ATT&CK® Enterprise Matrix", "MITRE Corporation", "Standardized knowledge base of adversary tactics and techniques used for normalizing host anomalies.", "https://attack.mitre.org/"),
        ("psutil — Cross-Platform Process & System Telemetry", "Giampaolo Rodola", "Foundational Python library for gathering kernel-level hardware and operating system telemetry.", "https://psutil.readthedocs.io/en/stable/"),
        ("0/1 Knapsack Dynamic Programming", "Old Dominion University CS", "Mathematical table recurrence formulation for solving discrete non-fractional budget optimization.", "https://www.cs.odu.edu/~zeil/cs361/f25-web/Public/knapsack/index.html"),
        ("NIST FIPS 180-4 — Secure Hash Standard (SHA-256)", "NIST Computer Security Resource Center", "Federal standard defining the cryptographic hashing algorithm used across AURA Merkle blocks.", "https://csrc.nist.gov/pubs/fips/180-4/upd1/final"),
        ("RFC 6962 — Certificate Transparency / Merkle Tree Auditing", "Internet Engineering Task Force (IETF)", "Defines verifiable append-only log structures and Merkle audit proofs utilized in the blockchain layer.", "https://datatracker.ietf.org/doc/rfc6962/"),
        ("Groq LPU™ Inference Engine", "Groq Inc.", "Low-latency tensor infrastructure powering natural language query processing for the AURA co-pilot.", "https://console.groq.com/docs/")
    ]

    for title, org, why, url in references_list:
        p_ref = doc.add_paragraph()
        p_ref.paragraph_format.space_before = Pt(4)
        p_ref.paragraph_format.space_after = Pt(6)

        rt = p_ref.add_run(f"• {title}\n")
        rt.font.name = "Arial"
        rt.font.bold = True
        rt.font.size = Pt(10)
        rt.font.color.rgb = RGBColor(11, 18, 32)

        ro = p_ref.add_run(f"  Organization: {org}\n")
        ro.font.name = "Arial"
        ro.font.size = Pt(9)
        ro.font.color.rgb = RGBColor(71, 85, 105)

        rw = p_ref.add_run(f"  Relevance to AURA: {why}\n")
        rw.font.name = "Arial"
        rw.font.size = Pt(9)
        rw.font.color.rgb = RGBColor(51, 65, 85)

        ru = p_ref.add_run(f"  Official URL: {url}")
        ru.font.name = "Courier New"
        ru.font.size = Pt(8.5)
        ru.font.color.rgb = RGBColor(2, 132, 199)

    doc.add_page_break()

    # ==========================================================================
    # SECTION 6: CURRENT VS FUTURE (STRICT DEMARCATION)
    # ==========================================================================
    h6 = doc.add_heading("6. Current Implementation vs. Future Roadmap", level=1)
    h6.runs[0].font.name = "Arial"
    h6.runs[0].font.color.rgb = RGBColor(11, 18, 32)

    doc.add_paragraph("To preserve strict academic integrity, this section clearly separates implemented features from future research horizons:")

    h6_a = doc.add_heading("A. Currently Implemented (Active in Build)", level=2)
    h6_a.runs[0].font.color.rgb = RGBColor(16, 185, 129)

    curr_items = [
        "Real-time kernel telemetry ingestion via psutil (CPU, RAM, disk, processes, sockets)",
        "Automated port scanning and MITRE ATT&CK technique mapping (T1046, T1021, T1059)",
        "Composite cyber risk scoring on 0–100 scale based on active telemetry density",
        "Actuarial financial exposure estimation (e.g. ₹8L–₹15L prototype model output)",
        "Dynamic What-If wargame simulator with real-time parameter sensitivity recalculation",
        "Mathematically rigorous 0/1 Knapsack Dynamic Programming budget optimizer (O(N·W))",
        "Tamper-evident SHA-256 Merkle blockchain audit ledger with live tamper demonstration",
        "AI conversational assistant powered by Groq LPU inference (Llama-3)",
        "Computer vision perimeter tracking with Ultralytics YOLOv8 and touchless MediaPipe gestures",
        "Host credential leak scanning and quarantined file isolation via send2trash"
    ]
    for it in curr_items:
        p = doc.add_paragraph(f"✓  {it}")
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.runs[0].font.name = "Arial"
        p.runs[0].font.size = Pt(9.5)
        p.runs[0].font.color.rgb = RGBColor(15, 23, 42)

    h6_b = doc.add_heading("B. Future Roadmap (Planned Enterprise Evolutions)", level=2)
    h6_b.runs[0].font.color.rgb = RGBColor(245, 158, 11)

    fut_items = [
        ("FAIR Quantitative Risk Methodology", "Factor Analysis of Information Risk (Open FAIR™) probabilistic Monte Carlo loss modeling to replace heuristic financial bounds."),
        ("NIST CSF 2.0 Automated Profile Mapping", "Dynamic bidirectional categorization across Govern, Identify, Protect, Detect, Respond, and Recover tiers."),
        ("NIST SP 800-30 Risk Assessment Layer", "Structured threat event catalogs, vulnerability pairing, and federal compliance matrices."),
        ("CIS Controls v8 Implementation Mapping", "Automated configuration verification against CIS benchmark baselines for endpoint and network hygiene."),
        ("ISO/IEC 27001 Control Mapping", "Annex A technical control cross-referencing and automated compliance audit logging."),
        ("Adaptive Bayesian AI Risk Forecasting", "Long-term telemetry sequence modeling to predict zero-day vulnerability emergence prior to weaponization.")
    ]
    for title, desc in fut_items:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        rt = p.add_run(f"⧖  {title}: ")
        rt.font.name = "Arial"
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = RGBColor(180, 83, 9)
        rd = p.add_run(desc)
        rd.font.name = "Arial"
        rd.font.size = Pt(9)
        rd.font.color.rgb = RGBColor(71, 85, 105)

    doc.add_paragraph() # Spacer

    # ==========================================================================
    # SECTION 7: CLAIM SAFETY & INTEGRITY STANDARDS
    # ==========================================================================
    h7 = doc.add_heading("7. Claim Safety & Evaluator Disclosures", level=1)
    h7.runs[0].font.name = "Arial"
    h7.runs[0].font.color.rgb = RGBColor(11, 18, 32)

    claim_rules = [
        ("Certification Claims", "AURA Sentinel does NOT claim formal compliance certifications (e.g., 'ISO certified', 'NIST compliant', 'DPDP certified', 'CERT-In approved') as these require independent accredited third-party auditing."),
        ("Financial Loss Modeling", "Financial figures such as ₹8L–₹15L are explicitly labeled 'Illustrative Prototype Output'. They represent mathematical model simulations designed for board-level evaluation and are not field-measured insurance warranties."),
        ("Algorithmic Optimality", "The 0/1 Knapsack optimizer produces mathematically optimal portfolios strictly 'among configured candidate investments under specified constraints'. It does not claim enterprise-wide guaranteed global optimality."),
        ("Cryptographic Ledger Integrity", "The blockchain audit layer is labeled as a 'Tamper-Evident Audit Ledger'. It uses local SHA-256 chaining and Merkle trees to detect historical data alteration; it does not claim to be 'tamper-proof' or a distributed consensus network.")
    ]

    for title, desc in claim_rules:
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        rt = p.add_run(f"• {title}: ")
        rt.font.name = "Arial"
        rt.font.bold = True
        rt.font.size = Pt(9.5)
        rt.font.color.rgb = RGBColor(220, 38, 38)
        rd = p.add_run(desc)
        rd.font.name = "Arial"
        rd.font.size = Pt(9)
        rd.font.color.rgb = RGBColor(51, 65, 85)

    doc.add_page_break()

    # ==========================================================================
    # SECTION 8: JUDGE QUICK VIEW (1-PAGE EXECUTIVE CHEAT SHEET)
    # ==========================================================================
    h8 = doc.add_heading("8. Evaluator Quick View (1-Page Summary)", level=1)
    h8.runs[0].font.name = "Arial"
    h8.runs[0].font.color.rgb = RGBColor(11, 18, 32)

    p_qv = doc.add_paragraph()
    r_qv = p_qv.add_run("AURA SENTINEL AT A GLANCE — SIH 2026 EVALUATOR CHEAT-SHEET\n")
    r_qv.font.name = "Arial"
    r_qv.font.bold = True
    r_qv.font.size = Pt(12)
    r_qv.font.color.rgb = RGBColor(2, 132, 199)

    doc.add_heading("WHAT AURA CURRENTLY DOES (VERIFIED IN CODE):", level=2)
    quick_items = [
        "1. Collects live system & network telemetry via psutil (CPU, RAM, disk, active processes, open sockets).",
        "2. Maps listening ports and threat indicators to standardized MITRE ATT&CK technique IDs (T1046, T1021).",
        "3. Calculates real-time composite cyber risk scores on a calibrated 0–100 scale.",
        "4. Translates technical CVSS risk into modeled financial exposure ranges (₹8L–₹15L illustrative output).",
        "5. Simulates dynamic what-if wargame scenarios (open ports, threat signals, compute spikes).",
        "6. Optimizes security spending using genuine 0/1 Knapsack Dynamic Programming (∑ cost_i ≤ Budget).",
        "7. Maintains a tamper-evident SHA-256 Merkle audit chain with live tamper detection demonstration.",
        "8. Delivers conversational risk intelligence and guidance via Groq LPU LLM inference."
    ]
    for it in quick_items:
        p = doc.add_paragraph(it)
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.runs[0].font.name = "Arial"
        p.runs[0].font.size = Pt(9.5)

    doc.add_heading("NEXT EVOLUTION (ROADMAP):", level=2)
    p_ne = doc.add_paragraph("Formal FAIR quantitative probability modeling, automated NIST CSF 2.0 / SP 800-30 compliance mapping, CIS Controls v8 alignment, and adaptive Bayesian AI forecasting.")
    p_ne.runs[0].font.name = "Arial"
    p_ne.runs[0].font.size = Pt(9.5)
    p_ne.runs[0].font.italic = True
    p_ne.runs[0].font.color.rgb = RGBColor(71, 85, 105)

    doc.add_heading("HOW TO VERIFY LIVE IN 60 SECONDS:", level=2)
    verif_steps = [
        "• Launch Prototype: Run '.\\run_aura_mvp.bat' or open 'http://localhost:5173'.",
        "• Test 0/1 Knapsack DP: Move budget slider from ₹3L to ₹15L — watch instantaneous O(N·W) dynamic allocation.",
        "• Run Automated Tests: Run 'python -m unittest test_knapsack.py' in Backend/ — all 10 tests pass in 0.006s.",
        "• Inspect Blockchain Ledger: Open Blockchain view and toggle 'Simulate Telemetry Tampering' to observe cryptographic hash break.",
        "• GitHub Source Code: https://github.com/aryanbaghel756-spec/AURA-SENTINEL"
    ]
    for vs in verif_steps:
        p = doc.add_paragraph(vs)
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        p.runs[0].font.name = "Arial"
        p.runs[0].font.size = Pt(9)

    doc.save(DOCX_OUTPUT)
    print(f"DOCX created successfully at: {DOCX_OUTPUT}")


# ==============================================================================
# 2. GENERATE PDF FILE (REPORTLAB)
# ==============================================================================
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Header (pages > 1)
        if self._pageNumber > 1:
            self.drawString(54, 750, "A.U.R.A. SENTINEL — Technology, Research & Implementation Resource Pack")
            self.drawRightString(612 - 54, 750, "SIH 2026 • PS-SIH26105")
            self.setStrokeColor(colors.HexColor("#CBD5E1"))
            self.setLineWidth(0.5)
            self.line(54, 744, 612 - 54, 744)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(54, 46, 612 - 54, 46)
        self.drawString(54, 34, "Team ByteForce_1 (ID: 180219) • Skyline Institute of Engineering & Technology")
        page_str = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(612 - 54, 34, page_str)
        self.restoreState()


def create_pdf():
    print("Generating PDF resource pack...")
    doc = SimpleDocTemplate(
        str(PDF_OUTPUT),
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54,
    )

    styles = getSampleStyleSheet()

    # Custom Typography Styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=24,
        leading=28,
        textColor=colors.HexColor('#0B1220'),
        spaceAfter=4,
    )

    tag_style = ParagraphStyle(
        'DocTag',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=16,
        textColor=colors.HexColor('#0284C7'),
        spaceAfter=2,
    )

    subtitle_style = ParagraphStyle(
        'DocSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor('#475569'),
        spaceAfter=14,
    )

    h1_style = ParagraphStyle(
        'Heading1Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#0B1220'),
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True,
    )

    h2_style = ParagraphStyle(
        'Heading2Custom',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True,
    )

    body_style = ParagraphStyle(
        'BodyCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor('#1E293B'),
        spaceAfter=4,
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=colors.white,
    )

    table_body_style = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=colors.HexColor('#1E293B'),
    )

    story = []

    # --- COVER BLOCK ---
    story.append(Paragraph("SMART INDIA HACKATHON 2026 • PROBLEM STATEMENT SIH26105", ParagraphStyle('TopChip', fontName='Helvetica-Bold', fontSize=8.5, leading=10, textColor=colors.HexColor('#0891B2'), spaceAfter=4)))
    story.append(Paragraph("A.U.R.A. SENTINEL", title_style))
    story.append(Paragraph("Autonomous Unified Risk Analytics Platform", tag_style))
    story.append(Paragraph("AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform", subtitle_style))

    # Meta Table
    meta_data = [
        [
            Paragraph("<b>PROBLEM STATEMENT</b>", table_header_style),
            Paragraph("<b>SUBMITTING TEAM</b>", table_header_style),
            Paragraph("<b>THEME &amp; CATEGORY</b>", table_header_style)
        ],
        [
            Paragraph("<b>SIH26105</b><br/>Enterprise Defense", table_body_style),
            Paragraph("<b>ByteForce_1</b><br/>Team ID: 180219", table_body_style),
            Paragraph("<b>Blockchain &amp; Cyber</b><br/>Software Track", table_body_style)
        ]
    ]
    t_meta = Table(meta_data, colWidths=[168, 168, 168])
    t_meta.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('BACKGROUND', (0, 1), (-1, 1), colors.HexColor('#F1F5F9')),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#CBD5E1')),
    ]))
    story.append(t_meta)
    story.append(Spacer(1, 12))

    # Document Banner
    story.append(Paragraph("<b>DOCUMENT: Technology, Research &amp; Implementation Resource Pack</b>", ParagraphStyle('B1', fontName='Helvetica-Bold', fontSize=10.5, leading=14, textColor=colors.HexColor('#0B1220'))))
    story.append(Paragraph("This resource pack provides SIH evaluators with verified algorithmic proofs, architectural justification, source code file links, and official academic citations for all implemented modules.", body_style))
    story.append(Spacer(1, 10))

    # --- SECTION 1: TECHNOLOGY IMPLEMENTATION MATRIX ---
    story.append(Paragraph("1. Technology Implementation Matrix", h1_style))
    story.append(Paragraph("The matrix below maps all implemented technologies to their functional purpose, codebase role, and official external documentation:", body_style))
    story.append(Spacer(1, 6))

    matrix_rows = [
        [
            Paragraph("<b>Technology</b>", table_header_style),
            Paragraph("<b>Purpose in AURA</b>", table_header_style),
            Paragraph("<b>How AURA Uses It</b>", table_header_style),
            Paragraph("<b>Status</b>", table_header_style),
            Paragraph("<b>Official Reference</b>", table_header_style),
        ],
        [
            Paragraph("<b>YOLOv8</b><br/>(Ultralytics)", table_body_style),
            Paragraph("Object Detection", table_body_style),
            Paragraph("Used for computer-vision based operator presence detection &amp; boundary surveillance.", table_body_style),
            Paragraph("<font color='#10B981'><b>IMPLEMENTED</b></font>", table_body_style),
            Paragraph("<font color='#0284C7'><u>docs.ultralytics.com</u></font>", table_body_style),
        ],
        [
            Paragraph("<b>MITRE ATT&amp;CK®</b>", table_body_style),
            Paragraph("Attack Technique Mapping", table_body_style),
            Paragraph("Maps open listening ports and anomalous processes to standardized techniques (T1046, T1021, T1059).", table_body_style),
            Paragraph("<font color='#10B981'><b>IMPLEMENTED</b></font>", table_body_style),
            Paragraph("<font color='#0284C7'><u>attack.mitre.org</u></font>", table_body_style),
        ],
        [
            Paragraph("<b>psutil + OS APIs</b>", table_body_style),
            Paragraph("System &amp; Network Telemetry", table_body_style),
            Paragraph("Streams kernel CPU, memory, disk I/O, process lists, and network listening sockets on 1s intervals.", table_body_style),
            Paragraph("<font color='#10B981'><b>IMPLEMENTED</b></font>", table_body_style),
            Paragraph("<font color='#0284C7'><u>psutil.readthedocs.io</u></font>", table_body_style),
        ],
        [
            Paragraph("<b>0/1 Knapsack DP</b>", table_body_style),
            Paragraph("Security Investment Optimization", table_body_style),
            Paragraph("Selects optimal non-fractional defense controls under budget constraint via O(N·W) dynamic programming.", table_body_style),
            Paragraph("<font color='#10B981'><b>IMPLEMENTED</b></font>", table_body_style),
            Paragraph("<font color='#0284C7'><u>cs.odu.edu/~zeil</u></font>", table_body_style),
        ],
        [
            Paragraph("<b>SHA-256 + Merkle</b><br/>(FIPS 180-4)", table_body_style),
            Paragraph("Tamper-Evident Audit Ledger", table_body_style),
            Paragraph("Hashes every telemetry alert and decision with SHA-256 and Merkle roots for immutable forensic proof.", table_body_style),
            Paragraph("<font color='#10B981'><b>IMPLEMENTED</b></font>", table_body_style),
            Paragraph("<font color='#0284C7'><u>csrc.nist.gov</u></font>", table_body_style),
        ],
        [
            Paragraph("<b>Groq SDK / LLM</b>", table_body_style),
            Paragraph("AURA Voice / AI Assistant", table_body_style),
            Paragraph("Provides sub-second conversational risk guidance and board-level risk explanations via Groq LPU inference.", table_body_style),
            Paragraph("<font color='#10B981'><b>IMPLEMENTED</b></font>", table_body_style),
            Paragraph("<font color='#0284C7'><u>console.groq.com</u></font>", table_body_style),
        ]
    ]

    t_matrix_pdf = Table(matrix_rows, colWidths=[75, 80, 185, 74, 90])
    t_matrix_pdf.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
    ]))
    story.append(t_matrix_pdf)
    story.append(PageBreak())

    # --- SECTION 2: AURA CORE PIPELINE ---
    story.append(Paragraph("2. AURA Core Pipeline Architecture", h1_style))
    story.append(Paragraph("The 9 operational stages converting raw machine telemetry into auditable board-level cybersecurity investments:", body_style))
    story.append(Spacer(1, 6))

    pipeline_pdf_items = [
        ("1. SYSTEM TELEMETRY", "psutil + OS Sockets", "Asynchronous host ingestion of CPU, RAM, disk I/O, open ports, and processes."),
        ("2. COLLECT & NORMALIZE", "FastAPI + Pydantic", "Multi-source log ingestion, JSON schema normalization, and timestamp synchronization."),
        ("3. THREAT ANALYSIS", "MITRE ATT&CK", "Maps active listening sockets to MITRE ATT&CK technique IDs (T1046, T1021, T1059)."),
        ("4. RISK SCORING", "Statistical Scorer", "Multi-factor composite scoring calculating technical cyber severity on a 0–100 scale."),
        ("5. FINANCIAL EXPOSURE", "Actuarial Loss Model", "Translates technical severity into modeled rupee liability (₹8L–₹15L illustrative output)."),
        ("6. WHAT-IF WARGAME", "Sensitivity Engine", "Interactive scenario simulation modeling shifts in open ports, threat signals, and load."),
        ("7. 0/1 KNAPSACK DP", "Dynamic Programming", "Discrete non-fractional budget optimizer maximizing risk mitigation strictly within budget (W)."),
        ("8. AI EXPLANATION", "Groq LPU (Llama-3)", "Sub-second contextual risk justification and conversational operator Q&A assistance."),
        ("9. BLOCKCHAIN AUDIT", "SHA-256 + Merkle", "Tamper-evident cryptographic ledger sealing all decisions with proof-of-work validation.")
    ]

    for title, tech, desc in pipeline_pdf_items:
        p_text = f"<b><font color='#0284C7'>• {title}</font></b> [<b>{tech}</b>]: {desc}"
        story.append(Paragraph(p_text, body_style))

    story.append(Spacer(1, 10))

    # --- SECTION 3: IMPLEMENTED MODULES ---
    story.append(Paragraph("3. Implemented AURA Modules (12 Modules)", h1_style))
    story.append(Paragraph("Summary of all 12 operational technical modules present in the current build:", body_style))
    story.append(Spacer(1, 6))

    mod_rows = [
        [
            Paragraph("<b>Module</b>", table_header_style),
            Paragraph("<b>Technology</b>", table_header_style),
            Paragraph("<b>Functional Capability</b>", table_header_style),
            Paragraph("<b>Source File Location</b>", table_header_style),
        ],
        [Paragraph("<b>01. System Monitoring</b>", table_body_style), Paragraph("psutil + OS APIs", table_body_style), Paragraph("Real-time CPU, RAM, disk, and process telemetry.", table_body_style), Paragraph("Backend/main.py", table_body_style)],
        [Paragraph("<b>02. Risk Intelligence</b>", table_body_style), Paragraph("Statistical Scorer", table_body_style), Paragraph("Composite cyber risk scoring on 0–100 scale.", table_body_style), Paragraph("Ai_Engine/risk_scorer.py", table_body_style)],
        [Paragraph("<b>03. Attack Surface</b>", table_body_style), Paragraph("MITRE ATT&CK", table_body_style), Paragraph("Port scanner & MITRE adversary technique mapping.", table_body_style), Paragraph("Ai_Engine/threat_detector.py", table_body_style)],
        [Paragraph("<b>04. Financial Risk</b>", table_body_style), Paragraph("Loss Modeling", table_body_style), Paragraph("Estimated financial exposure (₹8L–₹15L prototype).", table_body_style), Paragraph("Ai_Engine/financial_engine.py", table_body_style)],
        [Paragraph("<b>05. What-If Engine</b>", table_body_style), Paragraph("Wargame Modeler", table_body_style), Paragraph("Dynamic threat vector & compute stress simulation.", table_body_style), Paragraph("Backend/main.py", table_body_style)],
        [Paragraph("<b>06. Investment Optimizer</b>", table_body_style), Paragraph("0/1 Knapsack DP", table_body_style), Paragraph("Discrete budget-optimal cyber defense allocation.", table_body_style), Paragraph("Backend/investment_optimizer.py", table_body_style)],
        [Paragraph("<b>07. Blockchain Ledger</b>", table_body_style), Paragraph("SHA-256 + Merkle", table_body_style), Paragraph("Tamper-evident audit chain with tamper detection.", table_body_style), Paragraph("Backend/blockchain_ledger.py", table_body_style)],
        [Paragraph("<b>08. AURA Voice / AI</b>", table_body_style), Paragraph("Groq Cloud SDK", table_body_style), Paragraph("Conversational risk explanation & natural query.", table_body_style), Paragraph("Ai_Engine/groq_provider.py", table_body_style)],
        [Paragraph("<b>09. YOLOv8 Detection</b>", table_body_style), Paragraph("Ultralytics YOLO", table_body_style), Paragraph("Workstation presence surveillance & object tracking.", table_body_style), Paragraph("Backend/yolov8n.pt", table_body_style)],
        [Paragraph("<b>10. MediaPipe Gestures</b>", table_body_style), Paragraph("MediaPipe Hands", table_body_style), Paragraph("Touchless emergency lock & navigation gestures.", table_body_style), Paragraph("Ai_Engine/gesture_controller.py", table_body_style)],
        [Paragraph("<b>11. Sensitive File Scan</b>", table_body_style), Paragraph("Heuristic Parser", table_body_style), Paragraph("Detects leaked API keys, tokens, & private keys.", table_body_style), Paragraph("Backend/main.py", table_body_style)],
        [Paragraph("<b>12. Quarantine Vault</b>", table_body_style), Paragraph("send2trash / Vault", table_body_style), Paragraph("Safely isolates and restores suspicious host files.", table_body_style), Paragraph("Backend/main.py", table_body_style)],
    ]

    t_mod_pdf = Table(mod_rows, colWidths=[95, 85, 174, 150])
    t_mod_pdf.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#FFFFFF'), colors.HexColor('#F8FAFC')]),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 5),
        ('RIGHTPADDING', (0, 0), (-1, -1), 5),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#CBD5E1')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
    ]))
    story.append(t_mod_pdf)
    story.append(PageBreak())

    # --- SECTION 4: CODE / SOURCE TRACEABILITY ---
    story.append(Paragraph("4. Code / Source Traceability", h1_style))
    story.append(Paragraph("Direct mapping of each major feature to actual verified source files in the project:", body_style))
    story.append(Spacer(1, 6))

    trace_pdf_items = [
        ("0/1 Knapsack Budget Optimizer", "Backend/investment_optimizer.py", "Backend/test_knapsack.py", "2D DP recurrence table, backtracking, and discrete constraints. 10 passing unit tests (0.006s)."),
        ("Blockchain Audit Ledger", "Backend/blockchain_ledger.py", "Database/blockchain_ledger.json", "SHA-256 hashing, parent-hash verification, Merkle root creation, and tamper detection."),
        ("Financial Risk Engine", "Ai_Engine/Risk_engine/financial_engine.py", "Backend/services/financial_engine.py", "Translates CVSS severity into model-based financial loss liability ranges."),
        ("Threat & Port Intelligence", "Ai_Engine/Detection/threat_detector.py", "Backend/main.py", "Network socket scanner mapping open ports to MITRE ATT&CK techniques (T1046, T1021)."),
        ("System Telemetry Engine", "Backend/main.py", "Ai_Engine/Anomaly/system_anomaly.py", "Kernel telemetry stream via psutil (CPU, RAM, disk, process tables)."),
        ("YOLOv8 & MediaPipe Vision", "Backend/main.py", "Ai_Engine/Detection/gesture_controller.py", "Real-time presence lock and touchless gesture control."),
        ("Sensitive File & Quarantine", "Backend/main.py (/api/file-security/*)", "Frontend/src/components/modules/FileSecurity.jsx", "Heuristic token scanner and safe file quarantine with restore."),
        ("Frontend & Dashboard Mockup", "Frontend/src/App.jsx", "Frontend/src/components/showcase/", "React 19 client with Judge Mode, Executive SOC Console, and live module views.")
    ]

    for feat, impl, test_f, desc in trace_pdf_items:
        p_t = f"<b><font color='#0284C7'>• {feat}</font></b><br/>" \
              f"  <b>Impl:</b> <font face='Courier' color='#0F172A'>{impl}</font> | <b>Verif:</b> <font face='Courier' color='#475569'>{test_f}</font><br/>" \
              f"  <b>Description:</b> {desc}"
        story.append(Paragraph(p_t, body_style))
        story.append(Spacer(1, 3))

    story.append(Spacer(1, 8))

    # --- SECTION 5: CURRENT VS FUTURE ---
    story.append(Paragraph("5. Current Implementation vs. Future Roadmap", h1_style))
    story.append(Paragraph("<b><font color='#10B981'>CURRENTLY IMPLEMENTED (Active in Build):</font></b>", h2_style))
    story.append(Paragraph("All 12 technical modules listed above, 0/1 Knapsack DP algorithm, SHA-256 Merkle blockchain ledger, What-If simulator, and FastAPI/React architecture are fully operational in code.", body_style))

    story.append(Paragraph("<b><font color='#D97706'>FUTURE ROADMAP (Planned Enterprise Evolutions):</font></b>", h2_style))
    future_pdf_items = [
        ("FAIR Quantitative Loss Methodology", "Factor Analysis of Information Risk (Open FAIR™) Monte Carlo probability modeling."),
        ("NIST CSF 2.0 Mapping", "Automated alignment across Govern, Identify, Protect, Detect, Respond, Recover tiers."),
        ("NIST SP 800-30 Assessment", "Federal threat event cataloging and structured likelihood/impact matrices."),
        ("CIS Controls v8 Alignment", "Automated compliance checks against CIS benchmark endpoint configurations."),
        ("ISO/IEC 27001 Control Mapping", "Annex A technical control cross-referencing and compliance audit logging."),
        ("Adaptive Bayesian AI Forecasting", "Long-term telemetry sequence modeling to predict vulnerability emergence.")
    ]
    for title, desc in future_pdf_items:
        story.append(Paragraph(f"<b><font color='#B45309'>⧖ {title}:</font></b> {desc}", body_style))

    story.append(Spacer(1, 8))

    # --- SECTION 6: CLAIM SAFETY & INTEGRITY ---
    story.append(Paragraph("6. Claim Safety & Evaluator Disclosures", h1_style))
    safety_points = [
        "<b>No Certification Claims:</b> AURA Sentinel does not claim accredited compliance certifications (e.g. 'ISO certified', 'NIST compliant', 'DPDP certified') as these require independent accredited auditing.",
        "<b>Illustrative Prototype Outputs:</b> Financial figures (₹8L–₹15L) and risk scores (82/100) are explicitly labeled 'Illustrative Prototype Output'. They represent model-based simulations rather than empirical insurance claims.",
        "<b>0/1 Knapsack Optimality:</b> The algorithm produces optimal portfolios strictly 'among configured candidate investments under specified constraints'. It does not claim enterprise-wide guaranteed global optimality.",
        "<b>Tamper-Evident Ledger:</b> Labeled as a 'Tamper-Evident Audit Ledger' using SHA-256 and Merkle trees on a local node; it does not claim to be 'tamper-proof' or decentralized."
    ]
    for sp in safety_points:
        story.append(Paragraph(f"<font color='#DC2626'>•</font> {sp}", body_style))

    story.append(PageBreak())

    # --- SECTION 7: JUDGE QUICK VIEW ---
    story.append(Paragraph("7. Evaluator Quick View (1-Page Summary)", h1_style))
    story.append(Paragraph("<b>AURA SENTINEL AT A GLANCE — SIH 2026 EVALUATOR CHEAT-SHEET</b>", tag_style))
    story.append(Spacer(1, 6))

    story.append(Paragraph("<b>WHAT AURA CURRENTLY DOES (100% IMPLEMENTED):</b>", h2_style))
    quick_bullets = [
        "1. Ingests kernel-level system telemetry (CPU, RAM, disk, processes, open ports) via psutil.",
        "2. Maps listening ports and anomalous activities to standardized MITRE ATT&CK techniques (T1046, T1021).",
        "3. Computes real-time composite cyber risk scores on a calibrated 0–100 scale.",
        "4. Translates technical CVSS scores into model-based financial exposure estimates (₹8L–₹15L prototype).",
        "5. Simulates dynamic what-if wargame scenarios with instant risk and liability delta updates.",
        "6. Optimizes security investment portfolios using genuine 0/1 Knapsack Dynamic Programming (∑ cost_i ≤ W).",
        "7. Maintains a tamper-evident SHA-256 Merkle audit chain with live tamper detection verification.",
        "8. Provides conversational risk intelligence and co-pilot guidance via Groq LPU LLM inference."
    ]
    for qb in quick_bullets:
        story.append(Paragraph(qb, body_style))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>NEXT EVOLUTION:</b> Formal FAIR Monte Carlo distributions, NIST CSF 2.0 / SP 800-30 mapping, CIS Controls v8 alignment, and Bayesian predictive AI.", ParagraphStyle('NeP', parent=body_style, fontName='Helvetica-Oblique', textColor=colors.HexColor('#475569'))))

    story.append(Spacer(1, 6))
    story.append(Paragraph("<b>HOW TO VERIFY LIVE IN 60 SECONDS:</b>", h2_style))
    verif_pdf = [
        "<b>• Launch Prototype:</b> Run '.\\run_aura_mvp.bat' or visit http://localhost:5173",
        "<b>• Test 0/1 Knapsack DP:</b> Adjust budget slider (₹3L–₹15L) to observe real-time O(N·W) dynamic allocation.",
        "<b>• Run Unit Tests:</b> Execute 'python -m unittest test_knapsack.py' in Backend/ (10 tests pass in 0.006s).",
        "<b>• Inspect Blockchain Ledger:</b> Toggle 'Simulate Telemetry Tampering' to view cryptographic hash breaks.",
        "<b>• GitHub Repository:</b> https://github.com/aryanbaghel756-spec/AURA-SENTINEL"
    ]
    for vp in verif_pdf:
        story.append(Paragraph(vp, body_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF created successfully at: {PDF_OUTPUT}")


# ==============================================================================
# 3. GENERATE WEB / HTML VERSION
# ==============================================================================
def create_html():
    print("Generating Web/HTML resource pack...")
    html_content = """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>AURA Sentinel — Technology & Research Resource Pack (SIH 2026)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #080D18;
      --bg-card: #0F172A;
      --bg-card-hover: #16213A;
      --border: #1F2E4D;
      --cyan: #22D3EE;
      --cyan-glow: rgba(34, 211, 238, 0.2);
      --emerald: #10B981;
      --amber: #F59E0B;
      --rose: #F43F5E;
      --text-main: #F8FAFC;
      --text-muted: #94A3B8;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: var(--bg-dark);
      color: var(--text-main);
      font-family: 'Inter', system-ui, sans-serif;
      line-height: 1.6;
      padding: 2rem 1rem;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
    }
    .header-card {
      background: linear-gradient(135deg, #0F172A 0%, #16213A 100%);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 2.5rem 2rem;
      margin-bottom: 2rem;
      box-shadow: 0 0 40px rgba(0,0,0,0.5);
      position: relative;
    }
    .chip {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      font-weight: 700;
      color: var(--cyan);
      background: rgba(34, 211, 238, 0.1);
      border: 1px solid rgba(34, 211, 238, 0.3);
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
    }
    h1 {
      font-size: 2.5rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      color: #FFFFFF;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      font-size: 1.15rem;
      color: var(--cyan);
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 0.5rem;
    }
    .desc {
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border);
    }
    .meta-item {
      background: rgba(15, 23, 42, 0.6);
      border: 1px solid var(--border);
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
    }
    .meta-label {
      font-size: 0.7rem;
      font-family: 'JetBrains Mono', monospace;
      color: var(--text-muted);
      text-transform: uppercase;
    }
    .meta-value {
      font-size: 0.9rem;
      font-weight: 700;
      color: #FFFFFF;
    }
    .actions-bar {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
      flex-wrap: wrap;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.65rem 1.25rem;
      border-radius: 0.5rem;
      font-size: 0.85rem;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
      text-decoration: none;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .btn-primary {
      background: linear-gradient(135deg, #06B6D4 0%, #0284C7 100%);
      color: #080D18;
      border: none;
    }
    .btn-secondary {
      background: var(--bg-card);
      border: 1px solid var(--border);
      color: var(--text-main);
    }
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(34, 211, 238, 0.3);
    }
    .section-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 2rem;
    }
    h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 1rem;
      border-bottom: 1px solid var(--border);
      padding-bottom: 0.75rem;
    }
    h3 {
      font-size: 1.15rem;
      color: var(--cyan);
      margin: 1.25rem 0 0.5rem 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1rem 0;
      font-size: 0.85rem;
    }
    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border: 1px solid var(--border);
    }
    th {
      background: #080D18;
      color: var(--cyan);
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.75rem;
      text-transform: uppercase;
    }
    tr:nth-child(even) {
      background: rgba(15, 23, 42, 0.4);
    }
    .status-badge {
      display: inline-block;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.7rem;
      font-weight: 700;
      color: var(--emerald);
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.2rem 0.5rem;
      border-radius: 0.25rem;
    }
    .code-chip {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #38BDF8;
      background: rgba(56, 189, 248, 0.1);
      padding: 0.1rem 0.4rem;
      border-radius: 0.25rem;
    }
    .callout {
      border-left: 4px solid var(--amber);
      background: rgba(245, 158, 11, 0.08);
      padding: 1rem 1.25rem;
      border-radius: 0 0.5rem 0.5rem 0;
      margin: 1rem 0;
      font-size: 0.85rem;
    }
    .callout-danger {
      border-left-color: var(--rose);
      background: rgba(244, 63, 94, 0.08);
    }
    .callout-success {
      border-left-color: var(--emerald);
      background: rgba(16, 185, 129, 0.08);
    }
    ul {
      margin-left: 1.5rem;
      margin-top: 0.5rem;
      font-size: 0.9rem;
    }
    li {
      margin-bottom: 0.5rem;
    }
    a {
      color: var(--cyan);
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    @media print {
      body { background: #FFFFFF; color: #000000; padding: 0; }
      .header-card, .section-card { border: 1px solid #CCCCCC; box-shadow: none; background: #FFFFFF; color: #000000; }
      h1, h2, h3 { color: #000000; }
      th { background: #EEEEEE; color: #000000; }
      td, th { border: 1px solid #DDDDDD; }
      .actions-bar { display: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    
    <!-- HEADER CARD -->
    <div class="header-card">
      <span class="chip">Smart India Hackathon 2026 • PS-SIH26105</span>
      <h1>A.U.R.A. SENTINEL</h1>
      <div class="subtitle">Autonomous Unified Risk Analytics Platform</div>
      <p class="desc">AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform</p>
      
      <div class="meta-grid">
        <div class="meta-item">
          <div class="meta-label">Problem Statement</div>
          <div class="meta-value">SIH26105 (Enterprise Defense)</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Submitting Team</div>
          <div class="meta-value">ByteForce_1 (ID: 180219)</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Theme & Category</div>
          <div class="meta-value">Blockchain & Cybersecurity</div>
        </div>
        <div class="meta-item">
          <div class="meta-label">Academic Institution</div>
          <div class="meta-value">Skyline Institute of Eng & Tech</div>
        </div>
      </div>

      <div class="actions-bar">
        <a href="AURA_SENTINEL_TECHNOLOGY_RESEARCH_RESOURCE_PACK.pdf" download class="btn btn-primary">
          📥 Download Evaluator PDF
        </a>
        <a href="AURA_SENTINEL_TECHNOLOGY_RESEARCH_RESOURCE_PACK.docx" download class="btn btn-secondary">
          📄 Download Editable DOCX
        </a>
        <a href="https://github.com/aryanbaghel756-spec/AURA-SENTINEL" target="_blank" class="btn btn-secondary">
          🐙 View GitHub Repository
        </a>
        <a href="/" class="btn btn-secondary">
          🌐 Launch Interactive Website
        </a>
      </div>
    </div>

    <!-- SECTION 1: TECHNOLOGY IMPLEMENTATION MATRIX -->
    <div class="section-card">
      <h2>1. Technology Implementation Matrix</h2>
      <p class="desc">Only technologies verified in the current AURA Sentinel codebase are documented below:</p>

      <table>
        <thead>
          <tr>
            <th>Technology / Model</th>
            <th>Purpose in AURA</th>
            <th>How AURA Uses It</th>
            <th>Status</th>
            <th>Official Reference</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>YOLOv8</strong><br/><span class="desc">Ultralytics</span></td>
            <td>Object Detection</td>
            <td>Computer-vision based operator presence detection & physical boundary surveillance.</td>
            <td><span class="status-badge">IMPLEMENTED</span></td>
            <td><a href="https://docs.ultralytics.com/models/yolov8/" target="_blank">docs.ultralytics.com ↗</a></td>
          </tr>
          <tr>
            <td><strong>MITRE ATT&CK®</strong><br/><span class="desc">Enterprise</span></td>
            <td>Threat Technique Mapping</td>
            <td>Maps open ports and anomalies to technique IDs (T1046, T1021, T1059).</td>
            <td><span class="status-badge">IMPLEMENTED</span></td>
            <td><a href="https://attack.mitre.org/" target="_blank">attack.mitre.org ↗</a></td>
          </tr>
          <tr>
            <td><strong>psutil + OS APIs</strong><br/><span class="desc">Kernel Hooks</span></td>
            <td>System Telemetry</td>
            <td>Continuous streaming of CPU, memory, disk I/O, process tables, and sockets.</td>
            <td><span class="status-badge">IMPLEMENTED</span></td>
            <td><a href="https://psutil.readthedocs.io/en/stable/" target="_blank">psutil.readthedocs.io ↗</a></td>
          </tr>
          <tr>
            <td><strong>0/1 Knapsack DP</strong><br/><span class="desc">Dynamic Prog.</span></td>
            <td>Investment Optimizer</td>
            <td>Selects optimal non-fractional security controls under budget constraint (∑ c_i ≤ W).</td>
            <td><span class="status-badge">IMPLEMENTED</span></td>
            <td><a href="https://www.cs.odu.edu/~zeil/cs361/f25-web/Public/knapsack/index.html" target="_blank">cs.odu.edu ↗</a></td>
          </tr>
          <tr>
            <td><strong>SHA-256 + Merkle</strong><br/><span class="desc">FIPS 180-4 / RFC 6962</span></td>
            <td>Tamper-Evident Ledger</td>
            <td>Cryptographically hashes alerts and allocations with Merkle root verification.</td>
            <td><span class="status-badge">IMPLEMENTED</span></td>
            <td><a href="https://csrc.nist.gov/pubs/fips/180-4/upd1/final" target="_blank">csrc.nist.gov ↗</a></td>
          </tr>
          <tr>
            <td><strong>Groq SDK / LLM</strong><br/><span class="desc">LPU Tensor Engine</span></td>
            <td>AURA Voice / AI Co-Pilot</td>
            <td>Sub-second natural language risk query answering and board-level risk explanations.</td>
            <td><span class="status-badge">IMPLEMENTED</span></td>
            <td><a href="https://console.groq.com/docs/" target="_blank">console.groq.com ↗</a></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SECTION 2: AURA CORE PIPELINE -->
    <div class="section-card">
      <h2>2. AURA Core Pipeline & Architecture</h2>
      <p class="desc">The 9-stage autonomous pipeline linking raw telemetry to board-level investments:</p>
      
      <ul>
        <li><strong>1. System Telemetry Ingest</strong> [<span class="code-chip">psutil + OS Sockets</span>]: Continuous streaming of CPU, RAM, disk, and listening sockets.</li>
        <li><strong>2. Collect & Normalize</strong> [<span class="code-chip">FastAPI + Pydantic</span>]: Multi-source schema validation and timestamp normalization.</li>
        <li><strong>3. Threat / Signal Analysis</strong> [<span class="code-chip">MITRE ATT&CK</span>]: Maps anomalous activity to adversary tactics (T1046, T1021).</li>
        <li><strong>4. Risk Engine</strong> [<span class="code-chip">Statistical Scorer</span>]: Composite technical cyber severity scoring (0–100 scale).</li>
        <li><strong>5. Financial Exposure</strong> [<span class="code-chip">Actuarial Loss Model</span>]: Translates CVSS risk to rupee exposure ranges (₹8L–₹15L prototype).</li>
        <li><strong>6. What-If Simulation</strong> [<span class="code-chip">Sensitivity Analyzer</span>]: Dynamic wargame testing of open ports, threat signals, and load deltas.</li>
        <li><strong>7. 0/1 Knapsack DP Optimization</strong> [<span class="code-chip">Dynamic Programming</span>]: Solves discrete budget allocation maximizing security value.</li>
        <li><strong>8. AI Contextual Explanation</strong> [<span class="code-chip">Groq Cloud LPU</span>]: Natural language summaries and executive defense justification.</li>
        <li><strong>9. Blockchain Audit Ledger</strong> [<span class="code-chip">SHA-256 + Merkle</span>]: Immutable cryptographic sealing and parent-hash linking.</li>
      </ul>
    </div>

    <!-- SECTION 3: IMPLEMENTED MODULES -->
    <div class="section-card">
      <h2>3. Implemented AURA Modules (12 Modules)</h2>
      
      <table>
        <thead>
          <tr>
            <th>Module Name</th>
            <th>Primary Technology</th>
            <th>Functional Description</th>
            <th>Source Code Location</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>01. System Monitoring</strong></td>
            <td>psutil + OS APIs</td>
            <td>Real-time CPU, RAM, disk throughput, and active process inspection.</td>
            <td><span class="code-chip">Backend/main.py</span></td>
          </tr>
          <tr>
            <td><strong>02. Risk Intelligence</strong></td>
            <td>Statistical Risk Scorer</td>
            <td>Multi-factor composite risk scoring (0–100) based on signal density.</td>
            <td><span class="code-chip">Ai_Engine/risk_scorer.py</span></td>
          </tr>
          <tr>
            <td><strong>03. Attack Surface Intel</strong></td>
            <td>MITRE ATT&CK</td>
            <td>Listening port scanner and MITRE adversary technique mapping.</td>
            <td><span class="code-chip">Ai_Engine/threat_detector.py</span></td>
          </tr>
          <tr>
            <td><strong>04. Financial Risk Engine</strong></td>
            <td>Actuarial Loss Model</td>
            <td>Translates technical risk to potential exposure (₹8L–₹15L prototype).</td>
            <td><span class="code-chip">Ai_Engine/financial_engine.py</span></td>
          </tr>
          <tr>
            <td><strong>05. What-If Engine</strong></td>
            <td>Sensitivity Analyzer</td>
            <td>Simulates threat vector shifts and computes risk/exposure deltas.</td>
            <td><span class="code-chip">Backend/main.py</span></td>
          </tr>
          <tr>
            <td><strong>06. Investment Optimizer</strong></td>
            <td>0/1 Knapsack DP</td>
            <td>Mathematically optimal defense allocation within budget limits.</td>
            <td><span class="code-chip">Backend/investment_optimizer.py</span></td>
          </tr>
          <tr>
            <td><strong>07. Blockchain Audit Ledger</strong></td>
            <td>SHA-256 + Merkle</td>
            <td>Tamper-evident cryptographic ledger with interactive tamper demo.</td>
            <td><span class="code-chip">Backend/blockchain_ledger.py</span></td>
          </tr>
          <tr>
            <td><strong>08. AURA Voice / AI</strong></td>
            <td>Groq Cloud SDK</td>
            <td>Conversational security co-pilot answering risk and defense queries.</td>
            <td><span class="code-chip">Ai_Engine/groq_provider.py</span></td>
          </tr>
          <tr>
            <td><strong>09. YOLOv8 Detection</strong></td>
            <td>Ultralytics YOLOv8</td>
            <td>Real-time operator presence verification & perimeter surveillance.</td>
            <td><span class="code-chip">Backend/yolov8n.pt</span></td>
          </tr>
          <tr>
            <td><strong>10. MediaPipe Gestures</strong></td>
            <td>MediaPipe Hands</td>
            <td>Touchless gesture navigation and emergency workstation lock.</td>
            <td><span class="code-chip">Ai_Engine/gesture_controller.py</span></td>
          </tr>
          <tr>
            <td><strong>11. Sensitive File Scan</strong></td>
            <td>Heuristic Scanner</td>
            <td>Scans local filesystem for exposed API keys, tokens, and private keys.</td>
            <td><span class="code-chip">Backend/main.py</span></td>
          </tr>
          <tr>
            <td><strong>12. Quarantine Vault</strong></td>
            <td>send2trash / Vault</td>
            <td>Isolates suspicious/malicious files safely with restoration controls.</td>
            <td><span class="code-chip">Backend/main.py</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- SECTION 4: CODE TRACEABILITY -->
    <div class="section-card">
      <h2>4. Code / Source Traceability</h2>
      <p class="desc">Concrete repository proof verifying each capability against exact project files:</p>

      <ul>
        <li><strong>0/1 Knapsack Budget Optimizer:</strong> Implemented in <span class="code-chip">Backend/investment_optimizer.py</span>. Verified via <span class="code-chip">Backend/test_knapsack.py</span> (10/10 tests pass in 0.006s).</li>
        <li><strong>Blockchain Audit Ledger:</strong> Implemented in <span class="code-chip">Backend/blockchain_ledger.py</span>. State persisted in <span class="code-chip">Database/blockchain_ledger.json</span>.</li>
        <li><strong>Financial Risk Engine:</strong> Implemented in <span class="code-chip">Ai_Engine/Risk_engine/financial_engine.py</span> & <span class="code-chip">Backend/services/financial_engine.py</span>.</li>
        <li><strong>Threat & MITRE Intelligence:</strong> Implemented in <span class="code-chip">Ai_Engine/Detection/threat_detector.py</span> & <span class="code-chip">Backend/main.py</span>.</li>
        <li><strong>System Telemetry Monitor:</strong> Implemented in <span class="code-chip">Backend/main.py</span> using psutil.</li>
        <li><strong>YOLOv8 & MediaPipe Tracking:</strong> Implemented in <span class="code-chip">Backend/main.py</span> and <span class="code-chip">Ai_Engine/Detection/gesture_controller.py</span>.</li>
        <li><strong>Sensitive File Security & Quarantine:</strong> Implemented in <span class="code-chip">Backend/main.py (/api/file-security/*)</span> and <span class="code-chip">Frontend/src/components/modules/FileSecurity.jsx</span>.</li>
        <li><strong>Frontend Client & Showcase:</strong> Implemented in <span class="code-chip">Frontend/src/App.jsx</span> and <span class="code-chip">Frontend/src/components/showcase/</span>.</li>
      </ul>
    </div>

    <!-- SECTION 5: CURRENT VS FUTURE -->
    <div class="section-card">
      <h2>5. Current Implementation vs. Future Roadmap</h2>
      
      <div class="callout callout-success">
        <strong>✓ CURRENTLY IMPLEMENTED (Active in Build):</strong><br/>
        All 12 technical modules listed above, 0/1 Knapsack DP algorithm, SHA-256 Merkle blockchain ledger, What-If simulator, and FastAPI/React architecture are fully operational in code.
      </div>

      <div class="callout">
        <strong>⧖ FUTURE ROADMAP (Planned Enterprise Horizons):</strong><br/>
        The following frameworks represent prospective research goals and are <strong>NOT</strong> claimed as currently implemented:
        <ul>
          <li><strong>FAIR Quantitative Risk Methodology:</strong> Factor Analysis of Information Risk Monte Carlo probabilistic loss modeling.</li>
          <li><strong>NIST CSF 2.0 Mapping:</strong> Automated organizational tier mapping across Govern, Protect, Detect, Respond.</li>
          <li><strong>NIST SP 800-30 Integration:</strong> Structured federal threat assessment matrices.</li>
          <li><strong>CIS Controls v8 Mapping:</strong> Automated policy audits against CIS benchmark baselines.</li>
          <li><strong>ISO/IEC 27001 Mapping:</strong> Annex A technical and organizational audit logs.</li>
          <li><strong>Adaptive Bayesian AI Forecasting:</strong> Predictive threat emergence modeling on historical telemetry.</li>
        </ul>
      </div>
    </div>

    <!-- SECTION 6: CLAIM SAFETY & INTEGRITY -->
    <div class="section-card">
      <h2>6. Claim Safety & Evaluator Disclosures</h2>
      
      <div class="callout callout-danger">
        <strong>Strict Architectural & Academic Disclosures:</strong>
        <ul>
          <li><strong>No Regulatory Certification Claims:</strong> AURA Sentinel does not claim accredited compliance certifications (e.g. ISO, NIST, DPDP, CERT-In) as these mandate formal third-party audits.</li>
          <li><strong>Illustrative Prototype Outputs:</strong> Financial figures (₹8L–₹15L) and risk scores (82/100) are model-based outputs designed for evaluation, not field-measured insurance warranties.</li>
          <li><strong>0/1 Knapsack Optimality:</strong> Produces optimal defense packages strictly <em>"among configured candidate investments under specified constraints"</em>.</li>
          <li><strong>Tamper-Evident Ledger:</strong> Labeled as a <em>"Tamper-Evident Audit Ledger"</em>; does not claim decentralized consensus or 'tamper-proof' status.</li>
        </ul>
      </div>
    </div>

    <!-- SECTION 7: JUDGE QUICK VIEW -->
    <div class="section-card">
      <h2>7. Evaluator Quick View (1-Page Summary)</h2>
      
      <h3>WHAT AURA CURRENTLY DOES (100% IMPLEMENTED):</h3>
      <ul>
        <li>1. Ingests kernel system telemetry (CPU, RAM, disk, processes, open ports) via psutil.</li>
        <li>2. Maps listening ports and threat indicators to standardized MITRE ATT&CK techniques (T1046, T1021).</li>
        <li>3. Calculates real-time composite cyber risk scores on a calibrated 0–100 scale.</li>
        <li>4. Translates technical CVSS risk into modeled financial exposure estimates (₹8L–₹15L prototype).</li>
        <li>5. Simulates dynamic what-if wargame scenarios with instant risk and liability delta updates.</li>
        <li>6. Optimizes security investment portfolios using genuine 0/1 Knapsack Dynamic Programming (∑ cost_i ≤ W).</li>
        <li>7. Maintains a tamper-evident SHA-256 Merkle audit chain with live tamper detection verification.</li>
        <li>8. Provides conversational risk intelligence and co-pilot guidance via Groq LPU LLM inference.</li>
      </ul>

      <h3>HOW TO VERIFY LIVE IN 60 SECONDS:</h3>
      <ul>
        <li><strong>Launch Prototype:</strong> Run <span class="code-chip">.\\run_aura_mvp.bat</span> or visit <span class="code-chip">http://localhost:5173</span></li>
        <li><strong>Test 0/1 Knapsack DP:</strong> Adjust budget slider (₹3L–₹15L) to observe real-time O(N·W) dynamic allocation.</li>
        <li><strong>Run Unit Tests:</strong> Execute <span class="code-chip">python -m unittest test_knapsack.py</span> in Backend/ (10 tests pass in 0.006s).</li>
        <li><strong>Inspect Blockchain Ledger:</strong> Toggle "Simulate Telemetry Tampering" to view cryptographic hash breaks.</li>
        <li><strong>GitHub Repository:</strong> <a href="https://github.com/aryanbaghel756-spec/AURA-SENTINEL" target="_blank">https://github.com/aryanbaghel756-spec/AURA-SENTINEL ↗</a></li>
      </ul>
    </div>

  </div>
</body>
</html>
"""
    with open(HTML_OUTPUT, "w", encoding="utf-8") as f:
        f.write(html_content)
    with open(HTML_PUBLIC_OUTPUT, "w", encoding="utf-8") as f:
        f.write(html_content)
    print(f"HTML created successfully at: {HTML_OUTPUT}")
    print(f"HTML copied to Frontend/public at: {HTML_PUBLIC_OUTPUT}")


if __name__ == "__main__":
    create_docx()
    create_pdf()
    create_html()
    print("ALL RESOURCE PACK ARTIFACTS GENERATED SUCCESSFULLY!")
