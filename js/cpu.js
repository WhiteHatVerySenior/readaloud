// ══════════════════════════════════════════════════
// CPU MODE
// ══════════════════════════════════════════════════
function startCPU(){
  sfxClick();mode="cpu";
  const s=shuffle(getActiveDeck()),half=Math.floor(s.length/2);
  p1Deck=s.slice(0,half);p2Deck=s.slice(half);
  phase="pick";turn="p1";selectedStat=null;roundHistory=[];streak=0;cpuSeenCards=new Set();
  p1FlipsLeft=2;p2FlipsLeft=2;p1FlippedThisRound=false;p2FlippedThisRound=false;
  renderCPU(true);
}

function cpuPickStat(card){
  if(difficulty==="easy")return getActiveStats()[Math.floor(Math.random()*getActiveStats().length)].key;
  if(difficulty==="medium"){
    let best=null,bs=-1;
    getActiveStats().forEach(s=>{const[mn,mx]=RANGES[s.key];const sc=(card[s.key]-mn)/(mx-mn);if(sc>bs){bs=sc;best=s.key;}});
    return best;
  }
  const cpuNames=new Set(p2Deck.map(c=>c.name));
  const possible=getActiveDeck().filter(s=>!cpuNames.has(s.name)&&!cpuSeenCards.has(s.name));
  if(!possible.length){
    let best=null,bs=-1;
    getActiveStats().forEach(s=>{const[mn,mx]=RANGES[s.key];const sc=(card[s.key]-mn)/(mx-mn);if(sc>bs){bs=sc;best=s.key;}});
    return best;
  }
  let bestStat=null,bestW=-1,bestM=-Infinity;
  getActiveStats().forEach(s=>{
    let w=0,tot=0;
    possible.forEach(pc=>{const m=card[s.key]-pc[s.key];if(m>0)w++;tot+=m;});
    const avg=tot/possible.length;
    if(w>bestW||(w===bestW&&avg>bestM)){bestW=w;bestM=avg;bestStat=s.key;}
  });
  return bestStat;
}

function renderCPU(animate){
  p1Card=p1Deck[0];p2Card=p2Deck[0];
  if(!p1Deck.length||!p2Deck.length){
    const won=p1Deck.length>p2Deck.length;
    won?sfxFanfare():sfxBoom();
    if(won){sessionWins++;confetti();}else sessionLosses++;
    render(`<div class="gameover"><div class="gameover-emoji">${won?"🎉":"😔"}</div><div class="gameover-title">${won?"You won!":"CPU wins!"}</div><div style="font-size:13px;color:var(--text2);margin-bottom:1.5rem">Session: ${sessionWins}W ${sessionLosses}L ${sessionDraws}D</div><button class="primary" onclick="startCPU()">Play again</button><button onclick="showMenu()" style="margin-top:8px;width:100%">Main menu</button></div>`);
    return;
  }
  const isCPUTurn=turn==="cpu",inR=phase==="result";
  const outcome=inR?getOutcome(p1Card[selectedStat],p2Card[selectedStat],turn,p1FlippedThisRound,p2FlippedThisRound):null;
  let mt="",mc="msg",bt="",bc="turn-badge";
  if(!inR){
    if(!isCPUTurn){mt="Pick a stat!";bt="Your turn";bc="turn-badge turn-you";}
    else{mt=`CPU picks: ${getActiveStats().find(s=>s.key===selectedStat)?.label||"…"}`;mc="msg wait";bt="CPU's turn";bc="turn-badge turn-them";}
  }else{
    if(outcome==="win"){mt="You win this round! 🎉";mc="msg win";}
    else if(outcome==="lose"){mt="CPU wins this round! 😔";mc="msg lose";}
    else{mt="It's a draw!";mc="msg draw";}
    bt=turn==="p1"?"Your pick":"CPU's pick";
    bc="turn-badge "+(turn==="p1"?"turn-you":"turn-them");
  }
  const streakBar=streak>=2?`<div class="streak">🔥 ${streak} round streak!</div>`:`<div class="streak"></div>`;
  const memBar=difficulty==="hard"?`<div class="memory-bar">🧮 CPU memory: ${cpuSeenCards.size} seen</div>`:"";
  const banner=inR?`<div class="flip-banner">${flipBannerText(p1FlippedThisRound,p2FlippedThisRound)}</div>`:"";
  const flipBtn=!inR?`<button class="${p1FlippedThisRound?"flip-on":""}" onclick="cpuToggleFlip()">🔄 Flip ${p1FlippedThisRound?"ON ✓":"OFF"} (${p1FlipsLeft} left)</button>`:"";
  el("app").innerHTML=`
    <div class="toolbar">
      <span class="pill active-cpu">vs CPU</span>
      <span class="pill ${difficulty==="easy"?"active-easy":""}" onclick="setDiff('easy')">Easy</span>
      <span class="pill ${difficulty==="medium"?"active-medium":""}" onclick="setDiff('medium')">Medium</span>
      <span class="pill ${difficulty==="hard"?"active-hard":""}" onclick="setDiff('hard')">Hard</span>
      <span class="pill ${includeUTs?"active-ut":""}" onclick="includeUTs=!includeUTs;startCPU()">🏛️ UTs</span>
      <span class="pill ${proMode?"active-pro":""}" onclick="proMode=!proMode;renderCPU(false)">⚡ Pro</span>
      <span style="flex:1"></span><button class="small" onclick="showMenu()">Menu</button>
    </div>
    <div class="score-bar"><div><div class="score-label">Your cards</div><div class="score-num">${p1Deck.length}</div></div><div style="font-size:11px;color:var(--text3)">${p1Deck.length+p2Deck.length} in play</div><div style="text-align:right"><div class="score-label">CPU cards</div><div class="score-num">${p2Deck.length}</div></div></div>
    ${streakBar}<div class="turn-wrap"><span class="${bc}">${bt}</span></div><div class="${mc}">${mt}</div>
    <div class="arena">
      ${buildCard(p1Card,{hdrCls:"you",activeStat:selectedStat,outcome,clickable:!inR&&!isCPUTurn,animate})}
      ${inR?buildCard(p2Card,{hdrCls:"cpu",activeStat:selectedStat,outcome:outcome==="win"?"lose":outcome==="lose"?"win":outcome,clickable:false,animate:false}):faceDown("cpu",difficulty==="easy"?"🎲 Random":difficulty==="medium"?"🧠 Smart":"🧮 Counting")}
    </div>
    <div class="controls">${inR?`<button onclick="cpuNext()">Next card ↗</button>`:""}${!inR&&isCPUTurn?`<button onclick="revealCPU()">Reveal CPU card ↗</button>`:""}${!inR?flipBtn:""}</div>
    ${banner}${memBar}${historyHTML()}`;
}

