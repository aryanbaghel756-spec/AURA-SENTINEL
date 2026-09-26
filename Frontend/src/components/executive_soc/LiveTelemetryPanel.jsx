import React, { useState, useMemo } from 'react';
import { 
  Radio, ShieldAlert, AlertTriangle, AlertCircle, Search, Filter, 
  ExternalLink, ArrowUpDown, DollarSign, Database, Server, Cloud 
} from 'lucide-react';
import { INITIAL_TELEMETRY } from './socData';

export default function LiveTelemetryPanel() {
  const [telemetry, setTelemetry] = useState(INITIAL_TELEMETRY);
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('exposure'); // 'exposure' | 'cvss'
  const [sortAsc, setSortAsc] = useState(false);

  // Filter and sort vulnerabilities
  const filteredData = useMemo(() => {
    return telemetry
      .filter((item) => {
        const matchesSeverity = severityFilter === 'ALL' || item.severity === severityFilter;
        const matchesSearch = 
          item.cve_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.asset_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.asset_name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSeverity && matchesSearch;
      })
      .sort((a, b) => {
        let valA = sortField === 'exposure' ? a.financial_exposure_crores : a.cvss_score;
        let valB = sortField === 'exposure' ? b.financial_exposure_crores : b.cvss_score;
        return sortAsc ? valA - valB : valB - valA;
      });
  }, [telemetry, severityFilter, searchQuery, sortField, sortAsc]);

  // Aggregate metrics
  const totalExposure = useMemo(() => {
    return telemetry.reduce((sum, item) => sum + item.financial_exposure_crores, 0);
  }, [telemetry]);

  const criticalCount = telemetry.filter(t => t.severity === 'CRITICAL').length;
  const highCount = telemetry.filter(t => t.severity === 'HIGH').length;
  const mediumCount = telemetry.filter(t => t.severity === 'MEDIUM').length;

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="bg-[#16213A] border border-[#1F2E4D] rounded-xl p-6 relative overflow-hidden shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-[#1F2E4D]">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span>Vulnerability Telemetry Translation // CVSS to FAIR Financial Exposure</span>
            </div>
            <h1 className="text-white text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2">
              <Radio className="w-6 h-6 text-cyan-400" />
              Live Telemetry & Financial Exposure Feed
            </h1>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl leading-relaxed">
              Standard CVSS scores only measure technical severity. AURA Sentinel bridges technical threat telemetry 
              with asset valuation to compute actuarial ₹ Rupee financial loss exposure side by side.
            </p>
          </div>

          {/* TOTAL EXPOSURE CALLOUT */}
          <div className="bg-[#0B1220] border border-cyan-500/30 rounded-xl px-6 py-4 flex flex-col items-start lg:items-end justify-center min-w-[260px]">
            <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">
              Total Quantified Exposure
            </span>
            <div className="flex items-baseline space-x-2 mt-1">
              <span className="text-cyan-400 font-extrabold text-3xl tracking-tight">
                ₹{totalExposure.toFixed(2)}
              </span>
              <span className="text-slate-300 text-lg font-semibold">Crores</span>
            </div>
            <span className="text-slate-400 text-xs mt-1">
              Across {telemetry.length} ingested vulnerability vectors
            </span>
          </div>
        </div>

        {/* 3 AGGREGATE SUMMARY PILLS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-[#0B1220]/70 p-4 rounded-lg border border-rose-500/20 flex items-center justify-between">
            <div>
              <span className="text-rose-400 text-xs font-semibold uppercase tracking-wider block">Critical Severity</span>
              <span className="text-white font-bold text-2xl mt-0.5 block">{criticalCount} Flaws</span>
              <span className="text-slate-400 text-xs">CVSS 9.0 – 10.0</span>
            </div>
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30">
              <ShieldAlert className="w-6 h-6 text-rose-400" />
            </div>
          </div>

          <div className="bg-[#0B1220]/70 p-4 rounded-lg border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="text-amber-400 text-xs font-semibold uppercase tracking-wider block">High Severity</span>
              <span className="text-white font-bold text-2xl mt-0.5 block">{highCount} Flaws</span>
              <span className="text-slate-400 text-xs">CVSS 7.0 – 8.9</span>
            </div>
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
          </div>

          <div className="bg-[#0B1220]/70 p-4 rounded-lg border border-cyan-500/20 flex items-center justify-between">
            <div>
              <span className="text-cyan-400 text-xs font-semibold uppercase tracking-wider block">Medium Severity</span>
              <span className="text-white font-bold text-2xl mt-0.5 block">{mediumCount} Flaws</span>
              <span className="text-slate-400 text-xs">CVSS 4.0 – 6.9</span>
            </div>
            <div className="p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
              <AlertCircle className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div className="bg-[#16213A] border border-[#1F2E4D] rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by CVE, asset, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0B1220] border border-[#1F2E4D] rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Severity Filter Buttons */}
        <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`py-1.5 px-3 rounded-lg text-xs font-semibold border transition-all ${
                severityFilter === sev 
                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' 
                  : 'bg-[#0B1220] border-[#1F2E4D] text-slate-400 hover:text-white'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* TELEMETRY TABLE */}
      <div className="bg-[#16213A] border border-[#1F2E4D] rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0B1220]/90 text-slate-400 uppercase tracking-wider text-[11px] border-b border-[#1F2E4D]">
                <th className="py-3 px-4">CVE ID & Vulnerability</th>
                <th className="py-3 px-4">Target Asset & Value</th>
                <th className="py-3 px-4">Severity</th>
                <th 
                  className="py-3 px-4 text-center cursor-pointer hover:text-white"
                  onClick={() => toggleSort('cvss')}
                >
                  <div className="flex items-center justify-center gap-1">
                    CVSS 3.1
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">EPSS Prob</th>
                <th 
                  className="py-3 px-4 text-right cursor-pointer hover:text-white"
                  onClick={() => toggleSort('exposure')}
                >
                  <div className="flex items-center justify-end gap-1 text-cyan-300 font-bold">
                    ₹ Financial Exposure
                    <ArrowUpDown className="w-3 h-3 text-cyan-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Remediation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F2E4D]">
              {filteredData.map((item) => {
                const isCritical = item.severity === 'CRITICAL';
                const isHigh = item.severity === 'HIGH';

                return (
                  <tr 
                    key={item.cve_id}
                    className="hover:bg-[#1E2D4F]/50 transition-colors"
                  >
                    {/* CVE & Title */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-cyan-300 text-xs bg-[#0B1220] py-0.5 px-2 rounded border border-[#1F2E4D]">
                          {item.cve_id}
                        </span>
                        <span className="text-[11px] text-slate-400">{item.published_date}</span>
                      </div>
                      <div className="font-medium text-white text-xs mt-1 leading-snug">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5 italic">
                        {item.mitigation}
                      </div>
                    </td>

                    {/* Target Asset */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-semibold text-white text-xs flex items-center gap-1.5">
                        <Server className="w-3.5 h-3.5 text-cyan-400" />
                        {item.asset_id}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.asset_name}
                      </div>
                      <div className="text-[10px] text-emerald-400/90 font-mono mt-0.5">
                        Asset Value: ₹{item.asset_value_crores.toFixed(0)} Cr • {item.asset_tier}
                      </div>
                    </td>

                    {/* Severity Badge */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 py-1 px-2.5 rounded-full text-[11px] font-bold border ${
                        isCritical 
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40' 
                          : isHigh 
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                      }`}>
                        {item.severity}
                      </span>
                    </td>

                    {/* CVSS Score */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono font-bold text-sm">
                      <span className={isCritical ? 'text-rose-400' : isHigh ? 'text-amber-400' : 'text-cyan-400'}>
                        {item.cvss_score.toFixed(1)}
                      </span>
                    </td>

                    {/* EPSS Score */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap font-mono text-xs text-slate-300">
                      {(item.epss_prob * 100).toFixed(1)}%
                    </td>

                    {/* Translated ₹ Loss Exposure */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold text-sm">
                      <div className="text-cyan-400 font-extrabold text-base">
                        ₹{item.financial_exposure_crores.toFixed(2)} Cr
                      </div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        (₹{(item.financial_exposure_crores * 100).toFixed(0)} Lakhs)
                      </div>
                    </td>

                    {/* Remediation Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-slate-300 bg-[#0B1220] py-1 px-2.5 rounded text-[11px] font-medium border border-[#1F2E4D]">
                        {item.remediation_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
