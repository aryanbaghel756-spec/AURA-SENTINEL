"""
AURA SENTINEL - Threat Intelligence & Heuristic Signatures Catalog
"""

HIGH_RISK_PORTS = {
    21: {
        "service": "FTP",
        "risk": "HIGH",
        "description": "Cleartext file transfer protocol vulnerable to credential interception.",
        "remediation": "Migrate to SFTP (port 22) or FTPS with TLS encryption.",
    },
    23: {
        "service": "Telnet",
        "risk": "CRITICAL",
        "description": "Legacy unencrypted remote terminal protocol vulnerable to packet sniffing.",
        "remediation": "Disable Telnet daemon immediately. Utilize SSH with key-based authentication.",
    },
    135: {
        "service": "MS-RPC",
        "risk": "HIGH",
        "description": "Microsoft RPC endpoint mapper frequently targeted for lateral movement.",
        "remediation": "Restrict RPC access using Windows Defender Firewall rules.",
    },
    139: {
        "service": "NetBIOS",
        "risk": "HIGH",
        "description": "Legacy NetBIOS session service susceptible to network enumeration.",
        "remediation": "Disable NetBIOS over TCP/IP in network adapter properties.",
    },
    445: {
        "service": "SMB",
        "risk": "CRITICAL",
        "description": "Server Message Block service; high-value target for ransomware (e.g. WannaCry/EternalBlue).",
        "remediation": "Block inbound port 445 on public perimeters and enforce SMBv3 signing.",
    },
    3389: {
        "service": "RDP",
        "risk": "HIGH",
        "description": "Remote Desktop Protocol exposed to internet brute-force and credential stuffing.",
        "remediation": "Enforce Network Level Authentication (NLA), VPN tunneling, and rate-limiting.",
    },
    5900: {
        "service": "VNC",
        "risk": "HIGH",
        "description": "Virtual Network Computing desktop sharing with weak authentication.",
        "remediation": "Tunnel VNC sessions over encrypted SSH tunnels.",
    },
    6379: {
        "service": "Redis",
        "risk": "CRITICAL",
        "description": "In-memory database often exposed without password authentication.",
        "remediation": "Bind Redis to 127.0.0.1 and enable requirepass authentication.",
    },
    27017: {
        "service": "MongoDB",
        "risk": "HIGH",
        "description": "NoSQL database socket potentially exposed without role-based access control.",
        "remediation": "Enable authentication and restrict access to trusted application servers.",
    },
}

SUSPICIOUS_PROCESS_PATTERNS = [
    "xmrig", "minerd", "cryptonight", "ethminer", "cpuminer",  # Crypto-mining
    "mimikatz", "pwdump", "procdump",                         # Credential dumping
    "nc.exe", "ncat", "netcat", "socat",                      # Arbitrary socket relay
    "chisel", "ngrok", "frpc",                                # Reverse proxy tunneling
    "meterpreter", "cobaltstrike", "beacon",                  # C2 Beacons
]

ATTACK_SCENARIOS = {
    "brute_force": {
        "threat_name": "Distributed SSH/RDP Credential Spraying",
        "category": "CREDENTIAL_ACCESS",
        "mitre_technique": "T1110 - Brute Force",
        "simulated_actor_ip": "194.26.29.114 [TOR_EXIT_NODE]",
        "targeted_ports": [22, 3389, 8000],
        "risk_score": 89,
        "financial_loss_spike": 420000,
        "threat_level": "CRITICAL",
        "mitigation_playbook": "Block ingress CIDR, force MFA reset, engage rate-limiting daemon.",
    },
    "ddos": {
        "threat_name": "SYN Flood / Volume Socket Exhaustion",
        "category": "IMPACT",
        "mitre_technique": "T1498 - Network Denial of Service",
        "simulated_actor_ip": "Botnet Cluster (1,240 Nodes)",
        "targeted_ports": [80, 443, 8080],
        "risk_score": 94,
        "financial_loss_spike": 680000,
        "threat_level": "CRITICAL",
        "mitigation_playbook": "Activate cloud scrubbing layer, enable SYN cookies, drop invalid RST packets.",
    },
    "port_scan": {
        "threat_name": "Aggressive TCP SYN Reconnaissance Probe",
        "category": "DISCOVERY",
        "mitre_technique": "T1046 - Network Service Scanning",
        "simulated_actor_ip": "45.134.20.88",
        "targeted_ports": [21, 22, 23, 80, 443, 3306, 5432, 8000],
        "risk_score": 76,
        "financial_loss_spike": 195000,
        "threat_level": "HIGH",
        "mitigation_playbook": "Blackhole probing IP, randomize non-standard ports, isolate staging endpoints.",
    },
}
