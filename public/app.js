// ===== LOGIN =====
(function(){
  var lc=document.getElementById('login-canvas');
  if(!lc)return;
  var lctx=lc.getContext('2d');
  var lW,lH;
  var BIN=['0','1'];
  var SYM=['<','>','[',']','|','#','@','!','/','+',' ','=','*','~','^','&','%','$','?',':'];
  var HXC=['A','B','C','D','E','F','0','1','2','3','4','5','6','7','8','9'];
  var KAT=['ﾀ','ﾁ','ﾂ','ﾃ','ﾄ','ﾅ','ﾆ','ﾇ','ﾈ','ﾉ','ﾊ','ﾋ','ﾌ','ﾍ','ﾎ','ﾏ','ﾐ','ﾑ','ﾒ','ﾓ'];
  var CYN=[0,212,255],GRN=[0,255,136],ORG=[255,107,53],WHT=[220,245,255];
  var CS=17;
  function rnd(a,b){return Math.random()*(b-a)+a;}
  function ri(a,b){return Math.floor(rnd(a,b+1));}
  function pk(a){return a[ri(0,a.length-1)];}
  function rc(col,a){return 'rgba('+col[0]+','+col[1]+','+col[2]+','+a+')';}
  var lD=[],lH2=[],lS=[],lN=[];
  var lB=[{y:0,sp:0.35,al:0.018,w:120,c:CYN},{y:300,sp:-0.28,al:0.012,w:90,c:GRN}];
  var lT=0;
  function lInit(){
    lW=lc.width=window.innerWidth; lH=lc.height=window.innerHeight;
    lD=[];
    for(var i=0;i<Math.floor(lW/CS);i++){
      var t=Math.random();
      lD.push({y:rnd(-300,-10),sp:rnd(0.12,0.32),ln:ri(5,22),br:Math.random()<0.06,
        col:Math.random()<0.08?GRN:Math.random()<0.04?ORG:CYN,
        cs:t<0.45?BIN:t<0.75?SYM:t<0.90?HXC:KAT,gl:0});
    }
    lH2=[];
    var HS=38,hc=Math.ceil(lW/(HS*1.75))+2,hr=Math.ceil(lH/(HS*1.52))+2;
    for(var row=0;row<hr;row++){
      for(var col=0;col<hc;col++){
        lH2.push({x:col*HS*1.74+(row%2===0?0:HS*0.87),y:row*HS*1.51,on:false,t:0,al:0});
      }
    }
    lS=[];
    for(var s=0;s<Math.floor(lW/280);s++) lS.push(nS());
    lN=[];
    for(var n=0;n<Math.min(18,Math.floor(lW*lH/55000));n++){
      lN.push({x:rnd(0,lW),y:rnd(0,lH),vx:rnd(-0.09,0.09),vy:rnd(-0.09,0.09),r:rnd(1.2,3.2),p:rnd(0,Math.PI*2),c:Math.random()<0.7?CYN:GRN});
    }
  }
  function nS(){
    return {x:rnd(0,lW),y:rnd(-200,lH),sp:rnd(0.4,1.1),w:rnd(1,2.5),ln:rnd(60,200),
      al:rnd(0.03,0.10),c:Math.random()<0.7?CYN:Math.random()<0.5?GRN:ORG,ag:rnd(-0.15,0.15)};
  }
  function hp(x,y,s){
    lctx.beginPath();
    for(var i=0;i<6;i++){
      var a=Math.PI/180*(60*i-30);
      if(i===0) lctx.moveTo(x+s*Math.cos(a),y+s*Math.sin(a));
      else lctx.lineTo(x+s*Math.cos(a),y+s*Math.sin(a));
    }
    lctx.closePath();
  }
  function lDraw(){
    lctx.fillStyle='rgba(3,6,14,0.14)';lctx.fillRect(0,0,lW,lH);
    lB.forEach(function(b){
      b.y+=b.sp;if(b.y<-b.w)b.y=lH+b.w;if(b.y>lH+b.w)b.y=-b.w;
      var g=lctx.createLinearGradient(0,b.y-b.w/2,0,b.y+b.w/2);
      g.addColorStop(0,'transparent');g.addColorStop(0.5,rc(b.c,b.al));g.addColorStop(1,'transparent');
      lctx.fillStyle=g;lctx.fillRect(0,b.y-b.w/2,lW,b.w);
    });
    lT++;
    if(lT%18===0&&lH2.length>0){
      var ix=ri(0,lH2.length-1);
      lH2[ix].on=true;lH2[ix].t=0;lH2[ix].al=rnd(0.12,0.30);
      for(var nb=0;nb<ri(1,3);nb++){
        var ni=Math.max(0,Math.min(lH2.length-1,ix+ri(-4,4)));
        lH2[ni].on=true;lH2[ni].t=ri(2,8);lH2[ni].al=rnd(0.06,0.18);
      }
    }
    lH2.forEach(function(h){
      if(!h.on)return;
      h.t++;
      var pr=h.t/40,a=h.al*(1-pr);
      if(a>0.005){
        hp(h.x,h.y,36);lctx.strokeStyle=rc(CYN,a);lctx.lineWidth=0.7;lctx.stroke();
        if(pr<0.3){hp(h.x,h.y,34);lctx.fillStyle=rc(CYN,a*0.15);lctx.fill();}
      } else { h.on=false; }
    });
    lS.forEach(function(s,i){
      var x2=s.x+Math.sin(s.ag)*s.ln,y2=s.y-s.ln;
      var g=lctx.createLinearGradient(s.x,s.y,x2,y2);
      g.addColorStop(0,rc(s.c,s.al));g.addColorStop(0.6,rc(s.c,s.al*0.5));g.addColorStop(1,'transparent');
      lctx.beginPath();lctx.moveTo(s.x,s.y);lctx.lineTo(x2,y2);
      lctx.strokeStyle=g;lctx.lineWidth=s.w;lctx.stroke();
      s.y+=s.sp;s.x+=Math.sin(s.ag)*s.sp*0.3;
      if(s.y>lH+s.ln){lS[i]=nS();lS[i].y=-s.ln;}
    });
    lctx.font='13px "Share Tech Mono",monospace';
    lD.forEach(function(d,i){
      var x=i*CS+2,hy=Math.floor(d.y)*CS;
      if(Math.random()<0.0008)d.gl=ri(8,20);
      var ig=d.gl>0;if(ig)d.gl--;
      if(hy>=0&&hy<lH){
        lctx.fillStyle=ig?rc(WHT,1):(d.br?rc(WHT,0.97):rc(WHT,0.82));
        lctx.fillText(pk(d.cs),x,hy);
      }
      for(var t=1;t<d.ln;t++){
        var ty=hy-t*CS;if(ty<-CS||ty>lH)continue;
        lctx.fillStyle=rc(d.col,(1-t/d.ln)*(ig?0.7:d.br?0.50:0.22));
        lctx.fillText(pk(d.cs),x,ty);
      }
      d.y+=d.sp;
      if(d.y*CS>lH+d.ln*CS){
        d.y=rnd(-180,-5);d.br=Math.random()<0.06;
        if(Math.random()<0.1)d.col=Math.random()<0.6?CYN:Math.random()<0.5?GRN:ORG;
      }
    });
    for(var i=0;i<lN.length;i++){
      for(var j=i+1;j<lN.length;j++){
        var dx=lN[i].x-lN[j].x,dy=lN[i].y-lN[j].y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<200){
          lctx.beginPath();lctx.moveTo(lN[i].x,lN[i].y);lctx.lineTo(lN[j].x,lN[j].y);
          lctx.strokeStyle=rc(CYN,(1-dist/200)*0.06);lctx.lineWidth=0.6;lctx.stroke();
        }
      }
    }
    lN.forEach(function(n){
      n.x+=n.vx;n.y+=n.vy;n.p+=0.018;
      if(n.x<0||n.x>lW)n.vx*=-1;if(n.y<0||n.y>lH)n.vy*=-1;
      var pa=0.15+Math.sin(n.p)*0.10;
      lctx.beginPath();lctx.arc(n.x,n.y,n.r*2.5,0,Math.PI*2);lctx.fillStyle=rc(n.c,pa*0.15);lctx.fill();
      lctx.beginPath();lctx.arc(n.x,n.y,n.r,0,Math.PI*2);lctx.fillStyle=rc(n.c,pa*0.6);lctx.fill();
    });
    lctx.strokeStyle=rc(CYN,0.12);lctx.lineWidth=1.5;
    [[0,0,1,1],[lW,0,-1,1],[0,lH,1,-1],[lW,lH,-1,-1]].forEach(function(q){
      lctx.beginPath();lctx.moveTo(q[0]+q[2]*55,q[1]);lctx.lineTo(q[0],q[1]);lctx.lineTo(q[0],q[1]+q[3]*55);lctx.stroke();
    });
    requestAnimationFrame(lDraw);
  }
  lInit(); lDraw(); window.addEventListener('resize',lInit);
})();
let loginAttempts=0;

// Simple in-memory user store
// Backend API URL — local server
var API_URL = 'https://phantomeye.onrender.com/api';

function switchAuthTab(tab, btn){
  document.querySelectorAll('.auth-tab').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.auth-form').forEach(function(f){f.classList.remove('active');});
  btn.classList.add('active');
  document.getElementById('auth-'+tab).classList.add('active');
}

async function doLogin(){
  const user=document.getElementById('login-user').value.trim();
  const pass=document.getElementById('login-pass').value.trim();
  const errEl=document.getElementById('login-error');
  const attEl=document.getElementById('login-attempts');
  const btn=document.getElementById('login-submit-btn');

  if(!user&&!pass){
    errEl.textContent='⚠ Enter your username and password';
    errEl.classList.add('show'); return;
  }
  if(!user){
    errEl.textContent='⚠ Username is required';
    errEl.classList.add('show'); return;
  }
  if(!pass){
    errEl.textContent='⚠ Password is required';
    errEl.classList.add('show'); return;
  }
  if(user.length<3){
    errEl.textContent='⚠ Username must be at least 3 characters';
    errEl.classList.add('show'); return;
  }

  loginAttempts++;
  attEl.textContent='ATTEMPTS: '+loginAttempts+'/5';
  btn.textContent='[ AUTHENTICATING... ]';
  btn.style.color='var(--warn)';
  btn.disabled=true;

  try {
    var res = await fetch(API_URL+'/auth/login', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username:user, password:pass })
    });
    if(res.status === 429){
      errEl.textContent='⚠ Too many login attempts — wait 60 seconds.';
      errEl.classList.add('show');
      btn.textContent='▶ INITIALIZE ACCESS';
      return;
    }
    var data = await res.json();

    if(data.success){
      // Save token
      localStorage.setItem('pe_logged_in','1');
      localStorage.setItem('pe_token', data.token);
      localStorage.setItem('pe_username', data.username);
      localStorage.setItem('pe_created', data.createdAt || 'N/A');

      btn.textContent='[ ACCESS GRANTED ]';
      btn.style.color='var(--accent2)';
      btn.style.borderColor='var(--accent2)';
      btn.style.boxShadow='0 0 30px rgba(0,255,136,0.4)';
      errEl.classList.remove('show');
      

      setTimeout(function(){
        var overlay=document.getElementById('login-overlay');
        overlay.style.animation='loginFadeOut 0.6s forwards';
        setTimeout(function(){
          overlay.classList.remove('show');
          overlay.style.animation='';
          var wEl=document.getElementById('boot-welcome');
          if(wEl) wEl.textContent='✓ WELCOME, '+data.username.toUpperCase()+' — ACCESS GRANTED';
          startBootSequence();
        },600);
      },700);

    } else {
      btn.textContent='▶ INITIALIZE ACCESS';
      btn.style.color='var(--accent)';
      btn.style.borderColor='rgba(0,212,255,0.4)';
      btn.style.boxShadow='';
      btn.disabled=false;
      errEl.textContent='⚠ ACCESS DENIED — '+data.message;
      errEl.classList.add('show');
      
      var box=document.querySelector('.login-right');
      box.style.animation='shake 0.4s ease';
      setTimeout(function(){box.style.animation='';},400);
      if(loginAttempts>=5){
        btn.disabled=true;
        btn.textContent='[ ACCESS LOCKED ]';
        btn.style.color='var(--accent3)';
        errEl.textContent='⚠ SYSTEM LOCKED — Too many failed attempts';
        attEl.style.color='var(--accent3)';
      }
    }
  } catch(err){
    btn.textContent='▶ INITIALIZE ACCESS';
    btn.style.color='var(--accent)';
    btn.style.borderColor='rgba(0,212,255,0.4)';
    btn.disabled=false;
    errEl.textContent='⚠ SERVER ERROR — Is server running? (node server.js)';
    errEl.classList.add('show');
  }
}

async function doRegister(){
  const user=document.getElementById('reg-user').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const pass=document.getElementById('reg-pass').value.trim();
  const pass2=document.getElementById('reg-pass2').value.trim();
  const errEl=document.getElementById('reg-error');
  const sucEl=document.getElementById('reg-success');
  const btn=document.querySelector('#auth-register .login-btn');
  errEl.classList.remove('show');
  sucEl.classList.remove('show');

  // Frontend validation
  if(!user||!pass||!email||!pass2){
    errEl.textContent='⚠ All fields are required'; errEl.classList.add('show'); return;
  }
  if(user.length < 3){
    errEl.textContent='⚠ Username must be at least 3 characters'; errEl.classList.add('show'); return;
  }
  if(user.length > 20){
    errEl.textContent='⚠ Username too long — max 20 characters'; errEl.classList.add('show'); return;
  }
  if(/[^a-zA-Z0-9._\-]/.test(user)){
    errEl.textContent='⚠ Username can only contain letters, numbers, dots, underscores, hyphens'; errEl.classList.add('show'); return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    errEl.textContent='⚠ Enter a valid email address (e.g. user@gmail.com)'; errEl.classList.add('show'); return;
  }
  if(pass.length < 6){
    errEl.textContent='⚠ Password must be at least 6 characters'; errEl.classList.add('show'); return;
  }
  if(pass !== pass2){
    errEl.textContent='⚠ Passwords do not match — re-enter carefully'; errEl.classList.add('show'); return;
  }

  btn.textContent='[ REGISTERING... ]';
  btn.disabled=true;

  try {
    var res = await fetch(API_URL+'/auth/register', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ username:user, email:email, password:pass })
    });
    var data = await res.json();

    if(data.success){
      sucEl.textContent='✓ Account created — Switching to login...';
      sucEl.classList.add('show');
      btn.textContent='+ REGISTER OPERATOR';
      btn.disabled=false;
      setTimeout(function(){
        document.getElementById('login-user').value = user;
        document.getElementById('login-pass').value = '';
        document.querySelectorAll('.auth-tab')[0].click();
      }, 1500);
    } else {
      errEl.textContent='⚠ '+data.message;
      errEl.classList.add('show');
      btn.textContent='+ REGISTER OPERATOR';
      btn.disabled=false;
    }
  } catch(err){
    errEl.textContent='⚠ SERVER ERROR — Is server running? (node server.js)';
    errEl.classList.add('show');
    btn.textContent='+ REGISTER OPERATOR';
    btn.disabled=false;
  }
}


document.addEventListener('keydown',function(e){
  if(e.key==='Enter'){
    var ov=document.getElementById('login-overlay');
    if(ov&&ov.classList.contains('show')){
      var regTab=document.getElementById('auth-register');
      if(regTab&&regTab.classList.contains('active')){doRegister();}
      else{doLogin();}
      return;
    }
    // Enter on module inputs triggers scan
    var active=document.activeElement;
    if(!active)return;
    var id=active.id;
    var map={
      'username-input': runUsernameLookup,
      'ip-input':       runIPRecon,
      'email-input':    runEmailIntel,
      'phone-input':    runPhoneLookup,
      'hash-input':     runHashIdentify,
      'dork-input':     runDorkGen,
      'whois-input':    runWhoisLookup,
      'dns-input':      runDNSLookup,
      'login-user':     doLogin,
      'login-pass':     doLogin,
      'reg-user':       doRegister,
      'reg-pass':       doRegister,
      'reg-pass2':      doRegister,
    };
    // Also handle suggest-item keyboard nav
    var openList=document.querySelector('.suggest-list.open');
    if(openList){
      var activeItem=openList.querySelector('.suggest-item.active');
      if(activeItem){
        var val=activeItem.querySelector('.suggest-item-text').textContent;
        var wrap=openList.closest('.suggest-wrap');
        var inp=wrap?wrap.querySelector('.suggest-input'):null;
        if(inp){inp.value=val;closeAllSuggests();}
        e.preventDefault();return;
      }
    }
    if(map[id]){e.preventDefault();closeAllSuggests();map[id]();}
  }
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
    var openList=document.querySelector('.suggest-list.open');
    if(!openList)return;
    e.preventDefault();
    var items=openList.querySelectorAll('.suggest-item');
    if(!items.length)return;
    var cur=openList.querySelector('.suggest-item.active');
    var idx2=cur?Array.from(items).indexOf(cur):-1;
    if(e.key==='ArrowDown')idx2=Math.min(idx2+1,items.length-1);
    else idx2=Math.max(idx2-1,0);
    items.forEach(function(it){it.classList.remove('active');});
    items[idx2].classList.add('active');
    items[idx2].scrollIntoView({block:'nearest'});
  }
  if(e.key==='Escape'){closeAllSuggests();}
});

// ===== SUGGEST SYSTEM =====
var suggestDB = {}; // {username:[], ip:[], email:[], phone:[], dork:[], hash:[]}

// Predefined suggestions per module
var SUGGEST_PRESETS = {
  'username': ['admin','root','user','test','guest','johndoe','info','support'],
  'ip':       ['8.8.8.8','1.1.1.1','192.168.1.1','10.0.0.1'],
  'email':    ['admin@','info@','support@','contact@','noreply@'],
  'phone':    [],
  'dork':     [],
  'hash':     ['5f4dcc3b5aa765d61d8327deb882cf99','da39a3ee5e6b4b0d3255bfef95601890afd80709'],
};

function initSuggest(mod, inputId){
  var inp=document.getElementById(inputId);
  if(!inp)return;
  var listEl=document.getElementById('suggest-'+mod);
  if(!listEl)return;

  inp.addEventListener('input', function(){
    showSuggestions(mod, inp, listEl);
  });
  inp.addEventListener('focus', function(){
    if(inp.value.trim().length>0)showSuggestions(mod, inp, listEl);
  });
  // Close on outside click
  document.addEventListener('click', function(e){
    if(!inp.contains(e.target)&&!listEl.contains(e.target))closeSuggest(listEl);
  }, true);
}

function getSuggestions(mod, query){
  var q=query.toLowerCase().trim();
  if(!q)return [];
  var hist=(suggestDB[mod]||[]).filter(function(h){return h.toLowerCase().includes(q)&&h.toLowerCase()!==q;});
  var presets=(SUGGEST_PRESETS[mod]||[]).filter(function(p){return p.toLowerCase().startsWith(q)&&hist.indexOf(p)===-1;});
  // Combine: history first, then presets, max 8
  var all=[].concat(hist.map(function(h){return{val:h,type:'HISTORY'};}))
           .concat(presets.map(function(p){return{val:p,type:'PRESET'};}));
  return all.slice(0,8);
}

function showSuggestions(mod, inp, listEl){
  var suggestions=getSuggestions(mod, inp.value);
  if(!suggestions.length){closeSuggest(listEl);return;}
  listEl.innerHTML='';
  suggestions.forEach(function(s){
    var item=document.createElement('div');
    item.className='suggest-item';
    item.innerHTML=
      '<span class="suggest-item-type">'+s.type+'</span>'
      +'<span class="suggest-item-text">'+escapeHtml(s.val)+'</span>'
      +'<span class="suggest-item-x" title="Remove">&#x2715;</span>';

    // Click on text area fills input
    item.querySelector('.suggest-item-text').addEventListener('mousedown', function(e){
      e.preventDefault();
      inp.value=s.val;
      closeSuggest(listEl);
      inp.focus();
    });
    item.querySelector('.suggest-item-type').addEventListener('mousedown', function(e){
      e.preventDefault();
      inp.value=s.val;
      closeSuggest(listEl);
      inp.focus();
    });

    // Click on X removes from history
    item.querySelector('.suggest-item-x').addEventListener('mousedown', function(e){
      e.preventDefault();
      e.stopPropagation();
      if(suggestDB[mod]){
        suggestDB[mod]=suggestDB[mod].filter(function(v){return v!==s.val;});
      }
      showSuggestions(mod, inp, listEl);
    });

    listEl.appendChild(item);
  });
  listEl.classList.add('open');
}

function closeSuggest(listEl){if(listEl)listEl.classList.remove('open');}
function closeAllSuggests(){document.querySelectorAll('.suggest-list').forEach(function(l){l.classList.remove('open');});}
function escapeHtml(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

// Save to suggestDB when scan runs
function saveSuggest(mod, val){
  if(!val||!val.trim())return;
  if(!suggestDB[mod])suggestDB[mod]=[];
  suggestDB[mod]=suggestDB[mod].filter(function(v){return v!==val;});
  suggestDB[mod].unshift(val);
  if(suggestDB[mod].length>20)suggestDB[mod].pop();
  // Persist to localStorage
  try{ localStorage.setItem('pe_hist_'+mod, JSON.stringify(suggestDB[mod])); }catch(e){}
}

// Load suggest history from localStorage on startup
(function(){
  ['username','ip','email','phone','dork','hash','whois','dns'].forEach(function(mod){
    try{
      var saved = localStorage.getItem('pe_hist_'+mod);
      if(saved) suggestDB[mod] = JSON.parse(saved);
    }catch(e){}
  });
})();

// Init all suggest inputs after DOM ready
window.addEventListener('DOMContentLoaded', function(){
  initSuggest('username','username-input');
  initSuggest('ip','ip-input');
  initSuggest('email','email-input');
  initSuggest('phone','phone-input');
  initSuggest('dork','dork-input');
  initSuggest('hash','hash-input');
  // Render dashboard if already logged in (refresh case)
  if(localStorage.getItem('pe_logged_in')==='1'){
    renderDashboard();
  }
});

// ===== BOOT SEQUENCE =====
function startBootSequence(){
  var screen=document.getElementById('boot-screen');
  var log=document.getElementById('boot-log');
  var bar=document.getElementById('boot-bar');
  var welcome=document.getElementById('boot-welcome');
  screen.classList.remove('hidden');

  // Set operator name dynamically
  var uname = localStorage.getItem('pe_username') || 'OPERATOR';
  var opEl = document.getElementById('header-operator');
  if(opEl) opEl.textContent = uname.toUpperCase();

  var lines=[
    ['tag','[SYS]  ','Initializing PhantomEye v2.0...'],
    ['ok','[OK]   ','Kernel modules loaded'],
    ['ok','[OK]   ','Secure channel established \u00B7 AES-256'],
    ['ok','[OK]   ','Loading intelligence modules...'],
    ['tag','[MOD]  ','Username Scanner .............. READY'],
    ['tag','[MOD]  ','IP/Domain Recon ................ READY'],
    ['tag','[MOD]  ','Email Intelligence ............. READY'],
    ['tag','[MOD]  ','Metadata Extractor ............. READY'],
    ['tag','[MOD]  ','Phone Lookup ................... READY'],
    ['tag','[MOD]  ','Google Dork Generator .......... READY'],
    ['tag','[MOD]  ','Risk Score Aggregator .......... READY'],
    ['ok','[OK]   ','All 11 modules operational'],
    ['ok','[OK]   ','Session authenticated \u2014 '+uname.toUpperCase()],
    ['ok','[BOOT] ','System ready'],
  ];
  var delays=[0,200,350,500,700,850,980,1100,1220,1340,1450,1560,1750,1950];
  lines.forEach(function(line,idx){
    setTimeout(function(){
      var div=document.createElement('div');
      div.className='boot-line';
      div.innerHTML='<span class="'+line[0]+'">'+line[1]+'</span>'+line[2];
      log.appendChild(div);
      bar.style.width=((idx+1)/lines.length*100)+'%';
      log.scrollTop=log.scrollHeight;
    },delays[idx]);
  });
  setTimeout(function(){
    welcome.style.opacity='1';
    setTimeout(function(){
      screen.style.opacity='0';
      screen.style.transition='opacity 0.5s';
      setTimeout(function(){
        screen.classList.add('hidden');
        screen.style.opacity='';
        screen.style.transition='';
        // Show dashboard first
        switchTab('dashboard', document.querySelector('[data-panel="dashboard"]'));
        startSessionTimer();
      },500);
    },900);
  },2200);
}

// ===== SESSION TIMER =====
function startSessionTimer(){
  var secs=0;
  setInterval(function(){
    secs++;
    var h=String(Math.floor(secs/3600)).padStart(2,'0');
    var m=String(Math.floor((secs%3600)/60)).padStart(2,'0');
    var s=String(secs%60).padStart(2,'0');
    var el=document.getElementById('session-timer');
    if(el)el.textContent=h+':'+m+':'+s;
    // Every 2 minutes — verify token still valid (catches deleted users)
    if(secs%120===0) verifySessionAlive();
  },1000);
}

function verifySessionAlive(){
  var token = localStorage.getItem('pe_token');
  if(!token) return;
  fetch(API_URL+'/auth/verify', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({ token: token })
  }).then(function(r){ return r.json(); }).then(function(data){
    if(!data.success){
      // User deleted or token invalid — force logout
      localStorage.removeItem('pe_logged_in');
      localStorage.removeItem('pe_token');
      localStorage.removeItem('pe_username');
      localStorage.removeItem('pe_created');
      showToast('Session expired — please login again','error');
      setTimeout(function(){ location.reload(); }, 2000);
    }
  }).catch(function(){ /* server down — ignore */ });
}

// ===== CLOCK =====
function getTime(){return new Date().toTimeString().split(' ')[0];}
setInterval(function(){var el=document.getElementById('clock');if(el)el.textContent=getTime();},1000);
(function(){var el=document.getElementById('clock');if(el)el.textContent=getTime();})();

// ===== SCAN COUNTER =====
var totalScans=0;
function showError(containerId, msg){
  var div = document.getElementById(containerId);
  if(!div) return;
  div.style.display='block';
  div.innerHTML = '<div style="display:flex;align-items:flex-start;gap:12px;padding:14px 16px;background:rgba(255,107,53,0.06);border:1px solid rgba(255,107,53,0.35);border-left:3px solid var(--accent3);border-radius:8px;font-family:Share Tech Mono,monospace;font-size:13px;color:var(--accent3);line-height:1.6;">'
    +'<span style="font-size:18px;margin-top:-1px;">⚠</span>'
    +'<div>'+msg+'</div>'
    +'</div>';
}

function incrementScanCount(){
  totalScans++;
  var el=document.getElementById('scan-count');
  if(el)el.textContent=totalScans;
}

function setBtn(id,loading){
  var btn=document.getElementById(id+'-btn');if(!btn)return;
  var labels={username:'SCAN →',ip:'RECON →',email:'ANALYZE →',meta:'EXTRACT →',phone:'LOOKUP →',dork:'GENERATE →',hash:'IDENTIFY →'};
  btn.classList.toggle('loading',loading);
  btn.textContent=loading?'LOADING...':(labels[id]||'RUN →');
  if(loading){
    var area=document.getElementById(id+'-results');
    if(area&&area.querySelector('.results-placeholder')){
      area.innerHTML='<div style="padding:6px 0;">'
        +'<div class="skeleton skeleton-line long"></div>'
        +'<div class="skeleton skeleton-line medium"></div>'
        +'<div class="skeleton skeleton-block"></div>'
        +'<div class="skeleton skeleton-line long"></div>'
        +'<div class="skeleton skeleton-line short"></div>'
        +'</div>';
    }
  }
}

function showProgress(id,show){
  var bar=document.getElementById(id+'-progress');
  if(bar)bar.style.display=show?'block':'none';
}

function setProgress(id,pct){
  var fill=document.getElementById(id+'-progress-fill');
  if(fill)fill.style.width=pct+'%';
}

