import { Volume2, Star } from "lucide-react";

export default function Header({ stars, onHome }) {
  return <header className="topbar">
    <button className="brand" onClick={onHome} aria-label="Về trang chủ">
      <span className="brand-icon">🌈</span>
      <span>Bé Vui Học</span>
    </button>
    <div className="star-pill"><Star size={17} fill="#FFB72B" color="#FFB72B"/> {stars} sao</div>
  </header>;
}