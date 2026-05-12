// ══════════════════════════════════════════════════
// FLIP / OUTCOME LOGIC
// ══════════════════════════════════════════════════
const isFlipActive=(p1f,p2f)=>p1f!==p2f;

function getOutcome(pv,cv,t,p1f,p2f){
  const fl=isFlipActive(p1f||false,p2f||false);
  if(t==="p1")return fl?(pv<cv?"win":pv>cv?"lose":"draw"):(pv>cv?"win":pv<cv?"lose":"draw");
  return fl?(cv<pv?"lose":cv>pv?"win":"draw"):(cv>pv?"lose":cv<pv?"win":"draw");
}

const flipBannerText=(p1f,p2f)=>(!p1f&&!p2f)?"":p1f&&p2f?"🔄🔄 Both flipped — cancelled out! Highest wins.":"🔄 Flip active — lowest stat wins!";

// ══════════════════════════════════════════════════
// CARD BUILDERS
// ══════════════════════════════════════════════════
const isProKey=k=>["hdi","airports","districts","internet"].includes(k);

function buildCard(card,opts){
  const{hdrCls,activeStat,outcome,clickable,animate}=opts;
  const rows=getActiveStats().map(s=>{
    let cls="stat-row";
    if(isProKey(s.key))cls+=" pro-stat";
    if(activeStat&&s.key===activeStat)cls+=outcome==="win"?" winner":outcome==="lose"?" loser":" selected";
    const badge=isProKey(s.key)?`<span class="pro-badge">PRO</span>`:"";
    return`<div class="${cls}"${clickable?` onclick="pickStat('${s.key}')"`:""}><span class="stat-name">${s.label}${badge}</span><span class="stat-value">${fmt(s.key,card[s.key])}</span></div>`;
  }).join("");
  const utBadge=card.isUT?`<span style="font-size:9px;background:rgba(212,83,126,0.3);color:#ED93B1;border-radius:4px;padding:1px 5px;margin-left:6px">UT</span>`:"";
  return`<div class="card${animate?" card-flip":""}"><div class="card-header ${hdrCls}"><p class="card-title">${card.emoji} ${card.name}${utBadge}</p><p class="card-fact">${card.fact}</p></div>${rows}</div>`;
}

function faceDown(hdrCls,label){
  return`<div class="card"><div class="card-header ${hdrCls}"><p class="card-title">🂠 ${label}</p></div><div class="facedown-body">${getActiveStats().map(()=>`<div class="facedown-row"></div>`).join("")}</div></div>`;
}

// ══════════════════════════════════════════════════
// HISTORY
// ══════════════════════════════════════════════════
function addHistory(stat,pv,cv,outcome){
  const s=getActiveStats().find(x=>x.key===stat);
  roundHistory.unshift({label:s?.label||stat,pv:fmt(stat,pv),cv:fmt(stat,cv),outcome});
  if(roundHistory.length>5)roundHistory.pop();
}

function historyHTML(){
  if(!roundHistory.length)return"";
  return`<div class="history-wrap"><div class="history-title">Last rounds</div>${roundHistory.map(r=>`<div class="history-row"><span>${r.label}</span><span>You ${r.pv} · CPU ${r.cv}</span><span class="h-${r.outcome}">${r.outcome==="win"?"✓ Win":r.outcome==="lose"?"✗ Lose":"= Draw"}</span></div>`).join("")}</div>`;
}
