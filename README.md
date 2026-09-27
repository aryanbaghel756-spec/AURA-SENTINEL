# 🛡️ AURA SENTINEL — Autonomous Unified Risk Analytics
**Smart India Hackathon 2026 (SIH 2026)**  
**Problem Statement ID:** SIH26105  
**Title:** AI-Powered Continuous Cyber Risk Quantification and Investment Optimization Platform  
**Theme:** Blockchain & Cybersecurity  
**Team:** ByteForce_1 (Team ID: 180219)  
**Institution:** Skyline Institute of Engineering and Technology, Greater Noida  

---

## 🎯 0/1 Knapsack Budget Optimizer

AURA Sentinel features an actuarial capital allocation engine powered by a genuine **0/1 Knapsack Dynamic Programming (DP)** algorithm. It translates theoretical security controls into discrete optimization items to determine the mathematically optimal portfolio of defenses within an organization's available budget.

```
       BUDGET (₹ INR)
             ↓
 CANDIDATE SECURITY CONTROLS
             ↓
┌───────────────────────────────────────────┐
│       0/1 KNAPSACK DP ENGINE              │
│                                           │
│  Objective:  Maximize Total Risk Reduction│
│  Constraint: Total Cost ≤ Available Budget│
│  Decision:   x_i ∈ {0, 1} (Non-Fractional)│
└───────────────────────────────────────────┘
             ↓
OPTIMIZED CYBERSECURITY PORTFOLIO
```

### Core Mathematical Formulation

- **Input:**
  - Candidate cybersecurity investment controls $I = \{1, 2, \dots, n\}$.
  - Each control $i$ has a financial cost $c_i > 0$ (in ₹ INR) and a modeled risk reduction value $v_i > 0$ (points/percentage).
  - Available cybersecurity budget $W \ge 0$.
- **Objective:**
  $$\max \sum_{i=1}^{n} x_i \cdot v_i \quad \text{subject to} \quad \sum_{i=1}^{n} x_i \cdot c_i \le W, \quad x_i \in \{0, 1\}$$
- **Optimization:**
  - Recurrence relation:
    $$dp[i][w] = \begin{cases} 
      \max\left(dp[i-1][w], \; dp[i-1][w - \text{scaled\_cost}[i-1]] + v_{i-1}\right) & \text{if } \text{scaled\_cost}[i-1] \le w \\
      dp[i-1][w] & \text{otherwise}
    \end{cases}$$
  - Backtracking traces the table from $dp[n][W]$ backwards to identify exactly which controls are selected ($x_i = 1$) versus excluded ($x_i = 0$).
- **Discretization & Efficiency:**
  - Budgets are discretized using `BUDGET_UNIT` (default ₹1,000 per DP column unit).
  - Conservative ceiling scaling $\lceil c_i / \text{unit} \rceil$ guarantees that the actual real INR cost sum strictly satisfies $\sum c_i \le W$.
  - DP table computation runs in $O(n \cdot W)$ time (< 10ms for standard enterprise budget matrices).
- **Output:**
  - Optimal subset of selected security controls.
  - Total allocated investment cost (₹ INR) and unallocated reserve capital.
  - Total combined technical risk reduction points.
  - Residual exposure projection and Return on Security Investment (ROSI).
  - Transparent explainability log cryptographically audited on the AURA Merkle Blockchain.

---

## ⚡ API Endpoints

### 1. Dedicated Knapsack Endpoint
- **URL:** `POST /api/investment-optimizer/knapsack`
- **Request Body:**
  ```json
  {
    "budget": 500000,
    "business_type": "Enterprise",
    "investments": [] 
  }
  ```
