import hashlib
import time
import json
import math
import random
from typing import List, Dict, Any, Optional

# -------------------------------------------------------------
# SAMPLE SECURITY CONTROLS FOR KNAPSACK OPTIMIZATION (~10 CONTROLS)
# -------------------------------------------------------------
SECURITY_CONTROLS = [
    {
        "id": "CTRL-01",
        "name": "MFA & Privileged Access Management (PAM)",
        "category": "Identity & Access",
        "cost_lakhs": 35.0,
        "risk_reduction_lakhs": 280.0,
        "description": "Hardware security keys and zero-standing-privilege bastion host for tier-1 admins."
    },
    {
        "id": "CTRL-02",
        "name": "Next-Gen EDR & XDR Endpoint Fleet",
        "category": "Endpoint Defense",
        "cost_lakhs": 65.0,
        "risk_reduction_lakhs": 420.0,
        "description": "Kernel-level behavioral telemetry and automated quarantine on 1,500 enterprise workstations."
    },
    {
        "id": "CTRL-03",
        "name": "Cloud Micro-Segmentation & WAF",
        "category": "Cloud & Network",
        "cost_lakhs": 45.0,
        "risk_reduction_lakhs": 310.0,
        "description": "East-west network policy enforcement and OWASP Top 10 automated request blocking."
    },
    {
        "id": "CTRL-04",
        "name": "Immutable Air-Gapped Ransomware Backups",
        "category": "Business Continuity",
        "cost_lakhs": 50.0,
        "risk_reduction_lakhs": 380.0,
        "description": "WORM (Write Once Read Many) AWS S3 object-locked storage with 15-minute recovery RTO."
    },
    {
        "id": "CTRL-05",
        "name": "Zero Trust Network Access (ZTNA) Gateway",
        "category": "Perimeter & Network",
        "cost_lakhs": 40.0,
        "risk_reduction_lakhs": 240.0,
        "description": "Replaces legacy VPN with contextual micro-tunnels and device health posture validation."
    },
    {
        "id": "CTRL-06",
        "name": "Automated Patch & Vulnerability Remediation",
        "category": "Vulnerability Ops",
        "cost_lakhs": 25.0,
        "risk_reduction_lakhs": 190.0,
        "description": "Automated staging and deployment of high/critical OS and software kernel patches within 48h."
    },
    {
        "id": "CTRL-07",
        "name": "AI Behavioral Phishing Simulation & Training",
        "category": "Human Layer",
        "cost_lakhs": 15.0,
        "risk_reduction_lakhs": 120.0,
        "description": "Adaptive simulated spear-phishing campaigns targeting high-risk corporate departments."
    },
    {
        "id": "CTRL-08",
        "name": "24/7 Managed SOC Telemetry & Threat Hunting",
        "category": "Security Operations",
        "cost_lakhs": 70.0,
        "risk_reduction_lakhs": 450.0,
        "description": "Continuous event log correlation, SIEM threat detection rules, and proactive threat actor hunts."
    },
    {
        "id": "CTRL-09",
        "name": "API Security Shield & Token Rate Limiting",
        "category": "Application Security",
        "cost_lakhs": 30.0,
        "risk_reduction_lakhs": 210.0,
        "description": "Machine-learning inspection of REST/GraphQL calls detecting token abuse and payload injections."
    },
    {
        "id": "CTRL-10",
        "name": "Data Loss Prevention (DLP) & Cloud Encryption",
        "category": "Data Protection",
        "cost_lakhs": 35.0,
        "risk_reduction_lakhs": 220.0,
        "description": "Automated classification of PII/financial data and client-side envelope encryption."
    }
]

