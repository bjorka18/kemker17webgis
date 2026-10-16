// Pengaturan ortofoto. Taruh tile XYZ langsung di folder ini: ortho/{zoom}/{x}/{y}.jpg
// Contoh: ortho/18/204321/129876.jpg
const ORTHO = {
  format: 'jpg',   // 'jpg' atau 'png' (samakan dengan format tile hasil ekspor)
  minZoom: 14,     // zoom terkecil yang ada di folder
  maxZoom: 20      // zoom terbesar yang ada di folder
};
