import React, { useState, useEffect, useRef } from "react";
import { MODULE_REGISTRY } from "../../constants/modules";
import { audioService } from "../../services/audioService";

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectModule,
  onTriggerAction,
}) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);

  const ACTIONS = [
    { id: "act-report", title: "Generate Executive PDF Audit Report", tag: "REPORT", action: "export-report", icon: "📑" },
    { id: "act-attack", title: "Trigger Stage Attack Simulation", tag: "SIMULATION", action: "simulate-attack", icon: "⚡" },
    { id: "act-scan", title: "Scan Directories for Exposures", tag: "SCAN", action: "run-scan", icon: "🔍" },
    { id: "act-voice", title: "Engage AURA Voice Assistant", tag: "VOICE", action: "open-voice", icon: "🎙" },
    { id: "act-sound", title: "Toggle Procedural Cyber Audio", tag: "SYSTEM", action: "toggle-sound", icon: "🔊" },
  ];

  const moduleItems = MODULE_REGISTRY.map((m) => ({
    id: `mod-${m.id}`,
    title: `Open Subsystem: ${m.name}`,
    tag: `MODULE ${m.number}`,
    moduleId: m.id,
    icon: m.icon,
  }));

  const allItems = [...ACTIONS, ...moduleItems];

  const filteredItems = allItems.filter((item) =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.tag.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
      audioService.playClick();
    }
  }, [isOpen]);

  const handleSelect = (item) => {
    audioService.playCommand();
    onClose();
    if (item.moduleId) {
      onSelectModule(item.moduleId);
    } else if (item.action) {
      onTriggerAction(item.action);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredItems.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
    } else if (e.key === "Enter" && filteredItems[selectedIndex]) {
      e.preventDefault();
      handleSelect(filteredItems[selectedIndex]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="cmd-palette-overlay" onClick={onClose}>
      <div className="cmd-palette-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cmd-palette-header">
          <span className="cmd-search-icon">⌘</span>
          <input
            ref={inputRef}
            type="text"
            className="cmd-search-input"
            placeholder="Type a command or search AURA subsystems..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <span className="cmd-shortcut-badge">ESC to close</span>
        </div>

        <div className="cmd-palette-results">
          {filteredItems.length === 0 ? (
            <div className="cmd-empty" style={{ padding: "20px", textAlign: "center", color: "var(--text-muted)", fontSize: "13px" }}>
              NO MATCHING COMMANDS FOUND
            </div>
          ) : (
            filteredItems.map((item, idx) => (
              <div
                key={item.id}
                className={`cmd-palette-item ${idx === selectedIndex ? "selected" : ""}`}
                onClick={() => handleSelect(item)}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div className="cmd-item-left">
                  <span className="cmd-item-icon">{item.icon}</span>
                  <span>{item.title}</span>
                </div>
                <span className="cmd-item-tag">{item.tag}</span>
              </div>
            ))
          )}
        </div>

        <div className="cmd-palette-footer">
          <span>↑↓ NAVIGATE</span>
          <span>↵ SELECT</span>
          <span>AURA COMMAND INTERFACE</span>
        </div>
      </div>
    </div>
  );
}
