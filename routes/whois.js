const express = require('express');
const router = express.Router();
const https = require('https');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

// ===== HELPER: HTTPS GET =====
function httpsGet(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: { 'Accept': 'application/json', 'User-Agent': 'PhantomEye-OSINT/1.0' },
      timeout: 8000
    };
    const req = https.request(options, (resp) => {
      // Follow redirects
      if (resp.statusCode >= 300 && resp.statusCode < 400 && resp.headers.location) {
        return httpsGet(resp.headers.location).then(resolve).catch(reject);
      }
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => {
        try { resolve({ status: resp.statusCode, data: JSON.parse(data) }); }
        catch { reject(new Error('Parse error')); }
      });
    });
    req.on('timeout', () => { req.destroy(); reject(new Error('Timeout')); });
    req.on('error', reject);
    req.end();
  });
}

// ===== WHOIS LOOKUP ROUTE =====
router.get('/lookup/:domain', async (req, res) => {
  let domain = req.params.domain.toLowerCase().trim();

  // ===== INPUT VALIDATION =====
  if (!domain) {
    return res.status(400).json({ success: false, message: 'Domain is required' });
  }
  if (domain.length > 253) {
    return res.status(400).json({ success: false, message: 'Domain too long' });
  }
  if (!/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(domain)) {
    return res.status(400).json({ success: false, message: 'Invalid domain format' });
  }
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(domain)) {
    return res.status(400).json({ success: false, message: 'IP addresses not supported — use IP module' });
  }

  const tld = domain.split('.').pop();

  // ===== RDAP SERVERS =====
  const rdapServers = [
    `https://rdap.org/domain/${domain}`,
    `https://rdap.verisign.com/com/v1/domain/${domain}`,
    `https://rdap.verisign.com/net/v1/domain/${domain}`,
    `https://rdap.afilias.net/rdap/domain/${domain}`,
    `https://rdap.nominet.uk/uk/domain/${domain}`,
  ];

  // Pick server based on TLD
  let rdapUrl;
  if (['com', 'net'].includes(tld)) {
    rdapUrl = `https://rdap.verisign.com/${tld}/v1/domain/${domain}`;
  } else if (tld === 'uk') {
    rdapUrl = `https://rdap.nominet.uk/uk/domain/${domain}`;
  } else {
    rdapUrl = `https://rdap.org/domain/${domain}`;
  }

  try {
    // Try primary RDAP server
    let result;
    try {
      result = await httpsGet(rdapUrl);
    } catch (e) {
      // Fallback to rdap.org
      result = await httpsGet(`https://rdap.org/domain/${domain}`);
    }

    if (result.status !== 200) {
      return res.status(404).json({ success: false, message: 'Domain not found or not registered' });
    }

    const data = result.data;

    // ===== PARSE RDAP DATA =====
    // Events (dates)
    const getEvent = (type) => {
      if (!data.events) return null;
      const ev = data.events.find(e => e.eventAction === type);
      return ev ? ev.eventDate : null;
    };

    // Registrar
    let registrar = 'N/A';
    let registrarUrl = null;
    if (data.entities) {
      const reg = data.entities.find(e => e.roles && e.roles.includes('registrar'));
      if (reg && reg.vcardArray && reg.vcardArray[1]) {
        const fn = reg.vcardArray[1].find(v => v[0] === 'fn');
        const url = reg.vcardArray[1].find(v => v[0] === 'url');
        if (fn) registrar = fn[3];
        if (url) registrarUrl = url[3];
      }
    }

    // Registrant
    let registrant = { name: 'N/A', org: 'N/A', country: 'N/A', email: 'N/A' };
    if (data.entities) {
      const reg2 = data.entities.find(e => e.roles && e.roles.includes('registrant'));
      if (reg2 && reg2.vcardArray && reg2.vcardArray[1]) {
        const vcard = reg2.vcardArray[1];
        const fn2   = vcard.find(v => v[0] === 'fn');
        const org2  = vcard.find(v => v[0] === 'org');
        const adr   = vcard.find(v => v[0] === 'adr');
        const email2= vcard.find(v => v[0] === 'email');
        if (fn2)    registrant.name    = fn2[3] || 'N/A';
        if (org2)   registrant.org     = Array.isArray(org2[3]) ? org2[3].join(' ') : (org2[3] || 'N/A');
        if (adr && adr[3]) registrant.country = Array.isArray(adr[3]) ? (adr[3][6] || 'N/A') : (adr[3] || 'N/A');
        if (email2) registrant.email   = email2[3] || 'N/A';
      }
    }

    // Nameservers
    const nameservers = (data.nameservers || [])
      .map(n => n.ldhName || n.unicodeName || '')
      .filter(Boolean);

    // Domain status
    const status = data.status || [];

    // Domain age calculation
    const registrationDate = getEvent('registration');
    let domainAge = null;
    if (registrationDate) {
      const years = Math.floor((new Date() - new Date(registrationDate)) / (365.25 * 24 * 3600 * 1000));
      domainAge = years;
    }

    // Privacy protection check
    const hasPrivacy = status.some(s => s.toLowerCase().includes('clienttransferprohibited')) ||
      registrant.name.toLowerCase().includes('redacted') ||
      registrant.name.toLowerCase().includes('privacy') ||
      registrant.org.toLowerCase().includes('privacy');

    res.json({
      success: true,
      domain,
      rdapSource: rdapUrl,
      registrar,
      registrarUrl,
      registrant,
      nameservers,
      status,
      domainAge,
      hasPrivacy,
      dates: {
        registered:  registrationDate,
        updated:     getEvent('last changed'),
        expiry:      getEvent('expiration'),
        lastChanged: getEvent('last update of RDAP database')
      },
      raw: data
    });

  } catch (err) {
    console.error('WHOIS error:', err.message);
    res.status(500).json({ success: false, message: 'WHOIS lookup failed — domain may not exist or RDAP unavailable' });
  }
});

module.exports = router;