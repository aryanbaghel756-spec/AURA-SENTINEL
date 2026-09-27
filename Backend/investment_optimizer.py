"""
AURA SENTINEL - 0/1 Knapsack Budget Optimizer
=============================================
Genuine Dynamic Programming (DP) budget optimization engine for cybersecurity investments.

Mathematical Formulation:
-------------------------
Given:
  - A set of n candidate cybersecurity investments I = {1, 2, ..., n}
  - Each investment i in I has a financial cost c_i > 0 and a modeled risk reduction value v_i > 0
  - An available cybersecurity budget W >= 0
  - Binary decision variable x_i in {0, 1} (each control can be selected at most once)

Objective:
  Maximize:   Sum_{i=1}^n (x_i * v_i)   [Total Modeled Security Risk Reduction]
  Subject to: Sum_{i=1}^n (x_i * c_i) <= W [Budgetary Ceiling Constraint]
              x_i in {0, 1}                [0/1 Discrete Non-Fractional Selection]

DP State Transition:
--------------------
dp[i][w] = maximum achievable security value using a subset of the first i investments
           under a budget capacity w.

Base Case:
  dp[0][w] = 0 for all w in [0, W]
  dp[i][0] = 0 for all i in [0, n]

Recurrence Relation:
  If scaled_cost[i-1] <= w:
      dp[i][w] = max(dp[i-1][w], dp[i-1][w - scaled_cost[i-1]] + value[i-1])
  Else:
      dp[i][w] = dp[i-1][w]

Backtracking:
-------------
Trace backwards from dp[n][W]:
  If dp[i][w] != dp[i-1][w]:
      Investment i-1 was selected in the optimal portfolio (x_{i-1} = 1)
      w = w - scaled_cost[i-1]
  Else:
      Investment i-1 was excluded (x_{i-1} = 0)

Budget Discretization:
----------------------
In Indian enterprises, budgets are denominated in INR (e.g. ₹5,00,000).
A 1-rupee resolution table would require 500,000 columns.
We discretize with BUDGET_UNIT (default ₹1,000 = 1 DP unit).
Conservative ceiling discretization math.ceil(cost / BUDGET_UNIT) guarantees that
sum(selected.cost) <= budget strictly holds in real INR currency.
"""

import math
from typing import Dict, Any, List, Optional, Tuple


# Configurable default discretization unit in INR
DEFAULT_BUDGET_UNIT = 1000  # ₹1,000 per DP column unit


