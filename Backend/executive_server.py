import os
import sys
import json
import time
import asyncio
from pathlib import Path
from typing import Optional, List
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

CURRENT_DIR = Path(__file__).resolve().parent
if str(CURRENT_DIR) not in sys.path:
    sys.path.insert(0, str(CURRENT_DIR))

from services.executive_soc_service import (
    SECURITY_CONTROLS,
    VULNERABILITY_TELEMETRY,
    get_initial_merkle_chain,
    solve_knapsack,
    simulate_monte_carlo,
    compute_sha256
)

app = FastAPI(
    title="AURA Sentinel — Executive SOC Console API",
    description="Cybersecurity Risk-Quantification Platform (SIH 2026, Problem Statement SIH26105)",
    version="2.4.0"
)

# Enable CORS for local dev and Vercel deployments
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory chain state
CURRENT_CHAIN = get_initial_merkle_chain()

# -------------------------------------------------------------
# 1. EXECUTIVE OVERVIEW ENDPOINTS
# -------------------------------------------------------------
@app.get("/api/soc/overview")
def get_executive_overview(
    tef: float = Query(14.0, description="Threat Event Frequency (events/year)"),
    sle: float = Query(48.0, description="Median Single Loss Expectancy (₹ Lakhs)")
):
    mc = simulate_monte_carlo(tef_mean=tef, sle_median_lakhs=sle, n_sims=10000)
    
    total_telemetry_exposure = sum(v["financial_exposure_crores"] for v in VULNERABILITY_TELEMETRY)
    critical_count = sum(1 for v in VULNERABILITY_TELEMETRY if v["severity"] == "CRITICAL")
    high_count = sum(1 for v in VULNERABILITY_TELEMETRY if v["severity"] == "HIGH")

    return {
        "status": "success",
        "platform": "AURA Sentinel Executive SOC Console",
        "theme": "Blockchain & Cybersecurity",
        "problem_statement": "SIH26105",
        "team": {
            "name": "ByteForce_1",
            "id": "180219",
            "leader": "Aryan Baghel"
        },
        "metrics": {
            "var_95_crores": mc["var_95_crores"],
            "var_95_lakhs": mc["var_95_lakhs"],
            "ale_crores": mc["ale_crores"],
            "total_assets_monitored": 142,
            "active_vulnerabilities": len(VULNERABILITY_TELEMETRY),
            "critical_vulnerabilities": critical_count,
            "high_vulnerabilities": high_count,
            "telemetry_exposure_crores": round(total_telemetry_exposure, 2),
            "threat_event_frequency": tef,
            "median_sle_lakhs": sle
        },
        "loss_exceedance_curve": mc["curve"]
    }

@app.get("/api/soc/monte-carlo")
def get_monte_carlo_simulation(
    tef: float = Query(14.0, description="Threat Event Frequency"),
    sle: float = Query(48.0, description="Single Loss Expectancy Lakhs"),
    iterations: int = Query(10000, description="Number of Monte Carlo paths")
):
    return simulate_monte_carlo(tef_mean=tef, sle_median_lakhs=sle, n_sims=iterations)

# -------------------------------------------------------------
# 2. BUDGET OPTIMIZER (0/1 KNAPSACK) ENDPOINTS
# -------------------------------------------------------------
@app.get("/api/soc/knapsack")
def get_knapsack_solution(
    budget_lakhs: float = Query(150.0, description="Security budget in ₹ Lakhs")
):
    return solve_knapsack(budget_lakhs=budget_lakhs)

@app.get("/api/soc/controls")
def get_all_controls():
    return {
        "controls": SECURITY_CONTROLS,
        "total_count": len(SECURITY_CONTROLS)
    }

# -------------------------------------------------------------
# 3. MERKLE AUDIT LOG ENDPOINTS
# -------------------------------------------------------------
@app.get("/api/soc/merkle")
def get_merkle_ledger():
    return {
        "blocks": CURRENT_CHAIN,
        "total_blocks": len(CURRENT_CHAIN),
        "latest_block_hash": CURRENT_CHAIN[-1]["current_hash"] if CURRENT_CHAIN else None
    }

class VerifyChainResponse(BaseModel):
    is_valid: bool
    verified_count: int
    total_blocks: int
    error: Optional[str] = None
    verification_time_ms: float

@app.post("/api/soc/merkle/verify")
def verify_merkle_chain():
    start_time = time.time()
    for i in range(len(CURRENT_CHAIN)):
        blk = CURRENT_CHAIN[i]
        # Verify previous hash link
        if i > 0:
            if blk["previous_hash"] != CURRENT_CHAIN[i - 1]["current_hash"]:
                return {
                    "is_valid": False,
                    "verified_count": i,
                    "total_blocks": len(CURRENT_CHAIN),
                    "error": f"Block #{blk['index']} previous_hash does not match Block #{CURRENT_CHAIN[i-1]['index']} current_hash!",
                    "verification_time_ms": round((time.time() - start_time) * 1000, 2)
                }

    elapsed_ms = round((time.time() - start_time) * 1000, 2)
    return {
        "is_valid": True,
        "verified_count": len(CURRENT_CHAIN),
        "total_blocks": len(CURRENT_CHAIN),
        "status": "CHAIN_INTEGRITY_VERIFIED",
        "verification_time_ms": elapsed_ms
    }

# -------------------------------------------------------------
# 4. LIVE TELEMETRY FEED ENDPOINT
# -------------------------------------------------------------
@app.get("/api/soc/telemetry")
def get_telemetry_feed():
    return {
        "vulnerabilities": VULNERABILITY_TELEMETRY,
        "total_count": len(VULNERABILITY_TELEMETRY),
        "total_exposure_crores": round(sum(v["financial_exposure_crores"] for v in VULNERABILITY_TELEMETRY), 2)
    }

# -------------------------------------------------------------
# 5. WEBSOCKET FOR LIVE TELEMETRY UPDATES
# -------------------------------------------------------------
@app.websocket("/api/soc/ws")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            # Send periodic pulse with simulated live sensor metrics
            await asyncio.sleep(4)
            pulse_data = {
                "type": "TELEMETRY_HEARTBEAT",
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "active_scanners": 4,
                "endpoints_online": 142,
                "bandwidth_mbps": round(14.2 + (time.time() % 5), 1),
                "simulated_active_threats": random.randint(1, 3),
                "latest_anchored_block": CURRENT_CHAIN[-1]["index"] if CURRENT_CHAIN else 1047
            }
            await websocket.send_text(json.dumps(pulse_data))
    except WebSocketDisconnect:
        pass
    except Exception:
        pass

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("executive_server:app", host="127.0.0.1", port=8000, reload=True)
