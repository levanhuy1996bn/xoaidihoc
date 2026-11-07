// Lưu trữ cho Xoài phiêu lưu (LocalStorage)
import data from "../databases/adventure.json";

const KEY = "be-vui-adventure";   // xu, thú cưng, đồ, nhiệm vụ đã nhận, đảo đã thấy
const DAY_KEY = "be-vui-today";   // đếm hoạt động trong ngày + chuỗi ngày học

const dateKey = (d = new Date()) => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const yesterdayKey = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dateKey(d); };

function read(key) {
  try { return JSON.parse(localStorage.getItem(key)) || null; } catch { return null; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* bỏ qua */ }
}

// ---- Hoạt động trong ngày: { day, correct, stars, levels, care, streak, lastActive }
export function getToday() {
  const t = read(DAY_KEY) || {};
  const fresh = t.day === dateKey() ? t : { day: dateKey(), streak: t.streak || 0, lastActive: t.lastActive };
  // quá 1 ngày không học thì chuỗi ngày về 0
  const streak = fresh.lastActive === dateKey() || fresh.lastActive === yesterdayKey() ? fresh.streak || 0 : 0;
  return { correct: 0, stars: 0, levels: 0, care: 0, ...fresh, streak };
}

// Gọi khi bé trả lời đúng / nhận sao / vượt màn / chăm thú cưng
export function track(metric, n = 1) {
  if (!n) return;
  const t = getToday();
  if (t.lastActive !== t.day) { t.streak += 1; t.lastActive = t.day; }
  t[metric] = (t[metric] || 0) + n;
  write(DAY_KEY, t);
}

// ---- Đồ đạc của bé
export function loadSave() {
  const s = read(KEY) || {};
  const owned = Array.isArray(s.owned) && s.owned.length ? s.owned : [data.pets[0].id];
  return {
    ...data.start, petLevel: 1, seenIslands: [data.islands[0].id], ...s,
    owned, pet: owned.includes(s.pet) ? s.pet : owned[0],
    claimed: s.claimedDay === dateKey() && Array.isArray(s.claimed) ? s.claimed : [],
    claimedDay: dateKey(),
  };
}
export const saveSave = (s) => write(KEY, s);

export function resetAdventure() {
  try { localStorage.removeItem(KEY); localStorage.removeItem(DAY_KEY); } catch { /* bỏ qua */ }
}

// ---- Tính toán dùng chung
export const islandsOpen = (stars) => data.islands.filter((i) => stars >= i.need);
export function missionsDone(today = getToday()) {
  return data.missions.filter((m) => (today[m.metric] || 0) >= m.target).length;
}