# Comprehensive, defensible candidate cybersecurity investments
# Grounded in real Enterprise / Indian regulatory defense standards
DEFAULT_CANDIDATE_INVESTMENTS: List[Dict[str, Any]] = [
    {
        "id": "endpoint_protection",
        "name": "Endpoint Protection & EDR",
        "cost": 150000,
        "risk_reduction": 18,
        "impact": "High",
        "category": "Endpoint Security",
        "description": "Next-gen behavioral antivirus, process isolation, and automated host telemetry agent.",
    },
    {
        "id": "network_monitoring",
        "name": "Network Traffic & Socket Inspection",
        "cost": 100000,
        "risk_reduction": 14,
        "impact": "High",
        "category": "Network Defense",
        "description": "Continuous network flow analysis, listening socket hunter, and rogue port anomaly alerts.",
    },
    {
        "id": "data_loss_prevention",
        "name": "Data Loss Prevention & DPDP Shield",
        "cost": 200000,
        "risk_reduction": 22,
        "impact": "Critical",
        "category": "Data Protection / DPDP",
        "description": "Deep file inspection, API token scanner, and personal data leak prevention for DPDP Act 2023 compliance.",
    },
    {
        "id": "vulnerability_management",
        "name": "Continuous Vulnerability Management",
        "cost": 80000,
        "risk_reduction": 10,
        "impact": "Medium",
        "category": "Vulnerability Mgmt",
        "description": "Automated host scanning, NVD CVE mapping, and patch prioritization pipeline.",
    },
    {
        "id": "iam_mfa",
        "name": "Identity & Access Management (IAM / MFA)",
        "cost": 120000,
        "risk_reduction": 16,
        "impact": "High",
        "category": "Identity & Access",
        "description": "Zero-trust session authorization, hardware token MFA, and privilege escalation guards.",
    },
    {
        "id": "backup_recovery",
        "name": "Immutable Backup & BCDR Recovery",
        "cost": 90000,
        "risk_reduction": 12,
        "impact": "Medium",
        "category": "Resilience & BCDR",
        "description": "Air-gapped offline snapshots, automated disaster recovery drill, and ransomware rollback.",
    },
    {
        "id": "siem_soc",
        "name": "SIEM / SOC Threat Intelligence",
        "cost": 180000,
        "risk_reduction": 20,
        "impact": "Critical",
        "category": "Threat Intel & SIEM",
        "description": "Centralized log aggregation, real-time threat feed correlation, and plain-English SOC triage.",
    },
    {
        "id": "security_training",
        "name": "Security Awareness & Phishing Defense",
        "cost": 50000,
        "risk_reduction": 6,
        "impact": "Low",
        "category": "Human Defense",
        "description": "Simulated spear-phishing campaigns, employee hygiene grading, and credential leak training.",
    },
    {
        "id": "zero_trust_presence",
        "name": "Zero-Trust Console Presence Lock",
        "cost": 65000,
        "risk_reduction": 8,
        "impact": "Medium",
        "category": "Physical Console Vision",
        "description": "YOLOv8 vision model tracking operator presence and locking consoles upon unauthorized walkaway.",
    },
    {
        "id": "merkle_ledger_audit",
        "name": "Cryptographic Merkle Audit Ledger",
        "cost": 75000,
        "risk_reduction": 9,
        "impact": "Medium",
        "category": "Audit & Compliance",
        "description": "SHA-256 immutable Merkle tree audit logging guaranteeing CERT-In 180-day compliance.",
    },
]


def validate_investment_inputs(
    budget: float,
    investments: Optional[List[Dict[str, Any]]] = None,
) -> Tuple[float, List[Dict[str, Any]]]:
    """
    Validates input parameters for the Knapsack Optimizer.
    Rejects negative budgets, negative costs, invalid risk reductions, and malformed objects.
    """
    if budget is None or not isinstance(budget, (int, float)):
        raise ValueError("Budget must be a valid numerical value.")

    if budget < 0:
        raise ValueError("Budget cannot be negative. Must be >= 0.")

    if investments is None:
        investments = [dict(item) for item in DEFAULT_CANDIDATE_INVESTMENTS]
    elif not isinstance(investments, list):
        raise ValueError("Investments must be provided as a list of candidate controls.")

    seen_ids = set()
    cleaned_investments: List[Dict[str, Any]] = []

    for idx, item in enumerate(investments):
        if not isinstance(item, dict):
            raise ValueError(f"Investment at index {idx} is malformed (must be an object).")

        item_id = str(item.get("id") or f"control_{idx}").strip()
        if item_id in seen_ids:
            raise ValueError(f"Duplicate investment ID detected: '{item_id}'. Each control must have a unique ID.")
        seen_ids.add(item_id)

        name = str(item.get("name") or f"Security Control {idx+1}").strip()
        if not name:
            raise ValueError(f"Investment at index {idx} has an empty name.")

        cost = item.get("cost")
        if cost is None or not isinstance(cost, (int, float)):
            raise ValueError(f"Investment '{name}' has invalid cost. Must be a numerical value.")
        if cost < 0:
            raise ValueError(f"Investment '{name}' has negative cost ({cost}). Cost must be >= 0.")

        risk_reduction = item.get("risk_reduction")
        if risk_reduction is None or not isinstance(risk_reduction, (int, float)):
            raise ValueError(f"Investment '{name}' has invalid risk reduction. Must be a numerical value.")
        if risk_reduction < 0 or risk_reduction > 100:
            raise ValueError(f"Investment '{name}' risk reduction ({risk_reduction}) must be between 0 and 100.")

        impact = str(item.get("impact") or "Medium").strip()
        category = str(item.get("category") or "General Security").strip()
        description = str(item.get("description") or "").strip()

        cleaned_investments.append({
            "id": item_id,
            "name": name,
            "cost": float(cost),
            "risk_reduction": float(risk_reduction),
            "impact": impact,
            "category": category,
            "description": description,
        })

    return float(budget), cleaned_investments


