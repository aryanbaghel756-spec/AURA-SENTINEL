"""
AURA SENTINEL - Transparent Financial Intelligence & Scenario Simulation Engine
Implements explainable, weighted suitability calculations and mathematical simulation models.

Strict Compliance Rules:
- NO guaranteed profit claims
- NO personalized buy/sell directives
- Purely analytical decision-support framing
- Fully transparent formulas (Risk Match 45%, Stability 30%, Liquidity 25%)
"""

import math
from typing import Dict, Any, List, Optional


class FinancialAnalysisEngine:
    """
    Transparent analysis engine providing suitability evaluation and scenario simulation.
    """

    def __init__(self, risk_weight: float = 0.45, stability_weight: float = 0.30, liquidity_weight: float = 0.25):
        # Configurable weights summing to 1.0 (100%)
        self.risk_weight = risk_weight
        self.stability_weight = stability_weight
        self.liquidity_weight = liquidity_weight

    def calculate_suitability(self, profile: Dict[str, Any], snapshot: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Calculates explainable suitability scores across government securities vs market-linked categories.
        """
        risk_profile = (profile.get("risk_profile") or "moderate").lower()
        liquidity_req = (profile.get("liquidity_requirement") or "medium").lower()
        goal = (profile.get("goal") or "balanced_growth").lower()
        duration_years = max(1, int(profile.get("duration_years") or 3))

        # 1. Government Category Scoring
        if risk_profile == "conservative":
            gov_risk_match = 96.0
            mkt_risk_match = 34.0
        elif risk_profile == "moderate":
            gov_risk_match = 78.0
            mkt_risk_match = 74.0
        else:  # aggressive
            gov_risk_match = 48.0
            mkt_risk_match = 94.0

        # Goal adjustments
        if goal == "capital_preservation":
            gov_risk_match = min(100.0, gov_risk_match + 5.0)
            mkt_risk_match = max(20.0, mkt_risk_match - 15.0)
        elif goal == "growth":
            gov_risk_match = max(35.0, gov_risk_match - 10.0)
            mkt_risk_match = min(100.0, mkt_risk_match + 8.0)

        # Horizon adjustment: shorter horizons favor higher stability
        if duration_years <= 2:
            gov_risk_match = min(100.0, gov_risk_match + 6.0)
            mkt_risk_match = max(25.0, mkt_risk_match - 12.0)

        # 2. Stability Scores (Derived from volatility and historical drawdowns)
        gov_stability = 94.0  # Sovereign backing, ~2.4% volatility, ~2.1% max drawdown
        mkt_stability = 54.0  # Equity risk, ~15.6% volatility, ~28.4% max drawdown

        # 3. Liquidity Scores
        if liquidity_req == "high":
            gov_liquidity = 76.0  # T+1 secondary clearing, specific lock-ins for savings bonds
            mkt_liquidity = 96.0  # Continuous intra-day exchange trading
        elif liquidity_req == "medium":
            gov_liquidity = 88.0
            mkt_liquidity = 90.0
        else:  # low
            gov_liquidity = 96.0
            mkt_liquidity = 78.0

        # 4. Transparent Weighted Suitability Formula:
        # Suitability = (Risk Match × 0.45) + (Stability × 0.30) + (Liquidity × 0.25)
        gov_suitability = round(
            (gov_risk_match * self.risk_weight)
            + (gov_stability * self.stability_weight)
            + (gov_liquidity * self.liquidity_weight),
            1
        )
        mkt_suitability = round(
            (mkt_risk_match * self.risk_weight)
            + (mkt_stability * self.stability_weight)
            + (mkt_liquidity * self.liquidity_weight),
            1
        )

        explanation = self.generate_explanation(
            risk_profile=risk_profile,
            duration_years=duration_years,
            goal=goal,
            gov_suitability=gov_suitability,
            mkt_suitability=mkt_suitability,
            gov_risk_match=gov_risk_match,
            mkt_risk_match=mkt_risk_match,
        )

        return {
            "weights": {
                "risk_match_weight": self.risk_weight,
                "stability_weight": self.stability_weight,
                "liquidity_weight": self.liquidity_weight,
                "formula_display": "Suitability = (Risk Match × 45%) + (Stability × 30%) + (Liquidity × 25%)",
            },
            "government_category": {
                "category_name": "Government Securities & Sovereign Instruments",
                "suitability_score": gov_suitability,
                "risk_match": round(gov_risk_match, 1),
                "stability_score": round(gov_stability, 1),
                "liquidity_score": round(gov_liquidity, 1),
                "volatility_score": 15.0,  # 0-100 scale (low volatility)
                "drawdown_indicator": "Minimal (~2.1% max historical)",
                "trend_indicator": "STABLE_SOVEREIGN_ACCRETION",
                "breakdown_explanation": (
                    f"Risk Match ({gov_risk_match:.0f} × 45%) + Stability ({gov_stability:.0f} × 30%) + "
                    f"Liquidity ({gov_liquidity:.0f} × 25%) = {gov_suitability:.1f}"
                ),
            },
            "market_category": {
                "category_name": "Market-Linked Instruments & Equities",
                "suitability_score": mkt_suitability,
                "risk_match": round(mkt_risk_match, 1),
                "stability_score": round(mkt_stability, 1),
                "liquidity_score": round(mkt_liquidity, 1),
                "volatility_score": 78.0,  # 0-100 scale (elevated volatility)
                "drawdown_indicator": "Elevated (~28.4% max historical)",
                "trend_indicator": "CYCLICAL_GROWTH_BIAS",
                "breakdown_explanation": (
                    f"Risk Match ({mkt_risk_match:.0f} × 45%) + Stability ({mkt_stability:.0f} × 30%) + "
                    f"Liquidity ({mkt_liquidity:.0f} × 25%) = {mkt_suitability:.1f}"
                ),
            },
            "analytical_explanation": explanation,
            "compliance_notice": (
                "Historical performance does not guarantee future results. "
                "Suitability metrics represent mathematical multi-factor models based on user inputs "
                "and available market telemetry. Final allocation decisions rest solely with the user."
            ),
        }

    def generate_explanation(
        self,
        risk_profile: str,
        duration_years: int,
        goal: str,
        gov_suitability: float,
        mkt_suitability: float,
        gov_risk_match: float,
        mkt_risk_match: float,
    ) -> str:
        """
        Synthesizes objective, metric-driven reasoning without hardcoded advice or forbidden phrases.
        """
        if risk_profile == "conservative" or duration_years <= 2:
            lead = (
                f"Based on the supplied {risk_profile} risk profile and {duration_years}-year time horizon, "
                f"the government-backed category reflects a stronger risk match ({gov_risk_match:.0f}/100) "
                f"and higher stability (94.0/100), accompanied by minimal historical drawdown potential."
            )
            context = (
                f"Conversely, the market-linked category presents elevated volatility (~15.7%) and historical "
                f"drawdown exposure (~28.4%), which represents a less aligned fit for short horizons requiring principal preservation."
            )
        elif risk_profile == "aggressive" and duration_years >= 5:
            lead = (
                f"Based on the supplied {risk_profile} risk profile and extended {duration_years}-year time horizon, "
                f"the market-linked category reflects an elevated risk match ({mkt_risk_match:.0f}/100), "
                f"allowing longer recovery periods against historical drawdowns in exchange for cyclical capital expansion."
            )
            context = (
                f"The government-security category currently maintains lower price volatility and predictable yields (~7.08%), "
                f"serving primarily as a capital preservation anchor rather than aggressive growth driver."
            )
        else:  # Moderate or balanced
            lead = (
                f"Based on the selected {risk_profile} risk profile and {duration_years}-year time horizon, "
                f"the government-security category currently demonstrates lower volatility and high sovereign stability, "
                f"while the market-linked category exhibits greater exposure to cyclical price fluctuations and secondary liquidity."
            )
            context = (
                f"Suitability scores indicate a balanced comparative profile ({gov_suitability:.1f} vs {mkt_suitability:.1f}), "
                f"highlighting the trade-off between predictable sovereign yield accretion and market-driven variance."
            )

        disclaimer = "Simulation result based on supplied data. Historical performance does not guarantee future outcomes."
        return f"{lead} {context} {disclaimer}"

    def simulate_scenarios(
        self,
        initial_amount: float,
        duration_years: int,
        category: str = "government_backed",
        historical_volatility: Optional[float] = None,
    ) -> Dict[str, Any]:
        """
        Executes multi-scenario mathematical simulations.
        Generates yearly trajectory bands (conservative, base, high-volatility) with explicit simulation labeling.
        """
        initial_amount = max(100.0, float(initial_amount))
        duration_years = max(1, min(30, int(duration_years)))
        category = category.lower()

        is_gov = "gov" in category or "sovereign" in category
        is_blend = "blend" in category or "balanced" in category

        # Determine baseline annualized drift and standard deviation
        if is_gov:
            base_drift = 0.071  # 7.1% benchmark sovereign yield
            annual_vol = historical_volatility or 0.025  # 2.5% volatility
            cat_name = "Government Securities Category"
        elif is_blend:
            base_drift = 0.108  # 10.8% blended benchmark
            annual_vol = historical_volatility or 0.088  # 8.8% volatility
            cat_name = "Balanced Allocation Blend"
        else:  # market_linked
            base_drift = 0.138  # 13.8% equity index historical CAGR
            annual_vol = historical_volatility or 0.162  # 16.2% volatility
            cat_name = "Market-Linked Instruments Category"

        scenarios = {
            "conservative": {
                "scenario_title": "Conservative Scenario (Adverse / Lower Tail)",
                "description": "Models lower economic drift and unfavorable inflation or macro drawdowns.",
                "drift_rate_pct": round((base_drift - 1.2 * annual_vol) * 100, 2),
                "assumed_volatility_pct": round(annual_vol * 100, 2),
                "annual_trajectory": [],
            },
            "base": {
                "scenario_title": "Base Scenario (Median Historical Drift)",
                "description": "Models standard long-term trend based on current baseline yields and median market drift.",
                "drift_rate_pct": round(base_drift * 100, 2),
                "assumed_volatility_pct": round(annual_vol * 100, 2),
                "annual_trajectory": [],
            },
            "high_volatility": {
                "scenario_title": "High-Volatility Scenario (Elevated Variance / Dispersion)",
                "description": "Simulates heightened market turbulence with wider dispersion between upper and lower bounds.",
                "drift_rate_pct": round(base_drift * 100, 2),
                "assumed_volatility_pct": round(annual_vol * 1.8 * 100, 2),
                "annual_trajectory": [],
            },
        }

        # Year-by-year trajectory calculation
        for yr in range(duration_years + 1):
            if yr == 0:
                for scn_key in scenarios:
                    scenarios[scn_key]["annual_trajectory"].append({
                        "year": 0,
                        "lower_bound": initial_amount,
                        "median_estimate": initial_amount,
                        "upper_bound": initial_amount,
                    })
                continue

            # Conservative scenario: lower drift, downside drift
            c_drift = max(-0.02, base_drift - 1.1 * annual_vol)
            c_median = initial_amount * ((1 + c_drift) ** yr)
            c_lower = c_median * (1 - 0.5 * annual_vol * math.sqrt(yr))
            c_upper = c_median * (1 + 0.3 * annual_vol * math.sqrt(yr))
            scenarios["conservative"]["annual_trajectory"].append({
                "year": yr,
                "lower_bound": round(max(0.0, c_lower), 2),
                "median_estimate": round(c_median, 2),
                "upper_bound": round(c_upper, 2),
            })

            # Base scenario: median drift with 1-sigma spread
            b_drift = base_drift
            b_median = initial_amount * ((1 + b_drift) ** yr)
            b_lower = b_median * (1 - 0.8 * annual_vol * math.sqrt(yr))
            b_upper = b_median * (1 + 0.8 * annual_vol * math.sqrt(yr))
            scenarios["base"]["annual_trajectory"].append({
                "year": yr,
                "lower_bound": round(max(0.0, b_lower), 2),
                "median_estimate": round(b_median, 2),
                "upper_bound": round(b_upper, 2),
            })

            # High volatility scenario: wider 2-sigma spread
            hv_vol = annual_vol * 1.8
            hv_median = initial_amount * ((1 + base_drift) ** yr)
            hv_lower = hv_median * (1 - 1.6 * hv_vol * math.sqrt(yr))
            hv_upper = hv_median * (1 + 1.8 * hv_vol * math.sqrt(yr))
            scenarios["high_volatility"]["annual_trajectory"].append({
                "year": yr,
                "lower_bound": round(max(0.0, hv_lower), 2),
                "median_estimate": round(hv_median, 2),
                "upper_bound": round(hv_upper, 2),
            })

        # Summary figures at terminal year
        for scn_key, scn in scenarios.items():
            final_pt = scn["annual_trajectory"][-1]
            scn["terminal_summary"] = {
                "duration_years": duration_years,
                "projected_median": final_pt["median_estimate"],
                "projected_range": f"₹{final_pt['lower_bound']:,.2f} – ₹{final_pt['upper_bound']:,.2f}",
                "implied_absolute_growth_pct": round(
                    ((final_pt["median_estimate"] - initial_amount) / initial_amount) * 100, 2
                ),
            }

        return {
            "initial_amount": initial_amount,
            "duration_years": duration_years,
            "category": cat_name,
            "badge": "ILLUSTRATIVE SIMULATION",
            "disclaimer": (
                "ILLUSTRATIVE SIMULATION ONLY. Mathematical model derived from historical variance and current baseline yields. "
                "Historical performance does not guarantee future results. Not intended as financial advice."
            ),
            "scenarios": scenarios,
        }


# Global Singleton Instance
financial_engine = FinancialAnalysisEngine()
