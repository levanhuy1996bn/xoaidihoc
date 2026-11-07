// Lưu tiến độ các trò có màn trong LocalStorage:
// { "<id trò>": { "<số màn>": <số sao cao nhất 1–3> } }
const KEY = "be-vui-levels";

function readAll() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}
function writeAll(all) {
  try { localStorage.setItem(KEY, JSON.stringify(all)); } catch { /* bỏ qua nếu trình duyệt chặn */ }
}

export function getProgress(gameId) {
  return readAll()[gameId] || {};
}

// Lưu số sao của một màn, chỉ giữ kết quả cao nhất. Trả về số sao được cộng thêm.
export function saveStars(gameId, level, stars) {
  const all = readAll();
  const game = all[gameId] || {};
  const old = game[level] || 0;
  if (stars > old) {
    game[level] = stars;
    all[gameId] = game;
    writeAll(all);
  }
  return Math.max(0, stars - old);
}

// Số màn đã qua liên tiếp từ màn 1 (màn tiếp theo là màn được mở khóa)
export function clearedCount(progress) {
  let n = 0;
  while (progress[n + 1]) n++;
  return n;
}

export function starTotal(progress) {
  return Object.values(progress).reduce((sum, s) => sum + s, 0);
}

export function levelsCleared() {
  return Object.values(readAll()).reduce((sum, g) => sum + Object.keys(g).length, 0);
}

export function resetProgress() {
  try { localStorage.removeItem(KEY); } catch { /* bỏ qua */ }
}
