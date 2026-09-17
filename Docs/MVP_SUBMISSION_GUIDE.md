# 🛡️ AURA SENTINEL — SIH 2026 OFFICIAL MVP SUBMISSION GUIDE
**Problem Statement ID:** SIH26105  
**Theme:** Blockchain & Cybersecurity  
**Organization:** All India Council for Technical Education (AICTE - Cyber Security Cell)  
**Category:** Software | Enterprise & Campus Cyber Resilience  

---

## 🚀 1-Click MVP Launcher
To launch the complete system in 1-click on your Windows machine:
1. Double-click **`run_aura_mvp.bat`** in the project root directory.
2. It automatically starts:
   - **Backend API Server:** `http://127.0.0.1:8000` (FastAPI + YOLOv8 + MediaPipe + Blockchain)
   - **Frontend SOC Dashboard:** `http://localhost:5173` (Vite + React)
   - Opens your default web browser directly to the dashboard.

---

## 🖐️ Complete Neural Hand Gesture & Mouse Automation Guide

| Gesture | Real-World Action | Windows Trigger | HUD Feedback |
| :--- | :--- | :--- | :--- |
| **Index Finger Point & Move** | **Mouse Cursor Movement** | Moves pointer smoothly with jitter-free EMA filter | `🖱️ POINTER @ (X, Y)` |
| **Thumb + Index Quick Pinch** | **Mouse Left Click / Double Click** | `pyautogui.click()` (tap pinch <0.28s) | `👆 LEFT CLICK` / `⚡ DOUBLE CLICK` |
| **Thumb + Index Hold Pinch** | **File Pick & Drag** | `pyautogui.mouseDown()` (held >0.28s) | `✊ FILE PICKED - DRAGGING...` |
| **Release Pinch** | **File Drop** | `pyautogui.mouseUp()` | `🖐️ FILE DROPPED / PLACED` |
| **Thumb + Ring Finger Pinch** | **Mouse Right Click** | `pyautogui.rightClick()` | `🖱️ MOUSE RIGHT CLICK` |
| **Thumb + Middle Pinch & Slide** | **Volume Up (+) / Volume Down (-)** | `pyautogui.press('volumeup')` / `'volumedown'` | `🔊 VOLUME UP` / `🔉 VOLUME DOWN` |
| **🤞 Crossed Fingers (Index over Middle)** | **File Delete** | `pyautogui.press('delete')` | `🚨 FILE DELETED (DELETE KEY)` |
| **☝️ Single Index Finger Show (Held 0.4s)** | **Create New Folder** | `pyautogui.hotkey('ctrl', 'shift', 'n')` | `📁 NEW FOLDER CREATED` |
| **✌️ Peace Sign ('V' Shape)** | **Window Jump (Switch App)** | `pyautogui.hotkey('alt', 'tab')` | `🪟 WINDOW JUMP (ALT+TAB)` |
| **Index + Middle Parallel Move** | **Two-Finger Scroll** | `pyautogui.scroll(150)` / `(-150)` | `📜 SCROLLING UP/DOWN` |

---

## 🔒 Zero-Trust Screen Disappearance Auto-Lock
- **Continuous Presence:** Camera continuously tracks operator face/person via YOLOv8.
- **Departure Detection:** When operator steps away from the camera, a warning countdown appears:  
  `⚠️ OPERATOR ABSENT! AUTO-LOCK IN 5s`
- **Native Lock:** If operator is not back within the grace period (3s, 5s, 10s, or 15s), AURA instantly locks Windows via `ctypes.windll.user32.LockWorkStation()` and logs a critical incident to SQLite.
- **Fail-Safe:** While making active hand gestures, the timer automatically refreshes to prevent false locks.

---

## ⛓️ Blockchain-Backed Audit Ledger (SIH26105 Core Theme)
- **SHA-256 Blocks + Merkle Tree Roots:** Every risk evaluation, FAIR loss estimate (in ₹ INR), security investment decision, and quarantine action is cryptographically sealed.
- **Evaluator Live Demo (3-Step Pitch):**
  1. Click **`[ 🛡️ RUN INTEGRITY AUDIT ]`**: Recalculates Merkle roots across the entire chain -> **100% AUTHENTIC**.
  2. Click **`[ ⚠️ SIMULATE TAMPER ATTACK ]`**: Secretly edits Block #1 historical loss -> Turant **CRITICAL AUDIT BREACH DETECTED** banner appears!
  3. Click **`[ 🔄 RESTORE CONSENSUS ]`**: Restores pristine chain from decentralized authority backup -> Returns to **100% SECURE**.

---

## 📊 Complete 10 Modules Breakdown

1. **System Monitoring (01):** Hardware CPU, RAM, Disk telemetry & rogue process termination.
2. **Attack Surface (02):** Automated localhost service scanner & 360° radar perimeter mapping.
3. **Risk Intelligence (03):** NIST CSF 2.0 multi-vector composite posture score (0–100).
4. **Financial Risk (04):** Actuarial business disruption loss modeling in **₹ Indian Rupees (INR)**.
5. **What-If Engine (05):** Stress simulation sandbox (Ransomware, Port Floods, Brute Force).
6. **Investment Optimizer (06):** Pareto knapsack budget allocator maximizing cybersecurity ROSI/ROI.
7. **AI Voice Copilot (07):** Multilingual assistant (Hindi/Hinglish/English) with Groq inference.
8. **File Security (08):** PII & credential scanner (Aadhaar, PAN, API keys) with isolated quarantine vault.
9. **Vision & Gesture Control (09):** YOLOv8 tracking, Zero-Trust auto-lock, and neural hand gestures.
10. **Blockchain Ledger (10):** Cryptographic SHA-256 Merkle audit trail for SIH theme compliance.
