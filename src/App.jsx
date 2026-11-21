import React, { useEffect, useRef, useState } from "react";
import {
  PawPrint, Utensils, Droplets, Footprints, House, Heart,
  Camera, MessageCircle, Gift, Settings, Plus, X, Check,
  Image as ImageIcon, Wallet, ArrowUpRight, Trash2, Pencil,
  Upload, Search, RotateCcw, RefreshCw, Cloud, CloudOff
} from "lucide-react";
import "./clay.css";
import { MODE, DEFAULT_PROFILE, loadAll, fetchTable, insertRow, updateRow, deleteRow, deleteDemo, saveProfile, uploadPhoto, subscribe } from "./db";

const LETTERS = ["#ee7d5f", "#f5a962", "#4fae97", "#619cc9", "#9d88d6", "#e88fa2"];
const TYPES = {
  feed: { label: "Покормил", short: "Корм", color: "#ee7d5f", puff: "puff-coral", Icon: Utensils },
  water: { label: "Напоил", short: "Вода", color: "#7fb5e0", puff: "puff-sky", Icon: Droplets },
  walk: { label: "Выгулял", short: "Прогулка", color: "#f5a962", puff: "puff-amber", Icon: Footprints },
  house: { label: "Проверил будку", short: "Будка", color: "#b9a7e8", puff: "puff-lav", Icon: House },
  help: { label: "Помог", short: "Помощь", color: "#6fc7b2", puff: "puff-mint", Icon: Heart }
};
const TYPE_KEYS = Object.keys(TYPES);
const fmt = n => Number(n || 0).toLocaleString("ru-RU");
const ts = d => new Date(d).getTime() || 0;
const plural = (n, f) => { const a = Math.abs(n) % 100, b = a % 10; if (a > 10 && a < 20) return f[2]; if (b > 1 && b < 5) return f[1]; if (b === 1) return f[0]; return f[2]; };
const sameDay = (a, b) => new Date(a).toDateString() === new Date(b).toDateString();
const shortDate = d => new Date(d).toLocaleString("ru-RU", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

function Donut({ segments, total, size, stroke, track, round }) {
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const list = segments.filter(s => s.value > 0);
  let acc = 0;
  return <svg viewBox={"0 0 " + size + " " + size}>
    <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth={stroke}/>
    {total > 0 && list.map((s, i) => {
      const frac = s.value / total;
      const dash = Math.max(frac * C - (list.length > 1 ? 3 : 0), 0.5);
      const el = <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none" stroke={s.color} strokeWidth={stroke} strokeDasharray={dash + " " + (C - dash)} strokeDashoffset={-acc * C} strokeLinecap={round ? "round" : "butt"} transform={"rotate(-90 " + size / 2 + " " + size / 2 + ")"}/>;
      acc += frac;
      return el;
    })}
  </svg>;
}

function compressImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) { reject(new Error("это не изображение")); return; }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("файл не читается"));
    reader.onload = ev => {
      const img = new Image();
      img.onerror = () => reject(new Error("файл повреждён"));
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          const scale = Math.min(1, 1200 / Math.max(img.width, img.height));
          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));
          canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.78));
        } catch { reject(new Error("фото не обработалось")); }
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  });
}

