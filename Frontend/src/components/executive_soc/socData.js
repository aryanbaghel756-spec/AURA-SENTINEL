// =============================================================
// AURA SENTINEL — EXECUTIVE SOC CONSOLE SEEDED DATA & ALGORITHMS
// SIH 2026 — Problem Statement SIH26105
// =============================================================

// 1. SECURITY CONTROLS FOR KNAPSACK OPTIMIZATION (~10 Enterprise Controls)
export const INITIAL_CONTROLS = [
  {
    id: "CTRL-01",
    name: "MFA & Privileged Access Management (PAM)",
    category: "Identity & Access",
    cost_lakhs: 35.0,
    risk_reduction_lakhs: 280.0,
    description: "Hardware security keys and zero-standing-privilege bastion host for tier-1 admins.",
    nist_mapping: "AC-2, IA-2"
  },
  {
    id: "CTRL-02",
    name: "Next-Gen EDR & XDR Endpoint Fleet",
    category: "Endpoint Defense",
    cost_lakhs: 65.0,
    risk_reduction_lakhs: 420.0,
    description: "Kernel-level behavioral telemetry and automated quarantine on 1,500 enterprise workstations.",
    nist_mapping: "SI-4, SI-7"
  },
  {
    id: "CTRL-03",
    name: "Cloud Micro-Segmentation & WAF",
    category: "Cloud & Network",
    cost_lakhs: 45.0,
    risk_reduction_lakhs: 310.0,
    description: "East-west network policy enforcement and OWASP Top 10 automated request blocking.",
    nist_mapping: "SC-7, AC-4"
  },
  {
    id: "CTRL-04",
    name: "Immutable Air-Gapped Ransomware Backups",
    category: "Business Continuity",
    cost_lakhs: 50.0,
    risk_reduction_lakhs: 380.0,
    description: "WORM (Write Once Read Many) AWS S3 object-locked storage with 15-minute recovery RTO.",
    nist_mapping: "CP-9, CP-10"
  },
  {
    id: "CTRL-05",
    name: "Zero Trust Network Access (ZTNA) Gateway",
    category: "Perimeter & Network",
    cost_lakhs: 40.0,
    risk_reduction_lakhs: 240.0,
    description: "Replaces legacy VPN with contextual micro-tunnels and device health posture validation.",
    nist_mapping: "AC-17, SC-8"
  },
  {
    id: "CTRL-06",
    name: "Automated Patch & Vulnerability Pipeline",
    category: "Vulnerability Ops",
    cost_lakhs: 25.0,
    risk_reduction_lakhs: 190.0,
    description: "Automated staging and deployment of high/critical OS and software kernel patches within 48h.",
    nist_mapping: "SI-2, RA-5"
  },
  {
    id: "CTRL-07",
    name: "AI Behavioral Phishing Simulation",
    category: "Human Layer",
    cost_lakhs: 15.0,
    risk_reduction_lakhs: 120.0,
    description: "Adaptive simulated spear-phishing campaigns targeting high-risk corporate departments.",
    nist_mapping: "AT-2, AT-3"
  },
  {
    id: "CTRL-08",
    name: "24/7 Managed SOC Telemetry & Threat Hunting",
    category: "Security Operations",
    cost_lakhs: 70.0,
    risk_reduction_lakhs: 450.0,
    description: "Continuous event log correlation, SIEM threat detection rules, and proactive threat actor hunts.",
    nist_mapping: "IR-4, SI-4"
  },
  {
    id: "CTRL-09",
    name: "API Security Shield & Token Rate Limiting",
    category: "Application Security",
    cost_lakhs: 30.0,
    risk_reduction_lakhs: 210.0,
    description: "Machine-learning inspection of REST/GraphQL calls detecting token abuse and payload injections.",
    nist_mapping: "SC-8, AC-3"
  },
  {
    id: "CTRL-10",
    name: "Data Loss Prevention (DLP) & Cloud Encryption",
    category: "Data Protection",
    cost_lakhs: 35.0,
    risk_reduction_lakhs: 220.0,
    description: "Automated classification of PII/financial data and client-side envelope encryption.",
    nist_mapping: "SC-13, SC-28"
  }
];

