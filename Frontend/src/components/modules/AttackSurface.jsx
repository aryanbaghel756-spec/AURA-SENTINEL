import React, { useState, useEffect } from "react";
import { api } from "../../services/api";
import AttackSurfaceRadar from "./AttackSurfaceRadar";
import { audioService } from "../../services/audioService";

export default function AttackSurface() {
  const [attackData, setAttackData] = useState(null);
  const [attackError, setAttackError] = useState("");
  const [portFilter, setPortFilter] = useState("");
  const [selectedPort, setSelectedPort] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAttack = async () => {
      try {
        const data = await api.getAttackSurface();
        if (!isMounted) return;
        setAttackData(data);
        setAttackError("");
      } catch {
        if (!isMounted) return;
        setAttackError("ATTACK SURFACE ANALYSIS UNAVAILABLE");
      }
    };

    fetchAttack();
    const interval = setInterval(fetchAttack, 3000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const getPortCategory = (port) => {
    if ([80, 443, 3000, 5000, 5173, 8000, 8080].includes(port)) return "WEB / HTTP";
    if ([3306, 5432, 27017, 6379].includes(port)) return "DATABASE";
    if ([21, 22, 23, 25, 53, 110, 135, 139, 445].includes(port)) return "CORE / INFRA";
    return "USER / RPC";
  };

  const handleSelectPortFromRadar = (portObj) => {
    setSelectedPort(portObj);
    audioService.playCommand();
  };

  const handleClearSelectedPort = () => {
    setSelectedPort(null);
    audioService.playClick();
  };

  const filteredPorts = attackData
    ? attackData.ports.filter((p) => {
        if (selectedPort && p.port !== selectedPort.port) return false;
        return (
          String(p.port).includes(portFilter) ||
          p.process.toLowerCase().includes(portFilter.toLowerCase()) ||
          p.host.includes(portFilter)
        );
      })
    : [];

  return (
    <main className="attack-dashboard">
      <div className="attack-title-section">
        <div>
          <p className="module-page-eyebrow">AURA SENTINEL / LOCAL EXPOSURE ANALYSIS</p>
          <h1>ATTACK SURFACE</h1>
          <p className="attack-description">
            Continuous reconnaissance of local listening network daemons and unauthorized service exposure with interactive 360° radar telemetry.
          </p>
        </div>

        <div className="scan-status">
          <span className="pulse-indicator"></span>
          ACTIVE RADAR (3s)
        </div>
      </div>

      {attackError ? (
        <div className="connection-error">{attackError}</div>
      ) : !attackData ? (
        <div className="loading-system">
          <div className="module-loader"></div>
          SCANNING LOCAL SOCKETS & BOUND PORTS...
        </div>
      ) : (
        <>
          <section className="attack-summary-grid">
            <div className="attack-summary-card">
              <span className="summary-label">TOTAL LISTENING PORTS</span>
              <strong className="summary-value">{attackData.total_open_ports}</strong>
              <p>Active sockets awaiting incoming connections.</p>
            </div>

            <div className="attack-summary-card">
              <span className="summary-label">NETWORK EXPOSURE LEVEL</span>
              <strong
                className={`summary-value ${
                  attackData.total_open_ports > 10
                    ? "exposure-high"
                    : attackData.total_open_ports > 5
                    ? "exposure-medium"
                    : "exposure-low"
                }`}
              >
                {attackData.total_open_ports > 10
                  ? "HIGH EXPOSURE"
                  : attackData.total_open_ports > 5
                  ? "MODERATE EXPOSURE"
                  : "LOW EXPOSURE"}
              </strong>
              <p>Derived from total exposed service surface.</p>
            </div>

            <div className="attack-summary-card">
              <span className="summary-label">INSPECTION SCOPE</span>
              <strong className="summary-value exposure-low">KERNEL LOOPBACK</strong>
              <p>Host localhost and bound IP sockets only.</p>
            </div>
          </section>

          {/* Interactive Radar Visualizer */}
          <section className="attack-radar-section">
            <div className="section-title-bar">
              <div>
                <span className="process-eyebrow">TOPOLOGY VISUALIZATION</span>
                <h2>PERIMETER RADAR SCANNER</h2>
              </div>
              {selectedPort && (
                <button className="clear-filter-btn" onClick={handleClearSelectedPort}>
                  SHOW ALL PORTS (LOCKED ON :{selectedPort.port}) ✕
                </button>
              )}
            </div>

            <AttackSurfaceRadar
              ports={attackData.ports}
              selectedPort={selectedPort}
              onSelectPort={handleSelectPortFromRadar}
            />
          </section>

          {/* Sockets Table */}
          <section className="port-intelligence">
            <div className="port-header">
              <div>
                <span className="process-eyebrow">SERVICE RECONNAISSANCE</span>
                <h2>OPEN SOCKETS & ACTIVE SERVICES</h2>
              </div>

              <div className="port-controls">
                <input
                  type="text"
                  placeholder="Filter by port, host, or process..."
                  value={portFilter}
                  onChange={(e) => setPortFilter(e.target.value)}
                  className="soc-search-input"
                />
                <div className="port-refresh">AUTO REFRESH: 3 SEC</div>
              </div>
            </div>

            <div className="port-table-wrapper">
              <table className="port-table">
                <thead>
                  <tr>
                    <th>PORT NUMBER</th>
                    <th>CATEGORY</th>
                    <th>BIND ADDRESS</th>
                    <th>OWNING PROCESS</th>
                    <th>PID</th>
                    <th>SOCKET STATE</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredPorts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-ports">
                        {portFilter || selectedPort
                          ? "NO PORTS MATCH YOUR FILTER CRITERIA"
                          : "NO LISTENING PORTS DETECTED"}
                      </td>
                    </tr>
                  ) : (
                    filteredPorts.map((port, index) => {
                      const isHighlighted = selectedPort && selectedPort.port === port.port;
                      return (
                        <tr
                          key={`${port.port}-${port.pid}-${index}`}
                          className={isHighlighted ? "selected-port-row" : ""}
                          onClick={() => handleSelectPortFromRadar(port)}
                          style={{ cursor: "pointer" }}
                        >
                          <td className="port-number">
                            <span className="port-pill">{port.port}</span>
                          </td>
                          <td>
                            <span className="port-cat-badge">{getPortCategory(port.port)}</span>
                          </td>
                          <td className="port-host">{port.host}</td>
                          <td className="port-process">{port.process}</td>
                          <td className="process-pid">{port.pid || "KERNEL"}</td>
                          <td>
                            <span className="listening-status">
                              <i className="status-dot"></i>
                              {port.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </main>
  );
}
