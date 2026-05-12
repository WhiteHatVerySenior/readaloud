// ══════════════════════════════════════════════════
// ONLINE — Firebase REST
// ══════════════════════════════════════════════════
function stopPoll(){
  if(pollTimer){clearInterval(pollTimer);pollTimer=null;}
  cachedState=null;rxStopPoll();
}

function startPoll(){
  stopPoll();
  pollTimer=setInterval(async()=>{
    try{
      const st=await fbGet(`rooms/${roomCode}`);
      if(!st)return;
      st.p1Deck=toArr(st.p1Deck);st.p2Deck=toArr(st.p2Deck);
      if(st.version!==lastVer){
        lastVer=st.version;
        if(st.proMode!==undefined)proMode=st.proMode;
        if(st.includeUTs!==undefined)includeUTs=st.includeUTs;
        if(st.flipsAllowed!==undefined)onlineFlipsAllowed=st.flipsAllowed;
        rxCheck(st);
        renderOnline(st);
      }
    }catch(e){}
  },1500);
}

async function showOnlineLobby(){
  sfxClick();mode="online";
  try{await fbGet("ping");_fbOk=true;}catch(e){_fbOk=false;}
  renderOnlineLobby();
}

function renderOnlineLobby(){
  const flipDesc=onlineFlipsAllowed===0?"No flips — pure stat battle":onlineFlipsAllowed===1?"One flip — use wisely!":onlineFlipsAllowed===2?"Two flips — classic mode":onlineFlipsAllowed+" flips — chaotic!";
  render(`<div class="lobby">
    <p style="font-size:11px;color:var(--text3);margin-bottom:1rem"><span class="dot ${_fbOk?"dot-ok":"dot-err"}"></span>${_fbOk?"Firebase connected ✓":"Firebase unreachable"}</p>
    <h2 style="font-size:20px;font-weight:500;margin-bottom:0.25rem">Online Multiplayer</h2>
    <p style="font-size:13px;color:var(--text2);margin-bottom:1.5rem">Two devices, one game</p>
    <div class="lobby-section">
      <h3>Create a room</h3>
      <div style="margin-bottom:0.75rem">
        <p style="font-size:12px;color:var(--text2);margin-bottom:0.5rem">🔄 Flips per player</p>
        <div style="display:flex;gap:6px">${[0,1,2,3,4,5].map(n=>`<span class="pill ${onlineFlipsAllowed===n?"active-pro":""}" style="flex:1;text-align:center" onclick="onlineFlipsAllowed=${n};sfxClick();renderOnlineLobby()">${n}</span>`).join("")}</div>
        <p style="font-size:11px;color:var(--text3);margin-top:6px">${flipDesc}</p>
      </div>
      <div style="margin-bottom:0.75rem">
        <div style="display:flex;gap:6px;flex-wrap:wrap">
          <span class="pill ${includeUTs?"active-ut":""}" onclick="includeUTs=!includeUTs;sfxClick();renderOnlineLobby()">🏛️ UTs ${includeUTs?"ON":"OFF"}</span>
          <span class="pill ${proMode?"active-pro":""}" onclick="proMode=!proMode;sfxClick();renderOnlineLobby()">⚡ Pro Stats ${proMode?"ON":"OFF"}</span>
        </div>
      </div>
      <button class="primary" onclick="createOnlineRoom()">Create room ↗</button>
    </div>
    <div class="lobby-section">
      <h3>Join a room</h3>
      <input class="code-input" id="jc" maxlength="4" placeholder="ABCD" oninput="this.value=this.value.toUpperCase().replace(/[^A-Z]/g,'')" onkeydown="if(event.key==='Enter')joinOnlineRoom()"/>
      <button class="primary" onclick="joinOnlineRoom()">Join room ↗</button>
      <div class="err" id="je"></div>
    </div>
    <button onclick="showMenu()" style="width:100%;margin-top:0.5rem">Back</button>
  </div>`);
}

