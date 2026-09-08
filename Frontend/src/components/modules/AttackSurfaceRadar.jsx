import React, { useRef, useEffect, useState, useCallback } from "react";
import { audioService } from "../../services/audioService";

const CATEGORY_COLORS = {
  "WEB / HTTP": { stroke: "#00f0ff", fill: "rgba(0, 240, 255, 0.2)", text: "#00f0ff" },
  "DATABASE": { stroke: "#a855f7", fill: "rgba(168, 85, 247, 0.2)", text: "#c084fc" },
  "CORE / INFRA": { stroke: "#10b981", fill: "rgba(16, 185, 129, 0.2)", text: "#34d399" },
  "USER / RPC": { stroke: "#f59e0b", fill: "rgba(245, 158, 11, 0.2)", text: "#fbbf24" },
  "HIGH RISK": { stroke: "#ef4444", fill: "rgba(239, 68, 68, 0.25)", text: "#f87171" },
};

function getPortCategory(port) {
  if ([80, 443, 3000, 5000, 5173, 8000, 8080].includes(port)) return "WEB / HTTP";
  if ([3306, 5432, 27017, 6379].includes(port)) return "DATABASE";
  if ([21, 22, 23, 25, 53, 110, 135, 139, 445].includes(port)) {
    return [23, 445, 135, 139].includes(port) ? "HIGH RISK" : "CORE / INFRA";
  }
  return "USER / RPC";
}

