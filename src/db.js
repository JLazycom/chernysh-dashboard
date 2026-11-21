import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config";

const ok = typeof SUPABASE_URL === "string" && SUPABASE_URL.startsWith("https://") && typeof SUPABASE_ANON_KEY === "string" && SUPABASE_ANON_KEY.length > 40;
export const MODE = ok ? "shared" : "local";
const sb = ok ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
const TABLES = ["events", "posts", "transactions"];
const K = k => "chernysh_" + k;
const lread = (k, f) => { try { const v = JSON.parse(localStorage.getItem(K(k))); return v === null || v === undefined ? f : v; } catch { return f; } };
const lwrite = (k, v) => { try { localStorage.setItem(K(k), JSON.stringify(v)); } catch {} };
const ts = d => new Date(d).getTime() || 0;
const order = rows => (rows || []).slice().sort((a, b) => ts(b.date) - ts(a.date));
const daysAgo = n => new Date(Date.now() - n * 86400000).toISOString();

export const DEFAULT_PROFILE = {
  id: 1, name: "Черныш", location: "Курдумово",
  description: "Наш общий дворовый пёс. У него есть будка, миска и целая компания людей, которым он небезразличен. Отмечай заботу — все соседи увидят, что Черныш под присмотром.",
  photo: "", vk: "", telegram: "", chat: "", seeded: false
};

const SEED_EVENTS = [
  { id: 101, type: "feed", title: "Покормил", text: "Съел всю миску и просил ещё", author: "Пример записи", date: daysAgo(0), demo: true },
  { id: 102, type: "water", title: "Напоил", text: "Свежая вода после прогулки", author: "Пример записи", date: daysAgo(0), demo: true },
  { id: 103, type: "walk", title: "Выгулял", text: "До речки и обратно, хвост весь день вверх", author: "Пример записи", date: daysAgo(1), demo: true },
  { id: 104, type: "feed", title: "Покормил", text: "Ужин по расписанию", author: "Пример записи", date: daysAgo(1), demo: true },
  { id: 105, type: "house", title: "Проверил будку", text: "Подсыпал соломы, стало теплее", author: "Пример записи", date: daysAgo(2), demo: true },
  { id: 106, type: "help", title: "Помог", text: "Принёс новый поводок", author: "Пример записи", date: daysAgo(3), demo: true },
  { id: 107, type: "walk", title: "Выгулял", text: "Бегал за палкой минут двадцать", author: "Пример записи", date: daysAgo(4), demo: true }
];
const SEED_POSTS = [
  { id: 201, title: "Добро пожаловать на страничку Черныша!", text: "Здесь мы собираем фотографии, забавные истории и новости о его жизни. Записи общие — их видят все с любого устройства.", author: "Команда Черныша", image: "", date: daysAgo(2), demo: true },
  { id: 202, title: "Первый снег", text: "Черныш носился по двору как щенок и ловил снежинки. Кажется, зима ему по душе.", author: "Пример записи", image: "", date: daysAgo(5), demo: true }
];
const SEED_TX = [
  { id: 301, kind: "income", amount: 1500, title: "Сбор на корм от соседей", date: daysAgo(6), demo: true },
  { id: 302, kind: "expense", amount: 980, title: "Мешок корма 15 кг", date: daysAgo(5), demo: true },
  { id: 303, kind: "income", amount: 700, title: "Перевод от Ани", date: daysAgo(3), demo: true },
  { id: 304, kind: "expense", amount: 350, title: "Солома в будку", date: daysAgo(2), demo: true },
  { id: 305, kind: "income", amount: 500, title: "Копилка у калитки", date: daysAgo(1), demo: true }
];

export async function fetchTable(t) {
  if (!sb) {
    if (t === "profile") return { ...DEFAULT_PROFILE, ...lread("profile", {}) };
    return order(lread(t, []));
  }
  if (t === "profile") {
    const { data, error } = await sb.from("profile").select("*").eq("id", 1).maybeSingle();
    if (error) throw error;
    return data ? { ...DEFAULT_PROFILE, ...data } : null;
  }
  const { data, error } = await sb.from(t).select("*").order("date", { ascending: false }).limit(500);
  if (error) throw error;
  return order(data);
}

