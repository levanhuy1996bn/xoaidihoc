// Trộn ngẫu nhiên một mảng (không sửa mảng gốc)
export function shuffle(list) {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Lấy ngẫu nhiên 1 phần tử, tránh trùng với `avoid` (nếu có thể)
export function pickOne(list, avoid) {
  const pool = list.length > 1 ? list.filter((x) => x !== avoid) : list;
  return pool[Math.floor(Math.random() * pool.length)];
}

// Lấy ngẫu nhiên n phần tử khác nhau
export function pickN(list, n) {
  return shuffle(list).slice(0, n);
}

// Tạo 3 đáp án khác nhau: đáp án đúng + 2 số gần đó (trong khoảng 1..max)
export function makeOptions(answer, max = 10) {
  const pool = [answer - 2, answer - 1, answer + 1, answer + 2]
    .filter((n) => n >= 1 && n <= max)
    .sort(() => Math.random() - 0.5);
  return [answer, ...pool.slice(0, 2)].sort((a, b) => a - b);
}

// Tạo câu hỏi chọn 1 trong nhiều: đáp án đúng + các phương án sai lấy từ `others`
export function choicesWith(correct, others, total = 3) {
  return shuffle([correct, ...pickN(others, total - 1)]);
}
