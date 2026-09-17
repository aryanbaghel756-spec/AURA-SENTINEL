"""
AURA SENTINEL - Neural Hand Gesture & Full Mouse Automation Engine (SIH26105)
Translates real-time MediaPipe Hand landmarks into complete OS control:

1. Mouse Navigation & Cursor:
   - Index Finger Movement: Smooth mouse cursor tracking (jitter-free EMA).
   - Quick Pinch (Thumb + Index < 0.3s): Mouse Left Click.
   - Double Pinch (Within 0.4s): Mouse Double Click.
   - Sustained Pinch (> 0.3s): File Pick & Drag (mouseDown).
   - Pinch Release: File Drop (mouseUp).
   - Thumb + Ring Pinch: Mouse Right Click.
   - Index + Middle Parallel Scroll: Two-finger vertical scroll.

2. OS Control Gestures:
   - Pinch & Slide (Thumb + Middle): Volume Up (Slide Up) / Volume Down (Slide Down).
   - Crossed Fingers (🤞): File Delete (Delete key).
   - Single Index Finger Show (☝️): Create New Folder (Ctrl + Shift + N).
   - Peace Sign (✌️): Window Jump (Alt + Tab).
"""

import time
import math
import cv2
import numpy as np
import mediapipe as mp
import pyautogui

# Safety fail-safe for pyautogui
pyautogui.FAILSAFE = False
pyautogui.PAUSE = 0.0


