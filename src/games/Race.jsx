import { useEffect, useRef, useState } from "react";
import { tabs, minRacers, maxRacers } from "../databases/race.json";
import { pickN } from "../utils";
import ModeTabs from "../components/ModeTabs";

const MEDALS = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];
const PLACES = ["nhất", "nhì", "ba", "tư", "năm"];
const RACE_SECONDS = 6; // thời gian đua trung bình

export default function Race({ speak }) {
  const [tabId, setTabId] = useState(tabs[0].id);
  const tab = tabs.find((t) => t.id === tabId);
  const [racers, setRacers] = useState(() => pickN(tab.racers, 3));
  const [phase, setPhase] = useState("pick"); // pick → count → run → result
  const [pos, setPos] = useState({});
  const [ranking, setRanking] = useState([]);
  const [count, setCount] = useState(3);
  const timers = useRef([]);

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { speak("Con hãy chọn các bạn tham gia đua rồi bấm Bắt đầu nhé"); }, []);

  function reset(next) {
    timers.current.forEach(clearTimeout); timers.current = [];
    setPhase("pick"); setPos({}); setRanking([]);
    if (next) setRacers(next);
  }

  function changeTab(id) {
    setTabId(id);
    reset(pickN(tabs.find((t) => t.id === id).racers, 3));
  }

  function toggle(r) {
    if (phase !== "pick") return;
    speak(r.n);
    setRacers((list) => list.includes(r) ? list.filter((x) => x !== r) : list.length >= maxRacers ? list : [...list, r]);
  }

  // Bấm Bắt đầu: đếm ngược rồi chạy luôn
  function start() {
    timers.current.forEach(clearTimeout); timers.current = [];
    setPos({}); setRanking([]); setPhase("count"); setCount(3);
    speak("Ba");
    later(() => { setCount(2); speak("Hai"); }, 1000);
    later(() => { setCount(1); speak("Một"); }, 2000);
    later(() => { setCount(0); speak("Chạy!"); setPhase("run"); }, 3000);
  }

  // Vòng chạy: mỗi bạn đổi tốc độ ngẫu nhiên liên tục, ai chạm vạch đích trước là về nhất
  useEffect(() => {
    if (phase !== "run") return;
    const p = Object.fromEntries(racers.map((r) => [r.e, 0]));
    const speed = Object.fromEntries(racers.map((r) => [r.e, 1]));
    const done = [];
    let last = performance.now(), lastChange = 0, raf;
    function frame(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (now - lastChange > 300) { // đổi nhịp chạy mỗi 0,3 giây cho hồi hộp
        lastChange = now;
        racers.forEach((r) => { speed[r.e] = 0.55 + Math.random() * 0.9; });
      }
      racers.forEach((r) => {
        if (p[r.e] >= 100) return;
        p[r.e] = Math.min(100, p[r.e] + (100 / RACE_SECONDS) * speed[r.e] * dt);
        if (p[r.e] >= 100) done.push(r);
      });
      setPos({ ...p });
      if (done.length < racers.length) raf = requestAnimationFrame(frame);
      else finish(done);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  function finish(order) {
    setRanking(order); setPhase("result");
    const rest = order.slice(1, 3).map((r, i) => `${r.n} về ${PLACES[i + 1]}`).join(", ");
    speak(`${order[0].n} về nhất! ${rest}`);
  }

  const running = phase === "count" || phase === "run";
  return <section className="game-panel">
    <ModeTabs tabs={tabs} value={tabId} onChange={changeTab} />

    <div className="quiz-question" style={{ marginBottom: 12 }}>
      <h3>{phase === "pick" ? "Chọn các bạn tham gia đua" : phase === "result" ? `🏆 ${ranking[0]?.n} về nhất!` : "Cổ vũ nào!"}</h3>
      {phase === "count" && <span className="race-count">{count}</span>}
    </div>

    <div className="race-track">
      {racers.length === 0 && <div className="helper-text" style={{ padding: 20 }}>Chạm vào các bạn bên dưới để đưa vào đường đua</div>}
      {racers.map((r) => {
        const rk = ranking.indexOf(r);
        return <div key={r.e} className="race-lane">
          <span className="lane-name">{r.n}</span>
          <span className="racer" style={{ left: `calc(${pos[r.e] || 0} * (100% - 56px) / 100 + 4px)` }}>
            <span className="racer-flip">{r.e}</span>
          </span>
          {rk >= 0 && <span className="lane-medal">{MEDALS[rk]}</span>}
        </div>;
      })}
    </div>

    {phase === "pick" && <>
      <div className="sub-title">CHỌN TỪ {minRacers} ĐẾN {maxRacers} BẠN ({racers.length}/{maxRacers})</div>
      <div className="race-pick">
        {tab.racers.map((r) => <button key={r.e} className={racers.includes(r) ? "learn-card chosen" : "learn-card"} onClick={() => toggle(r)} style={{ minHeight: 76, fontSize: 34 }}>
          <span className="racer-flip">{r.e}</span><small>{r.n}</small>
        </button>)}
      </div>
      <div className="chip-row" style={{ marginTop: 12 }}>
        <button className="chip" onClick={() => { setRacers(pickN(tab.racers, 2 + Math.floor(Math.random() * (maxRacers - 1)))); speak("Chọn ngẫu nhiên"); }}>🎲 Chọn ngẫu nhiên</button>
      </div>
      <button className="primary-button" disabled={racers.length < minRacers} onClick={start}>Bắt đầu đua <span>🏁</span></button>
    </>}

    {phase === "result" && <>
      <div className="feedback race-win">{ranking.slice(0, 3).map((r, i) => `${MEDALS[i]} ${r.n}`).join("   ")}</div>
      <button className="primary-button" onClick={start} disabled={running}>Đua lại <span>🔁</span></button>
      <div className="chip-row"><button className="chip" onClick={() => reset()}>Chọn bạn khác</button></div>
    </>}
  </section>;
}
