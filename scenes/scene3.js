/* SAHNE 3 — KÖŞEYİ KAYDIR (28–46 s) */
(function (LI) {
  'use strict';
  const KD = LI.KD, F = () => LI.Film;
  function camera(t, env) { return LI.Camera.breathe(KD.cam(env, { zoom: 1 }), t, 0.4); }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 3, start: 28, end: 46, name: "Move the vertex", nameTr: "Köşeyi kaydır", concept: "It always holds", conceptTr: "Hep geçerli", render });
})(window.LI = window.LI || {});
