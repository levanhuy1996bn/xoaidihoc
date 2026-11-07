import { useState } from "react";
import Avatar from "./Avatar";
import { byId, members, classInfo } from "./store";
import { shuffle } from "../utils";

const MENU = [
  { id: "attendance", icon: "📋", label: "Điểm danh", color: "#E5F8E9" },
  { id: "wheel", icon: "🎡", label: "Kiểm tra miệng", color: "#FFF0D9" },
  { id: "who", icon: "👀", label: "Ai đây?", color: "#ECE8FF" },
  { id: "ranking", icon: "🏆", label: "Bảng vàng", color: "#FFE8EF" },
];

function todayText() {
  const d = new Date();
  const day = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"][d.getDay()];
  return `${day}, ${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
}

// Màn đầu tiên: cả lớp ngồi bàn 2 người, đổi chỗ được
export default function Classroom({ seats, setSeats, present, monitorId, speak, go }) {
  const [swapMode, setSwapMode] = useState(false);
  const [picked, setPicked] = useState(null); // vị trí ghế đang chọn để đổi

  function tapSeat(i) {
    const id = seats[i];
    if (!swapMode) {
      if (!id) return;
      const mateId = seats[i % 2 === 0 ? i + 1 : i - 1];
      speak(mateId ? `Đây là ${byId[id].name}, ngồi cùng bàn với ${byId[mateId].name}` : `Đây là ${byId[id].name}`);
      return;
    }
    if (picked === null) {
      if (!id) return;
      setPicked(i); speak(byId[id].name);
      return;
    }
    if (picked === i) { setPicked(null); return; }
    const next = [...seats];
    [next[picked], next[i]] = [next[i], next[picked]];
    setSeats(next);
    const a = byId[seats[picked]], b = id && byId[id];
    speak(b ? `${a.name} đổi chỗ với ${b.name}!` : `${a.name} chuyển sang chỗ mới!`);
    setPicked(null);
  }

  function randomize() {
    const ids = shuffle(members.map((m) => m.id));
    setSeats(seats.map((_, i) => ids[i] ?? null));
    setPicked(null);
    speak("Xếp chỗ ngồi mới rồi!");
  }

  const desks = [];
  for (let i = 0; i < seats.length; i += 2) desks.push([i, i + 1]);

  return <div>
    {swapMode && <div className="fam-toast">🔀 {picked === null ? "Chạm vào một bạn để chọn" : <>Đã chọn <b>{byId[seats[picked]].name}</b> – chạm bạn khác hoặc ghế trống để đổi chỗ</>}</div>}
    <div className="room">
      <div className="blackboard">
        <b>Lớp học gia đình “{classInfo.name}” 🥒</b>
        <small>{todayText()} · Có mặt {present.length}/{members.length}</small>
      </div>
      <div className="teacher">
        <span>🎓</span><span className="tdesk">BỤC GIẢNG</span>
        <button className="bell" onClick={() => speak(classInfo.bell)} aria-label="Chuông vào lớp">🔔</button>
      </div>
      <div className="desks">
        {desks.map((pair) => <div key={pair[0]} className="desk">
          <div className="seats">
            {pair.map((i) => {
              const id = seats[i], m = id && byId[id];
              const cls = ["seat", !m && "empty", m && !present.includes(id) && "absent", picked === i && "sel", swapMode && "swapping"].filter(Boolean).join(" ");
              return <button key={i} className={cls} onClick={() => tapSeat(i)} aria-label={m ? m.name : "Ghế trống"}>
                {m ? <Avatar m={m} size={46} /> : <span className="fam-avatar empty-seat" style={{ width: 46, height: 46 }}>trống</span>}
                <small>{m ? m.name : " "}{m && id === monitorId && " 👑"}</small>
              </button>;
            })}
          </div>
          <div className="board" />
        </div>)}
      </div>
    </div>
    <div className="chip-row" style={{ margin: "12px 0" }}>
      <button className={swapMode ? "chip chosen" : "chip"} onClick={() => { setSwapMode(!swapMode); setPicked(null); if (!swapMode) speak("Chạm vào hai bạn để đổi chỗ cho nhau"); }}>
        {swapMode ? "✅ Xong đổi chỗ" : "🔀 Đổi chỗ"}</button>
      <button className="chip" onClick={randomize}>🎲 Xếp ngẫu nhiên</button>
    </div>
    <div className="fam-menu">
      {MENU.map((x) => <button key={x.id} style={{ background: x.color }} onClick={() => go(x.id)}>
        <span>{x.icon}</span><small>{x.label}</small>
      </button>)}
    </div>
  </div>;
}