# -------------------------------------------------------------
# SAMPLE VULNERABILITY TELEMETRY DATA (CVSS vs ₹ LOSS EXPOSURE)
# -------------------------------------------------------------
VULNERABILITY_TELEMETRY = [
    {
        "cve_id": "CVE-2026-2189",
        "title": "OpenSSL ASN.1 Parsing Heap Overflow (RCE)",
        "asset_id": "prod-core-db-01",
        "asset_name": "Primary Transaction Ledger DB",
        "asset_tier": "Tier-1 Mission Critical",
        "asset_value_crores": 45.0,
        "environment": "AWS Mumbai (ap-south-1)",
        "severity": "CRITICAL",
        "cvss_score": 9.8,
        "epss_prob": 0.884,
        "financial_exposure_crores": 4.25,
        "remediation_status": "Remediation Active",
        "published_date": "2026-09-21",
        "mitigation": "Isolate port 443; apply OpenSSL v3.4.2 hotfix patch."
    },
    {
        "cve_id": "CVE-2026-3412",
        "title": "Active Directory Kerberos Privilege Escalation",
        "asset_id": "ad-dc-primary",
        "asset_name": "Enterprise Domain Controller",
        "asset_tier": "Tier-1 Mission Critical",
        "asset_value_crores": 35.0,
        "environment": "On-Premise HQ Datacenter",
        "severity": "HIGH",
        "cvss_score": 8.8,
        "epss_prob": 0.742,
        "financial_exposure_crores": 2.80,
        "remediation_status": "Patch Scheduled",
        "published_date": "2026-09-18",
        "mitigation": "Enable PAC validation enforcement and rotate KRBTGT keys."
    },
    {
        "cve_id": "CVE-2026-1904",
        "title": "Spring Framework Remote Object Deserialization",
        "asset_id": "payment-gw-cluster",
        "asset_name": "UPI & Card Payment Gateway Cluster",
        "asset_tier": "Tier-1 Mission Critical",
        "asset_value_crores": 30.0,
        "environment": "Kubernetes Ingress (K8s)",
        "severity": "HIGH",
        "cvss_score": 8.5,
        "epss_prob": 0.658,
        "financial_exposure_crores": 2.10,
        "remediation_status": "Remediation Active",
        "published_date": "2026-09-15",
        "mitigation": "Upgrade Spring Boot starter dependencies to 3.3.4."
    },
    {
        "cve_id": "CVE-2026-4021",
        "title": "Kubernetes API Server RBAC Misconfiguration",
        "asset_id": "k8s-mgmt-master",
        "asset_name": "Production Container Orchestrator",
        "asset_tier": "Tier-2 Business Operational",
        "asset_value_crores": 20.0,
        "environment": "GCP Cloud (asia-south1)",
        "severity": "HIGH",
        "cvss_score": 7.9,
        "epss_prob": 0.512,
        "financial_exposure_crores": 1.45,
        "remediation_status": "Remediation Active",
        "published_date": "2026-09-12",
        "mitigation": "Revoke default cluster-admin bindings on public service accounts."
    },
    {
        "cve_id": "CVE-2026-5190",
        "title": "Redis Cache Unauthenticated Memory Read",
        "asset_id": "cache-session-node",
        "asset_name": "User Session & Token Cache",
        "asset_tier": "Tier-2 Business Operational",
        "asset_value_crores": 15.0,
        "environment": "AWS Mumbai (ap-south-1)",
        "severity": "HIGH",
        "cvss_score": 7.2,
        "epss_prob": 0.395,
        "financial_exposure_crores": 0.95,
        "remediation_status": "Mitigation Applied",
        "published_date": "2026-09-08",
        "mitigation": "Bind Redis to 127.0.0.1; enforce ACL AUTH passwords."
    },
    {
        "cve_id": "CVE-2026-1102",
        "title": "Log4j2 Recursive Lookup Edge Case",
        "asset_id": "legacy-reporting-srv",
        "asset_name": "Internal BI Analytics Service",
        "asset_tier": "Tier-3 Internal Non-Prod",
        "asset_value_crores": 8.0,
        "environment": "On-Premise Private Subnet",
        "severity": "MEDIUM",
        "cvss_score": 6.8,
        "epss_prob": 0.225,
        "financial_exposure_crores": 0.45,
        "remediation_status": "Under Review",
        "published_date": "2026-09-04",
        "mitigation": "Set formatMsgNoLookups=true and upgrade log4j jar."
    },
    {
        "cve_id": "CVE-2026-2287",
        "title": "Postfix Mail Server Queue Injection",
        "asset_id": "mail-relay-internal",
        "asset_name": "Corporate Notification Relay",
        "asset_tier": "Tier-3 Internal Non-Prod",
        "asset_value_crores": 5.0,
        "environment": "Hybrid Edge Relay",
        "severity": "MEDIUM",
        "cvss_score": 6.5,
        "epss_prob": 0.180,
        "financial_exposure_crores": 0.65,
        "remediation_status": "Patch Scheduled",
        "published_date": "2026-08-30",
        "mitigation": "Sanitize internal envelope headers and restrict relay access."
    },
    {
        "cve_id": "CVE-2026-7834",
        "title": "Nginx TLS Cipher Downgrade Opportunity",
        "asset_id": "edge-waf-proxy-01",
        "asset_name": "External Load Balancer & WAF",
        "asset_tier": "Tier-2 Business Operational",
        "asset_value_crores": 12.0,
        "environment": "Cloudflare / AWS Cloud",
        "severity": "MEDIUM",
        "cvss_score": 5.3,
        "epss_prob": 0.092,
        "financial_exposure_crores": 0.25,
        "remediation_status": "Mitigation Applied",
        "published_date": "2026-08-25",
        "mitigation": "Disable TLS 1.0/1.1; enforce strict HSTS and ECDHE ciphers."
    }
]

