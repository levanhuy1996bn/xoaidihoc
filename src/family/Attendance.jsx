import { useEffect } from "react";
import Avatar from "./Avatar";
import { members } from "./store";

export default function Attendance({ present, setPresent, speak, go }) {
  useEffect(() => { speak("Điểm danh nào! Chạm vào ảnh những ai có mặt hôm nay"); }, []);

  function toggle(m) {
    const here = present.includes(m.id);
    setPresent(here ? present.filter((x) => x !== m.id) : [...present, m.id]);
    speak(here ? `${m.name} vắng mặt` : `${m.name} có mặt!`);
  }

  return <div>
    <div className="quiz-question"><h3>📋 Điểm danh – ai có mặt?</h3>
      <button className="replay-button" onClick={() => speak("Chạm vào ảnh những ai có mặt hôm nay")} aria-label="Nghe hướng dẫn">🔊</button></div>
    <p className="helper-text" style={{ margin: "10px 0" }}>Chạm vào ảnh để điểm danh · <b style={{ color: "#4a9c65" }}>{present.length}/{members.length} có mặt</b></p>
    <div className="fam-grid">
      {members.map((m) => {
        const here = present.includes(m.id);
        return <button key={m.id} className={here ? "fam-card on" : "fam-card off"} onClick={() => toggle(m)}>
          {here && <i className="tick">✅</i>}
          <Avatar m={m} size={58} />
          <small>{m.name}</small>
        </button>;
      })}
    </div>
    <div className="chip-row" style={{ marginTop: 12 }}>
      <button className="chip" onClick={() => { setPresent(members.map((m) => m.id)); speak("Cả lớp có mặt!"); }}>🙋 Cả lớp có mặt</button>
    </div>
    <button className="primary-button" onClick={() => go("wheel")}>Vào kiểm tra miệng <span>🎡</span></button>
  </div>;
}
