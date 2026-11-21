import React, { useEffect, useRef, useState } from "react";
import {
  PawPrint, Utensils, Droplets, Footprints, House, Heart,
  Camera, MessageCircle, Gift, Settings, Plus, X, Check,
  Image as ImageIcon, Wallet, ArrowUpRight, Trash2, Pencil,
  Upload, Search, RotateCcw
} from "lucide-react";

const CLAY_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@500;700;800;900&family=Nunito:wght@400;600;700;800;900&display=swap');

:root {
  --board: #17262e;
  --board2: #1e333d;
  --cream: #f4eee2;
  --cream2: #e9e1cf;
  --cream3: #d9cdb4;
  --slate: #5d7f92;
  --slate2: #48687a;
  --ink: #33424a;
  --ink-soft: #6d7c86;
  --coral: #ee7d5f;
  --coral2: #e0654a;
  --amber: #f5a962;
  --amber2: #e8944a;
  --mint: #6fc7b2;
  --mint2: #4fae97;
  --sky: #7fb5e0;
  --sky2: #619cc9;
  --lav: #b9a7e8;
  --lav2: #9d88d6;
  --rose: #e88fa2;
  --danger: #e0604c;
  --ok: #4fae97;
  --warn: #f0a24e;
  --info: #6aa9d8;
}

