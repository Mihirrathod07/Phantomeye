const express = require('express');
const router = express.Router();
const https = require('https');
const http = require('http');
const dns = require('dns');

dns.setServers(['8.8.8.8', '8.8.4.4']);

// Platforms with reliable HTTP checking
const CHECKABLE_PLATFORMS = [
  { name: 'GitHub',      url: 'https://github.com/{u}',              checkUrl: 'https://github.com/{u}',                    found: 200, notFound: 404 },
  { name: 'Reddit',      url: 'https://reddit.com/user/{u}',         checkUrl: 'https://www.reddit.com/user/{u}/about.json', found: 200, notFound: 404 },
  { name: 'GitLab',      url: 'https://gitlab.com/{u}',              checkUrl: 'https://gitlab.com/{u}',                    found: 200, notFound: 404 },
  { name: 'Dev.to',      url: 'https://dev.to/{u}',                  checkUrl: 'https://dev.to/{u}',                        found: 200, notFound: 404 },
  { name: 'Medium',      url: 'https://medium.com/@{u}',             checkUrl: 'https://medium.com/@{u}',                   found: 200, notFound: 404 },
  { name: 'Patreon',     url: 'https://patreon.com/{u}',             checkUrl: 'https://www.patreon.com/{u}',               found: 200, notFound: 404 },
  { name: 'Behance',     url: 'https://behance.net/{u}',             checkUrl: 'https://www.behance.net/{u}',               found: 200, notFound: 404 },
  { name: 'Dribbble',    url: 'https://dribbble.com/{u}',            checkUrl: 'https://dribbble.com/{u}',                  found: 200, notFound: 404 },
  { name: 'SoundCloud',  url: 'https://soundcloud.com/{u}',          checkUrl: 'https://soundcloud.com/{u}',                found: 200, notFound: 404 },
  { name: 'Flickr',      url: 'https://flickr.com/people/{u}',       checkUrl: 'https://www.flickr.com/people/{u}/',        found: 200, notFound: 404 },
];

// Platforms we only provide links for (bot detection)
const LINK_ONLY_PLATFORMS = [
  { name: 'Twitter/X',   url: 'https://x.com/{u}',           icon: '🐦' },
  { name: 'Instagram',   url: 'https://instagram.com/{u}',   icon: '📸' },
  { name: 'TikTok',      url: 'https://tiktok.com/@{u}',     icon: '🎵' },
  { name: 'LinkedIn',    url: 'https://linkedin.com/in/{u}', icon: '💼' },
  { name: 'YouTube',     url: 'https://youtube.com/@{u}',    icon: '▶️' },
  { name: 'Pinterest',   url: 'https://pinterest.com/{u}',   icon: '📌' },
  { name: 'Twitch',      url: 'https://twitch.tv/{u}',       icon: '🎮' },
  { name: 'Snapchat',    url: 'https://snapchat.com/add/{u}',icon: '👻' },
  { name: 'Telegram',    url: 'https://t.me/{u}',            icon: '✈️' },
  { name: 'Spotify',     url: 'https://open.spotify.com/user/{u}', icon: '🎧' },
];

function checkPlatform(platform, username) {
  return new Promise((resolve) => {
    const url = platform.checkUrl.replace('{u}', encodeURIComponent(username));
    const profileUrl = platform.url.replace('{u}', username);
    const isHttps = url.startsWith('https');
    const lib = isHttps ? https : http;
    const urlObj = new URL(url);

    const options = {
      hostname: urlObj.hostname,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: 8000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/json'
      }
    };

    const req = lib.request(options, (res) => {
      // Drain response
      res.on('data', () => {});
      res.on('end', () => {
        const found = res.statusCode === platform.found;
        resolve({ name: platform.name, found, url: found ? profileUrl : null, status: res.statusCode });
      });
    });

    req.on('timeout', () => { req.destroy(); resolve({ name: platform.name, found: false, url: null, status: 'timeout' }); });
    req.on('error', () => { resolve({ name: platform.name, found: false, url: null, status: 'error' }); });
    req.end();
  });
}

router.get('/check/:username', async (req, res) => {
  const username = req.params.username;
  // ===== INPUT VALIDATION =====
  if (!username) {
    return res.status(400).json({ success: false, message: 'Username is required' });
  }
  if (username.length < 1 || username.length > 50) {
    return res.status(400).json({ success: false, message: 'Username must be 1-50 characters' });
  }
  // Block dangerous characters - allow only valid username chars
  if (/[<>"';\/\&=]/.test(username)) {
    return res.status(400).json({ success: false, message: 'Invalid characters in username' });
  }

  try {
    // Check all platforms in parallel
    const results = await Promise.all(
      CHECKABLE_PLATFORMS.map(p => checkPlatform(p, username))
    );

    const found = results.filter(r => r.found).length;

    res.json({
      success: true,
      username,
      results,
      linkOnly: LINK_ONLY_PLATFORMS.map(p => ({
        name: p.name,
        icon: p.icon,
        url: p.url.replace('{u}', username)
      })),
      stats: { checked: results.length, found, notFound: results.length - found }
    });

  } catch (err) {
    console.error('Username check error:', err);
    res.status(500).json({ success: false, message: 'Check failed' });
  }
});

module.exports = router;