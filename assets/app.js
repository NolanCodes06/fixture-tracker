// Fixture Tracker v7 - app.js
// All shipped data is generated. See tools/generate_sample_data.py.
// Data architecture:
//   hist_data_2025.js → HIST_2025 (52 weeks of sample rows)
//   hist_data_2026.js → HIST_2026 (weeks 01-22 of sample rows)
//   LIVE_SEED (below) → seeds the editable live week (WEEK 23 2026)
//   localStorage key: ftk_v7_live
//
const LIVE_SEED = [
  ["WEEK 23 2026","","IRSEN HARMONY","OSTLUND","37","CPP","5-6 JUNE","ROTTERDAM","USAC","110","FLD","",0],
  ["WEEK 23 2026","","ANDRIL HORIZON","CNR","37","CPP","21 JUNE","YANBU","TA","RNR","SUBS","",0],
  ["WEEK 23 2026","","DRUVEN FALCON","QUILLON","38","CPP","18 JUNE","PORT ARTHUR","WCMEX","85","FXD","",0],
  ["WEEK 23 2026","","VORNIK COMPASS","ORVEX","37","UMS","11-14 JUNE","ARA","TA","RNR","SUBS","",1],
  ["WEEK 23 2026","","TERVIK GALE","GALLOWAY","37","NAP","23-24 JUNE","ARA","WAFR","145","SUBS","",0],
  ["WEEK 23 2026","","ULDREN HARMONY","UNDERWOOD","38","UMS","19-21 JUNE","COATZA","WAFR","RNR","SUBS","",0],
  ["WEEK 23 2026","","NILVAR FALCON","FAIRMONT PETRO","38","GO","16-19 JUNE","ARA","USAC","200","FLD","",0],
  ["WEEK 23 2026","","FYRDEN VOYAGER","XANTHE","38","CPP","9 JUNE","","OPS","140","FXD","",0],
  ["WEEK 23 2026","05-11","QUENVAR BEACON","WYNDHAM FUELS","38","UMS","2 JUNE","","","RNR","SUBS","",0],
  ["WEEK 23 2026","","SYLDOR GALE","FENWICK","37","NAP","14 JUNE","FUJAIRAH","WAFR","RNR","FXD","",0],
  ["WEEK 23 2026","","OSKAVI ISLE","BELLMORE","37","UMS","5-7 JUNE","FUJAIRAH","MED","PROG","FXD","",0],
  ["WEEK 23 2026","","NOVREN PHOENIX","DUNMORE","37","UMS","8-9 JUNE","LAVERA","","RNR","FXD","",0],
  ["WEEK 23 2026","","FYRDEN VISTA","RAVENNA","38","CPP","16 JUNE","ARA","ECCA","RNR","FXD","",0],
  ["WEEK 23 2026","24-30","GALTOR FALCON","CNR","38","CPP","21-24 JUNE","SIKKA","UKC","190","SUBS","",1],
  ["WEEK 23 2026","","MERTHOL ISLE","LANDRY OIL","37","GO","N/A","","SPORE","RNR","FXD","",0],
  ["WEEK 23 2026","","KORVETH LEGACY","VARENNE","38","UMS","11-14 JUNE","SINES","UKC","140","SUBS","",0],
  ["WEEK 23 2026","","FYRDEN HARMONY","BRAMWELL","37","NAP","23-26 JUNE","PEMBROKE","","175","","",0],
  ["WEEK 23 2026","","WESKAR LEGACY","RAVENNA","37","NAP","25 JUNE","MONGSTAD","OPS","225","FXD","",0],
  ["WEEK 23 2026","","SOLVANE LANTERN","CNR","37","UMS","9 JUNE","MONGSTAD","WAFR","RNR","FXD","",0],
  ["WEEK 23 2026","","VESPARA SUMMIT","RAVENNA","37","UMS","26-27 JUNE","ARA","UKC","175","FXD","",0],
  ["WEEK 23 2026","","JUNVAR PIONEER","QUARRAN","37","UMS","1 JUNE","TUAPSE","WAFR","120","FXD","",0],
  ["WEEK 23 2026","","DELMARIS ECHO","MERIDAN TRADING","37","UMS","20-21 JUNE","MADERO","SPORE","RNR","SUBS","",0],
  ["WEEK 23 2026","","TRN 5","GRANTHAM OIL","37","UMS","8-9 JUNE","USG","PERU","90","SUBS","",0],
  ["WEEK 23 2026","","ITHRAN GALE","KESTREL TRADING","37","UMS","8-11 JUNE","USG","AUSTRALIA","110","FLD","",0],
  ["WEEK 23 2026","","BALVEN TRADER","PELLWORTH","37","CPP","24 JUNE","BILBAO","TA","165","FXD","",0],
  ["WEEK 23 2026","","MOVREN ECHO","MARCHETTI","37","NAP","7 JUNE","ARA","TA","200","FXD","",1],
  ["WEEK 23 2026","","ANDRIL RIDGE","VANTOR","37","UMS","22-24 JUNE","ARA","","220","FXD","",0],
  ["WEEK 23 2026","","WESKAR HAVEN","ZORAN PETRO","37","UMS","8-11 JUNE","MONGSTAD","WAFR","125","FXD","",0],
  ["WEEK 23 2026","","BRELDIN COMPASS","LANDRY OIL","37","HSD","21 JUNE","PEMBROKE","USG-USAC-CBS-ECCA","215","","",0],
  ["WEEK 23 2026","","SOLVANE TRADER","ZORAN PETRO","37","UMS","N/A","ROTTERDAM","TA","210","SUBS","",0],
];



