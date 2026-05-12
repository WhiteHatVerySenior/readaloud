// ══════════════════════════════════════════════════
// DATA — Indian States & Union Territories
// ══════════════════════════════════════════════════
const ALL_CARDS=[
  {name:"Rajasthan",emoji:"🏜️",population:81.03,area:342239,gdp:135,literacy:66.1,heritage:2,border:1170,forest:4.9,hdi:0.629,airports:7,districts:33,internet:35,fact:"Largest state by area. The Thar Desert covers 60% of it."},
  {name:"Punjab",emoji:"🌾",population:30.14,area:50362,gdp:88,literacy:75.8,heritage:0,border:553,forest:3.7,hdi:0.723,airports:3,districts:23,internet:51,fact:"Feeds the nation — produces 50% of India's wheat."},
  {name:"Haryana",emoji:"🏏",population:28.67,area:44212,gdp:105,literacy:75.6,heritage:0,border:0,forest:3.6,hdi:0.708,airports:2,districts:22,internet:46,fact:"Borders Delhi on 3 sides. Most urbanised state after Goa."},
  {name:"Himachal Pradesh",emoji:"❄️",population:7.45,area:55673,gdp:28,literacy:82.8,heritage:0,border:1177,forest:27.7,hdi:0.725,airports:3,districts:12,internet:56,fact:"Apple capital of India — produces 25% of the country's apples."},
  {name:"Uttarakhand",emoji:"🏔️",population:11.25,area:53483,gdp:42,literacy:78.8,heritage:1,border:1030,forest:45.4,hdi:0.684,airports:3,districts:13,internet:48,fact:"Source of the Ganges and Yamuna rivers."},
  {name:"Uttar Pradesh",emoji:"🕌",population:231.50,area:240928,gdp:215,literacy:73.0,heritage:3,border:4005,forest:6.1,hdi:0.596,airports:10,districts:75,internet:29,fact:"Most populated state. Home to the Taj Mahal."},
  {name:"Bihar",emoji:"🌾",population:128.50,area:94163,gdp:82,literacy:61.8,heritage:0,border:1751,forest:7.3,hdi:0.574,airports:4,districts:38,internet:24,fact:"Nalanda University — world's first residential university — was here."},
  {name:"Sikkim",emoji:"🏔️",population:0.66,area:7096,gdp:5,literacy:81.4,heritage:1,border:509,forest:47.3,hdi:0.716,airports:1,districts:6,internet:52,fact:"First fully organic state in India."},
  {name:"Arunachal Pradesh",emoji:"🏞️",population:1.57,area:83743,gdp:8,literacy:65.4,heritage:0,border:2848,forest:79.6,hdi:0.660,airports:2,districts:25,internet:38,fact:"Sun rises first in India here. Longest border with China."},
  {name:"Nagaland",emoji:"🦅",population:2.18,area:16579,gdp:7,literacy:79.5,heritage:0,border:215,forest:82.4,hdi:0.679,airports:1,districts:12,internet:42,fact:"16 major tribes, each with a distinct language."},
  {name:"Manipur",emoji:"🎨",population:3.09,area:22327,gdp:9,literacy:76.9,heritage:0,border:398,forest:77.7,hdi:0.696,airports:1,districts:16,internet:41,fact:"Birthplace of polo. Loktak Lake has floating islands."},
  {name:"Mizoram",emoji:"🌿",population:1.24,area:21081,gdp:7,literacy:91.3,heritage:0,border:722,forest:85.4,hdi:0.705,airports:1,districts:11,internet:52,fact:"Highest forest cover of any state at 85%."},
  {name:"Tripura",emoji:"🦋",population:3.99,area:10486,gdp:12,literacy:87.2,heritage:0,border:856,forest:60.9,hdi:0.658,airports:1,districts:8,internet:39,fact:"Second largest rubber producer in India."},
  {name:"Meghalaya",emoji:"🌧️",population:3.37,area:22429,gdp:10,literacy:74.4,heritage:0,border:884,forest:76.4,hdi:0.650,airports:1,districts:12,internet:38,fact:"Wettest place on Earth — Mawsynram gets 12,000mm rain/year."},
  {name:"Assam",emoji:"🍵",population:35.61,area:78438,gdp:48,literacy:72.2,heritage:2,border:1880,forest:35.3,hdi:0.614,airports:5,districts:35,internet:32,fact:"Produces 55% of India's tea. Home to the one-horned rhino."},
  {name:"West Bengal",emoji:"🐯",population:99.61,area:88752,gdp:175,literacy:76.3,heritage:1,border:2341,forest:19.0,hdi:0.641,airports:5,districts:23,internet:36,fact:"Only state sharing borders with 5 countries."},
  {name:"Jharkhand",emoji:"⛏️",population:38.59,area:79716,gdp:65,literacy:66.4,heritage:0,border:0,forest:29.6,hdi:0.599,airports:3,districts:24,internet:28,fact:"Mineral capital — holds 40% of India's mineral reserves."},
  {name:"Odisha",emoji:"🎭",population:46.36,area:155707,gdp:90,literacy:72.9,heritage:2,border:480,forest:33.1,hdi:0.606,airports:4,districts:30,internet:30,fact:"World's largest sea turtle nesting site at Gahirmatha."},
  {name:"Chhattisgarh",emoji:"🌲",population:29.44,area:135192,gdp:58,literacy:70.3,heritage:0,border:0,forest:44.2,hdi:0.613,airports:3,districts:33,internet:30,fact:"44% forest cover and 44 protected wildlife sanctuaries."},
  {name:"Madhya Pradesh",emoji:"🐆",population:85.36,area:308252,gdp:130,literacy:69.3,heritage:3,border:0,forest:25.1,hdi:0.606,airports:5,districts:55,internet:30,fact:"Tiger capital of India — most wild tigers of any state."},
  {name:"Gujarat",emoji:"🦁",population:63.87,area:196024,gdp:260,literacy:78.0,heritage:3,border:1665,forest:7.5,hdi:0.672,airports:9,districts:33,internet:46,fact:"Only place in the world where Asiatic lions survive in the wild."},
  {name:"Maharashtra",emoji:"🏙️",population:123.14,area:307713,gdp:435,literacy:82.9,heritage:5,border:720,forest:16.5,hdi:0.696,airports:18,districts:36,internet:49,fact:"Largest economy. Mumbai handles 40% of India's maritime trade."},
  {name:"Telangana",emoji:"💎",population:39.36,area:112077,gdp:145,literacy:72.8,heritage:1,border:0,forest:24.0,hdi:0.669,airports:3,districts:33,internet:42,fact:"India's youngest state, carved from Andhra Pradesh in 2014."},
  {name:"Andhra Pradesh",emoji:"🌊",population:53.90,area:162975,gdp:140,literacy:67.4,heritage:1,border:974,forest:23.0,hdi:0.649,airports:6,districts:26,internet:38,fact:"Second longest coastline in India at 974km."},
  {name:"Karnataka",emoji:"🌿",population:67.56,area:191791,gdp:270,literacy:75.4,heritage:3,border:320,forest:19.6,hdi:0.682,airports:8,districts:31,internet:43,fact:"Sandalwood, silk and software capital of India."},
  {name:"Goa",emoji:"🏖️",population:1.54,area:3702,gdp:20,literacy:88.7,heritage:1,border:105,forest:36.4,hdi:0.761,airports:1,districts:2,internet:61,fact:"Smallest state with highest per-capita income in India."},
  {name:"Kerala",emoji:"🌴",population:35.70,area:38852,gdp:105,literacy:94.0,heritage:1,border:590,forest:29.1,hdi:0.779,airports:5,districts:14,internet:54,fact:"100% literacy. Highest Human Development Index in India."},
  {name:"Tamil Nadu",emoji:"🛕",population:77.84,area:130058,gdp:280,literacy:80.1,heritage:6,border:1076,forest:20.3,hdi:0.709,airports:8,districts:38,internet:44,fact:"6 UNESCO sites — more than any other Indian state."},
  // Union Territories
  {name:"Delhi",emoji:"🏛️",isUT:true,population:32.06,area:1484,gdp:110,literacy:86.2,heritage:3,border:0,forest:14.4,hdi:0.746,airports:1,districts:11,internet:68,fact:"India's capital and most densely populated territory."},
  {name:"Jammu & Kashmir",emoji:"🏔️",isUT:true,population:13.60,area:42241,gdp:22,literacy:68.8,heritage:0,border:1225,forest:55.0,hdi:0.688,airports:3,districts:20,internet:34,fact:"India's northernmost UT, became a UT in 2019."},
  {name:"Ladakh",emoji:"🌄",isUT:true,population:0.27,area:59146,gdp:2,literacy:77.2,heritage:0,border:1597,forest:6.0,hdi:0.650,airports:2,districts:2,internet:20,fact:"World's highest motorable road — Khardung La at 5,359m."},
  {name:"Chandigarh",emoji:"🏙️",isUT:true,population:1.18,area:114,gdp:8,literacy:86.4,heritage:0,border:0,forest:14.1,hdi:0.775,airports:1,districts:1,internet:65,fact:"Only city planned by Le Corbusier in India."},
  {name:"Puducherry",emoji:"🌊",isUT:true,population:1.65,area:479,gdp:5,literacy:85.9,heritage:0,border:30,forest:4.6,hdi:0.738,airports:0,districts:4,internet:55,fact:"Former French colony with French architecture and laws."},
  {name:"Andaman & Nicobar",emoji:"🏝️",isUT:true,population:0.43,area:8249,gdp:3,literacy:86.3,heritage:0,border:0,forest:81.8,hdi:0.740,airports:3,districts:3,internet:35,fact:"581 islands, only 37 inhabited. Asia's finest coral reefs."},
  {name:"D&NH and D&D",emoji:"🏭",isUT:true,population:0.59,area:603,gdp:4,literacy:78.0,heritage:0,border:0,forest:39.9,hdi:0.705,airports:0,districts:3,internet:45,fact:"Most industrialised UT per sq km after 2020 merger."},
  {name:"Lakshadweep",emoji:"🌴",isUT:true,population:0.065,area:32,gdp:0.3,literacy:91.8,heritage:0,border:0,forest:90.0,hdi:0.739,airports:1,districts:1,internet:48,fact:"Smallest UT. 36 coral islands, only 10 inhabited."},
];

