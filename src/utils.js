// Mọi hàm ngẫu nhiên nhận thêm `rng` (mặc định Math.random).
// Các trò có màn dùng rng cố định theo số màn, để "màn 5" lần nào chơi cũng giống nhau.

// Bộ sinh số ngẫu nhiên có hạt giống (seed) — cùng seed cho cùng dãy số
export function makeRng(seed) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Số nguyên ngẫu nhiên trong [min, max]
export function randInt(min, max, rng = Math.random) {
  return min + Math.floor(rng() * (max - min + 1));
}

// Trộn ngẫu nhiên một mảng (không sửa mảng gốc)
export function shuffle(list, rng = Math.random) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Lấy ngẫu nhiên 1 phần tử, tránh trùng với `avoid` (nếu có thể)
export function pickOne(list, avoid, rng = Math.random) {
  const pool = list.length > 1 ? list.filter((x) => x !== avoid) : list;
  return pool[Math.floor(rng() * pool.length)];
}

// Lấy ngẫu nhiên n phần tử khác nhau
export function pickN(list, n, rng = Math.random) {
  return shuffle(list, rng).slice(0, n);
}

// Tạo 3 đáp án khác nhau: đáp án đúng + 2 số gần đó (trong khoảng 1..max)
export function makeOptions(answer, max = 10) {
  const pool = [answer - 2, answer - 1, answer + 1, answer + 2]
    .filter((n) => n >= 1 && n <= max)
    .sort(() => Math.random() - 0.5);
  return [answer, ...pool.slice(0, 2)].sort((a, b) => a - b);
}

// Tạo câu hỏi chọn 1 trong nhiều: đáp án đúng + các phương án sai lấy từ `others`
export function choicesWith(correct, others, total = 3, rng = Math.random) {
  return shuffle([correct, ...pickN(others, total - 1, rng)], rng);
}

// Lấy cấu hình độ khó theo số màn: tier cuối cùng có `from` <= level
export function tierFor(tiers, level) {
  return tiers.filter((t) => t.from <= level).pop() || tiers[0];
}

// Thay {key} trong câu bằng giá trị: fill("Màn {level}", { level: 3 }) → "Màn 3"
export function fill(text, values) {
  return text.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? "");
}
