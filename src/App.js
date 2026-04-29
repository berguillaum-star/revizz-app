import React, { useState, useEffect, useRef } from "react";

var SUPABASE_URL = "https://ulfrjsufztnvrmltaph.supabase.co";
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

// ── Contenu Histoire Sec 3 - Chapitre 3 ──────────────────────────
var CONTENU_HISTOIRE = [
  {id:"u1",titre:"U1 - Le regime militaire provisoire",resume:"Apres la capitulation de Montreal le 8 septembre 1760, les Britanniques controlent la Nouvelle-France jusqu'en 1763. C'est la periode du regime militaire, dirigee par Amherst, Murray, Burton et Gage.",points_cles:["8 septembre 1760 : capitulation de Montreal, fin de la resistance francaise","1760-1763 : periode du regime militaire britannique","Amherst = grand patron, Murray a Quebec, Burton a Trois-Rivieres, Gage a Montreal","Amherst confisque les armes et impose un serment d'allegeance","Nouveau principe : un accuse est innocent jusqu'a preuve du contraire","6000-7000 morts durant la guerre de la Conquete (10% de la population)"],questions:[{question:"Quand a eu lieu la capitulation de Montreal ?",options:["8 septembre 1760","13 septembre 1759","10 fevrier 1763","7 septembre 1760"],reponse:0,explication:"La capitulation de Montreal a eu lieu le 8 septembre 1760, forcant Levis et Vaudreuil a abandonner face aux 18 000 hommes anglais."},{question:"Qui etait le grand patron durant le regime militaire ?",options:["Jeffrey Amherst","James Murray","Guy Carleton","Burton"],reponse:0,explication:"Jeffrey Amherst etait le commandant en chef britannique. Murray etait a Quebec, Burton a Trois-Rivieres et Gage a Montreal."},{question:"Pourquoi Amherst confisque-t-il les armes ?",options:["Pour eviter une revolte","Pour les revendre","Pour equipier ses soldats","Pour punir les Canadiens"],reponse:0,explication:"Amherst confisque presque toutes les armes pour eviter une revolte de la population canadienne-francaise."},{question:"Quel nouveau principe juridique est introduit par les lois criminelles anglaises ?",options:["Un accuse est innocent jusqu'a preuve du contraire","Un accuse est coupable jusqu'a preuve du contraire","Tous les accuses sont emprisonnes","Les juges decidient seuls"],reponse:0,explication:"Le droit anglais introduit la presomption d'innocence : un accuse est innocent jusqu'a preuve du contraire."},{question:"Combien de morts estime-t-on durant la guerre de la Conquete ?",options:["6000-7000 morts (10% de la pop)","1000-2000 morts","15 000 morts","500 morts"],reponse:0,explication:"On estime entre 6000 et 7000 morts durant la guerre de la Conquete, soit environ 10% de la population."}]},
  {id:"u2",titre:"U2 - Fin de la guerre et situation autochtone",resume:"Le Traite de Paris de fevrier 1763 met fin a la guerre de 7 ans. La Nouvelle-France est cedee a la Grande-Bretagne. Les relations avec les nations autochtones se deteriorent, menant a la Revolte de Pontiac (1763-1766).",points_cles:["Fevrier 1763 : Traite de Paris met fin a la guerre de 7 ans","La Nouvelle-France est officiellement cedee a la Grande-Bretagne (sauf St-Pierre et Miquelon)","Amherst meprise les Autochtones et veut les soumettre par la force","1763 : Revolte de Pontiac - coalition autochtone attaque des forts britanniques","La replique anglaise est forte et cruelle","Le conflit se poursuit jusqu'en 1766"],questions:[{question:"Quand est signe le Traite de Paris ?",options:["Fevrier 1763","Septembre 1760","Juillet 1776","1766"],reponse:0,explication:"Le Traite de Paris est signe en fevrier 1763, officialisant la victoire britannique et la cession de la Nouvelle-France."},{question:"Quelle est l'attitude d'Amherst envers les peuples autochtones ?",options:["Il les meprise et veut les soumettre par la force","Il les respecte et collabore avec eux","Il les ignore","Il les considere comme des allies"],reponse:0,explication:"Amherst voit les peuples autochtones comme inferieurs et conquis. Il veut les soumettre par la force, voire les exterminer."},{question:"Qu'est-ce que la Revolte de Pontiac ?",options:["Une coalition autochtone qui attaque des forts britanniques","Une revolte des Canadiens francais","Une guerre entre Francais et Britanniques","Une rebellion des marchands"],reponse:0,explication:"Suite au Traite de Paris, les Autochtones craignent que les Britanniques s'emparent de leurs territoires. Pontiac mene une coalition contre les forts britanniques."},{question:"Jusqu'a quelle annee se poursuit la Revolte de Pontiac ?",options:["1766","1763","1770","1760"],reponse:0,explication:"Meme si une partie de la revolte se calme en 1764, le conflit se poursuit jusqu'en 1766."},{question:"Que conserve la France malgre la cession de la NF ?",options:["St-Pierre et Miquelon et droits de peche a Terre-Neuve","La ville de Quebec","Les Grands Lacs","La Gaspesie"],reponse:0,explication:"La France conserve St-Pierre et Miquelon ainsi que des droits de peche a Terre-Neuve, mais cede tout le reste."}]},
  {id:"u3",titre:"U3 - La Proclamation royale (1763)",resume:"En octobre 1763, la Proclamation royale devient la premiere constitution apres la Conquete. Elle vise a organiser le territoire, etablir les structures politiques et assimiler les Canadiens francais. La vallee du St-Laurent devient la Province de Quebec.",points_cles:["Octobre 1763 : Proclamation royale = 1ere constitution apres la Conquete","But : organiser le territoire et assimiler les Canadiens francais","Fin du regime militaire - la colonie se nomme maintenant Province de Quebec","Grand territoire reserve aux Autochtones pour calmer la Revolte de Pontiac","Gouverneur general James Murray detient tous les pouvoirs","Conseil de Quebec : 12 membres non elus, nommes par le gouverneur"],questions:[{question:"Quand est emise la Proclamation royale ?",options:["Octobre 1763","Fevrier 1763","1760","1774"],reponse:0,explication:"La Proclamation royale est emise en octobre 1763. C'est la premiere constitution de la colonie apres la Conquete."},{question:"Quel est le nouveau nom de la colonie ?",options:["Province de Quebec","Nouvelle-France","Canada","Bas-Canada"],reponse:0,explication:"La vallee du Saint-Laurent se nomme maintenant Province de Quebec suite a la Proclamation royale de 1763."},{question:"Quel est le but principal de la PR envers les Canadiens francais ?",options:["Les assimiler a la culture britannique","Les proteger","Leur donner plus de droits","Les expulser"],reponse:0,explication:"La Proclamation royale a un plan pour assimiler les Canadiens francais en imposant les lois, la langue et les institutions britanniques."},{question:"Combien de membres compte le Conseil de Quebec ?",options:["12 membres non elus","20 membres elus","5 membres","15 membres elus"],reponse:0,explication:"Le Conseil de Quebec compte 12 membres non elus, nommes par le gouverneur. Ce n'est pas une chambre democratique."},{question:"Pourquoi la PR accorde-t-elle un grand territoire aux Autochtones ?",options:["Pour calmer la Revolte de Pontiac","Pour les recompenser","Par generosite","Pour isoler les 13 colonies"],reponse:0,explication:"La GB n'a pas les moyens financiers pour continuer le combat. La PR accorde un territoire aux Autochtones pour calmer la Revolte de Pontiac, ce qui enrage les 13 colonies."}]},
  {id:"u4",titre:"U4 - Sort reserve aux Canadiens",resume:"Le roi Georges III donne des instructions pour assimiler les Canadiens francais : attirer des colons britanniques, imposer l'anglais, le Serment du test, les lois anglaises et affaiblir l'Eglise catholique.",points_cles:["Attirer des colons britanniques avec terres gratuites et libertes commerciales","Anglais comme langue officielle","Serment du test : renoncer au catholicisme pour acceder aux postes administratifs","Abolition du regime seigneurial, freins a l'Eglise catholique","Les elites envoient des petitions pour assouplir ces mesures","Murray et Carleton (1768) reconnaissent que la PR est trop severe"],questions:[{question:"Qu'est-ce que le Serment du test ?",options:["Renoncer au catholicisme pour acceder aux postes","Un serment militaire","Une promesse de payer les taxes","Un engagement commercial"],reponse:0,explication:"Le Serment du test exige la fidelite au roi ET de renoncer au catholicisme pour acceder aux postes administratifs. But : exclure les Canadiens francais du pouvoir."},{question:"Quelle langue est imposee comme officielle ?",options:["L'anglais","Le francais","Les deux langues","Le latin"],reponse:0,explication:"L'anglais est impose comme langue officielle dans le cadre de la politique d'assimilation des Canadiens francais."},{question:"Comment la GB tente-t-elle d'attirer des colons britanniques ?",options:["Terres gratuites et plus de libertes commerciales","Salaires eleves","Exemption de taxes","Postes gouvernementaux garantis"],reponse:0,explication:"Pour attirer des colons britanniques, la GB offre des terres gratuites aux immigrants britanniques et plus de libertes de commerce."},{question:"Quelle est la reaction des elites canadiennes-francaises ?",options:["Elles envoient des petitions pour assouplir les mesures","Elles acceptent toutes les mesures","Elles se revoltent militairement","Elles quittent la colonie"],reponse:0,explication:"Les elites (seigneurs, notaires, avocats) repondent par des petitions pour demander d'assouplir certaines mesures."},{question:"Qui remplace Murray comme gouverneur en 1768 ?",options:["Guy Carleton","Jeffrey Amherst","Pontiac","Georges III"],reponse:0,explication:"Guy Carleton remplace James Murray en 1768. Il finira par suivre la meme politique de compromis que Murray."}]},
  {id:"u5",titre:"U5 - Economie de la Province de Quebec",resume:"Le mercantilisme se poursuit mais avec plus de libertes commerciales. Le commerce des fourrures reste dominant (85% de l'economie). L'agriculture est la principale activite des Canadiens francais.",points_cles:["Mercantilisme : les colonies enrichissent la metropole","Plus de libertes commerciales attirent des marchands anglais","Commerce des fourrures = +85% de l'economie (les Montrealers)","Developpement de la peche, surtout en Gaspesie","Pour les Canadiens francais : agriculture (surtout le ble)"],questions:[{question:"Quel pourcentage represente le commerce des fourrures ?",options:["+85%","50%","25%","10%"],reponse:0,explication:"Le commerce des fourrures represente plus de 85% de l'economie. Les Montrealers y jouent un role dominant."},{question:"Quelle est la principale activite des Canadiens francais ?",options:["L'agriculture, surtout le ble","Le commerce des fourrures","La peche","Le commerce autochtone"],reponse:0,explication:"Pour les Canadiens francais, l'agriculture est l'activite economique principale, surtout la culture du ble."},{question:"Qu'est-ce que le mercantilisme ?",options:["Les colonies sont la pour enrichir la metropole","Libre echange entre toutes les nations","Commerce equitable","Echanges entre colonies seulement"],reponse:0,explication:"Le mercantilisme est un systeme economique ou les colonies existent pour enrichir la metropole, surtout pour rembourser les dettes de guerre."},{question:"Qui sont les Montrealers ?",options:["Des marchands dominant le commerce des fourrures","Des soldats","Des administrateurs britanniques","Des seigneurs canadiens-francais"],reponse:0,explication:"Les Montrealers sont des marchands qui dominent le commerce des fourrures dans la Province de Quebec."},{question:"Ou se developpe principalement la peche ?",options:["En Gaspesie","A Montreal","Dans les Grands Lacs","A Quebec"],reponse:0,explication:"La peche se developpe surtout en Gaspesie, constituant une activite economique importante."}]},
  {id:"u6",titre:"U6 - La societe coloniale",resume:"Peu d'immigrants britanniques s'installent. Les Canadiens francais representent 89% de la population en 1765. Le taux de natalite est tres fort (61 000 hab. en 1755, 98 000 en 1775). L'Eglise catholique s'affaiblit.",points_cles:["Peu de Britanniques s'installent (seulement administrateurs, soldats, marchands)","Taux de natalite tres fort : 61 000 hab. en 1755, 98 000 en 1775","85% de la population en milieu rural","Vers 1765 : Canadiens 89%, Autochtones 8%, Acadiens 2%, Britanniques 1%","L'Eglise catholique s'affaiblit (perte de financement)","1764 : premier journal : La Gazette de Quebec (en 2 langues)"],questions:[{question:"Quel pourcentage est canadien-francais vers 1765 ?",options:["89%","50%","75%","60%"],reponse:0,explication:"Vers 1765, les Canadiens representent 89% de la population, les Autochtones 8%, les Acadiens 2% et les Britanniques seulement 1%."},{question:"Quelle est la population en 1775 ?",options:["98 000 habitants","61 000 habitants","150 000 habitants","30 000 habitants"],reponse:0,explication:"Grace a un taux de natalite tres fort, la population passe de 61 000 en 1755 a 98 000 en 1775."},{question:"Quel est le premier journal publie au Quebec ?",options:["La Gazette de Quebec (1764)","Le Devoir","La Presse","Le Journal de Montreal"],reponse:0,explication:"La Gazette de Quebec parait en 1764, dans les deux langues. C'est le premier journal de la Province de Quebec."},{question:"Quel pourcentage vit en milieu rural ?",options:["85%","50%","30%","70%"],reponse:0,explication:"85% de la population vit en milieu rural. La societe de la Province de Quebec est tres largement agricole."},{question:"Pourquoi l'Eglise catholique s'affaiblit-elle ?",options:["Elle ne peut plus se financer (abolition de la dime)","Elle manque de fideles","Le gouverneur l'interdit","Les pretres quittent la colonie"],reponse:0,explication:"L'Eglise catholique s'affaiblit car la dime est abolie et l'immigration de nouveaux membres du clerge est interdite."}]},
  {id:"u7",titre:"U7 - Des concessions qui divisent",resume:"Murray equilibre l'application de la Proclamation royale et les besoins des Canadiens francais. Il opte pour des compromis, divisant les Britanniques en British Party (assimilation stricte) et French Party (compromis).",points_cles:["Murray adopte une politique de compromis","Nomination de l'eveque Jean-Olivier Briand (1766-1784)","British Party : application stricte de la PR, assimilation totale","French Party : compromis pour preserver l'ordre","Murray remplace par Carleton en 1768 qui adopte la meme politique"],questions:[{question:"Quelle approche Murray adopte-t-il ?",options:["Une politique de compromis","Application stricte de la PR","Il ignore la PR","Il donne tous les pouvoirs aux Canadiens"],reponse:0,explication:"Murray opte pour des compromis : conseillers favorables aux Canadiens, tolere les lois civiles francaises, permet certains postes sans serment du test."},{question:"Qui est nomme eveque de Quebec en 1766 ?",options:["Jean-Olivier Briand","James Murray","Guy Carleton","Jeffrey Amherst"],reponse:0,explication:"Jean-Olivier Briand est nomme eveque de Quebec en 1766, grace aux compromis de Murray. Il restera en poste jusqu'en 1784."},{question:"Que veut le British Party ?",options:["Application stricte de la PR et assimilation totale","Des compromis avec les Canadiens","L'independance de la colonie","Le retour des Francais"],reponse:0,explication:"Le British Party veut l'application stricte de la Proclamation royale : lois anglaises, assimilation, anglais obligatoire."},{question:"Pourquoi Murray est-il remplace par Carleton en 1768 ?",options:["A cause du mecontentement des marchands britanniques","Il est mort","Il retourne en Angleterre","Les Canadiens le chassent"],reponse:0,explication:"Suite au grand mecontentement des marchands britanniques qui veulent une application plus stricte de la PR, Murray est remplace par Carleton."},{question:"Quelle est la position du clerge catholique ?",options:["Il encourage la population a obeir aux Britanniques","Il resiste aux Britanniques","Il fuit en France","Il soutient le British Party"],reponse:0,explication:"Pour preserver son influence, le clerge se range du cote de Murray et encourage la population a etre obeissante envers les Britanniques."}]},
  {id:"u8",titre:"U8 - Agitation dans les 13 colonies",resume:"Les habitants des 13 colonies sont mecontents de la PR et des taxes imposees par la GB. Une serie d'evenements mene a la resistance : massacre de Boston (1770), Boston Tea Party (1773), et les Lois intolérables.",points_cles:["Les 13 colonies furieuses du territoire accorde aux Autochtones","GB impose des taxes : Sugar Act (1764), Stamp Act (1765), Townshend Act (1767), Tea Act (1773)","1770 : 5 personnes tuees par l'armee = massacre de Boston","1773 : Boston Tea Party - cargaisons de the jetees a la mer","GB repond avec les Coercive Acts (Lois intolérables)","L'Acte de Quebec est considere comme une 5e loi intolerable"],questions:[{question:"Qu'est-ce que le Boston Tea Party (1773) ?",options:["Des habitants balancent du the a la mer pour protester","Une fete organisee par les Britanniques","Un accord commercial","Une bataille navale"],reponse:0,explication:"En 1773, pour s'opposer au Tea Act, des habitants des 13 colonies balancent des cargaisons de the a la mer a Boston."},{question:"Qu'est-ce que le massacre de Boston (1770) ?",options:["5 personnes tuees par l'armee britannique","Une bataille entre Francais et Britanniques","Un massacre d'Autochtones","Une revolte d'esclaves"],reponse:0,explication:"En 1770, lors de manifestations contre les taxes britanniques, 5 personnes sont tuees par l'armee britannique."},{question:"Pourquoi la GB impose-t-elle des taxes aux 13 colonies ?",options:["Pour rembourser ses dettes de guerre","Pour financer l'eglise","Pour payer les Autochtones","Pour construire des routes"],reponse:0,explication:"Dans l'approche mercantiliste, la GB souhaite utiliser les colonies pour rembourser ses enormes dettes accumulees durant la guerre de 7 ans."},{question:"Quelle est la premiere taxe imposee aux 13 colonies ?",options:["Sugar Act (1764)","Stamp Act (1765)","Tea Act (1773)","Townshend Act (1767)"],reponse:0,explication:"Le Sugar Act de 1764 est la premiere d'une serie de taxes : Sugar Act (1764), Stamp Act (1765), Townshend Act (1767), Tea Act (1773)."},{question:"Comment les 13 colonies surnomment-elles les Coercive Acts ?",options:["Les Lois intolérables","Les Lois de Boston","Les Lois du the","Les Lois de guerre"],reponse:0,explication:"Les Coercive Acts imposes par la GB sont surnommes les Lois intolérables par les habitants des 13 colonies."}]},
  {id:"u9",titre:"U9 - L'Acte de Quebec (1774)",resume:"Carleton realise que l'assimilation est impossible. En 1774, l'Acte de Quebec remplace la Proclamation royale avec d'importantes concessions aux Canadiens francais : lois civiles francaises, abolition du serment du test, droit a la dime.",points_cles:["1774 : Acte de Quebec remplace la Proclamation royale","Territoire elargi : Grands Lacs, Labrador, Ohio ajoutes a la Province","Conseil legislatif de 20 membres","Serment du test aboli : remplace par un simple serment d'allegeance","Retablissement des lois civiles francaises","L'Eglise peut a nouveau collecter la dime"],questions:[{question:"Quelle constitution remplace la PR en 1774 ?",options:["L'Acte de Quebec","L'Acte constitutionnel","Le Traite de Paris","La Charte des droits"],reponse:0,explication:"L'Acte de Quebec de 1774 remplace la Proclamation royale de 1763. C'est une nouvelle constitution qui accorde d'importantes concessions aux Canadiens francais."},{question:"Qu'arrive-t-il au Serment du test ?",options:["Il est aboli et remplace par un serment d'allegeance","Il est renforce","Il reste identique","Il est optionnel"],reponse:0,explication:"L'Acte de Quebec abolit le Serment du test et le remplace par un simple serment d'allegeance. Les catholiques peuvent maintenant occuper des postes administratifs."},{question:"Combien de membres compte le nouveau Conseil legislatif ?",options:["20 membres","12 membres","50 membres elus","5 membres"],reponse:0,explication:"Un conseil legislatif de 20 membres remplace le Conseil de Quebec. Il peut debattre et proposer des lois."},{question:"Qui est satisfait de l'Acte de Quebec ?",options:["Les seigneurs, le clerge et les elites canadiennes","Les marchands britanniques","Les 13 colonies","Les loyalistes"],reponse:0,explication:"Les seigneurs, le clerge et les elites canadiennes sont satisfaits grace au retour des lois civiles francaises et de la dime."},{question:"Pourquoi l'Acte de Quebec est-il une 5e loi intolérable pour les 13 colonies ?",options:["Il agrandit le territoire de la Province aux depens des 13C","Il impose de nouvelles taxes","Il interdit le commerce","Il expulse les colons americains"],reponse:0,explication:"L'Acte de Quebec agrandit le territoire vers l'ouest (Grands Lacs, Ohio), territoires que les 13 colonies convoitaient."}]},
  {id:"u10",titre:"U10 - La Revolution americaine",resume:"En 1775, les Americains tentent de convaincre les Canadiens de rejoindre leur lutte. Ils attaquent la Province, prennent Montreal mais echouent a Quebec. Le 4 juillet 1776, les Etats-Unis declarent leur independance.",points_cles:["1775 : les Americains envoient une lettre pour convaincre les Canadiens","Carleton et l'eveque Briand maintiennent la population loyale","L'armee americaine prend Montreal en novembre 1775 (sans combat)","Siege de Quebec en decembre 1775 - renforts britanniques liberent la Province en juin 1776","4 juillet 1776 : Declaration d'independance des Etats-Unis","Traite de Paris de 1783 : independance americaine officialisee"],questions:[{question:"Que font les Americains en 1775 envers les Canadiens ?",options:["Ils leur envoient une lettre pour les convaincre de les rejoindre","Ils les attaquent directement","Ils leur offrent des terres","Ils commercent avec eux"],reponse:0,explication:"En 1775, les Americains envoient une lettre pour tenter de convaincre les Canadiens de se joindre a leur lutte contre la Grande-Bretagne."},{question:"Quand Montreal est-elle prise par les Americains ?",options:["Novembre 1775","Decembre 1775","Juin 1776","Juillet 1776"],reponse:0,explication:"L'armee americaine prend Montreal sans combattre en novembre 1775. Ils assiegent ensuite Quebec en decembre."},{question:"Quand est declaree l'independance des Etats-Unis ?",options:["4 juillet 1776","4 juillet 1783","1775","1763"],reponse:0,explication:"La Declaration d'independance des Etats-Unis est signee le 4 juillet 1776."},{question:"Qui libere la Province de Quebec du siege americain ?",options:["Les renforts britanniques (juin 1776)","Les Canadiens francais","Les Autochtones","Les loyalistes"],reponse:0,explication:"Des renforts britanniques arrivent et liberent la Province de Quebec en juin 1776, mettant fin au siege americain."},{question:"Quel traite officialise l'independance americaine ?",options:["Le Traite de Paris de 1783","Le Traite de Paris de 1763","L'Acte de Quebec","La Proclamation royale"],reponse:0,explication:"Le Traite de Paris de 1783 officialise l'independance des Etats-Unis et modifie les territoires en Amerique du Nord."}]},
  {id:"u11",titre:"U11 - Consequences du traite de Paris (1783)",resume:"Le traite de 1783 modifie l'Amerique du Nord. Les E-U obtiennent les territoires au sud des Grands Lacs. Des milliers de loyalistes fuient vers le Canada. La Compagnie du Nord-Ouest est creee.",points_cles:["Les E-U obtiennent les territoires au sud des Grands Lacs","Commerce des fourrures impacte : les voyageurs doivent aller plus au nord","Creation de la Compagnie du Nord-Ouest vs Compagnie de la Baie d'Hudson","30 000 loyalistes migrent vers la Nouvelle-Ecosse, 7 000 au Quebec","Les loyalistes s'installent en Gaspesie, Cantons-de-l'Est, ouest du St-Laurent","La GB aide les loyalistes : terres gratuites, nourriture, vetements"],questions:[{question:"Qui sont les loyalistes ?",options:["Des habitants des 13C restes fideles a la GB","Des soldats britanniques","Des Canadiens francais","Des Autochtones alliés des Britanniques"],reponse:0,explication:"Les loyalistes sont des habitants des 13 colonies qui sont restes fideles a la Grande-Bretagne contre la revolution americaine."},{question:"Combien de loyalistes migrent vers la Province de Quebec ?",options:["7 000","30 000","1 000","15 000"],reponse:0,explication:"7 000 loyalistes migrent vers la Province de Quebec. 30 000 autres vont vers la Nouvelle-Ecosse."},{question:"Quelle compagnie est creee pour le commerce des fourrures apres 1783 ?",options:["La Compagnie du Nord-Ouest","La Compagnie de la Baie d'Hudson","Les Montrealers Inc.","La Compagnie des Indes"],reponse:0,explication:"Les Montrealers s'unissent sous la banniere de la Compagnie du Nord-Ouest pour concurrencer la Compagnie de la Baie d'Hudson."},{question:"Pourquoi le commerce des fourrures est-il impacte par le traite de 1783 ?",options:["Le sud des Grands Lacs n'est plus accessible aux commercants de la Province","Les fourrures ne se vendent plus","Les Autochtones refusent de commercer","Les Britanniques interdisent le commerce"],reponse:0,explication:"Les E-U obtiennent les territoires au sud des Grands Lacs. Les commercants doivent se diriger vers le nord-ouest, ce qui coute tres cher."},{question:"Comment la GB aide-t-elle les loyalistes ?",options:["Terres gratuites, nourriture et vetements","Argent comptant","Postes gouvernementaux","Exemption de taxes permanente"],reponse:0,explication:"L'installation est penible pour les loyalistes, mais la GB les aide en fournissant des terres gratuites, de la nourriture et des vetements."}]},
  {id:"u12",titre:"U12 - Vers une 3e constitution",resume:"L'arrivee des loyalistes modifie la demographie (de 1% a 12% de Britanniques entre 1765 et 1790). Ils reclament des changements a l'Acte de Quebec. L'Acte constitutionnel de 1791 remplacera l'Acte de Quebec.",points_cles:["Les Britanniques passent de 1% (1765) a 12% (1790) de la population","Les loyalistes et le British Party exigent : lois anglaises, chambre d'assemblee, cantons","Certains loyalistes veulent separer la colonie en 2","Les seigneurs canadiens s'opposent a tout changement","Compromis : Habeas Corpus (1784), proces avec jury (1785), cantons","L'Acte constitutionnel de 1791 remplacera l'Acte de Quebec"],questions:[{question:"Quel pourcentage de Britanniques y a-t-il en 1790 ?",options:["12%","1%","50%","25%"],reponse:0,explication:"L'arrivee des loyalistes modifie la demographie : les habitants d'origine britannique passent de 1% en 1765 a 12% en 1790."},{question:"Que reclament les loyalistes et le British Party ?",options:["Lois civiles anglaises, chambre d'assemblee, cantons","Conservation de l'Acte de Quebec","Independance de la colonie","Retour au regime francais"],reponse:0,explication:"Les loyalistes rejoignent le British Party pour exiger le retour des lois civiles anglaises, une chambre d'assemblee et les cantons."},{question:"Quelle est la position des seigneurs canadiens-francais ?",options:["Ils s'opposent a tout changement car ils perdraient leurs privileges","Ils soutiennent tous les changements","Ils quittent la colonie","Ils s'allient au British Party"],reponse:0,explication:"Les seigneurs canadiens s'opposent a tout changement car cela leur ferait perdre leurs privileges (regime seigneurial, lois civiles francaises)."},{question:"Quelle constitution remplacera l'Acte de Quebec ?",options:["L'Acte constitutionnel de 1791","La Proclamation royale","Le Traite de Paris","L'Acte d'Union"],reponse:0,explication:"Le parlement britannique prepare l'Acte constitutionnel de 1791 pour remplacer l'Acte de Quebec de 1774."},{question:"Quelle reforme juridique est accordee en 1785 ?",options:["Les proces devant jury","La chambre d'assemblee","Le retour des lois francaises","L'Habeas Corpus"],reponse:0,explication:"En 1785, les proces devant jury sont accordes comme compromis. L'Habeas Corpus avait ete retabli en 1784."}]}
];

