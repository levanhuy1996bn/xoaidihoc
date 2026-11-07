// Router nhỏ dùng History API: mỗi màn hình có một đường dẫn riêng,
// tải lại trang vẫn ở đúng chỗ, nút Back của điện thoại lùi về màn trước.
import { useSyncExternalStore } from "react";

const listeners = new Set();
const notify = () => listeners.forEach((f) => f());
window.addEventListener("popstate", notify);
const subscribe = (f) => { listeners.add(f); return () => listeners.delete(f); };

// Đường dẫn hiện tại (component tự vẽ lại khi đường dẫn đổi)
export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname);

// Mỗi mục lịch sử nhớ "trail" = các đường dẫn đã đi qua trước nó trong app,
// để biết lùi bao nhiêu bước khi bấm nút Quay lại (vẫn nhớ sau khi tải lại trang).
const trail = () => window.history.state?.trail || [];

// Sang màn khác. replace = thay mục lịch sử hiện tại (không tạo thêm bước Back)
export function navigate(path, { replace = false } = {}) {
  const current = window.location.pathname;
  if (path === current) return;
  if (replace) window.history.replaceState({ trail: trail() }, "", path);
  else window.history.pushState({ trail: [...trail(), current].slice(-50) }, "", path);
  notify();
}

// Lùi về màn gần nhất đã đi qua thỏa điều kiện; không có (vd. vừa mở link, tải lại) thì sang fallback
export function goBackTo(match, fallback) {
  const t = trail();
  for (let i = t.length - 1; i >= 0; i--) if (match(t[i])) return window.history.go(i - t.length);
  navigate(fallback, { replace: true });
}

// Ra màn ngoài (nút Quay lại, logo): nếu vừa đi từ đó vào thì lùi lịch sử, không thì thay luôn
export const goUp = (path) => goBackTo((p) => p === path, path);