def knapsack_01_dp(
    budget: float,
    investments: Optional[List[Dict[str, Any]]] = None,
    budget_unit: int = DEFAULT_BUDGET_UNIT,
) -> Dict[str, Any]:
    """
    Executes the classic 0/1 Knapsack Dynamic Programming algorithm.

    Returns:
        Dict containing budget, total_cost, remaining_budget, total_risk_reduction,
        selected_investments, excluded_investments, algorithm metadata, and DP metrics.
    """
    validated_budget, clean_items = validate_investment_inputs(budget, investments)

    # Edge Case 1: Zero budget or zero investments
    if validated_budget == 0 or not clean_items:
        return {
            "algorithm": "0/1 Knapsack Dynamic Programming",
            "budget": validated_budget,
            "total_cost": 0.0,
            "remaining_budget": validated_budget,
            "total_value": 0.0,
            "total_risk_reduction": 0.0,
            "selected_investments": [],
            "excluded_investments": clean_items,
            "optimization_status": "zero_budget" if validated_budget == 0 else "no_candidates",
            "dp_table_dimensions": [len(clean_items) + 1, 1],
            "scaling_unit_inr": budget_unit,
        }

    # Determine adaptive discretization unit if budget is exceptionally large
    # Target maximum DP table width of 5,000 columns for speed (< 10ms)
    unit = max(1, budget_unit)
    if validated_budget / unit > 5000:
        unit = int(math.ceil(validated_budget / 5000))

    scaled_W = int(math.floor(validated_budget / unit))

    # Scale costs conservatively using math.ceil so that sum(cost) <= budget strictly holds
    scaled_costs: List[int] = []
    values: List[float] = []

    for item in clean_items:
        c = item["cost"]
        # Ceiling scaling: item of cost ₹100,000 with unit ₹1,000 -> 100 DP units
        s_cost = int(math.ceil(c / unit)) if c > 0 else 0
        scaled_costs.append(s_cost)
        values.append(item["risk_reduction"])

    n = len(clean_items)

    # Allocate 2D DP Table: dimensions (n + 1) x (scaled_W + 1)
    # dp[i][w] holds the maximum risk reduction achievable using a subset of first i items with capacity w
    dp = [[0.0] * (scaled_W + 1) for _ in range(n + 1)]

    # Dynamic Programming State Transitions
    for i in range(1, n + 1):
        item_cost = scaled_costs[i - 1]
        item_val = values[i - 1]
        prev_row = dp[i - 1]
        curr_row = dp[i]

        for w in range(scaled_W + 1):
            if item_cost <= w:
                # Option 1: Exclude item i-1 -> prev_row[w]
                # Option 2: Include item i-1 -> prev_row[w - item_cost] + item_val
                val_with = prev_row[w - item_cost] + item_val
                val_without = prev_row[w]
                curr_row[w] = val_with if val_with > val_without else val_without
            else:
                curr_row[w] = prev_row[w]

    # Backtracking to reconstruct optimal subset
    selected_indices: List[int] = []
    curr_capacity = scaled_W

    for i in range(n, 0, -1):
        # If value changed from previous row, item i-1 was included in the optimal knapsack
        if abs(dp[i][curr_capacity] - dp[i - 1][curr_capacity]) > 1e-9:
            selected_indices.append(i - 1)
            curr_capacity -= scaled_costs[i - 1]

    # Reverse to maintain original catalog ordering
    selected_indices.reverse()

    selected_set = set(selected_indices)
    selected_investments: List[Dict[str, Any]] = []
    excluded_investments: List[Dict[str, Any]] = []

    for idx, item in enumerate(clean_items):
        if idx in selected_set:
            selected_investments.append(item)
        else:
            excluded_investments.append(item)

    # Calculate exact unscaled real currency amounts and values
    actual_total_cost = sum(item["cost"] for item in selected_investments)
    actual_total_risk_red = round(sum(item["risk_reduction"] for item in selected_investments), 2)
    remaining_budget = round(max(0.0, validated_budget - actual_total_cost), 2)

    # Invariant safety assertion
    if actual_total_cost > validated_budget:
        # Theoretical safety guard: prune lowest ROI item if strict INR budget exceeded
        selected_investments.sort(key=lambda x: x["risk_reduction"] / max(1.0, x["cost"]))
        while actual_total_cost > validated_budget and selected_investments:
            dropped = selected_investments.pop(0)
            excluded_investments.append(dropped)
            actual_total_cost = sum(item["cost"] for item in selected_investments)
        actual_total_risk_red = round(sum(item["risk_reduction"] for item in selected_investments), 2)
        remaining_budget = round(max(0.0, validated_budget - actual_total_cost), 2)

    return {
        "algorithm": "0/1 Knapsack Dynamic Programming",
        "budget": validated_budget,
        "total_cost": actual_total_cost,
        "remaining_budget": remaining_budget,
        "total_value": actual_total_risk_red,
        "total_risk_reduction": actual_total_risk_red,
        "selected_investments": selected_investments,
        "excluded_investments": excluded_investments,
        "optimization_status": "optimized",
        "dp_table_dimensions": [n + 1, scaled_W + 1],
        "scaling_unit_inr": unit,
        "constraint": "Each security investment can be selected at most once. Total cost <= available budget.",
    }


