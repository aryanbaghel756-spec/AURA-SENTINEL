import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

def capture_all_panels():
    out_dir = r"C:\Users\aryan\OneDrive\Desktop\Aura\Docs\dashboard_screenshots"
    os.makedirs(out_dir, exist_ok=True)

    options = Options()
    options.add_argument('--headless')
    options.add_argument('--window-size=1920,1080')
    options.add_argument('--disable-gpu')

    driver = webdriver.Chrome(options=options)
    try:
        driver.get("http://127.0.0.1:5173/")
        time.sleep(2)

        # Tab 1: Executive Overview
        driver.save_screenshot(os.path.join(out_dir, "1_executive_overview.png"))
        print("Captured 1_executive_overview.png")

        # Tab 2: Budget Optimizer
        buttons = driver.find_elements(By.TAG_NAME, "button")
        for b in buttons:
            if "Budget Optimizer" in b.text:
                b.click()
                time.sleep(1)
                driver.save_screenshot(os.path.join(out_dir, "2_budget_optimizer.png"))
                print("Captured 2_budget_optimizer.png")
                break

        # Tab 3: Merkle Audit Log
        buttons = driver.find_elements(By.TAG_NAME, "button")
        for b in buttons:
            if "Merkle Audit" in b.text:
                b.click()
                time.sleep(1)
                driver.save_screenshot(os.path.join(out_dir, "3_merkle_audit.png"))
                print("Captured 3_merkle_audit.png")
                break

        # Tab 4: Live Telemetry
        buttons = driver.find_elements(By.TAG_NAME, "button")
        for b in buttons:
            if "Live Telemetry" in b.text:
                b.click()
                time.sleep(1)
                driver.save_screenshot(os.path.join(out_dir, "4_live_telemetry.png"))
                print("Captured 4_live_telemetry.png")
                break

        # Tab 5: Single Pane
        buttons = driver.find_elements(By.TAG_NAME, "button")
        for b in buttons:
            if "Single-Pane" in b.text:
                b.click()
                time.sleep(1)
                driver.save_screenshot(os.path.join(out_dir, "5_single_pane_overview.png"))
                print("Captured 5_single_pane_overview.png")
                break

        print("All panel screenshots captured successfully!")
    finally:
        driver.quit()

if __name__ == '__main__':
    capture_all_panels()