// ===== UTILS =====
function delay(ms){return new Promise(function(r){setTimeout(r,ms);});}
function formatBytes(b){if(!b||b===0)return'0 B';if(b<1024)return b+' B';if(b<1048576)return(b/1024).toFixed(2)+' KB';if(b<1073741824)return(b/1048576).toFixed(2)+' MB';return(b/1073741824).toFixed(2)+' GB';}

function addLog(elId,type,msg){
  var el=document.getElementById(elId);
  if(!el)return;
  el.style.display='block';
  var line=document.createElement('div');
  line.style.cssText='font-family:Share Tech Mono,monospace;font-size:12px;padding:2px 0;';
  line.style.color=type==='info'?'var(--accent)':type==='error'?'var(--accent3)':'var(--text2)';
  line.textContent=(type==='info'?'[INFO] ':type==='error'?'[ERR]  ':'[LOG]  ')+msg;
  el.appendChild(line);
  el.scrollTop=el.scrollHeight;
}

// ===== RENDER SECTION =====
function renderSection(container, s){
  var wrap=document.createElement('div');
  wrap.className='result-section';
  wrap.style.marginBottom='18px';
  var title=document.createElement('div');
  title.className='result-section-title';
  title.textContent=s.title;
  wrap.appendChild(title);
  var table=document.createElement('table');
  table.className='result-table';
  (s.rows||[]).forEach(function(row){
    var tr=document.createElement('tr');
    var td1=document.createElement('td');
    td1.className='result-key';
    td1.textContent=row[0];
    var td2=document.createElement('td');
    td2.className='result-val';
    td2.innerHTML=row[1]||'—';
    tr.appendChild(td1);
    tr.appendChild(td2);
    table.appendChild(tr);
  });
  wrap.appendChild(table);
  container.appendChild(wrap);
}

// ===== TABS =====
function goModule(name){
  var btn = document.querySelector('[data-panel="'+name+'"]');
  if(btn) switchTab(name, btn);
}

// ===== 429 RATE LIMIT HANDLER =====
function handle429(response, module){
  if(response && response.status === 429){
    showToast('⚠ Too many requests — wait 60 seconds before scanning again.', 'error');
    if(module) showError(module+'-results', '⚠ Rate limit reached — Too many requests. Please wait 60 seconds and try again.');
    return true;
  }
  return false;
}
function switchTab(name,btn){
  document.querySelectorAll('.sidebar-btn').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.tab').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.panel').forEach(function(p){p.classList.remove('active');});
  btn.classList.add('active');
  document.querySelectorAll('[data-panel="'+name+'"]').forEach(function(el){el.classList.add('active');});
  document.getElementById('panel-'+name).classList.add('active');
  if(name==='risk')refreshRiskPanel();
  if(name==='history')renderHistoryPanel();
  if(name==='dashboard')renderDashboard();
}

// ===== THEME =====

// ===== RESULT DATA =====
var resultData={username:null,ip:null,email:null,meta:null,phone:null,dork:null,hash:null,whois:null,dns:null,risk:null};

// ===== SCAN HISTORY =====
var scanHistory=[];
try{var _sh=localStorage.getItem('pe_scan_history');if(_sh)scanHistory=JSON.parse(_sh);}catch(e){}