def optimize_budget_portfolio(
    budget: float,
    current_exposure: float = 1250000.0,
    investments: Optional[List[Dict[str, Any]]] = None,
    business_type: str = "Enterprise",
) -> Dict[str, Any]:
    """
    High-level integration function combining 0/1 Knapsack DP with AURA's
    actuarial exposure modeling and ROSI metrics.
    """
    knapsack_result = knapsack_01_dp(budget=budget, investments=investments)

    total_cost = knapsack_result["total_cost"]
    risk_red = knapsack_result["total_risk_reduction"]
    selected = knapsack_result["selected_investments"]
    excluded = knapsack_result["excluded_investments"]
    remaining = knapsack_result["remaining_budget"]

    # Model projected exposure after optimal controls are applied
    # Diminishing returns ceiling capped at 95% maximum technical risk suppression
    effective_reduction_pct = min(95.0, risk_red)
    projected_exposure = round(max(0.0, current_exposure * (1.0 - effective_reduction_pct / 100.0)))
    potential_savings = round(current_exposure - projected_exposure)
    net_benefit = round(potential_savings - total_cost)
    rosi_percent = round((net_benefit / total_cost) * 100, 1) if total_cost > 0 else 0.0

    # Build explainable rationale
    explanation_points = [
        f"Selected {len(selected)} controls providing the maximum achievable modeled risk reduction ({risk_red} points) within the ₹{budget:,.0f} budget.",
        f"Total investment allocation is ₹{total_cost:,.0f}, preserving ₹{remaining:,.0f} in reserve capital.",
        "Strict 0/1 binary decision logic applied: each security control was evaluated once (non-fractional, non-repeating).",
        "Optimal among configured candidate controls under specified constraints and actuarial loss parameters.",
    ]

    return {
        **knapsack_result,
        "business_type": business_type,
        "current_exposure": current_exposure,
        "projected_exposure": projected_exposure,
        "potential_savings": potential_savings,
        "net_benefit": net_benefit,
        "rosi_percent": rosi_percent,
        "selected_count": len(selected),
        "excluded_count": len(excluded),
        "explanation": explanation_points,
    }
