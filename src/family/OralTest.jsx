import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { byId, classInfo } from "./store";
import { makeQuestion } from "./questions";
import ModeTabs from "../components/ModeTabs";

const COLORS = ["#FFB3B3", "#FFD98A", "#B6E3A1", "#A8D8FF", "#D6C2FF", "#FFC2E0", "#FFCFA8"];
const MODES = [{ id: "all", icon: "🎤", label: "Cả nhà" }, { id: "teacher", icon: "🎓", label: "Xoài làm cô giáo" }];
const TEACHER_ID = "xoai";

// Vòng quay ảnh: xoay CSS, dừng đúng người được chọn dưới mũi tên
function Wheel({ pool, rotation }) {
  const n = pool.length, step = 360 / n;
  const bg = `conic-gradient(${pool.map((_, i) => `${COLORS[i % COLORS.length]} ${i * step}deg ${(i + 1) * step}deg`).join(", ")})`;
  const size = n > 10 ? 36 : 44;
  return <div className="wheel-wrap">
    <div className="wheel-pointer">🔻</div>
    <div className="wheel" style={{ background: bg, transform: `rotate(${rotation}deg)` }}>
      {pool.map((m, i) => <div key={m.id} className="wheel-slot" style={{ transform: `rotate(${(i + 0.5) * step}deg) translateY(-102px)` }}>
        <Avatar m={m} size={size} />
      </div>)}
    </div>
    <div className="wheel-hub">QUAY!</div>
  </div>;
}

// Màn "Lên bảng": câu hỏi + đồng hồ + chấm điểm
function Call({ m, teacher, stars, setStars, speak, onSpin }) {
  const [q, setQ] = useState(() => makeQuestion());
  const [left, setLeft] = useState(classInfo.answerSeconds);
  const [vote, setVote] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  function ask(question, first) {
    const intro = first ? (teacher ? `Cô giáo Xoài mời ${m.name} lên bảng! ` : `Mời ${m.name} lên bảng! `) : "";
    speak(intro + question.text);
  }
  useEffect(() => { ask(q, true); }, []);
  useEffect(() => {
    if (vote || left <= 0) return;
    const t = setTimeout(() => { setLeft(left - 1); if (left - 1 === 0) speak("Hết giờ!"); }, 1000);
    return () => clearTimeout(t);
  }, [left, vote]);

  function grade(ok) {
    if (vote) return;
    setVote(ok ? "up" : "down");
    if (ok) {
      setStars({ ...stars, [m.id]: (stars[m.id] || 0) + 1 });
      speak(`Giỏi quá! ${m.name} được một sao`);
    } else speak("Chưa đúng rồi, lần sau cố gắng nhé");
  }
  function another() {
    const nq = makeQuestion(q.key);
    setQ(nq); setLeft(classInfo.answerSeconds); setVote(null); setShowAnswer(false);
    ask(nq, false);
  }

  return <div className="call">
    <div className="confetti">🎉✨🎉</div>
    <Avatar m={m} size={128} className="pop-in" />
    <h2>{teacher ? "Cô giáo Xoài mời" : "Mời"} {m.name} lên bảng!</h2>
    <div className="qcard">
      <div className="tag">CÂU HỎI · {q.topic.toUpperCase()}</div>
      <div className="q-visual">{q.visual}</div>
      <h3>{q.text}</h3>
      <div className="q-row">
        <span className={left <= 3 && !vote ? "timer urgent" : "timer"}>⏱ {vote ? "Đã chấm" : left > 0 ? `${left} giây` : "Hết giờ!"}</span>
        <button className="chip" onClick={() => ask(q, false)}>🔊 Nghe lại</button>
        <button className="chip" onClick={() => setShowAnswer(!showAnswer)}>💡 Đáp án</button>
      </div>
      {showAnswer && <p className="answer">Đáp án: <b>{q.answer}</b></p>}
    </div>
    <div className="vote">
      <button className={vote === "up" ? "up chosen" : "up"} onClick={() => grade(true)} disabled={!!vote}>👍 Đúng rồi<small>+1 ⭐</small></button>
      <button className={vote === "down" ? "down chosen" : "down"} onClick={() => grade(false)} disabled={!!vote}>👎 Chưa đúng</button>
    </div>
    {vote && <div className="feedback">{vote === "up" ? `⭐ ${m.name} có ${stars[m.id] || 0} sao` : "Lần sau cố gắng nhé! 💛"}</div>}
    <div className="chip-row" style={{ marginTop: 12 }}>
      <button className="chip" onClick={another}>🔁 Đổi câu khác</button>
      <button className="chip" onClick={onSpin}>🎡 Quay tiếp</button>
    </div>
  </div>;
}

export default function OralTest({ present, stars, setStars, speak, go }) {
  const [mode, setMode] = useState("all");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [called, setCalled] = useState(null);
  const timer = useRef(null);
  const teacher = mode === "teacher";
  const pool = present.filter((id) => !(teacher && id === TEACHER_ID)).map((id) => byId[id]).filter(Boolean);

  useEffect(() => { speak("Ai sẽ lên bảng nhỉ? Bấm quay tên nhé"); return () => clearTimeout(timer.current); }, []);

  function spin() {
    if (spinning || pool.length === 0) return;
    if (pool.length === 1) { setCalled(pool[0]); return; }
    const n = pool.length, step = 360 / n;
    const idx = Math.floor(Math.random() * n);
    const jitter = (Math.random() - 0.5) * step * 0.6;
    // xoay để giữa ô của người được chọn dừng đúng dưới mũi tên (góc 0)
    const target = rotation - (rotation % 360) + 360 * 6 + (360 - ((idx + 0.5) * step + jitter));
    setRotation(target); setSpinning(true);
    speak("Quay quay quay…");
    timer.current = setTimeout(() => { setSpinning(false); setCalled(pool[idx]); }, 4700);
  }

  if (called) return <Call key={called.id + rotation} m={called} teacher={teacher} stars={stars} setStars={setStars} speak={speak}
    onSpin={() => { setCalled(null); speak("Ai sẽ lên bảng tiếp theo nhỉ?"); }} />;

  return <div>
    <ModeTabs tabs={MODES} value={mode} onChange={(v) => { if (!spinning) setMode(v); }} />
    <div className="quiz-question"><h3>{teacher ? "🎓 Cô giáo Xoài gọi ai lên bảng?" : "🎡 Ai sẽ lên bảng nhỉ?"}</h3>
      <button className="replay-button" onClick={() => speak("Ai sẽ lên bảng nhỉ? Bấm quay tên nhé")} aria-label="Nghe lại">🔊</button></div>
    {pool.length === 0
      ? <p className="helper-text" style={{ margin: 30 }}>Chưa có ai có mặt. Vào điểm danh trước nhé!</p>
      : <Wheel pool={pool} rotation={rotation} />}
    <button className="primary-button" onClick={spin} disabled={spinning || pool.length === 0}>{spinning ? "Đang quay…" : "🎡 Quay tên"}</button>
    <p className="helper-text" style={{ marginTop: 8 }}>{pool.length} bạn đang ở trong vòng quay ·{" "}
      <button className="link-button" onClick={() => go("attendance")}>Điểm danh lại</button></p>
  </div>;
}
