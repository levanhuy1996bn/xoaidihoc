import { House, Trophy, Map } from "lucide-react";

export default function BottomNav({ page, setPage }) {
  return <nav className="bottom-nav">
    <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}><House/><span>Trang chủ</span></button>
    <button className={page === "adventure" ? "active" : ""} onClick={() => setPage("adventure")}><Map/><span>Phiêu lưu</span></button>
    <button className={page === "progress" ? "active" : ""} onClick={() => setPage("progress")}><Trophy/><span>Thành tích</span></button>
  </nav>;
}