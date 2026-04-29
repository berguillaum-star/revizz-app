import React, { useState, useEffect, useRef } from "react";

var SUPABASE_URL = "https://ulfrjsufztnnvrmltaph.supabase.co";
var SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsZnJqc3VmenRubnZybWx0YXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0MTg0MjQsImV4cCI6MjA5Mjk5NDQyNH0.NSimA5LuypOtGZ1B4vC0TqZFyHX5aLl33L5Cd_kdoh0";

function sbFetch(path, opts) {
  var url = SUPABASE_URL + "/rest/v1/" + path;
  var headers = Object.assign({
    "apikey": SUPABASE_KEY,
    "Authorization": "Bearer " + SUPABASE_KEY,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  }, opts.headers || {});
  return fetch(url, Object.assign({}, opts, {headers: headers}));
}

function loadProfils() {
  return sbFetch("profils?order=created_at.asc", {method:"GET"})
    .then(function(r) { return r.json(); })
    .catch(function() { return []; });
}

function createProfil(prenom, niveau, matiere) {
  return sbFetch("profils", {
    method: "POST",
    body: JSON.stringify({prenom:prenom, niveau:niveau, matiere:matiere})
  }).then(function(r) { return r.json(); })
    .then(function(rows) { return rows[0]; })
    .catch(function() { return null; });
}

function updateProfil(id, matiere) {
  return sbFetch("profils?id=eq." + id, {
    method: "PATCH",
    body: JSON.stringify({matiere:matiere})
  }).catch(function() {});
}

function saveSession(profilId, matiere, titre, score, total) {
  return sbFetch("sessions", {
    method: "POST",
    body: JSON.stringify({profil_id:profilId, matiere:matiere, titre:titre, score:score, total:total})
  }).catch(function() {});
}

var PINK = "#E87EC0";
var VIOLET = "#9B8FD4";
var PINK2 = "#C96EB0";
var TEXT = "#111111";
var TEXTSUB = "#888888";
var TEXTMUTED = "#BBBBBB";
var BORDER = "#EEEEEE";
var SURFACE = "#FAFAFA";

var MATS = [
  { l: "Mathematiques",        e: "🔢", c: "#9B8FD4" },
  { l: "Francais",             e: "📝", c: "#C96EB0" },
  { l: "Histoire",             e: "🏛", c: "#E87EC0" },
  { l: "Sciences et tech.",    e: "🔬", c: "#34D399" },
  { l: "Geographie",           e: "🌍", c: "#FB923C" },
  { l: "Anglais",              e: "🗣", c: "#60A5FA" },
  { l: "Chimie",               e: "⚗",  c: "#A78BFA" },
  { l: "Physique",             e: "⚡", c: "#FBBF24" },
  { l: "Education financiere", e: "💰", c: "#4ADE80" },
  { l: "Monde contemporain",   e: "🗺", c: "#818CF8" },
  { l: "Contenus autochtones", e: "🌿", c: "#86EFAC" },
];

var PRIM = ["Primaire 1","Primaire 2","Primaire 3","Primaire 4","Primaire 5","Primaire 6"];
var SEC  = ["Secondaire 1","Secondaire 2","Secondaire 3","Secondaire 4","Secondaire 5"];
var ASTATS = ["Lecture de tes notes...","Identification des concepts...","Redaction de la fiche...","Generation des questions...","Finalisation..."];
var AVATARS = ["🌸","⭐","🦋","🌙","🌈","🦄"];

function getMat(l) {
  for (var i = 0; i < MATS.length; i++) {
    if (MATS[i].l === l) return MATS[i];
  }
  return null;
}

