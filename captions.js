/* ─────────────────────────────────────────────────────────────
   ALTYAZILAR / CAPTIONS — düzenlenebilir.
   Kısa, tek fikir, 8. sınıf dili. start/end saniye cinsinden.
   note: öğretmen için önerilen seslendirme cümlesi.
   ───────────────────────────────────────────────────────────── */
(function (root) {
  const CAPTIONS = [
    { scene: 1, start: 4.4, end: 10.2, tr: 'Kenarlar ve açılar', en: 'Sides and angles',
      note: 'Bir ABC üçgeninin kenar uzunluklarını ve açı ölçülerini ölçelim. İç açıların toplamı 180 derece.' },
    { scene: 2, start: 10.8, end: 19.8, tr: 'Sıralayalım', en: 'Put them in order',
      note: 'Kenarları uzundan kısaya, açıları büyükten küçüğe sıralayalım. En uzun kenar BC, en büyük açı A: BC, A’nın karşısında.' },
    { scene: 2, start: 20.0, end: 27.8, tr: 'Karşılıklı', en: 'Opposite each other',
      note: 'En kısa kenar da en küçük açının karşısında. Büyük kenarın karşısında büyük açı var.' },
    { scene: 3, start: 28.8, end: 38.6, tr: 'Köşeyi kaydır', en: 'Move the vertex',
      note: 'A köşesini sağa sola kaydıralım; kenarlar ve açılar değişiyor, sıralamalar da değişiyor.' },
    { scene: 3, start: 38.8, end: 45.8, tr: 'Eşleşme bozulmuyor', en: 'The match holds',
      note: 'Ama en uzun kenar her zaman en büyük açının karşısında. İlişki her üçgende geçerli.' },
    { scene: 4, start: 46.8, end: 55.8, tr: 'AB = AC', en: 'AB = AC',
      note: 'A köşesi BC’nin ortasının üstüne geldi: AB ile AC eşit. B ve C açıları da eşit.' },
    { scene: 4, start: 56.0, end: 63.8, tr: 'Eşit kenar, eşit açı', en: 'Equal sides, equal angles',
      note: 'İkizkenar üçgende eşit kenarların karşısındaki taban açıları eşittir.' },
    { scene: 5, start: 64.8, end: 72.8, tr: 'Açılardan kenarlara', en: 'From angles to sides',
      note: 'Bir üçgenin açıları 80, 60 ve 40 derece olsun. En uzun kenar 80 derecelik açının karşısında.' },
    { scene: 5, start: 73.0, end: 79.8, tr: 'Ölçmeden sırala', en: 'Order without measuring',
      note: 'En kısa kenar 40 derecelik açının karşısında. Kenarları ölçmeden, yalnızca açılara bakarak sıraladık.' },
    { scene: 6, start: 80.6, end: 86.4, tr: 'Büyük kenar, büyük açı', en: 'Longest side, largest angle',
      note: 'Aklında kalsın: bir üçgende büyük kenarın karşısında büyük açı, küçük kenarın karşısında küçük açı bulunur.' },
    { scene: 6, start: 86.8, end: 91.0, tr: 'Eşit kenar ↔ eşit açı!', en: 'Equal sides ↔ equal angles!',
      note: 'Eşit kenarların karşısında eşit açılar!' },
  ];
  if (typeof module !== 'undefined' && module.exports) module.exports = CAPTIONS;
  else { root.LI = root.LI || {}; root.LI.CAPTIONS = CAPTIONS; }
})(typeof window !== 'undefined' ? window : globalThis);