// ── THEME INIT (prevents flash of wrong theme on load) ───────
(function() {
  var t = localStorage.getItem('ftk_v7_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', t);
})();

'use strict';

// ── PATH RESOLUTION ─────────────────────────────────────
// Each page sets window.FTK_DEPTH before loading this file:
//   0 = root (index.html)
//   2 = modules/x/index.html
const _base = (() => {
  const d = (typeof FTK_DEPTH !== 'undefined') ? FTK_DEPTH : 0;
  if (d === 0) return '.';
  return Array(d).fill('..').join('/');
})();

// ── FTK DATA LAYER ───────────────────────────────────────
const FTK = (() => {
  const LIVE_KEY     = 'ftk_v7_live';   // bumped from v5 - forces re-seed from corrected Week 23 data
  const IMP_KEY      = 'ftk_v5_imported';
  const LIVE_WEEK    = 'WEEK 23 2026';

  // Historical rows: sourced from HIST_2025 / HIST_2026 external files
  const historical = []; // kept for backward compat

  // ── Live week (localStorage) ──────────────────────────
  function _loadLive() {
    const s = localStorage.getItem(LIVE_KEY);
    if (s) return JSON.parse(s);
    const seed = LIVE_SEED.map((r, i) => ({
      id:`L${i}`, week:LIVE_WEEK, window:r[1], vessel:r[2], charterer:r[3],
      mt:r[4], cargo:r[5], laycan:r[6], load:r[7],
      discharge:r[8], rate:r[9], status:r[10], notes:r[11]||'', ftk:r[12]===1, isLive:true
    }));
    localStorage.setItem(LIVE_KEY, JSON.stringify(seed));
    return seed;
  }
  let _live = _loadLive();
  let _nextId = _live.reduce((m,f)=>{ const n=parseInt(f.id.replace(/\D/g,''))||0; return n>m?n:m; },999) + 1;
  function _saveLive() { localStorage.setItem(LIVE_KEY, JSON.stringify(_live)); }

  // ── Imported weeks (localStorage) ────────────────────
  function _loadImp() { const s=localStorage.getItem(IMP_KEY); return s?JSON.parse(s):[]; }
  function _saveImp(d) { localStorage.setItem(IMP_KEY, JSON.stringify(d)); }

  // ── PUBLIC READ ───────────────────────────────────────
  function getHistorical() {
    const h25 = (typeof HIST_2025 !== 'undefined' ? HIST_2025 : []).map((r,i)=>({id:`H25_${i}`,week:r[0],window:r[1],vessel:r[2],charterer:r[3],mt:r[4],cargo:r[5],laycan:r[6],load:r[7],discharge:r[8],rate:r[9],status:r[10],notes:r[11]||'',ftk:r[12]===1,isLive:false}));
    const h26 = (typeof HIST_2026 !== 'undefined' ? HIST_2026 : []).map((r,i)=>({id:`H26_${i}`,week:r[0],window:r[1],vessel:r[2],charterer:r[3],mt:r[4],cargo:r[5],laycan:r[6],load:r[7],discharge:r[8],rate:r[9],status:r[10],notes:r[11]||'',ftk:r[12]===1,isLive:false}));
    return [...h25, ...h26];
  }
  function getLive()       { return _live; }
  function getImported()   { return _loadImp(); }
  function getFTKAll()     { return [...getHistorical().filter(f=>f.ftk), ..._live.filter(f=>f.ftk)]; }
  function getAll()        { return [...getHistorical(), ..._loadImp(), ..._live]; }

  function getWeeks() {
    const allHist = getHistorical().map(f=>f.week);
    const imp = _loadImp().map(f=>f.week);
    const allWks = [...new Set([...allHist, ...imp, LIVE_WEEK])];
    // Newest first: highest year, highest week number
    return allWks.sort((a,b)=>{
      const pa=a.match(/WEEK (\d+)(?: (\d+))?/), pb=b.match(/WEEK (\d+)(?: (\d+))?/);
      if (!pa||!pb) return b.localeCompare(a);
      const ya=parseInt(pa[2]||'2026'), yb=parseInt(pb[2]||'2026');
      if (ya!==yb) return yb-ya;
      return parseInt(pb[1])-parseInt(pa[1]);
    });
  }

  // ── PUBLIC WRITE (live only) ──────────────────────────
  function addLive(f) {
    const fix = {...f, id:`L${_nextId++}`, isLive:true, week:LIVE_WEEK};
    _live.unshift(fix);
    _saveLive();
    return fix;
  }
  function updateLive(id, updates) {
    const idx = _live.findIndex(f=>f.id===id);
    if (idx>=0) { _live[idx]={..._live[idx],...updates}; _saveLive(); return _live[idx]; }
    return null;
  }
  function deleteLive(id) { _live=_live.filter(f=>f.id!==id); _saveLive(); }

  function importWeek(weekName, fixtures) {
    const existing = _loadImp().filter(f=>f.week!==weekName);
    const newFix = fixtures.map((f,i)=>({...f, week:weekName, id:`I${weekName.replace(/\W/g,'')}${i}`, isLive:false}));
    _saveImp([...existing,...newFix]);
    return newFix.length;
  }

  function resetLive() { localStorage.removeItem(LIVE_KEY); _live=_loadLive(); }

  // ── WEEK STATS (for hub + compare) ───────────────────
  function buildWeekStats(selectedWeeks, ftkOnly=false) {
    const allWeeks = getWeeks();
    const imp=_loadImp();
    return allWeeks.map(wk=>{
      if (selectedWeeks && !selectedWeeks.includes(wk)) return null;
      let fx = wk===LIVE_WEEK
        ? _live
        : [...getHistorical(),...imp].filter(f=>f.week===wk);
      if(ftkOnly) fx=fx.filter(f=>f.ftk);
      if (!fx.length && wk!==LIVE_WEEK) return {week:wk,label:wk.replace('WEEK ','Wk ').replace(' 2025','').replace(' 2026',''),hasData:false,total:0,fxd:0,fld:0,subs:0,hold:0,fixedPct:0,cpp:0,ulsd:0,ums:0,nap:0,jet:0,ta:0,cbs:0,ecm:0,ops:0,wcmex:0,isLive:false};
      const c=v=>fx.filter(f=>(f.cargo||'').includes(v)).length;
      const d=v=>fx.filter(f=>(f.discharge||'').includes(v)).length;
      return {
        week:wk, label:wk.replace('WEEK ','Wk ').replace(' 2025',' 25').replace(' 2026',' 26'), hasData:fx.length>0, isLive:wk===LIVE_WEEK,
        total:fx.length,
        fxd:fx.filter(f=>f.status==='FXD').length,
        fld:fx.filter(f=>['FLD','FAILED'].includes(f.status)).length,
        subs:fx.filter(f=>f.status==='SUBS').length,
        hold:fx.filter(f=>f.status==='HOLD').length,
        fixedPct:fx.length?Math.round(fx.filter(f=>f.status==='FXD').length/fx.length*100):0,
        cpp:c('CPP'), ulsd:c('ULSD'), ums:c('UMS'), nap:c('NAP'), jet:c('JET'),
        ta:d('TA'), cbs:d('CBS'), ecm:d('ECM'), ops:d('OPS'), wcmex:d('WCMEX'),
      };
    }).filter(Boolean);
  }

  // ── UTILS ─────────────────────────────────────────────
  function esc(s) {
    if (s===null||s===undefined) return '';
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }
  function statusBadge(s) {
    const m={FXD:'b-fxd',SUBS:'b-subs',HOLD:'b-hold',FLD:'b-fld',FAILED:'b-fld'};
    return `<span class="badge ${m[s]||'b-unk'}">${esc(s||'-')}</span>`;
  }
  function cargoBadge(c) {
    if (!c||c==='N/A') return '<span class="badge b-unk">-</span>';
    const main=c.split('+')[0].trim();
    const m={CPP:'b-cpp',ULSD:'b-ulsd',UMS:'b-ums',NAP:'b-nap',JET:'b-jet',CHEMS:'b-chems',CSS:'b-css',MTBE:'b-mtbe',HSD:'b-ulsd'};
    return `<span class="badge ${m[main]||'b-other'}">${esc(c)}</span>`;
  }
  function toast(msg,type='',dur=2700) {
    let stack=document.getElementById('toast-stack');
    if (!stack){stack=document.createElement('div');stack.id='toast-stack';stack.className='toast-stack';document.body.appendChild(stack);}
    const el=document.createElement('div');
    el.className='toast'+(type?' '+type:'');
    el.textContent=msg;
    stack.appendChild(el);
    setTimeout(()=>el.remove(),dur);
  }

  // ── NLP PARSER (shared, used by live-week & upload) ──
  function parseFixtureText(text) {
    const raw=text.toUpperCase().trim();
    const CARGOS=['CPP','ULSD','UMS','NAP','JET','CHEMS','MTBE','HSD','ISO','CSS','HVO'];
    const cargo=CARGOS.find(c=>raw.includes(c))||'CPP';
    let status='FXD';
    if(raw.includes(' SUBS')) status='SUBS';
    else if(raw.includes(' HOLD')) status='HOLD';
    else if(raw.includes('FAIL')||raw.includes(' FLD')) status='FLD';
    const mtM=raw.match(/\b(38|39|40|45|50|55|60|75|90|37)\b/);
    const mt=mtM?mtM[1]:'38';
    const LOADS=['MISS RIVER','PORT ARTHUR','LAKE CHARLES','TEXAS CITY','BATON ROUGE','PASCAGOULA','BEAUMONT','GARYVILLE','HOUSTON','CORPUS','NOLA','BAYTOWN','RICHMOND','CHERRY','PLAQUEMINE','USG','SWP'];
    let load='USG';
    for(const l of LOADS){if(raw.includes(l)){load=l;break;}}
    const DISCS=['ECSA','WCMEX','WCCAM','EAFR','WCCA','USWC','USAC','SAFR','SAF','CHILE','BRAZIL','BRZ','ARGIE','ECU','PERU','CBS','ECM','WAF','OPS','TA'];
    let discharge='OPS';
    for(const d of DISCS){if(raw.includes(d)){discharge=d;break;}}
    const winM=raw.match(/\b(\d{2}-\d{2})\b/);
    const window=winM?winM[1]:'24-30';
    const rateM=raw.match(/\b(\d{1,4}(?:\.\d{1,3})?(?:\s*\/\s*\d+\.?\d*K?)?)\b/g);
    let rate='RNR';
    if(rateM){const g=rateM.filter(r=>!['38','39','60','90','37','45','50','55'].includes(r.trim())&&parseFloat(r)>100);if(g.length)rate=g[0];}
    const allV=[...new Set([...LIVE_SEED].map(r=>r[2]).filter(Boolean))];
    let vessel='';
    for(const v of allV){if(v.length>3&&raw.includes(v)){vessel=v;break;}}
    if(!vessel){
      const SKIP=new Set([...CARGOS,'FXD','SUBS','HOLD','FLD','FIXED','CNR','USG','RNR','OPS',status,cargo,load,discharge,mt,window]);
      const toks=raw.split(/\s+/);
      vessel=toks.find(t=>t.length>3&&/^[A-Z][A-Z0-9\-]+$/.test(t)&&!SKIP.has(t))||'';
    }
    const allC=[...new Set([...LIVE_SEED].map(r=>r[3]).filter(Boolean))];
    let charterer='CNR';
    for(const c of allC){if(c.length>1&&c!==vessel&&raw.includes(c)){charterer=c;break;}}
    return {vessel,charterer,mt,cargo,laycan:'N/A',load,discharge,rate,status,window};
  }

  function getUniqueVessels()    { return [...new Set([...(typeof HIST_2025!=='undefined'?HIST_2025:[]),...(typeof HIST_2026!=='undefined'?HIST_2026:[]),...LIVE_SEED].map(r=>r[2]).filter(Boolean))]; }
  function getUniqueCharterers() { return [...new Set([...(typeof HIST_2025!=='undefined'?HIST_2025:[]),...(typeof HIST_2026!=='undefined'?HIST_2026:[]),...LIVE_SEED].map(r=>r[3]).filter(Boolean))]; }
  function getUniqueLoads()      { return [...new Set([...(typeof HIST_2025!=='undefined'?HIST_2025:[]),...(typeof HIST_2026!=='undefined'?HIST_2026:[]),...LIVE_SEED].map(r=>r[7]).filter(Boolean))]; }
  function getUniqueDisch()      { return [...new Set([...(typeof HIST_2025!=='undefined'?HIST_2025:[]),...(typeof HIST_2026!=='undefined'?HIST_2026:[]),...LIVE_SEED].map(r=>r[8]).filter(Boolean))]; }

  // ── SIDEBAR ───────────────────────────────────────────
  // ── TAGS & CATEGORIES ──────────────────────────────────────────
  const TAGS_KEY = 'ftk_v6_tags';
  const PRESET_CATEGORIES = ['Follow Up','Desk Priority','Rate Query','Watch','Cleared','New Vessel','Dispute','COA','On Hold Review'];
  const TAG_COLORS = {
    'Follow Up':'#dbeafe;color:#1e40af','Desk Priority':'#dcfce7;color:#15803d',
    'Rate Query':'#fef3c7;color:#92400e','Watch':'#fce7f3;color:#9d174d',
    'Cleared':'#f3f4f6;color:#374151','New Vessel':'#ede9fe;color:#4c1d95',
    'Dispute':'#fee2e2;color:#b91c1c','COA':'#e0f2fe;color:#075985',
    'On Hold Review':'#fff7ed;color:#9a3412'
  };

  function getTagData(fixtureId) {
    const all = JSON.parse(localStorage.getItem(TAGS_KEY)||'{}');
    return all[fixtureId] || {category:'', tags:[], userNote:''};
  }
  function saveTagData(fixtureId, data) {
    const all = JSON.parse(localStorage.getItem(TAGS_KEY)||'{}');
    if (!data.category && !(data.tags && data.tags.length) && !data.userNote) {
      delete all[fixtureId];
    } else {
      all[fixtureId] = data;
    }
    localStorage.setItem(TAGS_KEY, JSON.stringify(all));
  }
  function getAllTagData() { return JSON.parse(localStorage.getItem(TAGS_KEY)||'{}'); }

  function renderTagChips(fixtureId, small) {
    const d = getTagData(fixtureId);
    const sz = small ? 'font-size:9.5px;padding:1px 6px' : 'font-size:10px;padding:2px 8px';
    let out = '';
    if (d.category) {
      const col = TAG_COLORS[d.category] || '#f3f4f6;color:#374151';
      out += `<span class="tag-chip" style="background:${col};${sz}">${esc(d.category)}</span>`;
    }
    (d.tags||[]).forEach(t => {
      out += `<span class="tag-chip" style="background:#f3f4f6;color:#374151;${sz}">${esc(t)}</span>`;
    });
    return out;
  }

  // ── SUPPORT REQUESTS ────────────────────────────────────────────
  const SUPPORT_KEY = 'ftk_v6_support';
  const SUPPORT_TYPES = ['Missing Data','Wrong Information','New Feature Request','Question','Other'];

  function addSupportRequest(text, type) {
    const all = JSON.parse(localStorage.getItem(SUPPORT_KEY)||'[]');
    all.unshift({id:Date.now(), text, type, date:new Date().toLocaleString(), resolved:false});
    localStorage.setItem(SUPPORT_KEY, JSON.stringify(all));
  }
  function getSupportRequests() { return JSON.parse(localStorage.getItem(SUPPORT_KEY)||'[]'); }
  function resolveSupportRequest(id) {
    const all = getSupportRequests();
    const r = all.find(x=>x.id===id);
    if(r) r.resolved=true;
    localStorage.setItem(SUPPORT_KEY, JSON.stringify(all));
  }
  function getOpenSupportCount() { return getSupportRequests().filter(r=>!r.resolved).length; }

  function openSupportModal() {
    let modal = document.getElementById('support-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'support-modal';
      modal.className = 'modal-ov';
      document.body.appendChild(modal);
    }
    const open = getSupportRequests().filter(r=>!r.resolved);
    modal.innerHTML = `
      <div class="modal" style="max-width:560px">
        <div class="m-hdr">
          <div><h3>Feedback &amp; Support</h3><p>Report missing data, wrong info, or request a feature</p></div>
          <button class="m-close" onclick="document.getElementById('support-modal').classList.add('hidden')">×</button>
        </div>
        <div class="m-body">
          <div class="fgrid" style="margin-bottom:14px">
            <div class="fg" style="grid-column:1/-1">
              <label>Request Type</label>
              <select class="fc" id="sup-type">${SUPPORT_TYPES.map(t=>`<option>${t}</option>`).join('')}</select>
            </div>
            <div class="fg" style="grid-column:1/-1">
              <label>Describe your request or issue <span class="req">*</span></label>
              <textarea class="fc" id="sup-text" rows="4" placeholder="e.g. Week 20 is missing vessel ORVANE TIDE. Or: it would help if we could filter by MT size."></textarea>
            </div>
          </div>
          <button class="btn btn-primary" style="width:100%" onclick="window._submitSupport()">Submit Request</button>
          ${open.length ? `
          <div style="margin-top:18px;border-top:1px solid var(--g100);padding-top:14px">
            <div style="font-size:11px;font-weight:700;color:var(--g500);text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px">Open Requests (${open.length})</div>
            ${open.slice(0,5).map(r=>`
              <div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid var(--g100)">
                <span class="badge b-subs" style="flex-shrink:0;margin-top:1px">${esc(r.type)}</span>
                <div style="flex:1;font-size:12px;color:var(--g700)">${esc(r.text)}</div>
                <div style="font-size:10px;color:var(--g400);flex-shrink:0">${r.date}</div>
              </div>`).join('')}
          </div>` : ''}
        </div>
      </div>`;
    modal.classList.remove('hidden');
    window._submitSupport = function() {
      const text = document.getElementById('sup-text').value.trim();
      const type = document.getElementById('sup-type').value;
      if (!text) { toast('Please describe your request','warning'); return; }
      addSupportRequest(text, type);
      toast('Request submitted - thank you!','success');
      modal.classList.add('hidden');
    };
  }

  // ── GLOSSARY ──────────────────────────────────────────────────
  const GLOSSARY = {
    'FXD':'Fixed - deal confirmed and locked in',
    'SUBS':'On Subjects - provisionally agreed, awaiting final sign-off',
    'HOLD':'On Hold - paused or under review',
    'FLD':'Failed - deal fell through',
    'DESK':'Confirmed - fixture brokered directly by the desk',
    'CNR':'Charterer Not Reported - identity not disclosed',
    'RNR':'Rate Not Reported - rate is confidential or unknown',
    'PROG':'Progressed - terms still being negotiated',
    'CPP':'Clean Petroleum Products (gasoline, jet fuel, diesel)',
    'ULSD':'Ultra Low Sulfur Diesel',
    'UMS':'Unmixed Supply - usually a fuel blend',
    'NAP':'Naphtha - a light petroleum fraction',
    'JET':'Jet fuel (aviation fuel)',
    'USG':'US Gulf Coast (load region)',
    'TA':'Transatlantic - destination across the Atlantic',
    'CBS':'Caribbean / Bahamas / Suriname region',
    'ECM':'East Coast Mexico',
    'WCMEX':'West Coast Mexico',
    'OPS':'Open Position - destination TBD',
    'MT':'Metric Tons - vessel cargo size',
    'MR':'Medium Range tanker (roughly 25,000-55,000 MT)',
    'LAYCAN':'Laydays/Cancelling - the arrival window for the vessel',
  };

  // ── SIDEBAR ─────────────────────────────────────────────────────
  function renderSidebar(active) {
    const liveCount = _live.length;
    const supportCount = getOpenSupportCount();
    const items = [
      {id:'hub',     lbl:'Dashboard',          href:`${_base}/index.html`,
       icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>'},
      {id:'live',    lbl:'Live Week',           href:`${_base}/modules/live-week/index.html`,   badge:liveCount,
       icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>'},
      {id:'history', lbl:'History Archive',     href:`${_base}/modules/history/index.html`,
       icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>'},
      {id:'search',  lbl:'Search All Fixtures', href:`${_base}/modules/search/index.html`,
       icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>'},
      {id:'compare', lbl:'Charts & Trends',     href:`${_base}/modules/compare/index.html`,
       icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'},
      {id:'upload',  lbl:'Import Week',         href:`${_base}/modules/upload/index.html`,
       icon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>'},
    ];
    const el = document.getElementById('sidebar');
    if (!el) return;
    el.className = 'sidebar';
    el.innerHTML = `
      <div class="sb-brand"><div class="sb-brand-row">
        <div class="sb-logo">FT</div>
        <div><div class="sb-title">Fixture Tracker</div><div class="sb-sub">Sample data &middot; v6</div></div>
      </div></div>
      <nav class="sb-nav">
        ${items.map(it=>`
          <a href="${it.href}" class="sb-item${active===it.id?' active':''}">
            ${it.icon}<span>${it.lbl}</span>
            ${it.badge!=null?`<span class="sb-badge">${it.badge}</span>`:''}
          </a>`).join('')}
        <div class="sb-divider"></div>
        <button class="sb-item sb-support-btn" onclick="FTK.openSupportModal()" style="width:100%;text-align:left;background:none;border:none;cursor:pointer">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px;flex-shrink:0;opacity:.55"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          <span>Feedback &amp; Support</span>
          ${supportCount?`<span class="sb-badge" style="background:rgba(220,38,38,.3);color:#fca5a5">${supportCount}</span>`:''}
        </button>
      </nav>
      <div class="sb-footer">
        <div class="sb-status"><span class="sdot"></span>${getWeeks().length} weeks &middot; ${getLive().length} fixtures this week</div>
        <div class="sb-hints">
          <div class="sh-row"><kbd>N</kbd><kbd>+</kbd> new fixture (Live Week)</div>
          <div class="sh-row"><kbd>Enter</kbd> save &middot; <kbd>Esc</kbd> cancel</div>
          <div class="sh-row">status: <kbd>F</kbd><kbd>S</kbd><kbd>H</kbd><kbd>X</kbd></div>
        </div>
        ${(() => {
          const curTheme = document.documentElement.getAttribute('data-theme') || 'dark';
          const toggleIcon  = curTheme === 'dark' ? '☀️' : '🌙';
          const toggleLabel = curTheme === 'dark' ? 'Light mode' : 'Dark mode';
          return `<button class="theme-toggle" onclick="window.FTK_toggleTheme()">
          <span class="theme-toggle-icon" id="theme-toggle-icon">${toggleIcon}</span>
          <span id="theme-toggle-label">${toggleLabel}</span>
        </button>`;
        })()}
      </div>`;
  }

  // ── DATALISTS ────────────────────────────────────────────────
  function fillDataLists() {
    const fill = (id, arr) => {
      const dl = document.getElementById(id); if (!dl) return;
      dl.innerHTML = arr.map(v=>`<option value="${esc(v)}">`).join('');
    };
    fill('dl-vessels',    getUniqueVessels().sort());
    fill('dl-charterers', ['CNR',...getUniqueCharterers().filter(c=>c!=='CNR').sort()]);
    fill('dl-loads',      getUniqueLoads().sort());
    fill('dl-discharges', getUniqueDisch().sort());
  }

  // ── v7: DUPLICATE DETECTION ───────────────────────────────────
  // Returns array of fixtures in the live week that share the same vessel name
  // and same window, excluding a given ID (used when editing so we don't flag self)
  function checkDuplicate(vessel, window, excludeId) {
    if (!vessel) return [];
    const v = vessel.toUpperCase().trim();
    const w = (window||'').toUpperCase().trim();
    return _live.filter(f =>
      f.id !== excludeId &&
      f.vessel.toUpperCase() === v &&
      (!w || (f.window||'').toUpperCase() === w)
    );
  }

  // ── v7: UNDO STACK (single-level - only last delete) ─────────
  let _undoStack = null; // { action:'delete', data: fixture }

  function pushUndo(action, data) {
    _undoStack = { action, data };
  }

  function popUndo() {
    if (!_undoStack) return null;
    const u = _undoStack;
    _undoStack = null;
    return u;
  }

  // Override deleteLive to push undo and show undo toast
  const _origDelete = deleteLive;
  function deleteLiveWithUndo(id) {
    const fix = _live.find(f => f.id === id);
    if (fix) pushUndo('delete', {...fix});
    _origDelete(id);
    // Toast with undo button rendered by caller (live-week page)
  }

  // ── v7: RATE FORMAT DETECTION ────────────────────────────────
  // Returns 'WS' | 'USD' | 'LS' | 'COA' | 'PROG' | 'RNR'
  function detectRateFormat(rate) {
    if (!rate || rate === 'RNR' || rate === 'N/A') return 'RNR';
    const r = rate.toString().toUpperCase().trim();
    if (r === 'PROG') return 'PROG';
    if (r === 'COA')  return 'COA';
    // Lumpsum: contains 'K' or very large number (>5000)
    if (/K/i.test(r)) return 'LS';
    // Multi-leg: contains '/'
    if (/\d+\s*\/\s*\d+/.test(r)) return 'USD'; // USD/MT multi-leg
    // WS: pure number 50-350 (Worldscale range)
    const n = parseFloat(r);
    if (!isNaN(n) && n >= 50 && n <= 350) return 'WS';
    // USD/MT: numbers > 350
    if (!isNaN(n) && n > 350) return 'LS';
    return 'USD';
  }

  // ── v7: WRONG-WEEK LAYCAN CHECK ──────────────────────────────
  // Returns true if laycan text contains a month clearly outside the current window
  const CURRENT_MONTH = 'JUNE'; // Week 23 2026
  const MONTH_NAMES = ['JAN','FEB','MAR','APR','MAY','JUN','JUNE','JUL','AUG','SEP','OCT','NOV','DEC'];
  function isWrongWeekLaycan(laycan) {
    if (!laycan || laycan === 'N/A') return false;
    const upper = laycan.toUpperCase();
    const found = MONTH_NAMES.find(m => upper.includes(m));
    if (!found) return false;
    const norm = found.replace('JUNE','JUN');
    const idx = MONTH_NAMES.indexOf(norm);
    const curIdx = 5; // June = index 5
    return Math.abs(idx - curIdx) > 1;
  }

  // ── v7: AI BOX EXAMPLE QUERIES ───────────────────────────────
  const AI_EXAMPLES = [
    'Show all desk fixtures from Week 21',
    'Compare ULSD rates USG → TA across all weeks',
    'Which vessels have failed the most this year?',
    'What was the average fix rate for Week 20 vs Week 23?',
    'Find all VANTOR charterer fixtures with CBS discharge',
  ];

  // ── v7: SIDEBAR UPDATE ───────────────────────────────────────
  // (Patch version string in the existing renderSidebar result)
  const _origRenderSidebar = renderSidebar;
  function renderSidebarV7(active) {
    _origRenderSidebar(active);
    const subEl = document.querySelector('.sb-sub');
    if (subEl) subEl.textContent = 'Sample data · v7';
  }

  return {
    LIVE_WEEK,
    PRESET_CATEGORIES, TAG_COLORS, GLOSSARY, AI_EXAMPLES,
    getHistorical, getLive, getImported, getAll, getFTKAll, getWeeks,
    addLive, updateLive, deleteLive: deleteLiveWithUndo, importWeek, resetLive,
    buildWeekStats,
    esc, statusBadge, cargoBadge, toast,
    parseFixtureText, getUniqueVessels, getUniqueCharterers,
    getTagData, saveTagData, getAllTagData, renderTagChips,
    addSupportRequest, getSupportRequests, resolveSupportRequest, getOpenSupportCount,
    openSupportModal,
    renderSidebar: renderSidebarV7, fillDataLists,
    // v7 additions
    checkDuplicate, pushUndo, popUndo, detectRateFormat, isWrongWeekLaycan,
  };
})();

// ── GLOBAL THEME TOGGLE ─────────────────────────────────────
window.FTK_toggleTheme = function() {
  const cur  = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = cur === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('ftk_v7_theme', next);
  const icon  = document.getElementById('theme-toggle-icon');
  const label = document.getElementById('theme-toggle-label');
  if (icon)  icon.textContent  = next === 'dark' ? '☀️' : '🌙';
  if (label) label.textContent = next === 'dark' ? 'Light mode' : 'Dark mode';
};