var CSS = [
  "@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');",
  "*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}",
  "html,body,#root{height:100%;width:100%;overflow:hidden;overscroll-behavior:none;-webkit-text-size-adjust:100%;background:#e8e8e8}",
  ".rz-wrap{position:fixed;inset:0;display:flex;flex-direction:column;font-family:'Nunito',system-ui,sans-serif;max-width:430px;margin:0 auto;background:#fff;overflow:hidden}",
  ".rz-body{flex:1;overflow-y:auto;padding:16px 18px 24px;display:flex;flex-direction:column;gap:12px;-webkit-overflow-scrolling:touch}",
  ".rz-pw{display:flex;align-items:center;gap:10px;padding:48px 18px 12px;flex-shrink:0}",
  ".rz-pbar{flex:1;height:5px;border-radius:999px;background:#f0f0f0;overflow:hidden}",
  ".rz-pfill{height:100%;border-radius:999px;transition:width .4s}",
  ".rz-inp{width:100%;font-family:inherit;font-size:20px;font-weight:700;color:#111;text-align:center;border:2px solid #eee;border-radius:16px;padding:15px;background:#fafafa;outline:none;transition:border-color .2s,box-shadow .2s}",
  ".rz-inp:focus{border-color:#C96EB0;background:#fff;box-shadow:0 0 0 4px rgba(201,110,176,.1)}",
  ".rz-inp::placeholder{color:#ccc;font-weight:600}",
  ".rz-btn{width:100%;padding:15px;border:none;border-radius:16px;font-family:inherit;font-size:14px;font-weight:800;color:#fff;cursor:pointer;background:linear-gradient(135deg,#E87EC0,#9B8FD4);transition:transform .1s,filter .1s}",
  ".rz-btn:active{transform:scale(.97);filter:brightness(.92)}",
  ".rz-btn:disabled{opacity:.35;cursor:default;transform:none!important}",
  ".rz-btn-ghost{width:100%;padding:13px;border:1.5px solid #eee;border-radius:16px;font-family:inherit;font-size:13px;font-weight:700;color:#888;cursor:pointer;background:none;transition:background .15s}",
  ".rz-btn-ghost:hover{background:#fafafa}",
  ".rz-chip{padding:9px 13px;border:1.5px solid #eee;border-radius:999px;background:#fff;font-family:inherit;font-size:12px;font-weight:700;color:#888;cursor:pointer;white-space:nowrap;transition:all .15s}",
  ".rz-mgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}",
  ".rz-mc{display:flex;flex-direction:column;align-items:center;gap:5px;padding:13px 6px;border:1.5px solid #eee;border-radius:18px;cursor:pointer;background:#fff;font-family:inherit;transition:transform .12s}",
  ".rz-mc.on{transform:scale(1.05)}",
  ".rz-qopt{width:100%;text-align:left;padding:13px 15px;border-radius:15px;border:1.5px solid #eee;background:#fff;cursor:pointer;font-family:inherit;font-size:13px;font-weight:700;color:#111;display:flex;align-items:center;gap:9px;transition:border-color .15s,background .15s}",
  ".rz-qopt:disabled{cursor:default}",
  ".rz-qopt.ok{border-color:#C96EB0;background:rgba(201,110,176,.07)}",
  ".rz-qopt.ko{border-color:#f87171;background:#fff5f5}",
  ".rz-qopt.rv{border-color:#C96EB0;background:rgba(201,110,176,.07)}",
  ".rz-bdg{width:23px;height:23px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:800;flex-shrink:0;background:#f0f0f0;color:#aaa;transition:background .2s,color .2s}",
  ".rz-bdg.ok{background:#C96EB0;color:#fff}",
  ".rz-bdg.ko{background:#f87171;color:#fff}",
  ".rz-sring{position:absolute;inset:-8px;border-radius:50%;border:4px solid #f0f0f0;border-top-color:#C96EB0;animation:rzSpin .8s linear infinite}",
  ".rz-thumb{width:50px;height:64px;border-radius:10px;object-fit:cover;border:1.5px solid #eee;display:block}",
  ".rz-ghdr{background:linear-gradient(135deg,#E87EC0,#9B8FD4);position:relative;overflow:hidden;flex-shrink:0}",
  ".rz-blob{position:absolute;border-radius:50%;background:rgba(255,255,255,.1)}",
  ".rz-hback{background:rgba(255,255,255,.2);border:none;border-radius:12px;padding:7px 13px;cursor:pointer;color:#fff;font-family:inherit;font-size:12px;font-weight:700;margin-bottom:12px;position:relative;z-index:1}",
  ".rz-feat{display:flex;align-items:center;gap:12px;background:#fafafa;border:1px solid #f0f0f0;border-radius:14px;padding:13px}",
  ".rz-tip{display:flex;align-items:center;gap:10px;background:#fafafa;border:1px solid #f0f0f0;border-radius:12px;padding:11px;font-size:12px;font-weight:700;color:#888}",
  ".rz-card{background:#fff;border:1.5px solid #eee;border-radius:20px;padding:18px;text-align:center}",
  "@keyframes rzSpin{to{transform:rotate(360deg)}}",
  "@keyframes rzBnc{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}",
  "@keyframes rzUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}",
  "@keyframes rzPop{0%{transform:scale(.6);opacity:0}65%{transform:scale(1.06);opacity:1}100%{transform:scale(1);opacity:1}}",
  "@keyframes rzFd{from{opacity:0}to{opacity:1}}",
  "@keyframes rzStpop{0%{transform:scale(0);opacity:0}65%{transform:scale(1.15);opacity:1}100%{transform:scale(1);opacity:1}}",
  "@keyframes rzDraw{from{stroke-dashoffset:300}to{stroke-dashoffset:0}}",
  "@keyframes rzCft{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(70px) rotate(400deg);opacity:0}}",
  ".anim-up{animation:rzUp .3s ease both}",
  ".anim-pop{animation:rzPop .7s cubic-bezier(.34,1.56,.64,1) both}",
  ".anim-fd{animation:rzFd .3s ease both}",
  ".anim-stpop{animation:rzStpop .5s cubic-bezier(.34,1.56,.64,1) .2s both}",
  ".anim-bnc{animation:rzBnc 2s ease-in-out infinite}",
].join("\n");

var _css = false;
function injectCSS() {
  if (_css) return;
  var s = document.createElement("style");
  s.textContent = CSS;
  document.head.appendChild(s);
  _css = true;
}

var STORAGE_KEY = "revizz_profils_v1";
function loadProfilsLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); }
  catch (e) { return []; }
}
function saveProfilsLocal(p) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch (e) {}
}

// ── Logo SVG ─────────────────────────────────────────────────────
function Logo(props) {
  var size = props.size || "md";
  var w = size === "lg" ? 160 : size === "md" ? 80 : 36;
  var h = size === "lg" ? 70 : size === "md" ? 35 : 16;
  var sw1 = size === "lg" ? 7 : size === "md" ? 9 : 14;
  var sw2 = size === "lg" ? 6 : size === "md" ? 8 : 12;
  var anim = props.animate ? {style: {animation: "rzDraw .7s ease both", strokeDasharray: 300, strokeDashoffset: 0}} : {};
  var anim2 = props.animate ? {style: {animation: "rzDraw .7s ease .3s both", strokeDasharray: 300, strokeDashoffset: 0}} : {};
  return (
    <svg width={w} height={h} viewBox="0 0 180 70">
      <defs>
        <linearGradient id="rzGp" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#F5A0C8"/>
          <stop offset="100%" stopColor="#C96EB0"/>
        </linearGradient>
        <linearGradient id="rzGv" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B9FE8"/>
          <stop offset="100%" stopColor="#6B7FD4"/>
        </linearGradient>
      </defs>
      <path d="M20 42 Q90 4 160 42" stroke="url(#rzGp)" strokeWidth={sw1} fill="none" strokeLinecap="round" {...anim} />
      <path d="M28 56 Q90 88 152 56" stroke="url(#rzGv)" strokeWidth={sw2} fill="none" strokeLinecap="round" {...anim2} />
    </svg>
  );
}

// ── Btn ──────────────────────────────────────────────────────────
function Btn(props) {
  return (
    <button className="rz-btn" disabled={props.disabled} onClick={props.onClick} style={props.style || {}}>
      {props.children}
    </button>
  );
}

function ProgWrap(props) {
  return (
    <div className="rz-pw">
      {props.onBack
        ? <button onClick={props.onBack} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#ccc",padding:"4px 6px"}}>&#8592;</button>
        : <div style={{width:32}} />
      }
      <div className="rz-pbar">
        <div className="rz-pfill" style={{width: props.pct + "%"}} />
      </div>
      <div style={{fontSize:11,fontWeight:700,color:"#ccc",minWidth:28,textAlign:"right"}}>{props.label}</div>
    </div>
  );
}

