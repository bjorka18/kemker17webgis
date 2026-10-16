const $=s=>document.querySelector(s),H=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])),fc=v=>(v*100).toFixed(2),f3=v=>v.toFixed(3);
/* 1. Tutupan lahan dibuat dulu supaya batas Desa Sidodadi diketahui */
const lcL={};
TUTUPAN.forEach(d=>{const ln=d.tipe=='line',v0=ln?1:.55;
lcL[d.id]=L.geoJSON(d.geojson,{style:()=>ln?{color:d.warna,weight:2.5,opacity:1}:{color:d.warna,weight:1,fillColor:d.warna,fillOpacity:v0*.9,opacity:v0+.15},
onEachFeature:(f,y)=>y.on('click',()=>{LF={nama:d.nama,props:f.properties}})})});
const DESA=L.featureGroup(Object.values(lcL)).getBounds();
/* 2. Peta langsung zoom ke Desa Sidodadi */
const map=L.map('map',{zoomControl:false,attributionControl:false,maxZoom:22});
const zoomDesa=()=>{map.invalidateSize();map.fitBounds(DESA,{padding:[20,20]})};zoomDesa();
window.addEventListener('load',zoomDesa);
$('#zi').onclick=()=>map.zoomIn();$('#zo').onclick=()=>map.zoomOut();$('#zf').onclick=zoomDesa;
map.on('mousemove',e=>$('#cur').textContent=`Lat ${e.latlng.lat.toFixed(6)} · Lon ${e.latlng.lng.toFixed(6)} · Z ${map.getZoom()}`);
/* 3. Peta dasar */
const bases={grid:null,sat:L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',{maxZoom:22,maxNativeZoom:18,zIndex:1})};
let cur=bases.sat.addTo(map);
$('#base').onchange=e=>{if(cur)map.removeLayer(cur);cur=bases[e.target.value];if(cur)cur.addTo(map)};
/* 4. Ortofoto: tile XYZ dari folder ortho/ (lihat ortho/BACA-SAYA.txt) — hanya bisa diatur overlay-nya */
const OC=typeof ORTHO!=='undefined'?ORTHO:{ext:'jpg',minZoom:14,maxZoom:18};
const ortho=L.tileLayer(OC.url||`ortho/{z}/{x}/{y}.${OC.ext}`,{minZoom:OC.minZoom,maxZoom:22,maxNativeZoom:OC.maxZoom,zIndex:5}).addTo(map);
let ok=0,er=0;const upd=()=>$('#orthoMsg').textContent=ok?'✔ Ortofoto aktif':er>4?'⚠ Tile ortofoto belum ada di folder ortho/ (lihat ortho/BACA-SAYA.txt)':'Memuat ortofoto…';
ortho.on('tileload',()=>{ok++;upd()});ortho.on('tileerror',()=>{er++;upd()});
$('#orthoOp').oninput=e=>ortho.setOpacity(e.target.value/100);
$('#tO').onchange=e=>e.target.checked?ortho.addTo(map):map.removeLayer(ortho);
/* 5. Tutupan lahan: daftar + transparansi per layer */
const lcG=L.layerGroup(Object.values(lcL)).addTo(map);
const lcSet=(d,v)=>lcL[d.id].setStyle(d.tipe=='line'?{opacity:v}:{opacity:Math.min(1,v+.15),fillOpacity:v*.9});
TUTUPAN.forEach(d=>{const l=lcL[d.id],r=document.createElement('div');r.className='lcr';
r.innerHTML=`<label class="chk"><input type="checkbox" checked><span class="dot" style="background:${d.warna};${d.warna=='#ffffff'?'border:1px solid #888':''}"></span>${d.nama}<small>${d.info}</small></label><input type="range" min="0" max="100" value="${d.tipe=='line'?100:55}" title="Transparansi ${d.nama}">`;
r.querySelector('input[type=checkbox]').onchange=e=>{e.target.checked?lcG.addLayer(l):lcG.removeLayer(l);front()};
r.querySelector('input[type=range]').oninput=e=>lcSet(d,e.target.value/100);$('#lcList').appendChild(r)});
$('#lcOp').oninput=e=>{document.querySelectorAll('#lcList input[type=range]').forEach(s=>s.value=e.target.value);TUTUPAN.forEach(d=>lcSet(d,e.target.value/100))};
/* 6. Titik GCP / ICP + dashboard */
let ST=null,LF=null;const MK={},pts=DATA_SIDODADI,gG=L.layerGroup().addTo(map),gI=L.layerGroup().addTo(map);
const front=()=>{gG.eachLayer(l=>l.bringToFront());gI.eachLayer(l=>l.bringToFront())};
const lim=()=>.0003*(+$('#scale').value);
function draw(){gG.clearLayers();gI.clearLayers();const L1=lim();
pts.forEach(p=>{if(p.lat==null)return;const m=L.circleMarker([p.lat,p.lon],{radius:8,weight:3,color:p.t=='ICP'&&p.e>L1?'#ff5d6c':'#fff',fillColor:p.t=='GCP'?'#fbbf24':'#4ade80',fillOpacity:.95,bubblingMouseEvents:false});
const pm=$('#tL').checked;m.bindTooltip(pm?p.id:p.id+' · '+(p.e*100).toFixed(2)+' cm',{permanent:pm,direction:'top',offset:[0,-8]});m.bindPopup(()=>popup(p),{className:'pp',maxWidth:280});MK[p.id]=m;m.addTo(p.t=='GCP'?gG:gI)});
const set=pts.filter(p=>p.t=='ICP'),n=set.length;$('#sG').textContent=pts.length-n;$('#sI').textContent=n;
const b=$('#verdict');
if(!n){['sX','sY','sR','sC','sK'].forEach(i=>$('#'+i).textContent='–');$('#bars').textContent='–';b.className='verdict';b.textContent='Belum ada data titik uji.';return}
const rx=Math.sqrt(set.reduce((a,p)=>a+p.dx*p.dx,0)/n),ry=Math.sqrt(set.reduce((a,p)=>a+p.dy*p.dy,0)/n),r=Math.hypot(rx,ry),ce=1.5175*r;
$('#sX').textContent=fc(rx);$('#sY').textContent=fc(ry);$('#sR').textContent=fc(r);$('#sC').textContent=fc(ce);
const k=ce<=L1?1:ce<=1.5*L1?2:ce<=2*L1?3:0,cm=(ce*100).toFixed(1).replace('.',',');
ST={ce,k};$('#sK').textContent=k?'K'+k:'GAGAL';$('#sK').style.color=k?'':'var(--bad)';
b.className='verdict '+(k?'good':'bad');
b.innerHTML=k?`✅ <b>Peta memenuhi standar ketelitian Kelas ${k}.</b> Sekitar 90% titik uji meleset tidak lebih dari <b>${cm} cm</b> dari posisi aslinya di lapangan.`:`⚠️ <b>Peta belum memenuhi standar ketelitian.</b> Sekitar 90% titik uji meleset hingga <b>${cm} cm</b>, melebihi batas yang diizinkan untuk skala ini.`;
const mx=Math.max(...set.map(p=>p.e));
$('#bars').innerHTML=set.map(p=>`<div class="bar" data-id="${H(p.id)}" title="Klik untuk menuju titik"><span style="width:52px">${H(p.id)}</span><i class="${p.e>L1?'no':''}" style="width:${p.e/mx*100}px"></i>${(p.e*100).toFixed(2)} cm</div>`).join('')+`<div class="hint">batas Kelas 1 = ${(L1*100).toFixed(0)} cm · klik baris untuk menuju titik</div>`;document.querySelectorAll('#bars .bar').forEach(el=>el.onclick=()=>{const m=MK[el.dataset.id];if(m){map.setView(m.getLatLng(),Math.max(map.getZoom(),18));m.openPopup()}});
front()}
const utm=(la,lo)=>{const a=6378137,f=1/298.257223563,e2=f*(2-f),ep=e2/(1-e2),k0=.9996,p=la*Math.PI/180,A=(lo-105)*Math.PI/180*Math.cos(p),Nu=a/Math.sqrt(1-e2*Math.sin(p)**2),T=Math.tan(p)**2,C=ep*Math.cos(p)**2,
M=a*((1-e2/4-3*e2**2/64-5*e2**3/256)*p-(3*e2/8+3*e2**2/32+45*e2**3/1024)*Math.sin(2*p)+(15*e2**2/256+45*e2**3/1024)*Math.sin(4*p)-35*e2**3/3072*Math.sin(6*p));
return[500000+k0*Nu*(A+(1-T+C)*A**3/6+(5-18*T+T*T+72*C-58*ep)*A**5/120),1e7+k0*(M+Nu*Math.tan(p)*(A**2/2+(5-T+9*C+4*C*C)*A**4/24+(61-58*T+T*T+600*C-330*ep)*A**6/720))]};
const nf=(v,d)=>v.toLocaleString('id-ID',{minimumFractionDigits:d,maximumFractionDigits:d});
function popup(p){const L1=lim(),c=nf(p.e*100,2),[E,N]=utm(p.lat,p.lon),q=p.t=='GCP'?['good','Titik kontrol (patokan)']:p.e<=L1/2?['good','Sangat akurat']:p.e<=L1?['ok2','Akurat (memenuhi batas)']:['bad','Melebihi batas'],cp=`${p.id}: E ${E.toFixed(3)}, N ${N.toFixed(3)} (UTM 48S); Lat ${p.lat.toFixed(7)}, Lon ${p.lon.toFixed(7)}; galat ${(p.e*100).toFixed(2)} cm`;
return `<h3>${H(p.id)} <span class="tag">${p.t=='GCP'?'GCP':'ICP'}</span></h3><div class="big ${q[0]}">${c} cm<small>ketelitian (galat horizontal)</small></div><div class="pill ${q[0]}">${q[1]}</div>
<table><tr><td>Lintang</td><td>${p.lat.toFixed(7)}°</td></tr><tr><td>Bujur</td><td>${p.lon.toFixed(7)}°</td></tr><tr><td>E (UTM 48S)</td><td>${nf(E,3)} m</td></tr><tr><td>N (UTM 48S)</td><td>${nf(N,3)} m</td></tr>
<tr><td>dX (Timur–Barat)</td><td>${nf(p.dx*100,2)} cm</td></tr><tr><td>dY (Utara–Selatan)</td><td>${nf(p.dy*100,2)} cm</td></tr><tr><td>Batas Kelas 1</td><td>${nf(L1*100,1)} cm</td></tr></table>
<button class="b" onclick="navigator.clipboard&&navigator.clipboard.writeText(this.dataset.t).then(()=>{this.textContent='✔ Tersalin'})" data-t="${H(cp)}">Salin koordinat</button>`}
function showAttr(f){const r=Object.entries(f.properties||{}).map(([k,v])=>`<tr><td>${H(k)}</td><td>${H(v)}</td></tr>`).join('');$('#ib').innerHTML=`<h3>Atribut objek</h3><table>${r||'<tr><td>(kosong)</td></tr>'}</table>`;$('#info').style.display='block'}
$('#x').onclick=()=>$('#info').style.display='none';
$('#scale').onchange=draw;$('#tL').onchange=draw;
$('#tG').onchange=e=>e.target.checked?gG.addTo(map):map.removeLayer(gG);$('#tI').onchange=e=>e.target.checked?gI.addTo(map):map.removeLayer(gI);
draw();

/* 7. Klik di bagian peta mana pun -> koordinat + ketelitian */
function clickHtml(ll,ft){const [E,N]=utm(ll.lat,ll.lng);let bp=null,bd=1e12;
pts.forEach(p=>{if(p.t=='ICP'&&p.lat!=null){const d=map.distance(ll,[p.lat,p.lon]);if(d<bd){bd=d;bp=p}}});
const vals=ft?Object.values(ft.props||{}).filter(Boolean):[],out=!DESA.contains(ll),nI=pts.filter(p=>p.t=='ICP').length,
cp=`E ${E.toFixed(3)}, N ${N.toFixed(3)} (UTM 48S); Lat ${ll.lat.toFixed(7)}, Lon ${ll.lng.toFixed(7)}`;
return `<h3>Titik yang diklik</h3><table><tr><td>Lintang</td><td>${ll.lat.toFixed(7)}°</td></tr><tr><td>Bujur</td><td>${ll.lng.toFixed(7)}°</td></tr><tr><td>E (UTM 48S)</td><td>${nf(E,3)} m</td></tr><tr><td>N (UTM 48S)</td><td>${nf(N,3)} m</td></tr></table>
${ft?`<div class="nt">Tutupan lahan: <b>${H(ft.nama)}</b>${vals.length?' · '+H(vals.join(', ')):''}</div>`:''}
${ST?`<div class="pill ${ST.k?'good':'bad'}" style="margin-top:8px">Ketelitian peta: CE90 ${nf(ST.ce*100,2)} cm ${ST.k?'(Kelas '+ST.k+')':'(belum memenuhi)'}</div>`:''}
${bp?`<div class="nt">Titik uji terdekat: <b>${H(bp.id)}</b>, ${nf(bd,0)} m dari sini, galat ${nf(bp.e*100,2)} cm</div>`:''}
${out?'<div class="nt" style="color:var(--bad)">Di luar area desa yang diuji.</div>':''}
<div class="nt">Ketelitian dihitung dari ${nI} titik uji (ICP) dan berlaku untuk seluruh peta, bukan hasil ukur di titik ini.</div>
<button class="b" onclick="navigator.clipboard&&navigator.clipboard.writeText(this.dataset.t).then(()=>{this.textContent='✔ Tersalin'})" data-t="${H(cp)}">Salin koordinat</button>`}
map.on('click',e=>{const ft=LF;LF=null;L.popup({className:'pp',maxWidth:290}).setLatLng(e.latlng).setContent(clickHtml(e.latlng,ft)).openOn(map)});
