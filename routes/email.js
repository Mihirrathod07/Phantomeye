const express = require('express');
const router = express.Router();
const dns = require('dns');

// Force Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);
const dnsPromises = dns.promises;

// ===== EMAIL INTEL =====
router.get('/analyze/:email', async (req, res) => {
  const email = req.params.email;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email' });
  }

  const domain = email.split('@')[1];

  try {
    // 1. MX Records
    let mxRecords = [];
    let mxString = 'Not found';
    let domainExists = false;
    let mailProvider = 'Unknown';

    try {
      const mx = await dnsPromises.resolveMx(domain);
      if (mx && mx.length > 0) {
        domainExists = true;
        mxRecords = mx.sort((a, b) => a.priority - b.priority);
        mxString = mxRecords.map(r => `${r.exchange} (priority: ${r.priority})`).join(', ');
        const mx0 = mxRecords[0].exchange.toLowerCase();
        if (mx0.includes('google') || mx0.includes('gmail'))         mailProvider = 'Google Workspace / Gmail';
        else if (mx0.includes('outlook') || mx0.includes('microsoft')) mailProvider = 'Microsoft Exchange / Outlook';
        else if (mx0.includes('yahoo'))                               mailProvider = 'Yahoo Mail';
        else if (mx0.includes('protonmail') || mx0.includes('proton.ch')) mailProvider = 'ProtonMail';
        else if (mx0.includes('zoho'))                                mailProvider = 'Zoho Mail';
        else if (mx0.includes('icloud') || mx0.includes('apple'))    mailProvider = 'Apple iCloud';
        else if (mx0.includes('yandex'))                             mailProvider = 'Yandex Mail';
        else if (mx0.includes('mailgun'))                            mailProvider = 'Mailgun (Transactional)';
        else if (mx0.includes('sendgrid'))                           mailProvider = 'SendGrid (Transactional)';
        else mailProvider = mxRecords[0].exchange;
      }
    } catch (e) { mxString = 'No MX records found'; }

    // 2. SPF Record (TXT record on domain)
    let spfRecord = null;
    let spfStatus = 'NOT FOUND';
    let spfPolicy = 'N/A';
    try {
      const txtRecords = await dnsPromises.resolveTxt(domain);
      const spf = txtRecords.find(r => r.join('').startsWith('v=spf1'));
      if (spf) {
        spfRecord = spf.join('');
        spfStatus = 'FOUND ✓';
        if (spfRecord.includes('-all'))      spfPolicy = 'STRICT (-all) — Unauthorized senders rejected';
        else if (spfRecord.includes('~all')) spfPolicy = 'SOFT FAIL (~all) — Suspicious but not rejected';
        else if (spfRecord.includes('?all')) spfPolicy = 'NEUTRAL (?all) — No policy enforced';
        else if (spfRecord.includes('+all')) spfPolicy = '⚠ OPEN (+all) — All senders allowed (dangerous!)';
        else spfPolicy = 'Custom policy';
      }
    } catch (e) { spfStatus = 'NOT FOUND'; }

    // 3. DMARC Record (TXT record on _dmarc.domain)
    let dmarcRecord = null;
    let dmarcStatus = 'NOT FOUND';
    let dmarcPolicy = 'N/A';
    let dmarcReporting = 'N/A';
    try {
      const dmarcTxt = await dnsPromises.resolveTxt('_dmarc.' + domain);
      const dmarc = dmarcTxt.find(r => r.join('').startsWith('v=DMARC1'));
      if (dmarc) {
        dmarcRecord = dmarc.join('');
        dmarcStatus = 'FOUND ✓';
        const pMatch = dmarcRecord.match(/p=([^;]+)/);
        if (pMatch) {
          const p = pMatch[1].toLowerCase().trim();
          if (p === 'reject')      dmarcPolicy = 'REJECT — Unauthorized emails blocked';
          else if (p === 'quarantine') dmarcPolicy = 'QUARANTINE — Suspicious emails go to spam';
          else if (p === 'none')   dmarcPolicy = 'NONE — Monitor only, no action';
          else dmarcPolicy = p;
        }
        const ruaMatch = dmarcRecord.match(/rua=([^;]+)/);
        dmarcReporting = ruaMatch ? ruaMatch[1] : 'No reporting configured';
      }
    } catch (e) { dmarcStatus = 'NOT FOUND'; }

    // 4. Domain A record
    let aRecord = null;
    try {
      const aRecords = await dnsPromises.resolve4(domain);
      aRecord = aRecords[0];
      domainExists = true;
    } catch (e) {}

    res.json({
      success: true,
      domain,
      domainExists,
      mxRecords: mxRecords.map(r => r.exchange),
      mxString,
      mailProvider,
      totalMX: mxRecords.length,
      aRecord,
      spf: { status: spfStatus, record: spfRecord, policy: spfPolicy },
      dmarc: { status: dmarcStatus, record: dmarcRecord, policy: dmarcPolicy, reporting: dmarcReporting }
    });

  } catch (err) {
    console.error('Email analyze error:', err);
    res.status(500).json({ success: false, message: 'Analysis failed' });
  }
});

module.exports = router;