function addToHistory(module,label,summary){
  var entry={id:Date.now(),module:module,label:label,summary:summary,
    time:new Date().toLocaleString('en-IN',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit',hour12:true})};
  scanHistory.unshift(entry);
  if(scanHistory.length>50)scanHistory.pop();
  try{localStorage.setItem('pe_scan_history',JSON.stringify(scanHistory));}catch(e){}
}

function renderHistoryPanel(){
  var div=document.getElementById('history-body');
  if(!div)return;
  if(scanHistory.length===0){
    div.innerHTML='<div style="text-align:center;padding:60px 20px;color:var(--text2);font-family:Share Tech Mono,monospace;">'
      +'<div style="font-size:40px;margin-bottom:16px;">🕘</div>'
      +'<div style="font-size:14px;letter-spacing:2px;">NO SCAN HISTORY YET</div>'
      +'<div style="font-size:12px;margin-top:8px;color:rgba(160,184,200,0.5);">Run any module scan to see history here</div>'
      +'</div>';
    return;
  }
  var mIcons={username:'👤',ip:'🌐',email:'📧',meta:'🗂',phone:'📱',dork:'🔎',hash:'#',whois:'📋',dns:'📡',risk:'⚠'};
  var mColors={username:'var(--accent)',ip:'var(--accent)',email:'var(--accent2)',meta:'var(--warn)',phone:'var(--accent2)',dork:'var(--accent)',hash:'var(--accent3)',whois:'var(--accent)',dns:'var(--accent2)',risk:'var(--accent3)'};
  var html='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">'
    +'<div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text2);">'+scanHistory.length+' scan(s) recorded</div>'
    +'<button class="btn" onclick="clearHistory()" style="padding:5px 14px;font-size:11px;border-color:rgba(255,107,53,0.4);color:var(--accent3);">[X] CLEAR ALL</button>'
    +'</div>';
  html+='<div style="display:flex;flex-direction:column;gap:8px;">';
  scanHistory.forEach(function(entry){
    var icon=mIcons[entry.module]||'[?]';
    var color=mColors[entry.module]||'var(--accent)';
    var panel=entry.module;
    html+='<div style="display:flex;align-items:center;gap:14px;padding:12px 16px;background:var(--bg2);border:1px solid var(--border);border-left:3px solid '+color+';border-radius:8px;cursor:pointer;" '
      +'onclick="switchTab(\''+panel+'\',document.querySelector(\'[data-panel=\\\"'+panel+'\\\"]\'))">'
      +'<span style="font-size:20px;">'+icon+'</span>'
      +'<div style="flex:1;">'
      +'<div style="font-family:Share Tech Mono,monospace;font-size:13px;color:var(--text);">'+escapeHtml(entry.label)+'</div>'
      +'<div style="font-family:Share Tech Mono,monospace;font-size:11px;color:var(--text2);margin-top:3px;">'+escapeHtml(entry.summary)+'</div>'
      +'</div>'
      +'<div style="text-align:right;">'
      +'<div style="font-size:11px;color:'+color+';letter-spacing:1px;font-family:Share Tech Mono,monospace;">'+entry.module.toUpperCase()+'</div>'
      +'<div style="font-size:10px;color:var(--text2);margin-top:3px;font-family:Share Tech Mono,monospace;">'+entry.time+'</div>'
      +'</div>'
      +'</div>';
  });
  html+='</div>';
  div.innerHTML=html;
}

function clearHistory(){
  scanHistory=[];
  try{localStorage.removeItem('pe_scan_history');}catch(e){}
  renderHistoryPanel();
  showToast('Scan history cleared','info');
}

// ===== DASHBOARD =====
function renderDashboard(){
  var div=document.getElementById('dashboard-body');
  if(!div)return;

  var uname=(localStorage.getItem('pe_username')||'OPERATOR').toUpperCase();
  var created=localStorage.getItem('pe_created')||'N/A';

  // Module status
  var modules=[
    {key:'username',label:'Username Lookup',icon:'👤'},
    {key:'ip',label:'IP / Domain Recon',icon:'🌐'},
    {key:'email',label:'Email Intelligence',icon:'📧'},
    {key:'meta',label:'Metadata Extractor',icon:'🗂'},
    {key:'phone',label:'Phone Lookup',icon:'📱'},
    {key:'dork',label:'Dork Generator',icon:'🔎'},
    {key:'hash',label:'Hash Identifier',icon:'#'},
    {key:'whois',label:'WHOIS Lookup',icon:'📋'},
    {key:'dns',label:'DNS Lookup',icon:'📡'},
  ];

  var scanned=modules.filter(function(m){return resultData[m.key]!==null;}).length;
  var histCount=scanHistory.length;

  var html='';

  // Welcome banner
  html+='<div style="background:linear-gradient(135deg,rgba(0,212,255,0.06),rgba(0,255,136,0.04));border:1px solid rgba(0,212,255,0.2);border-radius:12px;padding:24px 28px;margin-bottom:20px;display:flex;align-items:center;gap:20px;">'
    +'<div style="font-size:48px;">👁</div>'
    +'<div>'
    +'<div style="font-family:Orbitron,monospace;font-size:20px;font-weight:700;color:var(--accent);letter-spacing:3px;">WELCOME, '+uname+'</div>'
    +'<div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text2);margin-top:6px;letter-spacing:2px;">PhantomEye OSINT Intelligence Platform — Session Active</div>'
    +'<div style="font-family:Share Tech Mono,monospace;font-size:11px;color:rgba(0,212,255,0.4);margin-top:4px;">Registered: '+created+'</div>'
    +'</div>'
    +'</div>';

  // Stats row — only non-duplicate stats (session & scans already in header)
  html+='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:20px;">';

  var stats=[
    {label:'MODULES USED',value:scanned+' / 9',color:'var(--accent2)',icon:'⚙'},
    {label:'HISTORY ENTRIES',value:histCount,color:'var(--accent3)',icon:'🕘'},
  ];

  stats.forEach(function(s){
    html+='<div style="background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:16px;text-align:center;">'
      +'<div style="font-size:24px;margin-bottom:8px;">'+s.icon+'</div>'
      +'<div style="font-family:Orbitron,monospace;font-size:18px;font-weight:700;color:'+s.color+';">'+s.value+'</div>'
      +'<div style="font-family:Share Tech Mono,monospace;font-size:10px;color:var(--text2);margin-top:4px;letter-spacing:2px;">'+s.label+'</div>'
      +'</div>';
  });
  html+='</div>';

  // Module status grid
  html+='<div style="margin-bottom:20px;">'
    +'<div style="font-family:Share Tech Mono,monospace;font-size:11px;color:var(--accent2);letter-spacing:3px;margin-bottom:12px;">// MODULE STATUS</div>'
    +'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:8px;">';

  modules.forEach(function(m){
    var done=resultData[m.key]!==null;
    var color=done?'var(--accent2)':'var(--text2)';
    var bg=done?'rgba(0,255,136,0.05)':'transparent';
    var border=done?'rgba(0,255,136,0.2)':'var(--border)';
    var status=done?'✓ SCANNED':'○ PENDING';
    html+='<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:'+bg+';border:1px solid '+border+';border-radius:7px;cursor:pointer;" '
      +'onclick="goModule(\''+m.key+'\')">'
      +'<span>'+m.icon+'</span>'
      +'<span style="flex:1;font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text);">'+m.label+'</span>'
      +'<span style="font-family:Share Tech Mono,monospace;font-size:10px;color:'+color+';">'+status+'</span>'
      +'</div>';
  });

  html+='</div></div>';

  // Recent history
  if(scanHistory.length>0){
    html+='<div>'
      +'<div style="font-family:Share Tech Mono,monospace;font-size:11px;color:var(--accent2);letter-spacing:3px;margin-bottom:12px;">// RECENT SCANS</div>'
      +'<div style="display:flex;flex-direction:column;gap:6px;">';
    var mIcons={username:'👤',ip:'🌐',email:'📧',meta:'🗂',phone:'📱',dork:'🔎',hash:'#',whois:'📋',dns:'📡',risk:'⚠'};
    var mColors={username:'var(--accent)',ip:'var(--accent)',email:'var(--accent2)',meta:'var(--warn)',phone:'var(--accent2)',dork:'var(--accent)',hash:'var(--accent3)',whois:'var(--accent)',dns:'var(--accent2)',risk:'var(--accent3)'};
    scanHistory.slice(0,5).forEach(function(entry){
      var icon=mIcons[entry.module]||'[?]';
      var color=mColors[entry.module]||'var(--accent)';
      html+='<div style="display:flex;align-items:center;gap:12px;padding:10px 14px;background:var(--bg2);border:1px solid var(--border);border-left:3px solid '+color+';border-radius:7px;cursor:pointer;" '
        +'onclick="goModule(\''+entry.module+'\')">'
        +'<span>'+icon+'</span>'
        +'<div style="flex:1;">'
        +'<div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text);">'+escapeHtml(entry.label)+'</div>'
        +'<div style="font-family:Share Tech Mono,monospace;font-size:11px;color:var(--text2);">'+escapeHtml(entry.summary)+'</div>'
        +'</div>'
        +'<div style="font-family:Share Tech Mono,monospace;font-size:10px;color:var(--text2);">'+entry.time+'</div>'
        +'</div>';
    });
    html+='</div>'
      +'<div style="margin-top:10px;text-align:right;">'
      +'<button class="btn" onclick="goModule(\'history\')" style="padding:5px 14px;font-size:11px;">VIEW ALL →</button>'
      +'</div></div>';
  }

  div.innerHTML=html;
}

// ===== USERNAME =====
var PLATFORMS=[
  {name:'GitHub',url:'https://github.com/{u}',icon:'🐙'},
  {name:'Twitter/X',url:'https://x.com/{u}',icon:'🐦'},
  {name:'Instagram',url:'https://instagram.com/{u}',icon:'📸'},
  {name:'Reddit',url:'https://reddit.com/u/{u}',icon:'🤖'},
  {name:'LinkedIn',url:'https://linkedin.com/in/{u}',icon:'💼'},
  {name:'TikTok',url:'https://tiktok.com/@{u}',icon:'🎵'},
  {name:'YouTube',url:'https://youtube.com/@{u}',icon:'▶️'},
  {name:'Pinterest',url:'https://pinterest.com/{u}',icon:'📌'},
  {name:'Twitch',url:'https://twitch.tv/{u}',icon:'🎮'},
  {name:'Snapchat',url:'https://snapchat.com/add/{u}',icon:'👻'},
  {name:'Telegram',url:'https://t.me/{u}',icon:'✈️'},
  {name:'Medium',url:'https://medium.com/@{u}',icon:'✍️'},
  {name:'Dev.to',url:'https://dev.to/{u}',icon:'💻'},
  {name:'GitLab',url:'https://gitlab.com/{u}',icon:'🦊'},
  {name:'Patreon',url:'https://patreon.com/{u}',icon:'🎁'},
  {name:'Spotify',url:'https://open.spotify.com/user/{u}',icon:'🎧'},
  {name:'SoundCloud',url:'https://soundcloud.com/{u}',icon:'🎶'},
  {name:'Behance',url:'https://behance.net/{u}',icon:'🎨'},
  {name:'Dribbble',url:'https://dribbble.com/{u}',icon:'🏀'},
  {name:'Flickr',url:'https://flickr.com/people/{u}',icon:'🖼️'},
];
async function runUsernameLookup(){
  var username=document.getElementById('username-input').value.trim();
  if(!username){showError('username-results','Enter a username to scan.');return;}
  if(username.length<2){showError('username-results','Username must be at least 2 characters.');return;}
  if(username.length>50){showError('username-results','Username too long — max 50 characters.');return;}
  if(/\s/.test(username)){showError('username-results','Username cannot contain spaces.');return;}
  if(/[^a-zA-Z0-9._\-]/.test(username)){showError('username-results','Username can only contain letters, numbers, dots, underscores, hyphens.');return;}
  incrementScanCount();saveSuggest('username',username);
  setBtn('username',true);showProgress('username',true);
  var logEl=document.getElementById('username-log');logEl.innerHTML='';logEl.style.display='none';
  document.getElementById('username-stats').style.display='none';
  document.getElementById('username-actions').style.display='none';
  addLog('username-log','info','Scanning: "'+username+'"');
  var resultsDiv=document.getElementById('username-results');resultsDiv.innerHTML='';
  setProgress('username',20);

  resultsDiv.innerHTML='<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:13px;padding:10px;">⟳ Checking platforms... (this may take 10-15 seconds)</div>';

  try {
    var r = await fetch(API_URL+'/username/check/'+encodeURIComponent(username));
    if(handle429(r,'username')){setBtn('username',false);showProgress('username',false);return;}
    var data = await r.json();

    if(!data.success) throw new Error('failed');
    setProgress('username', 80);

    resultsDiv.innerHTML = '';
    var grid = document.createElement('div'); grid.className = 'platform-grid';
    resultsDiv.appendChild(grid);


    // Render real checked platforms
    data.results.forEach(function(p){
      var el = document.createElement('div');
      if(p.found){
        el.className = 'platform-item found';
        el.style.cursor = 'pointer';
        el.innerHTML = '<span>✅</span><span class="platform-name">'+p.name+'</span><span style="font-size:12px;color:var(--accent);">→</span>';
        el.onclick = function(){ window.open(p.url, '_blank'); };
        addLog('username-log','','[FOUND] '+p.name);
      } else {
        el.className = 'platform-item not-found';
        el.innerHTML = '<span>❌</span><span class="platform-name">'+p.name+'</span>';
      }
      grid.appendChild(el);
    });

    // Link-only platforms section
    if(data.linkOnly && data.linkOnly.length){
      var linkHeader = document.createElement('div');
      linkHeader.style.cssText = 'margin-top:14px;font-size:11px;color:var(--accent);letter-spacing:3px;font-family:Share Tech Mono,monospace;padding:8px 0 6px;border-top:1px solid var(--border);';
      linkHeader.textContent = '// MANUAL CHECK — Click to verify';
      resultsDiv.appendChild(linkHeader);
      var linkGrid = document.createElement('div'); linkGrid.className = 'platform-grid';
      resultsDiv.appendChild(linkGrid);
      data.linkOnly.forEach(function(p){
        var el = document.createElement('div');
        el.className = 'platform-item';
        el.style.cssText = 'border-color:rgba(255,204,0,0.2);cursor:pointer;';
        el.innerHTML = '<span class="platform-name">'+p.name+'</span><span style="font-size:12px;color:var(--accent);opacity:0.7;">→</span>';
        el.onclick = function(){ window.open(p.url, '_blank'); };
        linkGrid.appendChild(el);
      });
    }

    setProgress('username',100);
    var found = data.stats.found;
    var total = data.stats.checked;
    document.getElementById('stat-total').textContent = total + data.linkOnly.length;
    document.getElementById('stat-found').textContent = found;
    document.getElementById('stat-notfound').textContent = total - found;
    document.getElementById('username-stats').style.display='flex';
    addLog('username-log','info','Done. '+found+'/'+total+' confirmed found.');
    resultData.username={username:username,found:found,total:total,timestamp:new Date().toISOString()};
    addToHistory('username', username, found+'/'+total+' platforms found');

  } catch(e) {
    setProgress('username',100);
    resultsDiv.innerHTML = '<div style="color:var(--accent3);font-family:Share Tech Mono,monospace;font-size:13px;padding:10px;">⚠ Check failed — Is server running? (node server.js)</div>';
  }

  setBtn('username',false);showProgress('username',false);
  document.getElementById('username-actions').style.display='flex';
  if(window.triggerGlitch)triggerGlitch();
  updateRiskFromData();
}
// ===== IP RECON =====
async function runIPRecon(){
  var target=document.getElementById('ip-input').value.trim();
  if(!target){showError('ip-results','Enter an IP address or domain name.');return;}
  // Strip protocol
  target = target.replace(/^https?:\/\//,'').replace(/\/.*/,'').toLowerCase();
  var isIP=/^(\d{1,3}\.){3}\d{1,3}$/.test(target);
  var isDomain=/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(target);
  if(!isIP && !isDomain){showError('ip-results','Invalid input — enter a valid IP (e.g. 8.8.8.8) or domain (e.g. google.com).');return;}
  if(isIP){
    var parts=target.split('.').map(Number);
    if(parts.some(function(p){return p>255;})){showError('ip-results','Invalid IP address — each octet must be 0–255.');return;}
  }
  incrementScanCount();saveSuggest('ip',target);setBtn('ip',true);showProgress('ip',true);setProgress('ip',10);
  var resultsDiv=document.getElementById('ip-results');
  resultsDiv.innerHTML='<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:14px;padding:10px">⟳ Querying IPInfo...</div>';
  var q=target.replace(/^https?:\/\//,'').replace(/\/$/,'').split('/')[0];
  setProgress('ip',40);
  try{
    var r = await fetch(API_URL+'/ip/lookup/'+encodeURIComponent(q));
    if(handle429(r,'ip')){setBtn('ip',false);showProgress('ip',false);return;}
    var resp = await r.json();
    if(!resp.success) throw new Error('fail');
    var d = resp.data;
    setProgress('ip',100);

    // Normalize ipinfo data to match render function
    var loc = (d.loc||'0,0').split(',');
    var normalized = {
      query: d.ip,
      country: d.country||'N/A',
      countryCode: d.country||'N/A',
      regionName: d.region||'N/A',
      city: d.city||'N/A',
      zip: d.postal||'N/A',
      lat: loc[0]||'N/A',
      lon: loc[1]||'N/A',
      timezone: d.timezone||'N/A',
      isp: d.org||'N/A',
      org: d.org||'N/A',
      as: d.org||'N/A',
      reverse: d.hostname||'N/A',
      mobile: false,
      proxy: false,
      hosting: d.bogon||false,
      currency: d.currency||'N/A'
    };

    resultData.ip=normalized;
    addToHistory('ip', q, normalized.city+', '+normalized.country+' — '+normalized.isp);
    renderIPResults(normalized,q);
    document.getElementById('ip-actions').style.display='flex';
    updateRiskFromData();if(window.triggerGlitch)triggerGlitch();
  }catch(e){
    setProgress('ip',100);
    var isIP=/^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/.test(q);
    resultsDiv.innerHTML='<div style="font-family:Share Tech Mono,monospace;padding:10px">'
      +'<div style="color:var(--accent3);font-size:12px;letter-spacing:3px;margin-bottom:10px;">⚠ LOOKUP FAILED</div>'
      +'<div style="color:var(--text2);font-size:13px;">Check server is running: node server.js</div></div>';
  }
  setBtn('ip',false);showProgress('ip',false);
}
function renderIPResults(d,query){
  var div=document.getElementById('ip-results');div.innerHTML='';
  renderSection(div,{title:'NETWORK IDENTITY',rows:[['Query',query],['IP',d.query],['ISP',d.isp],['Org',d.org],['ASN',d.as],['Reverse',d.reverse||'N/A']]});
  renderSection(div,{title:'GEOLOCATION',rows:[['Country',d.country+' ('+d.countryCode+')'],['Region',d.regionName],['City',d.city],['ZIP',d.zip||'N/A'],['Coords',d.lat+', '+d.lon],['Timezone',d.timezone]]});
  renderSection(div,{title:'THREAT INTEL',rows:[['Mobile',d.mobile?'⚠ YES':'✓ NO'],['Proxy/VPN',d.proxy?'⚠ YES':'✓ NO'],['Hosting',d.hosting?'⚠ YES':'✓ NO']]});
  renderIPMap(d, div);
  // Port scanner section
  scanPorts(query, div);
  var isIP=/^[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}$/.test(query);
  if(!isIP)fetchSubdomains(query,div);
}

async function scanPorts(query, parentDiv){
  var wrap = document.createElement('div');
  wrap.style.cssText = 'margin-bottom:18px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;overflow:hidden;';
  wrap.innerHTML = '<div style="font-size:11px;color:var(--accent2);letter-spacing:3px;padding:10px 14px;border-bottom:1px solid var(--border);font-family:Share Tech Mono,monospace;">// PORT & SERVICE SCANNER</div>'
    + '<div id="port-scan-body" style="padding:12px 14px;color:var(--text2);font-family:Share Tech Mono,monospace;font-size:13px;">⟳ Checking common services...</div>';
  parentDiv.appendChild(wrap);

  // Common web-accessible services to check via HTTP fetch
  var services = [
    { port: 80,   service: 'HTTP',         url: function(h){ return 'http://'+h+':80'; } },
    { port: 443,  service: 'HTTPS',        url: function(h){ return 'https://'+h+':443'; } },
    { port: 8080, service: 'HTTP Alt',     url: function(h){ return 'http://'+h+':8080'; } },
    { port: 8443, service: 'HTTPS Alt',    url: function(h){ return 'https://'+h+':8443'; } },
    { port: 3000, service: 'Dev Server',   url: function(h){ return 'http://'+h+':3000'; } },
    { port: 8888, service: 'Jupyter/Dev',  url: function(h){ return 'http://'+h+':8888'; } },
    { port: 2082, service: 'cPanel',       url: function(h){ return 'http://'+h+':2082'; } },
    { port: 2083, service: 'cPanel SSL',   url: function(h){ return 'https://'+h+':2083'; } },
  ];

  // Non-HTTP ports — shown as "unknown" (cannot check from browser)
  var nonHttpPorts = [
    { port: 21,    service: 'FTP',         note: 'TCP only' },
    { port: 22,    service: 'SSH',         note: 'TCP only' },
    { port: 23,    service: 'Telnet',      note: 'TCP only' },
    { port: 25,    service: 'SMTP',        note: 'TCP only' },
    { port: 53,    service: 'DNS',         note: 'TCP only' },
    { port: 110,   service: 'POP3',        note: 'TCP only' },
    { port: 143,   service: 'IMAP',        note: 'TCP only' },
    { port: 445,   service: 'SMB',         note: 'TCP only' },
    { port: 1433,  service: 'MSSQL',       note: 'TCP only' },
    { port: 3306,  service: 'MySQL',       note: 'TCP only' },
    { port: 3389,  service: 'RDP',         note: 'TCP only' },
    { port: 5432,  service: 'PostgreSQL',  note: 'TCP only' },
    { port: 5900,  service: 'VNC',         note: 'TCP only' },
    { port: 6379,  service: 'Redis',       note: 'TCP only' },
    { port: 27017, service: 'MongoDB',     note: 'TCP only' },
    { port: 1521,  service: 'Oracle DB',   note: 'TCP only' },
  ];

  // Check HTTP-accessible ports using fetch with short timeout
  var results = await Promise.all(services.map(async function(s){
    try{
      var controller = new AbortController();
      var timer = setTimeout(function(){ controller.abort(); }, 3000);
      await fetch(s.url(query), { method:'HEAD', mode:'no-cors', signal: controller.signal });
      clearTimeout(timer);
      return { port: s.port, service: s.service, status: 'open' };
    }catch(e){
      if(e.name === 'AbortError'){
        return { port: s.port, service: s.service, status: 'closed' };
      }
      // Network error = port exists but CORS blocked = likely open!
      if(e.message && (e.message.includes('Failed to fetch') || e.message.includes('fetch'))){
        return { port: s.port, service: s.service, status: 'open' };
      }
      return { port: s.port, service: s.service, status: 'closed' };
    }
  }));

  var open = results.filter(function(p){ return p.status==='open'; });

  var html = '<div style="display:flex;gap:16px;margin-bottom:12px;font-size:12px;flex-wrap:wrap;">'
    + '<span style="color:var(--accent2);">HTTP Ports Checked: <b style="color:var(--text);">'+services.length+'</b></span>'
    + '<span style="color:var(--accent3);">Open: <b style="color:'+(open.length>0?'var(--accent3)':'var(--accent2)')+';">'+open.length+'</b></span>'
    + '</div>';

  // HTTP results
  html += '<div style="font-size:11px;color:var(--text2);letter-spacing:2px;margin-bottom:8px;">HTTP/HTTPS PORTS</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:5px;margin-bottom:14px;">';
  results.forEach(function(p){
    var isOpen = p.status === 'open';
    var color = isOpen ? 'var(--accent3)' : 'var(--text2)';
    var bg = isOpen ? 'rgba(255,107,53,0.08)' : 'transparent';
    var border = isOpen ? 'rgba(255,107,53,0.3)' : 'var(--border)';
    var icon = isOpen ? '🔴' : '⚫';
    html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:'+bg+';border:1px solid '+border+';border-radius:5px;">'
      + '<span>'+icon+'</span>'
      + '<span style="color:var(--accent);font-size:12px;min-width:40px;">'+p.port+'</span>'
      + '<span style="color:'+color+';font-size:12px;flex:1;">'+p.service+'</span>'
      + '<span style="color:'+color+';font-size:11px;font-weight:bold;">'+p.status.toUpperCase()+'</span>'
      + '</div>';
  });
  html += '</div>';

  // Non-HTTP ports info
  html += '<div style="font-size:11px;color:var(--text2);letter-spacing:2px;margin-bottom:8px;">TCP-ONLY PORTS (not checkable from browser)</div>';
  html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:5px;">';
  nonHttpPorts.forEach(function(p){
    html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 10px;background:transparent;border:1px solid var(--border);border-radius:5px;opacity:0.5;">'
      + '<span>❓</span>'
      + '<span style="color:var(--accent);font-size:12px;min-width:40px;">'+p.port+'</span>'
      + '<span style="color:var(--text2);font-size:12px;flex:1;">'+p.service+'</span>'
      + '<span style="color:var(--text2);font-size:11px;">UNKNOWN</span>'
      + '</div>';
  });
  html += '</div>';

  if(open.length > 0){
    html += '<div style="margin-top:12px;padding:10px 12px;background:rgba(255,107,53,0.06);border:1px solid rgba(255,107,53,0.2);border-radius:6px;">'
      + '<div style="color:var(--accent3);font-size:11px;letter-spacing:2px;margin-bottom:6px;">⚠ OPEN PORTS DETECTED</div>'
      + open.map(function(p){ return '<div style="color:var(--text);font-size:12px;font-family:Share Tech Mono,monospace;padding:2px 0;">Port '+p.port+' ('+p.service+')</div>'; }).join('')
      + '</div>';
  }

  document.getElementById('port-scan-body').innerHTML = html;
}

var _ipLeafletMap = null;

function renderIPMap(d, parentDiv){
  var lat = parseFloat(d.lat); var lon = parseFloat(d.lon);
  if(isNaN(lat)||isNaN(lon)||(lat===0&&lon===0)) return;

  var mapWrap = document.createElement('div');
  mapWrap.id = 'ip-map-wrap';
  mapWrap.innerHTML = '<div class="ip-map-header">// GEOLOCATION MAP — '+d.city+', '+d.country+'</div>'
    + '<div id="ip-map"></div>'
    + '<div class="ip-map-footer">'
    + '<span>'+lat.toFixed(4)+', '+lon.toFixed(4)+'</span>'
    + '<a href="https://www.google.com/maps?q='+lat+','+lon+'" target="_blank" style="color:var(--accent);text-decoration:none;">Open Google Maps →</a>'
    + '</div>';
  parentDiv.appendChild(mapWrap);

  setTimeout(function(){
    try {
      if(_ipLeafletMap){ _ipLeafletMap.remove(); _ipLeafletMap = null; }
      _ipLeafletMap = L.map('ip-map', {
        zoomControl: true,
        attributionControl: false,
        scrollWheelZoom: false
      }).setView([lat, lon], 10);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(_ipLeafletMap);

      var icon = L.divIcon({ className:'', html:'<div class="pe-marker"></div>', iconSize:[14,14], iconAnchor:[7,7], popupAnchor:[0,-12] });
      L.marker([lat,lon],{icon:icon}).addTo(_ipLeafletMap)
        .bindPopup('<div style="line-height:1.9;"><b style="color:#00d4ff;font-size:13px;">'+d.city+'</b><br><span style="color:#a0b8c8;">'+d.regionName+', '+d.country+'</span><br><span style="color:#00ff88;">'+d.query+'</span></div>')
        .openPopup();
    } catch(e){ console.log('Map error:', e); }
  }, 150);
}

async function fetchSubdomains(domain,parentDiv){
  var wrap=document.createElement('div');wrap.style.cssText='margin-top:14px;';
  wrap.innerHTML='<div style="font-size:11px;color:var(--accent2);letter-spacing:3px;margin-bottom:8px;border-bottom:1px solid var(--border);padding-bottom:6px;">// SUBDOMAIN ENUMERATION (crt.sh)</div><div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:13px;">⟳ Querying...</div>';
  parentDiv.appendChild(wrap);
  try{
    var res=await fetch('https://crt.sh/?q=%.'+domain+'&output=json');
    var data=await res.json();
    if(!data||!data.length)throw new Error('none');
    var raw=data.flatMap(function(c){return c.name_value.split('\n');});
    var subs=[...new Set(raw.map(function(s){return s.trim().toLowerCase();}).filter(function(s){return s.endsWith(domain)&&!s.startsWith('*')&&s!==domain;}))].sort();
    wrap.innerHTML='<div style="font-size:11px;color:var(--accent2);letter-spacing:3px;margin-bottom:8px;border-bottom:1px solid var(--border);padding-bottom:6px;">// SUBDOMAINS FOUND: '+subs.length+'</div>'
      +'<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:5px;max-height:240px;overflow-y:auto;margin-bottom:8px;">'
      +subs.map(function(s){return '<div style="display:flex;align-items:center;gap:8px;padding:5px 8px;background:var(--bg2);border:1px solid var(--border);border-radius:4px;font-family:Share Tech Mono,monospace;font-size:12px;"><span style="color:var(--accent2);">▸</span><span style="flex:1;word-break:break-all;">'+s+'</span><a href="https://'+s+'" target="_blank" style="color:var(--accent);text-decoration:none;">→</a></div>';}).join('')
      +'</div>'
      +'<div style="display:flex;gap:8px;"><button class="btn" onclick="navigator.clipboard.writeText(\''+subs.join('\\n')+'\').then(()=>showToast(\'Subdomains copied!\',\'success\'))" style="padding:5px 12px;font-size:12px;">COPY</button></div>';
  }catch(e){
    wrap.innerHTML='<div style="font-size:11px;color:var(--accent2);letter-spacing:3px;margin-bottom:6px;border-bottom:1px solid var(--border);padding-bottom:6px;">// SUBDOMAIN ENUMERATION</div><div style="color:var(--accent3);font-family:Share Tech Mono,monospace;font-size:13px;">⚠ No records found or crt.sh unreachable.</div>';
  }
}

// ===== EMAIL =====
async function runEmailIntel(){
  var email=document.getElementById('email-input').value.trim();
  if(!email){showError('email-results','Enter an email address to analyze.');return;}
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){showError('email-results','Invalid email format — use format: user@domain.com');return;}
  if(email.length>254){showError('email-results','Email address too long — max 254 characters.');return;}
  var parts=email.split('@');
  if(parts[0].length>64){showError('email-results','Email local part too long — max 64 characters before @');return;}
  if(!parts[1].includes('.')){showError('email-results','Invalid domain in email — must contain a dot (e.g. gmail.com)');return;}
  incrementScanCount();saveSuggest('email',email);setBtn('email',true);showProgress('email',true);setProgress('email',10);
  document.getElementById('email-results').innerHTML='<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:14px;padding:10px">⟳ Analyzing email...</div>';
  await delay(200); setProgress('email',25);

  var parts=email.split('@'); var user=parts[0]; var domain=parts[1];
  var tld=domain.split('.').pop();
  var free=['gmail.com','yahoo.com','hotmail.com','outlook.com','icloud.com','protonmail.com','tutanota.com','aol.com','live.com','mail.com'];
  var isFree=free.indexOf(domain.toLowerCase())!==-1;

  var isDisp=['tempmail','guerrillamail','mailinator','yopmail','trashmail','fakeinbox'].some(function(s){return domain.indexOf(s)!==-1;});

  // Fetch real MX records from backend
  var mxData = null;
  try {
    setProgress('email',50);
    var r = await fetch(API_URL+'/email/analyze/'+encodeURIComponent(email));
    if(handle429(r,'email')){setBtn('email',false);showProgress('email',false);return;}
    var resp = await r.json();
    if(resp.success) mxData = resp;
  } catch(e) { mxData = null; }

  setProgress('email',85); await delay(200);
  var riskScore = isDisp?'HIGH':isFree?'MEDIUM':'LOW';

  var data={
    email:email, username:user, domain:domain, tld:tld,
    isFreeProvider:isFree, isDisposable:isDisp,
    commonPatterns:detectPattern(user), usernameLength:user.length,
    domainAge:isFree?'Major provider (10+ years)':'Unknown',
    riskScore:riskScore,
    mxData:mxData,
    relatedSearches:['site:linkedin.com "'+user+'"','"'+email+'" filetype:pdf','"'+email+'" inurl:profile','"'+email+'" site:pastebin.com']
  };
  setProgress('email',100); resultData.email=data;
  addToHistory('email', email, 'Risk: '+data.riskScore+' — '+(data.isDisposable?'Disposable':'Legitimate'));
  renderEmailResults(data);
  setBtn('email',false); showProgress('email',false);
  document.getElementById('email-actions').style.display='flex';
  updateRiskFromData();  if(window.triggerGlitch)triggerGlitch();
}
function detectPattern(u){
  var p=[];
  if(/^\d+$/.test(u))p.push('Numeric only');
  if(/^[a-z]+\.[a-z]+/.test(u))p.push('firstname.lastname');
  if(/^[a-z]+\d{2,4}$/.test(u))p.push('Name+year');
  if(/[._-]/.test(u))p.push('Has separators');
  if(u.length<5)p.push('Short');
  return p.length?p.join(', '):'No specific pattern';
}
function renderEmailResults(d){
  var div=document.getElementById('email-results');div.innerHTML='';
  var rc=d.riskScore==='HIGH'?'var(--accent3)':d.riskScore==='MEDIUM'?'var(--warn)':'var(--accent2)';
  renderSection(div,{title:'EMAIL STRUCTURE',rows:[['Address',d.email],['Username',d.username],['Domain',d.domain],['TLD','.'+d.tld],['Pattern',d.commonPatterns],['Length',d.usernameLength+' chars']]});
  renderSection(div,{title:'DOMAIN ANALYSIS',rows:[['Free Provider',d.isFreeProvider?'✓ YES':'✗ Custom domain'],['Disposable',d.isDisposable?'⚠ YES — HIGH RISK':'✓ NOT DETECTED'],['Domain Age',d.domainAge]]});

  // REAL MX RECORDS section
  var mxRows = [];
  if(d.mxData && d.mxData.success){
    var mx = d.mxData;
    mxRows = [
      ['Domain Exists', mx.domainExists ? '✓ YES' : '⚠ NOT FOUND'],
      ['Mail Provider', mx.mailProvider || 'Unknown'],
      ['MX Count', mx.totalMX + ' record(s)'],
      ['MX Records', mx.mxRecords && mx.mxRecords.length ? mx.mxRecords.slice(0,2).join(', ') : 'None'],
    ];
  } else {
    mxRows = [['MX Records', '⚠ Server offline — run node server.js']];
  }
  renderSection(div,{title:'MX RECORDS (LIVE)',rows:mxRows});

  // SPF / DMARC section
  if(d.mxData && d.mxData.success && d.mxData.spf && d.mxData.dmarc){
    var spf = d.mxData.spf;
    var dmarc = d.mxData.dmarc;
    var spfColor = (spf.status||'').includes('FOUND') ? 'var(--accent2)' : 'var(--accent3)';
    var dmarcColor = (dmarc.status||'').includes('FOUND') ? 'var(--accent2)' : 'var(--accent3)';
    renderSection(div,{title:'EMAIL SECURITY (SPF / DMARC)',rows:[
      ['SPF Status',   '<span style="color:'+spfColor+'">'+(spf.status||'N/A')+'</span>'],
      ['SPF Policy',   spf.policy||'N/A'],
      ['SPF Record',   spf.record ? '<span style="font-size:11px;word-break:break-all;">'+spf.record+'</span>' : 'N/A'],
      ['DMARC Status', '<span style="color:'+dmarcColor+'">'+(dmarc.status||'N/A')+'</span>'],
      ['DMARC Policy', dmarc.policy||'N/A'],
      ['DMARC Report', dmarc.reporting||'N/A'],
    ]});
  }

  // EMAIL REPUTATION
  var repData=(function(){
    var spamDomains=['mailinator.com','guerrillamail.com','tempmail.com','10minutemail.com','throwaway.email','yopmail.com','trashmail.com','fakeinbox.com','maildrop.cc'];
    var spamUsers=['admin','spam','test','temp','fake','noreply','throwaway','disposable','anonymous'];
    var isSpamDomain=spamDomains.indexOf(d.domain.toLowerCase())!==-1;
    var isSpamUser=spamUsers.indexOf(d.username.toLowerCase())!==-1;
    var score=0;
    if(isSpamDomain)score+=40;
    if(isSpamUser)score+=20;
    if(d.isDisposable)score+=30;
    if(d.username.length<4)score+=10;
    score=Math.min(score,95);
    var label=score>60?'HIGH RISK':score>30?'SUSPICIOUS':'CLEAN';
    var col=score>60?'#ff6b35':score>30?'#ffcc00':'#00ff88';
    return {isSpamDomain:isSpamDomain,isSpamUser:isSpamUser,score:score,label:label,col:col};
  })();

  renderSection(div,{title:'EMAIL REPUTATION',rows:[
    ['Spam Score', repData.score+'/100 — '+repData.label],
    ['Spam Domain', repData.isSpamDomain?'⚠ DETECTED':'✓ CLEAN'],
    ['Username Flag', repData.isSpamUser?'⚠ SUSPICIOUS':'✓ NORMAL'],
    ['Disposable', d.isDisposable?'⚠ YES — HIGH RISK':'✓ NOT DETECTED']
  ]});

  // BREACH CHECK — HIBP button
  var breachWrap=document.createElement('div');
  breachWrap.style.cssText='margin-bottom:14px;padding:12px;background:var(--bg2);border:1px solid var(--border);border-radius:6px;';
  breachWrap.innerHTML='<div style="font-size:11px;color:var(--accent);letter-spacing:3px;margin-bottom:10px;border-bottom:1px solid var(--border);padding-bottom:6px;">// BREACH CHECK</div>'
    +'<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:12px;margin-bottom:10px;">Check if this email was exposed in known data breaches:</div>'
    +'<a href="https://haveibeenpwned.com/account/'+encodeURIComponent(d.email)+'" target="_blank" style="display:inline-block;padding:8px 16px;background:transparent;border:1px solid var(--accent3);color:var(--accent3);font-family:Share Tech Mono,monospace;font-size:12px;letter-spacing:2px;text-decoration:none;border-radius:4px;cursor:pointer;">⚠ CHECK BREACHES ON HIBP →</a>';
  div.appendChild(breachWrap);

  // RISK SCORE
  var rb=document.createElement('div');
  rb.style.cssText='text-align:center;padding:14px 0 10px;border-bottom:1px solid var(--border);margin-bottom:14px;';
  rb.innerHTML='<div style="font-size:12px;color:var(--accent);letter-spacing:3px;font-family:Share Tech Mono,monospace;margin-bottom:8px;">// THREAT ASSESSMENT</div>'
    +'<div style="font-family:Orbitron,monospace;font-size:36px;font-weight:900;color:'+rc+';margin-bottom:6px;">'+d.riskScore+'</div>'
    +'<div style="width:50%;margin:0 auto;height:6px;background:var(--border);border-radius:3px;overflow:hidden;"><div style="height:100%;width:'+(d.riskScore==='HIGH'?'85%':d.riskScore==='MEDIUM'?'52%':'25%')+';background:'+rc+';border-radius:3px;"></div></div>';
  div.appendChild(rb);
  renderSection(div,{title:'DORK SEARCHES',rows:d.relatedSearches.map(function(s,i){return ['Dork '+(i+1),'<a href="https://google.com/search?q='+encodeURIComponent(s)+'" target="_blank" style="color:var(--accent)">'+s+' →</a>'];})});
}
// ===== METADATA =====
async function runMetaExtract(){
  var file=document.getElementById('meta-file').files[0];
  if(!file){showError('meta-results','No file selected — please choose an image, PDF, or document.');return;}
  var allowed=['image/jpeg','image/png','image/gif','image/webp','image/tiff','application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  if(!allowed.includes(file.type)&&!file.name.match(/\.(jpg|jpeg|png|gif|webp|tiff|pdf|doc|docx|xlsx|pptx)$/i)){
    showError('meta-results','Unsupported file type — allowed: JPG, PNG, GIF, WEBP, TIFF, PDF, DOC, DOCX, XLSX, PPTX');return;
  }
  var maxSize=50*1024*1024; // 50MB
  if(file.size>maxSize){showError('meta-results','File too large — maximum size is 50MB.');return;}
  incrementScanCount();setBtn('meta',true);showProgress('meta',true);setProgress('meta',20);
  document.getElementById('meta-results').innerHTML='<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:14px;padding:10px">Reading file...</div>';
  await delay(300);setProgress('meta',40);
  var ext=file.name.split('.').pop().toLowerCase();
  var isImage=file.type.startsWith('image/');
  var isPDF=(file.type==='application/pdf'||ext==='pdf');
  var isDocx=(ext==='docx'||ext==='doc');
  var basic={filename:file.name,extension:ext.toUpperCase(),mimeType:file.type||'Unknown',fileSize:formatBytes(file.size),fileSizeBytes:file.size,lastModified:formatISODate(new Date(file.lastModified).toISOString()),isImage:isImage,isPDF:isPDF};
  var imageUrl=null,exifData=null,pdfData=null;
  if(isImage){imageUrl=URL.createObjectURL(file);exifData=await extractImageMeta(file);}
  if(isPDF){
    document.getElementById('meta-results').innerHTML='<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:14px;padding:10px">Parsing PDF structure...</div>';
    pdfData=await extractPDFMeta(file);
  }
  var docxData=null;
  if(isDocx){
    document.getElementById('meta-results').innerHTML='<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:14px;padding:10px">Parsing DOCX structure...</div>';
    docxData=await extractDocxMeta(file);
  }
  setProgress('meta',100);
  var final=Object.assign({},basic,{exif:exifData,pdf:pdfData,docx:docxData,isDocx:isDocx});
  resultData.meta=final;
  addToHistory('meta', final.filename, final.mimeType+' — '+final.fileSize);
  renderMetaResults(final,imageUrl);
  setBtn('meta',false);showProgress('meta',false);
  document.getElementById('meta-actions').style.display='flex';updateRiskFromData();if(window.triggerGlitch)triggerGlitch();
}

async function extractPDFMeta(file){
  var result={};
  try{
    if(typeof pdfjsLib==='undefined'){result.error='PDF.js not loaded';return result;}
    pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    var arrayBuffer=await file.arrayBuffer();
    var pdf=await pdfjsLib.getDocument({data:arrayBuffer}).promise;
    result.pageCount=pdf.numPages;
    var meta=await pdf.getMetadata();
    var info=meta.info||{};
    result.title=info.Title||null;
    result.author=info.Author||null;
    result.subject=info.Subject||null;
    result.keywords=info.Keywords||null;
    result.creator=info.Creator||null;
    result.producer=info.Producer||null;
    result.creationDate=info.CreationDate?parsePDFDate(info.CreationDate):null;
    result.modDate=info.ModDate?parsePDFDate(info.ModDate):null;
    result.hasAcroForm=(info.IsAcroFormPresent||false);
    result.isXFA=(info.IsXFAPresent||false);
    result.language=info.Language||null;
    var textPages=[];
    var pagesToScan=Math.min(3,pdf.numPages);
    for(var i=1;i<=pagesToScan;i++){
      var page=await pdf.getPage(i);
      var tc=await page.getTextContent();
      var pageText=tc.items.map(function(item){return item.str;}).join(' ').replace(/\s+/g,' ').trim();
      if(pageText)textPages.push({page:i,text:pageText.substring(0,400)});
    }
    result.textPreview=textPages;
    var firstPage=await pdf.getPage(1);
    var vp=firstPage.getViewport({scale:1});
    result.pageWidth=Math.round(vp.width);
    result.pageHeight=Math.round(vp.height);
    result.pageSize=getPageSizeName(vp.width,vp.height);
  }catch(e){result.error='Parse error: '+e.message;}
  return result;
}
function parsePDFDate(str){
  try{
    var s=str.replace(/^D:/,'');
    var y=s.substr(0,4),mo=s.substr(4,2),d=s.substr(6,2);
    var h=s.substr(8,2)||'00',mi=s.substr(10,2)||'00',sec=s.substr(12,2)||'00';
    return formatISODate(y+'-'+mo+'-'+d+'T'+h+':'+mi+':'+sec);
  }catch(e){return str;}
}
// ===== FORMAT ANY DATE STRING NICELY =====
function formatISODate(str){
  if(!str||str==='Not found')return str;
  try{
    var d = new Date(str);
    if(isNaN(d.getTime()))return str;
    var day   = d.getDate().toString().padStart(2,'0');
    var month = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
    var year  = d.getFullYear();
    var h     = d.getHours().toString().padStart(2,'0');
    var m     = d.getMinutes().toString().padStart(2,'0');
    var s     = d.getSeconds().toString().padStart(2,'0');
    return day+' '+month+' '+year+' — '+h+':'+m+':'+s;
  }catch(e){return str;}
}

function getPageSizeName(w,h){
  var wp=Math.round(w),hp=Math.round(h);
  if((wp===612&&hp===792)||(wp===792&&hp===612))return 'US Letter (8.5x11")';
  if((wp===595&&hp===842)||(wp===842&&hp===595))return 'A4';
  if((wp===612&&hp===1008)||(wp===1008&&hp===612))return 'US Legal';
  if((wp===842&&hp===1191)||(wp===1191&&hp===842))return 'A3';
  return Math.round(w/72*25.4)+'x'+Math.round(h/72*25.4)+' mm';
}

async function extractDocxMeta(file){
  var result={};
  try{
    if(typeof JSZip==='undefined'){result.error='JSZip not loaded';return result;}
    var ab=await file.arrayBuffer();
    var zip=await JSZip.loadAsync(ab);

    // Core properties: title, author, description, keywords, etc.
    var coreXml=zip.file('docProps/core.xml');
    if(coreXml){
      var coreStr=await coreXml.async('string');
      result.title=       extractXmlTag(coreStr,'dc:title');
      result.author=      extractXmlTag(coreStr,'dc:creator');
      result.lastAuthor=  extractXmlTag(coreStr,'cp:lastModifiedBy');
      result.description= extractXmlTag(coreStr,'dc:description');
      result.subject=     extractXmlTag(coreStr,'dc:subject');
      result.keywords=    extractXmlTag(coreStr,'cp:keywords');
      result.category=    extractXmlTag(coreStr,'cp:category');
      result.created=     formatISODate(extractXmlTag(coreStr,'dcterms:created'));
      result.modified=    formatISODate(extractXmlTag(coreStr,'dcterms:modified'));
      result.revision=    extractXmlTag(coreStr,'cp:revision');
      result.language=    extractXmlTag(coreStr,'dc:language');
    }

    // App properties: word count, pages, app name, company
    var appXml=zip.file('docProps/app.xml');
    if(appXml){
      var appStr=await appXml.async('string');
      result.application=   extractXmlTag(appStr,'Application');
      result.appVersion=    extractXmlTag(appStr,'AppVersion');
      result.company=       extractXmlTag(appStr,'Company');
      result.pages=         extractXmlTag(appStr,'Pages');
      result.words=         extractXmlTag(appStr,'Words');
      result.characters=    extractXmlTag(appStr,'Characters');
      result.charsWithSpaces=extractXmlTag(appStr,'CharactersWithSpaces');
      result.paragraphs=    extractXmlTag(appStr,'Paragraphs');
      result.lines=         extractXmlTag(appStr,'Lines');
      result.totalTime=     extractXmlTag(appStr,'TotalTime');
      result.template=      extractXmlTag(appStr,'Template');
      result.docSecurity=   extractXmlTag(appStr,'DocSecurity');
    }

    // Extract text from word/document.xml (first 1200 chars)
    var docXml=zip.file('word/document.xml');
    if(docXml){
      var docStr=await docXml.async('string');
      // Strip XML tags, collapse whitespace
      var rawText=docStr.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
      result.textPreview=rawText.substring(0,1200);
    }

    // Count embedded images
    var imgCount=0;
    zip.forEach(function(path){
      if(/word\/media\//i.test(path)&&/\.(png|jpg|jpeg|gif|bmp|svg|wmf|emf)/i.test(path))imgCount++;
    });
    result.embeddedImages=imgCount;

    // Count embedded files (OLE objects)
    var embCount=0;
    zip.forEach(function(path){
      if(/word\/embeddings\//i.test(path))embCount++;
    });
    result.embeddedObjects=embCount;

    // Check for hyperlinks in relationships
    var relsXml=zip.file('word/_rels/document.xml.rels');
    if(relsXml){
      var relsStr=await relsXml.async('string');
      var hrefs=relsStr.match(/Target="(https?:\/\/[^"]+)"/g)||[];
      result.hyperlinks=hrefs.map(function(h){return h.replace(/Target="|"/g,'');}).filter(function(h,i,a){return a.indexOf(h)===i;});
    }

    // Security flag
    result.isProtected=(result.docSecurity&&result.docSecurity!=='0')?true:false;

  } catch(e){
    result.error='Parse error: '+e.message;
  }
  return result;
}

function extractXmlTag(xml, tag){
  var re=new RegExp('<'+tag+'[^>]*>([^<]*)<\\/'+tag+'>','i');
  var m=xml.match(re);
  return (m&&m[1]&&m[1].trim())?m[1].trim():null;
}

async function extractImageMeta(file){
  var dims=await new Promise(function(resolve){
    var img=new Image();var url=URL.createObjectURL(file);
    img.onload=function(){resolve({width:img.naturalWidth,height:img.naturalHeight,aspectRatio:(img.naturalWidth/img.naturalHeight).toFixed(2)});URL.revokeObjectURL(url);};
    img.src=url;
  });
  var exif={};
  try{
    if(typeof exifr!=='undefined'){
      var raw=await exifr.parse(file,{gps:true,tiff:true,exif:true});
      if(raw){
        exif.make=raw.Make||null;exif.model=raw.Model||null;
        exif.dateTaken=raw.DateTimeOriginal?formatISODate(new Date(raw.DateTimeOriginal).toISOString()):null;
        exif.software=raw.Software||null;
        exif.focalLength=raw.FocalLength?raw.FocalLength+'mm':null;
        exif.fNumber=raw.FNumber?'f/'+raw.FNumber:null;
        exif.iso=raw.ISO||null;
        exif.exposureTime=raw.ExposureTime?'1/'+(1/raw.ExposureTime).toFixed(0)+'s':null;
        exif.flash=raw.Flash!==undefined?(raw.Flash?'Fired':'Did not fire'):null;
        if(raw.latitude&&raw.longitude){
          exif.gpsLat=raw.latitude.toFixed(6);exif.gpsLon=raw.longitude.toFixed(6);
          exif.gpsAlt=raw.Altitude?raw.Altitude.toFixed(1)+'m':null;
        }
      }
    }
  }catch(e){}
  return Object.assign({},dims,exif);
}
function renderMetaResults(d,imageUrl){
  var div=document.getElementById('meta-results');div.innerHTML='';
  if(imageUrl){
    var p=document.createElement('div');p.className='meta-preview';
    p.innerHTML='<div class="meta-thumb"><img src="'+imageUrl+'" alt="preview"/></div>'
      +'<div><div class="result-section-title">FILE PREVIEW</div>'
      +'<div style="font-size:14px;color:var(--text);font-family:Share Tech Mono,monospace">'+d.filename+'</div>'
      +'<div style="font-size:12px;color:var(--text2);margin-top:4px">'+d.mimeType+' · '+d.fileSize+'</div>'
      +(d.exif?'<div style="font-size:12px;color:var(--accent);margin-top:4px">'+d.exif.width+'×'+d.exif.height+'px</div>':'')
      +'</div>';
    div.appendChild(p);
  }
  renderSection(div,{title:'FILE METADATA',rows:[['Filename',d.filename],['Type',d.mimeType],['Size',d.fileSize],['Modified',d.lastModified]]});
  if(d.exif){
    renderSection(div,{title:'IMAGE PROPERTIES',rows:[['Dimensions',d.exif.width+' × '+d.exif.height+' px'],['Megapixels',((d.exif.width*d.exif.height)/1e6).toFixed(2)+' MP']]});
    renderSection(div,{title:'CAMERA & EXIF',rows:[
      ['Make',d.exif.make||'⚠ Not found'],['Model',d.exif.model||'⚠ Not found'],
      ['Date Taken',d.exif.dateTaken||'⚠ Not found'],['Software',d.exif.software||'⚠ Not found'],
      ['Focal Length',d.exif.focalLength||'⚠ Not found'],['Aperture',d.exif.fNumber||'⚠ Not found'],
      ['ISO',d.exif.iso?String(d.exif.iso):'⚠ Not found'],['Exposure',d.exif.exposureTime||'⚠ Not found'],
      ['Flash',d.exif.flash||'⚠ Not found'],
    ]});
    if(d.exif.gpsLat&&d.exif.gpsLon){
      var lat=parseFloat(d.exif.gpsLat),lon=parseFloat(d.exif.gpsLon);
      var mapsUrl='https://www.google.com/maps?q='+lat+','+lon;
      renderSection(div,{title:'GPS GEOLOCATION',rows:[
        ['Latitude',lat+'°'],['Longitude',lon+'°'],['Altitude',d.exif.gpsAlt||'N/A'],
      ]});
      var mapDiv=document.createElement('div');
      mapDiv.style.cssText='margin-top:14px;border:1px solid var(--border);border-radius:8px;overflow:hidden;';
      mapDiv.innerHTML='<div style="font-size:11px;color:var(--accent2);letter-spacing:3px;padding:8px 12px;border-bottom:1px solid var(--border);background:var(--bg2);font-family:Share Tech Mono,monospace;">// GPS MAP PREVIEW</div>'
        +'<div id="meta-map" style="height:220px;width:100%;background:#040810;"></div>'
        +'<div style="padding:6px 12px;display:flex;justify-content:space-between;align-items:center;background:var(--bg2);border-top:1px solid var(--border);">'
        +'<span style="font-family:Share Tech Mono,monospace;font-size:11px;color:var(--text2);">'+lat.toFixed(4)+', '+lon.toFixed(4)+'</span>'
        +'<a href="'+mapsUrl+'" target="_blank" style="color:var(--accent);font-family:Share Tech Mono,monospace;font-size:11px;text-decoration:none;">Open Google Maps →</a>'
        +'</div>';
      div.appendChild(mapDiv);

      setTimeout(function(){
        try {
          if(window._metaLeafletMap){ window._metaLeafletMap.remove(); window._metaLeafletMap = null; }
          window._metaLeafletMap = L.map('meta-map', {
            zoomControl: true,
            attributionControl: false,
            scrollWheelZoom: false
          }).setView([lat, lon], 15);

          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 }).addTo(window._metaLeafletMap);

          var icon = L.divIcon({ className:'', html:'<div class="pe-marker"></div>', iconSize:[14,14], iconAnchor:[7,7], popupAnchor:[0,-12] });
          L.marker([lat,lon],{icon:icon}).addTo(window._metaLeafletMap)
            .bindPopup('<div style="line-height:1.9;"><b style="color:#00d4ff;">GPS Location</b><br><span style="color:#a0b8c8;">Lat: '+lat+'°</span><br><span style="color:#00ff88;">Lon: '+lon+'°</span></div>')
            .openPopup();
        } catch(e){ console.log('Meta map error:', e); }
      }, 150);
    } else {
      renderSection(div,{title:'GPS GEOLOCATION',rows:[['Status','⚠ No GPS data found']]});
    }
  }


  // DOCX DATA RENDERING
  if(d.isDocx && d.docx){
    var x=d.docx;
    if(x.error){
      renderSection(div,{title:'DOCX ERROR',rows:[['Error',x.error]]});
    } else {
      // Document identity
      renderSection(div,{title:'DOCUMENT IDENTITY',rows:[
        ['Title',       x.title       || 'Not set'],
        ['Author',      x.author      || 'Not set'],
        ['Last Edited', x.lastAuthor  || 'Not set'],
        ['Subject',     x.subject     || 'Not set'],
        ['Description', x.description || 'Not set'],
        ['Keywords',    x.keywords    || 'Not set'],
        ['Category',    x.category    || 'Not set'],
        ['Language',    x.language    || 'Not set'],
      ]});

      // Stats
      renderSection(div,{title:'DOCUMENT STATISTICS',rows:[
        ['Pages',       x.pages      || 'Unknown'],
        ['Words',       x.words      || 'Unknown'],
        ['Characters',  x.characters || 'Unknown'],
        ['Chars+Spaces',x.charsWithSpaces || 'Unknown'],
        ['Paragraphs',  x.paragraphs || 'Unknown'],
        ['Lines',       x.lines      || 'Unknown'],
        ['Revision No.',x.revision   || 'Unknown'],
        ['Edit Time',   x.totalTime  ? x.totalTime+' min' : 'Unknown'],
      ]});

      // Software trail
      renderSection(div,{title:'SOFTWARE TRAIL',rows:[
        ['Application', x.application || 'Not found'],
        ['App Version', x.appVersion  || 'Not found'],
        ['Company',     x.company     || 'Not found'],
        ['Template',    x.template    || 'Not found'],
        ['Created',     x.created     || 'Not found'],
        ['Modified',    x.modified    || 'Not found'],
        ['Protected',   x.isProtected ? 'YES (document protection enabled)' : 'No'],
      ]});

      // Embedded content
      renderSection(div,{title:'EMBEDDED CONTENT',rows:[
        ['Images',          x.embeddedImages  ? x.embeddedImages+' image(s) found' : 'None'],
        ['OLE Objects',     x.embeddedObjects ? x.embeddedObjects+' object(s) found' : 'None'],
        ['Hyperlinks Found',x.hyperlinks && x.hyperlinks.length ? x.hyperlinks.length+' link(s)' : 'None'],
      ]});

      // Hyperlinks list
      if(x.hyperlinks && x.hyperlinks.length>0){
        var hlWrap=document.createElement('div');
        hlWrap.style.cssText='margin-bottom:18px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:16px 18px;';
        var hlTitle=document.createElement('div');
        hlTitle.style.cssText='font-size:13px;color:var(--accent2);letter-spacing:3px;font-family:Share Tech Mono,monospace;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border);';
        hlTitle.textContent='HYPERLINKS ('+x.hyperlinks.length+')';
        hlWrap.appendChild(hlTitle);
        x.hyperlinks.forEach(function(url){
          var row=document.createElement('div');
          row.style.cssText='font-family:Share Tech Mono,monospace;font-size:13px;padding:6px 0;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:10px;';
          row.innerHTML='<span style="color:var(--accent2);">&#9658;</span><a href="'+url+'" target="_blank" style="color:var(--accent);text-decoration:none;word-break:break-all;flex:1;">'+url+'</a>';
          hlWrap.appendChild(row);
        });
        div.appendChild(hlWrap);
      }

      // Text preview
      if(x.textPreview){
        var prevWrap=document.createElement('div');
        prevWrap.style.cssText='margin-bottom:18px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:16px 18px;';
        var prevTitle=document.createElement('div');
        prevTitle.style.cssText='font-size:13px;color:var(--accent2);letter-spacing:3px;font-family:Share Tech Mono,monospace;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid var(--border);';
        prevTitle.textContent='TEXT PREVIEW (FIRST 1200 CHARS)';
        var prevText=document.createElement('div');
        prevText.style.cssText='font-family:Share Tech Mono,monospace;font-size:13px;color:var(--text);line-height:1.7;background:#020508;padding:12px 14px;border-radius:5px;border:1px solid rgba(0,212,255,0.1);word-break:break-word;';
        prevText.textContent=x.textPreview+(x.textPreview.length>=1200?' ...':'');
        prevWrap.appendChild(prevTitle);
        prevWrap.appendChild(prevText);
        div.appendChild(prevWrap);
      }

      // OSINT intel
      var intelWrap=document.createElement('div');
      intelWrap.style.cssText='margin-bottom:18px;background:rgba(255,107,53,0.04);border:1px solid rgba(255,107,53,0.2);border-radius:8px;padding:16px 18px;';
      var intelTitle=document.createElement('div');
      intelTitle.style.cssText='font-size:13px;color:var(--accent3);letter-spacing:3px;font-family:Share Tech Mono,monospace;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(255,107,53,0.2);';
      intelTitle.textContent='OSINT INTELLIGENCE NOTES';
      intelWrap.appendChild(intelTitle);
      var findings=[];
      if(x.author)findings.push('Author: <span style="color:var(--accent);">'+x.author+'</span>');
      if(x.lastAuthor&&x.lastAuthor!==x.author)findings.push('Last edited by: <span style="color:var(--warn);">'+x.lastAuthor+'</span> (different from original author)');
      if(x.company)findings.push('Company/Org: <span style="color:var(--accent);">'+x.company+'</span>');
      if(x.application)findings.push('Written in: <span style="color:var(--accent);">'+x.application+(x.appVersion?' v'+x.appVersion:'')+'</span>');
      if(x.created)findings.push('Created: <span style="color:var(--warn);">'+x.created+'</span>');
      if(x.modified&&x.modified!==x.created)findings.push('Modified after creation: <span style="color:var(--warn);">'+x.modified+'</span>');
      if(x.revision&&parseInt(x.revision)>10)findings.push('High revision count: <span style="color:var(--warn);">Rev '+x.revision+' — document has been edited many times</span>');
      if(x.embeddedImages>0)findings.push('Contains '+x.embeddedImages+' embedded image(s)');
      if(x.hyperlinks&&x.hyperlinks.length>0)findings.push('Contains '+x.hyperlinks.length+' hyperlink(s) — may reveal internal infrastructure or intent');
      if(x.isProtected)findings.push('Document is password-protected or has editing restrictions');
      if(!x.author&&!x.company)findings.push('No author or company found — metadata stripped');
      if(findings.length===0)findings.push('No significant OSINT signals found in metadata');
      findings.forEach(function(f){
        var item=document.createElement('div');
        item.style.cssText='font-family:Share Tech Mono,monospace;font-size:13px;color:var(--text2);padding:6px 0;border-bottom:1px solid rgba(255,107,53,0.1);line-height:1.6;';
        item.innerHTML=f;
        intelWrap.appendChild(item);
      });
      div.appendChild(intelWrap);
    }
  }

  // PDF DATA RENDERING
  if(d.isPDF && d.pdf){
    var p=d.pdf;
    if(p.error){
      renderSection(div,{title:'PDF ERROR',rows:[['Error',p.error]]});
    } else {
      renderSection(div,{title:'PDF DOCUMENT INFO',rows:[
        ['Total Pages', p.pageCount ? p.pageCount+' pages' : 'Unknown'],
        ['Page Size', p.pageSize || 'Unknown'],
        ['Page Dimensions', (p.pageWidth&&p.pageHeight) ? p.pageWidth+'x'+p.pageHeight+' pt' : 'Unknown'],
        ['PDF Version', p.pdfVersion ? 'PDF '+p.pdfVersion : 'Unknown'],
      ]});
      renderSection(div,{title:'DOCUMENT METADATA',rows:[
        ['Title',    p.title    || 'Not set'],
        ['Author',   p.author   || 'Not set'],
        ['Subject',  p.subject  || 'Not set'],
        ['Keywords', p.keywords || 'Not set'],
        ['Language', p.language || 'Not set'],
      ]});
      renderSection(div,{title:'SOFTWARE TRAIL',rows:[
        ['Creator App',   p.creator      || 'Not found'],
        ['PDF Producer',  p.producer     || 'Not found'],
        ['Created',       p.creationDate || 'Not found'],
        ['Last Modified', p.modDate      || 'Not found'],
        ['Has AcroForm',  p.hasAcroForm  ? 'YES (interactive form)' : 'No'],
        ['Is XFA Form',   p.isXFA        ? 'YES' : 'No'],
      ]});
      if(p.textPreview && p.textPreview.length>0){
        var prevWrap=document.createElement('div');
        prevWrap.style.cssText='margin-bottom:18px;background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:16px 18px;';
        var prevTitle=document.createElement('div');
        prevTitle.style.cssText='font-size:13px;color:var(--accent2);letter-spacing:3px;font-family:Share Tech Mono,monospace;margin-bottom:12px;padding-bottom:8px;border-bottom:1px solid var(--border);';
        prevTitle.textContent='TEXT PREVIEW — FIRST '+p.textPreview.length+' PAGE'+(p.textPreview.length>1?'S':'');
        prevWrap.appendChild(prevTitle);
        p.textPreview.forEach(function(pg){
          var pb=document.createElement('div');pb.style.cssText='margin-bottom:12px;';
          var pl=document.createElement('div');pl.style.cssText='font-family:Share Tech Mono,monospace;font-size:11px;color:var(--accent);letter-spacing:2px;margin-bottom:5px;';
          pl.textContent='PAGE '+pg.page;
          var pt=document.createElement('div');pt.style.cssText='font-family:Share Tech Mono,monospace;font-size:13px;color:var(--text);line-height:1.7;background:#020508;padding:10px 12px;border-radius:5px;border:1px solid rgba(0,212,255,0.1);word-break:break-word;';
          pt.textContent=pg.text+(pg.text.length>=400?' ...':'');
          pb.appendChild(pl);pb.appendChild(pt);prevWrap.appendChild(pb);
        });
        div.appendChild(prevWrap);
      } else {
        renderSection(div,{title:'TEXT PREVIEW',rows:[['Status','No extractable text — may be scanned/image-based PDF']]});
      }
      var intelWrap=document.createElement('div');
      intelWrap.style.cssText='margin-bottom:18px;background:rgba(255,107,53,0.04);border:1px solid rgba(255,107,53,0.2);border-radius:8px;padding:16px 18px;';
      var intelTitle=document.createElement('div');
      intelTitle.style.cssText='font-size:13px;color:var(--accent3);letter-spacing:3px;font-family:Share Tech Mono,monospace;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(255,107,53,0.2);';
      intelTitle.textContent='OSINT INTELLIGENCE NOTES';
      intelWrap.appendChild(intelTitle);
      var findings=[];
      if(p.author)findings.push('Author identified: <span style="color:var(--accent);">'+p.author+'</span>');
      if(p.creator)findings.push('Created with: <span style="color:var(--accent);">'+p.creator+'</span>');
      if(p.producer)findings.push('PDF engine: <span style="color:var(--accent);">'+p.producer+'</span>');
      if(p.creationDate)findings.push('Original creation date: <span style="color:var(--warn);">'+p.creationDate+'</span>');
      if(p.modDate&&p.modDate!==p.creationDate)findings.push('Modified after creation: <span style="color:var(--warn);">'+p.modDate+'</span>');
      if(p.keywords)findings.push('Keywords exposed: <span style="color:var(--accent);">'+p.keywords+'</span>');
      if(!p.author&&!p.creator)findings.push('No author/creator found — metadata stripped or never set');
      if(findings.length===0)findings.push('No significant OSINT signals found in metadata');
      findings.forEach(function(f){
        var item=document.createElement('div');
        item.style.cssText='font-family:Share Tech Mono,monospace;font-size:13px;color:var(--text2);padding:6px 0;border-bottom:1px solid rgba(255,107,53,0.1);line-height:1.6;';
        item.innerHTML=f;
        intelWrap.appendChild(item);
      });
      div.appendChild(intelWrap);
    }
  }

}

// ===== PHONE =====
async function runPhoneLookup(){
  var cc=document.getElementById('phone-country').value;
  // Normalize Canada — uses same +1 as USA
  var ccDisplay = cc === '+1-CA' ? '+1' : cc;
  var raw=document.getElementById('phone-input').value.trim();
  var num=raw.replace(/\D/g,'');
  if(!raw){showError('phone-results','Enter a phone number to analyze.');return;}
  if(!num){showError('phone-results','Invalid input — enter digits only (e.g. 9876543210).');return;}
  if(num.length<7){showError('phone-results','Number too short — minimum 7 digits required.');return;}
  if(num.length>12){showError('phone-results','Number too long — maximum 12 digits allowed.');return;}
  if(num.length!==10&&(cc==='+91')){showError('phone-results','Invalid Indian number — must be exactly 10 digits (entered: '+num.length+').');return;}
  if(cc==='+91'&&!/^[6-9]/.test(num)){showError('phone-results','Invalid Indian mobile number — must start with 6, 7, 8, or 9.');return;}
  var full=ccDisplay+num;
  incrementScanCount();saveSuggest('phone',full);setBtn('phone',true);showProgress('phone',true);setProgress('phone',20);
  document.getElementById('phone-results').innerHTML='<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:14px;padding:10px">Analyzing...</div>';
  await delay(400);setProgress('phone',60);
  var cmap={
    '+91':['India','IN','Asia/Kolkata','INR'],
    '+1':['USA','US','America/New_York','USD'],
    '+1-CA':['Canada','CA','America/Toronto','CAD'],
    '+44':['UK','GB','Europe/London','GBP'],
    '+61':['Australia','AU','Australia/Sydney','AUD'],
    '+49':['Germany','DE','Europe/Berlin','EUR'],
    '+33':['France','FR','Europe/Paris','EUR'],
    '+81':['Japan','JP','Asia/Tokyo','JPY'],
    '+86':['China','CN','Asia/Shanghai','CNY'],
    '+971':['UAE','AE','Asia/Dubai','AED'],
    '+92':['Pakistan','PK','Asia/Karachi','PKR'],
    '+880':['Bangladesh','BD','Asia/Dhaka','BDT'],
    '+7':['Russia','RU','Europe/Moscow','RUB'],
    '+55':['Brazil','BR','America/Sao_Paulo','BRL'],
    '+52':['Mexico','MX','America/Mexico_City','MXN'],
    '+39':['Italy','IT','Europe/Rome','EUR'],
    '+34':['Spain','ES','Europe/Madrid','EUR'],
    '+31':['Netherlands','NL','Europe/Amsterdam','EUR'],
    '+46':['Sweden','SE','Europe/Stockholm','SEK'],
    '+47':['Norway','NO','Europe/Oslo','NOK'],
    '+45':['Denmark','DK','Europe/Copenhagen','DKK'],
    '+358':['Finland','FI','Europe/Helsinki','EUR'],
    '+41':['Switzerland','CH','Europe/Zurich','CHF'],
    '+43':['Austria','AT','Europe/Vienna','EUR'],
    '+32':['Belgium','BE','Europe/Brussels','EUR'],
    '+351':['Portugal','PT','Europe/Lisbon','EUR'],
    '+48':['Poland','PL','Europe/Warsaw','PLN'],
    '+420':['Czech Republic','CZ','Europe/Prague','CZK'],
    '+36':['Hungary','HU','Europe/Budapest','HUF'],
    '+40':['Romania','RO','Europe/Bucharest','RON'],
    '+30':['Greece','GR','Europe/Athens','EUR'],
    '+90':['Turkey','TR','Europe/Istanbul','TRY'],
    '+966':['Saudi Arabia','SA','Asia/Riyadh','SAR'],
    '+965':['Kuwait','KW','Asia/Kuwait','KWD'],
    '+974':['Qatar','QA','Asia/Qatar','QAR'],
    '+973':['Bahrain','BH','Asia/Bahrain','BHD'],
    '+968':['Oman','OM','Asia/Muscat','OMR'],
    '+962':['Jordan','JO','Asia/Amman','JOD'],
    '+961':['Lebanon','LB','Asia/Beirut','LBP'],
    '+20':['Egypt','EG','Africa/Cairo','EGP'],
    '+27':['South Africa','ZA','Africa/Johannesburg','ZAR'],
    '+234':['Nigeria','NG','Africa/Lagos','NGN'],
    '+254':['Kenya','KE','Africa/Nairobi','KES'],
    '+233':['Ghana','GH','Africa/Accra','GHS'],
    '+251':['Ethiopia','ET','Africa/Addis_Ababa','ETB'],
    '+255':['Tanzania','TZ','Africa/Dar_es_Salaam','TZS'],
    '+256':['Uganda','UG','Africa/Kampala','UGX'],
    '+212':['Morocco','MA','Africa/Casablanca','MAD'],
    '+213':['Algeria','DZ','Africa/Algiers','DZD'],
    '+216':['Tunisia','TN','Africa/Tunis','TND'],
    '+82':['South Korea','KR','Asia/Seoul','KRW'],
    '+66':['Thailand','TH','Asia/Bangkok','THB'],
    '+65':['Singapore','SG','Asia/Singapore','SGD'],
    '+60':['Malaysia','MY','Asia/Kuala_Lumpur','MYR'],
    '+62':['Indonesia','ID','Asia/Jakarta','IDR'],
    '+63':['Philippines','PH','Asia/Manila','PHP'],
    '+84':['Vietnam','VN','Asia/Ho_Chi_Minh','VND'],
    '+94':['Sri Lanka','LK','Asia/Colombo','LKR'],
    '+977':['Nepal','NP','Asia/Kathmandu','NPR'],
    '+95':['Myanmar','MM','Asia/Rangoon','MMK'],
    '+855':['Cambodia','KH','Asia/Phnom_Penh','KHR'],
    '+856':['Laos','LA','Asia/Vientiane','LAK'],
    '+64':['New Zealand','NZ','Pacific/Auckland','NZD'],
    '+54':['Argentina','AR','America/Argentina/Buenos_Aires','ARS'],
    '+56':['Chile','CL','America/Santiago','CLP'],
    '+57':['Colombia','CO','America/Bogota','COP'],
    '+51':['Peru','PE','America/Lima','PEN'],
    '+58':['Venezuela','VE','America/Caracas','VES'],
    '+593':['Ecuador','EC','America/Guayaquil','USD'],
    '+591':['Bolivia','BO','America/La_Paz','BOB'],
    '+595':['Paraguay','PY','America/Asuncion','PYG'],
    '+598':['Uruguay','UY','America/Montevideo','UYU'],
  };
  var info=cmap[cc]||cmap[ccDisplay]||['Unknown','??','Unknown','???'];
  var data={fullNumber:full,countryCode:cc,localNumber:num,country:info[0],countryISO:info[1],timezone:info[2],currency:info[3],isValid:num.length===10,numberLength:num.length,timestamp:new Date().toISOString()};
  setProgress('phone',100);resultData.phone=data;
  addToHistory('phone', data.fullNumber, data.country+' — '+(data.isValid?'Valid':'Invalid'));
  renderPhoneResults(data);
  setBtn('phone',false);showProgress('phone',false);
  document.getElementById('phone-actions').style.display='flex';updateRiskFromData();if(window.triggerGlitch)triggerGlitch();
}
function renderPhoneResults(d){
  var div=document.getElementById('phone-results');div.innerHTML='';
  renderSection(div,{title:'NUMBER DETAILS',rows:[['Full (E.164)',d.fullNumber],['Country Code',d.countryCode],['Local',d.localNumber],['Length',d.numberLength+' digits'],['Valid',d.isValid?'✓ YES':'⚠ CHECK']]});
  renderSection(div,{title:'REGION INFO',rows:[['Country',d.country+' ('+d.countryISO+')'],['Timezone',d.timezone],['Currency',d.currency],['Carrier','⚠ Requires live API — use Truecaller'],['Line Type','⚠ Requires live API']]});
  renderSection(div,{title:'LOOKUP TOOLS',rows:[
    ['Truecaller','<a href="https://www.truecaller.com/search/'+d.countryISO.toLowerCase()+'/'+d.localNumber+'" target="_blank" style="color:var(--accent)">Truecaller →</a>'],
    ['Google','<a href="https://google.com/search?q='+encodeURIComponent(d.fullNumber)+'" target="_blank" style="color:var(--accent)">Google →</a>'],
    ['WhatsApp','<a href="https://wa.me/'+d.fullNumber.replace('+','')+'" target="_blank" style="color:var(--accent)">WhatsApp →</a>'],
    ['NumLookup','<a href="https://www.numlookup.com/?phone='+encodeURIComponent(d.fullNumber)+'" target="_blank" style="color:var(--accent)">NumLookup →</a>'],
  ]});
}

// ===== DORK GEN =====
function runDorkGen(){
  var target=document.getElementById('dork-input').value.trim();
  var type=document.getElementById('dork-type').value;
  if(!target){showError('dork-results','Enter a target to generate dorks for.');return;}
  if(target.length<2){showError('dork-results','Target too short — minimum 2 characters.');return;}
  if(target.length>100){showError('dork-results','Target too long — maximum 100 characters.');return;}
  // Validate based on type
  if(type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(target)){showError('dork-results','Email type selected — enter a valid email address (e.g. user@domain.com).');return;}
  if(type==='domain'&&!/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(target.replace(/^https?:\/\//,'').replace(/\/.*/,''))){showError('dork-results','Domain type selected — enter a valid domain (e.g. example.com).');return;}
  incrementScanCount();saveSuggest('dork',target);
  var dorks=generateDorks(target,type);
  resultData.dork={target:target,type:type,dorks:dorks,timestamp:new Date().toISOString()};
  addToHistory('dork', target, type+' — '+Object.values(dorks).reduce(function(a,c){return a+(c?c.length:0);},0)+' dorks generated');
  renderDorkResults(dorks);
  document.getElementById('dork-actions').style.display='flex';
  document.getElementById('dork-results').scrollIntoView({behavior:'smooth', block:'start'});
  if(window.triggerGlitch)triggerGlitch();
  updateRiskFromData();
}
function generateDorks(t,type){
  var d={};
  if(type==='person'){
    d['Social Media']=['site:linkedin.com "'+t+'"','site:facebook.com "'+t+'"','site:twitter.com "'+t+'" OR site:x.com "'+t+'"','site:instagram.com "'+t+'"','site:reddit.com "'+t+'"','site:github.com "'+t+'"'];
    d['Identity & Profile']=['"'+t+'" inurl:profile','"'+t+'" inurl:about','intitle:"'+t+'" resume OR cv OR portfolio','"'+t+'" site:about.me','"'+t+'" inurl:author'];
    d['Documents & Files']=['"'+t+'" filetype:pdf','"'+t+'" filetype:doc OR filetype:docx','"'+t+'" filetype:ppt OR filetype:pptx','intitle:"'+t+'" site:slideshare.net'];
    d['Data Leaks']=['"'+t+'" site:pastebin.com','"'+t+'" site:raidforums.com','"'+t+'" password OR leaked OR breach','"'+t+'" site:ghostbin.com OR site:hastebin.com'];
    d['Images & Media']=['"'+t+'" site:flickr.com','"'+t+'" site:imgur.com','"'+t+'" site:photo OR site:pics'];
  }
  if(type==='username'){
    d['Social Profiles']=['inurl:'+t+' site:twitter.com OR site:x.com','inurl:'+t+' site:instagram.com','inurl:'+t+' site:github.com','inurl:'+t+' site:reddit.com','inurl:'+t+' site:tiktok.com','inurl:'+t+' site:twitch.tv','inurl:'+t+' site:medium.com'];
    d['Developer Profiles']=['inurl:'+t+' site:github.com','inurl:'+t+' site:gitlab.com','inurl:'+t+' site:stackoverflow.com','inurl:'+t+' site:dev.to','inurl:'+t+' site:hackerrank.com'];
    d['Gaming & Forums']=['inurl:'+t+' site:steam.com','inurl:'+t+' site:twitch.tv','"'+t+'" site:discord.com OR site:discordapp.com','"'+t+'" site:4chan.org OR site:8chan.moe'];
    d['Data Leaks']=['"'+t+'" site:pastebin.com','"'+t+'" site:raidforums.com OR site:breachforums.com','"'+t+'" username OR "user:" OR "login:"','"'+t+'" password OR hash'];
    d['Other Mentions']=['"@'+t+'"','"'+t+'" profile OR account OR user','"'+t+'" site:namechk.com','intitle:"'+t+'"'];
  }
  if(type==='domain'){
    d['Subdomains']=['site:'+t+' -www','site:*.'+t,'inurl:*.'+t,'site:'+t+' -site:www.'+t];
    d['Sensitive Files']=['site:'+t+' filetype:pdf','site:'+t+' filetype:xls OR filetype:xlsx OR filetype:csv','site:'+t+' filetype:sql','site:'+t+' filetype:env OR filetype:conf OR filetype:cfg','site:'+t+' ext:log OR ext:bak OR ext:old','site:'+t+' filetype:xml OR filetype:json'];
    d['Admin & Login']=['site:'+t+' inurl:admin','site:'+t+' inurl:login OR inurl:signin','site:'+t+' inurl:dashboard OR inurl:panel','site:'+t+' inurl:wp-admin OR inurl:cpanel'];
    d['Vulnerabilities']=['site:'+t+' intext:"sql syntax near"','site:'+t+' intext:"Warning: mysql"','site:'+t+' intext:"error" inurl:php','site:'+t+' inurl:debug OR inurl:test','site:'+t+' intext:"index of /"'];
    d['Credentials & Leaks']=['site:'+t+' intext:password','site:'+t+' filetype:txt intext:password','"'+t+'" site:pastebin.com','site:'+t+' intext:"api_key" OR intext:"api_secret"'];
    d['Technologies']=['site:'+t+' inurl:wp-content','site:'+t+' inurl:joomla','site:'+t+' inurl:phpmyadmin','site:'+t+' inurl:.git'];
  }
  if(type==='email'){
    d['Account Discovery']=['"'+t+'" site:linkedin.com','"'+t+'" site:facebook.com OR site:twitter.com','"'+t+'" inurl:profile OR inurl:user','"'+t+'" site:gravatar.com'];
    d['Documents']=['intext:"'+t+'" filetype:pdf','intext:"'+t+'" filetype:xls OR filetype:csv','"'+t+'" filetype:doc','"'+t+'" site:slideshare.net'];
    d['Data Leaks']=['"'+t+'" site:pastebin.com','"'+t+'" site:ghostbin.com','intext:"'+t+'" password OR hash','intext:"'+t+'" site:raidforums.com'];
    d['General']=['"'+t+'"','"'+t+'" contact OR signup OR register','"'+t+'" reply OR from OR sender'];
  }
  if(type==='phone'){
    d['Identity Lookup']=['"'+t+'"','"'+t+'" name OR owner OR contact','"'+t+'" site:truecaller.com','"'+t+'" site:whitepages.com OR site:spokeo.com','"'+t+'" site:yellowpages.com OR site:192.com'];
    d['Social Media']=['"'+t+'" site:facebook.com','"'+t+'" site:linkedin.com','"'+t+'" site:twitter.com OR site:x.com'];
    d['Business Listings']=['"'+t+'" site:justdial.com','"'+t+'" site:indiamart.com','"'+t+'" business OR company OR office','"'+t+'" site:sulekha.com OR site:tradeindia.com'];
    d['Data Leaks']=['"'+t+'" site:pastebin.com','intext:"'+t+'" password OR user','"'+t+'" leaked OR breach OR dump'];
    d['Other']=['"'+t+'" filetype:pdf OR filetype:xls','"'+t+'" whatsapp OR telegram','"tel:'+t+'" OR "phone:'+t+'"'];
  }
  return d;
}
function renderDorkResults(dorks){
  var div=document.getElementById('dork-results');
  div.style.display='block';
  div.innerHTML='';
  var grid=document.createElement('div');
  grid.style.cssText='display:grid;grid-template-columns:1fr 1fr;gap:14px;';
  Object.entries(dorks).forEach(function(entry){
    var cat=entry[0];var qs=entry[1];
    var wrap=document.createElement('div');wrap.className='result-section';wrap.style.cssText='margin-bottom:0;';
    var title=document.createElement('div');title.className='result-section-title';title.textContent=cat.toUpperCase();
    wrap.appendChild(title);
    qs.forEach(function(q){
      var row=document.createElement('div');
      row.style.cssText='display:flex;align-items:flex-start;gap:8px;padding:8px 0;border-bottom:1px solid rgba(26,46,59,0.5);';
      row.innerHTML='<span style="font-family:Share Tech Mono,monospace;font-size:14px;color:var(--text);flex:1;word-break:break-all;line-height:1.5;">'+q+'</span><a href="https://google.com/search?q='+encodeURIComponent(q)+'" target="_blank" style="color:var(--accent);font-family:Share Tech Mono,monospace;font-size:12px;text-decoration:none;white-space:nowrap;border:1px solid rgba(0,212,255,0.3);padding:3px 8px;border-radius:3px;flex-shrink:0;">→</a>';
      wrap.appendChild(row);
    });
    grid.appendChild(wrap);
  });
  div.appendChild(grid);
}
function exportDorkTXT(){
  var d=resultData.dork;if(!d)return;
  var txt='PhantomEye Dork Report\nTarget: '+d.target+'\n\n';
  Object.entries(d.dorks).forEach(function(e){txt+=e[0]+':\n';e[1].forEach(function(q){txt+='  '+q+'\n';});txt+='\n';});
  var blob=new Blob([txt],{type:'text/plain'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='dorks-'+d.target+'.txt';a.click();
}

// ===== RISK SCORE =====
function updateRiskFromData(){
  var scores=[];

  // USERNAME — kitne platforms pe mila
  if(resultData.username){
    var pct=Math.round(resultData.username.found/resultData.username.total*100);
    // High digital footprint = higher exposure risk
    var uval = pct>=70?85 : pct>=40?65 : pct>=20?40 : 15;
    scores.push({label:'Username',value:uval});
  }

  // IP/DOMAIN — proxy/VPN/hosting = suspicious activity
  if(resultData.ip){
    var ival = resultData.ip.proxy?80 : resultData.ip.hosting?50 : 25;
    scores.push({label:'IP/Domain',value:ival});
  }

  // EMAIL — based on real SPF/DMARC security posture
  if(resultData.email){
    var eval2=20;
    if(!resultData.email.domainExists) eval2=10;
    else if(resultData.email.spf&&resultData.email.spf.status==='found'&&resultData.email.dmarc&&resultData.email.dmarc.status==='found') eval2=20;
    else if(resultData.email.spf&&resultData.email.spf.status==='found') eval2=45;
    else eval2=75; // No SPF/DMARC = email easily spoofable = high risk
    scores.push({label:'Email',value:eval2});
  }

  // METADATA — GPS location leaked = very high, device info = medium
  if(resultData.meta){
    var mval=10;
    if(resultData.meta.exif&&resultData.meta.exif.gpsLat) mval=90; // GPS = extreme privacy risk
    else if(resultData.meta.exif&&(resultData.meta.exif.make||resultData.meta.exif.software)) mval=45;
    else if(resultData.meta.author||resultData.meta.creator) mval=35;
    scores.push({label:'Metadata',value:mval});
  }

  // PHONE — valid number found + country identified = exposure risk
  if(resultData.phone){
    var pval=10;
    if(resultData.phone.isValid&&resultData.phone.country!=='Unknown') pval=60;
    else if(resultData.phone.isValid) pval=40;
    scores.push({label:'Phone',value:pval});
  }

  // HASH — weak hash = credentials easily crackable
  if(resultData.hash){
    var hval=20;
    if(resultData.hash.matches&&resultData.hash.matches.length){
      var s=resultData.hash.matches[0].s||'';
      hval = s==='VERY WEAK'?95 : s==='WEAK'?80 : s==='MEDIUM'?55 : s==='STRONG'?25 : 40;
    }
    scores.push({label:'Hash',value:hval});
  }

  // WHOIS — newly registered or no protection = higher risk
  if(resultData.whois){
    var wval=40;
    var hasProtection=resultData.whois.status&&resultData.whois.status.some(function(s){return s.toLowerCase().includes('clienttransferprohibited');});
    var regEvent=resultData.whois.events&&resultData.whois.events.find(function(e){return e.eventAction==='registration';});
    var domainAge=0;
    if(regEvent){domainAge=Math.floor((new Date()-new Date(regEvent.eventDate))/(365.25*24*3600*1000));}
    if(!hasProtection&&domainAge<1) wval=85; // New + unprotected = very risky
    else if(!hasProtection) wval=65;
    else if(hasProtection&&domainAge>=3) wval=20; // Old + protected = low risk
    else wval=35;
    scores.push({label:'WHOIS',value:wval});
  }

  // DNS — more record types exposed = larger attack surface
  if(resultData.dns){
    var dval=10;
    if(resultData.dns.records){
      var rkeys=Object.keys(resultData.dns.records);
      var hasSPF=resultData.dns.records.TXT&&resultData.dns.records.TXT.some(function(r){return r.data&&r.data.includes('v=spf1');});
      var hasDMARC=resultData.dns.records.TXT&&resultData.dns.records.TXT.some(function(r){return r.data&&r.data.includes('v=DMARC1');});
      var hasCAA=!!resultData.dns.records.CAA;
      // More exposed records + less security = higher risk
      dval = rkeys.length>=6 ? 60 : rkeys.length>=4 ? 45 : rkeys.length>=2 ? 30 : 15;
      if(!hasSPF) dval=Math.min(100,dval+15);
      if(!hasDMARC) dval=Math.min(100,dval+10);
      if(!hasCAA) dval=Math.min(100,dval+5);
    }
    scores.push({label:'DNS',value:dval});
  }

  // DORK — more dork categories = larger exposed surface
  if(resultData.dork){
    var totalDorks=Object.values(resultData.dork.dorks||{}).reduce(function(a,b){return a+b.length;},0);
    var dtype=resultData.dork.type;
    var drisk=dtype==='domain'?55:dtype==='email'?65:dtype==='person'?50:40;
    // More dorks generated = more potential exposure vectors
    drisk=Math.min(85, drisk + Math.floor(totalDorks/5));
    scores.push({label:'Dork',value:drisk});
  }

  if(!scores.length)return;
  var avg=Math.round(scores.reduce(function(a,b){return a+b.value;},0)/scores.length);
  var level=avg>=70?'HIGH':avg>=40?'MEDIUM':'LOW';
  var color=avg>=70?'var(--accent3)':avg>=40?'var(--warn)':'var(--accent2)';
  var el=document.getElementById('header-risk-val');
  if(el){el.textContent=level;el.style.color=color;}
  resultData.risk={score:avg,level:level,breakdown:scores,timestamp:new Date().toISOString()};
}
function refreshRiskPanel(){
  updateRiskFromData();
  if(!resultData.risk){
    document.getElementById('risk-empty').style.display='block';
    document.getElementById('risk-content').style.display='none';
    return;
  }
  var d=resultData.risk;
  document.getElementById('risk-empty').style.display='none';
  document.getElementById('risk-content').style.display='block';
  var colorHex=d.score>=70?'#ff6b35':d.score>=40?'#ffcc00':'#00ff88';
  var colorVar=d.score>=70?'var(--accent3)':d.score>=40?'var(--warn)':'var(--accent2)';
  var label=d.score>=70?'HIGH THREAT':d.score>=40?'MEDIUM RISK':'LOW RISK';

  // Score text
  document.getElementById('risk-score-big').textContent=d.score+'/100';
  document.getElementById('risk-score-big').style.color=colorVar;
  document.getElementById('risk-level-label').textContent=label;
  document.getElementById('risk-level-label').style.color=colorVar;

  // Draw gauge
  drawRiskGauge(d.score, colorHex);

  // Draw radar
  drawRiskRadar(d.breakdown);

  // Module bars
  var barsDiv=document.getElementById('risk-bars');
  barsDiv.innerHTML='';
  d.breakdown.forEach(function(b){
    var bc=b.value>=70?'#ff6b35':b.value>=40?'#ffcc00':'#00ff88';
    var bcv=b.value>=70?'var(--accent3)':b.value>=40?'var(--warn)':'var(--accent2)';
    var blabel=b.value>=70?'HIGH':b.value>=40?'MED':'LOW';
    var row=document.createElement('div');
    row.style.cssText='margin-bottom:12px;';
    row.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">'
      +'<span style="font-family:Share Tech Mono,monospace;font-size:14px;color:var(--text);">'+b.label+'</span>'
      +'<div style="display:flex;align-items:center;gap:8px;">'
      +'<span style="font-family:Share Tech Mono,monospace;font-size:12px;color:'+bcv+';border:1px solid '+bcv+';padding:1px 7px;border-radius:3px;letter-spacing:1px;">'+blabel+'</span>'
      +'<span style="font-family:Orbitron,monospace;font-size:15px;font-weight:700;color:'+bcv+';">'+b.value+'</span>'
      +'</div></div>'
      +'<div style="height:8px;background:var(--border);border-radius:4px;overflow:hidden;">'
      +'<div class="risk-bar-anim" style="height:100%;width:0%;background:'+bc+';border-radius:4px;box-shadow:0 0 8px '+bc+'55;transition:width 1s ease;" data-w="'+b.value+'%"></div>'
      +'</div>';
    barsDiv.appendChild(row);
  });
  // Animate bars after render
  setTimeout(function(){
    document.querySelectorAll('.risk-bar-anim').forEach(function(el){
      el.style.width=el.getAttribute('data-w');
    });
  },50);

  // Summary table
  var det=document.getElementById('risk-details');det.innerHTML='';
  var totalModules=11;
  var ts=new Date(d.timestamp);
  var formattedTime=ts.toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})+' '+ts.toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}).toUpperCase();
  renderSection(det,{title:'RISK SUMMARY',rows:[
    ['Overall Score','<span style="color:'+colorVar+';font-family:Orbitron,monospace;font-size:15px;font-weight:700;">'+d.score+'/100</span>'],
    ['Threat Level','<span style="color:'+colorVar+';font-weight:700;font-family:Share Tech Mono,monospace;letter-spacing:2px;">'+label+'</span>'],
    ['Modules Scanned',d.breakdown.length+' / '+totalModules],
    ['Scan Time',formattedTime],
  ]});
}

function drawRiskGauge(score, colorHex){
  var canvas=document.getElementById('risk-gauge-canvas');
  if(!canvas)return;
  var ctx=canvas.getContext('2d');
  var W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  var cx=W/2, cy=H-10, r=90;
  var startAngle=Math.PI, endAngle=2*Math.PI;

  // BG arc
  ctx.beginPath();ctx.arc(cx,cy,r,startAngle,endAngle);
  ctx.strokeStyle='rgba(26,46,59,0.8)';ctx.lineWidth=16;ctx.lineCap='round';ctx.stroke();

  // Colored zones
  var zones=[{s:0,e:0.33,c:'#00ff88'},{s:0.33,e:0.66,c:'#ffcc00'},{s:0.66,e:1,c:'#ff6b35'}];
  zones.forEach(function(z){
    ctx.beginPath();
    ctx.arc(cx,cy,r,Math.PI+z.s*Math.PI,Math.PI+z.e*Math.PI);
    ctx.strokeStyle=z.c+'44';ctx.lineWidth=16;ctx.lineCap='butt';ctx.stroke();
  });

  // Score arc
  var pct=score/100;
  ctx.beginPath();ctx.arc(cx,cy,r,Math.PI,Math.PI+pct*Math.PI);
  ctx.strokeStyle=colorHex;ctx.lineWidth=16;ctx.lineCap='round';
  ctx.shadowColor=colorHex;ctx.shadowBlur=18;ctx.stroke();ctx.shadowBlur=0;

  // Tick marks
  for(var i=0;i<=10;i++){
    var a=Math.PI+i*Math.PI/10;
    var x1=cx+Math.cos(a)*(r-10), y1=cy+Math.sin(a)*(r-10);
    var x2=cx+Math.cos(a)*(r+10), y2=cy+Math.sin(a)*(r+10);
    ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);
    ctx.strokeStyle='rgba(26,46,59,0.9)';ctx.lineWidth=2;ctx.stroke();
  }

  // Needle
  var needleAngle=Math.PI+pct*Math.PI;
  var nx=cx+Math.cos(needleAngle)*(r-22), ny=cy+Math.sin(needleAngle)*(r-22);
  ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(nx,ny);
  ctx.strokeStyle='#ffffff';ctx.lineWidth=2.5;ctx.lineCap='round';
  ctx.shadowColor='#fff';ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;
  ctx.beginPath();ctx.arc(cx,cy,5,0,Math.PI*2);
  ctx.fillStyle='#ffffff';ctx.fill();

  // Labels
  ctx.font='9px Share Tech Mono,monospace';ctx.fillStyle='rgba(106,143,168,0.8)';ctx.textAlign='center';
  ctx.fillText('LOW',cx-r+12,cy+14);
  ctx.fillText('MED',cx,cy-r+14);
  ctx.fillText('HIGH',cx+r-14,cy+14);
}

function drawRiskRadar(breakdown){
  var canvas=document.getElementById('risk-radar-canvas');
  if(!canvas||!breakdown||!breakdown.length)return;
  var ctx=canvas.getContext('2d');
  var W=canvas.width,H=canvas.height;
  ctx.clearRect(0,0,W,H);
  var cx=W/2,cy=H/2,maxR=78;
  var n=breakdown.length;
  if(n<3){
    ctx.font='11px Share Tech Mono,monospace';ctx.fillStyle='rgba(106,143,168,0.6)';ctx.textAlign='center';
    ctx.fillText('Scan 3+ modules',cx,cy);ctx.fillText('for radar view',cx,cy+16);return;
  }

  // Grid rings
  [0.25,0.5,0.75,1].forEach(function(frac){
    ctx.beginPath();
    for(var i=0;i<n;i++){
      var a=-Math.PI/2+(i/n)*Math.PI*2;
      var x=cx+Math.cos(a)*maxR*frac, y=cy+Math.sin(a)*maxR*frac;
      i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.strokeStyle='rgba(0,212,255,0.12)';ctx.lineWidth=1;ctx.stroke();
    if(frac===0.5||frac===1){
      ctx.font='8px Share Tech Mono,monospace';ctx.fillStyle='rgba(106,143,168,0.5)';ctx.textAlign='left';
      ctx.fillText(Math.round(frac*100),cx+4,cy-maxR*frac+3);
    }
  });

  // Axis lines
  for(var i=0;i<n;i++){
    var a=-Math.PI/2+(i/n)*Math.PI*2;
    ctx.beginPath();ctx.moveTo(cx,cy);
    ctx.lineTo(cx+Math.cos(a)*maxR,cy+Math.sin(a)*maxR);
    ctx.strokeStyle='rgba(0,212,255,0.15)';ctx.lineWidth=1;ctx.stroke();
  }

  // Data polygon fill
  ctx.beginPath();
  breakdown.forEach(function(b,i){
    var a=-Math.PI/2+(i/n)*Math.PI*2;
    var r=maxR*(b.value/100);
    var x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  });
  ctx.closePath();
  ctx.fillStyle='rgba(0,212,255,0.12)';ctx.fill();
  ctx.strokeStyle='rgba(0,212,255,0.7)';ctx.lineWidth=2;
  ctx.shadowColor='rgba(0,212,255,0.5)';ctx.shadowBlur=8;ctx.stroke();ctx.shadowBlur=0;

  // Dots + labels
  breakdown.forEach(function(b,i){
    var a=-Math.PI/2+(i/n)*Math.PI*2;
    var r=maxR*(b.value/100);
    var x=cx+Math.cos(a)*r, y=cy+Math.sin(a)*r;
    var dotColor=b.value>=70?'#ff6b35':b.value>=40?'#ffcc00':'#00ff88';
    ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle=dotColor;ctx.shadowColor=dotColor;ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;

    // Label
    var lx=cx+Math.cos(a)*(maxR+18), ly=cy+Math.sin(a)*(maxR+18);
    ctx.font='9px Share Tech Mono,monospace';ctx.fillStyle='rgba(200,216,232,0.85)';
    ctx.textAlign=lx<cx-5?'right':lx>cx+5?'left':'center';
    ctx.fillText(b.label,lx,ly+3);
  });
}

// ===== HASH IDENTIFIER =====
var HASH_DB = [
  // Pattern: [regex, name, description, strength, crack_difficulty, use_cases, variants]
  {r:/^\$2[ayb]\$\d{2}\$.{53}$/, n:'bcrypt', d:'Adaptive hash function with salt', s:'STRONG', c:'VERY HARD', u:'Password storage (modern apps)', v:['$2a$','$2b$','$2y$']},
  {r:/^\$argon2(i|d|id)\$/, n:'Argon2', d:'Memory-hard password hashing (PHC winner)', s:'VERY STRONG', c:'EXTREMELY HARD', u:'Modern password storage', v:['argon2i','argon2d','argon2id']},
  {r:/^\$scrypt\$/, n:'scrypt', d:'Memory-hard key derivation function', s:'VERY STRONG', c:'EXTREMELY HARD', u:'Password hashing, key derivation', v:[]},
  {r:/^\$1\$/, n:'MD5-Crypt', d:'MD5-based Unix crypt', s:'WEAK', c:'HARD (salted)', u:'Old Unix/Linux passwords', v:[]},
  {r:/^\$5\$/, n:'SHA-256-Crypt', d:'SHA-256-based Unix crypt', s:'MEDIUM', c:'HARD (salted)', u:'Linux shadow passwords', v:[]},
  {r:/^\$6\$/, n:'SHA-512-Crypt', d:'SHA-512-based Unix crypt', s:'STRONG', c:'VERY HARD', u:'Linux shadow passwords', v:[]},
  {r:/^\$apr1\$/, n:'Apache MD5-APR', d:'Apache-specific MD5 crypt', s:'WEAK', c:'MODERATE', u:'Apache .htpasswd files', v:[]},
  {r:/^[a-f0-9]{32}$/i, n:'MD5', d:'Message Digest 5 — 128-bit output', s:'WEAK', c:'EASY (rainbow tables)', u:'File checksums, legacy auth (broken)', v:['MD5','HMAC-MD5','MD5(MD5)']},
  {r:/^[a-f0-9]{40}$/i, n:'SHA-1', d:'Secure Hash Algorithm 1 — 160-bit', s:'WEAK', c:'MODERATE', u:'Git commits, old SSL certs (deprecated)', v:['SHA-1','HMAC-SHA1','MySQL5']},
  {r:/^[a-f0-9]{56}$/i, n:'SHA-224', d:'SHA-2 family — 224-bit output', s:'MEDIUM', c:'HARD', u:'Digital signatures, certificates', v:['SHA-224','SHA3-224']},
  {r:/^[a-f0-9]{64}$/i, n:'SHA-256', d:'SHA-2 family — 256-bit output', s:'STRONG', c:'VERY HARD', u:'Bitcoin, TLS 1.3, code signing', v:['SHA-256','SHA3-256','HMAC-SHA256','Keccak-256']},
  {r:/^[a-f0-9]{96}$/i, n:'SHA-384', d:'SHA-2 family — 384-bit output', s:'STRONG', c:'VERY HARD', u:'TLS certificates, ECDSA', v:['SHA-384','SHA3-384']},
  {r:/^[a-f0-9]{128}$/i, n:'SHA-512', d:'SHA-2 family — 512-bit output', s:'VERY STRONG', c:'EXTREMELY HARD', u:'High-security applications, file verification', v:['SHA-512','SHA3-512','Whirlpool']},
  {r:/^[a-f0-9]{8}$/i, n:'CRC32', d:'Cyclic Redundancy Check — 32-bit', s:'VERY WEAK', c:'TRIVIAL', u:'Data integrity check (not crypto)', v:['CRC32','Adler-32']},
  {r:/^[a-f0-9]{16}$/i, n:'MySQL323 / Half-MD5', d:'Old MySQL password hash or half of MD5', s:'VERY WEAK', c:'TRIVIAL', u:'Old MySQL (<4.1) passwords', v:['MySQL323','Half-MD5','DES']},
  {r:/^[a-z0-9]{32}$/i, n:'MD5 (lowercase)', d:'MD5 variant with lowercase hex', s:'WEAK', c:'EASY', u:'Legacy web applications', v:[]},
  {r:/^[a-f0-9]{48}$/i, n:'Tiger-192 / HAVAL-192', d:'192-bit hash function', s:'MEDIUM', c:'HARD', u:'File integrity, older applications', v:['Tiger-192','HAVAL-192']},
  {r:/^[a-zA-Z0-9+\/]{24}=$/, n:'Base64-MD5', d:'MD5 hash encoded in Base64', s:'WEAK', c:'EASY', u:'HTTP Digest auth', v:[]},
  {r:/^[a-f0-9]{28}$/i, n:'HAVAL-224 / SHA-224(variant)', d:'224-bit HAVAL hash', s:'MEDIUM', c:'HARD', u:'File checksums', v:['HAVAL-224']},
  {r:/^\*[a-f0-9]{40}$/i, n:'MySQL4.1+ / SHA1(SHA1)', d:'MySQL password hash v4.1+', s:'WEAK', c:'MODERATE', u:'MySQL 4.1+ password storage', v:[]},
  {r:/^[a-f0-9]{32}:[a-f0-9]{32}$/i, n:'MD5 with Salt', d:'MD5 hash with 32-char hex salt', s:'WEAK', c:'MODERATE', u:'Salted MD5 passwords', v:[]},
  {r:/^[a-f0-9]{40}:[a-f0-9]+$/i, n:'SHA1 with Salt', d:'SHA-1 hash with salt appended', s:'WEAK', c:'MODERATE', u:'Salted SHA1 passwords', v:[]},
  {r:/^[a-f0-9]{64}:[a-f0-9]+$/i, n:'SHA-256 with Salt', d:'SHA-256 hash with salt', s:'STRONG', c:'VERY HARD', u:'Salted SHA-256 passwords', v:[]},
  {r:/^[a-zA-Z0-9]{13}$/, n:'DES (Unix Crypt)', d:'Traditional Unix DES crypt — 13 chars', s:'VERY WEAK', c:'EASY', u:'Old Unix passwords (obsolete)', v:[]},
  {r:/^[a-f0-9]{80}$/i, n:'RIPEMD-320', d:'320-bit RIPEMD variant', s:'STRONG', c:'VERY HARD', u:'File integrity in crypto apps', v:['RIPEMD-320']},
  {r:/^[a-f0-9]{40}$/i, n:'RIPEMD-160 / SHA-1', d:'160-bit RIPEMD — same length as SHA-1', s:'WEAK', c:'MODERATE', u:'Bitcoin address generation, PGP', v:['RIPEMD-160']},
];

function getHashStrengthColor(s){
  if(s==='VERY STRONG')return'#00ff88';
  if(s==='STRONG')return'#00d4ff';
  if(s==='MEDIUM')return'#ffcc00';
  if(s==='WEAK')return'#ff6b35';
  return'#ff2244';
}
function getCrackColor(c){
  if(c==='TRIVIAL')return'#ff2244';
  if(c==='EASY')return'#ff6b35';
  if(c==='MODERATE')return'#ffcc00';
  if(c==='HARD'||c==='VERY HARD')return'#00d4ff';
  return'#00ff88';
}

async function runHashIdentify(){
  var hash=document.getElementById('hash-input').value.trim();
  if(!hash){showError('hash-results','Paste a hash string to identify.');return;}
  if(/\s/.test(hash)){showError('hash-results','Invalid hash — hashes cannot contain spaces.');return;}
  if(hash.length<8){showError('hash-results','String too short — minimum hash length is 8 characters.');return;}
  if(hash.length>512){showError('hash-results','String too long — maximum supported hash length is 512 characters.');return;}
  if(!/^[a-fA-F0-9$./\\+:*!@#%^&\-_=]+$/.test(hash)){showError('hash-results','Input contains invalid characters — hashes use hex (0-9, a-f) or base64 characters.');return;}
  incrementScanCount();showProgress('hash',true);setProgress('hash',20);saveSuggest('hash',hash);
  document.getElementById('hash-results').innerHTML='<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:14px;padding:10px">⟳ Analyzing hash...</div>';
  await delay(300);

  // Clean hash
  var clean=hash.replace(/\s/g,'');
  var len=clean.length;

  // Identify hash type
  var matches=HASH_DB.filter(function(h){return h.r.test(clean);});
  var seen={};
  matches=matches.filter(function(m){if(seen[m.n])return false;seen[m.n]=true;return true;});

  setProgress('hash',40);

  setProgress('hash',100);await delay(150);

  var data={hash:hash,clean:clean,length:len,matches:matches,timestamp:new Date().toISOString()};
  resultData.hash=data;
  addToHistory('hash', clean.substring(0,24)+'...', matches.length>0?matches[0].name:'Unknown hash type');
  renderHashResults(data);
  showProgress('hash',false);
  document.getElementById('hash-actions').style.display='flex';if(window.triggerGlitch)triggerGlitch();updateRiskFromData();
}

function renderHashResults(d){
  var div=document.getElementById('hash-results');div.innerHTML='';

  // Hash info card
  var infoWrap=document.createElement('div');infoWrap.className='result-section';infoWrap.style.marginBottom='14px';
  infoWrap.innerHTML='<div class="result-section-title">HASH INPUT</div>'
    +'<table class="result-table"><tr><td class="result-key">Hash</td><td class="result-val" style="word-break:break-all;font-size:14px;color:var(--accent);">'+d.clean+'</td></tr>'
    +'<tr><td class="result-key">Length</td><td class="result-val">'+d.length+' characters</td></tr>'
    +'<tr><td class="result-key">Matches Found</td><td class="result-val" style="color:'+(d.matches.length?'var(--accent2)':'var(--accent3)')+';">'+d.matches.length+(d.matches.length?' possible algorithm'+(d.matches.length>1?'s':''):' — Unknown hash format')+'</td></tr>'
    +'</table>';
  div.appendChild(infoWrap);

  if(d.matches.length===0){
    var unknown=document.createElement('div');unknown.className='result-section';
    unknown.innerHTML='<div class="result-section-title">IDENTIFICATION RESULT</div>'
      +'<div style="display:flex;align-items:center;gap:14px;padding:14px;background:rgba(255,34,68,0.05);border:1px solid rgba(255,34,68,0.2);border-radius:7px;">'
      +'<div style="font-size:32px;">❓</div>'
      +'<div><div style="font-family:Orbitron,monospace;font-size:15px;font-weight:700;color:var(--accent3);margin-bottom:4px;">UNKNOWN HASH</div>'
      +'<div style="font-family:Share Tech Mono,monospace;font-size:13px;color:var(--text2);">Hash format not recognized. Could be custom, salted, or obfuscated.</div></div></div>';
    div.appendChild(unknown);
    return;
  }

  // Primary match — big card
  var primary=d.matches[0];
  var sc=getHashStrengthColor(primary.s);
  var cc=getCrackColor(primary.c);
  var primaryCard=document.createElement('div');primaryCard.className='result-section';primaryCard.style.marginBottom='14px';
  primaryCard.style.border='1px solid '+sc+'44';
  primaryCard.innerHTML='<div class="result-section-title">PRIMARY IDENTIFICATION</div>'
    +'<div style="display:flex;align-items:flex-start;gap:16px;margin-bottom:14px;">'
    +'<div style="width:56px;height:56px;border-radius:10px;background:'+sc+'18;border:2px solid '+sc+'66;display:flex;align-items:center;justify-content:center;font-size:26px;flex-shrink:0;">🔑</div>'
    +'<div style="flex:1;">'
    +'<div style="font-family:Orbitron,monospace;font-size:20px;font-weight:900;color:'+sc+';margin-bottom:4px;">'+primary.n+'</div>'
    +'<div style="font-family:Share Tech Mono,monospace;font-size:14px;color:var(--text2);margin-bottom:8px;">'+primary.d+'</div>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap;">'
    +'<span style="font-size:12px;font-family:Share Tech Mono,monospace;padding:3px 10px;border-radius:4px;border:1px solid '+sc+';color:'+sc+';">STRENGTH: '+primary.s+'</span>'
    +'<span style="font-size:12px;font-family:Share Tech Mono,monospace;padding:3px 10px;border-radius:4px;border:1px solid '+cc+';color:'+cc+';">CRACK: '+primary.c+'</span>'
    +'</div></div></div>'
    +'<table class="result-table">'
    +'<tr><td class="result-key">Hash Length</td><td class="result-val">'+d.length+' chars ('+d.length*4+' bits)</td></tr>'
    +'<tr><td class="result-key">Use Cases</td><td class="result-val">'+primary.u+'</td></tr>'
    +(primary.v.length?'<tr><td class="result-key">Variants</td><td class="result-val" style="color:var(--accent2);">'+primary.v.join(' · ')+'</td></tr>':'')
    +'</table>';
  div.appendChild(primaryCard);

  // Security visual — strength meter
  var strengthPct={'VERY WEAK':10,'WEAK':28,'MEDIUM':52,'STRONG':75,'VERY STRONG':95}[primary.s]||50;
  var meterCard=document.createElement('div');meterCard.className='result-section';meterCard.style.marginBottom='14px';
  meterCard.innerHTML='<div class="result-section-title">SECURITY RATING</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">'
    // Strength
    +'<div><div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-family:Share Tech Mono,monospace;font-size:13px;color:var(--text2);">Algorithm Strength</span><span style="font-family:Orbitron,monospace;font-size:13px;color:'+sc+';">'+primary.s+'</span></div>'
    +'<div style="height:10px;background:var(--border);border-radius:5px;overflow:hidden;">'
    +'<div style="height:100%;width:'+strengthPct+'%;background:'+sc+';border-radius:5px;box-shadow:0 0 8px '+sc+'66;transition:width 1s ease;"></div></div>'
    +'<div style="display:flex;justify-content:space-between;margin-top:4px;font-family:Share Tech Mono,monospace;font-size:11px;color:var(--text2);"><span>WEAK</span><span>STRONG</span></div></div>'
    // Crack difficulty
    +'<div><div style="display:flex;justify-content:space-between;margin-bottom:6px;"><span style="font-family:Share Tech Mono,monospace;font-size:13px;color:var(--text2);">Crack Difficulty</span><span style="font-family:Share Tech Mono,monospace;font-size:12px;color:'+cc+';">'+primary.c+'</span></div>'
    +'<div style="height:10px;background:var(--border);border-radius:5px;overflow:hidden;">'
    +'<div style="height:100%;width:'+({'TRIVIAL':8,'EASY':25,'MODERATE':50,'HARD':72,'VERY HARD':88,'EXTREMELY HARD':98}[primary.c]||50)+'%;background:'+cc+';border-radius:5px;box-shadow:0 0 8px '+cc+'66;transition:width 1s ease;"></div></div>'
    +'<div style="display:flex;justify-content:space-between;margin-top:4px;font-family:Share Tech Mono,monospace;font-size:11px;color:var(--text2);"><span>TRIVIAL</span><span>IMPOSSIBLE</span></div></div>'
    +'</div>';
  div.appendChild(meterCard);

  // Other possible matches
  if(d.matches.length>1){
    var altCard=document.createElement('div');altCard.className='result-section';altCard.style.marginBottom='14px';
    altCard.innerHTML='<div class="result-section-title">OTHER POSSIBLE ALGORITHMS ('+( d.matches.length-1)+')</div>'
      +d.matches.slice(1).map(function(m){
        var mc=getHashStrengthColor(m.s);
        return '<div style="display:flex;align-items:center;gap:12px;padding:9px 0;border-bottom:1px solid rgba(26,46,59,0.5);">'
          +'<div style="font-family:Orbitron,monospace;font-size:15px;font-weight:700;color:'+mc+';flex:1;">'+m.n+'</div>'
          +'<span style="font-size:12px;font-family:Share Tech Mono,monospace;padding:2px 8px;border-radius:3px;border:1px solid '+mc+';color:'+mc+';">'+m.s+'</span>'
          +'<span style="font-size:12px;font-family:Share Tech Mono,monospace;color:var(--text2);">'+m.u.split(',')[0]+'</span>'
          +'</div>';
      }).join('');
    div.appendChild(altCard);
  }

  // Cracking tools card
  var toolsCard=document.createElement('div');toolsCard.className='result-section';
  toolsCard.innerHTML='<div class="result-section-title">CRACKING RESOURCES</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">'
    +'<a href="https://crackstation.net/" target="_blank" style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.15);border-radius:6px;text-decoration:none;">'
    +'<span style="font-size:16px;">🔓</span><div><div style="font-family:Share Tech Mono,monospace;font-size:14px;color:var(--accent);">CrackStation</div><div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text2);">Free online lookup</div></div></a>'
    +'<a href="https://hashes.com/en/decrypt/hash" target="_blank" style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.15);border-radius:6px;text-decoration:none;">'
    +'<span style="font-size:16px;">🗄️</span><div><div style="font-family:Share Tech Mono,monospace;font-size:14px;color:var(--accent);">Hashes.com</div><div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text2);">Large hash DB</div></div></a>'
    +'<a href="https://www.cmd5.org/" target="_blank" style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.15);border-radius:6px;text-decoration:none;">'
    +'<span style="font-size:16px;">🔍</span><div><div style="font-family:Share Tech Mono,monospace;font-size:14px;color:var(--accent);">CMD5</div><div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text2);">MD5 / SHA lookup</div></div></a>'
    +'<a href="https://hashcat.net/hashcat/" target="_blank" style="display:flex;align-items:center;gap:8px;padding:10px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.15);border-radius:6px;text-decoration:none;">'
    +'<span style="font-size:16px;">⚡</span><div><div style="font-family:Share Tech Mono,monospace;font-size:14px;color:var(--accent);">Hashcat</div><div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text2);">GPU-based cracker</div></div></a>'
    +'</div>';
  div.appendChild(toolsCard);
}


// ===== WHOIS LOOKUP =====
async function runWhoisLookup(){
  var domain = document.getElementById('whois-input').value.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//,'').replace(/\/.*/,'');
  if(!domain){showError('whois-results','Enter a domain name to lookup.');return;}
  if(!/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(domain)){showError('whois-results','Invalid domain — enter a valid domain name (e.g. google.com). Do not include http:// or paths.');return;}
  if(/^(\d{1,3}\.){3}\d{1,3}$/.test(domain)){showError('whois-results','IP addresses are not supported in WHOIS — use MODULE 02 for IP lookup.');return;}
  setBtn('whois', true); showProgress('whois', true); setProgress('whois', 15);
  document.getElementById('whois-results').innerHTML = '<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:12px;padding:10px">⟳ Querying RDAP database...</div>';

  // Get TLD to find correct RDAP server
  var tld = domain.split('.').pop();
  incrementScanCount();saveSuggest('whois', domain);

  setProgress('whois', 40);
  try {
    var r = await fetch(rdapUrl);
    if(!r.ok) throw new Error('RDAP failed: ' + r.status);
    var data = await r.json();
    setProgress('whois', 90);
    renderWhoisResults(data, domain);
    document.getElementById('whois-actions').style.display = 'flex';
    resultData.whois = data;
    resultData.whois._domain = domain;
    addToHistory('whois', domain, 'RDAP data retrieved');
    if(window.triggerGlitch)triggerGlitch();
    updateRiskFromData();
  } catch(e) {
    // Fallback to alternative RDAP
    try {
      var r2 = await fetch('https://rdap.verisign.com/com/v1/domain/' + domain);
      if(!r2.ok) throw new Error('fallback failed');
      var data2 = await r2.json();
      setProgress('whois', 90);
      renderWhoisResults(data2, domain);
      document.getElementById('whois-actions').style.display = 'flex';
      resultData.whois = data2;
      addToHistory('whois', domain, 'RDAP data retrieved (fallback)');
    } catch(e2) {
      document.getElementById('whois-results').innerHTML =
        '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:16px 18px;">'
        +'<div style="font-size:11px;color:var(--accent3);letter-spacing:3px;font-family:Share Tech Mono,monospace;margin-bottom:10px;">// WHOIS LOOKUP FAILED</div>'
        +'<div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text2);margin-bottom:14px;">Could not retrieve RDAP data for <span style="color:var(--accent);">'+domain+'</span>. CORS or domain not found.</div>'
        +'<div style="display:flex;flex-direction:column;gap:8px;">'
        +'<a href="https://who.is/whois/'+domain+'" target="_blank" style="color:var(--accent);font-family:Share Tech Mono,monospace;font-size:11px;padding:7px 12px;border:1px solid rgba(0,212,255,0.3);border-radius:4px;text-decoration:none;">who.is →</a>'
        +'<a href="https://www.whois.com/whois/'+domain+'" target="_blank" style="color:var(--accent);font-family:Share Tech Mono,monospace;font-size:11px;padding:7px 12px;border:1px solid rgba(0,212,255,0.3);border-radius:4px;text-decoration:none;">whois.com →</a>'
        +'<a href="https://lookup.icann.org/lookup?name='+domain+'" target="_blank" style="color:var(--accent);font-family:Share Tech Mono,monospace;font-size:11px;padding:7px 12px;border:1px solid rgba(0,212,255,0.3);border-radius:4px;text-decoration:none;">ICANN Lookup →</a>'
        +'</div></div>';
    }
  }
  setBtn('whois', false); showProgress('whois', false); setProgress('whois', 100);
}

function renderWhoisResults(data, domain) {
  var div = document.getElementById('whois-results'); div.innerHTML = '';

  // Helper: get event date by type
  function getEvent(type) {
    if(!data.events) return 'N/A';
    var ev = data.events.find(function(e){ return e.eventAction === type; });
    return ev ? new Date(ev.eventDate).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric'}) : 'N/A';
  }

  // Domain Status
  var statuses = (data.status||[]).map(function(s){
    return '<span style="font-size:10px;font-family:Share Tech Mono,monospace;padding:2px 8px;border:1px solid rgba(0,212,255,0.3);border-radius:3px;color:var(--accent2);margin:2px;">'+s+'</span>';
  }).join(' ');

  // Registrar info
  var registrar = 'N/A';
  if(data.entities) {
    var reg = data.entities.find(function(e){ return e.roles && e.roles.indexOf('registrar') !== -1; });
    if(reg && reg.vcardArray && reg.vcardArray[1]) {
      var fn = reg.vcardArray[1].find(function(v){ return v[0]==='fn'; });
      if(fn) registrar = fn[3];
    }
  }

  // Nameservers
  var ns = (data.nameservers||[]).map(function(n){ return n.ldhName||n.unicodeName||''; }).filter(Boolean);

  // Registrant info
  var registrant = {name:'N/A', org:'N/A', country:'N/A', email:'N/A'};
  if(data.entities) {
    var reg2 = data.entities.find(function(e){ return e.roles && e.roles.indexOf('registrant') !== -1; });
    if(reg2 && reg2.vcardArray && reg2.vcardArray[1]) {
      var vcard = reg2.vcardArray[1];
      var fn2 = vcard.find(function(v){return v[0]==='fn';});
      var org2 = vcard.find(function(v){return v[0]==='org';});
      var adr = vcard.find(function(v){return v[0]==='adr';});
      var email2 = vcard.find(function(v){return v[0]==='email';});
      if(fn2) registrant.name = fn2[3]||'N/A';
      if(org2) registrant.org = Array.isArray(org2[3])?org2[3].join(' '):org2[3]||'N/A';
      if(adr && adr[3]) registrant.country = Array.isArray(adr[3])?adr[3][6]||'N/A':adr[3]||'N/A';
      if(email2) registrant.email = email2[3]||'N/A';
    }
  }

  // RDAP Privacy check
  var isPrivate = registrant.name === 'N/A' || registrant.name.toLowerCase().includes('redacted') || registrant.name.toLowerCase().includes('privacy');

  var created = getEvent('registration');
  var updated = getEvent('last changed');
  var expires = getEvent('expiration');

  // Calculate domain age
  var ageStr = 'N/A';
  if(created !== 'N/A') {
    var createdDate = new Date(data.events.find(function(e){return e.eventAction==='registration';}).eventDate);
    var years = Math.floor((new Date()-createdDate)/(365.25*24*3600*1000));
    var months = Math.floor(((new Date()-createdDate)%(365.25*24*3600*1000))/(30.44*24*3600*1000));
    ageStr = years > 0 ? years+'y '+months+'m' : months+' months';
  }

  renderSection(div, {title:'// DOMAIN IDENTITY', rows:[
    ['Domain', '<span style="color:var(--accent);font-family:Orbitron,monospace;font-weight:700;">'+( data.ldhName||domain).toUpperCase()+'</span>'],
    ['Handle', data.handle||'N/A'],
    ['Status', statuses||'N/A'],
    ['Privacy', isPrivate ? '🔒 REDACTED / Privacy protected' : '⚠️ Info may be exposed'],
  ]});

  renderSection(div, {title:'// REGISTRATION DATES', rows:[
    ['Created', created],
    ['Last Updated', updated],
    ['Expires', expires],
    ['Domain Age', ageStr],
  ]});

  renderSection(div, {title:'// REGISTRAR', rows:[
    ['Registrar', registrar],
    ['IANA ID', data.entities ? (function(){ var r=data.entities.find(function(e){return e.roles&&e.roles.indexOf('registrar')!==-1;}); return r&&r.handle?r.handle:'N/A'; })() : 'N/A'],
    ['RDAP URL', '<a href="'+( data.links&&data.links[0]?data.links[0].href:'#')+'" target="_blank" style="color:var(--accent);">View RDAP →</a>'],
  ]});

  renderSection(div, {title:'// REGISTRANT INFO', rows:[
    ['Name', registrant.name],
    ['Organization', registrant.org],
    ['Country', registrant.country],
    ['Email', registrant.email !== 'N/A' ? '<a href="mailto:'+registrant.email+'" style="color:var(--accent);">'+registrant.email+'</a>' : 'N/A'],
  ]});

  if(ns.length) {
    renderSection(div, {title:'// NAMESERVERS ('+ns.length+')', rows: ns.map(function(n,i){return ['NS '+(i+1), n];})});
  }

  // Quick links
  var linksWrap = document.createElement('div'); linksWrap.className = 'result-section';
  linksWrap.innerHTML = '<div class="result-section-title">// EXTERNAL LINKS</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">'
    +'<a href="https://www.shodan.io/search?query=hostname:'+domain+'" target="_blank" style="display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.15);border-radius:6px;text-decoration:none;"><span style="font-size:15px;">🔍</span><div><div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--accent);">Shodan</div><div style="font-family:Share Tech Mono,monospace;font-size:10px;color:var(--text2);">Open ports & services</div></div></a>'
    +'<a href="https://www.virustotal.com/gui/domain/'+domain+'" target="_blank" style="display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.15);border-radius:6px;text-decoration:none;"><span style="font-size:15px;">🦠</span><div><div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--accent);">VirusTotal</div><div style="font-family:Share Tech Mono,monospace;font-size:10px;color:var(--text2);">Malware & reputation</div></div></a>'
    +'<a href="https://web.archive.org/web/*/'+domain+'" target="_blank" style="display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.15);border-radius:6px;text-decoration:none;"><span style="font-size:15px;">📚</span><div><div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--accent);">Wayback Machine</div><div style="font-family:Share Tech Mono,monospace;font-size:10px;color:var(--text2);">Historical snapshots</div></div></a>'
    +'<a href="https://securitytrails.com/domain/'+domain+'/dns" target="_blank" style="display:flex;align-items:center;gap:8px;padding:9px 12px;background:rgba(0,212,255,0.04);border:1px solid rgba(0,212,255,0.15);border-radius:6px;text-decoration:none;"><span style="font-size:15px;">🛡️</span><div><div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--accent);">SecurityTrails</div><div style="font-family:Share Tech Mono,monospace;font-size:10px;color:var(--text2);">DNS history</div></div></a>'
    +'</div>';
  div.appendChild(linksWrap);
}

// ===== DNS LOOKUP =====
async function runDNSLookup(){
  var domain = document.getElementById('dns-input').value.trim().toLowerCase();
  domain = domain.replace(/^https?:\/\//,'').replace(/\/.*/,'');
  if(!domain){showError('dns-results','Enter a domain name to resolve.');return;}
  if(!/^[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z]{2,})+$/.test(domain)&&!/^(\d{1,3}\.){3}\d{1,3}$/.test(domain)){showError('dns-results','Invalid input — enter a valid domain (e.g. google.com) or subdomain (e.g. mail.example.com).');return;}
  incrementScanCount();saveSuggest('dns', domain);
  document.getElementById('dns-results').innerHTML = '<div style="color:var(--text2);font-family:Share Tech Mono,monospace;font-size:12px;padding:10px">⟳ Querying DNS records via Cloudflare DoH...</div>';

  var types = ['A','AAAA','MX','TXT','NS','CNAME','SOA','CAA'];
  var allRecords = {};
  var total = types.length;
  var done = 0;

  for(var i = 0; i < types.length; i++){
    var type = types[i];
    try {
      var r = await fetch('https://cloudflare-dns.com/dns-query?name='+encodeURIComponent(domain)+'&type='+type, {
        headers:{'Accept':'application/dns-json'}
      });
      var data = await r.json();
      if(data.Answer && data.Answer.length) {
        allRecords[type] = data.Answer;
      }
    } catch(e) {}
    done++;
    setProgress('dns', Math.round((done/total)*90));
  }

  setProgress('dns', 100);
  resultData.dns = {domain: domain, records: allRecords, timestamp: new Date().toISOString()};
  addToHistory('dns', domain, Object.keys(allRecords).length+' record types found');
  renderDNSResults(allRecords, domain);
  setBtn('dns', false); showProgress('dns', false);
  document.getElementById('dns-actions').style.display = 'flex';if(window.triggerGlitch)triggerGlitch();
  updateRiskFromData();
}

function renderDNSResults(records, domain){
  var div = document.getElementById('dns-results'); div.innerHTML = '';
  var types = Object.keys(records);

  if(!types.length){
    div.innerHTML = '<div style="background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:16px 18px;font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text2);">⚠ No DNS records found for <span style="color:var(--accent);">'+domain+'</span>. Domain may not exist or have no public records.</div>';
    return;
  }

  // Summary card
  var summaryWrap = document.createElement('div'); summaryWrap.className = 'result-section'; summaryWrap.style.marginBottom='14px';
  summaryWrap.innerHTML = '<div class="result-section-title">// DNS SUMMARY</div>'
    +'<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;">'
    + types.map(function(t){
        return '<div style="text-align:center;padding:10px 8px;background:rgba(0,212,255,0.05);border:1px solid rgba(0,212,255,0.15);border-radius:6px;">'
          +'<div style="font-family:Orbitron,monospace;font-size:16px;font-weight:700;color:var(--accent);">'+records[t].length+'</div>'
          +'<div style="font-family:Share Tech Mono,monospace;font-size:10px;color:var(--text2);margin-top:2px;">'+t+'</div>'
          +'</div>';
      }).join('')
    +'</div>';
  div.appendChild(summaryWrap);

  // Record type descriptions
  var typeDesc = {A:'IPv4 address',AAAA:'IPv6 address',MX:'Mail server',TXT:'Text records / SPF / DKIM',NS:'Nameservers',CNAME:'Canonical name alias',SOA:'Start of authority',CAA:'Certificate authority'};

  // Each record type section
  types.forEach(function(type){
    var recs = records[type];
    var rows = recs.map(function(r){
      var val = r.data || '';
      var ttl = r.TTL ? r.TTL+'s' : 'N/A';
      // Format MX nicely
      if(type==='MX') {
        var parts = val.split(' ');
        val = '<span style="color:var(--warn);">Priority '+parts[0]+'</span> → '+parts.slice(1).join(' ');
      }
      // Highlight IPs
      if(type==='A'||type==='AAAA') val = '<span style="color:var(--accent);font-weight:600;">'+val+'</span>';
      // TXT - wrap long values
      if(type==='TXT') val = '<span style="word-break:break-all;font-size:11px;">'+val+'</span>';
      return [r.name||domain, val+'<span style="color:var(--text2);font-size:10px;margin-left:8px;">TTL:'+ttl+'</span>'];
    });
    renderSection(div, {title:'// '+type+' RECORDS — '+( typeDesc[type]||''), rows: rows});
  });

  // Security analysis
  var hasSPF = records.TXT && records.TXT.some(function(r){return r.data && r.data.includes('v=spf1');});
  var hasDKIM = records.TXT && records.TXT.some(function(r){return r.data && r.data.includes('v=DKIM1');});
  var hasDMARC = records.TXT && records.TXT.some(function(r){return r.data && r.data.includes('v=DMARC1');});
  var hasCAA = !!records.CAA;

  var secWrap = document.createElement('div'); secWrap.className = 'result-section';
  secWrap.innerHTML = '<div class="result-section-title">// EMAIL SECURITY ANALYSIS</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">'
    +[['SPF', hasSPF, 'Sender Policy Framework'],['DKIM', hasDKIM, 'DomainKeys Identified Mail'],['DMARC', hasDMARC, 'Domain-based Msg Auth'],['CAA', hasCAA, 'Cert Authority Auth']].map(function(item){
      var color = item[1] ? 'var(--accent2)' : 'var(--accent3)';
      var icon = item[1] ? '✅' : '❌';
      return '<div style="display:flex;align-items:center;gap:10px;padding:10px 12px;background:'+(item[1]?'rgba(0,255,136,0.04)':'rgba(255,107,53,0.04)')+';border:1px solid '+(item[1]?'rgba(0,255,136,0.2)':'rgba(255,107,53,0.2)')+';border-radius:6px;">'
        +'<span style="font-size:18px;">'+icon+'</span>'
        +'<div><div style="font-family:Orbitron,monospace;font-size:12px;font-weight:700;color:'+color+';">'+item[0]+'</div>'
        +'<div style="font-family:Share Tech Mono,monospace;font-size:9px;color:var(--text2);">'+item[2]+'</div></div>'
        +'</div>';
    }).join('')
    +'</div>';
  div.appendChild(secWrap);
}

// ===== EXPORTS =====
function exportJSON(module){
  var data=resultData[module];if(!data)return;
  var blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='phantomeye-'+module+'-'+Date.now()+'.json';a.click();
}
function copyResults(module){
  var data=resultData[module];if(!data)return;
  navigator.clipboard.writeText(JSON.stringify(data,null,2)).then(function(){showToast('Results copied to clipboard','success');}).catch(function(){showToast('Copy failed — try again','error');});
}
function exportPDF(module){
  var data=resultData[module];if(!data){showToast('No data to export — run a scan first','error');return;}
  var jsPDF=window.jspdf.jsPDF;var doc=new jsPDF();
  doc.setFillColor(6,10,15);doc.rect(0,0,210,297,'F');
  doc.setTextColor(0,212,255);doc.setFontSize(18);doc.setFont('helvetica','bold');
  doc.text('PhantomEye INTELLIGENCE REPORT',15,18);
  doc.setTextColor(106,143,168);doc.setFontSize(8);
  doc.text('Module: '+module.toUpperCase()+'  |  '+new Date().toLocaleString(),15,26);
  doc.setDrawColor(0,212,255);doc.setLineWidth(0.4);doc.line(15,30,195,30);
  var y=40;
  function pdfSection(title,rows){
    if(y>260){doc.addPage();doc.setFillColor(6,10,15);doc.rect(0,0,210,297,'F');y=20;}
    doc.setTextColor(0,212,255);doc.setFontSize(9);doc.setFont('helvetica','bold');doc.text(title,15,y);y+=6;
    doc.setDrawColor(26,46,59);doc.setLineWidth(0.3);doc.line(15,y,195,y);y+=4;
    rows.forEach(function(r){
      if(y>272){doc.addPage();doc.setFillColor(6,10,15);doc.rect(0,0,210,297,'F');y=20;}
      doc.setTextColor(0,212,255);doc.setFontSize(7);doc.setFont('helvetica','normal');doc.text(String(r[0]),15,y);
      doc.setTextColor(200,216,232);
      var val=String(r[1]).replace(/<[^>]+>/g,'');
      var lines=doc.splitTextToSize(val,115);
      doc.text(lines,78,y);y+=Math.max(5,lines.length*4.5);
    });y+=4;
  }
  if(module==='username'&&data)pdfSection('USERNAME',[['Username',data.username],['Found',data.found],['Total',data.total]]);
  else if(module==='ip'&&data)pdfSection('IP RECON',[['IP',data.query],['ISP',data.isp],['Country',data.country],['City',data.city]]);
  else if(module==='email'&&data)pdfSection('EMAIL INTEL',[['Email',data.email],['Domain',data.domain],['Risk',data.riskScore]]);
  else if(module==='phone'&&data)pdfSection('PHONE',[['Number',data.fullNumber],['Country',data.country],['Valid',data.isValid?'YES':'CHECK']]);
  else if(module==='dork'&&data){pdfSection('DORK SUMMARY',[['Target',data.target],['Type',data.type]]);Object.entries(data.dorks).forEach(function(e){pdfSection(e[0],e[1].map(function(q,i){return ['Dork '+(i+1),q];}));});}
  else if(module==='risk'&&data)pdfSection('RISK',[['Score',data.score+'/100'],['Level',data.level]]);
  else if(module==='meta'&&data)pdfSection('METADATA',[['File',data.filename],['Type',data.mimeType],['Size',data.fileSize]]);
  
  doc.setTextColor(26,46,59);doc.setFontSize(7);doc.text('PhantomEye | Mihir Rathod 2026',15,290);
  doc.save('phantomeye-'+module+'-'+Date.now()+'.pdf');
}

// ===== BACKGROUND — CyberGrid Pulse v2 =====
// Layered: Matrix rain + Hex grid pulse + Data streams + Particle network
(function(){
  var canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H;

  // ── Char sets ───────────────────────────────────────────────
  var BINARY  = ['0','1'];
  var SYMBOLS = ['<','>','[',']','{','}','|','#','@','!','/','\\',
                 '+','=','*','~','^','&','%','$','?',':',';','_'];
  var HEX     = ['A','B','C','D','E','F','0','1','2','3','4','5','6','7','8','9'];
  var KATAKANA = ['ﾀ','ﾁ','ﾂ','ﾃ','ﾄ','ﾅ','ﾆ','ﾇ','ﾈ','ﾉ','ﾊ','ﾋ','ﾌ','ﾍ','ﾎ',
                  'ﾏ','ﾐ','ﾑ','ﾒ','ﾓ','ﾔ','ﾕ','ﾖ','ﾗ','ﾘ','ﾙ','ﾚ','ﾛ','ﾜ','ﾝ'];

  function rnd(a,b){ return Math.random()*(b-a)+a; }
  function ri(a,b){ return Math.floor(rnd(a,b+1)); }
  function pick(arr){ return arr[ri(0,arr.length-1)]; }

  // ── Color palette ────────────────────────────────────────────
  var CYAN    = [0, 212, 255];
  var GREEN   = [0, 255, 136];
  var ORANGE  = [255, 107, 53];
  var WHITE   = [220, 245, 255];

  function rgba(c, a){ return 'rgba('+c[0]+','+c[1]+','+c[2]+','+a+')'; }

  // ── Layer 1: Matrix Rain ─────────────────────────────────────
  var CS = 17;
  var drops = [];

  function initRain(){
    drops = [];
    var cols = Math.floor(W / CS);
    for(var i = 0; i < cols; i++){
      // randomly assign char type per column
      var type = Math.random();
      var charSet = type < 0.45 ? BINARY :
                    type < 0.75 ? SYMBOLS :
                    type < 0.90 ? HEX : KATAKANA;
      drops.push({
        y:      rnd(-300, -10),
        speed:  rnd(0.12, 0.32),
        len:    ri(5, 22),
        bright: Math.random() < 0.06,
        color:  Math.random() < 0.08 ? GREEN :
                Math.random() < 0.04 ? ORANGE : CYAN,
        charSet: charSet,
        chars:  [], // pre-rendered chars for trail
        glitch: 0,  // glitch timer
      });
    }
  }

  function drawRain(){
    ctx.font = '13px "Share Tech Mono",monospace';
    drops.forEach(function(d, i){
      var x  = i * CS + 2;
      var hy = Math.floor(d.y) * CS;

      // Random glitch: occasionally a column bursts bright then fades
      if(Math.random() < 0.0008) d.glitch = ri(8, 20);
      var isGlitch = d.glitch > 0;
      if(isGlitch) d.glitch--;

      // Head — white hot
      if(hy >= 0 && hy < H){
        ctx.fillStyle = isGlitch
          ? rgba(WHITE, 1)
          : (d.bright ? rgba(WHITE, 0.97) : rgba(WHITE, 0.82));
        ctx.fillText(pick(d.charSet), x, hy);
      }

      // Trail
      for(var t = 1; t < d.len; t++){
        var ty = hy - t * CS;
        if(ty < -CS || ty > H) continue;
        var ratio = 1 - t / d.len;
        var alpha;
        if(isGlitch){
          alpha = ratio * 0.7;
        } else if(d.bright){
          alpha = ratio * 0.50;
        } else {
          alpha = ratio * 0.22;
        }
        ctx.fillStyle = rgba(d.color, alpha);
        ctx.fillText(pick(d.charSet), x, ty);
      }

      d.y += d.speed;
      if(d.y * CS > H + d.len * CS){
        d.y = rnd(-180, -5);
        d.bright = Math.random() < 0.06;
        // occasionally re-pick color
        if(Math.random() < 0.1){
          d.color = Math.random() < 0.6 ? CYAN :
                    Math.random() < 0.5 ? GREEN : ORANGE;
        }
      }
    });
  }

  // ── Layer 2: Hex Grid Pulse ───────────────────────────────────
  var HEX_SIZE = 38;
  var hexCells = [];
  var hexPulseTimer = 0;

  function initHexGrid(){
    hexCells = [];
    var cols = Math.ceil(W / (HEX_SIZE * 1.75)) + 2;
    var rows = Math.ceil(H / (HEX_SIZE * 1.52)) + 2;
    for(var row = 0; row < rows; row++){
      for(var col = 0; col < cols; col++){
        var x = col * HEX_SIZE * 1.74 + (row % 2 === 0 ? 0 : HEX_SIZE * 0.87);
        var y = row * HEX_SIZE * 1.51;
        hexCells.push({
          x: x, y: y,
          alpha: 0,
          pulseAlpha: 0,
          pulsing: false,
          pulseTimer: 0,
        });
      }
    }
  }

  function hexPath(x, y, s){
    ctx.beginPath();
    for(var i = 0; i < 6; i++){
      var angle = Math.PI / 180 * (60 * i - 30);
      var px = x + s * Math.cos(angle);
      var py = y + s * Math.sin(angle);
      if(i === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.closePath();
  }

  function drawHexGrid(){
    hexPulseTimer++;
    // Trigger random pulses
    if(hexPulseTimer % 18 === 0 && hexCells.length > 0){
      var idx = ri(0, hexCells.length - 1);
      hexCells[idx].pulsing = true;
      hexCells[idx].pulseTimer = 0;
      hexCells[idx].pulseAlpha = rnd(0.12, 0.30);
      // Also trigger 2-3 nearby neighbors
      var nCount = ri(1,3);
      for(var n = 0; n < nCount; n++){
        var ni = Math.max(0, Math.min(hexCells.length-1, idx + ri(-4, 4)));
        hexCells[ni].pulsing = true;
        hexCells[ni].pulseTimer = ri(2, 8);
        hexCells[ni].pulseAlpha = rnd(0.06, 0.18);
      }
    }

    hexCells.forEach(function(h){
      if(h.pulsing){
        h.pulseTimer++;
        var progress = h.pulseTimer / 40;
        var a = h.pulseAlpha * (1 - progress);
        if(a > 0.005){
          hexPath(h.x, h.y, HEX_SIZE - 2);
          ctx.strokeStyle = rgba(CYAN, a);
          ctx.lineWidth = 0.7;
          ctx.stroke();
          // Inner fill flash
          if(progress < 0.3){
            hexPath(h.x, h.y, HEX_SIZE - 4);
            ctx.fillStyle = rgba(CYAN, a * 0.15);
            ctx.fill();
          }
        } else {
          h.pulsing = false;
        }
      }
    });
  }

  // ── Layer 3: Data Stream Lines ────────────────────────────────
  var streams = [];

  function initStreams(){
    streams = [];
    var count = Math.floor(W / 280);
    for(var i = 0; i < count; i++){
      streams.push(newStream());
    }
  }

  function newStream(){
    return {
      x:      rnd(0, W),
      y:      rnd(-200, H),
      speed:  rnd(0.4, 1.1),
      width:  rnd(1, 2.5),
      len:    rnd(60, 200),
      alpha:  rnd(0.03, 0.10),
      color:  Math.random() < 0.7 ? CYAN :
              Math.random() < 0.5 ? GREEN : ORANGE,
      angle:  rnd(-0.15, 0.15), // slight diagonal
    };
  }

  function drawStreams(){
    streams.forEach(function(s, i){
      var x2 = s.x + Math.sin(s.angle) * s.len;
      var y2 = s.y - s.len;
      var g = ctx.createLinearGradient(s.x, s.y, x2, y2);
      g.addColorStop(0, rgba(s.color, s.alpha));
      g.addColorStop(0.6, rgba(s.color, s.alpha * 0.5));
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = g;
      ctx.lineWidth = s.width;
      ctx.stroke();

      s.y += s.speed;
      s.x += Math.sin(s.angle) * s.speed * 0.3;
      if(s.y > H + s.len){
        streams[i] = newStream();
        streams[i].y = -s.len;
      }
    });
  }

  // ── Layer 4: Floating Node Network ───────────────────────────
  var nodes = [];

  function initNodes(){
    nodes = [];
    var count = Math.min(18, Math.floor(W * H / 55000));
    for(var i = 0; i < count; i++){
      nodes.push({
        x: rnd(0, W), y: rnd(0, H),
        vx: rnd(-0.09, 0.09), vy: rnd(-0.09, 0.09),
        r: rnd(1.2, 3.2),
        pulse: rnd(0, Math.PI * 2),
        color: Math.random() < 0.7 ? CYAN : GREEN,
      });
    }
  }

  function drawNodes(){
    var LINK_DIST = 200;
    // Draw links
    for(var i = 0; i < nodes.length; i++){
      for(var j = i+1; j < nodes.length; j++){
        var dx = nodes[i].x - nodes[j].x;
        var dy = nodes[i].y - nodes[j].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < LINK_DIST){
          var a = (1 - dist / LINK_DIST) * 0.06;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = rgba(CYAN, a);
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }
    }
    // Draw nodes
    nodes.forEach(function(n){
      n.x += n.vx; n.y += n.vy;
      n.pulse += 0.018;
      if(n.x < 0 || n.x > W) n.vx *= -1;
      if(n.y < 0 || n.y > H) n.vy *= -1;

      var pAlpha = 0.15 + Math.sin(n.pulse) * 0.10;
      // Outer glow ring
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 2.5, 0, Math.PI*2);
      ctx.fillStyle = rgba(n.color, pAlpha * 0.15);
      ctx.fill();
      // Core dot
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = rgba(n.color, pAlpha * 0.6);
      ctx.fill();
    });
  }

  // ── Layer 5: Scan Beams ───────────────────────────────────────
  var beams = [
    { y: 0,   speed:  0.35, alpha: 0.018, width: 120, color: CYAN },
    { y: 400, speed: -0.28, alpha: 0.012, width: 90,  color: GREEN },
  ];

  function drawBeams(){
    beams.forEach(function(b){
      b.y += b.speed;
      if(b.y < -b.width) b.y = H + b.width;
      if(b.y > H + b.width) b.y = -b.width;
      var g = ctx.createLinearGradient(0, b.y - b.width/2, 0, b.y + b.width/2);
      g.addColorStop(0,   'transparent');
      g.addColorStop(0.5, rgba(b.color, b.alpha));
      g.addColorStop(1,   'transparent');
      ctx.fillStyle = g;
      ctx.fillRect(0, b.y - b.width/2, W, b.width);
    });
  }

  // ── Layer 6: Corner decorations ──────────────────────────────
  function drawCorners(){
    var size = 55, thick = 1.5;
    ctx.strokeStyle = rgba(CYAN, 0.12);
    ctx.lineWidth = thick;
    var corners = [
      [0, 0, 1, 1], [W, 0, -1, 1], [0, H, 1, -1], [W, H, -1, -1]
    ];
    corners.forEach(function(c){
      ctx.beginPath();
      ctx.moveTo(c[0] + c[2]*size, c[1]);
      ctx.lineTo(c[0], c[1]);
      ctx.lineTo(c[0], c[1] + c[3]*size);
      ctx.stroke();
    });
  }

  // ── Main loop ─────────────────────────────────────────────────
  var frameCount = 0;
  function draw(){
    frameCount++;

    // Background fade — deeper dark
    ctx.fillStyle = 'rgba(3,6,14,0.14)';
    ctx.fillRect(0, 0, W, H);

    drawBeams();
    drawHexGrid();
    drawStreams();
    drawRain();
    drawNodes();
    drawCorners();

    requestAnimationFrame(draw);
  }

  function init(){
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initRain();
    initHexGrid();
    initStreams();
    initNodes();
  }

  init();
  draw();
  window.addEventListener('resize', init);

})();

// ===== DORK SUB-TAB SWITCHER =====
function switchDorkTab(name, btn) {
  document.querySelectorAll('.dork-tab').forEach(function(t){ t.classList.remove('active'); });
  document.querySelectorAll('.dork-panel-tab').forEach(function(p){ p.classList.remove('active'); });
  btn.classList.add('active');
  var el = document.getElementById('dtab-' + name);
  if (el) el.classList.add('active');
  // Hide single query result and multi results when switching tabs
  document.getElementById('dork-query-result').style.display = 'none';
  if (name !== 'quick') {
    document.getElementById('dork-results').style.display = 'none';
    document.getElementById('dork-actions').style.display = 'none';
  } else {
    document.getElementById('dork-results').style.display = 'block';
  }
  if (name === 'templates') initDorkTemplates();
}

// ===== BUILD SINGLE QUERY (for basic/profile/files/security) =====
function showSingleDork(query) {
  if (!query || query.trim() === '') { showError('dork-results','Fill in at least one field in the Dork Builder before generating.'); return; }
  document.getElementById('dork-single-output').textContent = query;
  document.getElementById('dork-query-result').style.display = 'block';
}
function copySingleDork() {
  var q = document.getElementById('dork-single-output').textContent;
  navigator.clipboard.writeText(q).then(function(){ showToast('Query copied to clipboard','success'); });
}
function searchGoogleDork() {
  var q = document.getElementById('dork-single-output').textContent;
  if (q) window.open('https://www.google.com/search?q=' + encodeURIComponent(q), '_blank');
}
function searchBingDork() {
  var q = document.getElementById('dork-single-output').textContent;
  if (q) window.open('https://www.bing.com/search?q=' + encodeURIComponent(q), '_blank');
}

// ===== BASIC DORK BUILDER =====
function buildBasicDork() {
  var parts = [];
  var term = document.getElementById('b-term').value.trim();
  var site = document.getElementById('b-site').value.trim();
  var inurl = document.getElementById('b-inurl').value.trim();
  var intitle = document.getElementById('b-intitle').value.trim();
  var intext = document.getElementById('b-intext').value.trim();
  var filetype = document.getElementById('b-filetype').value;
  if (term) parts.push(term);
  if (site) parts.push('site:' + site);
  if (inurl) parts.push('inurl:' + inurl);
  if (intitle) parts.push('intitle:"' + intitle + '"');
  if (intext) parts.push('intext:"' + intext + '"');
  if (filetype) parts.push('filetype:' + filetype);
  showSingleDork(parts.join(' '));
}
function clearBasicDork() {
  ['b-term','b-site','b-inurl','b-intitle','b-intext'].forEach(function(id){ document.getElementById(id).value=''; });
  document.getElementById('b-filetype').selectedIndex = 0;
  document.getElementById('dork-query-result').style.display = 'none';
}

// ===== PROFILE DORK BUILDER =====
function buildProfileDork() {
  var parts = [];
  var name = document.getElementById('p-name').value.trim();
  var username = document.getElementById('p-username').value.trim();
  var email = document.getElementById('p-email').value.trim();
  var phone = document.getElementById('p-phone').value.trim();
  var location = document.getElementById('p-location').value.trim();
  var company = document.getElementById('p-company').value.trim();
  if (name) parts.push('"' + name + '"');
  if (username) parts.push('"' + username + '"');
  if (email) parts.push('"' + email + '"');
  if (phone) parts.push('"' + phone + '"');
  if (location) parts.push('"' + location + '"');
  if (company) parts.push('"' + company + '"');
  var platforms = [];
  if (document.getElementById('pp-linkedin').checked) platforms.push('linkedin.com');
  if (document.getElementById('pp-twitter').checked) platforms.push('twitter.com');
  if (document.getElementById('pp-facebook').checked) platforms.push('facebook.com');
  if (document.getElementById('pp-instagram').checked) platforms.push('instagram.com');
  if (document.getElementById('pp-github').checked) platforms.push('github.com');
  if (document.getElementById('pp-reddit').checked) platforms.push('reddit.com');
  if (platforms.length > 0) parts.push('(' + platforms.map(function(p){ return 'site:' + p; }).join(' | ') + ')');
  showSingleDork(parts.join(' '));
}
function clearProfileDork() {
  ['p-name','p-username','p-email','p-phone','p-location','p-company'].forEach(function(id){ document.getElementById(id).value=''; });
  ['pp-linkedin','pp-twitter','pp-facebook','pp-instagram','pp-github','pp-reddit'].forEach(function(id){ document.getElementById(id).checked=false; });
  document.getElementById('dork-query-result').style.display = 'none';
}

// ===== FILE DORK BUILDER =====
function buildFileDork() {
  var parts = [];
  var domain = document.getElementById('f-domain').value.trim();
  var keywords = document.getElementById('f-keywords').value.trim();
  var content = document.getElementById('f-content').value.trim();
  var doctypes = Array.from(document.getElementById('f-doctype').selectedOptions).map(function(o){ return o.value; });
  if (domain) parts.push('site:' + domain);
  if (doctypes.length > 0) {
    var types = doctypes.flatMap(function(t){ return t.split('|'); });
    parts.push(types.length === 1 ? 'filetype:' + types[0] : '(' + types.map(function(t){ return 'filetype:' + t; }).join(' | ') + ')');
  }
  if (keywords) {
    var kws = keywords.split(',').map(function(k){ return k.trim(); });
    parts.push(kws.length === 1 ? 'inurl:"' + kws[0] + '"' : '(' + kws.map(function(k){ return 'inurl:"' + k + '"'; }).join(' | ') + ')');
  }
  if (content) parts.push('intext:"' + content + '"');
  showSingleDork(parts.join(' '));
}
function clearFileDork() {
  ['f-domain','f-keywords','f-content'].forEach(function(id){ document.getElementById(id).value=''; });
  var sel = document.getElementById('f-doctype');
  Array.from(sel.options).forEach(function(o){ o.selected=false; });
  document.getElementById('dork-query-result').style.display = 'none';
}

// ===== SECURITY DORK BUILDER =====
function buildSecurityDork() {
  var parts = [];
  var domain = document.getElementById('s-domain').value.trim();
  var cat = document.getElementById('s-category').value;
  if (domain) parts.push('site:' + domain);
  var catDorks = {
    'admin': 'inurl:admin | inurl:administrator | inurl:cpanel',
    'login': 'inurl:login | inurl:signin | inurl:auth',
    'config': 'ext:xml | ext:conf | ext:config | ext:cnf | ext:ini',
    'backup': 'ext:bak | ext:backup | ext:old | ext:save',
    'logs': 'ext:log | ext:txt intext:error',
    'database': 'ext:sql | ext:db | ext:dbf | ext:mdb',
    'directory': 'intitle:"index of" | intitle:"directory listing"',
    'errors': 'intext:"sql syntax near" | intext:"syntax error" | intext:"mysql_fetch"'
  };
  if (cat && catDorks[cat]) parts.push('(' + catDorks[cat] + ')');
  var infoTypes = [];
  if (document.getElementById('si-pass').checked) infoTypes.push('password');
  if (document.getElementById('si-api').checked) infoTypes.push('api_key');
  if (document.getElementById('si-token').checked) infoTypes.push('token');
  if (document.getElementById('si-creds').checked) infoTypes.push('credentials');
  if (document.getElementById('si-secret').checked) infoTypes.push('secret');
  if (infoTypes.length > 0) parts.push('(' + infoTypes.map(function(t){ return 'intext:"' + t + '"'; }).join(' | ') + ')');
  showSingleDork(parts.join(' '));
}
function clearSecurityDork() {
  document.getElementById('s-domain').value = '';
  document.getElementById('s-category').selectedIndex = 0;
  ['si-pass','si-api','si-token','si-creds','si-secret'].forEach(function(id){ document.getElementById(id).checked=false; });
  document.getElementById('dork-query-result').style.display = 'none';
}

// ===== TEMPLATES INIT =====
var DORK_TEMPLATES = [
  { title:'Email Search', desc:'Find emails on a domain', query:'site:example.com intext:"@example.com"', icon:'📧' },
  { title:'LinkedIn Profiles', desc:'Search LinkedIn for people', query:'site:linkedin.com "Name" "Company"', icon:'💼' },
  { title:'GitHub Repos', desc:'Find GitHub profiles/repos', query:'site:github.com "username"', icon:'🐙' },
  { title:'Admin Panels', desc:'Locate admin login pages', query:'site:target.com inurl:admin | inurl:login', icon:'🔑' },
  { title:'Backup Files', desc:'Find backup/archive files', query:'site:target.com ext:bak | ext:backup | ext:old', icon:'📦' },
  { title:'Config Files', desc:'Locate config files', query:'site:target.com ext:xml | ext:conf | ext:config', icon:'⚙️' },
  { title:'Directory Listing', desc:'Open directory listings', query:'intitle:"index of" site:target.com', icon:'📂' },
  { title:'SQL Files', desc:'Database dump files', query:'site:target.com ext:sql intext:database', icon:'🗄️' },
  { title:'Log Files', desc:'Server log files', query:'site:target.com ext:log | ext:txt intext:error', icon:'📜' },
  { title:'Sensitive Docs', desc:'Confidential PDFs and docs', query:'site:target.com (ext:pdf | ext:doc) intext:confidential', icon:'🔒' },
  { title:'Exposed Passwords', desc:'Files containing passwords', query:'site:target.com intext:password | pwd filetype:txt', icon:'🚨' },
  { title:'API Keys Exposed', desc:'Leaked API keys in repos', query:'site:github.com "api_key" OR "api_secret" "target.com"', icon:'🔓' }
];
function initDorkTemplates() {
  var grid = document.getElementById('dork-templates-grid');
  if (!grid || grid.children.length > 0) return;
  DORK_TEMPLATES.forEach(function(t) {
    var card = document.createElement('div');
    card.style.cssText = 'background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:14px 16px;transition:all 0.2s;';

    var header = document.createElement('div');
    header.style.cssText = 'display:flex;align-items:center;gap:8px;margin-bottom:8px;';
    header.innerHTML = '<span style="font-size:18px;">' + t.icon + '</span><div style="font-family:Share Tech Mono,monospace;font-size:14px;font-weight:700;color:var(--accent);">' + t.title + '</div>';

    var desc = document.createElement('div');
    desc.style.cssText = 'font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text2);margin-bottom:10px;';
    desc.textContent = t.desc;

    var queryBox = document.createElement('div');
    queryBox.style.cssText = 'background:#020508;border:1px solid rgba(0,212,255,0.15);border-radius:4px;padding:8px 10px;font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text);word-break:break-all;margin-bottom:10px;';
    queryBox.textContent = t.query;

    var useBtn = document.createElement('button');
    useBtn.className = 'btn btn-green';
    useBtn.style.cssText = 'padding:6px 12px;font-size:12px;';
    useBtn.textContent = 'USE';
    useBtn.addEventListener('click', (function(q){ return function(){ showSingleDork(q); }; })(t.query));

    var googleLink = document.createElement('a');
    googleLink.href = 'https://www.google.com/search?q=' + encodeURIComponent(t.query);
    googleLink.target = '_blank';
    googleLink.className = 'btn';
    googleLink.style.cssText = 'padding:6px 12px;font-size:12px;text-decoration:none;';
    googleLink.textContent = 'GOOGLE';

    var btnRow = document.createElement('div');
    btnRow.style.cssText = 'display:flex;gap:6px;';
    btnRow.appendChild(useBtn);
    btnRow.appendChild(googleLink);

    card.appendChild(header);
    card.appendChild(desc);
    card.appendChild(queryBox);
    card.appendChild(btnRow);

    card.addEventListener('mouseenter', function(){ this.style.borderColor='rgba(0,212,255,0.35)'; this.style.background='rgba(0,212,255,0.04)'; });
    card.addEventListener('mouseleave', function(){ this.style.borderColor='var(--border)'; this.style.background='var(--bg2)'; });
    grid.appendChild(card);
  });
}


// ===== SESSION PERSISTENCE =====
(function(){
  var token = localStorage.getItem('pe_token');
  var overlay = document.getElementById('login-overlay');

  if(localStorage.getItem('pe_logged_in')==='1' && token){
    // Token exists — verify with backend silently
    fetch(API_URL+'/auth/verify', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ token: token })
    }).then(function(r){ return r.json(); }).then(function(data){
      if(data.success){
        // Valid — skip boot on refresh, go straight to dashboard
        if(overlay) overlay.classList.remove('show');
        var uname = localStorage.getItem('pe_username') || 'OPERATOR';
        var opEl = document.getElementById('header-operator');
        if(opEl) opEl.textContent = uname.toUpperCase();
        startSessionTimer();
        renderDashboard();
      } else {
        localStorage.removeItem('pe_logged_in');
        localStorage.removeItem('pe_token');
        localStorage.removeItem('pe_username');
        if(overlay) overlay.classList.add('show');
      }
    }).catch(function(){
      // Server down — trust localStorage, skip boot
      if(overlay) overlay.classList.remove('show');
      var uname = localStorage.getItem('pe_username') || 'OPERATOR';
      var opEl = document.getElementById('header-operator');
      if(opEl) opEl.textContent = uname.toUpperCase();
      startSessionTimer();
      renderDashboard();
    });
  } else {
    // Not logged in — show login screen
    if(overlay) overlay.classList.add('show');
  }
})();

// ===== OSINT DIRECTORY =====
var osintTools = [
  // General Search
  {name:'Google',cat:'General Search',desc:'Most popular search engine.',url:'https://www.google.com'},
  {name:'Bing',cat:'General Search',desc:"Microsoft's search engine.",url:'https://www.bing.com'},
  {name:'DuckDuckGo',cat:'General Search',desc:'Privacy-focused search engine.',url:'https://duckduckgo.com'},
  {name:'Yandex',cat:'General Search',desc:'Russian search engine, great for image reverse search.',url:'https://yandex.com'},
  {name:'Baidu',cat:'General Search',desc:'Chinese search engine.',url:'https://www.baidu.com'},
  {name:'Brave Search',cat:'General Search',desc:'Private, independent search engine.',url:'https://search.brave.com'},
  {name:'Perplexity',cat:'General Search',desc:'AI-powered search engine with source citations.',url:'https://www.perplexity.ai'},
  {name:'Wolfram Alpha',cat:'General Search',desc:'Computational knowledge engine.',url:'https://www.wolframalpha.com'},
  {name:'Startpage',cat:'General Search',desc:'Google results with privacy protection.',url:'https://www.startpage.com'},
  {name:'Mojeek',cat:'General Search',desc:'Independent search engine that does not track you.',url:'https://www.mojeek.com'},

  // Email Search
  {name:'Hunter.io',cat:'Email Search',desc:'Find email addresses associated with a domain.',url:'https://hunter.io'},
  {name:'HaveIBeenPwned',cat:'Email Search',desc:'Check if your email was in a data breach.',url:'https://haveibeenpwned.com'},
  {name:'Epieos',cat:'Email Search',desc:'OSINT tool to find info from email address.',url:'https://epieos.com'},
  {name:'Holehe',cat:'Email Search',desc:'Check if email is used on 120+ websites.',url:'https://github.com/megadose/holehe'},
  {name:'Email Header Analyzer',cat:'Email Search',desc:'Analyze email headers for origin tracing.',url:'https://mxtoolbox.com/EmailHeaders.aspx'},
  {name:'Mailcat',cat:'Email Search',desc:'Find email addresses from username.',url:'https://github.com/sharsil/mailcat'},
  {name:'Snov.io',cat:'Email Search',desc:'Email finder and verifier tool.',url:'https://snov.io'},
  {name:'Phonebook.cz',cat:'Email Search',desc:'Search for email addresses and domains.',url:'https://phonebook.cz'},
  {name:'Skymem',cat:'Email Search',desc:'Lookup email addresses on the web.',url:'https://www.skymem.info'},

  // Username Search
  {name:'Sherlock',cat:'Username Search',desc:'Hunt down social media accounts by username.',url:'https://github.com/sherlock-project/sherlock'},
  {name:'WhatsMyName',cat:'Username Search',desc:'Username search across many websites.',url:'https://whatsmyname.app'},
  {name:'Namechk',cat:'Username Search',desc:'Check username availability across platforms.',url:'https://namechk.com'},
  {name:'UserSearch.org',cat:'Username Search',desc:'Search for username across social networks.',url:'https://usersearch.org'},
  {name:'Maigret',cat:'Username Search',desc:'Collect dossier on a person by username.',url:'https://github.com/soxoj/maigret'},
  {name:'Socialscan',cat:'Username Search',desc:'Check email/username availability accurately.',url:'https://github.com/iojw/socialscan'},
  {name:'Knowem',cat:'Username Search',desc:'Check username on 500+ social networks.',url:'https://knowem.com'},

  // IP & Domain
  {name:'Shodan',cat:'IP & Domain',desc:'Search engine for Internet-connected devices.',url:'https://www.shodan.io'},
  {name:'Censys',cat:'IP & Domain',desc:'Search engine for internet-wide scan data.',url:'https://censys.io'},
  {name:'IPinfo',cat:'IP & Domain',desc:'IP address lookup and geolocation.',url:'https://ipinfo.io'},
  {name:'VirusTotal',cat:'IP & Domain',desc:'Analyze suspicious files, domains, IPs and URLs.',url:'https://www.virustotal.com'},
  {name:'AbuseIPDB',cat:'IP & Domain',desc:'Check if an IP has been reported for abuse.',url:'https://www.abuseipdb.com'},
  {name:'BGP.he.net',cat:'IP & Domain',desc:'BGP looking glass, DNS and network tools.',url:'https://bgp.he.net'},
  {name:'DNSDumpster',cat:'IP & Domain',desc:'Free domain research and DNS reconnaissance.',url:'https://dnsdumpster.com'},
  {name:'SecurityTrails',cat:'IP & Domain',desc:'Domain, IP, and DNS information.',url:'https://securitytrails.com'},
  {name:'Spyse',cat:'IP & Domain',desc:'Cybersecurity search engine for internet assets.',url:'https://spyse.com'},
  {name:'ViewDNS',cat:'IP & Domain',desc:'Multiple DNS and domain lookup tools.',url:'https://viewdns.info'},
  {name:'Robtex',cat:'IP & Domain',desc:'Comprehensive DNS/IP research tool.',url:'https://www.robtex.com'},
  {name:'MXToolbox',cat:'IP & Domain',desc:'Email, DNS, network and blacklist tools.',url:'https://mxtoolbox.com'},

  // WHOIS & Domain
  {name:'WHOIS Lookup (ICANN)',cat:'WHOIS & Domain',desc:'Official WHOIS database search.',url:'https://lookup.icann.org'},
  {name:'DomainTools',cat:'WHOIS & Domain',desc:'WHOIS history and domain research.',url:'https://www.domaintools.com'},
  {name:'Whoxy',cat:'WHOIS & Domain',desc:'WHOIS history API and search.',url:'https://www.whoxy.com'},
  {name:'DomainBigData',cat:'WHOIS & Domain',desc:'WHOIS and reverse WHOIS lookup.',url:'https://domainbigdata.com'},
  {name:'ViewDNS WHOIS',cat:'WHOIS & Domain',desc:'WHOIS lookup with history.',url:'https://viewdns.info/whois'},

  // Social Media
  {name:'Social Searcher',cat:'Social Media',desc:'Free social media search engine.',url:'https://www.social-searcher.com'},
  {name:'Mention',cat:'Social Media',desc:'Track mentions across social media.',url:'https://mention.com'},
  {name:'Pipl',cat:'Social Media',desc:'People search and identity resolution.',url:'https://pipl.com'},
  {name:'Tweetdeck',cat:'Social Media',desc:'Advanced Twitter/X monitoring dashboard.',url:'https://tweetdeck.twitter.com'},
  {name:'Twint',cat:'Social Media',desc:'Twitter scraping tool without API.',url:'https://github.com/twintproject/twint'},
  {name:'IntelX Twitter',cat:'Social Media',desc:'Search Twitter with advanced queries.',url:'https://intelx.io/tools?tab=twitter'},
  {name:'Facebook Search',cat:'Social Media',desc:'Search Facebook profiles and posts.',url:'https://www.facebook.com/search'},
  {name:'LinkedIn Search',cat:'Social Media',desc:'Search professionals and companies.',url:'https://www.linkedin.com/search'},
  {name:'Instagram OSINT',cat:'Social Media',desc:'Osintgram — Instagram OSINT tool.',url:'https://github.com/Datalux/Osintgram'},

  // Dark Web
  {name:'Ahmia',cat:'Dark Web',desc:'Search engine for Tor hidden services.',url:'https://ahmia.fi'},
  {name:'OnionSearch',cat:'Dark Web',desc:'Scrape URLs from .onion search engines.',url:'https://github.com/megadose/OnionSearch'},
  {name:'DarkSearch',cat:'Dark Web',desc:'Dark web search engine.',url:'https://darksearch.io'},
  {name:'Torch',cat:'Dark Web',desc:'Oldest Tor search engine.',url:'http://xmh57jrknzkhv6y3ls3ubitzfqnkrwxhopf5aygthi7d6rplyvk3noyd.onion'},
  {name:'Intelligence X',cat:'Dark Web',desc:'Search across dark web, leaks and public data.',url:'https://intelx.io'},

  // Data Breach
  {name:'HaveIBeenPwned',cat:'Data Breach',desc:'Check email in 500+ breach databases.',url:'https://haveibeenpwned.com'},
  {name:'DeHashed',cat:'Data Breach',desc:'Search breach databases by various fields.',url:'https://dehashed.com'},
  {name:'BreachDirectory',cat:'Data Breach',desc:'Search through data breaches.',url:'https://breachdirectory.org'},
  {name:'LeakCheck',cat:'Data Breach',desc:'Data breach search engine.',url:'https://leakcheck.io'},
  {name:'Snusbase',cat:'Data Breach',desc:'Search database of leaked credentials.',url:'https://snusbase.com'},
  {name:'WeleakInfo',cat:'Data Breach',desc:'Data breach lookup service.',url:'https://weleakinfo.to'},

  // Google Dorking
  {name:'Google Hacking DB',cat:'Google Dorking',desc:'Exploit-DB Google hacking database.',url:'https://www.exploit-db.com/google-hacking-database'},
  {name:'DorkSearch',cat:'Google Dorking',desc:'Google dorking made easy with pre-built queries.',url:'https://dorksearch.com'},
  {name:'DorkGPT',cat:'Google Dorking',desc:'Generate Google dorks with AI.',url:'https://www.dorkgpt.com'},
  {name:'GoogD0rker',cat:'Google Dorking',desc:'Google dorking scripts for bug bounty.',url:'https://github.com/ZephrFish/GoogD0rker'},
  {name:'Pentest-Tools Dorks',cat:'Google Dorking',desc:'Online Google dork scanner.',url:'https://pentest-tools.com/information-gathering/google-hacking'},

  // Geolocation
  {name:'Google Maps',cat:'Geolocation',desc:'Satellite imagery and street view.',url:'https://maps.google.com'},
  {name:'Bing Maps',cat:'Geolocation',desc:'Alternative satellite imagery.',url:'https://www.bing.com/maps'},
  {name:'Yandex Maps',cat:'Geolocation',desc:'Detailed maps especially for Russia/CIS.',url:'https://maps.yandex.com'},
  {name:'OpenStreetMap',cat:'Geolocation',desc:'Free collaborative world map.',url:'https://www.openstreetmap.org'},
  {name:'SunCalc',cat:'Geolocation',desc:'Calculate sun position from photos.',url:'https://www.suncalc.org'},
  {name:'GeoHack',cat:'Geolocation',desc:'Geolocation tool for coordinates research.',url:'https://geohack.toolforge.org'},
  {name:'what3words',cat:'Geolocation',desc:'Precise location with 3-word addresses.',url:'https://what3words.com'},
  {name:'Wigle',cat:'Geolocation',desc:'Wireless network mapping and geolocation.',url:'https://wigle.net'},

  // Image & Video
  {name:'Google Reverse Image',cat:'Image & Video',desc:'Reverse image search by Google.',url:'https://images.google.com'},
  {name:'TinEye',cat:'Image & Video',desc:'Reverse image search engine.',url:'https://tineye.com'},
  {name:'Yandex Image Search',cat:'Image & Video',desc:'Best for face reverse image search.',url:'https://yandex.com/images'},
  {name:'PimEyes',cat:'Image & Video',desc:'Face search engine and recognition.',url:'https://pimeyes.com'},
  {name:'InVID/WeVerify',cat:'Image & Video',desc:'Video/image verification and analysis.',url:'https://weverify.eu/tools'},
  {name:'Exif.tools',cat:'Image & Video',desc:'Online EXIF data viewer for images.',url:'https://exif.tools'},
  {name:'Jeffrey\'s Exif Viewer',cat:'Image & Video',desc:'Detailed EXIF metadata viewer.',url:'https://exifdata.com'},
  {name:'FotoForensics',cat:'Image & Video',desc:'Forensic analysis of photos.',url:'https://fotoforensics.com'},

  // People Search
  {name:'Pipl',cat:'People Search',desc:'Deep people search engine.',url:'https://pipl.com'},
  {name:'Spokeo',cat:'People Search',desc:'People search and background check.',url:'https://www.spokeo.com'},
  {name:'BeenVerified',cat:'People Search',desc:'Background check and people search.',url:'https://www.beenverified.com'},
  {name:'Intelius',cat:'People Search',desc:'People search and background reports.',url:'https://www.intelius.com'},
  {name:'TruthFinder',cat:'People Search',desc:'Background check service.',url:'https://www.truthfinder.com'},
  {name:'FastPeopleSearch',cat:'People Search',desc:'Free people search tool.',url:'https://www.fastpeoplesearch.com'},
  {name:'411.com',cat:'People Search',desc:'People search and reverse phone lookup.',url:'https://www.411.com'},
  {name:'Whitepages',cat:'People Search',desc:'People, phone and address search.',url:'https://www.whitepages.com'},

  // Phone Number
  {name:'Truecaller',cat:'Phone Number',desc:'Identify unknown callers.',url:'https://www.truecaller.com'},
  {name:'NumLookup',cat:'Phone Number',desc:'Reverse phone number lookup.',url:'https://www.numlookup.com'},
  {name:'PhoneInfoga',cat:'Phone Number',desc:'Advanced phone number OSINT tool.',url:'https://github.com/sundowndev/phoneinfoga'},
  {name:'CallerID Test',cat:'Phone Number',desc:'Reverse phone lookup and caller ID.',url:'https://www.calleridtest.com'},
  {name:'Sync.me',cat:'Phone Number',desc:'Reverse phone lookup service.',url:'https://sync.me'},
  {name:'National Cellular Directory',cat:'Phone Number',desc:'Reverse phone and cell lookup.',url:'https://www.nationalcellulardirectory.com'},

  // Network & Security
  {name:'Nmap Online',cat:'Network & Security',desc:'Online port scanner.',url:'https://nmap.online'},
  {name:'SSL Labs',cat:'Network & Security',desc:'SSL/TLS configuration tester.',url:'https://www.ssllabs.com/ssltest'},
  {name:'Wireshark',cat:'Network & Security',desc:'Network protocol analyzer.',url:'https://www.wireshark.org'},
  {name:'Traceroute Online',cat:'Network & Security',desc:'Online network traceroute tool.',url:'https://traceroute-online.com'},
  {name:'PortScan.co',cat:'Network & Security',desc:'Free online port scanner.',url:'https://www.portscan.co'},
  {name:'Netcraft',cat:'Network & Security',desc:'Internet security and anti-phishing service.',url:'https://www.netcraft.com'},
  {name:'Urlscan.io',cat:'Network & Security',desc:'Scan and analyze websites.',url:'https://urlscan.io'},

  // Threat Intelligence
  {name:'Shodan',cat:'Threat Intelligence',desc:'Search engine for internet-connected devices.',url:'https://www.shodan.io'},
  {name:'AlienVault OTX',cat:'Threat Intelligence',desc:'Open threat intelligence community.',url:'https://otx.alienvault.com'},
  {name:'ThreatCrowd',cat:'Threat Intelligence',desc:'Search engine for threat intelligence.',url:'https://www.threatcrowd.org'},
  {name:'IBM X-Force',cat:'Threat Intelligence',desc:'Threat intelligence sharing platform.',url:'https://exchange.xforce.ibmcloud.com'},
  {name:'MalwareBazaar',cat:'Threat Intelligence',desc:'Share and download malware samples.',url:'https://bazaar.abuse.ch'},
  {name:'URLhaus',cat:'Threat Intelligence',desc:'Malware URL sharing database.',url:'https://urlhaus.abuse.ch'},
  {name:'ThreatFox',cat:'Threat Intelligence',desc:'IOC sharing platform by abuse.ch.',url:'https://threatfox.abuse.ch'},
  {name:'GreyNoise',cat:'Threat Intelligence',desc:'Understand internet background noise.',url:'https://www.greynoise.io'},

  // Document & File Search
  {name:'FOCA',cat:'Document Search',desc:'Metadata extraction from documents.',url:'https://github.com/ElevenPaths/FOCA'},
  {name:'Metagoofil',cat:'Document Search',desc:'Extract metadata from public documents.',url:'https://github.com/opsdisk/metagoofil'},
  {name:'DocScraper',cat:'Document Search',desc:'Search for documents on the web.',url:'https://www.docscraper.com'},
  {name:'Scribd',cat:'Document Search',desc:'Digital library for documents.',url:'https://www.scribd.com'},
  {name:'SlideShare',cat:'Document Search',desc:'Professional content sharing platform.',url:'https://www.slideshare.net'},
  {name:'PACER',cat:'Document Search',desc:'US federal court records.',url:'https://pacer.uscourts.gov'},

  // Web Archive
  {name:'Wayback Machine',cat:'Web Archive',desc:'Browse archived versions of websites.',url:'https://web.archive.org'},
  {name:'CachedView',cat:'Web Archive',desc:'Google cache and web archive viewer.',url:'https://cachedview.nl'},
  {name:'Archive.today',cat:'Web Archive',desc:'Save and retrieve web page snapshots.',url:'https://archive.ph'},
  {name:'TimeTravel',cat:'Web Archive',desc:'Search across multiple web archives.',url:'http://timetravel.mementoweb.org'},
  {name:'Oldweb.today',cat:'Web Archive',desc:'Browse old web with vintage browsers.',url:'https://oldweb.today'},

  // Code Search
  {name:'GitHub',cat:'Code Search',desc:'Search public code repositories.',url:'https://github.com/search'},
  {name:'GitLab',cat:'Code Search',desc:'Search across GitLab repositories.',url:'https://gitlab.com/search'},
  {name:'Grep.app',cat:'Code Search',desc:'Search across GitHub with regex.',url:'https://grep.app'},
  {name:'PublicWWW',cat:'Code Search',desc:'Source code search engine.',url:'https://publicwww.com'},
  {name:'SearchCode',cat:'Code Search',desc:'Search code across 10+ sources.',url:'https://searchcode.com'},
  {name:'NerdyData',cat:'Code Search',desc:'Search across website source code.',url:'https://www.nerdydata.com'},

  // Company Research
  {name:'OpenCorporates',cat:'Company Research',desc:'Database of companies worldwide.',url:'https://opencorporates.com'},
  {name:'Crunchbase',cat:'Company Research',desc:'Company and startup information.',url:'https://www.crunchbase.com'},
  {name:'SEC EDGAR',cat:'Company Research',desc:'US public company filings.',url:'https://www.sec.gov/edgar'},
  {name:'Companies House',cat:'Company Research',desc:'UK company information.',url:'https://www.companieshouse.gov.uk'},
  {name:'LinkedIn',cat:'Company Research',desc:'Professional network and company profiles.',url:'https://www.linkedin.com'},
  {name:'Bloomberg',cat:'Company Research',desc:'Financial and company information.',url:'https://www.bloomberg.com'},

  // Cryptocurrency
  {name:'Blockchain Explorer',cat:'Cryptocurrency',desc:'Bitcoin blockchain explorer.',url:'https://www.blockchain.com/explorer'},
  {name:'Etherscan',cat:'Cryptocurrency',desc:'Ethereum blockchain explorer.',url:'https://etherscan.io'},
  {name:'Chainalysis',cat:'Cryptocurrency',desc:'Crypto transaction tracking.',url:'https://www.chainalysis.com'},
  {name:'Crystal Blockchain',cat:'Cryptocurrency',desc:'Blockchain analytics platform.',url:'https://crystalblockchain.com'},
  {name:'WalletExplorer',cat:'Cryptocurrency',desc:'Bitcoin wallet clustering tool.',url:'https://www.walletexplorer.com'},

  // OSINT Frameworks
  {name:'OSINT Framework',cat:'OSINT Framework',desc:'Web-based OSINT tool framework.',url:'https://osintframework.com'},
  {name:'Maltego',cat:'OSINT Framework',desc:'Graph-based link analysis for intelligence.',url:'https://www.maltego.com'},
  {name:'SpiderFoot',cat:'OSINT Framework',desc:'OSINT automation platform with 200+ modules.',url:'https://www.spiderfoot.net'},
  {name:'Recon-ng',cat:'OSINT Framework',desc:'Web reconnaissance framework in Python.',url:'https://github.com/lanmaster53/recon-ng'},
  {name:'theHarvester',cat:'OSINT Framework',desc:'Gather emails, subdomains from public sources.',url:'https://github.com/laramies/theHarvester'},
  {name:'Datasploit',cat:'OSINT Framework',desc:'OSINT on usernames, emails and domains.',url:'https://github.com/DataSploit/datasploit'},
  {name:'IntelTechniques',cat:'OSINT Framework',desc:'Tools by Michael Bazzell for investigators.',url:'https://inteltechniques.com/tools'},
  {name:'Bellingcat Toolkit',cat:'OSINT Framework',desc:'Tools used by Bellingcat investigators.',url:'https://www.bellingcat.com/category/resources/how-tos'},
];

var dirFiltered = osintTools.slice();
var dirCurrentPage = 1;
var dirPerPage = 24;

function initDirectory(){
  // Populate categories
  var cats = [...new Set(osintTools.map(function(t){return t.cat;}))].sort();
  var sel = document.getElementById('dir-category');
  if(!sel) return;
  cats.forEach(function(c){
    var o = document.createElement('option');
    o.value = c; o.textContent = c;
    sel.appendChild(o);
  });
  filterDirectory();
}

function filterDirectory(){
  var q = (document.getElementById('dir-search').value||'').toLowerCase();
  var cat = document.getElementById('dir-category').value;
  dirFiltered = osintTools.filter(function(t){
    var matchQ = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q) || t.cat.toLowerCase().includes(q);
    var matchC = !cat || t.cat === cat;
    return matchQ && matchC;
  }).sort(function(a,b){ return a.name.localeCompare(b.name); });
  dirCurrentPage = 1;
  renderDirectory();
}

function dirPage(dir){
  var totalPages = Math.ceil(dirFiltered.length / dirPerPage);
  dirCurrentPage = Math.max(1, Math.min(totalPages, dirCurrentPage + dir));
  renderDirectory();
}

function renderDirectory(){
  var grid = document.getElementById('dir-grid');
  var countEl = document.getElementById('dir-count');
  var pageInfo = document.getElementById('dir-page-info');
  var pageInfoBot = document.getElementById('dir-page-info-bot');
  if(!grid) return;

  var totalPages = Math.max(1, Math.ceil(dirFiltered.length / dirPerPage));
  var start = (dirCurrentPage - 1) * dirPerPage;
  var page = dirFiltered.slice(start, start + dirPerPage);

  countEl.textContent = dirFiltered.length + ' / ' + osintTools.length + ' tools';
  if(pageInfo) pageInfo.textContent = 'Page ' + dirCurrentPage + ' / ' + totalPages;
  if(pageInfoBot) pageInfoBot.textContent = 'Page ' + dirCurrentPage + ' / ' + totalPages;

  grid.innerHTML = '';
  if(page.length === 0){
    grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;font-family:Share Tech Mono,monospace;font-size:14px;color:var(--text2);">No tools found</div>';
    return;
  }

  page.forEach(function(tool){
    var card = document.createElement('div');
    card.style.cssText = 'background:rgba(0,212,255,0.03);border:1px solid rgba(0,212,255,0.12);border-radius:8px;padding:14px 16px;display:flex;flex-direction:column;gap:6px;transition:all 0.2s;cursor:pointer;';
    card.onmouseenter = function(){ this.style.borderColor='rgba(0,212,255,0.4)'; this.style.background='rgba(0,212,255,0.07)'; };
    card.onmouseleave = function(){ this.style.borderColor='rgba(0,212,255,0.12)'; this.style.background='rgba(0,212,255,0.03)'; };
    card.onclick = function(){ window.open(tool.url,'_blank'); };
    card.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">'
      + '<div style="font-family:Orbitron,monospace;font-size:13px;font-weight:700;color:var(--accent);">'+tool.name+'</div>'
      + '<span style="font-size:10px;padding:2px 7px;border:1px solid rgba(0,212,255,0.2);border-radius:3px;color:var(--text2);font-family:Share Tech Mono,monospace;white-space:nowrap;flex-shrink:0;">'+tool.cat+'</span>'
      + '</div>'
      + '<div style="font-family:Share Tech Mono,monospace;font-size:12px;color:var(--text2);line-height:1.5;">'+tool.desc+'</div>'
      + '<div style="font-family:Share Tech Mono,monospace;font-size:11px;color:rgba(0,212,255,0.4);margin-top:2px;">'+tool.url.replace('https://','').replace('http://','').split('/')[0]+'</div>';
    grid.appendChild(card);
  });

  // Scroll to top of panel
  var panel = document.getElementById('panel-directory');
  if(panel) panel.scrollTop = 0;
}

// Init when panel is opened - directory init on tab switch
document.addEventListener('click', function(e){
  var btn = e.target.closest('[data-panel="directory"]');
  if(btn) setTimeout(initDirectory, 50);
});

// ===== GLITCH ENGINE =====
(function(){
  var overlay = null;
  var glitchTexts = [];
  var glitchActive = false;

  function init(){
    overlay = document.getElementById('glitch-overlay');
    collectGlitchTargets();
    scheduleNextGlitch();
  }

  function collectGlitchTargets(){
    glitchTexts = Array.from(document.querySelectorAll('.glitch-text'));
  }

  function triggerGlitch(){
    if(glitchActive) return;
    glitchActive = true;

    // 1. RGB split overlay
    if(overlay){
      overlay.classList.add('active');
      setTimeout(function(){ overlay.classList.remove('active'); }, 150);
    }

    // 2. Random glitch-text elements
    var targets = glitchTexts.filter(function(el){
      return el.offsetParent !== null; // only visible
    });
    var pick = targets.slice().sort(function(){ return Math.random()-0.5; }).slice(0, Math.ceil(Math.random()*2+1));
    pick.forEach(function(el){
      el.classList.add('glitching');
      setTimeout(function(){ el.classList.remove('glitching'); }, 160);
    });

    // 3. Random body skew — brief
    var intensity = Math.random();
    if(intensity > 0.6){
      document.body.style.transform = 'skewX('+(Math.random()*1.5-0.75)+'deg)';
      document.body.style.filter = 'brightness('+(1+Math.random()*0.3)+')';
      setTimeout(function(){
        document.body.style.transform = '';
        document.body.style.filter = '';
      }, 80);
    }

    // 4. Occasional horizontal slice shift
    if(intensity > 0.8){
      var main = document.getElementById('main-content') || document.body;
      main.style.clipPath = 'polygon(0 0, 100% 0, 100% '+(30+Math.random()*20)+'%, 100% '+(30+Math.random()*20)+'%, 0 '+(50+Math.random()*20)+'%, 0 100%)';
      setTimeout(function(){ main.style.clipPath = ''; }, 60);
    }

    setTimeout(function(){ glitchActive = false; }, 200);
  }

  function scheduleNextGlitch(){
    // Random interval: 3s to 12s
    var next = 3000 + Math.random() * 9000;
    setTimeout(function(){
      // Only glitch if page is visible and user is logged in
      if(!document.hidden && document.getElementById('login-overlay') && document.getElementById('login-overlay').classList.contains('hidden')){
        triggerGlitch();
        // Sometimes double-glitch
        if(Math.random() > 0.7){
          setTimeout(triggerGlitch, 250 + Math.random()*200);
        }
      }
      scheduleNextGlitch();
    }, next);
  }

  // Also glitch on scan complete
  window.triggerGlitch = triggerGlitch;

  // Init after DOM ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    setTimeout(init, 500);
  }
})();

// ===== LOGOUT =====
function showLogoutModal(){
  document.getElementById('logout-modal').classList.add('show');
}
function hideLogoutModal(){
  document.getElementById('logout-modal').classList.remove('show');
}
function doLogout(){
  localStorage.removeItem('pe_logged_in');
  localStorage.removeItem('pe_token');
  localStorage.removeItem('pe_username');
  localStorage.removeItem('pe_created');
  // Clear search history
  ['username','ip','email','phone','dork','hash','whois','dns'].forEach(function(mod){
    localStorage.removeItem('pe_hist_'+mod);
  });
  localStorage.removeItem('pe_scan_history');
  location.reload();
}

// Close logout modal on Escape
document.addEventListener('keydown', function(e){
  if(e.key==='Escape'){
    var modal=document.getElementById('logout-modal');
    if(modal&&modal.classList.contains('show'))hideLogoutModal();
  }
});

function showToast(msg, type){
  type = type||'info';
  var icons = {success:'✓', error:'⚠', info:'ℹ'};
  var container = document.getElementById('pe-toast');
  var item = document.createElement('div');
  item.className = 'pe-toast-item '+type;
  item.innerHTML = '<span style="font-size:16px;">'+icons[type]+'</span><span>'+msg+'</span>';
  container.appendChild(item);
  setTimeout(function(){
    item.style.animation='toastOut 0.3s ease forwards';
    setTimeout(function(){ if(item.parentNode)item.parentNode.removeChild(item); }, 300);
  }, 2800);
}

// ===== PHANTOMEYE PROTECTION =====
// (function(){
//   // Right click disable
//   document.addEventListener('contextmenu', function(e){
//     e.preventDefault();
//     return false;
//   });

//   // Block F12, Ctrl+Shift+I/J/C, Ctrl+U
//   document.addEventListener('keydown', function(e){
//     if(e.key === 'F12'){ e.preventDefault(); return false; }
//     if(e.ctrlKey && e.shiftKey && ['i','I','j','J','c','C'].includes(e.key)){ e.preventDefault(); return false; }
//     if(e.ctrlKey && ['u','U'].includes(e.key)){ e.preventDefault(); return false; }
//   });

//   // Console warning message
//   setTimeout(function(){
//     console.log('%c⛔ STOP!', 'color:#ff0000;font-size:36px;font-weight:bold;text-shadow:0 0 10px #ff0000;');
//     console.log('%cThis is PhantomEye — a protected application.\nUnauthorized inspection or code theft is strictly prohibited.\n⚠ This activity may be logged and reported.', 'color:#ff6b35;font-size:13px;font-family:monospace;line-height:1.8;');
//     console.log('%c👁 PhantomEye Security System — Active', 'color:#00d4ff;font-size:12px;font-family:monospace;');
//   }, 800);

//   // DevTools open detection — blur screen (desktop only)
//   var _dtOpen = false;
//   var _isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent);
//   if(!_isMobile){
//     setInterval(function(){
//       var wDiff = window.outerWidth - window.innerWidth > 160;
//       var hDiff = window.outerHeight - window.innerHeight > 160;
//       if(wDiff || hDiff){
//         if(!_dtOpen){
//           _dtOpen = true;
//           document.body.style.filter = 'blur(10px)';
//           var warn = document.createElement('div');
//           warn.id = 'pe-devtools-overlay';
//           warn.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.95);z-index:999999;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:monospace;';
//           warn.innerHTML = '<div style="color:#ff0000;font-size:52px;margin-bottom:16px;">&#x26D4;</div>'
//             + '<div style="color:#ff0000;font-size:24px;font-weight:bold;letter-spacing:5px;margin-bottom:14px;">ACCESS DENIED</div>'
//             + '<div style="color:#ff6b35;font-size:14px;text-align:center;line-height:2;max-width:420px;">Developer Tools detected.<br>Unauthorized inspection is prohibited.<br><span style="color:#00d4ff;">Close DevTools to continue.</span></div>';
//           document.body.appendChild(warn);
//         }
//       } else {
//         if(_dtOpen){
//           _dtOpen = false;
//           document.body.style.filter = '';
//           var el = document.getElementById('pe-devtools-overlay');
//           if(el) el.remove();
//         }
//       }
//     }, 800);
//   }
// })();