function isLily(prenom, niveau, matiere) {
  return matiere === "Histoire" && niveau.indexOf("Secondaire") !== -1;
}

// ── Ecran Fiches predefinies ──────────────────────────────────────
function ScreenFichesPredef(props) {
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column"}}>
      <div className="rz-ghdr" style={{padding:"44px 18px 20px"}}>
        <div className="rz-blob" style={{width:150,height:150,top:-40,right:-30}} />
        <button className="rz-hback" onClick={props.onBack}>&lt; Retour</button>
        <div style={{fontSize:9,color:"rgba(255,255,255,.65)",fontWeight:800,letterSpacing:".8px",marginBottom:4,position:"relative",zIndex:1}}>🏛 HISTOIRE - CHAPITRE 3</div>
        <div style={{fontSize:20,fontWeight:900,color:"#fff",lineHeight:1.2,position:"relative",zIndex:1}}>Conqete et changement d'empire</div>
        <div style={{fontSize:11,color:"rgba(255,255,255,.65)",fontWeight:600,marginTop:3,position:"relative",zIndex:1}}>1760 - 1791 · {CONTENU_HISTOIRE.length} unites</div>
      </div>
      <div className="rz-body">
        <div style={{fontSize:11,fontWeight:800,color:TEXTMUTED,letterSpacing:".5px"}}>CHOISIS UNE UNITE</div>
        {CONTENU_HISTOIRE.map(function(u) {
          return (
            <div key={u.id} onClick={function() { props.onSelect(u); }}
              style={{display:"flex",alignItems:"center",gap:14,borderRadius:18,padding:"14px 16px",cursor:"pointer",border:"1.5px solid #eee",background:"#fff"}}>
              <div style={{width:42,height:42,borderRadius:12,background:"linear-gradient(135deg,rgba(232,126,192,.15),rgba(155,143,212,.15))",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,color:PINK2,flexShrink:0,textAlign:"center",lineHeight:1.2}}>{u.id.toUpperCase()}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:13,fontWeight:900,color:TEXT}}>{u.titre}</div>
                <div style={{fontSize:11,color:TEXTSUB,fontWeight:600,marginTop:2}}>{u.questions.length} questions</div>
              </div>
              <div style={{fontSize:18,color:PINK2}}>›</div>
            </div>
          );
        })}
      </div>
    </div>
  );
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
        {isLily(props.prenom, props.niveau, props.matiere) && (
          <div onClick={props.onFichesPredef} style={{display:"flex",alignItems:"center",gap:14,borderRadius:20,padding:16,cursor:"pointer",border:"1.5px solid rgba(155,143,212,.35)",background:"rgba(155,143,212,.06)"}}>
            <div style={{width:50,height:50,borderRadius:14,background:"linear-gradient(135deg,#9B8FD4,#6B7FD4)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>🏛</div>
            <div style={{flex:1}}>
              <div style={{fontSize:14,fontWeight:900,color:TEXT}}>Fiches Histoire - Chap. 3</div>
              <div style={{fontSize:11,color:TEXTSUB,fontWeight:600,marginTop:2}}>12 unites pret-a-reviser !</div>
            </div>
            <div style={{fontSize:18,color:VIOLET}}>›</div>
          </div>
        )}
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
        <input ref={inputRef} type="file" accept="image/*" multiple style={{display:"none"}}
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

    fetch("https://ulfrjsufztnnvrmltaph.supabase.co/functions/v1/smart-worker", {
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
  var [selectedUnite, setSelectedUnite] = useState(null);
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
        onFichesPredef={function() { setStep("fichesPredef"); }}
      />
    ),
    fichesPredef: (
      <ScreenFichesPredef
        onBack={function() { setStep("home"); }}
        onSelect={function(u) { setSelectedUnite(u); setContenu(u); setStep("fiche"); }}
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
  );
}