async function createOnlineRoom(){
  sfxClick();roomCode=makeCode();myRole="p1";
  const s=shuffle(getActiveDeck()),half=Math.floor(s.length/2);
  const st={
    p1Deck:s.slice(0,half).map(c=>c.name),
    p2Deck:s.slice(half).map(c=>c.name),
    turn:"p1",phase:"waiting",selectedStat:null,pickedBy:null,result:null,
    p1Flipped:false,p2Flipped:false,isGameOver:false,version:0,
    proMode,includeUTs,flipsAllowed:onlineFlipsAllowed,
    p1Flips:onlineFlipsAllowed,p2Flips:onlineFlipsAllowed
  };
  try{
    await fbSet(`rooms/${roomCode}`,st);
    render(`<div class="lobby"><h2 style="font-size:20px;font-weight:500;margin-bottom:0.25rem">Room created!</h2><p style="font-size:13px;color:var(--text2);margin-bottom:1.5rem">Share with your friend</p><div class="lobby-section"><div class="code-display">${roomCode}</div><p class="waiting"><span class="pulse">⏳</span> Waiting for Player 2…</p><div style="margin-top:0.75rem;font-size:12px;color:var(--text3);text-align:center">🔄 ${onlineFlipsAllowed} flip${onlineFlipsAllowed!==1?"s":""} · ${includeUTs?"🏛️ UTs ON":"🏛️ UTs OFF"} · ${proMode?"⚡ Pro ON":"⚡ Pro OFF"}</div></div><button onclick="cancelOnlineRoom()" style="width:100%;margin-top:0.5rem">Cancel</button></div>`);
    lastVer=0;startPoll();
  }catch(e){alert("Error: "+e.message);}
}

async function cancelOnlineRoom(){
  sfxClick();stopPoll();
  try{await fbDel(`rooms/${roomCode}`);}catch(e){}
  showOnlineLobby();
}

async function joinOnlineRoom(){
  sfxClick();
  const code=(el("jc")?.value||"").trim().toUpperCase();
  if(code.length!==4){el("je").textContent="Enter a 4-letter code";return;}
  try{
    let st=await fbGet(`rooms/${code}`);
    if(!st){el("je").textContent="Room not found";return;}
    if(st.phase!=="waiting"){el("je").textContent="Game already started";return;}
    st.p1Deck=toArr(st.p1Deck);st.p2Deck=toArr(st.p2Deck);
    roomCode=code;myRole="p2";
    if(st.proMode!==undefined)proMode=st.proMode;
    if(st.includeUTs!==undefined)includeUTs=st.includeUTs;
    if(st.flipsAllowed!==undefined)onlineFlipsAllowed=st.flipsAllowed;
    st.phase="pick";st.version=(st.version||0)+1;
    await fbSet(`rooms/${roomCode}`,st);
    lastVer=st.version;
    rxCooldown=false;rxPickerOpen=false;rxLastSeen=null;
    startPoll();rxStartPoll();
    renderOnline(st);
  }catch(e){el("je").textContent="Error: "+e.message;}
}

async function onlineToggleFlip(){
  sfxClick();
  if(!cachedState||cachedState.phase!=="pick")return;
  try{
    const st=JSON.parse(JSON.stringify(cachedState));
    const fKey=myRole==="p1"?"p1Flipped":"p2Flipped",lKey=myRole==="p1"?"p1Flips":"p2Flips";
    const on=st[fKey]||false;
    if(!on&&(st[lKey]||0)<=0)return;
    st[fKey]=!on;
    st[lKey]=on?(st[lKey]||0)+1:(st[lKey]||0)-1;
    st.version=(st.version||0)+1;
    await fbSet(`rooms/${roomCode}`,st);
    lastVer=st.version;renderOnline(st);
  }catch(e){console.error(e);}
}

async function onlinePickStat(key){
  sfxClick();
  if(!cachedState||cachedState.phase!=="pick"||cachedState.turn!==myRole)return;
  try{
    const st=JSON.parse(JSON.stringify(cachedState));
    const myD=myRole==="p1"?st.p1Deck:st.p2Deck,opD=myRole==="p1"?st.p2Deck:st.p1Deck;
    const mc=ALL_CARDS.find(s=>s.name===myD[0]),oc=ALL_CARDS.find(s=>s.name===opD[0]);
    if(!mc||!oc)return;
    const p1f=st.p1Flipped||false,p2f=st.p2Flipped||false,flipActive=isFlipActive(p1f,p2f);
    const mv=mc[key],ov=oc[key];
    let result;
    if(myRole==="p1")result=flipActive?(mv<ov?"win":mv>ov?"lose":"draw"):(mv>ov?"win":mv<ov?"lose":"draw");
    else result=flipActive?(ov<mv?"win":ov>mv?"lose":"draw"):(ov>mv?"win":ov<mv?"lose":"draw");
    const p1WinsRound=result==="win";
    const isGameOver=(p1WinsRound&&st.p2Deck.length===1)||(!p1WinsRound&&result!=="draw"&&st.p1Deck.length===1);
    st.selectedStat=key;st.result=result;st.pickedBy=myRole;st.phase="result";st.isGameOver=isGameOver;
    st.version=(st.version||0)+1;
    await fbSet(`rooms/${roomCode}`,st);
    lastVer=st.version;renderOnline(st);
  }catch(e){console.error("onlinePickStat:",e);}
}