const CORE_STATS=[
  {key:"population",label:"Population (M)"},
  {key:"area",label:"Area (sq km)"},
  {key:"gdp",label:"GDP ($ billion)"},
  {key:"literacy",label:"Literacy (%)"},
  {key:"heritage",label:"UNESCO sites"},
  {key:"border",label:"Coast+Border (km)"},
  {key:"forest",label:"Forest cover (%)"}
];

const PRO_STATS=[
  {key:"hdi",label:"HDI score"},
  {key:"airports",label:"Airports"},
  {key:"districts",label:"Districts"},
  {key:"internet",label:"Internet (%)"}
];

const RANGES={population:[0.065,231.5],area:[32,342239],gdp:[0.3,435],literacy:[61.8,94.0],heritage:[0,6],border:[0,4005],forest:[3.6,90.0],hdi:[0.574,0.779],airports:[0,18],districts:[1,75],internet:[20,68]};

const getActiveStats=()=>proMode?[...CORE_STATS,...PRO_STATS]:CORE_STATS;
const getActiveDeck=()=>includeUTs?ALL_CARDS:ALL_CARDS.filter(c=>!c.isUT);

function fmt(k,v){
  if(v===undefined||v===null)return"—";
  if(k==="population")return v.toFixed(2)+"M";
  if(k==="area")return v.toLocaleString();
  if(k==="gdp")return"$"+v+"B";
  if(k==="literacy"||k==="forest"||k==="internet")return v.toFixed(1)+"%";
  if(k==="hdi")return v.toFixed(3);
  if(k==="border")return v===0?"None":v.toLocaleString()+" km";
  return v;
}
