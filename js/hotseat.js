// ══════════════════════════════════════════════════
// HOTSEAT MODE
// ══════════════════════════════════════════════════
function startHotseat(){
  sfxClick();mode="hotseat";
  const s=shuffle(getActiveDeck()),half=Math.floor(s.length/2);
  p1Deck=s.slice(0,half);p2Deck=s.slice(half);
  phase="pick";turn="p1";selectedStat=null;roundHistory=[];streak=0;
  p1FlipsLeft=2;p2FlipsLeft=2;p1FlippedThisRound=false;p2FlippedThisRound=false;
  renderHS(true);
}

function renderHS(animate){
  p1Card=p1Deck[0];p2Card=p2Deck[0];
  if(!p1Deck.length||!p2Deck.length){
    const won=p1Deck.length>p2Deck.length;
    won?sfxFanfare():sfxBoom();
    if(won)confetti();
    render(`<div class="gameover"><div class="gameover-emoji">${won?"🎉":"😔"}</div><div class="gameover-title">${won?"Player 1 wins!":"Player 2 wins!"}</div><button class="primary" onclick="startHotseat()">Play again</button><button onclick="showMenu()" style="margin-top:8px;width:100%">Main menu</button></div>`);
    return;
  }
  if(phase==="handoff"){
    const isP1=handoffTo==="P1";
    render(`<div class="handoff"><div style="font-size:44px;margin-bottom:0.75rem">${isP1?"🔵":"🟢"}</div><p style="font-size:17px;font-weight:500;margin-bottom:0.4rem">Hand device to ${handoffTo}</p><p style="font-size:13px;color:var(--text2);margin-bottom:1.25rem">Don't peek!</p><button class="primary" onclick="hsReveal()">I'm ${handoffTo} — show my card</button></div>`);
    return;
  }
  const activeCard=turn==="p1"?p1Card:p2Card,oppCard=turn==="p1"?p2Card:p1Card;
  const activeHdr=turn==="p1"?"you":"p2",oppHdr=turn==="p1"?"p2":"you";
  const pLabel=turn==="p1"?"Player 1":"Player 2",inR=phase==="result";
  const myFlip=turn==="p1"?p1FlippedThisRound:p2FlippedThisRound;
  const myFlipsLeft=turn==="p1"?p1FlipsLeft:p2FlipsLeft;
  const pv=turn==="p1"?p1Card[selectedStat]:p2Card[selectedStat];
  const cv=turn==="p1"?p2Card[selectedStat]:p1Card[selectedStat];
  const outcome=inR?(pv>cv?"win":pv<cv?"lose":"draw"):null;
  let mt="",mc="msg",bt="",bc="turn-badge";
  if(!inR){mt=`${pLabel}: pick a stat!`;bt=`${pLabel}'s turn`;bc="turn-badge "+(turn==="p1"?"turn-you":"turn-p2");}
  else{
    if(outcome==="win"){mt=`${pLabel} wins! 🎉`;mc="msg win";}
    else if(outcome==="lose"){mt=`${turn==="p1"?"Player 2":"Player 1"} wins! 🎉`;mc="msg win";}
    else{mt="It's a draw!";mc="msg draw";}
    bt=`${pLabel}'s pick`;
    bc="turn-badge "+(turn==="p1"?"turn-you":"turn-p2");
  }
  const banner=inR?`<div class="flip-banner">${flipBannerText(p1FlippedThisRound,p2FlippedThisRound)}</div>`:"";
  const flipBtn=!inR?`<button class="${myFlip?"flip-on":""}" onclick="hsToggleFlip()">🔄 Flip ${myFlip?"ON ✓":"OFF"} (${myFlipsLeft} left)</button>`:"";
  el("app").innerHTML=`
    <div class="toolbar"><span class="pill active-hotseat">👥 Hotseat</span><span style="flex:1"></span><button class="small" onclick="showMenu()">Menu</button></div>
    <div class="score-bar"><div><div class="score-label">P1 cards</div><div class="score-num">${p1Deck.length}</div></div><div style="font-size:11px;color:var(--text3)">${p1Deck.length+p2Deck.length} in play</div><div style="text-align:right"><div class="score-label">P2 cards</div><div class="score-num">${p2Deck.length}</div></div></div>
    <div class="turn-wrap"><span class="${bc}">${bt}</span></div><div class="${mc}">${mt}</div>
    <div class="arena">${inR?buildCard(activeCard,{hdrCls:activeHdr,activeStat:selectedStat,outcome,clickable:false,animate})+buildCard(oppCard,{hdrCls:oppHdr,activeStat:selectedStat,outcome:outcome==="win"?"lose":outcome==="lose"?"win":outcome,clickable:false,animate:false}):buildCard(activeCard,{hdrCls:activeHdr,activeStat:null,outcome:null,clickable:true,animate})+faceDown(oppHdr,"Hidden")}</div>
    <div class="controls">${inR?`<button onclick="hsNext('${outcome}')">Next card ↗</button>`:""}${!inR?flipBtn:""}</div>${banner}`;
}

function hsPickStat(key){
  sfxClick();selectedStat=key;phase="result";
  const pv=turn==="p1"?p1Card[key]:p2Card[key];
  const cv=turn==="p1"?p2Card[key]:p1Card[key];
  const outcome=pv>cv?"win":pv<cv?"lose":"draw";
  if(outcome!=="draw")sfxWin();else sfxDraw();
  renderHS(false);
}

function hsToggleFlip(){
  sfxClick();
  if(turn==="p1"){
    if(p1FlipsLeft<=0&&!p1FlippedThisRound)return;
    p1FlippedThisRound=!p1FlippedThisRound;
    if(p1FlippedThisRound)p1FlipsLeft--;else p1FlipsLeft++;
  }else{
    if(p2FlipsLeft<=0&&!p2FlippedThisRound)return;
    p2FlippedThisRound=!p2FlippedThisRound;
    if(p2FlippedThisRound)p2FlipsLeft--;else p2FlipsLeft++;
  }
  renderHS(false);
}

function hsNext(outcome){
  sfxClick();
  const p1won=(turn==="p1"&&outcome==="win")||(turn==="p2"&&outcome==="lose");
  const p2won=(turn==="p2"&&outcome==="win")||(turn==="p1"&&outcome==="lose");
  if(p1won){p1Deck.push(p1Deck.shift());p1Deck.push(p2Deck.shift());turn="p1";}
  else if(p2won){p2Deck.push(p2Deck.shift());p2Deck.push(p1Deck.shift());turn="p2";}
  else{p1Deck.push(p1Deck.shift());p2Deck.push(p2Deck.shift());}
  phase="pick";selectedStat=null;
  p1FlippedThisRound=false;p2FlippedThisRound=false;
  if(outcome!=="draw"){handoffTo=turn==="p1"?"P1":"P2";phase="handoff";}
  renderHS(false);
}

function hsReveal(){sfxClick();phase="pick";renderHS(true);}
