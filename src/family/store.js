// Dữ liệu và lưu trữ cho Lớp học gia đình
import data from "../databases/family.json";

// Ảnh: src/assets/family/<id>.jpg (ảnh nhỏ ~360px, tạo bằng scripts/shrink-images.py)
const photos = import.meta.glob("../assets/family/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", { eager: true, import: "default" });
const photoOf = (id) => Object.entries(photos).find(([p]) => p.split("/").pop().split(".")[0] === id)?.[1];

export const members = data.members.map((m) => ({ ...m, photo: photoOf(m.id) }));
export const byId = Object.fromEntries(members.map((m) => [m.id, m]));
export const SEAT_COUNT = Math.ceil((members.length + 2) / 2) * 2; // thêm 1 bàn trống để chuyển chỗ

const KEYS = { seats: "dua-gop-seats", attendance: "dua-gop-attendance", stars: "dua-gop-stars" };
function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}
function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* bỏ qua */ }
}

// ---- Chỗ ngồi: mảng SEAT_COUNT phần tử, mỗi phần tử là id thành viên hoặc null (ghế trống)
export function defaultSeats() {
  return Array.from({ length: SEAT_COUNT }, (_, i) => members[i]?.id ?? null);
}
export function loadSeats() {
  const saved = read(KEYS.seats, null);
  if (!Array.isArray(saved)) return defaultSeats();
  // bỏ người không còn trong danh sách, thêm người mới vào ghế trống
  const seats = Array.from({ length: SEAT_COUNT }, (_, i) => (byId[saved[i]] ? saved[i] : null));
  const seen = new Set();
  seats.forEach((id, i) => { if (id && seen.has(id)) seats[i] = null; else if (id) seen.add(id); });
  for (const m of members) if (!seen.has(m.id)) { const free = seats.indexOf(null); if (free >= 0) seats[free] = m.id; }
  return seats;
}
export const saveSeats = (seats) => write(KEYS.seats, seats);

// ---- Điểm danh theo ngày: sang ngày mới thì mặc định cả lớp có mặt
const today = () => new Date().toLocaleDateString("vi-VN");
export function loadPresent() {
  const a = read(KEYS.attendance, null);
  if (!a || a.date !== today()) return members.map((m) => m.id);
  return a.present.filter((id) => byId[id]);
}
export const savePresent = (present) => write(KEYS.attendance, { date: today(), present });

// ---- Sao của lớp: { id: số sao }
export const loadStars = () => read(KEYS.stars, {});
export const saveStars = (stars) => write(KEYS.stars, stars);

export const classInfo = { name: data.className, bell: data.bell, answerSeconds: data.answerSeconds, funQuestions: data.funQuestions };
