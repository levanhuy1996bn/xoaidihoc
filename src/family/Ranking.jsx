import { useEffect, useState } from "react";
import Avatar from "./Avatar";
import { members, classInfo } from "./store";

const MEDALS = ["🥇", "🥈", "🥉"];

export function rankMembers(stars) {
  return [...members].sort((a, b) => (stars[b.id] || 0) - (stars[a.id] || 0) || a.name.localeCompare(b.name, "vi"));
}

export default function Ranking({ stars, setStars, speak }) {
  const [confirm, setConfirm] = useState(false);
  const ranked = rankMembers(stars);
  const top = ranked.filter((m) => (stars[m.id] || 0) > 0).slice(0, 3);

  useEffect(() => {
    speak(top.length ? `Lớp trưởng là ${top[0].name} với ${stars[top[0].id]} sao!` : "Chưa ai có sao. Vào kiểm tra miệng nhé!");
  }, []);

  function newWeek() {
    if (!confirm) { setConfirm(true); return; }
    setStars({}); setConfirm(false); speak("Bắt đầu tuần học mới!");
  }

  // bục: hạng 2 – hạng 1 – hạng 3
  const podium = [top[1], top[0], top[2]];
  const heights = [72, 100, 54], places = [2, 1, 3], colors = ["#b9c4d6", "#f2c14e", "#d9a26a"];
  return <div>
    <div className="quiz-question"><h3>🏆 Bảng vàng lớp {classInfo.name}</h3></div>
    {top.length > 0 && <div className="podium">
      {podium.map((m, i) => <div key={i} style={{ visibility: m ? "visible" : "hidden" }}>
        {places[i] === 1 && <div className="crown">👑</div>}
        {m && <Avatar m={m} size={places[i] === 1 ? 64 : 52} />}
        <small><b>{m?.name}</b></small>
        <div className="bar" style={{ height: heights[i], background: colors[i] }}>{places[i]}</div>
      </div>)}
    </div>}
    <div className="rank-list">
      {ranked.map((m, i) => <div key={m.id} className="rank">
        <span className="m">{(stars[m.id] || 0) > 0 && i < 3 ? MEDALS[i] : i + 1}</span>
        <Avatar m={m} size={42} />
        <b>{m.name}{i === 0 && (stars[m.id] || 0) > 0 && " · Lớp trưởng"}</b>
        <i>⭐ {stars[m.id] || 0}</i>
      </div>)}
    </div>
    <button className={confirm ? "primary-button danger" : "primary-button"} onClick={newWeek}>
      {confirm ? "Bấm lần nữa để xóa sao tuần này" : "🔄 Sang tuần mới"}</button>
    {confirm && <div className="chip-row" style={{ marginTop: 8 }}><button className="chip" onClick={() => setConfirm(false)}>Thôi, giữ lại</button></div>}
  </div>;
}
