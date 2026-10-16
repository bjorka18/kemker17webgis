// ✏️ EDIT DI SINI: nama, NIM, peran, biografi, keahlian, dan nama file foto (taruh foto di folder img/)
const BIO='Tulis biografi singkat: asal, minat di bidang geomatika, dan tugas di proyek WebGIS ini.';
const TIM=[
 {nama:'Rifki Julian Saputra',nim:'123230001',peran:'Ketua',foto:'img/anggota1.jpg',skill:['GNSS','WebGIS']},
 {nama:'Aldi Andryos Ramadhan',nim:'123230087',peran:'Anggota',foto:'img/anggota2.jpg',skill:['GNSS','Survei']},
 {nama:'Radhita Fahri Arnanda',nim:'123230056',peran:'Anggota',foto:'img/anggota3.jpg',skill:['KKV']},
 {nama:'Fatiha Narraya',nim:'123230118',peran:'Anggota',foto:'img/anggota4.jpg',skill:['KKV']},
 {nama:'Nayla Afifah',nim:'123230046',peran:'Anggota',foto:'img/anggota5.jpg',skill:['SIG']}
];
const E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const box=document.getElementById('team');
TIM.forEach((m,i)=>{const d=document.createElement('div');d.className='flip';d.style.setProperty('--i',i);d.tabIndex=0;
 const ini=m.nama.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
 d.innerHTML=`<div class="tilt"><div class="in"><div class="fc"><img src="${E(m.foto)}" alt="${E(m.nama)}"><div class="cap"><h3>${E(m.nama)}</h3><div class="nim">${E(m.nim)}</div><div class="r">${E(m.peran)}</div></div><div class="glare"></div></div>
 <div class="bc"><h3>${E(m.nama)}</h3><div class="r">${E(m.peran)}</div><p>${E(m.bio)}</p><div>${(m.skill||[]).map(s=>`<span class="tag">${E(s)}</span>`).join('')}</div><small>↺ klik untuk kembali</small></div></div></div>`;
 d.querySelector('img').onerror=function(){this.outerHTML=`<div class="ini">${E(ini)}</div>`};
 const t=d.querySelector('.tilt');
 d.onmousemove=e=>{const r=d.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
  t.style.setProperty('--ry',((px-.5)*16)+'deg');t.style.setProperty('--rx',((.5-py)*16)+'deg');d.style.setProperty('--gx',px*100+'%');d.style.setProperty('--gy',py*100+'%')};
 d.onmouseleave=()=>{t.style.setProperty('--rx','0deg');t.style.setProperty('--ry','0deg')};
 d.onclick=()=>d.classList.toggle('on');d.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();d.click()}};
 box.appendChild(d)});
const io='IntersectionObserver' in window?new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add('show');io.unobserve(x.target)}}),{threshold:.15}):null;
document.querySelectorAll('.flip').forEach(c=>io?io.observe(c):c.classList.add('show'));
document.querySelector('[data-to]').dataset.to=TIM.length;
document.querySelectorAll('[data-to]').forEach(b=>{const to=+b.dataset.to,t0=performance.now();(function f(t){const p=Math.min((t-t0)/1500,1);b.textContent=Math.round(to*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(f)})(t0)});