export default function AttackSurfaceRadar({ ports = [], selectedPort, onSelectPort }) {
  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const angleRef = useRef(0);
  const hoveredNodeRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [viewMode, setViewMode] = useState("radar"); // 'radar' | 'topology'

  // Pre-calculate node positions based on ports
  const nodes = ports.map((p, idx) => {
    const total = Math.max(ports.length, 1);
    const angle = (idx / total) * (Math.PI * 2) - Math.PI / 2;
    const cat = getPortCategory(p.port);
    
    // Distance from center: loopback inside, 0.0.0.0 middle, external outside
    let distFactor = 0.65;
    if (p.host === "127.0.0.1" || p.host === "::1" || p.host === "localhost") {
      distFactor = 0.45;
    } else if (p.host === "0.0.0.0" || p.host === "::") {
      distFactor = 0.72;
    } else {
      distFactor = 0.88;
    }

    return {
      ...p,
      category: cat,
      angle,
      distFactor,
      color: CATEGORY_COLORS[cat] || CATEGORY_COLORS["USER / RPC"],
    };
  });

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.92;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw Radar Background Grids
    ctx.strokeStyle = "rgba(0, 240, 255, 0.12)";
    ctx.lineWidth = 1;

    // Concentric Range Rings
    const rings = [0.25, 0.5, 0.75, 1.0];
    rings.forEach((rFactor, i) => {
      ctx.beginPath();
      ctx.arc(centerX, centerY, maxRadius * rFactor, 0, Math.PI * 2);
      ctx.stroke();

      // Range Label
      ctx.font = "9px 'JetBrains Mono', monospace";
      ctx.fillStyle = "rgba(0, 240, 255, 0.45)";
      const labels = ["ZONE 0 (CORE)", "ZONE 1 (LOOPBACK)", "ZONE 2 (BOUND 0.0.0.0)", "ZONE 3 (PERIMETER)"];
      ctx.fillText(labels[i], centerX + 8, centerY - maxRadius * rFactor + 12);
    });

    // Crosshairs
    ctx.beginPath();
    ctx.moveTo(centerX - maxRadius, centerY);
    ctx.lineTo(centerX + maxRadius, centerY);
    ctx.moveTo(centerX, centerY - maxRadius);
    ctx.lineTo(centerX, centerY + maxRadius);
    ctx.stroke();

    // Radial degree ticks
    for (let deg = 0; deg < 360; deg += 30) {
      const rad = (deg * Math.PI) / 180;
      const x1 = centerX + Math.cos(rad) * (maxRadius - 6);
      const y1 = centerY + Math.sin(rad) * (maxRadius - 6);
      const x2 = centerX + Math.cos(rad) * maxRadius;
      const y2 = centerY + Math.sin(rad) * maxRadius;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
      ctx.stroke();
    }

    // 2. Topology Connecting Web (if viewMode === 'topology')
    if (viewMode === "topology") {
      ctx.lineWidth = 0.8;
      nodes.forEach((n1, i) => {
        const x1 = centerX + Math.cos(n1.angle) * (maxRadius * n1.distFactor);
        const y1 = centerY + Math.sin(n1.angle) * (maxRadius * n1.distFactor);

        // Line to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x1, y1);
        ctx.strokeStyle = "rgba(0, 240, 255, 0.15)";
        ctx.stroke();

        // Connect neighbor
        if (i < nodes.length - 1) {
          const n2 = nodes[i + 1];
          const x2 = centerX + Math.cos(n2.angle) * (maxRadius * n2.distFactor);
          const y2 = centerY + Math.sin(n2.angle) * (maxRadius * n2.distFactor);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = "rgba(0, 240, 255, 0.08)";
          ctx.stroke();
        }
      });
    }

    // 3. Radar Sweep Line & Beam Gradient (if viewMode === 'radar')
    if (viewMode === "radar") {
      angleRef.current = (angleRef.current + 0.02) % (Math.PI * 2);
      const sweepAngle = angleRef.current;

      // Draw sweeping sector trail
      const trailAngle = 0.5; // ~28 degrees
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius
      );
      gradient.addColorStop(0, "rgba(0, 240, 255, 0.25)");
      gradient.addColorStop(1, "rgba(0, 240, 255, 0.0)");

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, maxRadius, sweepAngle - trailAngle, sweepAngle);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Main sweep ray
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(sweepAngle) * maxRadius,
        centerY + Math.sin(sweepAngle) * maxRadius
      );
      ctx.strokeStyle = "rgba(0, 240, 255, 0.85)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#00f0ff";
      ctx.shadowBlur = 10;
      ctx.stroke();
      ctx.restore();
    }

    // 4. Central Host Node
    ctx.save();
    ctx.shadowColor = "#00f0ff";
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 14, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(3, 8, 20, 0.95)";
    ctx.fill();
    ctx.strokeStyle = "#00f0ff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fillStyle = "#00f0ff";
    ctx.fill();
    ctx.restore();

    ctx.font = "8px 'JetBrains Mono', monospace";
    ctx.fillStyle = "#00f0ff";
    ctx.textAlign = "center";
    ctx.fillText("HOST", centerX, centerY + 26);

    // 5. Draw Port Blip Nodes
    nodes.forEach((node) => {
      const x = centerX + Math.cos(node.angle) * (maxRadius * node.distFactor);
      const y = centerY + Math.sin(node.angle) * (maxRadius * node.distFactor);
      const isHovered = hoveredNodeRef.current && hoveredNodeRef.current.port === node.port;
      const isSelected = selectedPort && selectedPort.port === node.port;

      ctx.save();
      if (isHovered || isSelected) {
        // Target lock-on brackets
        ctx.strokeStyle = "#00f0ff";
        ctx.lineWidth = 1.5;
        const s = 14;
        ctx.strokeRect(x - s, y - s, s * 2, s * 2);

        // Ping wave
        ctx.beginPath();
        ctx.arc(x, y, 16, 0, Math.PI * 2);
        ctx.strokeStyle = node.color.stroke;
        ctx.stroke();
      }

      // Outer glow circle
      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 8 : 5, 0, Math.PI * 2);
      ctx.fillStyle = node.color.fill;
      ctx.fill();
      ctx.strokeStyle = node.color.stroke;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = node.color.stroke;
      ctx.shadowBlur = isHovered ? 12 : 6;
      ctx.stroke();

      // Core point
      ctx.beginPath();
      ctx.arc(x, y, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.restore();

      // Port label
      ctx.font = isHovered ? "bold 10px 'JetBrains Mono', monospace" : "9px 'JetBrains Mono', monospace";
      ctx.fillStyle = isHovered ? "#ffffff" : node.color.text;
      ctx.textAlign = "left";
      ctx.fillText(`:${node.port}`, x + 10, y + 3);
    });

    animFrameRef.current = requestAnimationFrame(draw);
  }, [nodes, selectedPort, viewMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle high DPI
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(dpr, dpr);

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [draw]);

  // Handle Mouse Hover & Click over nodes
  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const maxRadius = Math.min(centerX, centerY) * 0.92;

    let found = null;
    for (const node of nodes) {
      const nx = centerX + Math.cos(node.angle) * (maxRadius * node.distFactor);
      const ny = centerY + Math.sin(node.angle) * (maxRadius * node.distFactor);
      const dist = Math.hypot(clientX - nx, clientY - ny);
      if (dist < 16) {
        found = { ...node, screenX: clientX, screenY: clientY };
        break;
      }
    }

    hoveredNodeRef.current = found;
    setHoveredNode(found);
  };

  const handleMouseLeave = () => {
    hoveredNodeRef.current = null;
    setHoveredNode(null);
  };

  const handleClick = () => {
    if (hoveredNode && onSelectPort) {
      audioService.playClick();
      onSelectPort(hoveredNode);
    }
  };

  return (
    <div className="attack-radar-container">
      <div className="radar-top-toolbar">
        <div className="radar-legend">
          <span className="legend-item web">
            <i className="legend-dot" style={{ backgroundColor: "#00f0ff" }}></i> WEB/HTTP
          </span>
          <span className="legend-item db">
            <i className="legend-dot" style={{ backgroundColor: "#a855f7" }}></i> DATABASE
          </span>
          <span className="legend-item infra">
            <i className="legend-dot" style={{ backgroundColor: "#10b981" }}></i> CORE/INFRA
          </span>
          <span className="legend-item user">
            <i className="legend-dot" style={{ backgroundColor: "#f59e0b" }}></i> USER/RPC
          </span>
        </div>

        <div className="radar-view-controls">
          <button
            className={`radar-view-btn ${viewMode === "radar" ? "active" : ""}`}
            onClick={() => {
              audioService.playClick();
              setViewMode("radar");
            }}
          >
            360° RADAR SWEEP
          </button>
          <button
            className={`radar-view-btn ${viewMode === "topology" ? "active" : ""}`}
            onClick={() => {
              audioService.playClick();
              setViewMode("topology");
            }}
          >
            TOPOLOGY MESH
          </button>
        </div>
      </div>

      <div className="radar-canvas-stage">
        <canvas
          ref={canvasRef}
          className="radar-canvas"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          style={{ width: "100%", height: "400px", cursor: hoveredNode ? "pointer" : "crosshair" }}
        />

        {hoveredNode && (
          <div
            className="radar-node-tooltip"
            style={{
              left: `${Math.min(hoveredNode.screenX + 16, 520)}px`,
              top: `${Math.max(hoveredNode.screenY - 30, 10)}px`,
            }}
          >
            <div className="tooltip-header">
              <span className="tooltip-port">PORT :{hoveredNode.port}</span>
              <span className="tooltip-cat" style={{ color: hoveredNode.color.text }}>
                {hoveredNode.category}
              </span>
            </div>
            <div className="tooltip-row">
              <span>BIND:</span> <strong>{hoveredNode.host}</strong>
            </div>
            <div className="tooltip-row">
              <span>PROCESS:</span> <strong>{hoveredNode.process}</strong>
            </div>
            <div className="tooltip-row">
              <span>PID:</span> <strong>{hoveredNode.pid || "SYSTEM"}</strong>
            </div>
            <div className="tooltip-action-hint">CLICK TO LOCK & INSPECT</div>
          </div>
        )}
      </div>

      <div className="radar-footer-telemetry">
        <span>DETECTED NODES: <strong>{ports.length}</strong></span>
        <span>RADAR RESOLUTION: <strong>0.02 RAD/FRAME</strong></span>
        <span>RADIAL FIELD: <strong>360° LOOPBACK + LAN</strong></span>
      </div>
    </div>
  );
}