// 2. VULNERABILITY TELEMETRY FEED (CVSS vs Translated ₹ Loss Exposure)
export const INITIAL_TELEMETRY = [
  {
    cve_id: "CVE-2026-2189",
    title: "OpenSSL ASN.1 Parsing Heap Overflow (RCE)",
    asset_id: "prod-core-db-01",
    asset_name: "Primary Transaction Ledger DB",
    asset_tier: "Tier-1 Mission Critical",
    asset_value_crores: 45.0,
    environment: "AWS Mumbai (ap-south-1)",
    severity: "CRITICAL",
    cvss_score: 9.8,
    epss_prob: 0.884,
    financial_exposure_crores: 4.25,
    remediation_status: "Active Remediation",
    published_date: "2026-09-21",
    mitigation: "Isolate port 443; apply OpenSSL v3.4.2 hotfix patch."
  },
  {
    cve_id: "CVE-2026-3412",
    title: "Active Directory Kerberos Privilege Escalation",
    asset_id: "ad-dc-primary",
    asset_name: "Enterprise Domain Controller",
    asset_tier: "Tier-1 Mission Critical",
    asset_value_crores: 35.0,
    environment: "On-Premise HQ Datacenter",
    severity: "HIGH",
    cvss_score: 8.8,
    epss_prob: 0.742,
    financial_exposure_crores: 2.80,
    remediation_status: "Patch Scheduled",
    published_date: "2026-09-18",
    mitigation: "Enable PAC validation enforcement and rotate KRBTGT keys."
  },
  {
    cve_id: "CVE-2026-1904",
    title: "Spring Framework Remote Object Deserialization",
    asset_id: "payment-gw-cluster",
    asset_name: "UPI & Card Payment Gateway Cluster",
    asset_tier: "Tier-1 Mission Critical",
    asset_value_crores: 30.0,
    environment: "Kubernetes Ingress (K8s)",
    severity: "HIGH",
    cvss_score: 8.5,
    epss_prob: 0.658,
    financial_exposure_crores: 2.10,
    remediation_status: "Active Remediation",
    published_date: "2026-09-15",
    mitigation: "Upgrade Spring Boot starter dependencies to 3.3.4."
  },
  {
    cve_id: "CVE-2026-4021",
    title: "Kubernetes API Server RBAC Misconfiguration",
    asset_id: "k8s-mgmt-master",
    asset_name: "Production Container Orchestrator",
    asset_tier: "Tier-2 Operational",
    asset_value_crores: 20.0,
    environment: "GCP Cloud (asia-south1)",
    severity: "HIGH",
    cvss_score: 7.9,
    epss_prob: 0.512,
    financial_exposure_crores: 1.45,
    remediation_status: "Active Remediation",
    published_date: "2026-09-12",
    mitigation: "Revoke default cluster-admin bindings on public service accounts."
  },
  {
    cve_id: "CVE-2026-5190",
    title: "Redis Cache Unauthenticated Memory Read",
    asset_id: "cache-session-node",
    asset_name: "User Session & Token Cache",
    asset_tier: "Tier-2 Operational",
    asset_value_crores: 15.0,
    environment: "AWS Mumbai (ap-south-1)",
    severity: "HIGH",
    cvss_score: 7.2,
    epss_prob: 0.395,
    financial_exposure_crores: 0.95,
    remediation_status: "Mitigated",
    published_date: "2026-09-08",
    mitigation: "Bind Redis to 127.0.0.1; enforce ACL AUTH passwords."
  },
  {
    cve_id: "CVE-2026-1102",
    title: "Log4j2 Recursive Lookup Edge Case",
    asset_id: "legacy-reporting-srv",
    asset_name: "Internal BI Analytics Service",
    asset_tier: "Tier-3 Internal Non-Prod",
    asset_value_crores: 8.0,
    environment: "On-Premise Private Subnet",
    severity: "MEDIUM",
    cvss_score: 6.8,
    epss_prob: 0.225,
    financial_exposure_crores: 0.45,
    remediation_status: "Under Review",
    published_date: "2026-09-04",
    mitigation: "Set formatMsgNoLookups=true and upgrade log4j jar."
  },
  {
    cve_id: "CVE-2026-2287",
    title: "Postfix Mail Server Queue Injection",
    asset_id: "mail-relay-internal",
    asset_name: "Corporate Notification Relay",
    asset_tier: "Tier-3 Internal Non-Prod",
    asset_value_crores: 5.0,
    environment: "Hybrid Edge Relay",
    severity: "MEDIUM",
    cvss_score: 6.5,
    epss_prob: 0.180,
    financial_exposure_crores: 0.65,
    remediation_status: "Patch Scheduled",
    published_date: "2026-08-30",
    mitigation: "Sanitize internal envelope headers and restrict relay access."
  },
  {
    cve_id: "CVE-2026-7834",
    title: "Nginx TLS Cipher Downgrade Opportunity",
    asset_id: "edge-waf-proxy-01",
    asset_name: "External Load Balancer & WAF",
    asset_tier: "Tier-2 Operational",
    asset_value_crores: 12.0,
    environment: "Cloudflare / AWS Cloud",
    severity: "MEDIUM",
    cvss_score: 5.3,
    epss_prob: 0.092,
    financial_exposure_crores: 0.25,
    remediation_status: "Mitigated",
    published_date: "2026-08-25",
    mitigation: "Disable TLS 1.0/1.1; enforce strict HSTS and ECDHE ciphers."
  }
];

