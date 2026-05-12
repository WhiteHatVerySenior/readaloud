// ══════════════════════════════════════════════════
// REACTIONS — embedded in game state, both players see it
// ══════════════════════════════════════════════════
const REACTIONS=["🤡","🍌"];

function rxStopPoll(){rxLastSeen=null;}
function rxStartPoll(){}

function rxShowOverlay(emoji){
  const d=document.createElement("div");
  d.className="rx-overlay";
  d.textContent=emoji;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(),2600);
}

// Write reaction into game state — game state poll on both devices picks it up
async function rxSend(emoji){
  if(rxCooldown||!cachedState)return;
  sfxClick();
  rxCooldown=true;rxPickerOpen=false;rxRender();
  rxShowOverlay(emoji);  // sender sees it immediately
  try{
    const st=JSON.parse(JSON.stringify(cachedState));
    st.reaction={emoji,ts:Date.now()};
    st.version=(st.version||0)+1;
    await fbSet(`rooms/${roomCode}`,st);
    lastVer=st.version;
    cachedState=st;
  }catch(e){console.error("rxSend:",e);}
  setTimeout(()=>{rxCooldown=false;rxRender();},3000);
}

function rxToggle(){rxPickerOpen=!rxPickerOpen;rxRender();}

function rxRender(){
  const w=el("rx-wrap");if(!w)return;
  if(rxCooldown){w.innerHTML=`<div class="react-bar"><span class="react-cd">😤</span></div>`;return;}
  if(!rxPickerOpen){w.innerHTML=`<div class="react-bar"><button class="react-btn" onclick="rxToggle()">😄 React</button></div>`;return;}
  w.innerHTML=`<div class="react-bar"><button class="react-btn" onclick="rxToggle()">✕</button></div>
    <div class="react-picker">${REACTIONS.map(e=>`<button class="react-opt" onclick="rxSend('${e}')">${e}</button>`).join("")}</div>`;
}

// Called from game state poll — opponent sees the emoji
function rxCheck(state){
  if(!state.reaction)return;
  const key=state.reaction.emoji+"_"+state.reaction.ts;
  if(key===rxLastSeen)return;
  rxLastSeen=key;
  rxShowOverlay(state.reaction.emoji);
}
