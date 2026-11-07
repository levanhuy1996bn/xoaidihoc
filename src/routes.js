// Danh sách đường dẫn của app
//   /                          Trang chủ (Xoài Vui Học)
//   /tro-choi/<id>             Một trò chơi (id trong games.json). Màn đang chơi không lưu trên đường dẫn:
//                              tải lại thì về bản đồ màn, bé tự chọn lại màn
//   /lop, /lop/<slug>          Lớp Dưa Góp và các màn trong lớp (slug trong family.json)
//   /phieu-luu, /phieu-luu/<slug>  Xoài phiêu lưu và các tab (slug trong adventure.json)
//   /thanh-tich                Thành tích
import { games } from "./databases/games.json";
import family from "./databases/family.json";
import adventure from "./databases/adventure.json";

// Trò chơi theo màn (bản đồ màn + 1–3 sao)
export const LEVEL_GAMES = ["odd", "shadow", "pattern", "jigsaw", "missing", "math", "compare", "routine", "market", "room", "traffic"];

export const gamePath = (id) => `/tro-choi/${id}`;
export const classPath = (screen) => (screen && screen !== "room" ? `/lop/${family.screens[screen].slug}` : "/lop");
export const adventurePath = (tab) => {
  const slug = adventure.tabs.find((t) => t.id === tab)?.slug;
  return slug ? `/phieu-luu/${slug}` : "/phieu-luu";
};
export const PATHS = { home: "/", progress: "/thanh-tich", class: "/lop", adventure: "/phieu-luu" };

// Đường dẫn → { name, ... }; trả về null nếu không hợp lệ
export function parseRoute(path) {
  const parts = path.split("/").filter(Boolean).map((p) => { try { return decodeURIComponent(p); } catch { return p; } });
  const [a, b, c] = parts;
  if (!a) return { name: "home" };
  if (a === "tro-choi" && games.some((g) => g.id === b)) return { name: "game", id: b }; // phần thừa phía sau bị bỏ (vd. /man-5 cũ)
  if (a === "lop" && !c) {
    if (!b) return { name: "class", screen: "room" };
    const screen = Object.keys(family.screens).find((k) => family.screens[k].slug === b);
    return screen ? { name: "class", screen } : null;
  }
  if (a === "phieu-luu" && !c) {
    const tab = adventure.tabs.find((t) => t.slug === (b || ""));
    return tab ? { name: "adventure", tab: tab.id } : null;
  }
  if (a === "thanh-tich" && !b) return { name: "progress" };
  return null;
}

// Route → đường dẫn chuẩn (dùng để sửa đường dẫn lạ, vd. có dấu / ở cuối)
export function pathOf(route) {
  switch (route?.name) {
    case "game": return gamePath(route.id);
    case "class": return classPath(route.screen);
    case "adventure": return adventurePath(route.tab);
    case "progress": return PATHS.progress;
    default: return PATHS.home;
  }
}
