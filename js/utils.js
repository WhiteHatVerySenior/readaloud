// ══════════════════════════════════════════════════
// FIREBASE — plain REST, no SDK
// ══════════════════════════════════════════════════
const FB  = "https://trump-0805-default-rtdb.asia-southeast1.firebasedatabase.app";
const KEY = "AIzaSyAvng0CLs7bwUZBEGfhQhOZR4L44LW3E2g";

const fbGet = async p=>{const r=await fetch(`${FB}/${p}.json?auth=${KEY}`);if(!r.ok)throw new Error(r.status);return r.json();};
const fbSet = async(p,d)=>{const r=await fetch(`${FB}/${p}.json?auth=${KEY}`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(d)});if(!r.ok)throw new Error(r.status);return r.json();};
const fbDel = async p=>fetch(`${FB}/${p}.json?auth=${KEY}`,{method:"DELETE"});
const toArr = v=>{if(!v)return[];if(Array.isArray(v))return v;return Object.keys(v).sort((a,b)=>Number(a)-Number(b)).map(k=>v[k]);};

// ══════════════════════════════════════════════════
// AUDIO
// ══════════════════════════════════════════════════
let actx=null;
const gc=()=>{if(!actx)actx=new(window.AudioContext||window.webkitAudioContext)();return actx;};
const pt=(f,t,sv,ev,s,d)=>{try{const c=gc(),o=c.createOscillator(),g=c.createGain();o.connect(g);g.connect(c.destination);o.type=t;o.frequency.setValueAtTime(f,c.currentTime+s);g.gain.setValueAtTime(sv,c.currentTime+s);g.gain.exponentialRampToValueAtTime(Math.max(ev,0.001),c.currentTime+s+d);o.start(c.currentTime+s);o.stop(c.currentTime+s+d+0.02);}catch(e){}};
const sfxClick=()=>pt(800,'sine',0.15,0.001,0,0.06);
const sfxWin=()=>{[[523,0],[659,0.1],[784,0.2],[1047,0.32]].forEach(([f,t])=>pt(f,'triangle',0.22,0.001,t,0.25));};
const sfxLose=()=>{pt(300,'sawtooth',0.18,0.001,0,0.15);pt(220,'sawtooth',0.14,0.001,0.15,0.25);pt(150,'sine',0.12,0.001,0.35,0.3);};
const sfxDraw=()=>{pt(440,'sine',0.12,0.001,0,0.12);pt(440,'sine',0.10,0.001,0.15,0.12);};
const sfxFanfare=()=>{[[523,0],[587,0.08],[659,0.16],[698,0.24],[784,0.32],[880,0.42],[1047,0.52]].forEach(([f,t])=>pt(f,'triangle',0.2,0.001,t,0.22));[523,659,784].forEach(f=>pt(f,'triangle',0.18,0.001,0.78,0.5));};
const sfxBoom=()=>{[300,250,200,160].forEach((f,i)=>pt(f,'sawtooth',0.2,0.001,i*0.15,0.2));};

// ══════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]];}return b;}
function makeCode(){const c="ABCDEFGHJKLMNPQRSTUVWXYZ";return Array.from({length:4},()=>c[Math.floor(Math.random()*c.length)]).join("");}
const el=id=>document.getElementById(id);
const render=html=>{el("app").innerHTML=html;};

// ══════════════════════════════════════════════════
// CONFETTI
// ══════════════════════════════════════════════════
function confetti(){
  const cols=["#5A9E22","#185FA5","#EF9F27","#E24B4A","#0F6E56","#D4537E"];
  for(let i=0;i<70;i++){
    const p=document.createElement("div");
    p.className="confetti-piece";
    p.style.cssText=`left:${Math.random()*100}vw;background:${cols[Math.floor(Math.random()*cols.length)]};width:${6+Math.random()*8}px;height:${6+Math.random()*8}px;animation-duration:${1.5+Math.random()*2}s;animation-delay:${Math.random()*0.5}s;border-radius:${Math.random()>0.5?"50%":"2px"}`;
    document.body.appendChild(p);
    setTimeout(()=>p.remove(),3500);
  }
}
