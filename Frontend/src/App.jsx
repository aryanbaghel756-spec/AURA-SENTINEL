import { useState, useEffect, useRef } from "react";
import "./App.css";
import * as faceapi from "face-api.js";

const EXIT_PHRASES = [
  "bye aura", "aura bye", "goodbye aura", "stop listening",
  "band karo", "chup ho jao", "stop aura", "aura stop",
  "so jao", "alvida", "band ho ja", "bas kar do", "bye-bye", "I wanna go", "chlo bye",
  "bye", "goodbye", "ok bye", "theek hai bye",
];
const AFFIRMATIVE_PHRASES = ["haan", "yes", "ok", "okay", "confirm", "kar do", "kardo", "karo", "sure", "go ahead", "theek hai"];
const NEGATIVE_PHRASES = ["nahi", "no", "cancel", "mat karo", "rehne do", "stop"];

function RevealOnScroll({ children, className = "" }) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`reveal-block ${isVisible ? "revealed" : ""} ${className}`}>
      {children}
    </div>
  );
}
function NeuralField({ nodeCount = 70 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrame;
    let width, height;

    const nodes = Array.from({ length: nodeCount }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0006,
      vy: (Math.random() - 0.5) * 0.0006,
      radius: Math.random() * 1.6 + 0.6,
    }));

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > 1) node.vx *= -1;
        if (node.y < 0 || node.y > 1) node.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dx = (a.x - b.x) * width;
          const dy = (a.y - b.y) * height;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 130;

          if (dist < maxDist) {
            ctx.strokeStyle = `rgba(90, 180, 255, ${(1 - dist / maxDist) * 0.35})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(a.x * width, a.y * height);
            ctx.lineTo(b.x * width, b.y * height);
            ctx.stroke();
          }
        }
      }

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.arc(node.x * width, node.y * height, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(150, 210, 255, 0.85)";
        ctx.shadowColor = "rgba(60, 170, 255, 0.9)";
        ctx.shadowBlur = 6;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [nodeCount]);

  return <canvas ref={canvasRef} className="neural-field-canvas" />;
}

function generateFacePoints() {
  const points = [];
  const push = (x, y, group) => points.push({ x, y, baseX: x, baseY: y, group });

  const faceCount = 26;
  for (let i = 0; i < faceCount; i++) {
    const angle = (i / faceCount) * Math.PI * 2;
    push(
      0.5 + Math.cos(angle) * 0.27,
      0.5 + Math.sin(angle) * 0.37,
      "face"
    );
  }

  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    push(0.38 + Math.cos(angle) * 0.055, 0.42 + Math.sin(angle) * 0.03, "eyeL");
  }
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    push(0.62 + Math.cos(angle) * 0.055, 0.42 + Math.sin(angle) * 0.03, "eyeR");
  }

  for (let i = 0; i < 4; i++) push(0.32 + i * 0.045, 0.335 - i * 0.006, "browL");
  for (let i = 0; i < 4; i++) push(0.545 + i * 0.045, 0.315 + i * 0.006, "browR");

  push(0.5, 0.42, "nose");
  push(0.49, 0.5, "nose");
  push(0.5, 0.57, "nose");
  push(0.46, 0.6, "nose");
  push(0.54, 0.6, "nose");

  for (let i = 0; i < 10; i++) {
    const t = i / 9;
    push(0.4 + t * 0.2, 0.68 + Math.sin(t * Math.PI) * 0.02, "mouth");
  }

  push(0.5, 0.5, "core");
  push(0.4, 0.55, "core");
  push(0.6, 0.55, "core");

  return points;
}

function AuraGlobe() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrame;
    let width, height;
    let angleY = 0;
    let angleX = 0.4;

    const latLines = 9;
    const lonLines = 14;
    const segmentsPerLine = 40;
    const radius = 1;

    const points = [];

    for (let lat = 1; lat < latLines; lat++) {
      const theta = (lat / latLines) * Math.PI;
      for (let i = 0; i <= segmentsPerLine; i++) {
        const phi = (i / segmentsPerLine) * Math.PI * 2;
        points.push({
          x: radius * Math.sin(theta) * Math.cos(phi),
          y: radius * Math.cos(theta),
          z: radius * Math.sin(theta) * Math.sin(phi),
          line: `lat${lat}`,
        });
      }
    }

    for (let lon = 0; lon < lonLines; lon++) {
      const phi = (lon / lonLines) * Math.PI * 2;
      for (let i = 0; i <= segmentsPerLine; i++) {
        const theta = (i / segmentsPerLine) * Math.PI;
        points.push({
          x: radius * Math.sin(theta) * Math.cos(phi),
          y: radius * Math.cos(theta),
          z: radius * Math.sin(theta) * Math.sin(phi),
          line: `lon${lon}`,
        });
      }
    }

    const nodeCount = 36;
    const nodes = Array.from({ length: nodeCount }, () => {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi = Math.random() * Math.PI * 2;
      return {
        x: radius * Math.sin(theta) * Math.cos(phi),
        y: radius * Math.cos(theta),
        z: radius * Math.sin(theta) * Math.sin(phi),
        pulsePhase: Math.random() * 10,
      };
    });

    const resize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener("resize", resize);

    const project = (p) => {
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const x1 = p.x * cosY - p.z * sinY;
      const z1 = p.x * sinY + p.z * cosY;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const y1 = p.y * cosX - z1 * sinX;
      const z2 = p.y * sinX + z1 * cosX;

      const scale = width * 0.36;
      const perspective = 2.4 / (2.4 + z2);

      return {
        x: width / 2 + x1 * scale * perspective,
        y: height / 2 + y1 * scale * perspective,
        z: z2,
        perspective,
      };
    };

    const draw = () => {
      angleY += 0.0016;
      time += 1;

      ctx.clearRect(0, 0, width, height);

      const grouped = {};
      points.forEach((p) => {
        if (!grouped[p.line]) grouped[p.line] = [];
        grouped[p.line].push(project(p));
      });

      Object.values(grouped).forEach((line) => {
        ctx.beginPath();
        line.forEach((p, i) => {
          const opacity = Math.max(0, (p.z + 1) / 2) * 0.35;
          if (i === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = `rgba(90, 190, 255, ${opacity})`;
        });
        ctx.lineWidth = 0.6;
        ctx.stroke();
      });

      const projectedNodes = nodes.map((n) => ({ ...n, p: project(n) }));

      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const a = projectedNodes[i];
          const b = projectedNodes[j];
          if (a.p.z < -0.2 || b.p.z < -0.2) continue;

          const dx = a.p.x - b.p.x;
          const dy = a.p.y - b.p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < width * 0.16) {
            const opacity = (1 - dist / (width * 0.16)) * 0.4 * Math.max(0, (a.p.z + 1) / 2);
            ctx.strokeStyle = `rgba(140, 210, 255, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.p.x, a.p.y);
            ctx.lineTo(b.p.x, b.p.y);
            ctx.stroke();
          }
        }
      }

      projectedNodes.forEach((n) => {
        const p = n.p;
        if (p.z < -0.15) return;

        const pulse = 0.65 + Math.sin(time * 0.05 + n.pulsePhase) * 0.35;
        const opacity = Math.max(0, (p.z + 1) / 2) * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.6 * p.perspective, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 235, 255, ${opacity})`;
        ctx.shadowColor = "rgba(100, 200, 255, 1)";
        ctx.shadowBlur = 14;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    let time = 0;
    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="aura-globe-canvas" />;
}

function App() {
  const pendingFileActionRef = useRef(null);
  const [pendingFileAction, setPendingFileAction] = useState(null);
  const [systemData, setSystemData] = useState(null);
  const [systemError, setSystemError] = useState("");
  const [auraHover, setAuraHover] = useState(false);
  const [rotationkey, setRotationkey] = useState(0);
  const [booting, setBooting] = useState(false);
  const [bootProgress, setBootProgress] = useState(0);
  const [systemStarted, setSystemStarted] = useState(false);
  const [activeModule, setActiveModule] = useState(null);
  const [processData, setProcessData] = useState(null);
  const [processError, setProcessError] = useState("");
  const [attackData, setAttackData] = useState(null);
  const [attackError, setAttackError] = useState("");
  const [riskData, setRiskData] = useState(null);
  const [riskError, setRiskError] = useState("");
  const [simulation, setSimulation] = useState({
    cpu: 50,
    memory: 50,
    disk: 50,
    ports: 5,
  });

  const [voiceLanguage, setVoiceLanguage] = useState(null);
  const [isLanguageSelected, setIsLanguageSelected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState("READY");
  const [transcript, setTranscript] = useState("");
  const [continuousMode, setContinuousMode] = useState(false);
  const continuousModeRef = useRef(false);
  const isProcessingRef = useRef(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const recognitionRef = useRef(null);
  const [financialData, setFinancialData] = useState(null);
  const [financialError, setFinancialError] = useState("");
  const [investmentData, setInvestmentData] = useState(null);
  const [investmentError, setInvestmentError] = useState("");
  const [investmentLoading, setInvestmentLoading] = useState(false);
  const [investmentInput, setInvestmentInput] = useState({
    business_type: "Small Business",
    monthly_budget: "",
    systems: "",
    data_value: "",
  });

  const [isAnalyzingInvestment, setIsAnalyzingInvestment] =
    useState(false);

  const [fileSecurityData, setFileSecurityData] = useState(null);
  const [fileSecurityError, setFileSecurityError] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isScanningFiles, setIsScanningFiles] = useState(false);
  const [isQuarantining, setIsQuarantining] = useState(false);
  const [fileSearchQuery, setFileSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [quarantineMessage, setQuarantineMessage] = useState("");

  const [filesecView, setFilesecView] = useState("scan");
  const [quarantineList, setQuarantineList] = useState(null);
  const [quarantineListError, setQuarantineListError] = useState("");
  const [selectedQuarantineItems, setSelectedQuarantineItems] = useState([]);
  const [isRestoring, setIsRestoring] = useState(false);
  const [faceModelsLoaded, setFaceModelsLoaded] = useState(false);
  const [showFaceAuth, setShowFaceAuth] = useState(false);
  const [faceAuthStage, setFaceAuthStage] = useState("loading"); // loading | enroll | scanning | success | failed
  const videoRef = useRef(null);
  const faceScanIntervalRef = useRef(null);

  useEffect(() => {
    if (activeModule !== "system-monitoring") return;

    const fetchProcesses = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/processes"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch process data");
        }

        const data = await response.json();

        setProcessData(data);
        setProcessError("");
      } catch (error) {
        console.error(error);
        setProcessError("PROCESS INTELLIGENCE UNAVAILABLE");
      }
    };

    fetchProcesses();

    const interval = setInterval(fetchProcesses, 2000);

    return () => clearInterval(interval);
  }, [activeModule]);


  useEffect(() => {
    if (activeModule !== "system-monitoring") return;

    const fetchSystemData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/system");

        if (!response.ok) {
          throw new Error("Failed to fetch system data");
        }

        const data = await response.json();

        setSystemData(data);
        setSystemError("");
      } catch (error) {
        console.error(error);
        setSystemError("AURA BACKEND CONNECTION LOST");
      }
    };

    fetchSystemData();

    const interval = setInterval(fetchSystemData, 2000);

    return () => clearInterval(interval);
  }, [activeModule]);

  useEffect(() => {
    if (activeModule !== "attack-surface") return;

    const fetchAttackSurface = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/attack-surface"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch attack surface data");
        }

        const data = await response.json();

        setAttackData(data);
        setAttackError("");
      } catch (error) {
        console.error(error);
        setAttackError("ATTACK SURFACE ANALYSIS UNAVAILABLE");
      }
    };

    fetchAttackSurface();

    const interval = setInterval(fetchAttackSurface, 3000);

    return () => clearInterval(interval);
  }, [activeModule]);

  useEffect(() => {
    if (activeModule !== "risk-intelligence") return;

    const fetchRiskData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/risk-intelligence"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch risk intelligence");
        }

        const data = await response.json();

        setRiskData(data);
        setRiskError("");
      } catch (error) {
        console.error(error);
        setRiskError("RISK INTELLIGENCE CONNECTION LOST");
      }
    };

    fetchRiskData();

    const interval = setInterval(fetchRiskData, 3000);

    return () => clearInterval(interval);
  }, [activeModule]);

  useEffect(() => {
    if (activeModule !== "financial-risk") return;

    const fetchFinancialRisk = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/financial-risk"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch financial risk data");
        }

        const data = await response.json();

        setFinancialData(data);
        setFinancialError("");

      } catch (error) {
        console.error(error);
        setFinancialError("FINANCIAL RISK ENGINE UNAVAILABLE");
      }
    };

    fetchFinancialRisk();

    const interval = setInterval(
      fetchFinancialRisk,
      5000
    );

    return () => clearInterval(interval);

  }, [activeModule]);

  useEffect(() => {
    if (activeModule !== "investment-optimizer") return;

    const fetchInvestmentData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/investment-optimizer");
        if (!response.ok) throw new Error("Failed to fetch investment optimizer data");
        const data = await response.json();
        setInvestmentData(data);
        setInvestmentError("");
      } catch (error) {
        console.error(error);
        setInvestmentError("INVESTMENT OPTIMIZER UNAVAILABLE");
      }
    };

    fetchInvestmentData();
  }, [activeModule]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
        ]);
        setFaceModelsLoaded(true);
      } catch (error) {
        console.error("Failed to load face models:", error);
      }
    };
    loadModels();
  }, []);

  const calculateSimulatedRisk = () => {
    let score = 0;

    if (simulation.cpu > 90) score += 25;
    else if (simulation.cpu > 75) score += 15;
    else if (simulation.cpu > 60) score += 8;

    if (simulation.memory > 90) score += 25;
    else if (simulation.memory > 80) score += 15;
    else if (simulation.memory > 70) score += 8;

    if (simulation.disk > 95) score += 20;
    else if (simulation.disk > 85) score += 12;
    else if (simulation.disk > 75) score += 6;

    if (simulation.ports > 15) score += 30;
    else if (simulation.ports > 8) score += 20;
    else if (simulation.ports > 3) score += 10;

    return Math.min(score, 100);
  };

  const [investmentFormError, setInvestmentFormError] = useState("");

  const [landingStats, setLandingStats] = useState(null);

  useEffect(() => {
    if (booting || systemStarted) return;

    let cancelled = false;

    const fetchLandingStats = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/risk-intelligence");
        if (!response.ok) return;
        const data = await response.json();
        if (!cancelled) setLandingStats(data);
      } catch (error) {
        // Silent — landing page still looks great without live data
      }
    };

    fetchLandingStats();
    const interval = setInterval(fetchLandingStats, 4000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [booting, systemStarted]);

  const landingModules = [
    { id: "system-monitoring", title: "System Monitoring", desc: "Live CPU, memory, disk and process telemetry.", featured: false },
    { id: "risk-intelligence", title: "Risk Intelligence", desc: "Correlated cyber risk score, calculated from live signals across your entire system in real time.", featured: true },
    { id: "attack-surface", title: "Attack Surface", desc: "Exposed ports and active service mapping.", featured: false },
    { id: "financial-risk", title: "Financial Risk", desc: "Cyber exposure translated into business cost.", featured: false },
    { id: "investment-optimizer", title: "Investment Optimizer", desc: "Compares defense strategies against your budget and recommends the plan with the strongest ROI.", featured: true },
    { id: "what-if-engine", title: "What-If Engine", desc: "Simulate conditions before they happen.", featured: false },
    { id: "aura-voice", title: "AI Assistant", desc: "Talk to AURA in Hindi, Hinglish or English.", featured: false },
    { id: "file-security", title: "File Security", desc: "Flags junk, duplicate and sensitive files.", featured: false },
  ];

  const runInvestmentAnalysis = async () => {
    const budget = Number(investmentInput.monthly_budget);
    const systems = Number(investmentInput.systems);
    const dataValue = Number(investmentInput.data_value);

    if (!budget || budget <= 0 || !systems || systems <= 0 || !dataValue || dataValue <= 0) {
      setInvestmentFormError("Please enter valid positive numbers for all fields.");
      return;
    }

    setInvestmentFormError("");

    try {
      setIsAnalyzingInvestment(true);

      const response = await fetch("http://127.0.0.1:8000/api/investment-optimizer/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          business_type: investmentInput.business_type,
          monthly_budget: budget,
          systems: systems,
          data_value: dataValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Investment analysis failed");
      }

      const result = await response.json();
      setInvestmentData(result);
      setInvestmentError("");
    } catch (error) {
      console.error("Investment analysis error:", error);
      setInvestmentFormError("Analysis failed. Check backend connection and try again.");
    } finally {
      setIsAnalyzingInvestment(false);
    }
  };

  const fetchFileScan = async () => {
    try {
      setIsScanningFiles(true);
      setFileSecurityError("");
      const response = await fetch("http://127.0.0.1:8000/api/file-security/scan");
      if (!response.ok) throw new Error("Scan failed");
      const data = await response.json();
      setFileSecurityData(data);
      setSelectedFiles([]);
    } catch (error) {
      console.error(error);
      setFileSecurityError("FILE SECURITY SCAN UNAVAILABLE");
    } finally {
      setIsScanningFiles(false);
    }
  };

  useEffect(() => {
    if (activeModule !== "file-security") return;
    fetchFileScan();
  }, [activeModule]);

  const toggleFileSelection = (path) => {
    setSelectedFiles((prev) =>
      prev.includes(path) ? prev.filter((p) => p !== path) : [...prev, path]
    );
  };

  const quarantineSelectedFiles = async () => {
    if (selectedFiles.length === 0) return;

    const confirmed = window.confirm(
      `AURA will move ${selectedFiles.length} file(s) to Quarantine (not permanently deleted). Continue?`
    );
    if (!confirmed) return;

    try {
      setIsQuarantining(true);
      const response = await fetch("http://127.0.0.1:8000/api/file-security/quarantine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: selectedFiles }),
      });
      const result = await response.json();
      const successCount = result.results.filter((r) => r.status === "QUARANTINED").length;
      setQuarantineMessage(`${successCount} file(s) moved to quarantine.`);
      fetchFileScan();
    } catch (error) {
      console.error(error);
      setQuarantineMessage("Quarantine action failed.");
    } finally {
      setIsQuarantining(false);
    }
  };

  const deleteSelectedFiles = async () => {
    if (selectedFiles.length === 0) return;

    const confirmed = window.confirm(
      `AURA will move ${selectedFiles.length} file(s) to the Windows Recycle Bin (not quarantine, recoverable from there). Continue?`
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      const response = await fetch("http://127.0.0.1:8000/api/file-security/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paths: selectedFiles }),
      });
      const result = await response.json();
      const successCount = result.results.filter((r) => r.status === "DELETED").length;
      setQuarantineMessage(`${successCount} file(s) moved to Recycle Bin.`);
      fetchFileScan();
    } catch (error) {
      console.error(error);
      setQuarantineMessage("Delete action failed.");
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchQuarantineList = async () => {
    try {
      setQuarantineListError("");
      const response = await fetch("http://127.0.0.1:8000/api/file-security/quarantine/list");
      if (!response.ok) throw new Error("Failed to fetch quarantine list");
      const data = await response.json();
      setQuarantineList(data);
    } catch (error) {
      console.error(error);
      setQuarantineListError("QUARANTINE LIST UNAVAILABLE");
    }
  };

  useEffect(() => {
    if (activeModule !== "file-security") return;
    if (filesecView === "quarantine") {
      fetchQuarantineList();
    }
  }, [activeModule, filesecView]);

  const toggleQuarantineSelection = (name) => {
    setSelectedQuarantineItems((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  };

  const restoreSelectedItems = async () => {
    if (selectedQuarantineItems.length === 0) return;

    const confirmed = window.confirm(
      `Restore ${selectedQuarantineItems.length} file(s) to their original location?`
    );
    if (!confirmed) return;

    try {
      setIsRestoring(true);
      const response = await fetch("http://127.0.0.1:8000/api/file-security/quarantine/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quarantine_names: selectedQuarantineItems }),
      });
      const result = await response.json();
      const successCount = result.results.filter((r) => r.status === "RESTORED").length;
      setQuarantineMessage(`${successCount} file(s) restored.`);
      setSelectedQuarantineItems([]);
      fetchQuarantineList();
    } catch (error) {
      console.error(error);
      setQuarantineMessage("Restore failed.");
    } finally {
      setIsRestoring(false);
    }
  };

  const importCurrentSystem = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/risk-intelligence"
      );

      if (!response.ok) {
        throw new Error("Failed to import current system");
      }

      const data = await response.json();

      setSimulation({
        cpu: Math.round(data.cpu_usage),
        memory: Math.round(data.memory_usage),
        disk: Math.round(data.disk_usage),
        ports: Math.min(data.open_ports, 30),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const loadScenario = (scenario) => {
    if (scenario === "normal") {
      setSimulation({
        cpu: 25,
        memory: 40,
        disk: 50,
        ports: 2,
      });
    }

    if (scenario === "heavy") {
      setSimulation({
        cpu: 85,
        memory: 88,
        disk: 75,
        ports: 4,
      });
    }

    if (scenario === "exposure") {
      setSimulation({
        cpu: 65,
        memory: 70,
        disk: 85,
        ports: 18,
      });
    }

    if (scenario === "reset") {
      setSimulation({
        cpu: 50,
        memory: 50,
        disk: 50,
        ports: 5,
      });
    }
  };

  const simulatedRisk = calculateSimulatedRisk();

  const simulatedLevel =
    simulatedRisk >= 60
      ? "HIGH"
      : simulatedRisk >= 30
        ? "MODERATE"
        : "LOW";


  const getSimulationRecommendations = () => {
    const recommendations = [];

    if (simulation.cpu > 75) {
      recommendations.push({
        level: "warning",
        title: "HIGH CPU LOAD",
        text: "Reduce intensive workloads and inspect processes consuming excessive CPU resources.",
      });
    }

    if (simulation.memory > 80) {
      recommendations.push({
        level: "warning",
        title: "MEMORY PRESSURE",
        text: "Close unnecessary applications and review high-memory processes.",
      });
    }

    if (simulation.disk > 85) {
      recommendations.push({
        level: "warning",
        title: "LOW DISK CAPACITY",
        text: "Free storage space and remove unnecessary files to prevent system pressure.",
      });
    }

    if (simulation.ports > 8) {
      recommendations.push({
        level: "critical",
        title: "ELEVATED NETWORK EXPOSURE",
        text: "Review unnecessary listening services and restrict services that are not required.",
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        level: "safe",
        title: "SYSTEM CONDITIONS STABLE",
        text: "The simulated environment is within the configured low-risk thresholds.",
      });
    }

    return recommendations;
  };

  const simulationRecommendations =
    getSimulationRecommendations();

  useEffect(() => {
    if (!booting) return;
    setBootProgress(0);

    const interval = setInterval(() => {
      setBootProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);

          setTimeout(() => {
            setSystemStarted(true);
            setBooting(false);
          }, 800);

          return 100;

        }
        return prev + 1;
      });
    }, 35);

    return () => clearInterval(interval);
  }, [booting]);

  const startAuraListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceStatus("SPEECH RECOGNITION NOT SUPPORTED");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    // AURA bol rahi ho toh pehle usse stop karo
    window.speechSynthesis.cancel();

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    if (voiceLanguage === "hindi") {
      recognition.lang = "hi-IN";
    } else if (voiceLanguage === "hinglish") {
      recognition.lang = "en-IN";
    } else {
      recognition.lang = "en-US";
    }

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceStatus("LISTENING...");
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let interimText = "";
      let finalText = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        const text = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalText += text;
        } else {
          interimText += text;
        }
      }

      // Live transcript screen par dikhao
      setTranscript(finalText || interimText);

      // Sirf final result process hoga
      if (finalText.trim()) {
        isProcessingRef.current = true;
        const lowerText = finalText.trim().toLowerCase();
        const isExitCommand = EXIT_PHRASES.some((phrase) => lowerText.includes(phrase));

        if (isExitCommand) {
          continuousModeRef.current = false;
          setContinuousMode(false);
          setVoiceStatus("AURA RESPONDING");

          const goodbye =
            voiceLanguage === "hindi"
              ? "अलविदा! जब भी ज़रूरत हो, बुला लेना।"
              : voiceLanguage === "hinglish"
                ? "Theek hai, bye! Jab bhi zarurat ho, bula lena."
                : "Goodbye! Call me whenever you need me.";

          speakWithAura(goodbye, false);
        } else {
          setVoiceStatus("AURA THINKING...");
          askAura(finalText.trim());
        }
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      if (event.error === "not-allowed") {
        setVoiceStatus("MICROPHONE ACCESS DENIED");
      } else if (event.error === "no-speech") {
        setVoiceStatus("NO SPEECH DETECTED");
      } else if (event.error === "aborted") {
        setVoiceStatus("READY");
      } else {
        setVoiceStatus(`VOICE ERROR: ${event.error}`);
      }

      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);

      setVoiceStatus((currentStatus) => {
        if (
          currentStatus === "MICROPHONE ACCESS DENIED" ||
          currentStatus === "AURA THINKING..." ||
          currentStatus === "AURA SPEAKING"
        ) {
          return currentStatus;
        }

        return "READY";
      }); if (continuousModeRef.current && !isProcessingRef.current) {
        setTimeout(() => {
          if (continuousModeRef.current && !isProcessingRef.current) {
            startAuraListening();
          }
        }, 800);
      }
    };

    recognitionRef.current = recognition;

    try {
      recognition.start();
    } catch (error) {
      console.error("Recognition start error:", error);
      setIsListening(false);
      setVoiceStatus("VOICE START FAILED");
    }
  };

  const stopAuraListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    setIsListening(false);
    setVoiceStatus("READY");
  };

  const speakWithAura = (message, shouldRestartListening = true) => {
    if (!("speechSynthesis" in window)) {
      setVoiceStatus("VOICE OUTPUT NOT SUPPORTED");
      isProcessingRef.current = false;
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(message);

    if (voiceLanguage === "hindi") {
      utterance.lang = "hi-IN";
    } else if (voiceLanguage === "hinglish") {
      utterance.lang = "en-IN";
    } else {
      utterance.lang = "en-US";
    }

    utterance.rate = 1.08;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setVoiceStatus("AURA SPEAKING...");
    };

    utterance.onend = () => {
      setVoiceStatus("READY");
      isProcessingRef.current = false;

      if (shouldRestartListening && continuousModeRef.current) {
        setTimeout(() => {
          if (continuousModeRef.current) startAuraListening();
        }, 500);
      }
    };

    utterance.onerror = () => {
      setVoiceStatus("VOICE OUTPUT ERROR");
      isProcessingRef.current = false;
    };

    window.speechSynthesis.speak(utterance);
  };

  const askAura = async (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    console.log("askAura called with:", userMessage, "| pendingFileAction:", pendingFileAction);
    if (pendingFileActionRef.current) {
      const isYes = AFFIRMATIVE_PHRASES.some((p) => lowerMessage.includes(p));
      const isNo = NEGATIVE_PHRASES.some((p) => lowerMessage.includes(p));

          if (isYes) {
      const actionToRun = pendingFileActionRef.current;
      const result = await executeFileAction(actionToRun);
      pendingFileActionRef.current = null;
      setPendingFileAction(null);

      const isSuccess =
        result?.status === "MOVED" || result?.status === "CREATED" ||
        (result?.results && result.results.every((r) => r.status === "DELETED"));

      let msg;
      if (isSuccess && actionToRun.type === "create_folder") {
        const fullPath = `${actionToRun.parent_folder}\\${actionToRun.folder_name}`;
        msg =
          voiceLanguage === "hindi" ? `फोल्डर बन गया यहाँ: ${fullPath}` :
          voiceLanguage === "hinglish" ? `Folder ban gaya yahan: ${fullPath}` :
          `Folder created at: ${fullPath}`;
      } else if (isSuccess) {
        msg = voiceLanguage === "hindi" ? "हो गया।" : voiceLanguage === "hinglish" ? "Ho gaya, kaam complete." : "Done.";
      } else {
        msg = voiceLanguage === "hindi" ? "यह नहीं हो पाया।" : voiceLanguage === "hinglish" ? "Ye nahi ho paya, kuch issue aaya." : "That didn't work.";
      }

      setVoiceStatus("AURA RESPONDING");
      speakWithAura(msg);
      return;
    }

      if (isNo) {
        pendingFileActionRef.current = null;
        setPendingFileAction(null);

        const msg = voiceLanguage === "hindi" ? "ठीक है, कैंसल कर दिया।" : voiceLanguage === "hinglish" ? "Theek hai, cancel kar diya." : "Okay, cancelled.";
        setVoiceStatus("AURA RESPONDING");
        speakWithAura(msg);
        return;
      }

          const reaskMsg =
      voiceLanguage === "hindi"
        ? "मुझे समझ नहीं आया। कृपया सिर्फ हाँ या नहीं बोलिए।"
        : voiceLanguage === "hinglish"
          ? "Samajh nahi aaya, bas 'haan' ya 'nahi' bolo confirm karne ke liye."
          : "I didn't catch that — please just say yes or no.";

    setVoiceStatus("AURA RESPONDING");
    speakWithAura(reaskMsg);
    return;
  }

  try {
      const response = await fetch("http://127.0.0.1:8000/api/aura-assistant/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          language: voiceLanguage || "hinglish",
          history: conversationHistory,
        }),
      });

      if (!response.ok) throw new Error("AURA chat request failed");

      const data = await response.json();

      setConversationHistory((prev) => [
        ...prev.slice(-8),
        { role: "user", content: userMessage },
        { role: "assistant", content: data.reply },
      ]);

      if (data.file_action) {
        console.log("AURA proposed file_action:", data.file_action);
        pendingFileActionRef.current = data.file_action;
        setPendingFileAction(data.file_action);
      } else {
        console.log("No file_action in this response");
      }

      setVoiceStatus("AURA RESPONDING");
      speakWithAura(data.reply);

      if (data.action) {
        setTimeout(() => {
          openModule(data.action);
        }, 1800);
      }
    } catch (error) {
      console.error("AURA chat error:", error);
      setVoiceStatus("AURA CONNECTION ERROR");
      speakWithAura(
        voiceLanguage === "hindi"
          ? "मुझे कनेक्ट करने में समस्या हो रही है।"
          : voiceLanguage === "hinglish"
            ? "Mujhe connect karne mein thodi problem ho rahi hai."
            : "I'm having trouble connecting right now."
      );
    }
  };

  const executeFileAction = async (fileAction) => {
    let endpoint = "";
    let body = {};

    if (fileAction.type === "move") {
      endpoint = "/api/file-ops/move";
      body = { source: fileAction.source, destination_folder: fileAction.destination_folder };
    } else if (fileAction.type === "delete") {
      endpoint = "/api/file-ops/delete";
      body = { paths: fileAction.paths };
    } else if (fileAction.type === "create_folder") {
      endpoint = "/api/file-ops/create-folder";
      body = { parent_folder: fileAction.parent_folder, folder_name: fileAction.folder_name };
    } else {
      return { status: "UNKNOWN" };
    }

    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      console.log("File action execution result:", result);
      return result;
    } catch (error) {
      console.error("File action execution error:", error);
      return { status: "ERROR" };
    }
  };

  const getStoredFaceDescriptor = () => {
    const saved = localStorage.getItem("aura_face_descriptor");
    return saved ? new Float32Array(JSON.parse(saved)) : null;
  };

  const saveFaceDescriptor = (descriptor) => {
    localStorage.setItem("aura_face_descriptor", JSON.stringify(Array.from(descriptor)));
  };

  const resetFaceEnrollment = () => {
    localStorage.removeItem("aura_face_descriptor");
    setFaceAuthStage("enroll");
  };

  const startFaceScan = async () => {
    if (!faceModelsLoaded) {
      console.error("Face models not loaded yet");
      setFaceAuthStage("failed");
      return;
    }
    stopFaceStream();
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
      if (videoRef.current) {
        videoRef.current.srcObject = null;
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => { });
      }

      const storedDescriptor = getStoredFaceDescriptor();
      setFaceAuthStage(storedDescriptor ? "scanning" : "enroll");

      faceScanIntervalRef.current = setInterval(async () => {
        if (!videoRef.current || videoRef.current.readyState < 2) {
          console.log("Video not ready yet, readyState:", videoRef.current?.readyState);
          return;
        }

        try {
          const options = new faceapi.TinyFaceDetectorOptions({
            inputSize: 416,
            scoreThreshold: 0.3,
          });

          const detection = await faceapi
            .detectSingleFace(videoRef.current, options)
            .withFaceLandmarks()
            .withFaceDescriptor();

          console.log("Detection result:", detection);

          if (!detection) return;

          const currentDescriptor = getStoredFaceDescriptor();

          if (!currentDescriptor) {
            saveFaceDescriptor(detection.descriptor);
            clearInterval(faceScanIntervalRef.current);
            stopFaceStream();
            setFaceAuthStage("success");
            setTimeout(() => {
              setShowFaceAuth(false);
              setBooting(true);
            }, 1200);
            return;
          }

          const distance = faceapi.euclideanDistance(detection.descriptor, currentDescriptor);
          console.log("Match distance:", distance);

          if (distance < 0.55) {
            clearInterval(faceScanIntervalRef.current);
            stopFaceStream();
            setFaceAuthStage("success");
            setTimeout(() => {
              setShowFaceAuth(false);
              setBooting(true);
            }, 1000);
          }
        } catch (detectionError) {
          console.error("Detection loop error:", detectionError);
        }
      }, 600);
    } catch (error) {
      console.error("Camera access error:", error);
      setFaceAuthStage("failed");
    }
  };

  const stopFaceStream = () => {
    if (faceScanIntervalRef.current) {
      clearInterval(faceScanIntervalRef.current);
      faceScanIntervalRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const openFaceAuth = () => {
    setShowFaceAuth(true);
    setFaceAuthStage("loading");
    setTimeout(startFaceScan, 300);
  };

  const openModule = (moduleName) => {
    setActiveModule(moduleName);
  };



  if (activeModule) {
    const formattedName = activeModule
      .replaceAll("-", " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());


    const isSystemMonitoring = activeModule === "system-monitoring";
    const isAttackSurface =
      activeModule === "attack-surface";

    const isRiskIntelligence =
      activeModule === "risk-intelligence";

    const isWhatIfEngine = activeModule === "what-if-engine";

    const isAuraVoice = activeModule === "aura-voice";

    const isFinancialRisk = activeModule === "financial-risk";

    const isInvestmentOptimizer =
      activeModule === "investment-optimizer";

    const isFileSecurity = activeModule === "file-security";

    const filteredFiles = fileSecurityData
      ? fileSecurityData.files.filter((f) =>
        f.name.toLowerCase().includes(fileSearchQuery.toLowerCase())
      )
      : [];

    const allFilteredSelected =
      filteredFiles.length > 0 && filteredFiles.every((f) => selectedFiles.includes(f.path));

    const toggleSelectAll = () => {
      if (allFilteredSelected) {
        setSelectedFiles((prev) => prev.filter((p) => !filteredFiles.some((f) => f.path === p)));
      } else {
        setSelectedFiles((prev) => [
          ...prev,
          ...filteredFiles.filter((f) => !prev.includes(f.path)).map((f) => f.path),
        ]);
      }
    };

    const categoryBreakdown = fileSecurityData
      ? fileSecurityData.files.reduce((acc, f) => {
        acc[f.category] = (acc[f.category] || 0) + 1;
        return acc;
      }, {})
      : {};


    return (
      <div className="module-page">
        <header className="module-page-header">
          <button
            className="back-button"
            onClick={() => setActiveModule(null)}
          >
            ← BACK TO COMMAND CENTER
          </button>

          <div className="module-page-logo">AURA</div>

          <div className="module-online-status">
            <span></span>
            SYSTEM ONLINE
          </div>
        </header>

        {isSystemMonitoring ? (
          <main className="monitoring-dashboard">
            <div className="monitoring-title-section">
              <div>
                <p className="module-page-eyebrow">
                  AURA SENTINEL / LIVE TELEMETRY
                </p>

                <h1>SYSTEM MONITORING</h1>

                <p className="monitoring-description">
                  Real-time system intelligence and hardware telemetry.
                </p>

              </div>

              <div className="live-status">
                <span></span>
                LIVE DATA
              </div>
            </div>

            {systemError ? (
              <div className="connection-error">
                {systemError}
              </div>
            ) : !systemData ? (
              <div className="loading-system">
                <div className="module-loader"></div>
                CONNECTING TO AURA BACKEND...
              </div>
            ) : (
              <>
                <section className="system-stats-grid">
                  <div className="system-stat-card">
                    <span className="stat-label">CPU USAGE</span>

                    <div className="stat-value">
                      {systemData.cpu_percent}
                      <small>%</small>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${systemData.cpu_percent}%`,
                        }}
                      ></div>
                    </div>

                    <div className="stat-bottom">
                      {systemData.cpu_cores} LOGICAL CORES
                    </div>
                  </div>

                  <div className="system-stat-card">
                    <span className="stat-label">MEMORY</span>

                    <div className="stat-value">
                      {systemData.memory.percent}
                      <small>%</small>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${systemData.memory.percent}%`,
                        }}
                      ></div>
                    </div>

                    <div className="stat-bottom">
                      {systemData.memory.used} GB /{" "}
                      {systemData.memory.total} GB
                    </div>
                  </div>

                  <div className="system-stat-card">
                    <span className="stat-label">DISK STORAGE</span>

                    <div className="stat-value">
                      {systemData.disk.percent}
                      <small>%</small>
                    </div>

                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${systemData.disk.percent}%`,
                        }}
                      ></div>
                    </div>

                    <div className="stat-bottom">
                      {systemData.disk.used} GB /{" "}
                      {systemData.disk.total} GB
                    </div>
                  </div>
                </section>

                <section className="system-overview">
                  <div className="overview-header">
                    <span>TELEMETRY OVERVIEW</span>
                    <span>REFRESH RATE: 2 SEC</span>
                  </div>

                  <div className="telemetry-grid">
                    <div className="telemetry-row">
                      <span>CPU STATUS</span>
                      <strong>
                        {systemData.cpu_percent < 70
                          ? "STABLE"
                          : "HIGH LOAD"}
                      </strong>
                    </div>

                    <div className="telemetry-row">
                      <span>MEMORY STATUS</span>
                      <strong>
                        {systemData.memory.percent < 80
                          ? "OPTIMAL"
                          : "HIGH USAGE"}
                      </strong>
                    </div>

                    <div className="telemetry-row">
                      <span>DISK STATUS</span>
                      <strong>
                        {systemData.disk.percent < 85
                          ? "HEALTHY"
                          : "LOW SPACE"}
                      </strong>
                    </div>

                    <div className="telemetry-row">
                      <span>AURA BACKEND</span>
                      <strong>CONNECTED</strong>
                    </div>
                  </div>
                  <section className="process-intelligence">
                    <div className="process-header">
                      <div>
                        <span className="process-eyebrow">
                          AURA LIVE ANALYSIS
                        </span>
                        <h2>PROCESS INTELLIGENCE</h2>
                      </div>

                      <div className="process-count">
                        {processData
                          ? `${processData.total_processes} PROCESSES DETECTED`
                          : "SCANNING..."}
                      </div>
                    </div>

                    {processError ? (
                      <div className="process-error">
                        {processError}
                      </div>
                    ) : !processData ? (
                      <div className="process-loading">
                        <div className="module-loader"></div>
                        ANALYZING SYSTEM PROCESSES...
                      </div>
                    ) : (
                      <div className="process-table-wrapper">
                        <table className="process-table">
                          <thead>
                            <tr>
                              <th>PROCESS</th>
                              <th>PID</th>
                              <th>CPU</th>
                              <th>MEMORY</th>
                              <th>STATUS</th>
                            </tr>
                          </thead>

                          <tbody>
                            {processData.processes.map((process) => {
                              const isHighUsage =
                                process.cpu_percent > 50 ||
                                process.memory_percent > 15;

                              return (
                                <tr key={process.pid}>
                                  <td className="process-name">
                                    <span className="process-indicator"></span>
                                    {process.name}
                                  </td>

                                  <td>{process.pid}</td>

                                  <td>{process.cpu_percent}%</td>

                                  <td>{process.memory_percent}%</td>

                                  <td>
                                    <span
                                      className={
                                        isHighUsage
                                          ? "process-status warning"
                                          : "process-status stable"
                                      }
                                    >
                                      {isHighUsage ? "HIGH LOAD" : "NORMAL"}
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </section>
                </section>

              </>

            )}

          </main>

        ) : isAttackSurface ? (
          <main className="attack-dashboard">
            <div className="attack-title-section">
              <div>
                <p className="module-page-eyebrow">
                  AURA SENTINEL / LOCAL EXPOSURE ANALYSIS
                </p>

                <h1>ATTACK SURFACE</h1>

                <p className="attack-description">
                  Live analysis of local listening services and exposed ports.
                </p>
              </div>

              <div className="scan-status">
                <span></span>
                LIVE SCANNING
              </div>
            </div>

            {attackError ? (
              <div className="connection-error">
                {attackError}
              </div>
            ) : !attackData ? (
              <div className="loading-system">
                <div className="module-loader"></div>
                SCANNING LOCAL ATTACK SURFACE...
              </div>
            ) : (
              <>
                <section className="attack-summary-grid">
                  <div className="attack-summary-card">
                    <span>TOTAL LISTENING PORTS</span>

                    <strong>
                      {attackData.total_open_ports}
                    </strong>

                    <p>Currently exposed local services.</p>
                  </div>

                  <div className="attack-summary-card">
                    <span>EXPOSURE LEVEL</span>

                    <strong
                      className={
                        attackData.total_open_ports > 10
                          ? "exposure-high"
                          : attackData.total_open_ports > 5
                            ? "exposure-medium"
                            : "exposure-low"
                      }
                    >
                      {attackData.total_open_ports > 10
                        ? "HIGH"
                        : attackData.total_open_ports > 5
                          ? "MODERATE"
                          : "LOW"}
                    </strong>

                    <p>Based on listening service count.</p>
                  </div>

                  <div className="attack-summary-card">
                    <span>SCAN MODE</span>

                    <strong className="exposure-low">
                      LOCAL
                    </strong>

                    <p>Authorized localhost telemetry only.</p>
                  </div>
                </section>

                <section className="port-intelligence">
                  <div className="port-header">
                    <div>
                      <span>LIVE SERVICE INTELLIGENCE</span>
                      <h2>LISTENING PORTS</h2>
                    </div>

                    <div className="port-refresh">
                      AUTO REFRESH: 3 SEC
                    </div>
                  </div>

                  <div className="port-table-wrapper">
                    <table className="port-table">
                      <thead>
                        <tr>
                          <th>PORT</th>
                          <th>HOST</th>
                          <th>PROCESS</th>
                          <th>PID</th>
                          <th>STATE</th>
                        </tr>
                      </thead>

                      <tbody>
                        {attackData.ports.length === 0 ? (
                          <tr>
                            <td
                              colSpan="5"
                              className="no-ports"
                            >
                              NO LISTENING PORTS DETECTED
                            </td>
                          </tr>
                        ) : (
                          attackData.ports.map((port, index) => (
                            <tr
                              key={`${port.port}-${port.pid}-${index}`}
                            >
                              <td className="port-number">
                                {port.port}
                              </td>

                              <td>{port.host}</td>

                              <td className="port-process">
                                {port.process}
                              </td>

                              <td>{port.pid || "SYSTEM"}</td>

                              <td>
                                <span className="listening-status">
                                  <i></i>
                                  {port.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </main>
        ) : isRiskIntelligence ? (
          <main className="risk-dashboard">

            <div className="risk-title-section">
              <div>
                <p className="module-page-eyebrow">
                  AURA SENTINEL / THREAT ANALYSIS ENGINE
                </p>

                <h1>RISK INTELLIGENCE</h1>

                <p className="risk-description">
                  Real-time security posture analysis based on live system telemetry.
                </p>
              </div>

              <div className="risk-live-status">
                <span></span>
                LIVE ANALYSIS
              </div>
            </div>

            {riskError ? (
              <div className="connection-error">
                {riskError}
              </div>
            ) : !riskData ? (
              <div className="loading-system">
                <div className="module-loader"></div>
                CALCULATING RISK SCORE...
              </div>
            ) : (
              <>
                <section className="risk-score-section">
                  <div className="risk-gauge" style={{ "--risk-score": riskData.risk_score }}>
                    <div className="risk-gauge-inner">
                      <span className="risk-score-number">
                        {riskData.risk_score}
                      </span>

                      <span className="risk-score-label">
                        / 100
                      </span>
                    </div>
                  </div>

                  <div className="risk-summary">
                    <span>CURRENT SECURITY POSTURE</span>

                    <h2
                      className={
                        riskData.risk_level === "HIGH"
                          ? "risk-high"
                          : riskData.risk_level === "MODERATE"
                            ? "risk-moderate"
                            : "risk-low"
                      }
                    >
                      {riskData.risk_level} RISK
                    </h2>

                    <p>
                      AURA continuously evaluates live system activity,
                      resource usage and local exposure indicators.
                    </p>

                    <div className="risk-refresh">
                      AUTO REFRESH: 3 SECONDS
                    </div>
                  </div>
                </section>

                <section className="risk-factors">
                  <div className="risk-factors-header">
                    <span>LIVE RISK FACTORS</span>
                    <h2>INTELLIGENCE BREAKDOWN</h2>
                  </div>

                  <div className="risk-factors-grid">

                    <div className="risk-factor-card">
                      <div className="factor-top">
                        <span>CPU LOAD</span>
                        <strong>{riskData.cpu_usage}%</strong>
                      </div>

                      <div className="risk-factor-track">
                        <div
                          className="risk-factor-fill"
                          style={{
                            width: `${Math.min(riskData.cpu_usage, 100)}%`
                          }}
                        ></div>
                      </div>

                      <p>Live processor utilization.</p>
                    </div>

                    <div className="risk-factor-card">
                      <div className="factor-top">
                        <span>MEMORY LOAD</span>
                        <strong>{riskData.memory_usage}%</strong>
                      </div>

                      <div className="risk-factor-track">
                        <div
                          className="risk-factor-fill"
                          style={{
                            width: `${Math.min(riskData.memory_usage, 100)}%`
                          }}
                        ></div>
                      </div>

                      <p>Current system memory utilization.</p>
                    </div>

                    <div className="risk-factor-card">
                      <div className="factor-top">
                        <span>DISK USAGE</span>
                        <strong>{riskData.disk_usage}%</strong>
                      </div>

                      <div className="risk-factor-track">
                        <div
                          className="risk-factor-fill"
                          style={{
                            width: `${Math.min(riskData.disk_usage, 100)}%`
                          }}
                        ></div>
                      </div>

                      <p>Current storage capacity usage.</p>
                    </div>

                    <div className="risk-factor-card">
                      <div className="factor-top">
                        <span>OPEN PORTS</span>
                        <strong>{riskData.open_ports}</strong>
                      </div>

                      <div className="port-risk-visual">
                        <span
                          className={
                            riskData.open_ports > 8
                              ? "risk-port high"
                              : riskData.open_ports > 3
                                ? "risk-port medium"
                                : "risk-port low"
                          }
                        >
                          {riskData.open_ports > 8
                            ? "ELEVATED EXPOSURE"
                            : riskData.open_ports > 3
                              ? "MODERATE EXPOSURE"
                              : "MINIMAL EXPOSURE"}
                        </span>
                      </div>

                      <p>Detected local listening services.</p>
                    </div>

                  </div>
                </section>
              </>
            )}
          </main>
        ) : isWhatIfEngine ? (
          <main className="whatif-dashboard">

            <div className="whatif-title-section">
              <div>
                <p className="module-page-eyebrow">
                  AURA SENTINEL / PREDICTIVE SIMULATION
                </p>

                <h1>WHAT-IF ENGINE</h1>

                <p className="whatif-description">
                  Simulate system conditions and predict their security impact.
                </p>
              </div>

              <div className="whatif-live-status">
                <span></span>
                SIMULATION ACTIVE
              </div>
            </div>

            <section className="whatif-grid">

              <div className="simulation-controls">

                <div className="simulation-header">
                  <div>
                    <span>SCENARIO PARAMETERS</span>
                    <h2>MODIFY CONDITIONS</h2>
                  </div>
                  <button className="import-system-btn" onClick={importCurrentSystem}>
                    <span>⚡</span>
                    IMPORT CURRENT SYSTEM
                  </button>
                </div>

                <div className="scenario-presets">
                  <span>QUICK SCENARIOS</span>

                  <div className="preset-buttons">
                    <button onClick={() => loadScenario("normal")}>
                      NORMAL
                    </button>

                    <button onClick={() => loadScenario("heavy")}>
                      HEAVY LOAD
                    </button>

                    <button onClick={() => loadScenario("exposure")}>
                      HIGH EXPOSURE
                    </button>

                    <button
                      className="reset-scenario"
                      onClick={() => loadScenario("reset")}
                    >
                      ↺ RESET
                    </button>
                  </div>
                </div>


                <div className="simulation-control">
                  <div className="control-label">
                    <span>CPU USAGE</span>
                    <strong>{simulation.cpu}%</strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simulation.cpu}
                    onChange={(e) =>
                      setSimulation({
                        ...simulation,
                        cpu: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="simulation-control">
                  <div className="control-label">
                    <span>MEMORY USAGE</span>
                    <strong>{simulation.memory}%</strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simulation.memory}
                    onChange={(e) =>
                      setSimulation({
                        ...simulation,
                        memory: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="simulation-control">
                  <div className="control-label">
                    <span>DISK USAGE</span>
                    <strong>{simulation.disk}%</strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={simulation.disk}
                    onChange={(e) =>
                      setSimulation({
                        ...simulation,
                        disk: Number(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="simulation-control">
                  <div className="control-label">
                    <span>OPEN PORTS</span>
                    <strong>{simulation.ports}</strong>
                  </div>

                  <input
                    type="range"
                    min="0"
                    max="30"
                    value={simulation.ports}
                    onChange={(e) =>
                      setSimulation({
                        ...simulation,
                        ports: Number(e.target.value),
                      })
                    }
                  />
                </div>

              </div>

              <div className="simulation-result">

                <span>SIMULATED RISK SCORE</span>

                <div
                  className="simulation-gauge"
                  style={{ "--simulation-risk": simulatedRisk }}
                >
                  <div className="simulation-gauge-inner">
                    <strong>{simulatedRisk}</strong>
                    <small>/ 100</small>
                  </div>
                </div>

                <h2
                  className={
                    simulatedLevel === "HIGH"
                      ? "risk-high"
                      : simulatedLevel === "MODERATE"
                        ? "risk-moderate"
                        : "risk-low"
                  }
                >
                  {simulatedLevel} RISK
                </h2>

                <p>
                  This prediction is calculated from your hypothetical
                  system conditions using the AURA risk model.
                </p>

              </div>

            </section>

            <section className="simulation-recommendations">
              <div className="recommendations-header">
                <div>
                  <span>AURA DECISION ENGINE</span>
                  <h2>AI RECOMMENDATIONS</h2>
                </div>

                <div className="recommendation-status">
                  {simulationRecommendations.length} SIGNAL
                  {simulationRecommendations.length !== 1 ? "S" : ""}
                </div>
              </div>

              <div className="recommendation-grid">
                {simulationRecommendations.map(
                  (recommendation, index) => (
                    <article
                      key={`${recommendation.title}-${index}`}
                      className={`recommendation-card ${recommendation.level}`}
                    >
                      <div className="recommendation-top">
                        <span
                          className={`recommendation-indicator ${recommendation.level}`}
                        ></span>

                        <span className="recommendation-level">
                          {recommendation.level === "safe"
                            ? "STABLE"
                            : recommendation.level === "critical"
                              ? "CRITICAL"
                              : "WARNING"}
                        </span>
                      </div>

                      <h3>{recommendation.title}</h3>

                      <p>{recommendation.text}</p>
                    </article>
                  )
                )}
              </div>
            </section>

          </main>
        ) : isAuraVoice ? (
          <main className="aura-voice-dashboard">

            <div className="voice-title-section">
              <div>
                <p className="module-page-eyebrow">
                  AURA SENTINEL / VOICE INTELLIGENCE CORE
                </p>

                <h1>AURA VOICE</h1>

                <p className="voice-description">
                  Talk naturally with your intelligent system companion.
                </p>
              </div>

              <div className="voice-system-status">
                <span></span>
                VOICE CORE ONLINE
              </div>
            </div>

            {!isLanguageSelected ? (
              <section className="language-selection">

                <div className="language-orb">
                  <div className="language-eye language-eye-left"></div>
                  <div className="language-eye language-eye-right"></div>
                </div>

                <p className="language-kicker">
                  PERSONALIZE YOUR EXPERIENCE
                </p>

                <h2>HOW SHOULD AURA TALK TO YOU?</h2>

                <p className="language-description">
                  Choose your preferred conversation language.
                  You can change this anytime later.
                </p>

                <div className="language-options">

                  <button
                    className="language-card"
                    onClick={() => {
                      setVoiceLanguage("hindi");
                      setIsLanguageSelected(true);
                    }}
                  >
                    <span className="language-icon">अ</span>

                    <strong>HINDI</strong>

                    <small>
                      हिंदी में बातचीत
                    </small>
                  </button>

                  <button
                    className="language-card featured"
                    onClick={() => {
                      setVoiceLanguage("hinglish");
                      setIsLanguageSelected(true);
                    }}
                  >
                    <span className="language-icon">⚡</span>

                    <strong>HINGLISH</strong>

                    <small>
                      Hindi + English mix
                    </small>
                  </button>

                  <button
                    className="language-card"
                    onClick={() => {
                      setVoiceLanguage("english");
                      setIsLanguageSelected(true);
                    }}
                  >
                    <span className="language-icon">A</span>

                    <strong>ENGLISH</strong>

                    <small>
                      Speak in English
                    </small>
                  </button>

                </div>

              </section>
            ) : (
              <section className="voice-interface">

                <div className="voice-language-bar">
                  <span>
                    CONVERSATION MODE
                  </span>

                  <strong>
                    {voiceLanguage === "hindi"
                      ? "HINDI"
                      : voiceLanguage === "hinglish"
                        ? "HINGLISH"
                        : "ENGLISH"}
                  </strong>

                  <button
                    onClick={() => {
                      setIsLanguageSelected(false);
                      setVoiceStatus("READY");
                      setTranscript("");
                    }}
                  >
                    CHANGE LANGUAGE
                  </button>
                </div>

                <div className="aura-core">

                  <div className={`aura-pulse ${isListening ? "listening" : ""}`}>
                    <div className="aura-eye aura-eye-left"></div>
                    <div className="aura-eye aura-eye-right"></div>
                  </div>

                  <div className="aura-core-glow"></div>

                </div>

                <div className="voice-status-panel">
                  <span className="voice-status-label">
                    AURA STATUS
                  </span>

                  <h2>
                    {isListening
                      ? "LISTENING..."
                      : voiceStatus}
                  </h2>

                  <p>
                    {isListening
                      ? "I'm listening. Speak naturally..."
                      : "Press the microphone and start talking to AURA."}
                  </p>
                </div>

                <button
                  className={`voice-mic-button ${isListening || continuousMode ? "active" : ""}`}
                  onClick={() => {
                    if (continuousMode) {
                      continuousModeRef.current = false;
                      setContinuousMode(false);
                      stopAuraListening();
                      window.speechSynthesis.cancel();
                      setVoiceStatus("READY");
                    } else {
                      continuousModeRef.current = true;
                      setContinuousMode(true);
                      startAuraListening();
                    }
                  }}
                >
                  <span className="mic-icon">
                    {isListening ? "◼" : "🎙"}
                  </span>

                  <span>
                    <span>
                      {continuousMode ? "END CONVERSATION" : "START TALKING TO AURA"}
                    </span>
                  </span>
                </button>

                <div className="voice-transcript">
                  <span>LIVE TRANSCRIPT</span>

                  <p>
                    {transcript || "Waiting for voice input..."}
                  </p>
                </div>

              </section>
            )}

          </main>
        ) : isFinancialRisk ? (
          <main className="financial-dashboard">

            <div className="financial-title-section">

              <div>
                <p className="module-page-eyebrow">
                  AURA SENTINEL / BUSINESS IMPACT ENGINE
                </p>

                <h1>FINANCIAL RISK</h1>

                <p className="financial-description">
                  Translate technical cyber exposure into estimated
                  business and financial impact.
                </p>
              </div>

              <div className="financial-live-status">
                <span></span>
                LIVE ANALYSIS
              </div>

            </div>

            {financialError ? (

              <div className="connection-error">
                {financialError}
              </div>

            ) : !financialData ? (

              <div className="loading-system">
                <div className="module-loader"></div>
                CALCULATING FINANCIAL EXPOSURE...
              </div>

            ) : (

              <>
                <section className="financial-hero">

                  <div className="financial-exposure-card">

                    <span>TOTAL ESTIMATED EXPOSURE</span>

                    <h2>
                      ₹{financialData.total_financial_exposure.toLocaleString("en-IN")}
                    </h2>

                    <p>
                      Estimated potential financial impact based on
                      current live system risk indicators.
                    </p>

                  </div>

                  <div className="financial-risk-level">

                    <span>FINANCIAL RISK LEVEL</span>

                    <strong
                      className={
                        financialData.financial_risk_level === "CRITICAL"
                          ? "financial-critical"
                          : financialData.financial_risk_level === "HIGH"
                            ? "financial-high"
                            : financialData.financial_risk_level === "MODERATE"
                              ? "financial-moderate"
                              : "financial-low"
                      }
                    >
                      {financialData.financial_risk_level}
                    </strong>

                    <small>
                      Based on current AURA telemetry
                    </small>

                  </div>

                </section>


                <section className="financial-stats-grid">

                  <div className="financial-stat-card">
                    <span>ESTIMATED HOURLY LOSS</span>

                    <strong>
                      ₹{financialData.estimated_hourly_loss.toLocaleString("en-IN")}
                    </strong>

                    <p>
                      Potential cost during a security-related disruption.
                    </p>
                  </div>


                  <div className="financial-stat-card">
                    <span>ESTIMATED DOWNTIME</span>

                    <strong>
                      {financialData.estimated_downtime_hours} HRS
                    </strong>

                    <p>
                      Predicted recovery window based on risk severity.
                    </p>
                  </div>


                  <div className="financial-stat-card">
                    <span>INCIDENT COST</span>

                    <strong>
                      ₹{financialData.potential_incident_cost.toLocaleString("en-IN")}
                    </strong>

                    <p>
                      Estimated operational impact during an incident.
                    </p>
                  </div>


                  <div className="financial-stat-card">
                    <span>RECOVERY COST</span>

                    <strong>
                      ₹{financialData.recovery_cost.toLocaleString("en-IN")}
                    </strong>

                    <p>
                      Estimated cost of system response and recovery.
                    </p>
                  </div>

                </section>


                <section className="financial-drivers">

                  <div className="financial-drivers-header">
                    <div>
                      <span>AURA IMPACT ANALYSIS</span>
                      <h2>WHAT IS DRIVING THE COST?</h2>
                    </div>

                    <div className="technical-score">
                      TECHNICAL RISK: {financialData.technical_risk_score}/100
                    </div>
                  </div>


                  <div className="financial-driver-grid">

                    <div className="financial-driver">
                      <span>CPU LOAD</span>
                      <strong>{financialData.cpu_usage}%</strong>
                    </div>

                    <div className="financial-driver">
                      <span>MEMORY LOAD</span>
                      <strong>{financialData.memory_usage}%</strong>
                    </div>

                    <div className="financial-driver">
                      <span>DISK USAGE</span>
                      <strong>{financialData.disk_usage}%</strong>
                    </div>

                    <div className="financial-driver">
                      <span>NETWORK EXPOSURE</span>
                      <strong>
                        {financialData.open_ports} PORTS
                      </strong>
                    </div>

                  </div>

                </section>

              </>
            )}

          </main>
        ) : isInvestmentOptimizer ? (
          <main className="investment-dashboard">
            <div className="investment-title-section">
              <div>
                <p className="module-page-eyebrow">AURA SENTINEL / SECURITY DECISION ENGINE</p>
                <h1>INVESTMENT OPTIMIZER</h1>
                <p className="investment-description">
                  Analyze security investment options and identify the strongest estimated financial protection strategy.
                </p>
              </div>
              <div className="investment-live-status">
                <span></span>
                LIVE OPTIMIZATION
              </div>
            </div>

            {investmentError ? (
              <div className="connection-error">{investmentError}</div>
            ) : !investmentData ? (
              <div className="loading-system">
                <div className="module-loader"></div>
                CALCULATING SECURITY INVESTMENT OPTIONS...
              </div>
            ) : (
              <>
                <section className="investment-input-section">
                  <div className="investment-input-header">
                    <div>
                      <span>BUSINESS SECURITY INPUT</span>
                      <h2>ANALYZE YOUR ENVIRONMENT</h2>
                    </div>
                    <p>Enter your business details for a personalized security investment analysis.</p>
                  </div>

                  <div className="investment-input-grid">
                    <div className="investment-input-field">
                      <label>BUSINESS TYPE</label>
                      <select
                        value={investmentInput.business_type}
                        onChange={(e) => setInvestmentInput({ ...investmentInput, business_type: e.target.value })}
                      >
                        <option value="Small Business">Small Business</option>
                        <option value="Startup">Startup</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Government Organization">Government Organization</option>
                      </select>
                    </div>

                    <div className="investment-input-field">
                      <label>MONTHLY SECURITY BUDGET (₹)</label>
                      <input type="number" placeholder="Example: 50000" value={investmentInput.monthly_budget}
                        onChange={(e) => setInvestmentInput({ ...investmentInput, monthly_budget: e.target.value })} />
                    </div>

                    <div className="investment-input-field">
                      <label>NUMBER OF SYSTEMS</label>
                      <input type="number" placeholder="Example: 25" value={investmentInput.systems}
                        onChange={(e) => setInvestmentInput({ ...investmentInput, systems: e.target.value })} />
                    </div>

                    <div className="investment-input-field">
                      <label>CRITICAL DATA VALUE (₹)</label>
                      <input type="number" placeholder="Example: 500000" value={investmentInput.data_value}
                        onChange={(e) => setInvestmentInput({ ...investmentInput, data_value: e.target.value })} />
                    </div>
                  </div>

                  {investmentFormError && <p style={{ color: "#ff7b7b", marginTop: "15px", fontSize: "13px" }}>{investmentFormError}</p>}

                  <button className="analyze-investment-btn" disabled={isAnalyzingInvestment} onClick={runInvestmentAnalysis}>
                    {isAnalyzingInvestment ? "ANALYZING..." : "⚡ RUN AURA INVESTMENT ANALYSIS"}
                  </button>
                </section>

                <section className="investment-results">
                  <div className="investment-result-header">
                    <div>
                      <p>AURA INTELLIGENCE RESULT</p>
                      <h2>{investmentData.business_type} security posture</h2>
                    </div>
                    <div className="live-risk-badge">LIVE RISK: {investmentData.live_system_risk.risk_score}/100</div>
                  </div>

                  <div className="investment-summary-grid">
                    <div className="investment-summary-card">
                      <span>LIVE RISK SCORE</span>
                      <h2>{investmentData.live_system_risk.risk_score}/100</h2>
                      <small>{investmentData.live_system_risk.open_ports} listening ports detected</small>
                    </div>
                    <div className="investment-summary-card">
                      <span>FINANCIAL EXPOSURE</span>
                      <h2>₹{investmentData.current_financial_exposure.toLocaleString("en-IN")}</h2>
                      <small>Estimated incident exposure</small>
                    </div>
                    <div className="investment-summary-card">
                      <span>RECOMMENDED PLAN</span>
                      <h2>{investmentData.recommended_plan.name}</h2>
                      <small>{investmentData.recommended_plan.risk_reduction}% risk reduction</small>
                    </div>
                  </div>

                  <div className="recommended-investment-card">
                    <div className="recommendation-title">
                      <div>
                        <p>AURA RECOMMENDATION</p>
                        <h2>{investmentData.recommended_plan.name}</h2>
                      </div>
                      <div className="roi-badge">{investmentData.recommended_plan.roi_percent}% ROI</div>
                    </div>

                    <p className="recommendation-reason">{investmentData.recommendation_reason}</p>

                    <div className="plan-metrics-grid">
                      <div><span>INVESTMENT</span><strong>₹{investmentData.recommended_plan.cost.toLocaleString("en-IN")}</strong></div>
                      <div><span>POTENTIAL SAVINGS</span><strong>₹{investmentData.recommended_plan.potential_savings.toLocaleString("en-IN")}</strong></div>
                      <div><span>NET BENEFIT</span><strong>₹{investmentData.recommended_plan.net_benefit.toLocaleString("en-IN")}</strong></div>
                      <div><span>PROJECTED EXPOSURE</span><strong>₹{investmentData.recommended_plan.projected_exposure.toLocaleString("en-IN")}</strong></div>
                    </div>
                  </div>

                  <div className="defense-recommendation-card">
                    <h3>AURA DEFENSE RECOMMENDATIONS</h3>
                    <div className="defense-list">
                      {investmentData.defense_recommendations.map((item, index) => (
                        <div className="defense-item" key={index}><span>✓</span>{item}</div>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="investment-plans-section">
                  <div className="investment-section-header">
                    <div><span>SECURITY INVESTMENT OPTIONS</span><h2>COMPARE DEFENSE STRATEGIES</h2></div>
                  </div>

                  <div className="investment-plan-grid">
                    {investmentData.plans.map((plan) => {
                      const isRecommended = plan.id === investmentData.recommended_plan.id;
                      return (
                        <article key={plan.id} className={`investment-plan-card ${isRecommended ? "recommended" : ""}`}>
                          {isRecommended && <div className="recommended-badge">RECOMMENDED</div>}
                          <div className="plan-header">
                            <span className="plan-id">{plan.id.toUpperCase()}</span>
                            <h3>{plan.name}</h3>
                          </div>
                          <div className="plan-cost">
                            <span>INVESTMENT</span>
                            <strong>₹{plan.cost.toLocaleString("en-IN")}</strong>
                          </div>
                          <div className="plan-metrics">
                            <div><span>RISK REDUCTION</span><strong>{plan.risk_reduction}%</strong></div>
                            <div><span>ESTIMATED SAVINGS</span><strong>₹{plan.potential_savings.toLocaleString("en-IN")}</strong></div>
                            <div><span>NET BENEFIT</span>
                              <strong className={plan.net_benefit >= 0 ? "positive-value" : "negative-value"}>
                                ₹{plan.net_benefit.toLocaleString("en-IN")}
                              </strong>
                            </div>
                          </div>
                          <div className="plan-projected">
                            <span>PROJECTED EXPOSURE</span>
                            <strong>₹{plan.projected_exposure.toLocaleString("en-IN")}</strong>
                          </div>
                          <div className="plan-roi">
                            <span>ESTIMATED ROI</span>
                            <strong>{plan.roi_percent}%</strong>
                          </div>
                          <div className="plan-features">
                            <span>INCLUDED PROTECTION</span>
                            <ul>
                              {plan.features.map((feature) => (
                                <li key={feature}><span>✓</span>{feature}</li>
                              ))}
                            </ul>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </>
            )}

          </main>
        ) : isFileSecurity ? (
          <main className="filesec-dashboard">
            <div className="filesec-title-section">
              <div>
                <p className="module-page-eyebrow">AURA SENTINEL / FILE INTEGRITY ENGINE</p>
                <h1>FILE SECURITY</h1>
                <p className="filesec-description">
                  Scans Downloads, Desktop and Documents for junk, duplicate and sensitive files. Nothing is removed without your approval.
                </p>
              </div>

              <div className="filesec-header-actions">
                <div className="filesec-tabs">
                  <button
                    className={filesecView === "scan" ? "filesec-tab active" : "filesec-tab"}
                    onClick={() => setFilesecView("scan")}
                  >
                    SCAN
                  </button>
                  <button
                    className={filesecView === "quarantine" ? "filesec-tab active" : "filesec-tab"}
                    onClick={() => setFilesecView("quarantine")}
                  >
                    QUARANTINE
                  </button>
                </div>

                {filesecView === "scan" && (
                  <button className="filesec-rescan-btn" onClick={fetchFileScan} disabled={isScanningFiles}>
                    {isScanningFiles ? "SCANNING..." : "⟳ RESCAN"}
                  </button>
                )}
              </div>
            </div>

            {quarantineMessage && <p className="filesec-message">{quarantineMessage}</p>}

            {filesecView === "scan" ? (
              fileSecurityError ? (
                <div className="connection-error">{fileSecurityError}</div>
              ) : !fileSecurityData ? (
                <div className="loading-system">
                  <div className="module-loader"></div>
                  SCANNING YOUR FILES...
                </div>
              ) : (
                <>
                  <section className="filesec-summary-grid">
                    <div className="filesec-summary-card">
                      <span>FILES SCANNED</span>
                      <strong>{fileSecurityData.total_files_scanned}</strong>
                    </div>
                    <div className="filesec-summary-card">
                      <span>FLAGGED FILES</span>
                      <strong>{fileSecurityData.total_flagged}</strong>
                    </div>
                    <div className="filesec-summary-card">
                      <span>RECOVERABLE SPACE</span>
                      <strong>{fileSecurityData.potential_space_recoverable_mb} MB</strong>
                    </div>
                  </section>

                  {fileSecurityData.total_flagged > 0 && (
                    <section className="filesec-breakdown">
                      <h2>CATEGORY BREAKDOWN</h2>
                      <div className="filesec-breakdown-bars">
                        {Object.entries(categoryBreakdown).map(([category, count]) => (
                          <div className="filesec-breakdown-row" key={category}>
                            <span className={`filesec-tag ${category.toLowerCase()}`}>{category}</span>
                            <div className="filesec-breakdown-track">
                              <div
                                className={`filesec-breakdown-fill ${category.toLowerCase()}`}
                                style={{ width: `${(count / fileSecurityData.total_flagged) * 100}%` }}
                              ></div>
                            </div>
                            <strong>{count}</strong>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}

                  <section className="filesec-list-section">
                    <div className="filesec-list-header">
                      <h2>FLAGGED FILES</h2>

                      <div className="filesec-list-controls">
                        <input
                          type="text"
                          className="filesec-search"
                          placeholder="Search files..."
                          value={fileSearchQuery}
                          onChange={(e) => setFileSearchQuery(e.target.value)}
                        />

                        <button className="filesec-select-all-btn" onClick={toggleSelectAll} disabled={filteredFiles.length === 0}>
                          {allFilteredSelected ? "DESELECT ALL" : "SELECT ALL"}
                        </button>

                        <button
                          className="filesec-quarantine-btn"
                          disabled={selectedFiles.length === 0 || isQuarantining}
                          onClick={quarantineSelectedFiles}
                        >
                          {isQuarantining ? "MOVING..." : `QUARANTINE (${selectedFiles.length})`}
                        </button>

                        <button
                          className="filesec-delete-btn"
                          disabled={selectedFiles.length === 0 || isDeleting}
                          onClick={deleteSelectedFiles}
                        >
                          {isDeleting ? "DELETING..." : `DELETE (${selectedFiles.length})`}
                        </button>
                      </div>
                    </div>

                    {fileSecurityData.files.length === 0 ? (
                      <div className="no-ports">NO FLAGGED FILES — YOUR FOLDERS ARE CLEAN</div>
                    ) : (
                      <div className="filesec-file-list">
                        {filteredFiles.map((file) => (
                          <div className="filesec-file-row" key={file.path}>
                            <input
                              type="checkbox"
                              checked={selectedFiles.includes(file.path)}
                              onChange={() => toggleFileSelection(file.path)}
                            />
                            <span className={`filesec-tag ${file.category.toLowerCase()}`}>
                              {file.category}
                            </span>
                            <div className="filesec-file-info">
                              <strong>{file.name}</strong>
                              <small>{file.source_folder} · {(file.size / 1024).toFixed(1)} KB</small>
                              <p>{file.reason}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                </>
              )
            ) : quarantineListError ? (
              <div className="connection-error">{quarantineListError}</div>
            ) : !quarantineList ? (
              <div className="loading-system">
                <div className="module-loader"></div>
                LOADING QUARANTINE...
              </div>
            ) : (
              <section className="filesec-list-section">
                <div className="filesec-list-header">
                  <h2>QUARANTINED FILES ({quarantineList.total_quarantined})</h2>
                  <button
                    className="filesec-restore-btn"
                    disabled={selectedQuarantineItems.length === 0 || isRestoring}
                    onClick={restoreSelectedItems}
                  >
                    {isRestoring ? "RESTORING..." : `RESTORE ${selectedQuarantineItems.length}`}
                  </button>
                </div>

                {quarantineList.items.length === 0 ? (
                  <div className="no-ports">QUARANTINE IS EMPTY</div>
                ) : (
                  <div className="filesec-file-list">
                    {quarantineList.items.map((item) => (
                      <div className="filesec-file-row" key={item.quarantine_name}>
                        <input
                          type="checkbox"
                          checked={selectedQuarantineItems.includes(item.quarantine_name)}
                          onChange={() => toggleQuarantineSelection(item.quarantine_name)}
                        />
                        <span className="filesec-tag quarantined">QUARANTINED</span>
                        <div className="filesec-file-info">
                          <strong>{item.original_path.split(/[\\/]/).pop()}</strong>
                          <small>{(item.size / 1024).toFixed(1)} KB · from {item.original_path}</small>
                          <p>Quarantined {new Date(item.quarantined_at * 1000).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </main>
        ) : (
          <main className="module-page-content">
            <p className="module-page-eyebrow">
              AURA SENTINEL / MODULE
            </p>

            <h1>{formattedName}</h1>

            <div className="module-coming-soon">
              <div className="module-loader"></div>

              <h2>MODULE INTERFACE INITIALIZED</h2>

              <p>
                The {activeModule.replaceAll("-", " ")} intelligence
                module is ready for integration.
              </p>

              <div className="module-data-line">
                <span>STATUS</span>
                <strong>ONLINE</strong>
              </div>
            </div>
          </main>
        )}
      </div>
    );
  }

  if (systemStarted) {
    return (
      <div className="command-center">
        <header className="command-header">
          <div className="command-logo">
            <span className="command-logo-dot"></span>
            <div>
              <h1>AURA</h1>
              <p>SENTINEL COMMAND CENTER</p>
            </div>
          </div>

          <div className="command-system-status">
            <span className="status-light"></span>
            ALL SYSTEMS ONLINE
          </div>
        </header>

        <main className="command-main">
          <section className="command-intro">
            <p className="command-eyebrow">AURA INTELLIGENCE PLATFORM</p>
            <h2>What would you like to analyze?</h2>
            <p>
              Select a system module to access AURA's cyber risk
              intelligence capabilities.
            </p>
          </section>

          <section className="module-grid">
            <button className="module-card" onClick={() => openModule("system-monitoring")}>
              <span className="module-number">01</span>
              <span className="module-icon">◉</span>
              <h3>System Monitoring</h3>
              <p>Live system performance and process intelligence.</p>
              <span className="module-open">OPEN →</span>
            </button>

            <button className="module-card" onClick={() => openModule("attack-surface")}>
              <span className="module-number">02</span>
              <span className="module-icon">◈</span>
              <h3>Attack Surface</h3>
              <p>Network exposure and active service intelligence.</p>
              <span className="module-open">OPEN →</span>
            </button>

            <button className="module-card" onClick={() => openModule("risk-intelligence")}>
              <span className="module-number">03</span>
              <span className="module-icon">⬡</span>
              <h3>Risk Intelligence</h3>
              <p>Correlated cyber risk score and threat drivers.</p>
              <span className="module-open">OPEN →</span>
            </button>

            <button className="module-card" onClick={() => openModule("financial-risk")}>
              <span className="module-number">04</span>
              <span className="module-icon">₹</span>
              <h3>Financial Risk</h3>
              <p>Translate cyber exposure into business impact.</p>
              <span className="module-open">OPEN →</span>
            </button>

            <button className="module-card" onClick={() => openModule("what-if-engine")}>
              <span className="module-number">05</span>
              <span className="module-icon">◐</span>
              <h3>What-If Engine</h3>
              <p>Simulate security actions before investing.</p>
              <span className="module-open">OPEN →</span>
            </button>

            <button className="module-card" onClick={() => openModule("investment-optimizer")}>
              <span className="module-number">06</span>
              <span className="module-icon">◇</span>
              <h3>Investment Optimizer</h3>
              <p>Find the best security plan for your budget.</p>
              <span className="module-open">OPEN →</span>
            </button>

            <button className="module-card" onClick={() => openModule("aura-voice")}>
              <span className="module-number">07</span>
              <span className="module-icon">◉</span>
              <h3>AI Assistant</h3>
              <p>Explain risk intelligence in natural language.</p>
              <span className="module-open">OPEN →</span>
            </button>

            <button className="module-card" onClick={() => openModule("file-security")}>
              <span className="module-number">08</span>
              <span className="module-icon">▣</span>
              <h3>File Security</h3>
              <p>Analyze suspicious files with user-approved actions.</p>
              <span className="module-open">OPEN →</span>
            </button>
          </section>
        </main>

        <footer className="command-footer">
          <span>AURA SENTINEL v0.1.0</span>
          <span>8 INTELLIGENCE MODULES AVAILABLE</span>
          <span>SIH26105</span>
        </footer>
      </div>
    );
  }


  return (

    <div className="landing-page">
      {/* Storm / lightning background */}
      <div className="storm-bg">
        <div className="lightning lightning-1"></div>
        <div className="lightning lightning-2"></div>
      </div>

      {/* Robotic engine background */}
      <div className="engine engine-1"></div>
      <div className="engine engine-2"></div>
      <div className="engine engine-3"></div>

      <header className="landing-header">
        <div className="system-name">
          <span className="system-dot"></span>
          AURA SENTINEL
        </div>

        <div className="header-status">
          <span></span>
          SYSTEM ONLINE
        </div>
      </header>

      <main className="hero">
        <p className="intro-text">AI-POWERED CYBER RISK INTELLIGENCE</p>


        <div className="hero-content-row">
          <div className="aura-core">
            {/* AI / Robotic eye */}
            <div className={`ai-eye ${auraHover ? "awake" : ""}`}>
              <div className="eye-outer"></div>
              <div className="eye-glow"></div>
              <div className="eye-pupil"></div>
              <div className="eye-scan"></div>
            </div>

            <div className="energy-ring ring-1"></div>
            <div className="energy-ring ring-2"></div>
            <div className="energy-ring ring-3"></div>

            {/* Main AURA text */}
            <div
              key={rotationkey}
              className={`aura-container ${auraHover ? "active" : ""}`}
              onMouseEnter={() => {
                setAuraHover(true);
                setRotationkey((prev) => prev + 1);
              }}
              onMouseLeave={() => setAuraHover(false)}
            >
              <h1>AURA</h1>
            </div>
          </div>

          <div className="aura-globe-wrapper">
            <AuraGlobe />
          </div>

        </div>

        <p className="hero-subtitle">
          CONTINUOUS CYBER RISK INTELLIGENCE
        </p>

        <p className="hero-description">
          FROM TECHNICAL SIGNALS TO BUSINESS RISK, FINANCIAL EXPOSURE
          <br />
          AND INTELLIGENT DECISIONS.
        </p>

        {/* Only main button */}
        <button className="enter-button" onClick={openFaceAuth} disabled={!faceModelsLoaded}>
          <span>INITIALIZE AURA</span>
          <span className="button-arrow">→</span>
        </button>

        <p className="hover-hint">
          HOVER OVER AURA TO AWAKEN THE AI
        </p>

        <button
          className="scroll-cue"
          onClick={() =>
            document.getElementById("aura-pulse-strip")?.scrollIntoView({ behavior: "smooth" })
          }
          aria-label="Scroll to explore AURA"
        >
          <span></span>
        </button>
      </main>
      <RevealOnScroll>
        <section id="aura-pulse-strip" className="pulse-strip">
          <div className="pulse-track">
            {[...Array(2)].map((_, loopIndex) => (
              <div className="pulse-set" key={loopIndex}>
                <span>LIVE CPU LOAD: {landingStats ? `${Math.round(landingStats.cpu_usage)}%` : "—"}</span>
                <span className="pulse-divider">◆</span>
                <span>RISK SCORE: {landingStats ? `${landingStats.risk_score}/100` : "—"}</span>
                <span className="pulse-divider">◆</span>
                <span>OPEN PORTS: {landingStats ? landingStats.open_ports : "—"}</span>
                <span className="pulse-divider">◆</span>
                <span>MEMORY LOAD: {landingStats ? `${landingStats.memory_usage}%` : "—"}</span>
                <span className="pulse-divider">◆</span>
                <span>CONTINUOUS MONITORING ACTIVE</span>
                <span className="pulse-divider">◆</span>
                <span>8 INTELLIGENCE MODULES</span>
                <span className="pulse-divider">◆</span>
                <span>SIH26105</span>
                <span className="pulse-divider">◆</span>
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="pipeline-section">
          <div className="pipeline-heading">
            <p className="module-page-eyebrow">FROM SIGNAL TO DECISION</p>
            <h2>HOW AURA WORKS</h2>
            <p className="pipeline-subtitle">
              Every recommendation AURA makes traces back to a live reading from your own system.
            </p>
          </div>

          <div className="pipeline-flow">
            {[
              { stage: "DETECT", text: "Reads live CPU, memory, disk and network telemetry directly from your system." },
              { stage: "ANALYZE", text: "A weighted risk engine correlates every signal into a single 0–100 score." },
              { stage: "TRANSLATE", text: "Technical risk is converted into estimated financial exposure a business can act on." },
              { stage: "RECOMMEND", text: "AURA compares defense strategies and recommends the one with the strongest return." },
            ].map((step, index, array) => (
              <div className="pipeline-node" key={step.stage}>
                <div className="pipeline-node-marker">
                  <span>{step.stage}</span>
                </div>
                <p>{step.text}</p>
                {index < array.length - 1 && <div className="pipeline-connector"></div>}
              </div>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="modules-showcase">
          <div className="showcase-heading">
            <div className="showcase-field-wrapper">
              <NeuralField nodeCount={80} />
            </div>
            <p className="module-page-eyebrow">INSIDE THE PLATFORM</p>
            <h2>EIGHT MODULES. ONE INTELLIGENCE CORE.</h2>
          </div>

          <div className="showcase-grid">
            {landingModules.map((module) => (
              <div
                key={module.id}
                className={`showcase-card ${module.featured ? "featured" : ""}`}
              >
                <h3>{module.title}</h3>
                <p>{module.desc}</p>
              </div>
            ))}
          </div>

          <button className="enter-button showcase-cta" onClick={() => setBooting(true)}>
            <span>INITIALIZE AURA</span>
            <span className="button-arrow">→</span>
          </button>
        </section>
      </RevealOnScroll>
      <footer className="landing-footer">
        <span>© 2026 AURA SENTINEL</span>
        <span>SIH26105</span>
        <span>LOCAL FIRST • INTELLIGENT • CONTINUOUS</span>
      </footer>

      {showFaceAuth && (
        <div className="face-auth-screen">
          <div className="face-auth-content">
            <p className="face-auth-kicker">AURA IDENTITY VERIFICATION</p>

            <div className="face-auth-frame">
              <video ref={videoRef} autoPlay muted playsInline className="face-auth-video" />
              <div className={`face-auth-ring ${faceAuthStage}`}></div>
            </div>

            <h2>
              {faceAuthStage === "loading" && "INITIALIZING CAMERA..."}
              {faceAuthStage === "enroll" && "NO FACE REGISTERED — LOOK AT CAMERA TO ENROLL"}
              {faceAuthStage === "scanning" && "SCANNING FACE..."}
              {faceAuthStage === "success" && "IDENTITY VERIFIED"}
              {faceAuthStage === "failed" && "CAMERA ACCESS DENIED"}
            </h2>

            <p className="face-auth-hint">
              {faceAuthStage === "enroll" && "This face will be saved as your AURA identity."}
              {faceAuthStage === "scanning" && "Hold still and look directly at the camera."}
              {faceAuthStage === "failed" && "Please allow camera access and try again."}
            </p>

            <div className="face-auth-actions">
              <button
                className="face-auth-cancel"
                onClick={() => {
                  stopFaceStream();
                  setShowFaceAuth(false);
                }}
              >
                CANCEL
              </button>

              <button className="face-auth-reset" onClick={resetFaceEnrollment}>
                RESET FACE ID
              </button>
            </div>
          </div>
        </div>
      )}

      {booting && (
        <div className="boot-screen">
          <div className="boot-content">
            <div className="boot-logo-wrapper">
              <div className="boot-ring"></div>
              <div className="boot-scanline"></div>
              <div className="boot-logo">AURA</div>
            </div>

            <div className="boot-status">
              {bootProgress < 25 && "INITIALIZING NEURAL CORE..."}
              {bootProgress >= 25 &&
                bootProgress < 50 &&
                "LOADING RISK INTELLIGENCE ENGINE..."}
              {bootProgress >= 50 &&
                bootProgress < 75 &&
                "CALIBRATING THREAT ANALYSIS SYSTEM..."}
              {bootProgress >= 75 &&
                bootProgress < 100 &&
                "ESTABLISHING SECURE CONNECTIONS..."}
              {bootProgress === 100 && "AURA SYSTEM ONLINE"}
            </div>

            <div className="boot-progress" style={{ "--boot-glow-width": `${bootProgress}%` }}>
              <div
                className="boot-progress-fill"
                style={{ width: `${bootProgress}%` }}
              ></div>
            </div>

            <div className="boot-percentage">
              {bootProgress}%
            </div>

            <div className="boot-logs">
              {[
                { label: "Neural interface", threshold: 15 },
                { label: "Risk intelligence", threshold: 35 },
                { label: "Threat analysis", threshold: 55 },
                { label: "Financial engine", threshold: 75 },
                { label: "System integrity", threshold: 95 },
              ].map((item) => {
                const isDone = bootProgress >= item.threshold;
                const isActive =
                  !isDone && bootProgress >= item.threshold - 20;

                return (
                  <p
                    key={item.label}
                    className={isDone ? "log-done" : isActive ? "log-active" : "log-pending"}
                  >
                    › {item.label} {".".repeat(Math.max(3, 24 - item.label.length))}{" "}
                    {isDone ? "ONLINE" : isActive ? "LOADING..." : "STANDBY"}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;