function App() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [events, setEvents] = useState([]);
  const [posts, setPosts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const [busy, setBusy] = useState(false);
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
  const profileTimer = useRef(null);
  const setters = { events: setEvents, posts: setPosts, transactions: setTransactions };

  function showToast(msg, withUndo) {
    setToast({ msg, undo: !!withUndo });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => { setToast(null); if (withUndo) undoRef.current = null; }, 5600);
  }
  const notify = m => showToast(m, false);
  const fail = e => notify("Не сохранилось: " + ((e && e.message) || "проверь соединение"));

  async function refresh() {
    setBusy(true);
    try {
      const d = await loadAll();
      setProfile(d.profile); setEvents(d.events); setPosts(d.posts); setTransactions(d.transactions);
      notify("Обновлено");
    } catch (e) { fail(e); }
    setReady(true);
    setBusy(false);
  }

  useEffect(() => {
    let alive = true;
    loadAll().then(d => {
      if (!alive) return;
      setProfile(d.profile); setEvents(d.events); setPosts(d.posts); setTransactions(d.transactions); setReady(true);
    }).catch(e => { if (alive) { setReady(true); fail(e); } });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const timers = {};
    const off = subscribe(table => {
      clearTimeout(timers[table]);
      timers[table] = setTimeout(() => {
        fetchTable(table).then(d => {
          if (table === "profile") { if (d) setProfile(d); }
          else if (setters[table]) setters[table](d);
        }).catch(() => {});
      }, 220);
    }, setLive);
    return () => { Object.keys(timers).forEach(k => clearTimeout(timers[k])); off(); };
  }, []);

  useEffect(() => () => { clearTimeout(toastTimer.current); clearTimeout(profileTimer.current); }, []);

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
    const obs = new IntersectionObserver(en => { en.forEach(x => { if (x.isIntersecting) setSection(x.target.id); }); }, { rootMargin: "-35% 0px -55% 0px" });
    ["care", "stories", "ledger"].forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [ready]);

  function patchProfile(patch) {
    setProfile(p => ({ ...p, ...patch }));
    clearTimeout(profileTimer.current);
    profileTimer.current = setTimeout(() => { saveProfile(patch).catch(fail); }, 600);
  }

  const balance = transactions.reduce((s, x) => s + (x.kind === "income" ? Number(x.amount) : -Number(x.amount)), 0);
  const income = transactions.filter(x => x.kind === "income").reduce((s, x) => s + Number(x.amount), 0);
  const expense = transactions.filter(x => x.kind === "expense").reduce((s, x) => s + Number(x.amount), 0);
  const hasDemo = events.some(x => x.demo) || posts.some(x => x.demo) || transactions.some(x => x.demo);
  const now = Date.now();
  const todayTypes = new Set(events.filter(x => sameDay(x.date, now)).map(x => x.type));
  const todayProgress = todayTypes.size / TYPE_KEYS.length;
  const week = events.filter(x => now - ts(x.date) < 7 * 86400000);
  const weekCounts = TYPE_KEYS.map(k => ({ key: k, value: week.filter(x => x.type === k).length, color: TYPES[k].color, label: TYPES[k].short }));
  const weekTotal = week.length;
  const spark = [];
  for (let i = 6; i >= 0; i--) {
    const day = now - i * 86400000;
    spark.push(transactions.filter(x => sameDay(x.date, day)).reduce((s, x) => s + (x.kind === "income" ? Number(x.amount) : -Number(x.amount)), 0));
  }
  const sparkMax = Math.max(...spark.map(v => Math.abs(v)), 1);
  const last = type => { const it = events.find(x => x.type === type); return it ? shortDate(it.date) : "пока нет"; };
  const q = query.trim().toLowerCase();
  const match = x => !q || [x.title, x.text, x.author].join(" ").toLowerCase().includes(q);
  let items = tab === "all" ? [...posts.map(p => ({ ...p, kind: "post" })), ...events.map(e => ({ ...e, kind: "event" }))] : tab === "post" ? posts.map(p => ({ ...p, kind: "post" })) : events.map(e => ({ ...e, kind: "event" }));
  items = items.filter(match).sort((a, b) => sort === "new" ? ts(b.date) - ts(a.date) : ts(a.date) - ts(b.date));

  function openCare(type) { setCareAction({ type, ...TYPES[type] }); setModal("care"); }

  async function addEvent(e) {
    e.preventDefault();
    if (!careAction) return;
    const f = new FormData(e.currentTarget);
    const author = String(f.get("author") || "").trim() || "Анонимно";
    const note = String(f.get("text") || "").trim();
    const row = { id: Date.now(), type: careAction.type, title: careAction.label, text: note || careAction.label + " — Черныш под присмотром.", author, date: new Date().toISOString(), demo: false };
    const prev = events;
    setEvents([row, ...prev]);
    closeModal();
    showToast("Записано для всех", false);
    try { await insertRow("events", row); } catch (err) { setEvents(prev); fail(err); }
  }

  async function savePost(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const title = String(f.get("title") || "").trim();
    const text = String(f.get("text") || "").trim();
    const author = String(f.get("author") || "").trim() || "Анонимно";
    const file = f.get("photo");
    const editing = editingPost;
    if (!title && !text && !(file && file.size) && !editing) return;
    closeModal();
    setBusy(true);
    try {
      let image = "";
      if (file && file.size) image = await uploadPhoto(await compressImage(file));
      if (editing) {
        const patch = { title: title || editing.title, text, author, image: image || editing.image };
        const prev = posts;
        setPosts(old => old.map(p => p.id === editing.id ? { ...p, ...patch } : p));
        try { await updateRow("posts", editing.id, patch); showToast("История обновлена для всех", false); } catch (err) { setPosts(prev); fail(err); }
      } else {
        const row = { id: Date.now(), title: title || "Новая история", text, author, image, date: new Date().toISOString(), demo: false };
        const prev = posts;
        setPosts([row, ...prev]);
        try { await insertRow("posts", row); showToast("История опубликована для всех", false); } catch (err) { setPosts(prev); fail(err); }
      }
    } catch (err) { fail(err); }
    setBusy(false);
  }

  async function addTransaction(e) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const amount = Number(f.get("amount"));
    if (!amount || amount <= 0) return;
    const row = { id: Date.now(), kind: f.get("kind"), amount, title: String(f.get("title") || "").trim() || "Операция", date: new Date().toISOString(), demo: false };
    const prev = transactions;
    setTransactions([row, ...prev]);
    closeModal();
    showToast("Операция сохранена для всех", false);
    try { await insertRow("transactions", row); } catch (err) { setTransactions(prev); fail(err); }
  }

  async function del(kind, id) {
    const table = kind === "post" ? "posts" : kind === "event" ? "events" : "transactions";
    const list = table === "posts" ? posts : table === "events" ? events : transactions;
    const index = list.findIndex(x => x.id === id);
    if (index < 0) return;
    const row = list[index];
    const set = setters[table];
    set(list.filter(x => x.id !== id));
    undoRef.current = { table, row, index, set };
    if (viewItem && viewItem.id === id) closeModal();
    showToast("Удалено у всех", true);
    try { await deleteRow(table, id); } catch (err) { set(list); fail(err); }
  }

  async function undo() {
    const u = undoRef.current;
    if (!u) return;
    undoRef.current = null;
    const arr = [...(u.table === "posts" ? posts : u.table === "events" ? events : transactions)];
    arr.splice(Math.min(u.index, arr.length), 0, u.row);
    u.set(arr);
    notify("Возвращено");
    try { await insertRow(u.table, u.row); } catch (err) { fail(err); }
  }

  async function removeDemo() {
    const pe = events, pp = posts, pt = transactions;
    setEvents(pe.filter(x => !x.demo)); setPosts(pp.filter(x => !x.demo)); setTransactions(pt.filter(x => !x.demo));
    notify("Примеры удалены у всех");
    try { await deleteDemo(); } catch (err) { setEvents(pe); setPosts(pp); setTransactions(pt); fail(err); }
  }

  async function setMainPhoto(file) {
    setBusy(true);
    try {
      const url = await uploadPhoto(await compressImage(file));
      setProfile(p => ({ ...p, photo: url }));
      await saveProfile({ photo: url });
      showToast("Фото обновлено для всех", false);
    } catch (err) { fail(err); }
    setBusy(false);
  }

  function editPost(p) { setEditingPost(p); setViewItem(null); setModal("post"); }
  function openView(i) { setViewItem(i); setModal("view"); }
  function openLink(url, label) {
    if (url) window.open(url, "_blank", "noopener");
    else notify(label + " пока не добавлена — её можно указать в админке.");
  }

  const CareIcon = careAction ? careAction.Icon : null;
  const total = posts.length + events.length;
  const syncClass = MODE === "shared" ? (live ? "on" : "") : "off";
  const syncText = MODE === "shared" ? (live ? "Общая база · онлайн" : "Общая база · подключение") : "Только этот браузер";

  return <>
    <div className="cl-aura"/>
    <div className="cl-grain"/>
    <div className="cl-app">
      <header className="cl-top clay-dark">
        <a className="cl-brand" href="#top"><span className="cl-brand-ico"><PawPrint size={20}/></span> CHERNYSH<em>.</em></a>
        <span className={"cl-sync " + syncClass}><i/>{MODE === "shared" ? <Cloud size={13}/> : <CloudOff size={13}/>}{syncText}</span>
        <nav className="cl-nav">
          <a href="#care" className={section === "care" ? "on" : ""}>Забота</a>
          <a href="#stories" className={section === "stories" ? "on" : ""}>Истории</a>
          <a href="#ledger" className={section === "ledger" ? "on" : ""}>Баланс</a>
        </nav>
        <button className={"cl-gear" + (busy ? " spin" : "")} aria-label="Обновить" onClick={refresh}><RefreshCw size={17}/></button>
        <button className="puff puff-coral puff-sm" onClick={() => openCare("feed")}><Plus size={15}/> Дело</button>
        <button className={"cl-gear" + (admin ? " on" : "")} aria-label="Управление" onClick={() => setAdmin(v => !v)}><Settings size={18}/></button>
      </header>

      {MODE === "local" && <div className="cl-banner">Локальный режим: ключи Supabase не заданы, записи видны только в этом браузере. Запусти скрипт настройки ещё раз и вставь Project URL и anon key.</div>}

      <div className="cl-grid" id="top">
        <section className="cl-card cl-hero clay">
          <div className="cl-hero-copy">
            <span className="cl-eyebrow"><span className="cl-dot"/> {profile.location} · наш общий пёс</span>
            <h1 className="cl-letters">{String(profile.name || "Черныш").split("").map((ch, i) => <span key={i} style={{ color: LETTERS[i % LETTERS.length] }}>{ch === " " ? "\u00A0" : ch}</span>)}</h1>
            <p className="cl-hero-desc">{profile.description}</p>
            <div className="cl-hero-actions">
              <button className="puff puff-coral" onClick={() => openCare("feed")}><Utensils size={17}/> Покормить</button>
              <button className="puff puff-cream" onClick={() => setModal("post")}><Camera size={17}/> Поделиться</button>
            </div>
            <div className="cl-hero-note"><span className="cl-dot"/> {MODE === "shared" ? "Записи видят все соседи" : "Записи видны только здесь"} · {total} {plural(total, ["запись", "записи", "записей"])}</div>
          </div>
          <div className="cl-photo">
            {profile.photo ? <img src={profile.photo} alt="Черныш"/> : <div className="cl-photo-empty"><PawPrint size={46}/><span>Здесь будет фото Черныша</span><small>Добавь его в админке</small></div>}
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
          <small>{todayTypes.size === TYPE_KEYS.length ? "Все дела закрыты — Черныш счастлив!" : "Отметь дело — кольцо заполнится у всех"}</small>
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
            {TYPE_KEYS.map(k => { const T = TYPES[k]; return <button key={k} className={"cl-act puff " + T.puff} onClick={() => openCare(k)}><span className="cl-act-ico"><T.Icon size={20}/></span>{T.short}</button>; })}
            <button className="cl-act puff puff-cream" onClick={() => setModal("post")}><span className="cl-act-ico"><Camera size={20}/></span>Новость</button>
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
          {!ready ? <div className="cl-skel" style={{ height: 44 }}/> : weekTotal === 0 && <div className="cl-empty">Пока пусто — отметь первое дело заботы.</div>}
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
              {spark.map((v, i) => { const h = Math.max(Math.abs(v) / sparkMax * 26, 3); return <rect key={i} x={12 + i * 30} y={v >= 0 ? 32 - h : 32} width="16" height={h} rx="7" fill={v >= 0 ? "#6fc7b2" : "#ee7d5f"}/>; })}
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
          {!ready ? <div className="cl-story-grid"><div className="cl-skel"/><div className="cl-skel"/></div> : <>
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
          </>}
        </section>

        <section className="cl-card cl-ledger clay" id="ledger">
          <div className="cl-ledger-head">
            <div>
              <span className="cl-eyebrow">Ничего не скрываем</span>
              <h2 className="cl-h">История баланса</h2>
            </div>
            {admin && <button className="puff puff-mint puff-sm" onClick={() => setModal("transaction")}><Plus size={14}/> Операция</button>}
          </div>
          {!ready ? <div className="cl-skel" style={{ height: 120 }}/> : transactions.length === 0 ? <div className="cl-empty">Пока нет финансовых операций. История появится после первых записей.</div> : (
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
        <span>Сделано с заботой о Черныше · {profile.location} · {MODE === "shared" ? "общая база для всех соседей" : "локальный режим"}</span>
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
          <label className="cl-upload"><Upload size={20}/><span>{busy ? "Загрузка…" : "Выбрать новое фото"}</span><small>JPG, PNG, WEBP</small>
            <input type="file" accept="image/*" disabled={busy} onChange={e => { const f = e.target.files[0]; if (f) setMainPhoto(f); e.target.value = ""; }}/>
          </label>
          {profile.photo && <button className="cl-textbtn" onClick={() => { setProfile(p => ({ ...p, photo: "" })); saveProfile({ photo: "" }).catch(fail); }}><Trash2 size={13}/> Удалить основное фото</button>}
          <label className="cl-label">Имя</label>
          <input className="cl-in" value={profile.name} onChange={e => patchProfile({ name: e.target.value })}/>
          <label className="cl-label">Описание</label>
          <textarea className="cl-in" rows="3" value={profile.description} onChange={e => patchProfile({ description: e.target.value })}/>
          <label className="cl-label">Местоположение</label>
          <input className="cl-in" value={profile.location} onChange={e => patchProfile({ location: e.target.value })}/>
          <label className="cl-label">Ссылка на общий VK-чат</label>
          <input className="cl-in" placeholder="https://vk.me/..." value={profile.chat} onChange={e => patchProfile({ chat: e.target.value })}/>
          <label className="cl-label">Telegram ответственного</label>
          <input className="cl-in" placeholder="https://t.me/..." value={profile.telegram} onChange={e => patchProfile({ telegram: e.target.value })}/>
          <label className="cl-label">VK ответственного</label>
          <input className="cl-in" placeholder="https://vk.com/..." value={profile.vk} onChange={e => patchProfile({ vk: e.target.value })}/>
          <button className="puff puff-mint puff-block" onClick={() => setModal("transaction")}><Plus size={15}/> Финансовая операция</button>
          <div className="cl-divider"/>
          <h3>Записи</h3>
          <p className="cl-sub">Правь и удаляй прямо на карточках — карандаш и корзина появляются в режиме управления. После удаления есть несколько секунд, чтобы вернуть.</p>
          {hasDemo && <button className="cl-textbtn" onClick={removeDemo}><Trash2 size={13}/> Удалить все примеры записей</button>}
          <div className="cl-warn">{MODE === "shared" ? "База общая: записи видит и меняет любой, у кого есть ссылка на сайт. Шестерёнка — не пароль. Для настоящей защиты нужен вход по аккаунту." : "Ключи Supabase не заданы — всё хранится только в этом браузере."}</div>
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
            <p>Запись появится у всех соседей сразу. Комментарий по желанию.</p>
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
            <span className="cl-badge" style={{ background: viewItem.kind === "post" ? "#9d88d6" : (TYPES[viewItem.type] ? TYPES[viewItem.type].color : "#6fc7b2") }}>{viewItem.kind === "post" ? "История" : "Событие"}</span>
            <h2>{viewItem.title}</h2>
            {viewItem.kind === "post" && (viewItem.image ? <img className="cl-view-img" src={viewItem.image} alt="История Черныша"/> : <div className="cl-view-noimg"><PawPrint size={36}/></div>)}
            <p style={{ fontSize: 14, lineHeight: 1.75 }}>{viewItem.text}</p>
            <div className="cl-view-meta"><span>{viewItem.author}</span><span>·</span><span>{shortDate(viewItem.date)}</span></div>
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