export async function loadAll() {
  if (!sb) {
    const p = { ...DEFAULT_PROFILE, ...lread("profile", {}) };
    let ev = lread("events", null), po = lread("posts", null), tx = lread("transactions", null);
    if (ev === null && po === null) {
      ev = SEED_EVENTS; po = SEED_POSTS; tx = SEED_TX;
      lwrite("events", ev); lwrite("posts", po); lwrite("transactions", tx);
    }
    return { profile: p, events: order(ev), posts: order(po), transactions: order(tx || []) };
  }
  let p = await fetchTable("profile");
  if (!p) {
    const { error } = await sb.from("profile").upsert({ ...DEFAULT_PROFILE, seeded: false });
    if (error) throw error;
    p = { ...DEFAULT_PROFILE, seeded: false };
  }
  let [ev, po, tx] = await Promise.all(TABLES.map(fetchTable));
  if (!p.seeded && ev.length === 0 && po.length === 0) {
    const res = await Promise.all([
      sb.from("events").upsert(SEED_EVENTS),
      sb.from("posts").upsert(SEED_POSTS),
      sb.from("transactions").upsert(SEED_TX)
    ]);
    const bad = res.find(x => x.error);
    if (bad) throw bad.error;
    await sb.from("profile").update({ seeded: true }).eq("id", 1);
    [ev, po, tx] = await Promise.all(TABLES.map(fetchTable));
    p = { ...p, seeded: true };
  }
  return { profile: p, events: ev, posts: po, transactions: tx };
}

export async function insertRow(t, row) {
  if (!sb) { lwrite(t, [row, ...lread(t, [])]); return row; }
  const { error } = await sb.from(t).insert(row);
  if (error) throw error;
  return row;
}

export async function updateRow(t, id, patch) {
  if (!sb) { lwrite(t, lread(t, []).map(x => x.id === id ? { ...x, ...patch } : x)); return; }
  const { error } = await sb.from(t).update(patch).eq("id", id);
  if (error) throw error;
}

export async function deleteRow(t, id) {
  if (!sb) { lwrite(t, lread(t, []).filter(x => x.id !== id)); return; }
  const { error } = await sb.from(t).delete().eq("id", id);
  if (error) throw error;
}

export async function deleteDemo() {
  if (!sb) { TABLES.forEach(t => lwrite(t, lread(t, []).filter(x => !x.demo))); return; }
  const res = await Promise.all(TABLES.map(t => sb.from(t).delete().eq("demo", true)));
  const bad = res.find(x => x.error);
  if (bad) throw bad.error;
}

export async function saveProfile(patch) {
  const clean = { ...patch };
  delete clean.id;
  if (!sb) { lwrite("profile", { ...lread("profile", {}), ...clean }); return; }
  const { error } = await sb.from("profile").upsert({ id: 1, ...clean });
  if (error) throw error;
}

export async function uploadPhoto(dataUrl) {
  if (!sb) return dataUrl;
  const bin = atob(dataUrl.split(",")[1]);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  const blob = new Blob([arr], { type: "image/jpeg" });
  const path = "p/" + Date.now() + "-" + Math.random().toString(36).slice(2, 8) + ".jpg";
  const { error } = await sb.storage.from("photos").upload(path, blob, { contentType: "image/jpeg", upsert: false });
  if (error) throw error;
  const { data } = sb.storage.from("photos").getPublicUrl(path);
  return data.publicUrl;
}

export function subscribe(onChange, onStatus) {
  if (!sb) { if (onStatus) onStatus(false); return () => {}; }
  const name = "chernysh-live-" + Math.random().toString(36).slice(2, 8);
  const ch = sb.channel(name);
  ["profile", ...TABLES].forEach(t => {
    ch.on("postgres_changes", { event: "*", schema: "public", table: t }, () => onChange(t));
  });
  ch.subscribe(status => { if (onStatus) onStatus(status === "SUBSCRIBED"); });
  return () => { try { sb.removeChannel(ch); } catch {} };
}