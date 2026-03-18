const express = require('express');
const router = express.Router();
const https = require('https');
const dns = require('dns');

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dnsPromises = dns.promises;

// ===== HELPER: Generic HTTPS GET =====
function httpsGet(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { reject(new Error('Parse error')); }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

// ===== 1. IPInfo (Geolocation) =====
function fetchIPInfo(ip, token) {
  return httpsGet({
    hostname: '34.117.59.81',
    path: `/${ip}?token=${token}`,
    method: 'GET',
    headers: { 'Accept': 'application/json', 'Host': 'ipinfo.io' }
  });
}

// ===== 2. AbuseIPDB (Abuse Score) =====
function fetchAbuseIPDB(ip, apiKey) {
  if (!apiKey) return Promise.resolve(null);
  return httpsGet({
    hostname: 'api.abuseipdb.com',
    path: `/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90&verbose`,
    method: 'GET',
    headers: {
      'Key': apiKey,
      'Accept': 'application/json'
    }
  }).then(res => res?.data || null).catch(() => null);
}

// ===== 3. VirusTotal (Malware Detection) =====
function fetchVirusTotal(ip, apiKey) {
  if (!apiKey) return Promise.resolve(null);
  return httpsGet({
    hostname: 'www.virustotal.com',
    path: `/api/v3/ip_addresses/${ip}`,
    method: 'GET',
    headers: {
      'x-apikey': apiKey,
      'Accept': 'application/json'
    }
  }).then(res => res?.data?.attributes || null).catch(() => null);
}

// ===== RISK CLASSIFIER =====
function classifyRisk(abuseData, vtData) {
  let score = 0;
  let reasons = [];

  if (abuseData) {
    const abuseScore = abuseData.abuseConfidenceScore || 0;
    const reports    = abuseData.totalReports || 0;
    score += abuseScore * 0.6;
    if (abuseScore > 50)  reasons.push(`High abuse confidence (${abuseScore}%)`);
    if (reports > 10)     reasons.push(`${reports} abuse reports`);
    if (abuseData.isWhitelisted) { score -= 20; reasons.push('Whitelisted IP'); }
  }

  if (vtData) {
    const stats     = vtData.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const suspicious= stats.suspicious || 0;
    score += malicious * 8;
    score += suspicious * 4;
    if (malicious > 0)  reasons.push(`${malicious} VT engines flagged malicious`);
    if (suspicious > 0) reasons.push(`${suspicious} VT engines flagged suspicious`);
  }

  score = Math.min(100, Math.max(0, score));

  let level, color;
  if      (score >= 75) { level = 'CRITICAL'; color = '#e74c3c'; }
  else if (score >= 50) { level = 'HIGH';     color = '#e67e22'; }
  else if (score >= 25) { level = 'MEDIUM';   color = '#f1c40f'; }
  else                  { level = 'LOW';      color = '#2ecc71'; }

  return { score: Math.round(score), level, color, reasons };
}

// ===== MAIN ROUTE =====
router.get('/lookup/:query', async (req, res) => {
  let query = req.params.query;

  // ===== INPUT VALIDATION =====
  if (!query || query.length > 253) {
    return res.status(400).json({ success: false, message: 'Invalid input length' });
  }
  // Allow only valid IP or domain characters
  if (!/^[a-zA-Z0-9.\-]+$/.test(query)) {
    return res.status(400).json({ success: false, message: 'Invalid characters in input' });
  }
  // Block private/reserved IPs
  const privateIP = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|0\.|169\.254\.|::1|localhost)/i;
  if (privateIP.test(query)) {
    return res.status(400).json({ success: false, message: 'Private/reserved IP addresses not allowed' });
  }

  const IPINFO_TOKEN    = process.env.IPINFO_TOKEN;
  const ABUSEIPDB_KEY   = process.env.ABUSEIPDB_KEY;
  const VIRUSTOTAL_KEY  = process.env.VIRUSTOTAL_KEY;

  try {
    // Resolve domain → IP if needed
    let ip = query;
    const isIP = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(query);

    if (!isIP) {
      try {
        const addresses = await dnsPromises.resolve4(query);
        ip = addresses[0];
        console.log(`✅ Resolved ${query} → ${ip}`);
      } catch {
        return res.status(400).json({ success: false, message: 'Could not resolve domain' });
      }
    }

    // Run all 3 APIs in parallel
    const [ipInfo, abuseData, vtData] = await Promise.all([
      fetchIPInfo(ip, IPINFO_TOKEN),
      fetchAbuseIPDB(ip, ABUSEIPDB_KEY),
      fetchVirusTotal(ip, VIRUSTOTAL_KEY)
    ]);

    ipInfo.hostname = ipInfo.hostname || query;

    // Build threat intel summary
    const risk = classifyRisk(abuseData, vtData);

    const threatIntel = {
      riskScore:  risk.score,
      riskLevel:  risk.level,
      riskColor:  risk.color,
      riskReasons: risk.reasons,

      // AbuseIPDB fields
      abuseConfidenceScore: abuseData?.abuseConfidenceScore ?? null,
      totalReports:         abuseData?.totalReports ?? null,
      isWhitelisted:        abuseData?.isWhitelisted ?? null,
      lastReportedAt:       abuseData?.lastReportedAt ?? null,
      isp:                  abuseData?.isp ?? ipInfo?.org ?? null,
      usageType:            abuseData?.usageType ?? null,
      domain:               abuseData?.domain ?? null,
      countryCode:          abuseData?.countryCode ?? ipInfo?.country ?? null,

      // VirusTotal fields
      vtMalicious:   vtData?.last_analysis_stats?.malicious  ?? null,
      vtSuspicious:  vtData?.last_analysis_stats?.suspicious ?? null,
      vtHarmless:    vtData?.last_analysis_stats?.harmless   ?? null,
      vtUndetected:  vtData?.last_analysis_stats?.undetected ?? null,
      vtReputation:  vtData?.reputation ?? null,
      vtNetwork:     vtData?.network ?? null,

      // Source availability flags
      sources: {
        ipinfo:    !!IPINFO_TOKEN,
        abuseipdb: !!ABUSEIPDB_KEY,
        virustotal: !!VIRUSTOTAL_KEY
      }
    };

    res.json({ success: true, data: ipInfo, threatIntel });

  } catch (err) {
    console.error('IP lookup error:', err);
    res.status(500).json({ success: false, message: 'Lookup failed' });
  }
});

module.exports = router;