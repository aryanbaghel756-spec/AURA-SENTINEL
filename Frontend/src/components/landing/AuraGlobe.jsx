import { useEffect, useRef } from "react";

export default function AuraGlobe({ paused = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || paused) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrame;
    let width = 0;
    let height = 0;
    let angleY = 0;
    const angleX = 0.4;
    let time = 0;

    const latLines = 9;
    const lonLines = 14;
    const segmentsPerLine = 36;
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

    const nodeCount = 32;
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
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
          const opacity = Math.max(0, (p.z + 1) / 2) * 0.32;
          if (i === 0) {
            ctx.moveTo(p.x, p.y);
          } else {
            ctx.lineTo(p.x, p.y);
          }
          ctx.strokeStyle = `rgba(0, 229, 255, ${opacity})`;
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
            const opacity = (1 - dist / (width * 0.16)) * 0.35 * Math.max(0, (a.p.z + 1) / 2);
            ctx.strokeStyle = `rgba(80, 190, 255, ${opacity})`;
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
        ctx.arc(p.x, p.y, 2.4 * p.perspective, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${opacity})`;
        ctx.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
    };
  }, [paused]);

  return <canvas ref={canvasRef} className="aura-globe-canvas" />;
}
