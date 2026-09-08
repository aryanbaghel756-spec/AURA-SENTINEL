from typing import Dict, Any, List

class FinancialExposureEngine:
    """
    Financial impact modeling and cybersecurity investment optimization engine.
    Calculates hourly exposure, recovery overhead, and ROI for defense investments.
    """

    BASE_HOURLY_LOSS = 15000  # INR per hour base operational loss

    @classmethod
    def calculate_exposure(
        cls,
        risk_score: float,
        cpu_usage: float,
        memory_usage: float,
        disk_usage: float,
        open_ports: int,
    ) -> Dict[str, Any]:
        """Calculates monetary exposure from a given technical risk score."""
        risk_multiplier = 1.0 + (risk_score / 100.0)
        estimated_hourly_loss = round(cls.BASE_HOURLY_LOSS * risk_multiplier)

        if risk_score >= 60:
            downtime_hours = 8
        elif risk_score >= 30:
            downtime_hours = 4
        else:
            downtime_hours = 1

        potential_incident_cost = estimated_hourly_loss * downtime_hours
        recovery_cost = round(potential_incident_cost * 0.35)
        total_financial_exposure = potential_incident_cost + recovery_cost

        if total_financial_exposure >= 250000:
            financial_level = "CRITICAL"
        elif total_financial_exposure >= 100000:
            financial_level = "HIGH"
        elif total_financial_exposure >= 50000:
            financial_level = "MODERATE"
        else:
            financial_level = "LOW"

        return {
            "financial_risk_level": financial_level,
            "technical_risk_score": risk_score,
            "estimated_hourly_loss": estimated_hourly_loss,
            "estimated_downtime_hours": downtime_hours,
            "potential_incident_cost": potential_incident_cost,
            "recovery_cost": recovery_cost,
            "total_financial_exposure": total_financial_exposure,
            "cpu_usage": round(cpu_usage, 2),
            "memory_usage": round(memory_usage, 2),
            "disk_usage": round(disk_usage, 2),
            "open_ports": open_ports,
        }

    @classmethod
    def optimize_investment(
        cls,
        monthly_budget: float,
        systems: int,
        data_value: float,
        risk_score: float,
        business_type: str = "Small Business"
    ) -> Dict[str, Any]:
        """Calculates tailored defense packages, ROI percentages, and recommended tiers."""
        downtime_hours = 8 if risk_score >= 60 else (4 if risk_score >= 30 else 1)
        data_impact = data_value * (risk_score / 100.0) * 0.20
        system_complexity_cost = systems * 2000
        base_hourly_loss = cls.BASE_HOURLY_LOSS * (1.0 + risk_score / 100.0)
        incident_cost = base_hourly_loss * downtime_hours
        recovery_cost = incident_cost * 0.35
        current_exposure = round(incident_cost + recovery_cost + data_impact + system_complexity_cost)

        plans = [
            {
                "id": "essential",
                "name": "ESSENTIAL DEFENSE",
                "cost": 25000,
                "risk_reduction": 15,
                "features": ["Endpoint protection", "System monitoring", "Basic backup strategy"]
            },
            {
                "id": "professional",
                "name": "PROFESSIONAL DEFENSE",
                "cost": 75000,
                "risk_reduction": 35,
                "features": ["Advanced monitoring", "Network hardening", "Incident response planning", "Automated backups"]
            },
            {
                "id": "enterprise",
                "name": "ENTERPRISE DEFENSE",
                "cost": 150000,
                "risk_reduction": 60,
                "features": ["Continuous threat monitoring", "Advanced endpoint security", "Network segmentation", "Incident response readiness", "Security intelligence automation"]
            },
        ]

        optimized_plans = []
        for plan in plans:
            affordable = plan["cost"] <= monthly_budget
            projected_exposure = round(current_exposure * (1 - plan["risk_reduction"] / 100.0))
            potential_savings = current_exposure - projected_exposure
            net_benefit = round(potential_savings - plan["cost"])
            roi = round((net_benefit / plan["cost"]) * 100) if plan["cost"] else 0

            score = 0
            if affordable:
                score += 40
            if net_benefit > 0:
                score += 30
            if roi > 0:
                score += min(roi, 30)

            optimized_plans.append({
                **plan,
                "affordable": affordable,
                "projected_exposure": projected_exposure,
                "potential_savings": potential_savings,
                "net_benefit": net_benefit,
                "roi_percent": roi,
                "recommendation_score": score,
            })

        affordable_plans = [p for p in optimized_plans if p["affordable"]]
        recommended = (
            max(affordable_plans, key=lambda p: (p["recommendation_score"], p["net_benefit"]))
            if affordable_plans
            else min(optimized_plans, key=lambda p: p["cost"])
        )

        return {
            "current_financial_exposure": current_exposure,
            "recommended_plan": recommended,
            "plans": optimized_plans,
        }