# -------------------------------------------------------------
# MERKLE AUDIT LEDGER DATA & BLOCK CHAIN
# -------------------------------------------------------------
def compute_sha256(raw_str: str) -> str:
    return hashlib.sha256(raw_str.encode('utf-8')).hexdigest()

def create_block(index: int, action: str, data_payload: dict, prev_hash: str, timestamp_str: str) -> dict:
    payload_serialized = json.dumps(data_payload, sort_keys=True)
    data_hash = compute_sha256(payload_serialized)
    raw_header = f"{index}|{timestamp_str}|{action}|{data_hash}|{prev_hash}"
    current_hash = compute_sha256(raw_header)
    return {
        "index": index,
        "timestamp": timestamp_str,
        "action": action,
        "data_hash": data_hash,
        "previous_hash": prev_hash,
        "current_hash": current_hash,
        "payload_summary": list(data_payload.keys())
    }

def get_initial_merkle_chain() -> List[dict]:
    chain = []
    # Block 1040 (Genesis Anchor)
    b0 = create_block(
        1040,
        "Genesis Anchor: Enterprise Risk Baseline Committed",
        {"baseline_assets": 142, "initial_var_cr": 16.4, "scope": "Global SIH26105"},
        "0000000000000000000000000000000000000000000000000000000000000000",
        "2026-09-25T10:00:00Z"
    )
    chain.append(b0)

    # Block 1041
    b1 = create_block(
        1041,
        "Vulnerability Ingestion: CVE-2026-2189 Ingested on prod-db",
        {"cve": "CVE-2026-2189", "cvss": 9.8, "loss_crores": 4.25, "engine": "Nessus/Qualys Feed"},
        chain[-1]["current_hash"],
        "2026-09-25T14:15:22Z"
    )
    chain.append(b1)

    # Block 1042
    b2 = create_block(
        1042,
        "FAIR Engine: 10,000 Monte Carlo Iteration Distribution Sealed",
        {"runs": 10000, "confidence": 0.95, "calculated_var_cr": 14.82, "distribution": "lognormal"},
        chain[-1]["current_hash"],
        "2026-09-25T18:40:10Z"
    )
    chain.append(b2)

    # Block 1043
    b3 = create_block(
        1043,
        "Board Risk Register Snapshot: Value-at-Risk State Frozen",
        {"target_confidence": "95%", "var_crores": 14.82, "ale_crores": 5.64, "currency": "INR"},
        chain[-1]["current_hash"],
        "2026-09-26T02:10:05Z"
    )
    chain.append(b3)

    # Block 1044
    b4 = create_block(
        1044,
        "Budget Optimizer: 0/1 Knapsack Solution Computed (Budget: ₹150 Lakhs)",
        {"budget_lakhs": 150.0, "funded_controls": 4, "risk_reduction_lakhs": 1020.0, "roi_multiple": 7.03},
        chain[-1]["current_hash"],
        "2026-09-26T08:30:45Z"
    )
    chain.append(b4)

    # Block 1045
    b5 = create_block(
        1045,
        "Control Policy Enacted: MFA & Privileged Access Management Locked",
        {"control_id": "CTRL-01", "expenditure_lakhs": 35.0, "status": "FUNDED_APPROVED"},
        chain[-1]["current_hash"],
        "2026-09-26T12:00:15Z"
    )
    chain.append(b5)

    # Block 1046
    b6 = create_block(
        1046,
        "Regulatory Compliance Snapshot: DPDP Act 2023 Telemetry Anchored",
        {"mandate": "DPDP-2023-Sec8", "pii_encryption_status": "100%_Compliant", "dpo_signed": True},
        chain[-1]["current_hash"],
        "2026-09-26T15:20:00Z"
    )
    chain.append(b6)

    # Block 1047
    b7 = create_block(
        1047,
        "CERT-In Audit Log State Proof Stamped",
        {"directions": "CERT-In 70B", "retention_mode": "Immutable Append-Only", "hash_type": "SHA-256"},
        chain[-1]["current_hash"],
        "2026-09-26T21:10:00Z"
    )
    chain.append(b7)

    return chain

