const express = require('express');
const router = express.Router();
const https = require('https');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);
const dnsPromises = dns.promises;

// ===== HELPER =====
function httpsGet(options) {
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
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

// ===== SINGLE IP SCAN =====
async function scanSingleIP(ip) {
  const IPINFO_TOKEN   = process.env.IPINFO_TOKEN;
  const ABUSEIPDB_KEY  = process.env.ABUSEIPDB_KEY;
  const VIRUSTOTAL_KEY = process.env.VIRUSTOTAL_KEY;

  try {
    // Run all 3 APIs in parallel
    const [ipInfo, abuseData, vtData] = await Promise.all([
      // IPInfo
      httpsGet({
        hostname: '34.117.59.81',
        path: `/${ip}?token=${IPINFO_TOKEN}`,
        method: 'GET',
        headers: { 'Accept': 'application/json', 'Host': 'ipinfo.io' }
      }).catch(() => null),

      // AbuseIPDB
      ABUSEIPDB_KEY ? httpsGet({
        hostname: 'api.abuseipdb.com',
        path: `/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90`,
        method: 'GET',
        headers: { 'Key': ABUSEIPDB_KEY, 'Accept': 'application/json' }
      }).then(r => r?.data || null).catch(() => null) : Promise.resolve(null),

      // VirusTotal
      VIRUSTOTAL_KEY ? httpsGet({
        hostname: 'www.virustotal.com',
        path: `/api/v3/ip_addresses/${ip}`,
        method: 'GET',
        headers: { 'x-apikey': VIRUSTOTAL_KEY, 'Accept': 'application/json' }
      }).then(r => r?.data?.attributes || null).catch(() => null) : Promise.resolve(null)
    ]);

    // Risk calculation
    let score = 0;
    if (abuseData) {
      score += (abuseData.abuseConfidenceScore || 0) * 0.6;
      if (abuseData.isWhitelisted) score -= 20;
    }
    if (vtData) {
      score += (vtData.last_analysis_stats?.malicious || 0) * 8;
      score += (vtData.last_analysis_stats?.suspicious || 0) * 4;
    }
    score = Math.min(100, Math.max(0, Math.round(score)));

    let riskLevel, riskColor;
    if      (score >= 75) { riskLevel = 'CRITICAL'; riskColor = '#e74c3c'; }
    else if (score >= 50) { riskLevel = 'HIGH';     riskColor = '#e67e22'; }
    else if (score >= 25) { riskLevel = 'MEDIUM';   riskColor = '#f1c40f'; }
    else                  { riskLevel = 'LOW';      riskColor = '#2ecc71'; }

    const loc = (ipInfo?.loc || '0,0').split(',');

    return {
      ip,
      success: true,
      riskScore:  score,
      riskLevel,
      riskColor,
      country:    ipInfo?.country || 'N/A',
      city:       ipInfo?.city    || 'N/A',
      isp:        abuseData?.isp  || ipInfo?.org || 'N/A',
      usageType:  abuseData?.usageType || 'N/A',
      abuseScore: abuseData?.abuseConfidenceScore ?? null,
      totalReports: abuseData?.totalReports ?? null,
      isWhitelisted: abuseData?.isWhitelisted ?? null,
      vtMalicious:  vtData?.last_analysis_stats?.malicious  ?? null,
      vtSuspicious: vtData?.last_analysis_stats?.suspicious ?? null,
      lat: loc[0] || null,
      lon: loc[1] || null,
      lastReportedAt: abuseData?.lastReportedAt || null
    };
  } catch (err) {
    return { ip, success: false, error: err.message, riskLevel: 'ERROR', riskColor: '#888' };
  }
}

// ===== BULK SCAN ROUTE =====
router.post('/scan', async (req, res) => {
  const { ips } = req.body;

  // Validation
  if (!ips || !Array.isArray(ips)) {
    return res.status(400).json({ success: false, message: 'ips array required' });
  }
  if (ips.length === 0) {
    return res.status(400).json({ success: false, message: 'No IPs provided' });
  }
  if (ips.length > 20) {
    return res.status(400).json({ success: false, message: 'Max 20 IPs per request' });
  }

  // Validate each IP
  const validIPs = [];
  const privateIP = /^(10\.|172\.(1[6-9]|2[0-9]|3[01])\.|192\.168\.|127\.|0\.|169\.254\.)/;

  for (const ip of ips) {
    const clean = ip.trim();
    if (!clean) continue;
    if (!/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(clean)) continue;
    if (privateIP.test(clean)) continue;
    const parts = clean.split('.').map(Number);
    if (parts.some(p => p > 255)) continue;
    validIPs.push(clean);
  }

  if (validIPs.length === 0) {
    return res.status(400).json({ success: false, message: 'No valid public IPs found' });
  }

  try {
    // Scan all IPs in parallel
    const results = await Promise.all(validIPs.map(ip => scanSingleIP(ip)));
    
    const summary = {
      total:    results.length,
      critical: results.filter(r => r.riskLevel === 'CRITICAL').length,
      high:     results.filter(r => r.riskLevel === 'HIGH').length,
      medium:   results.filter(r => r.riskLevel === 'MEDIUM').length,
      low:      results.filter(r => r.riskLevel === 'LOW').length,
      error:    results.filter(r => r.riskLevel === 'ERROR').length
    };

    res.json({ success: true, results, summary });

  } catch (err) {
    console.error('Bulk scan error:', err);
    res.status(500).json({ success: false, message: 'Bulk scan failed' });
  }
});

module.exports = router;