class GestureController:
    def __init__(self, enabled: bool = True):
        self.enabled = enabled
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.50,
            min_tracking_confidence=0.50,
        )
        self.mp_draw = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles

        # Screen dimensions
        self.screen_w, self.screen_h = pyautogui.size()
        self.prev_x, self.prev_y = self.screen_w // 2, self.screen_h // 2
        self.smoothing = 0.42  # Exponential smoothing factor

        # Interaction Boundary Margin (in frame percentage)
        self.margin_x = 0.08
        self.margin_y = 0.10

        # Mouse Drag & Click States
        self.is_dragging = False
        self.pinch_start_time = 0.0
        self.last_pinch_release_time = 0.0
        self.pinch_click_threshold = 0.28  # seconds for click vs drag

        # Volume Pinch Tracking
        self.last_volume_time = 0.0
        self.volume_cooldown = 0.15
        self.prev_volume_pinch_y = None
        self.simulated_volume_level = 50  # Display only

        # Action Cooldowns
        self.last_window_jump_time = 0.0
        self.jump_cooldown = 0.85

        self.last_delete_time = 0.0
        self.delete_cooldown = 1.5

        self.last_right_click_time = 0.0
        self.right_click_cooldown = 0.6

        # Scroll Tracking
        self.prev_scroll_y = None
        self.last_scroll_time = 0.0

        # State Hold Timers
        self.finger_cross_hold_start = 0.0

        # HUD Feedback
        self.active_gesture = "SEARCHING"
        self.gesture_feedback = ""
        self.feedback_banner = ""
        self.feedback_banner_time = 0.0
        self.feedback_banner_color = (0, 240, 255)

    def _norm_dist(self, p1, p2):
        """Calculates normalized Euclidean distance between two landmarks."""
        return math.hypot(p2.x - p1.x, p2.y - p1.y)

    def set_feedback(self, text: str, color=(0, 240, 255), duration=1.5):
        self.feedback_banner = text
        self.feedback_banner_color = color
        self.feedback_banner_time = time.time() + duration

    def process_frame(self, frame: np.ndarray) -> np.ndarray:
        if not self.enabled:
            return frame

        h, w, _ = frame.shape
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb_frame)

        now = time.time()
        self.active_gesture = "SEARCHING"
        self.gesture_feedback = ""

        # Auto release mouse down if hand disappeared while dragging
        if not results.multi_hand_landmarks:
            if self.is_dragging:
                try:
                    pyautogui.mouseUp()
                except Exception:
                    pass
                self.is_dragging = False
            self.prev_volume_pinch_y = None
            self.prev_scroll_y = None
            self.finger_cross_hold_start = 0.0
            return self._draw_hud(frame, None, False)

        hand_landmarks = results.multi_hand_landmarks[0]
        lm = hand_landmarks.landmark

        # Draw hand skeleton with cyber aesthetics
        self.mp_draw.draw_landmarks(
            frame,
            hand_landmarks,
            self.mp_hands.HAND_CONNECTIONS,
            self.mp_drawing_styles.get_default_hand_landmarks_style(),
            self.mp_drawing_styles.get_default_hand_connections_style(),
        )

        # Key Landmarks
        wrist = lm[0]
        thumb_tip = lm[4]
        thumb_ip = lm[3]

        index_tip = lm[8]
        index_pip = lm[6]
        index_mcp = lm[5]

        middle_tip = lm[12]
        middle_pip = lm[10]
        middle_mcp = lm[9]

        ring_tip = lm[16]
        ring_pip = lm[14]
        ring_mcp = lm[13]

        pinky_tip = lm[20]
        pinky_pip = lm[18]
        pinky_mcp = lm[17]

        # Robust Finger Extension Status (scale-invariant via wrist distance)
        def is_extended(tip, pip, mcp):
            dist_tip = math.hypot(tip.x - wrist.x, tip.y - wrist.y)
            dist_pip = math.hypot(pip.x - wrist.x, pip.y - wrist.y)
            return (dist_tip > dist_pip * 1.10) and (tip.y < mcp.y or dist_tip > dist_pip * 1.25)

        index_up = is_extended(index_tip, index_pip, index_mcp)
        middle_up = is_extended(middle_tip, middle_pip, middle_mcp)
        ring_up = is_extended(ring_tip, ring_pip, ring_mcp)
        pinky_up = is_extended(pinky_tip, pinky_pip, pinky_mcp)

        # Thumb extension
        thumb_dist_tip = math.hypot(thumb_tip.x - wrist.x, thumb_tip.y - wrist.y)
        thumb_dist_ip = math.hypot(thumb_ip.x - wrist.x, thumb_ip.y - wrist.y)
        thumb_up = thumb_dist_tip > thumb_dist_ip * 1.15

        # Normalized Distances
        thumb_index_dist = self._norm_dist(thumb_tip, index_tip)
        thumb_middle_dist = self._norm_dist(thumb_tip, middle_tip)
        thumb_ring_dist = self._norm_dist(thumb_tip, ring_tip)
        index_middle_dist = self._norm_dist(index_tip, middle_tip)

        # Dynamic Cursor Position Mapping (frame is already mirrored in main.py)
        norm_x = (index_tip.x - self.margin_x) / (1.0 - 2 * self.margin_x)
        norm_y = (index_tip.y - self.margin_y) / (1.0 - 2 * self.margin_y)
        norm_x = float(np.clip(norm_x, 0.0, 1.0))
        norm_y = float(np.clip(norm_y, 0.0, 1.0))

        target_x = int(norm_x * self.screen_w)
        target_y = int(norm_y * self.screen_h)
        curr_x = int(self.prev_x + (target_x - self.prev_x) * self.smoothing)
        curr_y = int(self.prev_y + (target_y - self.prev_y) * self.smoothing)
        self.prev_x, self.prev_y = curr_x, curr_y

        # =====================================================================
        # GESTURE 1: ✌️ PEACE SIGN -> WINDOW JUMP (Alt + Tab)
        # =====================================================================
        if index_up and middle_up and not ring_up and not pinky_up and index_middle_dist > 0.040:
            self.active_gesture = "WINDOW_JUMP"
            self.gesture_feedback = "✌️ PEACE SIGN: ALT+TAB WINDOW SWITCH"

            if now - self.last_window_jump_time > self.jump_cooldown:
                try:
                    pyautogui.hotkey("alt", "tab")
                    self.last_window_jump_time = now
                    self.set_feedback("🪟 WINDOW JUMP (ALT+TAB)", color=(0, 240, 255), duration=1.2)
                except Exception as e:
                    print(f"Window jump error: {e}")

            return self._draw_hud(frame, (curr_x, curr_y), is_pinched=False)

        # =====================================================================
        # GESTURE 2: 🖐️ OPEN PALM -> DEFENSIVE SHIELD ACTIVE
        # =====================================================================
        if thumb_up and index_up and middle_up and ring_up and pinky_up:
            self.active_gesture = "OPEN_PALM_SHIELD"
            self.gesture_feedback = "🖐️ OPEN PALM: ZERO-TRUST DEFENSIVE SHIELD ACTIVE"
            palm_cx = int(middle_mcp.x * w)
            palm_cy = int(middle_mcp.y * h)
            cv2.circle(frame, (palm_cx, palm_cy), int(h * 0.22), (0, 255, 136), 2)
            cv2.circle(frame, (palm_cx, palm_cy), int(h * 0.25), (0, 240, 255), 1)
            return self._draw_hud(frame, None, is_pinched=False)

        # =====================================================================
        # GESTURE 3: ✊ CLOSED FIST -> INPUT STANDBY / PAUSE
        # =====================================================================
        if not index_up and not middle_up and not ring_up and not pinky_up and not thumb_up:
            self.active_gesture = "CLOSED_FIST_STANDBY"
            self.gesture_feedback = "✊ FIST: INPUT STANDBY / PAUSED"
            if self.is_dragging:
                try:
                    pyautogui.mouseUp()
                except Exception:
                    pass
                self.is_dragging = False
            return self._draw_hud(frame, None, is_pinched=False)

        # =====================================================================
        # GESTURE 4: 🤏 PINCH VOLUME UP / DOWN (Thumb + Middle Finger Slide)
        # =====================================================================
        if thumb_middle_dist < 0.065:
            self.active_gesture = "VOLUME_PINCH_SLIDE"
            current_pinch_y = int(middle_tip.y * h)

            mid_px = int((thumb_tip.x + middle_tip.x) / 2.0 * w)
            mid_py = int((thumb_tip.y + middle_tip.y) / 2.0 * h)
            cv2.circle(frame, (mid_px, mid_py), 20, (0, 255, 255), 3)

            if self.prev_volume_pinch_y is not None:
                delta_y = self.prev_volume_pinch_y - current_pinch_y  # UP is positive
                if abs(delta_y) > 10 and (now - self.last_volume_time > self.volume_cooldown):
                    if delta_y > 0:
                        try:
                            pyautogui.press("volumeup")
                            self.simulated_volume_level = min(100, self.simulated_volume_level + 5)
                            self.set_feedback(f"🔊 VOLUME UP (+{self.simulated_volume_level}%)", color=(0, 255, 136), duration=0.8)
                        except Exception:
                            pass
                    else:
                        try:
                            pyautogui.press("volumedown")
                            self.simulated_volume_level = max(0, self.simulated_volume_level - 5)
                            self.set_feedback(f"🔉 VOLUME DOWN (-{self.simulated_volume_level}%)", color=(255, 165, 0), duration=0.8)
                        except Exception:
                            pass

                    self.last_volume_time = now
                    self.prev_volume_pinch_y = current_pinch_y
            else:
                self.prev_volume_pinch_y = current_pinch_y

            self.gesture_feedback = f"🤏 PINCH VOLUME: SLIDE UP/DOWN ({self.simulated_volume_level}%)"
            return self._draw_hud(frame, (curr_x, curr_y), is_pinched=False)
        else:
            self.prev_volume_pinch_y = None

        # =====================================================================
        # GESTURE 5: 📜 TWO-FINGER SCROLL (Index + Middle Held Together)
        # =====================================================================
        if index_up and middle_up and not ring_up and not pinky_up and index_middle_dist <= 0.040:
            self.active_gesture = "TWO_FINGER_SCROLL"
            current_scroll_y = int(index_tip.y * h)

            if self.prev_scroll_y is not None:
                delta_scroll = self.prev_scroll_y - current_scroll_y
                if abs(delta_scroll) > 8 and (now - self.last_scroll_time > 0.07):
                    scroll_amt = 180 if delta_scroll > 0 else -180
                    try:
                        pyautogui.scroll(scroll_amt)
                        self.last_scroll_time = now
                        self.set_feedback("📜 SCROLLING UP" if delta_scroll > 0 else "📜 SCROLLING DOWN", color=(0, 200, 255), duration=0.5)
                    except Exception:
                        pass
                    self.prev_scroll_y = current_scroll_y
            else:
                self.prev_scroll_y = current_scroll_y

            self.gesture_feedback = "📜 TWO FINGERS: MOVE UP/DOWN TO SCROLL"
            return self._draw_hud(frame, (curr_x, curr_y), is_pinched=False)
        else:
            self.prev_scroll_y = None

        # =====================================================================
        # GESTURE 6: 🤞 CROSSED FINGERS -> FILE DELETE
        # =====================================================================
        mcp_diff = index_mcp.x - middle_mcp.x
        tip_diff = index_tip.x - middle_tip.x
        is_crossed = (mcp_diff * tip_diff < 0) or (index_middle_dist < 0.028 and abs(index_pip.x - middle_pip.x) < 0.035)

        if index_up and middle_up and not ring_up and not pinky_up and is_crossed:
            self.active_gesture = "FINGER_CROSS_DELETE"
            self.gesture_feedback = "🤞 CROSSED FINGERS: HOLD TO DELETE FILE..."

            if self.finger_cross_hold_start == 0.0:
                self.finger_cross_hold_start = now

            if (now - self.finger_cross_hold_start >= 0.35) and (now - self.last_delete_time > self.delete_cooldown):
                try:
                    pyautogui.press("delete")
                    self.last_delete_time = now
                    self.set_feedback("🚨 FILE DELETED (DELETE KEY)", color=(0, 0, 255), duration=2.0)
                except Exception as e:
                    print(f"Delete key error: {e}")

            return self._draw_hud(frame, (curr_x, curr_y), is_pinched=False)
        else:
            self.finger_cross_hold_start = 0.0

        # =====================================================================
        # GESTURE 7: 🖱️ RIGHT CLICK (Thumb + Ring Finger Pinch)
        # =====================================================================
        if thumb_ring_dist < 0.058 and (now - self.last_right_click_time > self.right_click_cooldown):
            try:
                pyautogui.rightClick()
                self.last_right_click_time = now
                self.set_feedback("🖱️ MOUSE RIGHT CLICK", color=(255, 200, 0), duration=1.0)
            except Exception:
                pass
            self.active_gesture = "RIGHT_CLICK"
            self.gesture_feedback = "🖱️ RIGHT CLICK EXECUTED"
            return self._draw_hud(frame, (curr_x, curr_y), is_pinched=False)

        # =====================================================================
        # GESTURE 8: 🖱️ MOUSE NAVIGATION, CLICK, DRAG & DROP
        # =====================================================================
        is_pinched = thumb_index_dist < 0.060

        # Smooth pointer movement when index is pointing
        if index_up:
            try:
                pyautogui.moveTo(curr_x, curr_y, _pause=False)
            except Exception:
                pass

        if is_pinched:
            if self.pinch_start_time == 0.0:
                self.pinch_start_time = now

            duration = now - self.pinch_start_time

            if duration >= self.pinch_click_threshold:
                # Sustained Pinch -> FILE PICK & DRAG
                if not self.is_dragging:
                    try:
                        pyautogui.mouseDown()
                        self.is_dragging = True
                        self.set_feedback("✊ FILE PICKED - DRAGGING...", color=(0, 255, 136), duration=1.5)
                    except Exception as e:
                        print(f"MouseDown error: {e}")

                self.active_gesture = "FILE_PICK_DRAG"
                self.gesture_feedback = f"✊ DRAGGING FILE @ ({curr_x}, {curr_y})"
            else:
                self.active_gesture = "PINCH_DETECTED"
                self.gesture_feedback = "🤏 PINCHING (TAP FOR CLICK / HOLD TO DRAG)"

            # Visual Pinch Indicator
            px = int((thumb_tip.x + index_tip.x) / 2.0 * w)
            py = int((thumb_tip.y + index_tip.y) / 2.0 * h)
            cv2.circle(frame, (px, py), 18, (0, 255, 136) if self.is_dragging else (0, 240, 255), 3)

        else:
            # Pinch Released
            if self.pinch_start_time > 0.0:
                pinch_duration = now - self.pinch_start_time
                self.pinch_start_time = 0.0

                if self.is_dragging:
                    # Released after drag -> DROP FILE
                    try:
                        pyautogui.mouseUp()
                    except Exception:
                        pass
                    self.is_dragging = False
                    self.set_feedback("🖐️ FILE DROPPED / PLACED", color=(0, 255, 255), duration=1.5)
                    self.active_gesture = "FILE_DROPPED"
                    self.gesture_feedback = "🖐️ FILE DROPPED SUCCESSFULLY"
                elif pinch_duration < self.pinch_click_threshold:
                    # Quick Tap Pinch -> LEFT CLICK / DOUBLE CLICK
                    time_since_last = now - self.last_pinch_release_time
                    if time_since_last < 0.38:
                        try:
                            pyautogui.doubleClick()
                            self.set_feedback("⚡ DOUBLE CLICK", color=(0, 255, 200), duration=1.0)
                        except Exception:
                            pass
                    else:
                        try:
                            pyautogui.click()
                            self.set_feedback("👆 LEFT CLICK", color=(0, 240, 255), duration=0.8)
                        except Exception:
                            pass

                    self.last_pinch_release_time = now
                    self.active_gesture = "MOUSE_CLICK"
                    self.gesture_feedback = "👆 MOUSE CLICK EXECUTED"
            else:
                self.active_gesture = "POINTER_NAV"
                self.gesture_feedback = f"🖱️ POINTER @ ({curr_x}, {curr_y})"

        return self._draw_hud(frame, (curr_x, curr_y), is_pinched)

    def _draw_hud(self, frame: np.ndarray, cursor_pos, is_pinched: bool) -> np.ndarray:
        h, w, _ = frame.shape
        now = time.time()

        # Interaction Boundary Box
        x1 = int(self.margin_x * w)
        y1 = int(self.margin_y * h)
        x2 = int((1.0 - self.margin_x) * w)
        y2 = int((1.0 - self.margin_y) * h)
        cv2.rectangle(frame, (x1, y1), (x2, y2), (40, 70, 110), 1)

        # Crosshair on cursor pos
        if cursor_pos:
            cx, cy = cursor_pos
            norm_cx = cx / self.screen_w
            norm_cy = cy / self.screen_h
            fx = int(norm_cx * w)
            fy = int(norm_cy * h)

            crosshair_color = (0, 255, 136) if self.is_dragging else ((0, 0, 255) if is_pinched else (0, 240, 255))
            cv2.circle(frame, (fx, fy), 8, crosshair_color, -1)
            cv2.circle(frame, (fx, fy), 18, crosshair_color, 2)
            cv2.line(frame, (fx - 24, fy), (fx + 24, fy), crosshair_color, 1)
            cv2.line(frame, (fx, fy - 24), (fx, fy + 24), crosshair_color, 1)

        # Action Announcement Banner
        if now < self.feedback_banner_time and self.feedback_banner:
            banner_w = min(540, w - 40)
            bx1 = w // 2 - banner_w // 2
            bx2 = w // 2 + banner_w // 2
            cv2.rectangle(frame, (bx1, h - 85), (bx2, h - 30), (10, 15, 30), -1)
            cv2.rectangle(frame, (bx1, h - 85), (bx2, h - 30), self.feedback_banner_color, 2)
            cv2.putText(
                frame,
                self.feedback_banner,
                (bx1 + 16, h - 48),
                cv2.FONT_HERSHEY_SIMPLEX,
                0.62,
                self.feedback_banner_color,
                2,
            )

        # Bottom Telemetry Bar
        cv2.rectangle(frame, (0, h - 28), (w, h), (10, 15, 25), -1)
        hud_text = f"GESTURE: {self.active_gesture} | {self.gesture_feedback}"
        cv2.putText(frame, hud_text, (15, h - 9), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 240, 255), 1)

        return frame
