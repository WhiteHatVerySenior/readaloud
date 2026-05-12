// ══════════════════════════════════════════════════
// MAIN MENU
// ══════════════════════════════════════════════════
function showMenu(){
  stopPoll();
  myRole=null;roomCode=null;lastVer=-1;lastSK=null;cachedState=null;
  render(`<div style="padding:2rem 0;text-align:center">
    <div style="font-size:48px;margin-bottom:0.5rem">🇮🇳</div>
    <h1 style="font-size:24px;font-weight:500;margin-bottom:0.25rem">Indian States</h1>
    <p style="font-size:18px;color:var(--text2);margin-bottom:2rem">Top Trumps</p>
    <div style="display:flex;flex-direction:column;gap:10px;max-width:300px;margin:0 auto">
      <button class="primary" onclick="startCPU()">🤖 Play vs CPU</button>
      <button onclick="startHotseat()" style="width:100%">👥 Hotseat</button>
      <button onclick="showOnlineLobby()" style="width:100%">🌐 Online Multiplayer</button>
    </div>
    <div style="margin-top:2rem;display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
      <span class="pill ${includeUTs?"active-ut":""}" onclick="includeUTs=!includeUTs;sfxClick();showMenu()">🏛️ UTs ${includeUTs?"ON":"OFF"}</span>
      <span class="pill ${proMode?"active-pro":""}" onclick="proMode=!proMode;sfxClick();showMenu()">⚡ Pro Stats ${proMode?"ON":"OFF"}</span>
    </div>
    <div style="margin-top:1rem;font-size:12px;color:var(--text3)">Session: ${sessionWins}W ${sessionLosses}L ${sessionDraws}D</div>
    ${proMode?`<div style="margin-top:0.5rem;font-size:11px;color:var(--gold)">⚡ HDI · Airports · Districts · Internet %</div>`:""}
  </div>`);
}

// Stat-pick dispatcher — routes inline onclicks to the active mode
function pickStat(key){
  if(mode==="hotseat")hsPickStat(key);
  else if(mode==="cpu")cpuPickStatAction(key);
  else onlinePickStat(key);
}

// Boot
showMenu();