function setDiff(d){sfxClick();difficulty=d;startCPU();}

function cpuToggleFlip(){
  sfxClick();
  if(p1FlipsLeft<=0&&!p1FlippedThisRound)return;
  p1FlippedThisRound=!p1FlippedThisRound;
  if(p1FlippedThisRound)p1FlipsLeft--;else p1FlipsLeft++;
  renderCPU(false);
}

function cpuPickStatAction(key){
  sfxClick();selectedStat=key;phase="result";
  const outcome=getOutcome(p1Card[key],p2Card[key],"p1",p1FlippedThisRound,p2FlippedThisRound);
  addHistory(key,p1Card[key],p2Card[key],outcome);
  if(outcome==="win"){sfxWin();streak++;}
  else if(outcome==="lose"){sfxLose();streak=0;}
  else sfxDraw();
  renderCPU(false);
}

function revealCPU(){
  sfxClick();phase="result";
  const outcome=getOutcome(p1Card[selectedStat],p2Card[selectedStat],"cpu",p1FlippedThisRound,p2FlippedThisRound);
  addHistory(selectedStat,p1Card[selectedStat],p2Card[selectedStat],outcome);
  if(outcome==="win"){sfxWin();streak++;}
  else if(outcome==="lose"){sfxLose();streak=0;}
  else sfxDraw();
  renderCPU(false);
}

function cpuNext(){
  sfxClick();
  const outcome=getOutcome(p1Card[selectedStat],p2Card[selectedStat],turn,p1FlippedThisRound,p2FlippedThisRound);
  cpuSeenCards.add(p1Card.name);
  if(outcome==="win"){p1Deck.push(p1Deck.shift());p1Deck.push(p2Deck.shift());turn="p1";}
  else if(outcome==="lose"){p2Deck.push(p2Deck.shift());p2Deck.push(p1Deck.shift());turn="cpu";}
  else{p1Deck.push(p1Deck.shift());p2Deck.push(p2Deck.shift());}
  if(turn==="cpu")selectedStat=cpuPickStat(p2Deck[0]);
  else selectedStat=null;
  phase="pick";
  p1FlippedThisRound=false;p2FlippedThisRound=false;
  renderCPU(true);
}
