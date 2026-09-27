/* SAHNE 1 — ÜÇGEN (0–10 s)  Kenarlar ve açılar.
   The whole film's drawing lives in LI.world(t); each scene only sets the camera. */
(function (LI) {
  'use strict';
  const { seg, lerp, inOut } = LI.E;
  const KD = LI.KD, F = () => LI.Film, A = LI.Ang, Ink = LI.Ink;
  const END = (t) => 1 - seg(t, 90.4, 91.4);

  function win(t, a, b, fi = 0.4, fo = 0.4) { return seg(t, a, a + fi) * (1 - seg(t, b - fo, b)); }
  function exprs(ctx, t, P, list, sz) {
    const f = F();
    list.forEach(([a, b, items, hot]) => {
      const al = win(t, a, b); if (al <= 0) return;
      f.expr(ctx, typeof items === 'string' ? [items] : items, P.x, P.y, sz ?? P.s, { alpha: al, w: P.w, halo: true, color: hot ? A.amber : undefined });
    });
  }
  const at = (P, k, y) => ({ x: P.x, y: y ?? P.y[k], s: P.s, w: P.w });
  const amber = (a) => `rgba(${LI.AMBER_RGB},${a})`;
  const fr = (n, d, h) => F().fr(n, d, h);
  const neg = (s) => s.replace('-', '−');
  const label = (v) => (v < 0 ? neg(String(v)) : String(v));

  /* ---- boxes and equal objects: cabinet projection, x right, y back, z up ---- */
  const Pj = (O, c, x, y, z) => [O[0] + x * c + y * c * 0.5, O[1] - z * c - y * c * 0.5];
  function poly(ctx, P, a, fill, seed, w = 3) {
    ctx.beginPath(); P.forEach((q, i) => (i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]))); ctx.closePath();
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    fill.forEach((f) => { if (f) { ctx.fillStyle = f; ctx.fill(); } });
    Ink.path(ctx, P.concat([P[0]]), { w, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** a solid block x..x+dx, y..y+dy, z..z+dz */
  function block(ctx, O, c, x, y, z, dx, dy, dz, a, h, seed) {
    if (a <= 0) return;
    const P = (i, j, k) => Pj(O, c, x + i * dx, y + j * dy, z + k * dz), H = h > 0 ? amber(a * 0.6 * h) : null;
    poly(ctx, [P(0, 0, 1), P(1, 0, 1), P(1, 1, 1), P(0, 1, 1)], a, [amber(a * 0.2), H], seed, 2.5);
    poly(ctx, [P(1, 0, 0), P(1, 1, 0), P(1, 1, 1), P(1, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.14})`, H], seed + 1, 2.5);
    poly(ctx, [P(0, 0, 0), P(1, 0, 0), P(1, 0, 1), P(0, 0, 1)], a, [`rgba(${LI.INK_RGB},${a * 0.04})`, H], seed + 2, 2.5);
  }
  function ball(ctx, O, c, x, y, z, a, seed) {
    if (a <= 0) return; const C = Pj(O, c, x + 0.5, y + 0.5, z + 0.5), r = c * 0.47;
    ctx.beginPath(); ctx.arc(C[0], C[1], r, 0, 7);
    ctx.fillStyle = `rgba(${LI.PAPER_RGB},${a})`; ctx.fill();
    const g = ctx.createRadialGradient(C[0] - r * 0.35, C[1] - r * 0.35, r * 0.1, C[0], C[1], r);
    g.addColorStop(0, amber(a * 0.12)); g.addColorStop(1, amber(a * 0.45)); ctx.fillStyle = g; ctx.fill();
    const P = []; for (let i = 0; i <= 28; i++) P.push([C[0] + r * Math.cos(i / 28 * 6.2832), C[1] + r * Math.sin(i / 28 * 6.2832)]);
    Ink.path(ctx, P, { w: 2.5, alpha: a * 0.9, seed, taper: [0, 0] });
  }
  /** items [{x,y,z,dx,dy,dz}] in painter's order, each with a fill index i */
  function fillList(L, W, H, dx = 1) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x += dx) out.push({ x, y, z, dx, dy: 1, dz: 1 });
    out.forEach((q, i) => (q.i = i));
    return out.slice().sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  const shown = (t, t0, dt, n) => Math.max(0, Math.min(n, Math.floor((t - t0) / dt + 0.4)));
  /** an open glass box: back walls first, then the contents, then the front edges */
  function container(ctx, O, c, L, W, H, a, seed, draw) {
    if (a <= 0) return;
    const P = (x, y, z) => Pj(O, c, x, y, z), ink = `rgba(${LI.INK_RGB},${a * 0.05})`;
    poly(ctx, [P(0, W, 0), P(L, W, 0), P(L, W, H), P(0, W, H)], a * 0.8, [ink], seed, 2);
    poly(ctx, [P(0, 0, 0), P(0, W, 0), P(0, W, H), P(0, 0, H)], a * 0.8, [ink], seed + 1, 2);
    poly(ctx, [P(0, 0, 0), P(L, 0, 0), P(L, W, 0), P(0, W, 0)], a * 0.8, [ink], seed + 2, 2);
    if (draw) draw();
    [[[0, 0, 0], [L, 0, 0]], [[L, 0, 0], [L, 0, H]], [[L, 0, H], [0, 0, H]], [[0, 0, H], [0, 0, 0]], [[L, 0, 0], [L, W, 0]], [[L, W, 0], [L, W, H]], [[L, W, H], [L, 0, H]], [[0, W, H], [L, W, H]], [[0, 0, H], [0, W, H]]]
      .forEach(([p, q], i) => Ink.path(ctx, [P(...p), P(...q)], { w: 3, alpha: a * 0.85, seed: seed + 10 + i, taper: [0, 0] }));
  }
  function fillBox(ctx, O, c, L, W, H, t, t0, dt, a, seed, kind = 'cube', hot = 0) {
    const dx = kind === 'brick' ? 2 : 1, items = fillList(L, W, H, dx);
    container(ctx, O, c, L, W, H, a, seed, () => items.forEach((q) => {
      const k = seg(t, t0 + q.i * dt, t0 + q.i * dt + 0.35); if (k <= 0) return;
      const dz = (1 - inOut(k)) * (H + 1 - q.z);
      if (kind === 'ball') ball(ctx, O, c, q.x, q.y, q.z + dz, a * k, seed + 100 + q.i * 3);
      else block(ctx, O, c, q.x, q.y, q.z + dz, q.dx, 1, 1, a * k, hot, seed + 100 + q.i * 3);
    }));
    return items.length;
  }
  function tag(ctx, env, O, c, L, text, a, hot) {
    if (a <= 0) return; const s = KD.L(env).G.s;
    F().T(ctx, text, O[0] + L * c / 2, O[1] + s * 0.95, { size: s * 0.66, alpha: a, halo: true, color: hot ? A.amber : undefined });
  }
  /** cubes of an L × W × H prism; when(q) gives each cube's arrival time (Infinity = never) */
  function cubes(L, W, H) {
    const out = [];
    for (let z = 0; z < H; z++) for (let y = W - 1; y >= 0; y--) for (let x = 0; x < L; x++) out.push({ x, y, z });
    return out.sort((p, q) => q.y - p.y || p.x - q.x || p.z - q.z);
  }
  function fillT(ctx, O, c, B, t, a, when, hot, seed) {
    let n = 0;
    container(ctx, O, c, B[0], B[1], B[2], a, seed, () => cubes(...B).forEach((q, i) => {
      const t0 = when(q); if (!(t >= t0)) return; n++;
      const k = seg(t, t0, t0 + 0.3);
      block(ctx, O, c, q.x, q.y, q.z + (1 - inOut(k)) * 1.2, 1, 1, 1, a * k, hot ? hot(q) : 0, seed + 100 + i * 3);
    }));
    return n;
  }
  function edges(ctx, env, O, c, B, a, labels) {
    if (a <= 0) return; const s = KD.L(env).G.s, o = { size: s * 0.7, alpha: a, halo: true, color: A.amber };
    const m = (p, q) => { const P = Pj(O, c, ...p), Q = Pj(O, c, ...q); return [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]; };
    const [L, W, H] = B;
    let q = m([0, 0, 0], [L, 0, 0]); F().T(ctx, labels[0], q[0], q[1] + 36, o);
    q = m([L, 0, 0], [L, W, 0]); F().T(ctx, labels[1], q[0] + 50, q[1] + 12, o);
    q = m([L, W, 0], [L, W, H]); F().T(ctx, labels[2], q[0] + 48, q[1], o);
  }
  function tally(ctx, env, t, rows) {
    const T = KD.L(env).TL;
    rows.forEach(([t0, t1, txt, hot], i) => { const al = win(t, t0, t1) * END(t); if (al > 0) F().T(ctx, txt, T.x, T.y[i], { size: T.s, alpha: al, halo: true, color: hot ? A.amber : undefined }); });
  }

  function dashL(ctx, p, q, a, seed, color, w = 2.5) {
    if (a <= 0) return; const n = Math.max(6, Math.round(Math.hypot(q[0] - p[0], q[1] - p[1]) / 14));
    for (let j = 0; j < n; j += 2) Ink.path(ctx, [[lerp(p[0], q[0], j / n), lerp(p[1], q[1], j / n)], [lerp(p[0], q[0], (j + 1) / n), lerp(p[1], q[1], (j + 1) / n)]], { w, alpha: a, seed: seed + j, taper: [0, 0], color });
  }
  function seg2(ctx, p, q, a, k, seed, color, w = 3.5) { if (a > 0 && k > 0) Ink.path(ctx, [p, [lerp(p[0], q[0], k), lerp(p[1], q[1], k)]], { w, alpha: a, seed, taper: [0, 0], color }); }
  function dot(ctx, p, a, color) { if (a <= 0) return; ctx.beginPath(); ctx.arc(p[0], p[1], 6, 0, 7); ctx.fillStyle = color ? `rgba(${color},${a})` : `rgba(${LI.INK_RGB},${a})`; ctx.fill(); }
  function txt(ctx, env, p, s, a, hot, sz = 0.8) { if (a > 0) F().T(ctx, s, p[0], p[1], { size: KD.L(env).G.s * sz, alpha: a, halo: true, color: hot ? A.amber : undefined }); }
  function arcAt(ctx, C, r, u0, u1, a, seed, color) {
    if (a <= 0) return; const P = []; for (let j = 0; j <= 16; j++) { const u = lerp(u0, u1, j / 16); P.push([C[0] + r * Math.cos(u), C[1] + r * Math.sin(u)]); }
    Ink.path(ctx, P, { w: 2.5, alpha: a, seed, taper: [0, 0], color });
  }
  /** the triangle for a vertex at fraction f along BC (and height factor hy) */
  function tri(env, f, hy = 1) {
    const T = KD.L(env).TRI, B = [T.bx, T.y], C = [T.cx, T.y], A_ = [lerp(T.bx, T.cx, f), lerp(T.y, T.ay, hy)];
    return { A: A_, B, C };
  }
  const KF = [[0, 0.3, 1], [29.6, 0.3, 1], [31.8, 1.15, 0.85], [33.6, 1.15, 0.85], [36.0, -0.12, 0.8], [37.8, -0.12, 0.8], [39.6, 0.3, 1], [46.8, 0.3, 1], [48.2, 0.5, 0.95], [63.8, 0.5, 0.95], [64.8, 0.3, 1], [80, 0.3, 1]];
  function vertexAt(t) {
    for (let i = 0; i < KF.length - 1; i++) { const [t0, f0, h0] = KF[i], [t1, f1, h1] = KF[i + 1]; if (t >= t0 && t <= t1) { const e = inOut(seg(t, t0, t1)); return [lerp(f0, f1, e), lerp(h0, h1, e)]; } }
    return [0.3, 1];
  }
  const D = (p, q) => Math.hypot(q[0] - p[0], q[1] - p[1]);
  const ang = (P, Q, R) => { const u = Math.atan2(Q[1] - P[1], Q[0] - P[0]), v = Math.atan2(R[1] - P[1], R[0] - P[0]); let d = Math.abs(u - v) * 180 / Math.PI; if (d > 180) d = 360 - d; return d; };
  function measure(env, t) {
    const [f, hy] = vertexAt(t), G = tri(env, f, hy), unit = (KD.L(env).TRI.cx - KD.L(env).TRI.bx) / 10;
    const sides = { BC: D(G.B, G.C) / unit, AC: D(G.A, G.C) / unit, AB: D(G.A, G.B) / unit };
    const angs = { A: ang(G.A, G.B, G.C), B: ang(G.B, G.A, G.C), C: ang(G.C, G.A, G.B) };
    return { G, sides, angs };
  }
  const OPP = { BC: 'A', AC: 'B', AB: 'C' };
  const f1 = (v) => v.toFixed(1).replace('.', ',');
  function drawTri(ctx, env, t, a, hot) {
    if (a <= 0) return null; const M = measure(env, t), { A: P, B, C } = M.G, s = KD.L(env).G.s;
    const maxS = Object.keys(M.sides).reduce((p, q) => (M.sides[q] > M.sides[p] ? q : p));
    const hotS = (k) => hot && k === maxS, hotA = (k) => hot && OPP[maxS] === k;
    const sp = { BC: [B, C], AC: [P, C], AB: [P, B] };
    Object.entries(sp).forEach(([k, [p, q]], i) => Ink.path(ctx, [p, q], { w: hotS(k) ? 6 : 4, alpha: a, seed: 2200 + i, taper: [0, 0], color: hotS(k) ? LI.AMBER_RGB : undefined }));
    txt(ctx, env, [P[0], P[1] - s * 0.7], 'A', a); txt(ctx, env, [B[0] - s * 0.5, B[1] + s * 0.4], 'B', a); txt(ctx, env, [C[0] + s * 0.5, C[1] + s * 0.4], 'C', a);
    const cen = [(P[0] + B[0] + C[0]) / 3, (P[1] + B[1] + C[1]) / 3];
    Object.entries(sp).forEach(([k, [p, q]]) => { const m = [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2], d = [m[0] - cen[0], m[1] - cen[1]], L = Math.hypot(...d) || 1; txt(ctx, env, [m[0] + d[0] / L * s * 0.9, m[1] + d[1] / L * s * 0.9], `${f1(M.sides[k])} cm`, a * (hot === undefined ? 1 : 1), hotS(k), 0.62); });
    [['A', P], ['B', B], ['C', C]].forEach(([k, V]) => { const d = [cen[0] - V[0], cen[1] - V[1]], L = Math.hypot(...d); txt(ctx, env, [V[0] + d[0] / L * s * 1.5, V[1] + d[1] / L * s * 1.5], `${Math.round(M.angs[k])}°`, a, hotA(k), 0.62); });
    return M;
  }
  const order = (obj) => Object.keys(obj).sort((p, q) => obj[q] - obj[p]);

  function context(ctx, env, t) {
    exprs(ctx, t, KD.L(env).CX, [
      [4.4, 10.2, 'Bir üçgenin kenarları ve açıları'],
      [10.6, 27.8, 'Kenarları ve açıları sıralayalım'],
      [28.4, 45.8, 'Köşeyi kaydıralım: ilişki bozulur mu?'],
      [46.4, 63.8, 'Eşit kenarlar, eşit açılar'],
      [64.4, 79.8, 'Açılardan kenarlara'],
    ]);
  }

  function figure(ctx, env, t) {
    const a = END(t) * win(t, 4.6, 79.8);
    const M = drawTri(ctx, env, t, a * seg(t, 4.8, 5.6), t > 11.0);
    if (!M) return;
    const so = order(M.sides), ao = order(M.angs);
    const live = (t0, t1) => [[t0, t1, `Kenarlar: ${so.join(' > ')}`], [t0 + 0.6, t1, `Açılar: ${ao.join(' > ')}`], [t0 + 1.4, t1, `En uzun ${so[0]} ↔ en büyük ${ao[0]}`, true]];
    tally(ctx, env, t, [[6.4, 10.2, `A + B + C = ${Math.round(M.angs.A + M.angs.B + M.angs.C)}°`]]);
    tally(ctx, env, t, live(12.4, 27.8));
    tally(ctx, env, t, live(29.4, 45.8));
    tally(ctx, env, t, [[48.6, 63.8, `AB = ${f1(M.sides.AB)} = AC = ${f1(M.sides.AC)}`], [50.0, 63.8, `B = ${Math.round(M.angs.B)}° = C = ${Math.round(M.angs.C)}°`], [52.0, 63.8, 'Eşit kenarların karşısında eşit açılar', true]]);
    tally(ctx, env, t, [[65.4, 79.8, 'Açılar 80°, 60°, 40° ise'], [67.4, 79.8, 'En uzun kenar 80°’nin karşısında'], [69.4, 79.8, 'En kısa kenar 40°’nin karşısında', true]]);
  }

  function words(ctx, env, t) {
    const W = KD.L(env).W;
    exprs(ctx, t, at(W, 0), [[5.6, 10.2, 'Kenar uzunluklarını ve açı ölçülerini ölçelim'],
      [11.4, 27.8, 'En uzun kenar hangi açının karşısında?'],
      [29.4, 45.8, 'A köşesi sağa sola kayarken ölçüler değişiyor'],
      [47.4, 63.8, 'A, BC’nin ortasının üstüne geldi'],
      [65.4, 79.8, 'Açılar biliniyorsa kenarları sıralayabiliriz']]);
    exprs(ctx, t, at(W, 1), [[8.0, 10.2, 'İç açıların toplamı 180°'], [20.0, 27.8, 'En kısa kenar da en küçük açının karşısında'],
      [38.8, 45.8, 'Sıralama değişse de eşleşme hiç bozulmuyor'],
      [56.0, 63.8, 'İkizkenar üçgende taban açıları eşit'],
      [73.0, 79.8, 'Ölçmeden, yalnızca açılara bakarak']]);
    exprs(ctx, t, at(W, 2), [[23.0, 27.8, 'Büyük kenarın karşısında büyük açı', true],
      [42.0, 45.8, 'İlişki her üçgende geçerli', true],
      [59.0, 63.8, 'Eşit kenar ↔ eşit açı', true], [76.0, 79.8, 'Büyük açının karşısında büyük kenar', true]]);
  }

  function summary(ctx, env, t) {
    if (t < 80.4) return;
    const S = KD.L(env).SUM, f = F(), a = END(t);
    [['İç açıların toplamı 180°', 80.6], ['Büyük kenarın karşısında büyük açı', 81.6], ['Küçük kenarın karşısında küçük açı', 82.6], ['Eşit kenarlar ↔ eşit açılar!', 83.6, true]].forEach(([s, t0, hot], i) => {
      const al = seg(t, t0, t0 + 0.4) * a; if (al <= 0) return;
      f.expr(ctx, [s], S.x, S.y[i], S.s * (i === 3 ? 1.1 : 1), { alpha: al, w: S.w, halo: true, color: hot ? A.amber : undefined });
    });
  }

  LI.fireworks = function (ctx, env, t) {
    const k = seg(t, 84.4, 86.4);
    if (k <= 0 || t >= 91) return;
    const n = F().nokta(t, env), C = [n.x, n.y - 170];
    [30, 60, 90, 120, 150].forEach((d, i) => {
      const r = 150 + 30 * Math.sin(t * 2 + i);
      A.arc(ctx, C, r, d - 12, d + 12, { p: seg(k, i * 0.12, i * 0.12 + 0.4), alpha: 0.8 * (1 - seg(t, 90.2, 91)), w: 6, seed: 80 + i });
    });
  };

  LI.world = function (ctx, env, t) { context(ctx, env, t); figure(ctx, env, t); words(ctx, env, t); summary(ctx, env, t); };

  function camera(t, env) {
    const L = KD.L(env);
    return LI.Camera.breathe(LI.Camera.track([
      [0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [3.0, KD.cam(env, { x: L.nx, y: env.V ? 380 : 140, zoom: 1.6 })],
      [4.8, KD.cam(env, { zoom: 1 })],
    ], t), t, 0.5);
  }
  function render(ctx, lt, env, t) { F().base(ctx, env, t, camera(t, env), () => LI.world(ctx, env, t)); }
  LI.registerScene({ id: 1, start: 0, end: 10, name: 'A triangle', nameTr: 'Üçgen', concept: 'Sides and angles', conceptTr: 'Kenarlar ve açılar', render });
})(window.LI = window.LI || {});
