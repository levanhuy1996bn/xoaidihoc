import { useEffect, useRef, useState } from "react";
import data from "../databases/routines.json";
import { pickOne, shuffle, tierFor } from "../utils";
import LevelGame from "../components/LevelGame";
import { TRY_AGAIN } from "../components/ChoiceQuiz";

function makeLevel(level, rng) {
  const t = tierFor(data.tiers, level);
  const firstId = data.first[level - 1];
  const routine = data.routines.find((r) => r.id === firstId) || pickOne(data.routines, undefined, rng);
  const k = Math.min(t.steps, routine.steps.length);
  // lấy k bước đầu tiên của việc (màn dễ ít bước, màn khó đủ bước)
  const steps = routine.steps.slice(0, k);
  let cards = shuffle(steps, rng);
  if (cards.every((s, i) => s === steps[i])) cards = [...cards].reverse();
  return { routine, steps, cards, allow: t.allow };
}

function Board({ cfg, speak, onFinish }) {
  const { routine, steps, cards } = cfg;
  const [placed, setPlaced] = useState(0);
  const [shake, setShake] = useState(null);
  const mistakes = useRef(0);
  const done = placed === steps.length;
  const ask = `${routine.ask} Con hãy chọn việc làm trước nhé`;

  useEffect(() => { speak(ask); }, []);

  function choose(step) {
    if (done || steps.indexOf(step) < placed) return;
    if (step === steps[placed]) {
      setPlaced(placed + 1);
      // bước cuối: không đọc, LevelGame phát nhạc chúc mừng rồi khen hoàn thành màn
      if (placed + 1 === steps.length) onFinish(mistakes.current);
      else speak(step.n);
    } else {
      mistakes.current += 1;
      setShake(step.n); setTimeout(() => setShake(null), 400);
      speak(TRY_AGAIN);
    }
  }

  return <div>
    <div className="quiz-question"><h3>{routine.ask}</h3>
      <button className="replay-button" onClick={() => speak(ask)} aria-label="Nghe lại">🔊</button></div>
    <div className="routine-slots">
      {steps.map((s, i) => <div key={s.n} className={i < placed ? "routine-slot filled" : i === placed ? "routine-slot next" : "routine-slot"}>
        <b>{i + 1}</b>{i < placed ? <span>{s.e}</span> : <span className="muted">?</span>}
      </div>)}
    </div>
    <div className="routine-cards">
      {cards.map((s) => {
        const used = steps.indexOf(s) < placed;
        return <button key={s.n} className={`routine-card${used ? " used" : ""}${shake === s.n ? " wrong-shake" : ""}`} onClick={() => choose(s)} disabled={used}>
          <span>{s.e}</span><small>{s.n}</small>
        </button>;
      })}
    </div>
    <div className="feedback">{done ? "Đúng thứ tự rồi! 🎉" : `Việc thứ ${placed + 1} là gì nhỉ?`}</div>
  </div>;
}

export default function DailyRoutine({ speak, onStars }) {
  return <LevelGame id="routine" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars} intro="🪥 LÀM CÁC VIỆC THEO ĐÚNG THỨ TỰ" />;
}