// ── SPLASH ───────────────────────────────────────────────────────
function ScreenSplash(props) {
  useEffect(function() {
    var t = setTimeout(props.onDone, 2500);
    return function() { clearTimeout(t); };
  }, []);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"linear-gradient(145deg,#1c2260,#0f1438)"}}>
      <div className="anim-pop" style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <Logo size="lg" animate={true} />
        <div style={{fontSize:46,fontWeight:900,color:"#fff",letterSpacing:-2,marginTop:-6,animation:"rzFd .5s .6s both"}}>Revizz</div>
      </div>
      <div style={{fontSize:13,color:"rgba(255,255,255,.45)",fontWeight:600,marginTop:22,animation:"rzFd .5s .8s both"}}>Ton compagnon de revision</div>
      <div style={{display:"flex",gap:6,marginTop:36,animation:"rzFd .5s 1s both"}}>
        {[0,1,2].map(function(i) {
          return <div key={i} style={{width:6,height:6,borderRadius:"50%",background:i===1?"#9B8FD4":"#E87EC0",animation:"rzBnc .9s " + (i*200) + "ms ease-in-out infinite"}} />;
        })}
      </div>
    </div>
  );
}

// ── PROFILS ──────────────────────────────────────────────────────
function ScreenProfils(props) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div className="rz-ghdr" style={{padding:"52px 20px 32px"}}>
        <div className="rz-blob" style={{width:200,height:200,top:-60,right:-60}} />
        <div className="rz-blob" style={{width:100,height:100,bottom:-40,left:-30,opacity:.6}} />
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,position:"relative",zIndex:1}}>
          <div style={{width:38,height:38,background:"rgba(255,255,255,.2)",borderRadius:11,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Logo size="sm" />
          </div>
          <div style={{fontSize:22,fontWeight:900,color:"#fff",letterSpacing:-1}}>Revizz</div>
        </div>
        <div style={{fontSize:26,fontWeight:900,color:"#fff",letterSpacing:"-.5px",position:"relative",zIndex:1}}>Qui revise aujourd'hui ?</div>
        <div style={{fontSize:13,color:"rgba(255,255,255,.75)",fontWeight:600,marginTop:5,position:"relative",zIndex:1}}>Selectionne ton profil</div>
      </div>
      <div className="rz-body" style={{gap:14,paddingTop:20}}>
        {props.profils.length === 0 && (
          <div style={{textAlign:"center",padding:"24px 20px",fontSize:13,color:"#bbb",fontWeight:600,background:"#fafafa",borderRadius:16,border:"1.5px dashed #eee"}}>
            Aucun profil - cree le premier !
          </div>
        )}
        {props.profils.map(function(p, i) {
          return (
            <div key={i} onClick={function() { props.onSelect(i); }}
              style={{display:"flex",alignItems:"center",gap:14,borderRadius:20,padding:16,border:"1.5px solid #eee",background:"#fff",cursor:"pointer"}}>
              <div style={{width:52,height:52,borderRadius:16,background:"linear-gradient(135deg,rgba(232,126,192,.15),rgba(155,143,212,.15))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>
                {AVATARS[i % AVATARS.length]}
              </div>
              <div style={{flex:1}}>
                <div style={{fontSize:15,fontWeight:900,color:TEXT}}>{p.prenom}</div>
                <div style={{fontSize:11,color:"#aaa",fontWeight:600,marginTop:2}}>{p.niveau} · {p.matiere || "Pas de matiere"}</div>
              </div>
              <div style={{fontSize:20,color:PINK2,fontWeight:700}}>›</div>
            </div>
          );
        })}
        <div style={{flex:1}} />
        <button className="rz-btn-ghost" onClick={props.onAdd}
          style={{borderStyle:"dashed",display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <span style={{fontSize:16}}>+</span> Ajouter un profil
        </button>
      </div>
    </div>
  );
}

// ── PRENOM ───────────────────────────────────────────────────────
function ScreenPrenom(props) {
  var [val, setVal] = useState("");
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <ProgWrap pct={25} label="1/4" onBack={props.onBack} />
      <div className="rz-body">
        <div style={{textAlign:"center",paddingTop:8}}>
          <div className="anim-bnc" style={{fontSize:52}}>👋</div>
          <div style={{fontSize:22,fontWeight:900,color:TEXT,marginTop:12,lineHeight:1.2}}>Comment tu t'appelles ?</div>
          <div style={{fontSize:13,color:TEXTSUB,fontWeight:600,marginTop:5}}>On personnalise ton experience</div>
        </div>
        <input className="rz-inp" type="text" placeholder="Ton prenom..." maxLength={24}
          value={val} onChange={function(e) { setVal(e.target.value); }} />
        {val.trim() !== "" && (
          <div className="anim-fd" style={{textAlign:"center",fontSize:13,fontWeight:700,padding:9,borderRadius:13,background:"rgba(201,110,176,.08)",color:PINK2,border:"1px solid rgba(201,110,176,.2)"}}>
            Salut, {val.trim()} !
          </div>
        )}
        <div style={{flex:1}} />
        <Btn disabled={val.trim() === ""} onClick={function() { props.onNext(val.trim()); }}>Continuer</Btn>
      </div>
    </div>
  );
}

// ── NIVEAU ───────────────────────────────────────────────────────
function ScreenNiveau(props) {
  var [sel, setSel] = useState("");
  function ChipGroup(cprops) {
    return (
      <div>
        <div style={{fontSize:9,fontWeight:800,color:TEXTMUTED,letterSpacing:".7px",marginBottom:8}}>{cprops.title}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:4}}>
          {cprops.items.map(function(n) {
            var active = sel === n;
            return (
              <button key={n} className="rz-chip"
                style={active ? {background:cprops.color,borderColor:cprops.color,color:"#fff"} : {}}
                onClick={function() { setSel(n); }}>
                {n}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <ProgWrap pct={50} label="2/4" onBack={props.onBack} />
      <div className="rz-body">
        <div style={{textAlign:"center",paddingTop:4}}>
          <div className="anim-bnc" style={{fontSize:50}}>🎓</div>
          <div style={{fontSize:21,fontWeight:900,color:TEXT,marginTop:12,lineHeight:1.2}}>Tu es en quelle annee, {props.prenom} ?</div>
          <div style={{fontSize:13,color:TEXTSUB,fontWeight:600,marginTop:5}}>Choisis ton niveau scolaire</div>
        </div>
        <ChipGroup title="PRIMAIRE" items={PRIM} color={PINK} />
        <ChipGroup title="SECONDAIRE" items={SEC} color={VIOLET} />
        {sel !== "" && (
          <div className="anim-fd" style={{display:"flex",alignItems:"center",gap:9,borderRadius:14,padding:"11px 14px",background:"rgba(155,143,212,.08)",border:"1px solid rgba(155,143,212,.2)"}}>
            <span style={{color:VIOLET}}>✓</span>
            <span style={{fontSize:12,fontWeight:700,color:VIOLET}}>{sel} selectionne</span>
          </div>
        )}
        <div style={{flex:1}} />
        <Btn disabled={sel === ""} onClick={function() { props.onNext(sel); }}>Continuer</Btn>
      </div>
    </div>
  );
}

// ── BIENVENUE ────────────────────────────────────────────────────
function ScreenBienvenue(props) {
  var confetti = [];
  var cols = [PINK, VIOLET, "#F5A0C8", "#8B9FE8", "#A78BFA", "#60A5FA", "#FBBF24"];
  for (var i = 0; i < 20; i++) {
    confetti.push({id:i, color:cols[i%cols.length], left:(4+(i*5)%90)+"%", top:(5+(i*11)%40)+"%", delay:(i*45)+"ms", w:(6+(i%3)*4)+"px", rot:(i*40)+"deg"});
  }
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",position:"relative"}}>
      <div style={{position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden"}}>
        {confetti.map(function(p) {
          return <div key={p.id} style={{position:"absolute",borderRadius:3,width:p.w,height:p.w,background:p.color,left:p.left,top:p.top,animationDelay:p.delay,transform:"rotate("+p.rot+")",animation:"rzCft .9s ease-out both"}} />;
        })}
      </div>
      <div className="rz-body" style={{alignItems:"center",paddingTop:0,position:"relative",zIndex:1}}>
        <div style={{marginTop:28,flexShrink:0,textAlign:"center",filter:"drop-shadow(0 4px 16px rgba(201,110,176,.25))"}}>
          <Logo size="lg" />
          <div style={{fontSize:30,fontWeight:900,color:TEXT,letterSpacing:-1.5,marginTop:2}}>Revizz</div>
        </div>
        <div style={{textAlign:"center",marginTop:14}}>
          <div style={{fontSize:24,fontWeight:900,color:TEXT,letterSpacing:"-.5px",lineHeight:1.2}}>
            Bienvenue,<br /><span style={{color:PINK2}}>{props.prenom} !</span>
          </div>
          <div style={{fontSize:13,color:TEXTSUB,fontWeight:600,marginTop:5}}>Profil cree avec succes</div>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,background:"rgba(155,143,212,.08)",borderRadius:999,padding:"6px 14px",marginTop:11,border:"1px solid rgba(155,143,212,.2)"}}>
            <span style={{fontSize:12}}>🎓</span>
            <span style={{fontSize:12,fontWeight:700,color:VIOLET}}>{props.niveau}</span>
          </div>
        </div>
        <div style={{width:"100%",display:"flex",flexDirection:"column",gap:9,marginTop:14}}>
          {[
            {ico:"⚡",bg:"rgba(232,126,192,.1)",txt:"Questions adaptees a ton niveau"},
            {ico:"🏆",bg:"rgba(155,143,212,.1)",txt:"Debloque du temps ecran en revisant"},
            {ico:"📈",bg:"rgba(155,143,212,.08)",txt:"Suis ta progression jour apres jour"},
          ].map(function(f, i) {
            return (
              <div key={i} className={"rz-feat anim-up"} style={{animationDelay:(i*80)+"ms"}}>
                <div style={{width:36,height:36,borderRadius:10,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{f.ico}</div>
                <div style={{fontSize:12,fontWeight:700,color:"#444"}}>{f.txt}</div>
              </div>
            );
          })}
        </div>
        <div style={{flex:1,minHeight:10}} />
        <Btn onClick={props.onNext}>{"C'est parti !"}</Btn>
      </div>
    </div>
  );
}

// ── MATIERE ──────────────────────────────────────────────────────
function ScreenMatiere(props) {
  var [sel, setSel] = useState("");
  var mat = getMat(sel);
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <ProgWrap pct={80} label="4/4" onBack={props.onBack} />
      <div className="rz-body">
        <div>
          <div style={{fontSize:21,fontWeight:900,color:TEXT,lineHeight:1.2}}>Quelle matiere veux-tu reviser, {props.prenom} ?</div>
          <div style={{fontSize:13,color:TEXTSUB,fontWeight:600,marginTop:4}}>Tu pourras en changer a tout moment</div>
        </div>
        <div className="rz-mgrid">
          {MATS.map(function(m) {
            var active = sel === m.l;
            return (
              <button key={m.l} className={active ? "rz-mc on" : "rz-mc"}
                style={active ? {borderColor:m.c,background:m.c+"15"} : {}}
                onClick={function() { setSel(m.l); }}>
                <div style={{fontSize:22,lineHeight:1}}>{m.e}</div>
                <div style={{fontSize:9,fontWeight:800,color:active?m.c:"#999",textAlign:"center",lineHeight:1.3}}>{m.l}</div>
                {active && <div style={{width:14,height:14,borderRadius:"50%",background:m.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,fontWeight:900,color:"#fff"}}>✓</div>}
              </button>
            );
          })}
        </div>
        {sel !== "" && (
          <div className="anim-fd" style={{textAlign:"center",fontSize:12,fontWeight:700,color:mat?mat.c:PINK2}}>
            {mat ? mat.e : ""} {sel} selectionne !
          </div>
        )}
        <div style={{flex:1}} />
        <Btn disabled={sel === ""} onClick={function() { props.onNext(sel); }}>Commencer a reviser</Btn>
      </div>
    </div>
  );
}

// ── HOME ─────────────────────────────────────────────────────────
function ScreenHome(props) {
  var mat = getMat(props.matiere);
  var col = mat ? mat.c : PINK2;
  var h = new Date().getHours();
  var gr = h < 12 ? "Bonjour" : h < 18 ? "Bon apres-midi" : "Bonsoir";
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div className="rz-ghdr" style={{padding:"44px 18px 24px"}}>
        <div className="rz-blob" style={{width:190,height:190,top:-60,right:-55}} />
        <div className="rz-blob" style={{width:100,height:100,bottom:-35,left:-20,opacity:.5}} />
        <div style={{position:"relative",zIndex:1}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:9}}>
              <Logo size="sm" />
              <div style={{fontSize:17,fontWeight:900,color:"#fff",letterSpacing:"-.5px"}}>Revizz</div>
            </div>
            <button onClick={props.onChangeProfil} style={{background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.25)",borderRadius:12,padding:"7px 12px",cursor:"pointer",color:"#fff",fontFamily:"inherit",fontSize:11,fontWeight:700}}>Changer</button>
          </div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.65)",fontWeight:600,marginBottom:2}}>{gr} 👋</div>
          <div style={{fontSize:28,fontWeight:900,color:"#fff",letterSpacing:-1,marginBottom:16}}>{props.prenom} !</div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap"}}>
            {[{i:"🎓",t:props.niveau},{i:mat?mat.e:"📚",t:props.matiere}].map(function(x) {
              return (
                <div key={x.t} style={{display:"flex",alignItems:"center",gap:4,background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.2)",borderRadius:999,padding:"4px 11px"}}>
                  <span style={{fontSize:11}}>{x.i}</span>
                  <span style={{fontSize:11,fontWeight:700,color:"#fff"}}>{x.t}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="rz-body">
        <div style={{fontSize:11,fontWeight:800,color:TEXTMUTED,letterSpacing:".5px"}}>PAR OU COMMENCER</div>
        <div onClick={props.onStartRevision} style={{display:"flex",alignItems:"center",gap:14,borderRadius:20,padding:16,cursor:"pointer",border:"1.5px solid rgba(201,110,176,.25)",background:"rgba(201,110,176,.04)"}}>
          <div style={{width:50,height:50,borderRadius:14,background:"linear-gradient(135deg,#E87EC0,#9B8FD4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>📸</div>
          <div style={{flex:1}}>
            <div style={{fontSize:14,fontWeight:900,color:TEXT}}>Demarrer une revision</div>
            <div style={{fontSize:11,color:TEXTSUB,fontWeight:600,marginTop:2}}>Photographie tes cours et quiz perso</div>
          </div>
          <div style={{fontSize:18,color:PINK2}}>›</div>
        </div>
        {[
          {ico:"📋",bg:"rgba(155,143,212,.1)",t:"Voir mes fiches",s:"Tes resumes de cours"},
          {ico:"🏆",bg:"rgba(232,126,192,.08)",t:"Mon tableau de bord",s:"Progression et recompenses"},
        ].map(function(a) {
          return (
            <div key={a.t} style={{display:"flex",alignItems:"center",gap:14,borderRadius:20,padding:16,border:"1.5px solid #eee",background:"#fff"}}>
              <div style={{width:50,height:50,borderRadius:14,background:a.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{a.ico}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:14,fontWeight:900,color:TEXT}}>{a.t}</div>
                <div style={{fontSize:11,color:TEXTSUB,fontWeight:600,marginTop:2}}>{a.s}</div>
              </div>
              <div style={{fontSize:18,color:"#ccc"}}>›</div>
            </div>
          );
        })}
        <button className="rz-btn-ghost" onClick={props.onChangeMatiere}>🔄 Changer de matiere</button>
      </div>
    </div>
  );
}

// ── SCAN ─────────────────────────────────────────────────────────
function ScreenScan(props) {
  var [pages, setPages] = useState([]);
  var [err, setErr] = useState("");
  var inputRef = useRef(null);

  function addFiles(files) {
    var toAdd = Array.prototype.slice.call(files, 0, 50 - pages.length);
    if (toAdd.length === 0) return;
    var results = [];
    var done = 0;
    toAdd.forEach(function(f) {
      var r = new FileReader();
      r.onload = function(e) {
        results.push({d: e.target.result, n: f.name});
        done++;
        if (done === toAdd.length) {
          setPages(function(prev) { return prev.concat(results).slice(0, 50); });
        }
      };
      r.readAsDataURL(f);
    });
  }

  var n = pages.length;
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div className="rz-ghdr" style={{padding:"44px 18px 20px"}}>
        <div className="rz-blob" style={{width:150,height:150,top:-40,right:-30}} />
        <button className="rz-hback" onClick={props.onBack}>&lt; Retour</button>
        <div style={{fontSize:9,color:"rgba(255,255,255,.65)",fontWeight:800,letterSpacing:".8px",marginBottom:4,position:"relative",zIndex:1}}>SCAN DU COURS</div>
        <div style={{fontSize:20,fontWeight:900,color:"#fff",lineHeight:1.2,position:"relative",zIndex:1}}>Photographie tes cours, {props.prenom} !</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.65)",fontWeight:600,marginTop:3,position:"relative",zIndex:1}}>{props.matiere} - {props.niveau}</div>
      </div>
      <div className="rz-body">
        <input ref={inputRef} type="file" accept="image/*,.pdf,.doc,.docx"" multiple style={{display:"none"}}
          onChange={function(e) { addFiles(e.target.files); e.target.value = ""; }} />
        <div onClick={function() { inputRef.current && inputRef.current.click(); }}
          style={{border:"2px dashed rgba(201,110,176,.3)",borderRadius:20,padding:"28px 16px",display:"flex",flexDirection:"column",alignItems:"center",gap:9,cursor:"pointer",background:n>0?"rgba(201,110,176,.03)":"#fafafa"}}>
          <div style={{fontSize:36}}>{n > 0 ? "➕" : "📷"}</div>
          <div style={{fontSize:13,fontWeight:800,color:TEXT,textAlign:"center"}}>
            {n > 0 ? "Ajouter d'autres pages" : "Appuie pour ajouter tes photos"}
          </div>
          <div style={{fontSize:11,color:"#aaa",fontWeight:600}}>
            {n > 0 ? (n + "/50 pages") : "JPG, PNG - jusqu'a 50 pages"}
          </div>
        </div>
        {n > 0 && (
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <div style={{fontSize:9,fontWeight:800,color:TEXTMUTED,letterSpacing:".4px"}}>TES PAGES ({n})</div>
            <div style={{display:"flex",gap:7,overflowX:"auto",paddingBottom:3}}>
              {pages.map(function(p, i) {
                return (
                  <div key={i} style={{position:"relative",flexShrink:0}}>
                    <img className="rz-thumb" src={p.d} alt={"p"+(i+1)} />
                    <div style={{position:"absolute",bottom:2,left:2,fontSize:7,fontWeight:800,color:"#fff",background:"rgba(0,0,0,.55)",borderRadius:999,padding:"1px 4px"}}>{i+1}</div>
                    <button onClick={function(idx) { return function(e) { e.stopPropagation(); setPages(function(prev) { return prev.filter(function(_, j) { return j !== idx; }); }); }; }(i)}
                      style={{position:"absolute",top:-4,right:-4,width:15,height:15,borderRadius:"50%",background:"#f87171",border:"1.5px solid #fff",color:"#fff",fontSize:7,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontFamily:"inherit"}}>x</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {n === 0 && (
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            <div className="rz-tip"><span style={{fontSize:14}}>💡</span>Photos nettes et bien eclairees</div>
            <div className="rz-tip"><span style={{fontSize:14}}>📄</span>1 page par photo</div>
            <div className="rz-tip"><span style={{fontSize:14}}>🔢</span>Jusqu'a 50 pages</div>
          </div>
        )}
        {err !== "" && (
          <div style={{background:"#fff5f5",border:"1px solid #fca5a5",borderRadius:13,padding:11,fontSize:12,fontWeight:700,color:"#dc2626",textAlign:"center"}}>{err}</div>
        )}
        <div style={{flex:1}} />
        <Btn disabled={n === 0} onClick={function() { setErr(""); props.onAnalyse(pages); }}>
          Analyser {n} page{n > 1 ? "s" : ""} →
        </Btn>
      </div>
    </div>
  );
}

// ── ANALYSE ──────────────────────────────────────────────────────
function ScreenAnalyse(props) {
  var [si, setSi] = useState(0);

  useEffect(function() {
    var iv = setInterval(function() {
      setSi(function(i) { return Math.min(i + 1, ASTATS.length - 1); });
    }, 2000);

    fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: props.pages.map(function(p) {
            return {type:"image", source:{type:"base64", media_type:"image/jpeg", data:p.d.split(",")[1]}};
          }).concat([{
            type: "text",
            text: "Tu es un assistant pedagogique quebecois. Ces images sont des pages de cours (" + props.niveau + " - " + props.matiere + "). Genere UNIQUEMENT un JSON valide sans backticks : {\"titre\":\"Titre\",\"resume\":\"Resume 2-3 phrases\",\"points_cles\":[\"Point 1\",\"Point 2\",\"Point 3\",\"Point 4\",\"Point 5\"],\"questions\":[{\"question\":\"Question ?\",\"options\":[\"Bonne\",\"Mauvaise A\",\"Mauvaise B\",\"Mauvaise C\"],\"reponse\":0,\"explication\":\"Explication courte\"}]} Genere exactement 5 questions. Niveau " + props.niveau + "."
          }])
        }]
      })
    }).then(function(res) { return res.json(); }).then(function(data) {
      clearInterval(iv);
      var raw = "";
      var blocks = data.content || [];
      for (var i = 0; i < blocks.length; i++) {
        if (blocks[i].type === "text") { raw = blocks[i].text; break; }
      }
      var clean = raw.replace(/[\u0060]{3}json|[\u0060]{3}/g, "").trim();
      var parsed = JSON.parse(clean);
      if (!parsed.questions || parsed.questions.length === 0) throw new Error("bad");
      props.onDone(parsed);
    }).catch(function() {
      clearInterval(iv);
      props.onError();
    });

    return function() { clearInterval(iv); };
  }, []);

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"#fafafa"}}>
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:24,padding:"36px 24px"}}>
        <div style={{position:"relative",width:90,height:90,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:90,height:90,borderRadius:"50%",background:"rgba(201,110,176,.06)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Logo size="md" />
          </div>
          <div className="rz-sring" />
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:19,fontWeight:900,color:TEXT}}>Revizz analyse tes cours...</div>
          <div style={{fontSize:13,fontWeight:600,color:TEXTSUB,marginTop:7}}>{ASTATS[si]}</div>
        </div>
        <div style={{width:"100%",maxWidth:240}}>
          <div className="rz-pbar" style={{width:"100%"}}>
            <div style={{height:"100%",borderRadius:999,background:"linear-gradient(90deg,#E87EC0,#9B8FD4)",transition:"width 2s ease",width:(((si+1)/ASTATS.length)*100)+"%"}} />
          </div>
          <div style={{fontSize:10,color:TEXTMUTED,fontWeight:600,textAlign:"center",marginTop:6}}>{props.pages.length} page{props.pages.length > 1 ? "s" : ""} · {props.matiere}</div>
        </div>
      </div>
    </div>
  );
}

// ── FICHE ────────────────────────────────────────────────────────
function ScreenFiche(props) {
  var mat = getMat(props.matiere);
  var col = mat ? mat.c : PINK2;
  var c = props.contenu;
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div className="rz-ghdr" style={{padding:"44px 18px 20px"}}>
        <div className="rz-blob" style={{width:140,height:140,top:-40,right:-30}} />
        <button className="rz-hback" onClick={props.onBack}>&lt; Retour</button>
        <div style={{fontSize:9,color:"rgba(255,255,255,.65)",fontWeight:800,letterSpacing:".8px",marginBottom:4,position:"relative",zIndex:1}}>FICHE {mat ? mat.e : ""}</div>
        <div style={{fontSize:20,fontWeight:900,color:"#fff",lineHeight:1.2,position:"relative",zIndex:1}}>{c.titre}</div>
      </div>
      <div className="rz-body">
        <div className="anim-up" style={{background:col+"10",border:"1.5px solid "+col+"25",borderRadius:16,padding:14}}>
          <div style={{fontSize:9,fontWeight:800,color:col,letterSpacing:".7px",marginBottom:7}}>EN BREF</div>
          <div style={{fontSize:12,fontWeight:600,color:"#444",lineHeight:1.7}}>{c.resume}</div>
        </div>
        <div style={{fontSize:9,fontWeight:800,color:TEXTMUTED,letterSpacing:".7px"}}>POINTS CLES</div>
        {(c.points_cles || []).map(function(pt, i) {
          return (
            <div key={i} className="anim-up" style={{display:"flex",alignItems:"flex-start",gap:10,background:"#fff",border:"1.5px solid #eee",borderRadius:13,padding:12,animationDelay:(i*50+60)+"ms"}}>
              <div style={{width:22,height:22,borderRadius:7,background:col+"15",color:col,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:800,flexShrink:0}}>{i+1}</div>
              <div style={{fontSize:12,fontWeight:600,color:"#444",lineHeight:1.5,paddingTop:2}}>{pt}</div>
            </div>
          );
        })}
        <div style={{flex:1}} />
        <div style={{textAlign:"center",fontSize:11,color:"#aaa",fontWeight:600,marginBottom:8}}>{c.questions ? c.questions.length : 5} questions t'attendent !</div>
        <Btn onClick={props.onStartQuiz}>Tester mes connaissances →</Btn>
      </div>
    </div>
  );
}

// ── QUIZ ─────────────────────────────────────────────────────────
function ScreenQuiz(props) {
  var [idx, setIdx] = useState(0);
  var [score, setScore] = useState(0);
  var [sel, setSel] = useState(-1);
  var questions = props.contenu.questions || [];
  var q = questions[idx];
  var mat = getMat(props.matiere);
  var col = mat ? mat.c : PINK2;
  var tot = questions.length;

  function handleSelect(i) {
    if (sel !== -1) return;
    var ok = i === q.reponse;
    setSel(i);
    if (ok) setScore(function(s) { return s + 1; });
  }

  function handleNext() {
    var finalScore = sel === q.reponse ? score : score;
    if (idx === tot - 1) {
      props.onVictoire(sel === q.reponse ? score + 1 : score);
    } else {
      setIdx(function(i) { return i + 1; });
      setSel(-1);
    }
  }

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div className="rz-pw">
        <button onClick={props.onBack} style={{background:"none",border:"none",fontSize:18,cursor:"pointer",color:"#ccc",padding:"4px 6px"}}>&#8592;</button>
        <div className="rz-pbar">
          <div className="rz-pfill" style={{width:(Math.round((idx/tot)*100)+10)+"%",background:col}} />
        </div>
        <div style={{fontSize:12,fontWeight:800,color:col,minWidth:36,textAlign:"right"}}>{score} ✓</div>
      </div>
      <div style={{padding:"2px 18px 0",display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
        <span style={{fontSize:14}}>{mat ? mat.e : ""}</span>
        <span style={{fontSize:9,fontWeight:800,color:TEXTMUTED,letterSpacing:".3px"}}>{props.matiere}</span>
        <span style={{fontSize:10,fontWeight:700,color:TEXTMUTED,marginLeft:"auto"}}>{idx+1}/{tot}</span>
      </div>
      <div className="rz-body">
        <div key={idx} className="anim-up" style={{fontSize:16,fontWeight:800,color:TEXT,lineHeight:1.45,marginBottom:4}}>{q.question}</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {q.options.map(function(opt, i) {
            var cls = "rz-qopt";
            if (sel !== -1) {
              if (i === q.reponse) cls = "rz-qopt rv";
              else if (i === sel) cls = "rz-qopt ko";
            }
            return (
              <button key={i} className={cls} disabled={sel !== -1} onClick={function() { handleSelect(i); }}>
                <div className={"rz-bdg" + (sel !== -1 && i === q.reponse ? " ok" : sel === i && sel !== -1 && i !== q.reponse ? " ko" : "")}>
                  {sel !== -1 && i === q.reponse ? "✓" : sel === i && i !== q.reponse ? "✗" : String.fromCharCode(65+i)}
                </div>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        {sel !== -1 && q.explication && (
          <div className="anim-up" style={{borderRadius:14,padding:12,border:"1.5px solid "+(sel===q.reponse?"rgba(201,110,176,.25)":"rgba(251,191,36,.3)"),background:sel===q.reponse?"rgba(201,110,176,.06)":"rgba(251,191,36,.06)"}}>
            <div style={{fontSize:10,fontWeight:800,letterSpacing:".5px",marginBottom:5,color:sel===q.reponse?PINK2:"#d97706"}}>{sel===q.reponse?"BRAVO !":"EXPLICATION"}</div>
            <div style={{fontSize:12,fontWeight:600,color:"#555",lineHeight:1.6}}>{q.explication}</div>
          </div>
        )}
        {sel !== -1 && (
          <div style={{marginTop:"auto"}}>
            <Btn onClick={handleNext}>{idx===tot-1?"Voir mes resultats 🏆":"Question suivante →"}</Btn>
          </div>
        )}
      </div>
    </div>
  );
}

// ── VICTOIRE ─────────────────────────────────────────────────────
function ScreenVictoire(props) {
  var tot = props.total || 5;
  var sc = props.score || 0;
  var pct = Math.round((sc / tot) * 100);
  var good = pct >= 70;
  var stars = pct >= 90 ? 3 : pct >= 70 ? 2 : pct >= 40 ? 1 : 0;
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div className="rz-ghdr" style={{padding:"44px 20px 26px",textAlign:"center"}}>
        <div className="rz-blob" style={{width:160,height:160,top:-50,right:-50}} />
        <div style={{position:"relative",zIndex:1}}>
          <div className="anim-stpop" style={{fontSize:46}}>{good ? "🏆" : "💪"}</div>
          <div style={{fontSize:23,fontWeight:900,color:"#fff",letterSpacing:-1,marginTop:10}}>{good?"Excellent, ":"Continue, "}{props.prenom} !</div>
          <div style={{fontSize:12,color:"rgba(255,255,255,.7)",fontWeight:600,marginTop:5}}>{props.titre}</div>
          <div style={{display:"flex",justifyContent:"center",gap:5,marginTop:12}}>
            {[0,1,2].map(function(i) {
              return <div key={i} style={{fontSize:22,opacity:i<stars?1:.25,animation:i<stars?("rzStpop .4s cubic-bezier(.34,1.56,.64,1) "+(300+i*120)+"ms both"):"none"}}>⭐</div>;
            })}
          </div>
        </div>
      </div>
      <div className="rz-body">
        <div className="rz-card anim-fd" style={{animationDelay:".1s"}}>
          <div style={{fontSize:9,fontWeight:800,color:TEXTMUTED,letterSpacing:".7px",marginBottom:5}}>TON SCORE</div>
          <div style={{fontSize:48,fontWeight:900,letterSpacing:-2,background:"linear-gradient(135deg,#E87EC0,#9B8FD4)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>{sc}/{tot}</div>
          <div style={{fontSize:16,fontWeight:800,color:PINK2}}>{pct}%</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{e:"✅",l:"Bonnes reponses",v:sc,c:PINK2},{e:"❌",l:"A retravailler",v:tot-sc,c:"#f87171"}].map(function(x) {
            return (
              <div key={x.l} style={{background:"#fff",border:"1.5px solid #eee",borderRadius:14,padding:13,textAlign:"center"}}>
                <div style={{fontSize:18}}>{x.e}</div>
                <div style={{fontSize:22,fontWeight:900,color:x.c,marginTop:3}}>{x.v}</div>
                <div style={{fontSize:10,color:"#aaa",fontWeight:700,marginTop:2}}>{x.l}</div>
              </div>
            );
          })}
        </div>
        <div style={{flex:1}} />
        <Btn onClick={props.onRetry}>🔄 Recommencer le quiz</Btn>
        <button className="rz-btn-ghost" style={{marginTop:8}} onClick={props.onHome}>🏠 Retour a l'accueil</button>
      </div>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────────
export default function RevizzApp() {
  useEffect(function() { injectCSS(); }, []);

  var [profils, setProfils] = useState([]);
  var [loading, setLoading] = useState(true);
  var [step, setStep] = useState("splash");
  var [cur, setCur] = useState({prenom:"",niveau:"",matiere:"",id:null});
  var [pages, setPages] = useState([]);
  var [contenu, setContenu] = useState(null);
  var [score, setScore] = useState(0);
  var editingNew = useRef(false);

  // Charger les profils depuis Supabase au démarrage
  useEffect(function() {
    loadProfils().then(function(data) {
      setProfils(data || []);
      setLoading(false);
    });
  }, []);

  function handleSelect(i) {
    var p = profils[i];
    setCur({prenom:p.prenom, niveau:p.niveau, matiere:p.matiere, id:p.id});
    setStep("home");
  }

  function handleAdd() {
    editingNew.current = true;
    setCur({prenom:"", niveau:"", matiere:"", id:null});
    setStep("prenom");
  }

  function handlePrenom(p) {
    setCur(function(c) { return {prenom:p, niveau:c.niveau, matiere:c.matiere, id:c.id}; });
    setStep("niveau");
  }

  function handleNiveau(n) {
    setCur(function(c) { return {prenom:c.prenom, niveau:n, matiere:c.matiere, id:c.id}; });
    setStep("bienvenue");
  }

  function handleMatiere(m) {
    if (editingNew.current) {
      createProfil(cur.prenom, cur.niveau, m).then(function(newP) {
        if (newP) {
          setProfils(function(prev) { return prev.concat([newP]); });
          setCur({prenom:cur.prenom, niveau:cur.niveau, matiere:m, id:newP.id});
        }
        editingNew.current = false;
        setStep("home");
      });
    } else {
      if (cur.id) updateProfil(cur.id, m);
      setCur(function(c) { return {prenom:c.prenom, niveau:c.niveau, matiere:m, id:c.id}; });
      setProfils(function(prev) {
        return prev.map(function(p) {
          if (p.id === cur.id) return Object.assign({}, p, {matiere:m});
          return p;
        });
      });
      setStep("home");
    }
  }

  function handleVictoire(s) {
    setScore(s);
    if (cur.id && contenu) {
      saveSession(cur.id, cur.matiere, contenu.titre, s, contenu.questions ? contenu.questions.length : 5);
    }
    setStep("victoire");
  }

  if (loading) {
    return (
      <div className="rz-wrap" style={{alignItems:"center",justifyContent:"center",background:"linear-gradient(145deg,#1c2260,#0f1438)"}}>
        <Logo size="lg" />
        <div style={{fontSize:28,fontWeight:900,color:"#fff",letterSpacing:-1,marginTop:8}}>Revizz</div>
        <div style={{display:"flex",gap:6,marginTop:32}}>
          {[0,1,2].map(function(i) {
            return <div key={i} style={{width:6,height:6,borderRadius:"50%",background:i===1?"#9B8FD4":"#E87EC0",animation:"rzBnc .9s "+(i*200)+"ms ease-in-out infinite"}} />;
          })}
        </div>
      </div>
    );
  }

  var screens = {
    splash: (
      <ScreenSplash onDone={function() { setStep("profils"); }} />
    ),
    profils: (
      <ScreenProfils profils={profils} onSelect={handleSelect} onAdd={handleAdd} />
    ),
    prenom: (
      <ScreenPrenom onBack={function() { setStep("profils"); }} onNext={handlePrenom} />
    ),
    niveau: (
      <ScreenNiveau prenom={cur.prenom} onBack={function() { setStep("prenom"); }} onNext={handleNiveau} />
    ),
    bienvenue: (
      <ScreenBienvenue prenom={cur.prenom} niveau={cur.niveau} onNext={function() { setStep("matiere"); }} />
    ),
    matiere: (
      <ScreenMatiere prenom={cur.prenom} onBack={function() { setStep("bienvenue"); }} onNext={handleMatiere} />
    ),
    home: (
      <ScreenHome
        prenom={cur.prenom} niveau={cur.niveau} matiere={cur.matiere}
        onStartRevision={function() { setStep("scan"); }}
        onChangeProfil={function() { setStep("profils"); }}
        onChangeMatiere={function() { editingNew.current = false; setStep("matiere"); }}
      />
    ),
    scan: (
      <ScreenScan
        prenom={cur.prenom} matiere={cur.matiere} niveau={cur.niveau}
        onBack={function() { setStep("home"); }}
        onAnalyse={function(p) { setPages(p); setStep("analyse"); }}
      />
    ),
    analyse: (
      <ScreenAnalyse
        matiere={cur.matiere} niveau={cur.niveau} pages={pages}
        onDone={function(c) { setContenu(c); setStep("fiche"); }}
        onError={function() { setStep("scan"); }}
      />
    ),
    fiche: contenu && (
      <ScreenFiche
        matiere={cur.matiere} contenu={contenu}
        onBack={function() { setStep("scan"); }}
        onStartQuiz={function() { setStep("quiz"); }}
      />
    ),
    quiz: contenu && (
      <ScreenQuiz
        matiere={cur.matiere} contenu={contenu}
        onBack={function() { setStep("fiche"); }}
        onVictoire={handleVictoire}
      />
    ),
    victoire: contenu && (
      <ScreenVictoire
        prenom={cur.prenom} matiere={cur.matiere}
        score={score} total={contenu.questions ? contenu.questions.length : 5}
        titre={contenu.titre || ""}
        onHome={function() { setStep("home"); }}
        onRetry={function() { setScore(0); setStep("quiz"); }}
      />
    ),
  };

  return (
    <div className="rz-wrap">
      {screens[step] || screens["home"]}
    </div>
  );
}