async function onlineNextCard(){
  sfxClick();
  if(!cachedState||cachedState.phase!=="result")return;
  const p1w=cachedState.result==="win",p2w=cachedState.result==="lose";
  const winner=p1w?"p1":p2w?"p2":null;
  if(winner&&winner!==myRole)return;
  try{
    const st=JSON.parse(JSON.stringify(cachedState));
    if(p1w){st.p1Deck.push(st.p1Deck.shift());st.p1Deck.push(st.p2Deck.shift());st.turn="p1";}
    else if(p2w){st.p2Deck.push(st.p2Deck.shift());st.p2Deck.push(st.p1Deck.shift());st.turn="p2";}
    else{st.p1Deck.push(st.p1Deck.shift());st.p2Deck.push(st.p2Deck.shift());}
    st.phase="pick";st.selectedStat=null;st.result=null;st.pickedBy=null;
    st.p1Flipped=false;st.p2Flipped=false;st.isGameOver=false;
    st.version=(st.version||0)+1;
    await fbSet(`rooms/${roomCode}`,st);
    lastVer=st.version;renderOnline(st);
  }catch(e){console.error("onlineNextCard:",e);}
}

async function leaveOnline(){
  sfxClick();
  try{
    const st=await fbGet(`rooms/${roomCode}`);
    if(st){st.playerLeft=myRole;st.version=(st.version||0)+1;await fbSet(`rooms/${roomCode}`,st);}
  }catch(e){}
  stopPoll();showMenu();
}