# -------------------------------------------------------------
# 0/1 KNAPSACK OPTIMIZATION ALGORITHM
# -------------------------------------------------------------
def solve_knapsack(budget_lakhs: float) -> dict:
    # Work in integer scale (units of 1 Lakh)
    scale = 1
    budget_int = int(round(budget_lakhs * scale))
    controls = SECURITY_CONTROLS
    n = len(controls)

    costs = [int(round(c["cost_lakhs"] * scale)) for c in controls]
    values = [c["risk_reduction_lakhs"] for c in controls]

    # DP Table
    dp = [[0.0] * (budget_int + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        c_cost = costs[i - 1]
        c_val = values[i - 1]
        for w in range(budget_int + 1):
            if c_cost <= w:
                dp[i][w] = max(dp[i - 1][w], dp[i - 1][w - c_cost] + c_val)
            else:
                dp[i][w] = dp[i - 1][w]

    # Backtrack to find funded items
    w = budget_int
    funded_ids = set()
    for i in range(n, 0, -1):
        if dp[i][w] != dp[i - 1][w]:
            funded_ids.add(controls[i - 1]["id"])
            w -= costs[i - 1]

    allocated_cost = sum(c["cost_lakhs"] for c in controls if c["id"] in funded_ids)
    total_risk_reduction = sum(c["risk_reduction_lakhs"] for c in controls if c["id"] in funded_ids)
    roi_multiple = round(total_risk_reduction / allocated_cost, 2) if allocated_cost > 0 else 0.0

    annotated_controls = []
    for c in controls:
        is_funded = c["id"] in funded_ids
        eff = round(c["risk_reduction_lakhs"] / c["cost_lakhs"], 2)
        annotated_controls.append({
            **c,
            "funded": is_funded,
            "status": "FUNDED" if is_funded else "DEFERRED",
            "efficiency_ratio": eff
        })

    return {
        "budget_lakhs": budget_lakhs,
        "allocated_cost_lakhs": round(allocated_cost, 1),
        "unallocated_budget_lakhs": round(max(0.0, budget_lakhs - allocated_cost), 1),
        "total_risk_reduction_lakhs": round(total_risk_reduction, 1),
        "total_risk_reduction_crores": round(total_risk_reduction / 100.0, 2),
        "roi_multiple": roi_multiple,
        "funded_count": len(funded_ids),
        "total_controls": n,
        "controls": annotated_controls
    }

# -------------------------------------------------------------
# MONTE CARLO FAIR LOSS-EXCEEDANCE SIMULATION
# -------------------------------------------------------------
def simulate_monte_carlo(tef_mean: float = 14.0, sle_median_lakhs: float = 48.0, n_sims: int = 10000) -> dict:
    random.seed(42) # Consistent seeded results for benchmark
    # Lognormal parameters for loss magnitude
    mu = math.log(sle_median_lakhs)
    sigma = 1.05

    annual_losses = []
    for _ in range(n_sims):
        # Poisson sample for event count
        events = 0
        lmb = tef_mean
        p = 1.0
        L = math.exp(-lmb)
        while p > L:
            events += 1
            p *= random.random()
        event_count = max(0, events - 1)

        sim_loss = 0.0
        for _ in range(event_count):
            # Lognormal loss per event
            loss = math.exp(random.gauss(mu, sigma))
            sim_loss += loss
        annual_losses.append(sim_loss)

    annual_losses.sort()
    # VaR 95%
    idx_95 = int(0.95 * n_sims)
    var_95_lakhs = annual_losses[idx_95]
    var_95_crores = round(var_95_lakhs / 100.0, 2)

    ale_lakhs = sum(annual_losses) / n_sims
    ale_crores = round(ale_lakhs / 100.0, 2)

    # Generate Loss Exceedance Curve points (25 points)
    max_loss = max(annual_losses)
    curve_points = []
    step_loss = max_loss / 24.0
    for i in range(25):
        threshold = i * step_loss
        count_exceed = sum(1 for x in annual_losses if x >= threshold)
        prob = round((count_exceed / n_sims) * 100.0, 1)
        curve_points.append({
            "loss_crores": round(threshold / 100.0, 2),
            "loss_lakhs": round(threshold, 1),
            "probability_exceedance": prob
        })

    return {
        "iterations": n_sims,
        "var_95_crores": var_95_crores,
        "var_95_lakhs": round(var_95_lakhs, 1),
        "ale_crores": ale_crores,
        "ale_lakhs": round(ale_lakhs, 1),
        "tef_mean": tef_mean,
        "sle_median_lakhs": sle_median_lakhs,
        "curve": curve_points
    }
