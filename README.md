# PhantomEye — OSINT Intelligence Platform

> Full-featured Open Source Intelligence framework with 11 reconnaissance modules
> Built by **Mihir Rathod** | M.Tech Cyber Security, Indus University

![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![HTML5](https://img.shields.io/badge/HTML5-CSS3-orange)
![License](https://img.shields.io/badge/License-MIT-blue)
![Author](https://img.shields.io/badge/Author-Mihir%20Rathod-cyan)

---

## 🔍 What is PhantomEye?

PhantomEye is a unified OSINT (Open Source Intelligence) dashboard built for ethical security researchers, penetration testers, and threat intelligence analysts. It consolidates 11 recon modules into a single dark-themed interface with user authentication, session tracking, PDF reports, and scan history.

---

## ✨ Features

| Module | Description |
|--------|-------------|
| 👤 Username Lookup | Scan 20+ social platforms for username existence |
| 🌐 IP / Domain Recon | Geolocation, ISP, ASN, proxy/VPN detection |
| 📧 Email Intelligence | Domain analysis, MX check, breach detection, risk score |
| 🗂️ Metadata Extractor | Extract EXIF data from images, PDFs, and documents |
| 📱 Phone Lookup | Carrier, region, line type, VoIP detection, risk analysis |
| 🔎 Google Dork Generator | Advanced search query builder — 6 modes, 5 platforms |
| # Hash Identifier | Identify hash algorithm, strength & cracking difficulty |
| 📋 WHOIS Lookup | Domain registration, ownership, expiry via RDAP |
| 📡 DNS Lookup | Query A, AAAA, MX, TXT, NS, CNAME, SOA via Cloudflare DoH |
| ⚠️ Risk Score | Aggregate threat intelligence from all scanned modules |
| 📚 OSINT Directory | Curated database of 170+ OSINT tools — searchable by category |

---

## 🚀 Live Demo

🌐 **[phantomeye.onrender.com](https://phantomeye.onrender.com)**

> Register a free account to access all modules

---

## 🖥️ Setup (Run Locally)

```bash
git clone https://github.com/Mihirrathod07/Phantomeye
cd Phantomeye
npm install
node server.js
```

Open browser: `http://localhost:3000`

---

## 📁 Project Structure

```
PhantomEye/
├── public/
│   ├── index.html              ← Main application
│   ├── style.css               ← Dark terminal theme
│   ├── app.js                  ← Frontend logic
│   └── favicon_phantomeye.svg  ← Custom favicon
├── routes/
│   ├── auth.js                 ← Authentication routes
│   ├── email.js                ← Email intel module
│   ├── ip.js                   ← IP/Domain recon module
│   └── username.js             ← Username lookup module
├── server.js                   ← Express server
├── package.json                ← Dependencies
├── .env                        ← API keys (not in repo)
└── .gitignore
```

---

## 🔐 Authentication

PhantomEye includes a built-in login system:
- Register a new operator account
- Login with credentials
- Session tracking with auto-logout
- Max 5 login attempts protection

---

## 📊 Export Options

Every module supports multiple export formats:
```
⬇ JSON Export   — Raw data for further processing
⬇ PDF Report    — Professional formatted report
📋 Copy         — Quick clipboard copy
```

Risk Score module generates a **full PDF report** with all scan findings aggregated.

---

## 🎨 Tech Stack

```
Backend   : Node.js, Express.js
Frontend  : HTML5, CSS3, Vanilla JavaScript
Fonts     : Orbitron, Share Tech Mono, Rajdhani
Maps      : Leaflet.js
PDF       : jsPDF
EXIF      : exifr.js
Theme     : Dark terminal — Cyan accent #00d4ff
```

---

## ⚠️ Legal Disclaimer

> PhantomEye is built for **educational and authorized security research only.**
> Only investigate targets you own or have **explicit written permission** to analyze.
> Unauthorized use of OSINT tools may violate privacy laws including **IT Act 2000 (India)**.
> The author is not responsible for any misuse of this tool.

---

## 👨‍💻 Author

**Mihir Rathod**
M.Tech Cyber Security — Indus University

- 🌐 Portfolio: [mihirrathod.onrender.com](https://mihirrathod.onrender.com)
- 🔍 PhantomEye: [phantomeye.onrender.com](https://phantomeye.onrender.com)
- 💻 GitHub: [github.com/Mihirrathod07](https://github.com/Mihirrathod07)
- 📧 Email: mihir8716@gmail.com

---

© 2026 Mihir Rathod — All Rights Reserved

*Built with passion for cybersecurity research 🔐*
