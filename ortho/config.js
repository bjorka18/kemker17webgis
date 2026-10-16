// Pengaturan tile ortofoto.
// Cara 1 (bawaan): tile ada di folder ini -> ortho/{z}/{x}/{y}.jpg  (biarkan url kosong)
// Cara 2: tile ditaruh di hosting lain (misalnya Cloudflare R2) -> isi url, contoh:
//   url:'https://nama-bucket.r2.dev/ortho/{z}/{x}/{y}.jpg'
const ORTHO={ext:'jpg',minZoom:14,maxZoom:18,url:''};
