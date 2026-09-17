"""
AURA SENTINEL - Complete MVP System Verification Suite
SIH26105: AI-Powered Continuous Cyber Risk Quantification & Investment Optimization Platform
Theme: Blockchain & Cybersecurity
"""

import sys
from pathlib import Path

BACKEND_DIR = Path(__file__).resolve().parent / "Backend"
sys.path.insert(0, str(BACKEND_DIR))
sys.path.insert(0, str(BACKEND_DIR.parent))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def run_tests():
    print("=" * 70)
    print("🚀 AURA SENTINEL MVP END-TO-END SUBSYSTEM AUDIT")
    print("=" * 70)

    # 1. Base Health
    print("\n[1/10] Testing Core Health API...")
    r = client.get("/")
    assert r.status_code == 200, f"Health check failed: {r.status_code}"
    print("  ✓ Base API Online (HTTP 200)")

    # 2. System Monitoring
    print("\n[2/10] Testing System Telemetry...")
    r = client.get("/api/system")
    assert r.status_code == 200
    data = r.json()
    print(f"  ✓ CPU: {data.get('cpu_usage')}% | RAM: {data.get('memory_usage')}% | OS: {data.get('platform')}")

    # 3. Attack Surface
    print("\n[3/10] Testing Attack Surface Scanner...")
    r = client.get("/api/attack-surface")
    assert r.status_code == 200
    print(f"  ✓ Discovered {r.json().get('total_open_ports')} listening ports on localhost")

    # 4. Risk Intelligence
    print("\n[4/10] Testing Heuristic Risk Intelligence...")
    r = client.get("/api/risk-intelligence")
    assert r.status_code == 200
    risk = r.json()
    print(f"  ✓ Composite Risk Score: {risk.get('risk_score')}/100 [{risk.get('risk_level')}]")

    # 5. Financial Exposure Engine (FAIR Model)
    print("\n[5/10] Testing Financial Exposure Engine (FAIR Model in ₹ INR)...")
    r = client.get("/api/financial-risk")
    assert r.status_code == 200
    fin = r.json()
    print(f"  ✓ Total Modeled Business Liability: ₹{fin.get('total_financial_exposure', 0):,}")
    print(f"  ✓ Potential Incident Cost: ₹{fin.get('potential_incident_cost', 0):,}")

    # 6. Investment Optimizer (Pareto Knapsack)
    print("\n[6/10] Testing Security Investment Optimizer...")
    r = client.post("/api/investment-optimizer/analyze", json={
        "business_type": "Technical Institute",
        "monthly_budget": 100000,
        "systems": 25,
        "data_value": 2500000
    })
    assert r.status_code == 200
    plan = r.json().get("recommended_plan", {})
    print(f"  ✓ Optimal Plan: {plan.get('name')} | ROI/ROSI: {plan.get('rosi')}% | Risk Reduction: {plan.get('risk_reduction')}%")

    # 7. File Security & Quarantine Vault
    print("\n[7/10] Testing File Security & Quarantine Vault...")
    r = client.get("/api/file-security/quarantine/list")
    assert r.status_code == 200
    print(f"  ✓ Secure Quarantine Vault Accessible (Total Isolated: {len(r.json().get('items', []))})")

    # 8. Blockchain-Backed Audit Ledger (SIH26105 Theme Core)
    print("\n[8/10] Testing Blockchain Risk & Investment Audit Ledger...")
    r = client.get("/api/blockchain/ledger")
    assert r.status_code == 200
    ledger = r.json()
    print(f"  ✓ Total Cryptographic Blocks: {ledger.get('total_blocks')}")
    print(f"  ✓ Initial Chain Integrity: {ledger.get('is_chain_valid')}")

    # Verify Cryptographic Proof
    r_v = client.get("/api/blockchain/verify")
    assert r_v.json().get("is_valid") is True, "Blockchain verification failed!"
    print("  ✓ SHA-256 Merkle Root Integrity: 100% AUTHENTIC")

    # Simulate Tamper & Verify Catch
    r_t = client.post("/api/blockchain/tamper-demo", json={"block_index": 1})
    assert r_t.json().get("integrity", {}).get("is_valid") is False, "Tamper attack was not caught!"
    print("  ✓ Evaluator Tamper Detection Demo: FRAUD DETECTED IMMEDIATELY")

    # Restore Consensus
    r_res = client.post("/api/blockchain/restore")
    assert r_res.json().get("integrity", {}).get("is_valid") is True, "Consensus restoration failed!"
    print("  ✓ Decentralized Consensus Restoration: RESTORED TO 100% GREEN")

    # 9. Vision Intelligence, Zero-Trust Auto-Lock & Neural Hand Gestures
    print("\n[9/10] Testing Vision Intelligence & Neural Gesture Engine...")
    r_vis = client.get("/api/vision/settings")
    assert r_vis.status_code == 200
    vis = r_vis.json()
    print(f"  ✓ Zero-Trust Presence Auto-Lock: {'ENABLED' if vis.get('auto_lock_enabled') else 'DISABLED'}")
    print(f"  ✓ Neural Hand Gesture Controller: {'ENABLED' if vis.get('gesture_control_enabled') else 'DISABLED'}")
    print(f"  ✓ Disappearance Grace Period: {vis.get('grace_period_seconds')}s")

    # 10. Persistent SQLite Database Hub
    print("\n[10/10] Testing Persistent Database Hub...")
    r_db = client.get("/api/database/stats")
    assert r_db.status_code == 200
    print(f"  ✓ Database Stats: {r_db.json()}")

    print("\n" + "=" * 70)
    print("🎉 ALL 10 SUBSYSTEMS VERIFIED! AURA SENTINEL MVP IS 100% READY!")
    print("=" * 70)

if __name__ == "__main__":
    run_tests()
