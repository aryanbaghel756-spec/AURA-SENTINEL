"""
Unit Tests for AURA Sentinel 0/1 Knapsack Budget Optimizer
==========================================================
Verifies true Dynamic Programming recurrence, backtracking reconstruction,
capacity constraints, discrete non-fractional selection, and input validation.
"""

import sys
import unittest
from typing import List, Dict, Any

from investment_optimizer import (
    knapsack_01_dp,
    validate_investment_inputs,
    optimize_budget_portfolio,
    DEFAULT_CANDIDATE_INVESTMENTS,
)


class TestKnapsack01BudgetOptimizer(unittest.TestCase):

    def setUp(self):
        # Standard candidate pool for predictable math tests
        self.sample_items = [
            {"id": "ctrl_1", "name": "Control A", "cost": 100000, "risk_reduction": 15, "category": "Net"},
            {"id": "ctrl_2", "name": "Control B", "cost": 200000, "risk_reduction": 25, "category": "Endpoint"},
            {"id": "ctrl_3", "name": "Control C", "cost": 300000, "risk_reduction": 40, "category": "Data"},
            {"id": "ctrl_4", "name": "Control D", "cost": 150000, "risk_reduction": 20, "category": "Identity"},
            {"id": "ctrl_5", "name": "Control E", "cost": 50000,  "risk_reduction": 8,  "category": "Training"},
        ]

    # Test 1: Budget = ₹0 -> No investment selected
    def test_01_zero_budget(self):
        res = knapsack_01_dp(budget=0, investments=self.sample_items)
        self.assertEqual(res["total_cost"], 0.0)
        self.assertEqual(res["total_risk_reduction"], 0.0)
        self.assertEqual(len(res["selected_investments"]), 0)
        self.assertEqual(len(res["excluded_investments"]), len(self.sample_items))
        self.assertEqual(res["remaining_budget"], 0.0)

    # Test 2: Budget smaller than every investment -> No investment selected
    def test_02_budget_smaller_than_all_items(self):
        min_cost = min(item["cost"] for item in self.sample_items)
        small_budget = min_cost - 5000  # ₹45,000 < ₹50,000
        res = knapsack_01_dp(budget=small_budget, investments=self.sample_items)
        self.assertEqual(res["total_cost"], 0.0)
        self.assertEqual(res["total_risk_reduction"], 0.0)
        self.assertEqual(len(res["selected_investments"]), 0)
        self.assertEqual(res["remaining_budget"], small_budget)

    # Test 3: Budget exactly matches one investment -> That investment can be selected
    def test_03_budget_exactly_matches_one_investment(self):
        single_item = [{"id": "single", "name": "Single Control", "cost": 100000, "risk_reduction": 20}]
        res = knapsack_01_dp(budget=100000, investments=single_item)
        self.assertEqual(res["total_cost"], 100000)
        self.assertEqual(res["total_risk_reduction"], 20)
        self.assertEqual(len(res["selected_investments"]), 1)
        self.assertEqual(res["selected_investments"][0]["id"], "single")
        self.assertEqual(res["remaining_budget"], 0)

    # Test 4: Multiple combinations -> DP chooses the combination with maximum total value
    def test_04_maximum_value_combination_selection(self):
        # Classical knapsack trap for greedy algorithms:
        # Item 1: cost 60,000, val 60 (ratio 0.001)
        # Item 2: cost 50,000, val 40 (ratio 0.0008)
        # Item 3: cost 50,000, val 40 (ratio 0.0008)
        # Budget = 100,000
        # Greedy by ratio picks Item 1 (val 60), leaving 40k (cannot pick Item 2 or 3) -> Total 60
        # Optimal DP picks Item 2 + Item 3 -> cost 100,000, value 80!
        trap_items = [
            {"id": "greedy_trap", "name": "Greedy Trap", "cost": 60000, "risk_reduction": 60},
            {"id": "opt_a", "name": "Optimal Part 1", "cost": 50000, "risk_reduction": 40},
            {"id": "opt_b", "name": "Optimal Part 2", "cost": 50000, "risk_reduction": 40},
        ]
        res = knapsack_01_dp(budget=100000, investments=trap_items, budget_unit=1000)
        selected_ids = {item["id"] for item in res["selected_investments"]}
        self.assertEqual(res["total_risk_reduction"], 80)
        self.assertEqual(res["total_cost"], 100000)
        self.assertIn("opt_a", selected_ids)
        self.assertIn("opt_b", selected_ids)
        self.assertNotIn("greedy_trap", selected_ids)

    # Test 5: Verify total_cost <= budget strictly holds across various budgets
    def test_05_total_cost_never_exceeds_budget(self):
        for budget in [25000, 75000, 150000, 300000, 500000, 750000, 1200000]:
            res = knapsack_01_dp(budget=budget, investments=DEFAULT_CANDIDATE_INVESTMENTS)
            self.assertLessEqual(
                res["total_cost"],
                budget,
                f"Total cost ({res['total_cost']}) exceeded budget ({budget})!"
            )
            self.assertEqual(res["remaining_budget"], round(budget - res["total_cost"], 2))

    # Test 6: Verify no investment appears more than once (0/1 constraint)
    def test_06_no_duplicate_item_selection(self):
        # Even with generous budget allowing all items
        generous_budget = 5000000
        res = knapsack_01_dp(budget=generous_budget, investments=DEFAULT_CANDIDATE_INVESTMENTS)
        selected_ids = [item["id"] for item in res["selected_investments"]]
        self.assertEqual(len(selected_ids), len(set(selected_ids)), "Duplicate investment found in selected items!")

    # Test 7: Verify changing budget changes the optimization result appropriately
    def test_07_changing_budget_alters_optimal_portfolio(self):
        res_small = knapsack_01_dp(budget=150000, investments=self.sample_items)
        res_med   = knapsack_01_dp(budget=350000, investments=self.sample_items)
        res_large = knapsack_01_dp(budget=800000, investments=self.sample_items)

        self.assertLess(res_small["total_cost"], res_med["total_cost"])
        self.assertLessEqual(res_small["total_risk_reduction"], res_med["total_risk_reduction"])
        self.assertLess(res_med["total_cost"], res_large["total_cost"])
        self.assertLessEqual(res_med["total_risk_reduction"], res_large["total_risk_reduction"])

        ids_small = {item["id"] for item in res_small["selected_investments"]}
        ids_large = {item["id"] for item in res_large["selected_investments"]}
        self.assertNotEqual(ids_small, ids_large)

    # Test 8: Verify backtracking correctly reconstructs the selected and excluded items
    def test_08_backtracking_reconstruction(self):
        res = knapsack_01_dp(budget=300000, investments=self.sample_items)
        selected = res["selected_investments"]
        excluded = res["excluded_investments"]

        # Disjoint union check
        all_ids = {item["id"] for item in self.sample_items}
        sel_ids = {item["id"] for item in selected}
        exc_ids = {item["id"] for item in excluded}

        self.assertEqual(sel_ids.intersection(exc_ids), set(), "Selected and excluded sets must be disjoint.")
        self.assertEqual(sel_ids.union(exc_ids), all_ids, "Union of selected and excluded must equal full catalog.")

        # Sum verification
        self.assertEqual(res["total_cost"], sum(item["cost"] for item in selected))
        self.assertEqual(res["total_risk_reduction"], round(sum(item["risk_reduction"] for item in selected), 2))

    # Test 9: Input Validation Tests (Negative Budget, Negative Cost, Malformed)
    def test_09_input_validation_rejections(self):
        with self.assertRaises(ValueError):
            validate_investment_inputs(budget=-5000)

        with self.assertRaises(ValueError):
            validate_investment_inputs(budget=50000, investments=[{"id": "bad", "name": "Bad", "cost": -100, "risk_reduction": 10}])

        with self.assertRaises(ValueError):
            validate_investment_inputs(budget=50000, investments=[{"id": "bad", "name": "Bad", "cost": 100, "risk_reduction": 150}])

        with self.assertRaises(ValueError):
            validate_investment_inputs(budget=50000, investments=[{"id": "dup", "name": "A", "cost": 10, "risk_reduction": 5}, {"id": "dup", "name": "B", "cost": 20, "risk_reduction": 10}])

    # Test 10: High-Level Portfolio Integration (Exposure & ROSI)
    def test_10_portfolio_financial_integration(self):
        exposure = 1000000.0  # ₹10,00,000 baseline exposure
        budget = 500000.0
        portfolio = optimize_budget_portfolio(
            budget=budget,
            current_exposure=exposure,
            investments=DEFAULT_CANDIDATE_INVESTMENTS,
            business_type="Enterprise",
        )
        self.assertEqual(portfolio["algorithm"], "0/1 Knapsack Dynamic Programming")
        self.assertLessEqual(portfolio["total_cost"], budget)
        self.assertLess(portfolio["projected_exposure"], exposure)
        self.assertGreater(portfolio["potential_savings"], 0)
        self.assertIn("explanation", portfolio)
        self.assertGreater(len(portfolio["explanation"]), 0)


if __name__ == "__main__":
    unittest.main()
