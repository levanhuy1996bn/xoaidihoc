import { House, Trophy, Map } from "lucide-react";

// active: "home" | "adventure" | "progress"; onNav(tên) để chuyển trang
export default function BottomNav({ active, onNav }) {
  const item = (name, Icon, label) => <button className={active === name ? "active" : ""} aria-current={active === name ? "page" : undefined} onClick={() => onNav(name)}><Icon/><span>{label}</span></button>;
  return <nav className="bottom-nav">
    {item("home", House, "Trang chủ")}
    {item("adventure", Map, "Phiêu lưu")}
    {item("progress", Trophy, "Thành tích")}
  </nav>;
}
