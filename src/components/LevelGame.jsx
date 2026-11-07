import { useEffect, useMemo, useRef, useState } from "react";
import messages from "../databases/messages.json";
import { makeRng, fill } from "../utils";
import { getProgress, saveStars, clearedCount, starTotal } from "../levels/progress";
import { track } from "../adventure/store";
import { playWin } from "./sounds";

/**
 * Khung chung cho các trò có màn (kiểu Candy Crush):
 * bản đồ màn → chơi → kết quả 1–3 sao → màn tiếp theo.
 * - makeLevel(level, rng): sinh cấu hình màn theo số màn (độ khó tăng dần, vô tận)
 *   và phải có `allow` = số lần sai tối đa để vẫn được 2 sao.
 * - Board: component chơi một màn, gọi onFinish(soLanSai) NGAY khi bé làm xong.
 *   Kết quả được lưu ngay lập tức và phát nhạc chúc mừng; màn hình sao + câu "Giỏi quá! Con hoàn thành màn…"
 *   hiện sau DONE_DELAY. Board không cần tự đọc câu khen lúc xong màn (sẽ bị chồng tiếng).
 */
const DONE_DELAY = 2000;

export default function LevelGame({ id, makeLevel, Board, speak, onStars, intro, doneDelay = DONE_DELAY }) {
  const [progress, setProgress] = useState(() => getProgress(id));
  const [view, setView] = useState("map");
  const [level, setLevel] = useState(1);
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState(null);
  const cleared = clearedCount(progress);
  const cfg = useMemo(() => makeLevel(level, makeRng(`${id}:${level}`)), [id, level, makeLevel]);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  function show(v) { clearTimeout(timer.current); setView(v); }

  function start(n) {
    setLevel(n); setAttempt((a) => a + 1); setResult(null); show("play");
    window.scrollTo(0, 0);
  }

  function finish(mistakes) {
    const allow = cfg.allow ?? 2;
    const stars = mistakes === 0 ? 3 : mistakes <= allow ? 2 : 1;
    playWin(); // nhạc chúc mừng ngay khi xong; lời khen đọc sau, không bị chồng tiếng
    const gained = saveStars(id, level, stars);
    track("levels"); // nhiệm vụ "Vượt màn" của Xoài phiêu lưu
    setProgress(getProgress(id));
    if (gained) onStars(gained);
    const milestone = level % 10 === 0;
    setResult({ stars, gained, milestone });
    // Đã lưu xong; thoát ra lúc này cũng không mất. Chờ một chút rồi mới hiện màn hình sao.
    timer.current = setTimeout(() => {
      setView("done");
      speak(fill(messages.levelDone, { level, stars }) + (milestone ? ". " + fill(messages.milestone, { level }) : ""));
    }, doneDelay);
  }

  if (view === "play") {
    return <section className="game-panel">
      <div className="level-bar">
        <button className="chip" onClick={() => show("map")}>☰ Các màn</button>
        <b>Màn {level}</b>
      </div>
      <Board key={attempt} cfg={cfg} level={level} speak={speak} onFinish={finish} />
    </section>;
  }

  if (view === "done" && result) {
    return <section className="game-panel level-done">
      <div className="section-kicker">MÀN {level}</div>
      <div className="big-stars">
        {[1, 2, 3].map((i) => <span key={i} className={i <= result.stars ? "on" : ""} style={{ animationDelay: `${i * 0.18}s` }}>★</span>)}
      </div>
      <h2>{result.stars === 3 ? "Xuất sắc!" : result.stars === 2 ? "Giỏi lắm!" : "Hoàn thành rồi!"}</h2>
      {result.gained > 0 && <p className="gain">+{result.gained} ⭐</p>}
      {result.milestone && <p className="milestone">🎁 {fill(messages.milestone, { level })}</p>}
      {result.stars < 3 && <p className="helper-text">Chơi lại để lấy đủ 3 sao nhé!</p>}
      <button className="primary-button" onClick={() => start(level + 1)}>Màn tiếp theo <span>→</span></button>
      <div className="chip-row">
        <button className="chip" onClick={() => start(level)}>↺ Chơi lại</button>
        <button className="chip" onClick={() => show("map")}>☰ Các màn</button>
      </div>
    </section>;
  }

  // Bản đồ màn: luôn hiện thêm vài màn phía trước, làm tròn theo chục
  const shown = Math.max(10, Math.ceil((cleared + 6) / 10) * 10);
  return <section className="game-panel">
    {intro && <div className="section-kicker">{intro}</div>}
    <div className="level-summary">
      <span>⭐ {starTotal(progress)} sao</span>
      <span>🏁 Đã qua {cleared} màn</span>
    </div>
    <button className="primary-button" style={{ margin: "4px auto 16px" }} onClick={() => start(cleared + 1)}>▶ Chơi màn {cleared + 1}</button>
    <div className="level-grid">
      {Array.from({ length: shown }, (_, i) => i + 1).map((n) => {
        const s = progress[n] || 0;
        const locked = n > cleared + 1;
        return <button key={n} className={`level-btn${locked ? " locked" : ""}${n === cleared + 1 ? " current" : ""}`}
          disabled={locked} onClick={() => start(n)} aria-label={`Màn ${n}`}>
          {n % 10 === 0 && <i className="gift">🎁</i>}
          <b>{locked ? "🔒" : n}</b>
          <span className="level-stars">{[1, 2, 3].map((k) => <em key={k} className={k <= s ? "on" : ""}>★</em>)}</span>
        </button>;
      })}
    </div>
  </section>;
}