- **Response:**
  ```json
  {
    "algorithm": "0/1 Knapsack Dynamic Programming",
    "budget": 500000.0,
    "total_cost": 500000.0,
    "remaining_budget": 0.0,
    "total_value": 65.0,
    "total_risk_reduction": 65.0,
    "selected_investments": [
      {
        "id": "network_monitoring",
        "name": "Network Traffic & Socket Inspection",
        "cost": 100000.0,
        "risk_reduction": 14.0,
        "category": "Network Defense"
      },
      {
        "id": "iam_mfa",
        "name": "Identity & Access Management (IAM / MFA)",
        "cost": 120000.0,
        "risk_reduction": 16.0,
        "category": "Identity & Access"
      }
    ],
    "excluded_investments": [...],
    "optimization_status": "optimized",
    "projected_exposure": 437500,
    "potential_savings": 812500,
    "rosi_percent": 62.5,
    "explanation": [...]
  }
  ```

### 2. Default Knapsack GET
- **URL:** `GET /api/investment-optimizer/knapsack?budget=500000`

### 3. Integrated Investment Analysis
- **URL:** `POST /api/investment-optimizer/analyze` & `GET /api/investment-optimizer`  
  Returns both commercial defense tier benchmarks and the complete `knapsack_optimization` object for seamless backward compatibility.

---

## 🧪 Automated Unit Verification

AURA Sentinel includes an automated unit test suite verifying the DP recurrence, discrete constraints, and backtracking accuracy:

```powershell
python Backend/test_knapsack.py
```

### Verified Test Cases:
1. `test_01_zero_budget`: Verifies ₹0 budget results in 0 selected items and 0 cost.
2. `test_02_budget_smaller_than_all_items`: Verifies budget below minimum item cost selects nothing.
3. `test_03_budget_exactly_matches_one_investment`: Verifies exact-match budget selects the target control.
4. `test_04_maximum_value_combination_selection`: Verifies DP selects the global optimal combination over greedy traps.
5. `test_05_total_cost_never_exceeds_budget`: Strictly verifies $\sum c_i \le W$ across all budgets.
6. `test_06_no_duplicate_item_selection`: Verifies strict 0/1 non-duplication invariant.
7. `test_07_changing_budget_alters_optimal_portfolio`: Verifies sensitivity across ₹1.5L, ₹3.5L, ₹8L budgets.
8. `test_08_backtracking_reconstruction`: Verifies partition of items into disjoint selected and excluded sets.
9. `test_09_input_validation_rejections`: Validates rejection of negative budgets, negative costs, and malformed inputs.
10. `test_10_portfolio_financial_integration`: Verifies end-to-end integration with financial exposure and ROSI.

---

## 🚀 Quick Start Guide

### 1-Click Launch (Windows)
Double-click **`run_aura_mvp.bat`** in the project root.
- **Backend:** `http://127.0.0.1:8000` (FastAPI + YOLOv8 + Knapsack DP + Blockchain)
- **Frontend:** `http://localhost:5173` (Vite + React SOC Dashboard)

### Manual Launch
```powershell
# Terminal 1 - Backend
cd Backend
python main.py

# Terminal 2 - Frontend
cd Frontend
npm.cmd run dev
```

---

## 🏛️ System Architecture & Defense Modules

1. **System Monitoring (01):** Real-time hardware telemetry (CPU, RAM, Disk, listening sockets).
2. **Attack Surface Discovery (02):** Automated open port inspection and 360° radar telemetry.
3. **Risk Intelligence (03):** Multi-vector continuous cyber risk scoring (0–100 benchmark).
4. **Actuarial Financial Risk Engine (04):** Open Group FAIR loss quantification in ₹ Crores INR.
5. **What-If Scenario Sandbox (05):** Threat simulations (DDoS, Brute Force) and Knapsack budget scenarios.
6. **0/1 Knapsack Budget Optimizer (06):** Discrete dynamic programming capital allocation and ROSI modeling.
7. **AI SOC Copilot (07):** Multilingual incident triage assistant powered by Groq LLM inference.
8. **File Security & Quarantine (08):** PII leak hunter (DPDP Act 2023) and encrypted quarantine vault.
9. **Zero-Trust Vision Presence Lock (09):** YOLOv8 operator face tracking with automated walkaway lockdown.
10. **Blockchain Merkle Audit Ledger (10):** Cryptographic SHA-256 state logging guaranteeing CERT-In 180-day compliance.

---
**Official Submission for Smart India Hackathon 2026** • Team ByteForce_1
