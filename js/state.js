// ══════════════════════════════════════════════════
// SETTINGS
// ══════════════════════════════════════════════════
var includeUTs=false,proMode=false,onlineFlipsAllowed=2;

// ══════════════════════════════════════════════════
// GAME STATE
// ══════════════════════════════════════════════════
var mode="cpu",difficulty="easy";
var p1Deck=[],p2Deck=[],phase="",turn="",selectedStat=null,p1Card=null,p2Card=null,handoffTo="";
var roundHistory=[],streak=0,sessionWins=0,sessionLosses=0,sessionDraws=0;
var p1FlipsLeft=2,p2FlipsLeft=2,p1FlippedThisRound=false,p2FlippedThisRound=false;
var cpuSeenCards=new Set();

// Online
var myRole=null,roomCode=null,pollTimer=null,lastVer=-1,lastSK=null,cachedState=null;
var _fbOk=false;

// Reactions
var rxCooldown=false,rxPickerOpen=false,rxLastSeen=null;