// 3. PURE JS SHA-256 HASH FUNCTION (Zero External Dependencies)
export function sha256Sync(ascii) {
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';

  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  
  let hash = [];
  const k = [];

  let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1/3) * maxWord) | 0;
    }
  }

  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return;
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);

  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, j += 16);
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const i2 = i + j;
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));

      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (j = 3; j + 1; j--) {
      const b = (hash[i] >> (j * 8)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

// Helper to construct seeded Merkle blocks
export function buildInitialBlocks() {
  const blocksMeta = [
    {
      index: 1040,
      timestamp: "2026-09-25T10:00:00Z",
      action: "Genesis Anchor: Enterprise Risk Baseline Committed",
      payload: { baseline_assets: 142, initial_var_cr: 16.4, scope: "Global SIH26105" },
      prevHash: "0000000000000000000000000000000000000000000000000000000000000000"
    },
    {
      index: 1041,
      timestamp: "2026-09-25T14:15:22Z",
      action: "Vulnerability Ingestion: CVE-2026-2189 Ingested on prod-db",
      payload: { cve: "CVE-2026-2189", cvss: 9.8, loss_crores: 4.25, engine: "Nessus/Qualys Feed" }
    },
    {
      index: 1042,
      timestamp: "2026-09-25T18:40:10Z",
      action: "FAIR Engine: 10,000 Monte Carlo Iteration Distribution Sealed",
      payload: { runs: 10000, confidence: 0.95, calculated_var_cr: 14.82, distribution: "lognormal" }
    },
    {
      index: 1043,
      timestamp: "2026-09-26T02:10:05Z",
      action: "Board Risk Register Snapshot: Value-at-Risk State Frozen",
      payload: { target_confidence: "95%", var_crores: 14.82, ale_crores: 5.64, currency: "INR" }
    },
    {
      index: 1044,
      timestamp: "2026-09-26T08:30:45Z",
      action: "Budget Optimizer: 0/1 Knapsack Solution Computed (Budget: ₹150 Lakhs)",
      payload: { budget_lakhs: 150.0, funded_controls: 4, risk_reduction_lakhs: 1020.0, roi_multiple: 7.03 }
    },
    {
      index: 1045,
      timestamp: "2026-09-26T12:00:15Z",
      action: "Control Policy Enacted: MFA & Privileged Access Management Locked",
      payload: { control_id: "CTRL-01", expenditure_lakhs: 35.0, status: "FUNDED_APPROVED" }
    },
    {
      index: 1046,
      timestamp: "2026-09-26T15:20:00Z",
      action: "Regulatory Compliance Snapshot: DPDP Act 2023 Telemetry Anchored",
      payload: { mandate: "DPDP-2023-Sec8", pii_encryption_status: "100%_Compliant", dpo_signed: true }
    },
    {
      index: 1047,
      timestamp: "2026-09-26T21:10:00Z",
      action: "CERT-In Audit Log State Proof Stamped",
      payload: { directions: "CERT-In 70B", retention_mode: "Immutable Append-Only", hash_type: "SHA-256" }
    }
  ];

  const blocks = [];
  for (let i = 0; i < blocksMeta.length; i++) {
    const meta = blocksMeta[i];
    const prevHash = i === 0 ? meta.prevHash : blocks[i - 1].current_hash;
    const dataHash = sha256Sync(JSON.stringify(meta.payload));
    const rawHeader = `${meta.index}|${meta.timestamp}|${meta.action}|${dataHash}|${prevHash}`;
    const currentHash = sha256Sync(rawHeader);

    blocks.push({
      index: meta.index,
      timestamp: meta.timestamp,
      action: meta.action,
      data_hash: dataHash,
      previous_hash: prevHash,
      current_hash: currentHash,
      payload: meta.payload
    });
  }
  return blocks;
}

// 4. CLIENT-SIDE 0/1 KNAPSACK OPTIMIZER
export function runKnapsackOptimization(budgetLakhs, controls = INITIAL_CONTROLS) {
  const budget = Math.round(budgetLakhs);
  const n = controls.length;
  const costs = controls.map(c => Math.round(c.cost_lakhs));
  const values = controls.map(c => c.risk_reduction_lakhs);

  // 2D DP Table
  const dp = Array.from({ length: n + 1 }, () => new Array(budget + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const cost = costs[i - 1];
    const val = values[i - 1];
    for (let w = 0; w <= budget; w++) {
      if (cost <= w) {
        dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - cost] + val);
      } else {
        dp[i][w] = dp[i - 1][w];
      }
    }
  }

  // Backtrack funded items
  let w = budget;
  const fundedIds = new Set();
  for (let i = n; i > 0; i--) {
    if (dp[i][w] !== dp[i - 1][w]) {
      fundedIds.add(controls[i - 1].id);
      w -= costs[i - 1];
    }
  }

  let allocatedCost = 0;
  let totalRiskReduction = 0;

  const resultControls = controls.map(c => {
    const isFunded = fundedIds.has(c.id);
    if (isFunded) {
      allocatedCost += c.cost_lakhs;
      totalRiskReduction += c.risk_reduction_lakhs;
    }
    const eff = parseFloat((c.risk_reduction_lakhs / c.cost_lakhs).toFixed(2));
    return {
      ...c,
      funded: isFunded,
      status: isFunded ? "FUNDED" : "DEFERRED",
      efficiency_ratio: eff
    };
  });

  const roiMultiple = allocatedCost > 0 ? parseFloat((totalRiskReduction / allocatedCost).toFixed(2)) : 0.0;

  return {
    budget_lakhs: budgetLakhs,
    allocated_cost_lakhs: parseFloat(allocatedCost.toFixed(1)),
    unallocated_budget_lakhs: parseFloat(Math.max(0, budgetLakhs - allocatedCost).toFixed(1)),
    total_risk_reduction_lakhs: parseFloat(totalRiskReduction.toFixed(1)),
    total_risk_reduction_crores: parseFloat((totalRiskReduction / 100.0).toFixed(2)),
    roi_multiple: roiMultiple,
    funded_count: fundedIds.size,
    total_controls: n,
    controls: resultControls
  };
}

// 5. CLIENT-SIDE MONTE CARLO FAIR ENGINE (10,000 LOGNORMAL PATHS)
export function runMonteCarloSimulation(tefMean = 14.0, sleMedianLakhs = 48.0, nSims = 10000, targetConfidence = 0.95) {
  // Lognormal parameter derivation from median SLE
  const mu = Math.log(sleMedianLakhs);
  const sigma = 1.05; // Industry standard geometric dispersion for cyber risk losses

  // Box-Muller normal transform
  function randomNormal() {
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  }

  const annualLosses = new Float64Array(nSims);
  let totalLossSum = 0;

  for (let i = 0; i < nSims; i++) {
    // Poisson sampling for annual threat events
    let events = 0;
    let p = 1.0;
    const L = Math.exp(-tefMean);
    while (p > L) {
      events++;
      p *= Math.random();
    }
    const eventCount = Math.max(0, events - 1);

    let simLoss = 0.0;
    for (let e = 0; e < eventCount; e++) {
      const z = randomNormal();
      const loss = Math.exp(mu + sigma * z);
      simLoss += loss;
    }
    annualLosses[i] = simLoss;
    totalLossSum += simLoss;
  }

  annualLosses.sort();

  const idxVaR = Math.min(nSims - 1, Math.floor(targetConfidence * nSims));
  const varLakhs = annualLosses[idxVaR];
  const varCrores = parseFloat((varLakhs / 100.0).toFixed(2));

  const aleLakhs = totalLossSum / nSims;
  const aleCrores = parseFloat((aleLakhs / 100.0).toFixed(2));

  // Compute Loss Exceedance Curve (LEC) with 25 sampling buckets
  const maxLoss = annualLosses[nSims - 1] || 1;
  const curvePoints = [];
  const buckets = 28;
  const step = maxLoss / (buckets - 1);

  for (let b = 0; b < buckets; b++) {
    const threshold = b * step;
    let exceedCount = 0;
    for (let i = 0; i < nSims; i++) {
      if (annualLosses[i] >= threshold) exceedCount++;
    }
    const prob = parseFloat(((exceedCount / nSims) * 100.0).toFixed(1));
    curvePoints.append ? null : curvePoints.push({
      loss_crores: parseFloat((threshold / 100.0).toFixed(2)),
      loss_lakhs: parseFloat(threshold.toFixed(1)),
      probability: prob,
      varThreshold: Math.abs((threshold / 100.0) - varCrores) < (maxLoss / 100.0 / buckets)
    });
  }

  return {
    iterations: nSims,
    confidence_level: Math.round(targetConfidence * 100),
    var_crores: varCrores,
    var_lakhs: parseFloat(varLakhs.toFixed(1)),
    ale_crores: aleCrores,
    ale_lakhs: parseFloat(aleLakhs.toFixed(1)),
    tef_mean: tefMean,
    sle_median_lakhs: sleMedianLakhs,
    curve: curvePoints
  };
}
