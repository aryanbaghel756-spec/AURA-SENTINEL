import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { api } from "../../services/api";

export default function FaceAuthModal({
  isOpen,
  onSuccess,
  onCancel,
  faceModelsLoaded,
}) {
  const videoRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const [stage, setStage] = useState("loading"); // loading | enroll | scanning | success | failed
  const [statusMessage, setStatusMessage] = useState("");

  const stopStream = () => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const getStoredDescriptor = () => {
    try {
      const saved = localStorage.getItem("aura_face_descriptor");
      return saved ? new Float32Array(JSON.parse(saved)) : null;
    } catch {
      return null;
    }
  };

  const saveDescriptor = (descriptor) => {
    const arr = Array.from(descriptor);
    localStorage.setItem("aura_face_descriptor", JSON.stringify(arr));
    try {
      const activeUser = localStorage.getItem("aura_current_user");
      const uName = activeUser ? JSON.parse(activeUser).username : "admin";
      api.saveUserBiometrics({ username: uName, descriptor: arr }).catch(() => {});
    } catch {
      // Non-blocking
    }
  };

  const resetEnrollment = () => {
    localStorage.removeItem("aura_face_descriptor");
    setStage("enroll");
    setStatusMessage("NO FACE REGISTERED — LOOK AT CAMERA TO ENROLL");
  };

  const onSuccessRef = useRef(onSuccess);
  useEffect(() => {
    onSuccessRef.current = onSuccess;
  }, [onSuccess]);

  useEffect(() => {
    if (!isOpen) {
      stopStream();
      return;
    }

    let mounted = true;

    if (!faceModelsLoaded) {
      setStage("failed");
      setStatusMessage("NEURAL BIOMETRIC MODELS NOT READY");
      return;
    }

    setStage("loading");
    setStatusMessage("INITIALIZING CAMERA SENSOR...");

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" },
        });

        if (!mounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }

        const stored = getStoredDescriptor();
        setStage(stored ? "scanning" : "enroll");
        setStatusMessage(
          stored
            ? "SCANNING BIOMETRIC SIGNATURE..."
            : "FIRST-TIME ACCESS: LOOK AT CAMERA TO ENROLL"
        );

        scanIntervalRef.current = setInterval(async () => {
          if (!videoRef.current || videoRef.current.readyState < 2) return;

          try {
            const options = new faceapi.TinyFaceDetectorOptions({
              inputSize: 416,
              scoreThreshold: 0.3,
            });

            const detection = await faceapi
              .detectSingleFace(videoRef.current, options)
              .withFaceLandmarks()
              .withFaceDescriptor();

            if (!detection) return;

            const currentStored = getStoredDescriptor();

            if (!currentStored) {
              // Enroll this face
              saveDescriptor(detection.descriptor);
              stopStream();
              setStage("success");
              setStatusMessage("BIOMETRIC PROFILE REGISTERED & VERIFIED");
              setTimeout(() => {
                onSuccessRef.current?.();
              }, 1200);
              return;
            }

            // Verify face
            const distance = faceapi.euclideanDistance(detection.descriptor, currentStored);
            if (distance < 0.55) {
              stopStream();
              setStage("success");
              setStatusMessage("IDENTITY VERIFIED — ACCESS GRANTED");
              setTimeout(() => {
                onSuccessRef.current?.();
              }, 1000);
            }
          } catch (err) {
            console.error("Face detection loop error:", err);
          }
        }, 550);
      } catch (err) {
        console.error("Camera access failed:", err);
        setStage("failed");
        setStatusMessage("CAMERA ACCESS DENIED OR UNAVAILABLE");
      }
    };

    startCamera();

    return () => {
      mounted = false;
      stopStream();
    };
  }, [isOpen, faceModelsLoaded]);

  if (!isOpen) return null;

  return (
    <div className="face-auth-screen">
      <div className="face-auth-content">
        <p className="face-auth-kicker">AURA IDENTITY VERIFICATION PROTOCOL</p>

        <div className="face-auth-frame">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="face-auth-video"
          />
          <div className={`face-auth-ring ${stage}`}></div>
        </div>

        <h2>{statusMessage}</h2>

        <p className="face-auth-hint">
          {stage === "enroll" && "Look directly into the camera. This facial hash will be stored locally."}
          {stage === "scanning" && "Hold still while AURA correlates your facial vector against local storage."}
          {stage === "success" && "Biometrics confirmed. Preparing secure command interface."}
          {stage === "failed" && "Check camera permissions or use bypass to enter."}
        </p>

        <div className="face-auth-actions">
          <button
            className="face-auth-cancel"
            onClick={() => {
              stopStream();
              onCancel();
            }}
          >
            ABORT
          </button>

          <button className="face-auth-reset" onClick={resetEnrollment}>
            RESET STORED FACE
          </button>

          {stage === "failed" && (
            <button
              className="face-auth-reset"
              style={{ borderColor: "var(--aura-cyan)", color: "var(--aura-cyan)" }}
              onClick={() => {
                stopStream();
                onSuccess();
              }}
            >
              BYPASS FOR DEMO →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