* { box-sizing: border-box; }
html { background: #17262e; scroll-behavior: smooth; }
body {
  margin: 0;
  min-height: 100vh;
  background: #17262e !important;
  color: var(--ink);
  font-family: 'Nunito', system-ui, sans-serif !important;
  -webkit-font-smoothing: antialiased;
}
#root { min-height: 100vh; padding: 20px; }
button, input, textarea, select { font: inherit; }
button { cursor: pointer; -webkit-tap-highlight-color: transparent; }
a { color: inherit; text-decoration: none; }
button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible, select:focus-visible {
  outline: 3px solid rgba(238,125,95,.65);
  outline-offset: 2px;
}

* { scrollbar-width: thin; scrollbar-color: #ee7d5f #101c22; }
::-webkit-scrollbar { width: 12px; height: 12px; }
::-webkit-scrollbar-track { background: #101c22; border-radius: 10px; }
::-webkit-scrollbar-thumb {
  background: linear-gradient(145deg, #f79a7e, #e0654a);
  border-radius: 10px;
  border: 3px solid #101c22;
}
::-webkit-scrollbar-thumb:hover { background: linear-gradient(145deg, #ffc27e, #f5a962); }
.cl-admin-body, .cl-modal, .cl-ledger-list { scrollbar-color: #ee7d5f #e2d9c6; }
.cl-admin-body::-webkit-scrollbar-track, .cl-modal::-webkit-scrollbar-track, .cl-ledger-list::-webkit-scrollbar-track { background: #e2d9c6; }
.cl-admin-body::-webkit-scrollbar-thumb, .cl-modal::-webkit-scrollbar-thumb, .cl-ledger-list::-webkit-scrollbar-thumb { border-color: #e2d9c6; }

.cl-aura {
  position: fixed; inset: -20%; z-index: 0; pointer-events: none;
  background:
    radial-gradient(620px 420px at 15% 12%, rgba(111,199,178,.15), transparent 62%),
    radial-gradient(720px 520px at 86% 86%, rgba(238,125,95,.13), transparent 62%),
    radial-gradient(520px 420px at 72% 18%, rgba(127,181,224,.11), transparent 62%);
  animation: cl-drift 28s ease-in-out infinite alternate;
}
@keyframes cl-drift { to { transform: translate(3%, 2%) rotate(1.2deg); } }
.cl-grain {
  position: fixed; inset: 0; z-index: 0; pointer-events: none; opacity: .055;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E");
}

.cl-app { position: relative; z-index: 1; max-width: 1480px; margin: 0 auto; }

.clay {
  background: linear-gradient(145deg, #fbf7ee, #ece4d2);
  box-shadow:
    inset 2px 3px 6px rgba(255,255,255,.85),
    inset -6px -8px 14px rgba(120,100,70,.16),
    10px 16px 30px rgba(8,16,20,.45);
}
.clay-slate {
  background: linear-gradient(145deg, #6b8ea1, #4e6e80);
  box-shadow:
    inset 2px 3px 6px rgba(255,255,255,.28),
    inset -6px -8px 14px rgba(10,25,35,.32),
    10px 16px 30px rgba(8,16,20,.5);
}
.clay-dark {
  background: linear-gradient(145deg, #2c4653, #1c313b);
  box-shadow:
    inset 2px 3px 6px rgba(255,255,255,.12),
    inset -6px -8px 14px rgba(0,0,0,.4),
    10px 16px 30px rgba(8,16,20,.55);
}
.clay-mint {
  background: linear-gradient(145deg, #8fd8c6, #5cb9a2);
  box-shadow:
    inset 2px 3px 6px rgba(255,255,255,.5),
    inset -6px -8px 14px rgba(20,80,65,.28),
    10px 16px 30px rgba(8,16,20,.45);
}

.puff {
  border: 0;
  border-radius: 20px;
  padding: 14px 20px;
  font-weight: 800;
  font-size: 13px;
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  box-shadow:
    inset 2px 3px 5px rgba(255,255,255,.5),
    inset -4px -6px 10px rgba(0,0,0,.2),
    6px 10px 18px rgba(8,16,20,.4);
  transition: transform .18s cubic-bezier(.2,.9,.3,1.4), box-shadow .18s, filter .18s;
}
.puff:hover { transform: translateY(-2px); filter: brightness(1.05); }
.puff:active {
  transform: translateY(2px) scale(.98);
  box-shadow:
    inset 3px 5px 10px rgba(0,0,0,.28),
    inset -2px -3px 6px rgba(255,255,255,.28),
    2px 4px 8px rgba(8,16,20,.3);
}
.puff-coral { background: linear-gradient(145deg, #f79a7e, #e56b4e); }
.puff-amber { background: linear-gradient(145deg, #ffc27e, #ef9a4e); color: #5c3a17; }
.puff-mint { background: linear-gradient(145deg, #8fd8c6, #56b39c); color: #14453a; }
.puff-sky { background: linear-gradient(145deg, #9cc8ec, #6ba3d2); color: #173a56; }
.puff-lav { background: linear-gradient(145deg, #cdbcec, #a48fd9); color: #3a2c63; }
.puff-cream { background: linear-gradient(145deg, #fbf7ee, #e7ddc8); color: var(--ink); }
.puff-dark { background: linear-gradient(145deg, #3a5a6a, #243c48); }
.puff-danger { background: linear-gradient(145deg, #ef8a72, #d95843); }
.puff-sm { padding: 9px 14px; border-radius: 15px; font-size: 12px; }
.puff-block { width: 100%; margin-top: 18px; }

.cl-in {
  width: 100%;
  border: 0;
  border-radius: 16px;
  padding: 13px 16px;
  background: #ece4d2;
  color: var(--ink);
  font-size: 13px;
  font-weight: 600;
  box-shadow:
    inset 3px 4px 8px rgba(120,100,70,.26),
    inset -2px -3px 6px rgba(255,255,255,.85);
  outline: none;
  transition: box-shadow .2s;
}
.cl-in::placeholder { color: #a4977e; font-weight: 600; }
.cl-in:focus {
  box-shadow:
    inset 3px 4px 8px rgba(120,100,70,.3),
    inset -2px -3px 6px rgba(255,255,255,.9),
    0 0 0 3px rgba(238,125,95,.45);
}
textarea.cl-in { resize: vertical; }
select.cl-in { appearance: none; cursor: pointer; }

.cl-screw {
  position: absolute; width: 11px; height: 11px; border-radius: 50%;
  background: radial-gradient(circle at 35% 30%, #fff, #cfc4ad 60%, #a99c82);
  box-shadow: inset -1px -2px 3px rgba(0,0,0,.35), 1px 2px 3px rgba(0,0,0,.3);
}
.cl-screw::after {
  content: ""; position: absolute; left: 2px; right: 2px; top: 50%;
  height: 1.5px; background: rgba(90,75,55,.55); transform: rotate(35deg);
}
.cl-screw-tl { top: 14px; left: 14px; }
.cl-screw-tr { top: 14px; right: 14px; }
.cl-screw-bl { bottom: 14px; left: 14px; }
.cl-screw-br { bottom: 14px; right: 14px; }

.cl-top {
  position: sticky; top: 14px; z-index: 50;
  display: flex; align-items: center; gap: 16px;
  padding: 12px 18px;
  border-radius: 24px;
  margin-bottom: 20px;
  color: #f2ede1;
}
.cl-brand { display: flex; align-items: center; gap: 11px; font: 800 17px 'Rubik'; letter-spacing: .04em; }
.cl-brand-ico {
  width: 42px; height: 42px; border-radius: 16px;
  display: grid; place-items: center; color: #fff;
  background: linear-gradient(145deg, #f79a7e, #e56b4e);
  box-shadow: inset 2px 3px 5px rgba(255,255,255,.5), inset -3px -5px 8px rgba(0,0,0,.22), 4px 7px 12px rgba(8,16,20,.4);
}
.cl-brand em { font-style: normal; color: var(--amber); }
.cl-nav { display: flex; gap: 8px; margin-left: auto; }
.cl-nav a {
  padding: 10px 16px; border-radius: 999px;
  font-size: 12px; font-weight: 800; color: #cfd9d2;
  background: rgba(255,255,255,.07);
  box-shadow: inset 1px 2px 3px rgba(255,255,255,.1), inset -2px -3px 5px rgba(0,0,0,.25);
  transition: background .2s, color .2s, transform .2s;
}
.cl-nav a:hover { transform: translateY(-1px); color: #fff; }
.cl-nav a.on {
  color: #fff;
  background: linear-gradient(145deg, #f79a7e, #e56b4e);
  box-shadow: inset 2px 3px 5px rgba(255,255,255,.45), inset -3px -5px 8px rgba(0,0,0,.22), 4px 7px 12px rgba(8,16,20,.4);
}
.cl-gear {
  width: 42px; height: 42px; border: 0; border-radius: 16px;
  display: grid; place-items: center; color: #f2ede1;
  background: linear-gradient(145deg, #3a5a6a, #243c48);
  box-shadow: inset 2px 3px 5px rgba(255,255,255,.14), inset -3px -5px 8px rgba(0,0,0,.35), 4px 7px 12px rgba(8,16,20,.4);
  transition: transform .25s;
}
.cl-gear:hover { transform: rotate(30deg); }
.cl-gear.on { color: var(--amber); }

.cl-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: minmax(96px, auto);
  gap: 18px;
  grid-template-areas:
    "hero hero hero hero hero hero hero torus torus torus torus torus"
    "hero hero hero hero hero hero hero torus torus torus torus torus"
    "hero hero hero hero hero hero hero care care care care care"
    "chart chart chart chart money money money care care care care care"
    "chart chart chart chart money money money care care care care care"
    "chart chart chart chart money money money contact contact contact contact contact"
    "stories stories stories stories stories stories stories stories ledger ledger ledger ledger"
    "stories stories stories stories stories stories stories stories ledger ledger ledger ledger"
    "stories stories stories stories stories stories stories stories ledger ledger ledger ledger";
}
.cl-card { position: relative; border-radius: 30px; padding: 26px; animation: cl-pop .6s cubic-bezier(.2,.9,.3,1.15) backwards; }
.cl-card:nth-child(1) { animation-delay: .03s; }
.cl-card:nth-child(2) { animation-delay: .09s; }
.cl-card:nth-child(3) { animation-delay: .15s; }
.cl-card:nth-child(4) { animation-delay: .21s; }
.cl-card:nth-child(5) { animation-delay: .27s; }
.cl-card:nth-child(6) { animation-delay: .33s; }
.cl-card:nth-child(7) { animation-delay: .39s; }
.cl-card:nth-child(8) { animation-delay: .45s; }
@keyframes cl-pop { from { opacity: 0; transform: translateY(22px) scale(.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
#care, #stories, #ledger, #top { scroll-margin-top: 108px; }

.cl-eyebrow {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 10px; font-weight: 900; letter-spacing: .14em;
  color: var(--ink-soft); text-transform: uppercase;
}
.cl-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--mint); box-shadow: 0 0 0 4px rgba(111,199,178,.22); }
.cl-h { font: 800 20px 'Rubik'; letter-spacing: -.02em; margin: 8px 0 0; color: var(--ink); }
.cl-sub { font-size: 12px; color: var(--ink-soft); font-weight: 600; line-height: 1.6; }

.cl-hero { grid-area: hero; display: flex; align-items: center; gap: 28px; padding: 36px; overflow: hidden; }
.cl-hero-copy { flex: 1; min-width: 0; position: relative; z-index: 2; }
.cl-letters { font: 900 clamp(54px, 6.5vw, 96px)/1 'Rubik'; letter-spacing: -.03em; margin: 18px 0 14px; }
.cl-letters span { display: inline-block; text-shadow: 0 3px 0 rgba(0,0,0,.1), 0 12px 20px rgba(8,16,20,.28); }
.cl-letters span:nth-child(odd) { transform: rotate(-2.5deg) translateY(-2px); }
.cl-letters span:nth-child(even) { transform: rotate(2deg) translateY(2px); }
.cl-hero-desc { font-size: 15px; line-height: 1.75; color: var(--ink-soft); font-weight: 600; max-width: 430px; }
.cl-hero-actions { display: flex; gap: 14px; margin-top: 26px; flex-wrap: wrap; }
.cl-hero-note { margin-top: 24px; font-size: 11px; font-weight: 800; color: var(--ink-soft); display: flex; align-items: center; gap: 8px; }
.cl-photo {
  position: relative; flex: 0 0 auto;
  width: min(300px, 38%); aspect-ratio: 1;
  border-radius: 38% 42% 40% 44%;
  transform: rotate(3deg);
  background: radial-gradient(circle at 32% 28%, #fdfaf3, #e3d9c3 68%, #cfc2a6);
  box-shadow:
    inset 3px 5px 9px rgba(255,255,255,.9),
    inset -8px -12px 20px rgba(120,100,70,.28),
    14px 20px 36px rgba(8,16,20,.45);
  display: grid; place-items: center;
}
.cl-photo img { width: 100%; height: 100%; object-fit: cover; border-radius: 38% 42% 40% 44%; }
.cl-photo-empty { display: flex; flex-direction: column; align-items: center; gap: 10px; color: #a4977e; font-weight: 800; font-size: 12px; text-align: center; padding: 20px; }
.cl-sticker {
  position: absolute; right: -8px; bottom: 22px; z-index: 3;
  padding: 12px 16px; border-radius: 18px;
  font: 800 12px 'Rubik'; color: #5c3a17;
  transform: rotate(8deg);
  background: linear-gradient(145deg, #ffc27e, #ef9a4e);
  box-shadow: inset 2px 3px 5px rgba(255,255,255,.55), inset -3px -5px 8px rgba(0,0,0,.18), 6px 10px 16px rgba(8,16,20,.4);
}

.cl-torus { grid-area: torus; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; color: #f2ede1; }
.cl-torus .cl-eyebrow { color: #cfd9d2; }
.cl-ring { position: relative; width: min(230px, 70%); }
.cl-ring svg { width: 100%; height: auto; display: block; filter: drop-shadow(4px 8px 10px rgba(8,16,20,.4)); }
.cl-ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px; }
.cl-ring-center b { font: 900 38px 'Rubik'; color: #f2ede1; }
.cl-ring-center span { font-size: 10px; font-weight: 800; letter-spacing: .1em; color: #cfd9d2; text-transform: uppercase; }
.cl-torus-dots { display: flex; gap: 10px; }
.cl-tdot { width: 14px; height: 14px; border-radius: 50%; box-shadow: inset 1px 2px 3px rgba(255,255,255,.5), inset -2px -3px 4px rgba(0,0,0,.3), 2px 4px 6px rgba(8,16,20,.35); }
.cl-tdot.off { background: rgba(255,255,255,.14) !important; box-shadow: inset 2px 3px 5px rgba(0,0,0,.35); }
.cl-torus small { font-size: 11px; font-weight: 700; color: #cfd9d2; }

.cl-care { grid-area: care; display: flex; flex-direction: column; gap: 14px; }
.cl-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.cl-chip {
  flex: 1; min-width: 100px;
  padding: 9px 12px; border-radius: 14px;
  background: #ece4d2;
  box-shadow: inset 2px 3px 6px rgba(120,100,70,.24), inset -2px -3px 5px rgba(255,255,255,.85);
  display: flex; flex-direction: column; gap: 2px;
}
.cl-chip span { font-size: 9px; font-weight: 900; letter-spacing: .08em; color: var(--ink-soft); text-transform: uppercase; }
.cl-chip b { font-size: 11px; font-weight: 800; color: var(--ink); }
.cl-acts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; flex: 1; }
.cl-act {
  border: 0; border-radius: 22px; padding: 14px;
  display: flex; flex-direction: column; align-items: flex-start; justify-content: space-between; gap: 10px;
  min-height: 104px; text-align: left;
  font: 800 13px 'Nunito';
}
.cl-act-ico {
  width: 40px; height: 40px; border-radius: 15px;
  display: grid; place-items: center;
  background: rgba(255,255,255,.38);
  box-shadow: inset 1px 2px 3px rgba(255,255,255,.7), inset -2px -3px 5px rgba(0,0,0,.14);
}

.cl-chart { grid-area: chart; display: flex; flex-direction: column; gap: 14px; }
.cl-chart-body { display: flex; align-items: center; gap: 20px; flex: 1; flex-wrap: wrap; }
.cl-chart-ring { position: relative; width: 150px; flex: 0 0 auto; }
.cl-chart-ring svg { width: 100%; height: auto; display: block; filter: drop-shadow(3px 6px 8px rgba(120,100,70,.3)); }
.cl-chart-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.cl-chart-center b { font: 900 30px 'Rubik'; color: var(--ink); }
.cl-chart-center span { font-size: 9px; font-weight: 900; letter-spacing: .08em; color: var(--ink-soft); text-transform: uppercase; }
.cl-legend { display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 130px; }
.cl-leg { display: flex; align-items: center; gap: 9px; font-size: 12px; font-weight: 800; color: var(--ink); }
.cl-leg i { width: 13px; height: 13px; border-radius: 50%; flex: 0 0 auto; box-shadow: inset 1px 2px 3px rgba(255,255,255,.55), inset -2px -2px 4px rgba(0,0,0,.22), 1px 3px 4px rgba(120,100,70,.3); }
.cl-leg b { margin-left: auto; font: 800 13px 'Rubik'; }

.cl-money { grid-area: money; color: #f2ede1; display: flex; flex-direction: column; gap: 12px; }
.cl-money .cl-eyebrow { color: #a9c3b8; }
.cl-money-top { display: flex; align-items: center; justify-content: space-between; }
.cl-balance { font: 900 clamp(30px, 3vw, 42px)/1 'Rubik'; letter-spacing: -.02em; margin-top: 6px; }
.cl-money-pills { display: flex; gap: 8px; flex-wrap: wrap; }
.cl-mpill {
  padding: 8px 13px; border-radius: 999px; font-size: 11px; font-weight: 900;
  box-shadow: inset 2px 3px 5px rgba(255,255,255,.35), inset -3px -4px 7px rgba(0,0,0,.25), 3px 6px 10px rgba(8,16,20,.35);
}
.cl-mpill-in { background: linear-gradient(145deg, #8fd8c6, #56b39c); color: #14453a; }
.cl-mpill-out { background: linear-gradient(145deg, #f79a7e, #e56b4e); color: #fff; }
.cl-spark { margin-top: auto; }
.cl-spark svg { width: 100%; height: 64px; display: block; }
.cl-spark span { font-size: 9px; font-weight: 900; letter-spacing: .1em; color: #a9c3b8; text-transform: uppercase; }

.cl-contact { grid-area: contact; display: flex; align-items: center; gap: 18px; flex-wrap: wrap; padding: 22px 26px; }
.cl-contact-copy { flex: 1; min-width: 150px; }
.cl-contact .cl-h { margin: 4px 0 0; font-size: 17px; color: #14453a; }
.cl-contact .cl-eyebrow { color: #2c6b58; }
.cl-contact-btns { display: flex; gap: 10px; flex-wrap: wrap; }

.cl-stories { grid-area: stories; display: flex; flex-direction: column; gap: 16px; }
.cl-toolbar { display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
.cl-search { position: relative; flex: 1; min-width: 170px; }
.cl-search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #a4977e; }
.cl-search .cl-in { padding-left: 42px; }
.cl-tabs { display: flex; gap: 6px; }
.cl-tab {
  border: 0; padding: 10px 15px; border-radius: 999px;
  font-size: 12px; font-weight: 800; color: var(--ink-soft);
  background: #ece4d2;
  box-shadow: inset 2px 3px 5px rgba(120,100,70,.2), inset -2px -3px 4px rgba(255,255,255,.8);
  transition: transform .18s;
}
.cl-tab:hover { transform: translateY(-1px); }
.cl-tab.on {
  color: #fff;
  background: linear-gradient(145deg, #f79a7e, #e56b4e);
  box-shadow: inset 2px 3px 5px rgba(255,255,255,.45), inset -3px -5px 8px rgba(0,0,0,.2), 3px 6px 10px rgba(120,100,70,.35);
}
.cl-sort { width: auto; padding: 10px 14px; font-size: 12px; font-weight: 800; }
.cl-count { font-size: 11px; font-weight: 800; color: var(--ink-soft); margin-left: auto; }
.cl-story-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.cl-story {
  position: relative; border-radius: 22px; overflow: hidden; cursor: pointer;
  background: linear-gradient(145deg, #fbf7ee, #ece4d2);
  box-shadow: inset 2px 3px 6px rgba(255,255,255,.85), inset -5px -7px 12px rgba(120,100,70,.14), 6px 10px 20px rgba(8,16,20,.35);
  transition: transform .2s cubic-bezier(.2,.9,.3,1.3), box-shadow .2s;
}
.cl-story:hover { transform: translateY(-4px) rotate(-.4deg); }
.cl-story-img { width: 100%; height: 150px; object-fit: cover; display: block; }
.cl-story-noimg {
  height: 110px; display: grid; place-items: center; color: #fff;
  background: linear-gradient(145deg, #cdbcec, #a48fd9);
  box-shadow: inset 2px 3px 6px rgba(255,255,255,.4), inset -5px -7px 12px rgba(60,40,110,.25);
}
.cl-story-body { padding: 16px; }
.cl-story-meta { display: flex; justify-content: space-between; gap: 8px; font-size: 9px; font-weight: 900; letter-spacing: .1em; color: var(--ink-soft); text-transform: uppercase; }
.cl-story-body h3 { font: 800 16px/1.3 'Rubik'; margin: 10px 0 6px; color: var(--ink); }
.cl-story-body p {
  font-size: 12px; line-height: 1.6; color: var(--ink-soft); font-weight: 600; margin: 0 0 10px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.cl-story-author { font-size: 10px; font-weight: 800; color: var(--ink-soft); }
.cl-story-admin { position: absolute; top: 10px; right: 10px; display: flex; gap: 6px; z-index: 2; }
.cl-mini {
  width: 32px; height: 32px; border: 0; border-radius: 12px;
  display: grid; place-items: center; color: var(--ink);
  background: linear-gradient(145deg, #fbf7ee, #e7ddc8);
  box-shadow: inset 1px 2px 3px rgba(255,255,255,.8), inset -2px -3px 5px rgba(120,100,70,.2), 3px 5px 8px rgba(8,16,20,.35);
  transition: transform .15s;
}
.cl-mini:hover { transform: scale(1.1); }
.cl-mini-danger { color: var(--danger); }
.cl-event { display: flex; gap: 13px; align-items: flex-start; padding: 16px; }
.cl-event-ico {
  width: 46px; height: 46px; border-radius: 17px; flex: 0 0 auto;
  display: grid; place-items: center; color: #fff;
  box-shadow: inset 2px 3px 5px rgba(255,255,255,.45), inset -3px -5px 8px rgba(0,0,0,.22), 4px 7px 12px rgba(8,16,20,.3);
}
.cl-event-body { flex: 1; min-width: 0; }
.cl-event-body h3 { font: 800 15px 'Rubik'; margin: 6px 0 4px; color: var(--ink); }
.cl-event-body p { font-size: 12px; line-height: 1.55; color: var(--ink-soft); font-weight: 600; margin: 0 0 6px; }
.cl-add {
  border: 2px dashed #c9bda3; border-radius: 22px;
  background: rgba(255,255,255,.35);
  min-height: 150px;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
  color: var(--ink-soft); font-weight: 800; font-size: 13px;
  transition: transform .2s, background .2s;
}
.cl-add:hover { transform: translateY(-3px); background: rgba(255,255,255,.6); }
.cl-add-ico {
  width: 48px; height: 48px; border-radius: 18px;
  display: grid; place-items: center; color: #fff;
  background: linear-gradient(145deg, #8fd8c6, #56b39c);
  box-shadow: inset 2px 3px 5px rgba(255,255,255,.5), inset -3px -5px 8px rgba(0,0,0,.18), 4px 7px 12px rgba(8,16,20,.3);
}
.cl-empty { padding: 26px; border-radius: 18px; text-align: center; color: var(--ink-soft); font-weight: 700; font-size: 13px; background: #ece4d2; box-shadow: inset 3px 4px 8px rgba(120,100,70,.22), inset -2px -3px 6px rgba(255,255,255,.85); }

.cl-ledger { grid-area: ledger; display: flex; flex-direction: column; gap: 14px; }
.cl-ledger-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
.cl-ledger-list { display: flex; flex-direction: column; gap: 9px; overflow: auto; max-height: 430px; padding-right: 4px; }
.cl-row {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  padding: 12px 14px; border-radius: 16px;
  background: #ece4d2;
  box-shadow: inset 2px 3px 6px rgba(120,100,70,.2), inset -2px -3px 5px rgba(255,255,255,.85);
}
.cl-row-info { min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.cl-row-info b { font-size: 13px; font-weight: 800; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cl-row-info small { font-size: 10px; font-weight: 700; color: var(--ink-soft); }
.cl-row-right { display: flex; align-items: center; gap: 8px; flex: 0 0 auto; }
.cl-amt { padding: 7px 12px; border-radius: 999px; font: 800 12px 'Rubik'; box-shadow: inset 2px 3px 5px rgba(255,255,255,.4), inset -2px -4px 6px rgba(0,0,0,.18), 2px 4px 8px rgba(120,100,70,.28); }
.cl-amt-in { background: linear-gradient(145deg, #8fd8c6, #56b39c); color: #14453a; }
.cl-amt-out { background: linear-gradient(145deg, #f79a7e, #e56b4e); color: #fff; }

.cl-foot {
  margin-top: 18px; padding: 16px 22px; border-radius: 22px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  color: #a9b8ae; font-size: 11px; font-weight: 700;
}
.cl-foot b { display: flex; align-items: center; gap: 8px; font: 800 13px 'Rubik'; color: #f2ede1; }
.cl-foot b em { font-style: normal; color: var(--amber); }

.cl-toast {
  position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%);
  z-index: 95; display: flex; align-items: center; gap: 12px;
  padding: 14px 18px; border-radius: 20px;
  color: #f2ede1; font-size: 13px; font-weight: 800;
  animation: cl-toast .35s cubic-bezier(.2,.9,.3,1.3);
  max-width: calc(100vw - 32px);
}
@keyframes cl-toast { from { opacity: 0; transform: translate(-50%, 16px) scale(.95); } to { opacity: 1; transform: translate(-50%, 0) scale(1); } }

.cl-admin {
  position: fixed; top: 0; right: 0; bottom: 0; z-index: 70;
  width: min(440px, 100%);
  background: var(--cream);
  box-shadow: -24px 0 70px rgba(0,0,0,.55);
  display: flex; flex-direction: column;
  animation: cl-slide .3s cubic-bezier(.2,.9,.3,1.1);
}
@keyframes cl-slide { from { transform: translateX(40px); opacity: .4; } to { transform: translateX(0); opacity: 1; } }
.cl-admin-head { display: flex; align-items: center; justify-content: space-between; padding: 22px 24px; border-bottom: 2px solid var(--cream2); }
.cl-admin-head h2 { font: 800 22px 'Rubik'; margin: 4px 0 0; }
.cl-admin-body { padding: 22px 24px; overflow: auto; }
.cl-label { display: block; font-size: 11px; font-weight: 900; color: var(--ink-soft); margin: 16px 0 7px; letter-spacing: .04em; text-transform: uppercase; }
.cl-upload {
  height: 110px; border: 2px dashed #c9bda3; border-radius: 18px;
  background: #ece4d2; cursor: pointer;
  display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px;
  color: var(--ink-soft); font-size: 12px; font-weight: 800;
  box-shadow: inset 3px 4px 8px rgba(120,100,70,.18);
}
.cl-upload small { font-size: 10px; }
.cl-upload input, .cl-file input { display: none; }
.cl-textbtn { border: 0; background: none; color: var(--danger); font-size: 12px; font-weight: 800; display: inline-flex; align-items: center; gap: 6px; margin-top: 12px; padding: 0; }
.cl-divider { height: 2px; background: var(--cream2); border-radius: 2px; margin: 22px 0; }
.cl-admin h3 { font: 800 16px 'Rubik'; margin: 18px 0 4px; }
.cl-warn {
  margin-top: 22px; padding: 14px 16px; border-radius: 16px;
  background: linear-gradient(145deg, #ffe3bd, #f7cd96);
  color: #7a5426; font-size: 11px; line-height: 1.65; font-weight: 700;
  box-shadow: inset 2px 3px 5px rgba(255,255,255,.6), inset -3px -5px 8px rgba(150,100,40,.2);
}

.cl-back {
  position: fixed; inset: 0; z-index: 80;
  background: rgba(10,18,22,.62);
  backdrop-filter: blur(8px);
  display: grid; place-items: center; padding: 16px;
  animation: cl-fade .2s ease-out;
}
@keyframes cl-fade { from { opacity: 0; } to { opacity: 1; } }
.cl-modal {
  position: relative; width: min(520px, 100%);
  max-height: 88vh; overflow: auto;
  border-radius: 30px; padding: 32px;
  animation: cl-pop .3s cubic-bezier(.2,.9,.3,1.2);
}
.cl-modal h2 { font: 800 26px 'Rubik'; letter-spacing: -.02em; margin: 10px 0 8px; }
.cl-modal > p { font-size: 13px; color: var(--ink-soft); font-weight: 600; line-height: 1.65; margin: 0 0 6px; }
.cl-close {
  position: absolute; top: 16px; right: 16px;
  width: 38px; height: 38px; border: 0; border-radius: 14px;
  display: grid; place-items: center; color: var(--ink);
  background: linear-gradient(145deg, #fbf7ee, #e7ddc8);
  box-shadow: inset 1px 2px 3px rgba(255,255,255,.8), inset -2px -3px 5px rgba(120,100,70,.2), 3px 5px 8px rgba(8,16,20,.25);
}
.cl-modal form { margin-top: 14px; }
.cl-modal .cl-label { margin-top: 14px; }
.cl-care-head { display: flex; align-items: center; gap: 14px; margin: 14px 0 6px; }
.cl-care-head h2 { margin: 0; }
.cl-file {
  margin-top: 14px; padding: 14px 16px; border: 2px dashed #c9bda3; border-radius: 16px;
  display: flex; align-items: center; gap: 10px; cursor: pointer;
  background: #ece4d2; color: var(--ink-soft); font-size: 12px; font-weight: 800;
  box-shadow: inset 3px 4px 8px rgba(120,100,70,.16);
}
.cl-view-img { width: 100%; max-height: 320px; object-fit: cover; border-radius: 20px; margin: 14px 0; box-shadow: 6px 10px 20px rgba(8,16,20,.3); }
.cl-view-noimg { height: 140px; border-radius: 20px; margin: 14px 0; display: grid; place-items: center; color: #fff; background: linear-gradient(145deg, #cdbcec, #a48fd9); box-shadow: inset 2px 3px 6px rgba(255,255,255,.4), inset -5px -7px 12px rgba(60,40,110,.25); }
.cl-view-meta { display: flex; gap: 10px; align-items: center; font-size: 11px; font-weight: 800; color: var(--ink-soft); margin-top: 12px; flex-wrap: wrap; }
.cl-view-actions { display: flex; gap: 10px; margin-top: 18px; flex-wrap: wrap; }
.cl-badge { padding: 6px 12px; border-radius: 999px; font-size: 10px; font-weight: 900; letter-spacing: .08em; color: #fff; text-transform: uppercase; box-shadow: inset 2px 3px 4px rgba(255,255,255,.4), inset -2px -3px 5px rgba(0,0,0,.2); }

@media (max-width: 1100px) {
  .cl-grid {
    grid-template-columns: repeat(6, 1fr);
    grid-template-areas:
      "hero hero hero hero hero hero"
      "hero hero hero hero hero hero"
      "torus torus torus care care care"
      "torus torus torus care care care"
      "chart chart chart money money money"
      "chart chart chart money money money"
      "contact contact contact contact contact contact"
      "stories stories stories stories stories stories"
      "ledger ledger ledger ledger ledger ledger";
  }
  .cl-hero { padding: 28px; }
  .cl-photo { width: min(240px, 36%); }
}
@media (max-width: 700px) {
  #root { padding: 12px; }
  .cl-nav { display: none; }
  .cl-top { top: 10px; }
  .cl-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: auto;
    grid-template-areas: "hero" "torus" "care" "chart" "money" "contact" "stories" "ledger";
    gap: 14px;
  }
  .cl-hero { flex-direction: column; align-items: flex-start; }
  .cl-photo { width: min(240px, 70%); align-self: center; }
  .cl-sticker { right: 6px; }
  .cl-letters { font-size: 56px; }
  .cl-acts { grid-template-columns: repeat(3, 1fr); }
  .cl-story-grid { grid-template-columns: 1fr; }
  .cl-torus { padding: 30px 26px; }
  .cl-ring { width: 200px; }
  .cl-contact { flex-direction: column; align-items: flex-start; }
  .cl-modal { padding: 26px 20px; }
  .cl-card { padding: 22px; }
}
@media (max-width: 480px) {
  .cl-acts { grid-template-columns: repeat(2, 1fr); }
  .cl-letters { font-size: 46px; }
  .cl-hero-actions .puff { flex: 1; }
  .cl-chips { flex-direction: column; }
  .cl-toolbar { flex-direction: column; align-items: stretch; }
  .cl-count { margin-left: 0; }
  .cl-sort { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
`;

const LETTERS = ["#ee7d5f", "#f5a962", "#4fae97", "#619cc9", "#9d88d6", "#e88fa2"];

const TYPES = {
  feed: { label: "Покормил", short: "Корм", color: "#ee7d5f", puff: "puff-coral", Icon: Utensils },
  water: { label: "Напоил", short: "Вода", color: "#7fb5e0", puff: "puff-sky", Icon: Droplets },
  walk: { label: "Выгулял", short: "Прогулка", color: "#f5a962", puff: "puff-amber", Icon: Footprints },
  house: { label: "Проверил будку", short: "Будка", color: "#b9a7e8", puff: "puff-lav", Icon: House },
  help: { label: "Помог", short: "Помощь", color: "#6fc7b2", puff: "puff-mint", Icon: Heart }
};
const TYPE_KEYS = Object.keys(TYPES);

const initialProfile = {
  name: "Черныш",
  location: "Курдумово",
  description: "Наш общий дворовый пёс. У него есть будка, миска и целая компания людей, которым он небезразличен. Отмечай заботу — и все соседи увидят, что Черныш под присмотром.",
  photo: "",
  vk: "",
  telegram: "",
  chat: ""
};

const daysAgo = n => new Date(Date.now() - n * 86400000).toISOString();

const seedEvents = [
  { id: 1, type: "feed", title: "Покормил", text: "Съел всю миску и просил ещё 🐾", author: "Пример записи", date: daysAgo(0), demo: true },
  { id: 2, type: "water", title: "Напоил", text: "Свежая вода после прогулки", author: "Пример записи", date: daysAgo(0), demo: true },
  { id: 3, type: "walk", title: "Выгулял", text: "До речки и обратно, хвост весь день вверх", author: "Пример записи", date: daysAgo(1), demo: true },
  { id: 4, type: "feed", title: "Покормил", text: "Ужин по расписанию", author: "Пример записи", date: daysAgo(1), demo: true },
  { id: 5, type: "house", title: "Проверил будку", text: "Подсыпал соломы, стало теплее", author: "Пример записи", date: daysAgo(2), demo: true },
  { id: 6, type: "help", title: "Помог", text: "Принёс новый поводок", author: "Пример записи", date: daysAgo(3), demo: true },
  { id: 7, type: "walk", title: "Выгулял", text: "Бегал за палкой минут двадцать", author: "Пример записи", date: daysAgo(4), demo: true }
];

const seedPosts = [
  { id: 1, title: "Добро пожаловать на страничку Черныша!", text: "Здесь мы собираем фотографии, забавные истории и новости о его жизни. Каждый сосед может поделиться моментом с нашим четвероногим другом.", author: "Команда Черныша", image: "", date: daysAgo(2), demo: true },
  { id: 2, title: "Первый снег", text: "Черныш носился по двору как щенок и ловил снежинки. Кажется, зима ему по душе.", author: "Пример записи", image: "", date: daysAgo(5), demo: true }
];

const seedTransactions = [
  { id: 1, kind: "income", amount: 1500, title: "Сбор на корм от соседей", date: daysAgo(6), demo: true },
  { id: 2, kind: "expense", amount: 980, title: "Мешок корма 15 кг", date: daysAgo(5), demo: true },
  { id: 3, kind: "income", amount: 700, title: "Перевод от Ани", date: daysAgo(3), demo: true },
  { id: 4, kind: "expense", amount: 350, title: "Солома в будку", date: daysAgo(2), demo: true },
  { id: 5, kind: "income", amount: 500, title: "Копилка у калитки", date: daysAgo(1), demo: true }
];

const read = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem("chernysh_" + key)) ?? fallback; }
  catch { return fallback; }
};
const fmt = n => Number(n || 0).toLocaleString("ru-RU");
const plural = (n, forms) => {
  const a = Math.abs(n) % 100, b = a % 10;
  if (a > 10 && a < 20) return forms[2];
  if (b > 1 && b < 5) return forms[1];
  if (b === 1) return forms[0];
  return forms[2];
};
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const shortDate = d => new Date(d).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function Donut({ segments, total, size, stroke, track, round }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  let acc = 0;
  return <svg viewBox={"0 0 " + size + " " + size}>
    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
    {total > 0 && segments.filter(s => s.value > 0).map((s, i) => {
      const frac = s.value / total;
      const dash = Math.max(frac * C - (segments.length > 1 ? 3 : 0), 0.5);
      const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={stroke}
        strokeDasharray={dash + " " + (C - dash)} strokeDashoffset={-acc * C}
        strokeLinecap={round ? "round" : "butt"} transform={"rotate(-90 " + size / 2 + " " + size / 2 + ")"}/>;
      acc += frac;
      return el;
    })}
  </svg>;
}

function App() {
  const [profile, setProfile] = useState(() => ({ ...initialProfile, ...read("profile", {}) }));
  const [events, setEvents] = useState(() => read("events", seedEvents));
  const [posts, setPosts] = useState(() => read("posts", seedPosts));
  const [transactions, setTransactions] = useState(() => read("transactions", []));
  const [admin, setAdmin] = useState(false);
  const [modal, setModal] = useState("");
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("new");
  const [section, setSection] = useState("care");
  const [toast, setToast] = useState(null);
  const [careAction, setCareAction] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const toastTimer = useRef(null);
  const undoRef = useRef(null);

  function showToast(msg, withUndo) {
    setToast({ msg, undo: !!withUndo });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => { setToast(null); if (withUndo) undoRef.current = null; }, 5200);
  }
  const notify = msg => showToast(msg, false);

  function persist(key, value) {
    try { localStorage.setItem("chernysh_" + key, JSON.stringify(value)); }
    catch { notify("Хранилище браузера переполнено — попробуй фото меньшего размера."); }
  }
  useEffect(() => persist("profile", profile), [profile]);
  useEffect(() => persist("events", events), [events]);
  useEffect(() => persist("posts", posts), [posts]);
  useEffect(() => persist("transactions", transactions), [transactions]);
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  useEffect(() => {
    try {
      if (!localStorage.getItem("chernysh_seed_v2")) {
        localStorage.setItem("chernysh_seed_v2", "1");
        setTransactions(old => (old.length === 0 ? seedTransactions : old));
      }
    } catch {}
  }, []);

  function closeModal() { setModal(""); setCareAction(null); setEditingPost(null); setViewItem(null); }

  useEffect(() => {
    const onKey = e => {
      if (e.key !== "Escape") return;
      if (modal) closeModal();
      else if (admin) setAdmin(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = modal || admin ? "hidden" : "";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [modal, admin]);

  useEffect(() => {
    const ids = ["care", "stories", "ledger"];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) setSection(en.target.id); });
    }, { rootMargin: "-35% 0px -55% 0px" });
    ids.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  const balance = transactions.reduce((s, x) => s + (x.kind === "income" ? Number(x.amount) : -Number(x.amount)), 0);
  const income = transactions.filter(x => x.kind === "income").reduce((s, x) => s + Number(x.amount), 0);
  const expense = transactions.filter(x => x.kind === "expense").reduce((s, x) => s + Number(x.amount), 0);
  const hasDemo = events.some(x => x.demo) || posts.some(x => x.demo) || transactions.some(x => x.demo);

  const now = Date.now();
  const todayTypes = new Set(events.filter(x => sameDay(x.date, now)).map(x => x.type));
  const todayProgress = todayTypes.size / TYPE_KEYS.length;
  const week = events.filter(x => now - new Date(x.date).getTime() < 7 * 86400000);
  const weekCounts = TYPE_KEYS.map(k => ({ key: k, value: week.filter(x => x.type === k).length, color: TYPES[k].color, label: TYPES[k].short }));
  const weekTotal = week.length;

  const spark = [];
  for (let i = 6; i >= 0; i--) {
    const day = now - i * 86400000;
    const itemsDay = transactions.filter(x => sameDay(x.date, day));
    const net = itemsDay.reduce((s, x) => s + (x.kind === "income" ? Number(x.amount) : -Number(x.amount)), 0);
    spark.push(net);
  }
  const sparkMax = Math.max(...spark.map(v => Math.abs(v)), 1);

  const last = type => {
    const item = events.find(x => x.type === type);
    return item ? shortDate(item.date) : "пока нет";
  };

  const q = query.trim().toLowerCase();
  const match = x => !q || [x.title, x.text, x.author].join(" ").toLowerCase().includes(q);
  let items = tab === "all"
    ? [...posts.map(p => ({ ...p, kind: "post" })), ...events.map(e => ({ ...e, kind: "event" }))]
    : tab === "post" ? posts.map(p => ({ ...p, kind: "post" })) : events.map(e => ({ ...e, kind: "event" }));
  items = items.filter(match).sort((a, b) => sort === "new" ? String(b.date).localeCompare(String(a.date)) : String(a.date).localeCompare(String(b.date)));

  function openCare(type) { setCareAction({ type, ...TYPES[type] }); setModal("care"); }

  function addEvent(e) {
    e.preventDefault();
    if (!careAction) return;
    const form = new FormData(e.currentTarget);
    const author = String(form.get("author") || "").trim() || "Анонимно";
    const note = String(form.get("text") || "").trim();
    const item = { id: Date.now(), type: careAction.type, title: careAction.label, text: note || careAction.label + " — Черныш под присмотром.", author, date: new Date().toISOString() };
    setEvents(old => [item, ...old]);
    closeModal();
    notify("Запись добавлена ❤️");
  }

  function compressImage(file, callback) {
    if (!file || !file.type.startsWith("image/")) { notify("Это не изображение — выбери JPG, PNG или WEBP."); return; }
    const reader = new FileReader();
    reader.onerror = () => notify("Не удалось прочитать файл.");
    reader.onload = e => {
      const img = new Image();
      img.onerror = () => notify("Файл повреждён или не является изображением.");
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const scale = Math.min(1, 1200 / Math.max(img.width, img.height));
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          callback(canvas.toDataURL("image/jpeg", 0.78));
        } catch { notify("Не удалось обработать изображение."); }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  function savePost(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = String(form.get("title") || "").trim();
    const text = String(form.get("text") || "").trim();
    const author = String(form.get("author") || "").trim() || "Анонимно";
    const file = form.get("photo");
    if (!title && !text && !(file && file.size) && !editingPost) return;
    const save = image => {
      if (editingPost) {
        setPosts(old => old.map(p => p.id === editingPost.id ? { ...p, title: title || p.title, text, author, image: image || p.image } : p));
        notify("История обновлена!");
      } else {
        setPosts(old => [{ id: Date.now(), title: title || "Новая история", text, author, image: image || "", date: new Date().toISOString() }, ...old]);
        notify("История опубликована!");
      }
      closeModal();
    };
    if (file && file.size) compressImage(file, save);
    else save("");
  }

  function addTransaction(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const amount = Number(form.get("amount"));
    if (!amount || amount <= 0) return;
    setTransactions(old => [{ id: Date.now(), kind: form.get("kind"), amount, title: String(form.get("title") || "").trim() || "Операция", date: new Date().toISOString() }, ...old]);
    closeModal();
    notify("Операция сохранена");
  }

  function del(kind, id) {
    const list = kind === "post" ? posts : kind === "event" ? events : transactions;
    const index = list.findIndex(x => x.id === id);
    if (index < 0) return;
    const item = list[index];
    const set = kind === "post" ? setPosts : kind === "event" ? setEvents : setTransactions;
    set(old => old.filter(x => x.id !== id));
    undoRef.current = { item, index, set };
    if (viewItem && viewItem.kind === kind && viewItem.id === id) closeModal();
    showToast("Запись удалена", true);
  }

  function undo() {
    const u = undoRef.current;
    if (!u) return;
    u.set(old => { const arr = [...old]; arr.splice(Math.min(u.index, arr.length), 0, u.item); return arr; });
    undoRef.current = null;
    notify("Возвращено");
  }

  function removeDemo() {
    setEvents(old => old.filter(x => !x.demo));
    setPosts(old => old.filter(x => !x.demo));
    setTransactions(old => old.filter(x => !x.demo));
    notify("Примеры удалены");
  }

  function editPost(post) { setEditingPost(post); setViewItem(null); setModal("post"); }
  function openView(item) { setViewItem(item); setModal("view"); }

  function openLink(url, label) {
    if (url) window.open(url, "_blank", "noopener");
    else notify(label + " пока не добавлена — её можно указать в админке.");
  }

  const CareIcon = careAction ? careAction.Icon : null;
  const total = posts.length + events.length;

  return <>
    <style>{CLAY_CSS}</style>
    <div className="cl-aura"/>
    <div className="cl-grain"/>
    <div className="cl-app">

      <header className="cl-top clay-dark">
        <a className="cl-brand" href="#top"><span className="cl-brand-ico"><PawPrint size={20}/></span> CHERNYSH<em>.</em></a>
        <nav className="cl-nav">
          <a href="#care" className={section === "care" ? "on" : ""}>Забота</a>
          <a href="#stories" className={section === "stories" ? "on" : ""}>Истории</a>
          <a href="#ledger" className={section === "ledger" ? "on" : ""}>Баланс</a>
        </nav>
        <button className="puff puff-coral puff-sm" onClick={() => openCare("feed")}><Plus size={15}/> Дело</button>
        <button className={"cl-gear" + (admin ? " on" : "")} aria-label="Управление" onClick={() => setAdmin(v => !v)}><Settings size={18}/></button>
      </header>

      <div className="cl-grid" id="top">

        <section className="cl-card cl-hero clay">
          <div className="cl-hero-copy">
            <span className="cl-eyebrow"><span className="cl-dot"/> {profile.location} · наш общий пёс</span>
            <h1 className="cl-letters">{profile.name.split("").map((ch, i) => <span key={i} style={{ color: LETTERS[i % LETTERS.length] }}>{ch === " " ? "\u00A0" : ch}</span>)}</h1>
            <p className="cl-hero-desc">{profile.description}</p>
            <div className="cl-hero-actions">
              <button className="puff puff-coral" onClick={() => openCare("feed")}><Utensils size={17}/> Покормить</button>
              <button className="puff puff-cream" onClick={() => setModal("post")}><Camera size={17}/> Поделиться</button>
            </div>
            <div className="cl-hero-note"><span className="cl-dot"/> Здесь каждый может помочь · {total} {plural(total, ["запись", "записи", "записей"])}</div>
          </div>
          <div className="cl-photo">
            {profile.photo ? <img src={profile.photo} alt="Черныш"/> : <div className="cl-photo-empty"><PawPrint size={46}/><span>Здесь будет фото Черныша</span><small>Добавь его в админке ⚙</small></div>}
            <div className="cl-sticker">хвост<br/>вверх!</div>
          </div>
        </section>

        <section className="cl-card cl-torus clay-slate">
          <span className="cl-screw cl-screw-tl"/><span className="cl-screw cl-screw-tr"/><span className="cl-screw cl-screw-bl"/><span className="cl-screw cl-screw-br"/>
          <span className="cl-eyebrow">Забота сегодня</span>
          <div className="cl-ring">
            <Donut segments={[{ value: todayTypes.size, color: "#ee7d5f" }]} total={TYPE_KEYS.length} size={200} stroke={34} track="rgba(244,238,226,.22)" round/>
            <div className="cl-ring-center"><b>{Math.round(todayProgress * 100)}%</b><span>{todayTypes.size} из {TYPE_KEYS.length} дел</span></div>
          </div>
          <div className="cl-torus-dots">
            {TYPE_KEYS.map(k => <span key={k} className={"cl-tdot" + (todayTypes.has(k) ? "" : " off")} style={{ background: TYPES[k].color }} title={TYPES[k].short}/>)}
          </div>
          <small>{todayTypes.size === TYPE_KEYS.length ? "Все дела закрыты — Черныш счастлив!" : "Отметь дело — кольцо заполнится"}</small>
        </section>

        <section className="cl-card cl-care clay" id="care">
          <div>
            <span className="cl-eyebrow">Маленькие дела — большая забота</span>
            <h2 className="cl-h">Ты уже помог?</h2>
          </div>
          <div className="cl-chips">
            <div className="cl-chip"><span>Кормление</span><b>{last("feed")}</b></div>
            <div className="cl-chip"><span>Вода</span><b>{last("water")}</b></div>
            <div className="cl-chip"><span>Прогулка</span><b>{last("walk")}</b></div>
          </div>
          <div className="cl-acts">
            {TYPE_KEYS.map(k => {
              const T = TYPES[k];
              return <button key={k} className={"cl-act puff " + T.puff} onClick={() => openCare(k)}>
                <span className="cl-act-ico"><T.Icon size={20}/></span>{T.short}
              </button>;
            })}
            <button className="cl-act puff puff-cream" onClick={() => setModal("post")}>
              <span className="cl-act-ico"><Camera size={20}/></span>Новость
            </button>
          </div>
        </section>

        <section className="cl-card cl-chart clay">
          <div>
            <span className="cl-eyebrow">Пульс недели</span>
            <h2 className="cl-h">Забота за 7 дней</h2>
          </div>
          <div className="cl-chart-body">
            <div className="cl-chart-ring">
              <Donut segments={weekCounts} total={weekTotal} size={150} stroke={26} track="#e2d9c6"/>
              <div className="cl-chart-center"><b>{weekTotal}</b><span>дел</span></div>
            </div>
            <div className="cl-legend">
              {weekCounts.map(s => <div className="cl-leg" key={s.key}><i style={{ background: s.color }}/>{s.label}<b>{s.value}</b></div>)}
            </div>
          </div>
          {weekTotal === 0 && <div className="cl-empty">Пока пусто — отметь первое дело заботы.</div>}
        </section>

        <section className="cl-card cl-money clay-dark">
          <span className="cl-screw cl-screw-tl"/><span className="cl-screw cl-screw-tr"/><span className="cl-screw cl-screw-bl"/><span className="cl-screw cl-screw-br"/>
          <div className="cl-money-top"><span className="cl-eyebrow">Открытая помощь</span><Wallet size={20}/></div>
          <div className="cl-balance">{fmt(balance)} ₽</div>
          <div className="cl-money-pills">
            <span className="cl-mpill cl-mpill-in">+{fmt(income)} ₽</span>
            <span className="cl-mpill cl-mpill-out">−{fmt(expense)} ₽</span>
          </div>
          <div className="cl-spark">
            <svg viewBox="0 0 220 64" preserveAspectRatio="none">
              <line x1="0" y1="32" x2="220" y2="32" stroke="rgba(244,238,226,.18)" strokeWidth="2" strokeDasharray="4 5"/>
              {spark.map((v, i) => {
                const h = Math.max(Math.abs(v) / sparkMax * 26, 3);
                const x = 12 + i * 30;
                return <rect key={i} x={x} y={v >= 0 ? 32 - h : 32} width="16" height={h} rx="7" fill={v >= 0 ? "#6fc7b2" : "#ee7d5f"}/>;
              })}
            </svg>
            <span>движение за неделю</span>
          </div>
          <a className="puff puff-cream puff-block" href="#ledger">Вся история <ArrowUpRight size={15}/></a>
        </section>

        <section className="cl-card cl-contact clay-mint">
          <div className="cl-contact-copy">
            <span className="cl-eyebrow">Мы на связи</span>
            <h2 className="cl-h">Есть вопрос? Хочешь помочь?</h2>
          </div>
          <div className="cl-contact-btns">
            <button className="puff puff-cream" onClick={() => openLink(profile.chat, "Ссылка на общий чат")}><MessageCircle size={16}/> Общий чат</button>
            <button className="puff puff-coral" onClick={() => openLink(profile.telegram || profile.vk, "Ссылка для помощи")}><Gift size={16}/> Помочь</button>
          </div>
        </section>

        <section className="cl-card cl-stories clay" id="stories">
          <div>
            <span className="cl-eyebrow">Жизнь, которую мы разделяем</span>
            <h2 className="cl-h">Истории Черныша</h2>
          </div>
          <div className="cl-toolbar">
            <div className="cl-search"><Search size={16}/><input className="cl-in" placeholder="Поиск по историям…" value={query} onChange={e => setQuery(e.target.value)}/></div>
            <div className="cl-tabs">
              <button className={"cl-tab" + (tab === "all" ? " on" : "")} onClick={() => setTab("all")}>Все</button>
              <button className={"cl-tab" + (tab === "post" ? " on" : "")} onClick={() => setTab("post")}>Истории</button>
              <button className={"cl-tab" + (tab === "event" ? " on" : "")} onClick={() => setTab("event")}>События</button>
            </div>
            <select className="cl-in cl-sort" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="new">Сначала новые</option>
              <option value="old">Сначала старые</option>
            </select>
            <span className="cl-count">{items.length} {plural(items.length, ["запись", "записи", "записей"])}</span>
          </div>
          <div className="cl-story-grid">
            {items.map(item => item.kind === "post" ? (
              <article className="cl-story" key={"p" + item.id} onClick={() => openView(item)}>
                {admin && <div className="cl-story-admin" onClick={e => e.stopPropagation()}>
                  <button className="cl-mini" aria-label="Изменить" onClick={() => editPost(item)}><Pencil size={14}/></button>
                  <button className="cl-mini cl-mini-danger" aria-label="Удалить" onClick={() => del("post", item.id)}><Trash2 size={14}/></button>
                </div>}
                {item.image ? <img className="cl-story-img" src={item.image} alt="История Черныша"/> : <div className="cl-story-noimg"><PawPrint size={32}/></div>}
                <div className="cl-story-body">
                  <div className="cl-story-meta"><span>История</span><span>{new Date(item.date).toLocaleDateString("ru-RU")}</span></div>
                  <h3>{item.title}</h3><p>{item.text}</p>
                  <div className="cl-story-author">Рассказывает: {item.author}</div>
                </div>
              </article>
            ) : (
              <article className="cl-story cl-event" key={"e" + item.id} onClick={() => openView(item)}>
                <span className="cl-event-ico" style={{ background: TYPES[item.type] ? TYPES[item.type].color : "#6fc7b2" }}>
                  {item.type === "feed" ? <Utensils size={20}/> : item.type === "water" ? <Droplets size={20}/> : item.type === "walk" ? <Footprints size={20}/> : item.type === "house" ? <House size={20}/> : <Heart size={20}/>}
                </span>
                <div className="cl-event-body">
                  <div className="cl-story-meta"><span>Событие</span><span>{shortDate(item.date)}</span></div>
                  <h3>{item.title}</h3><p>{item.text}</p>
                  <div className="cl-story-author">{item.author}</div>
                </div>
                {admin && <div className="cl-story-admin" onClick={e => e.stopPropagation()}>
                  <button className="cl-mini cl-mini-danger" aria-label="Удалить" onClick={() => del("event", item.id)}><Trash2 size={14}/></button>
                </div>}
              </article>
            ))}
            {tab !== "event" && !q && <button className="cl-add" onClick={() => setModal("post")}>
              <span className="cl-add-ico"><Plus size={22}/></span>
              У тебя есть фото или история?
              <span style={{ fontSize: 11, fontWeight: 600 }}>Поделись моментом с Чернышом</span>
            </button>}
          </div>
          {items.length === 0 && <div className="cl-empty">Ничего не нашлось. Попробуй другой запрос или вкладку.</div>}
        </section>

        <section className="cl-card cl-ledger clay" id="ledger">
          <div className="cl-ledger-head">
            <div>
              <span className="cl-eyebrow">Ничего не скрываем</span>
              <h2 className="cl-h">История баланса</h2>
            </div>
            {admin && <button className="puff puff-mint puff-sm" onClick={() => setModal("transaction")}><Plus size={14}/> Операция</button>}
          </div>
          {transactions.length === 0 ? <div className="cl-empty">Пока нет финансовых операций. История появится после первых записей.</div> : (
            <div className="cl-ledger-list">
              {transactions.map(x => <div className="cl-row" key={x.id}>
                <div className="cl-row-info"><b>{x.title}</b><small>{new Date(x.date).toLocaleDateString("ru-RU")}</small></div>
                <div className="cl-row-right">
                  <span className={"cl-amt " + (x.kind === "income" ? "cl-amt-in" : "cl-amt-out")}>{x.kind === "income" ? "+" : "−"}{fmt(x.amount)} ₽</span>
                  {admin && <button className="cl-mini cl-mini-danger" aria-label="Удалить" onClick={() => del("transaction", x.id)}><Trash2 size={13}/></button>}
                </div>
              </div>)}
            </div>
          )}
        </section>
      </div>

      <footer className="cl-foot clay-dark">
        <b><PawPrint size={16}/> CHERNYSH<em>.</em></b>
        <span>Сделано с заботой о Черныше · {profile.location} · {new Date().getFullYear()}</span>
      </footer>

      {toast && <div className="cl-toast clay-dark">
        <Check size={16}/><span>{toast.msg}</span>
        {toast.undo && <button className="puff puff-amber puff-sm" onClick={undo}><RotateCcw size={14}/> Вернуть</button>}
      </div>}

      {admin && <div className="cl-admin">
        <div className="cl-admin-head">
          <div><span className="cl-eyebrow">Private area</span><h2>Управление</h2></div>
          <button className="cl-mini" aria-label="Закрыть" onClick={() => setAdmin(false)}><X size={16}/></button>
        </div>
        <div className="cl-admin-body">
          <label className="cl-label">Основная фотография Черныша</label>
          <label className="cl-upload"><Upload size={20}/><span>Выбрать новое фото</span><small>JPG, PNG, WEBP</small>
            <input type="file" accept="image/*" onChange={e => compressImage(e.target.files[0], photo => { setProfile(p => ({ ...p, photo })); notify("Фотография обновлена"); })}/>
          </label>
          {profile.photo && <button className="cl-textbtn" onClick={() => setProfile(p => ({ ...p, photo: "" }))}><Trash2 size={13}/> Удалить основное фото</button>}
          <label className="cl-label">Имя</label>
          <input className="cl-in" value={profile.name} onChange={e => setProfile(p => ({ ...p, name: e.target.value }))}/>
          <label className="cl-label">Описание</label>
          <textarea className="cl-in" rows="3" value={profile.description} onChange={e => setProfile(p => ({ ...p, description: e.target.value }))}/>
          <label className="cl-label">Местоположение</label>
          <input className="cl-in" value={profile.location} onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}/>
          <label className="cl-label">Ссылка на общий VK-чат</label>
          <input className="cl-in" placeholder="https://vk.me/..." value={profile.chat} onChange={e => setProfile(p => ({ ...p, chat: e.target.value }))}/>
          <label className="cl-label">Telegram ответственного</label>
          <input className="cl-in" placeholder="https://t.me/..." value={profile.telegram} onChange={e => setProfile(p => ({ ...p, telegram: e.target.value }))}/>
          <label className="cl-label">VK ответственного</label>
          <input className="cl-in" placeholder="https://vk.com/..." value={profile.vk} onChange={e => setProfile(p => ({ ...p, vk: e.target.value }))}/>
          <button className="puff puff-mint puff-block" onClick={() => setModal("transaction")}><Plus size={15}/> Финансовая операция</button>
          <div className="cl-divider"/>
          <h3>Записи</h3>
          <p className="cl-sub">Удаляй и редактируй прямо на карточках — кнопки ✏️ и 🗑 появляются в режиме управления. После удаления есть 5 секунд, чтобы вернуть.</p>
          {hasDemo && <button className="cl-textbtn" onClick={removeDemo}><Trash2 size={13}/> Удалить все примеры записей</button>}
          <div className="cl-warn">Админка пока без авторизации. Скрытая кнопка — не защита для публичного сайта. Перед подключением общей базы закрой административные операции серверной авторизацией.</div>
        </div>
      </div>}

      {modal && <div className="cl-back" onMouseDown={e => { if (e.target === e.currentTarget) closeModal(); }}>
        <div className="cl-modal clay">
          <button className="cl-close" aria-label="Закрыть" onClick={closeModal}><X size={17}/></button>

          {modal === "care" && careAction && <>
            <span className="cl-eyebrow">Маленькое доброе дело</span>
            <div className="cl-care-head">
              <span className="cl-event-ico" style={{ background: careAction.color }}><CareIcon size={20}/></span>
              <h2>{careAction.label}</h2>
            </div>
            <p>Соседи увидят, что Черныш под присмотром. Комментарий по желанию.</p>
            <form onSubmit={addEvent}>
              <label className="cl-label">Как тебя указать?</label>
              <input className="cl-in" name="author" placeholder="Имя или анонимно" autoFocus/>
              <label className="cl-label">Комментарий</label>
              <textarea className="cl-in" name="text" rows="3" placeholder="Например: съел всю миску и просил ещё"/>
              <button className={"puff puff-block " + careAction.puff} type="submit">Записать <Check size={16}/></button>
            </form>
          </>}

          {modal === "post" && <>
            <span className="cl-eyebrow">{editingPost ? "Режим правки" : "Моменты из жизни"}</span>
            <h2>{editingPost ? "Редактировать историю" : "Расскажи о Черныше"}</h2>
            <p>{editingPost ? "Поправь текст или фото. Новое фото заменит текущее." : "Поделись фотографией, хорошей новостью или забавной историей."}</p>
            <form key={editingPost ? editingPost.id : "new"} onSubmit={savePost}>
              <label className="cl-label">Заголовок</label>
              <input className="cl-in" name="title" defaultValue={editingPost ? editingPost.title : ""} placeholder="Например: сегодня встретил друзей"/>
              <label className="cl-label">История</label>
              <textarea className="cl-in" name="text" rows="4" defaultValue={editingPost ? editingPost.text : ""} placeholder="Что интересного произошло?"/>
              <label className="cl-label">Как тебя указать?</label>
              <input className="cl-in" name="author" defaultValue={editingPost ? editingPost.author : ""} placeholder="Имя или анонимно"/>
              <label className="cl-file"><ImageIcon size={17}/> {editingPost && editingPost.image ? "Заменить фотографию" : "Добавить фотографию"}<input type="file" name="photo" accept="image/*"/></label>
              <button className="puff puff-coral puff-block" type="submit">{editingPost ? "Сохранить изменения" : "Опубликовать"} <ArrowUpRight size={15}/></button>
            </form>
          </>}

          {modal === "transaction" && <>
            <span className="cl-eyebrow">Финансы Черныша</span>
            <h2>Новая операция</h2>
            <form onSubmit={addTransaction}>
              <label className="cl-label">Тип операции</label>
              <select className="cl-in" name="kind"><option value="income">Поступление</option><option value="expense">Расход</option></select>
              <label className="cl-label">Сумма, ₽</label>
              <input className="cl-in" name="amount" type="number" min="1" step="1" required placeholder="1000"/>
              <label className="cl-label">Описание</label>
              <input className="cl-in" name="title" required placeholder="Например: покупка корма"/>
              <button className="puff puff-mint puff-block" type="submit">Сохранить операцию <Check size={16}/></button>
            </form>
          </>}

          {modal === "view" && viewItem && <>
            <span className="cl-badge" style={{ background: viewItem.kind === "post" ? "#9d88d6" : (TYPES[viewItem.type] ? TYPES[viewItem.type].color : "#6fc7b2") }}>
              {viewItem.kind === "post" ? "История" : "Событие"}
            </span>
            <h2>{viewItem.title}</h2>
            {viewItem.kind === "post" && (viewItem.image ? <img className="cl-view-img" src={viewItem.image} alt="История Черныша"/> : <div className="cl-view-noimg"><PawPrint size={36}/></div>)}
            <p style={{ fontSize: 14, lineHeight: 1.75 }}>{viewItem.text}</p>
            <div className="cl-view-meta"><span>✍ {viewItem.author}</span><span>·</span><span>{shortDate(viewItem.date)}</span></div>
            {admin && <div className="cl-view-actions">
              {viewItem.kind === "post" && <button className="puff puff-sky puff-sm" onClick={() => editPost(viewItem)}><Pencil size={14}/> Изменить</button>}
              <button className="puff puff-danger puff-sm" onClick={() => del(viewItem.kind, viewItem.id)}><Trash2 size={14}/> Удалить</button>
            </div>}
          </>}
        </div>
      </div>}
    </div>
  </>;
}

export default App;