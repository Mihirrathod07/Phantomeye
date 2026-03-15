const express = require('express');
const router = express.Router();
const https = require('https');
const dns = require('dns');

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dnsPromises = dns.promises;

// ===== IP / DOMAIN LOOKUP =====
router.get('/lookup/:query', async (req, res) => {
  let query = req.params.query;
  const token = process.env.IPINFO_TOKEN;

  try {
    // If domain, resolve to IP first
    let ip = query;
    let isIP = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(query);
    
    if (!isIP) {
      try {
        const addresses = await dnsPromises.resolve4(query);
        ip = addresses[0];
        console.log(`✅ Resolved ${query} → ${ip}`);
      } catch (dnsErr) {
        return res.status(400).json({ success: false, message: 'Could not resolve domain' });
      }
    }

    // Fetch IPInfo using resolved IP directly
    const data = await fetchIPInfo(ip, token);
    data.hostname = data.hostname || query;
    res.json({ success: true, data });

  } catch (err) {
    console.error('IP lookup error:', err);
    res.status(500).json({ success: false, message: 'Lookup failed' });
  }
});

function fetchIPInfo(ip, token) {
  return new Promise((resolve, reject) => {
    // Use hardcoded ipinfo.io IP to avoid DNS issues
    const options = {
      hostname: '34.117.59.81', // ipinfo.io IP
      path: `/${ip}?token=${token}`,
      method: 'GET',
      headers: { 
        'Accept': 'application/json',
        'Host': 'ipinfo.io'
      }
    };

    const req = https.request(options, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          reject(new Error('Parse error'));
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
}

module.exports = router;