function renderOnline(state){
  const app=el("app");if(!app||!myRole)return;
  if(state.phase==="waiting"&&myRole==="p1")return;
  state.p1Deck=toArr(state.p1Deck);state.p2Deck=toArr(state.p2Deck);
  cachedState=state;

  // Opponent left
  if(state.playerLeft&&state.playerLeft!==myRole){
    sfxLose();stopPoll();
    app.innerHTML=`<div class="gameover"><div class="gameover-emoji">🚪</div><div class="gameover-title">Opponent left</div><button class="primary" onclick="showOnlineLobby()">Play again</button><button onclick="showMenu()" style="margin-top:8px;width:100%">Main menu</button></div>`;
    return;
  }

  const myD=myRole==="p1"?state.p1Deck:state.p2Deck,opD=myRole==="p1"?state.p2Deck:state.p1Deck;
  if(!myD?.length||!opD?.length){
    const iWon=myD?.length>0;
    iWon?sfxFanfare():sfxBoom();
    stopPoll();
    if(iWon)confetti();
    app.innerHTML=`<div class="gameover"><div class="gameover-emoji">${iWon?"🎉":"😔"}</div><div class="gameover-title">${iWon?"You won!":"Opponent wins!"}</div><button class="primary" onclick="showOnlineLobby()">Play again</button><button onclick="showMenu()" style="margin-top:8px;width:100%">Main menu</button></div>`;
    return;
  }

  const mc=ALL_CARDS.find(s=>s.name===myD[0]),oc=ALL_CARDS.find(s=>s.name===opD[0]);
  const isMy=state.turn===myRole,inR=state.phase==="result",sel=state.selectedStat;
  let myOut=null;
  if(inR&&state.result){
    if(state.result==="draw")myOut="draw";
    else if(myRole==="p1")myOut=state.result;
    else myOut=state.result==="win"?"lose":"win";
  }
  const sk=`${state.version}_${state.phase}`;
  if(inR&&sk!==lastSK){
    lastSK=sk;
    if(state.isGameOver){
      if(myOut==="win"){sfxFanfare();confetti();}else sfxBoom();
    }else{
      if(myOut==="win"){sfxWin();confetti();}
      else if(myOut==="lose")sfxLose();
      else sfxDraw();
    }
  }
  let mt="",mc2="msg",bt="",bc="turn-badge";
  if(!inR){
    if(isMy){mt="Pick a stat!";bt="Your turn";bc="turn-badge turn-you";}
    else{mt="Waiting for opponent…";mc2="msg wait";bt="Opponent's turn";bc="turn-badge turn-them";}
  }else{
    if(myOut==="win"){mt="You win this round! 🎉";mc2="msg win";}
    else if(myOut==="lose"){mt="Opponent wins! 😔";mc2="msg lose";}
    else{mt="Draw!";mc2="msg draw";}
    bt=state.pickedBy===myRole?"Your pick":"Opponent's pick";
    bc="turn-badge "+(state.pickedBy===myRole?"turn-you":"turn-them");
  }
  const iAmWinner=myOut==="win"||myOut==="draw";
  let ctrlHTML="";
  if(inR){
    if(state.isGameOver){
      ctrlHTML=iAmWinner?`<div class="end-banner won"><div style="font-size:32px;margin-bottom:0.25rem">🎉</div><div style="font-size:16px;font-weight:500;color:#5A9E22">You won the game!</div><div style="font-size:12px;color:var(--text2);margin:0.5rem 0 0.75rem">You collected all the cards</div><button onclick="showOnlineLobby()" style="margin-right:6px">Play again</button><button onclick="showMenu()">Menu</button></div>`:`<div class="end-banner lost"><div style="font-size:32px;margin-bottom:0.25rem">😔</div><div style="font-size:16px;font-weight:500;color:#E24B4A">Opponent wins!</div><div style="font-size:12px;color:var(--text2);margin:0.5rem 0 0.75rem">Better luck next time</div><button onclick="showOnlineLobby()" style="margin-right:6px">Play again</button><button onclick="showMenu()">Menu</button></div>`;
    }else{
      ctrlHTML=iAmWinner?`<button onclick="onlineNextCard()">Next card ↗</button>`:`<div class="msg wait" style="margin-top:0.5rem">⏳ Waiting for opponent…</div>`;
    }
  }
  const myFlipKey=myRole==="p1"?"p1Flipped":"p2Flipped";
  const myFlipsLeft=myRole==="p1"?(state.p1Flips??onlineFlipsAllowed):(state.p2Flips??onlineFlipsAllowed);
  const myFlipOn=state[myFlipKey]||false;
  const flipBtn=!inR?`<button class="${myFlipOn?"flip-on":""}" onclick="onlineToggleFlip()">🔄 Flip ${myFlipOn?"ON ✓":"OFF"} (${myFlipsLeft} left)</button>`:"";
  const p1f=state.p1Flipped||false,p2f=state.p2Flipped||false;
  const banner=inR?`<div class="flip-banner">${flipBannerText(p1f,p2f)}</div>`:"";
  const oppOut=myOut==="win"?"lose":myOut==="lose"?"win":myOut;
  const strip=`<div class="settings-strip">🔄 ${state.flipsAllowed??2} flips${state.includeUTs?" · 🏛️ UTs":""}${state.proMode?" · ⚡ Pro":""}</div>`;
  app.innerHTML=`
    <div class="toolbar">
      <span class="pill active-online">🌐 Online</span>
      <span style="font-size:11px;color:var(--text3)">Room: <strong>${roomCode}</strong> · ${myRole==="p1"?"P1":"P2"}</span>
      <span style="flex:1"></span>
      <button class="small" onclick="leaveOnline()">Leave</button>
    </div>
    ${strip}
    <div class="score-bar"><div><div class="score-label">Your cards</div><div class="score-num">${myD.length}</div></div><div style="font-size:11px;color:var(--text3)">${state.p1Deck.length+state.p2Deck.length} in play</div><div style="text-align:right"><div class="score-label">Opponent</div><div class="score-num">${opD.length}</div></div></div>
    <div class="turn-wrap"><span class="${bc}">${bt}</span></div>
    <div class="${mc2}">${mt}</div>
    <div class="arena">
      ${buildCard(mc,{hdrCls:"you",activeStat:sel,outcome:myOut,clickable:isMy&&!inR,animate:false})}
      ${inR?buildCard(oc,{hdrCls:"them",activeStat:sel,outcome:oppOut,clickable:false,animate:false}):faceDown("them","Opponent")}
    </div>
    <div class="controls">${ctrlHTML}${!inR?flipBtn:""}</div>
    ${banner}
    <div id="rx-wrap"></div>`;
  rxRender();
}
