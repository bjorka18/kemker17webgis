// ✏️ EDIT DI SINI: data dosen pembimbing (foto: img/dosen.jpg)
(function(){
const DOSEN={nama:'Satrio Muhammad Alif, S.T., M.T., Ph.D',nim:'NIP 199507082019031005',peran:'Dosen Pembimbing Kemah Kerja',foto:'img/dosen.jpg',skill:['Geomatika','Pembimbing']};
const E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const m=DOSEN,d=document.createElement('div');d.className='flip';d.style.setProperty('--i',0);d.tabIndex=0;
const ini=m.nama.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
d.innerHTML=`<div class="tilt"><div class="in"><div class="fc"><img src="${E(m.foto)}" alt="${E(m.nama)}"><div class="cap"><h3>${E(m.nama)}</h3><div class="nim">${E(m.nim)}</div><div class="r">${E(m.peran)}</div></div><div class="glare"></div></div>
<div class="bc"><h3>${E(m.nama)}</h3><div class="r">${E(m.peran)}</div><p>${E(m.bio)}</p><div>${m.skill.map(s=>`<span class="tag">${E(s)}</span>`).join('')}</div><small>↺ klik untuk kembali</small></div></div></div>`;
d.querySelector('img').onerror=function(){this.outerHTML=`<div class="ini">${E(ini)}</div>`};
const t=d.querySelector('.tilt');
d.onmousemove=e=>{const r=d.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;t.style.setProperty('--ry',((px-.5)*16)+'deg');t.style.setProperty('--rx',((.5-py)*16)+'deg');d.style.setProperty('--gx',px*100+'%');d.style.setProperty('--gy',py*100+'%')};
d.onmouseleave=()=>{t.style.setProperty('--rx','0deg');t.style.setProperty('--ry','0deg')};
d.onclick=()=>d.classList.toggle('on');d.onkeydown=e=>{if(e.key=='Enter'||e.key==' '){e.preventDefault();d.click()}};
document.getElementById('dosen').appendChild(d);
})();
