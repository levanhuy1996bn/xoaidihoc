// Tiếng hiệu ứng ngắn, tạo bằng Web Audio (không cần file âm thanh, không tải thêm gì).
// Dùng thay cho câu đọc ở những chỗ bé thao tác liên tục, để giọng đọc không bị chồng lên nhau.
let ctx = null;
function audio() {
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  } catch { return null; }
}

// Một nốt nhạc: tần số (Hz), bắt đầu sau `at` giây, dài `len` giây
function note(ac, freq, at, len, { type = "sine", volume = 0.18 } = {}) {
  const t = ac.currentTime + at;
  const osc = ac.createOscillator(), gain = ac.createGain();
  osc.type = type; osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(volume, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + len);
  osc.connect(gain).connect(ac.destination);
  osc.start(t); osc.stop(t + len + 0.05);
}

// "Ting!" khi đặt đúng một món
export function playCorrect() {
  const ac = audio(); if (!ac) return;
  note(ac, 880, 0, 0.18, { type: "triangle" });
  note(ac, 1320, 0.08, 0.28, { type: "triangle" });
}

// "Bụp" nhẹ khi đặt sai (không làm bé sợ)
export function playWrong() {
  const ac = audio(); if (!ac) return;
  note(ac, 220, 0, 0.22, { type: "sine", volume: 0.2 });
  note(ac, 180, 0.1, 0.25, { type: "sine", volume: 0.15 });
}

// Nhạc chúc mừng khi xong màn: đô–mi–son–đô + tiếng lấp lánh
export function playWin() {
  const ac = audio(); if (!ac) return;
  [523, 659, 784, 1047].forEach((f, i) => note(ac, f, i * 0.13, 0.35, { type: "triangle", volume: 0.2 }));
  note(ac, 1047, 0.55, 0.7, { type: "triangle", volume: 0.18 });
  note(ac, 1319, 0.55, 0.7, { type: "sine", volume: 0.1 });
  [2093, 2637, 3136, 2637, 3520].forEach((f, i) => note(ac, f, 0.7 + i * 0.07, 0.15, { type: "sine", volume: 0.05 }));
}
