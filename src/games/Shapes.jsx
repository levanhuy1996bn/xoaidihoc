import { useState } from "react";
import { shapes } from "../data";
import { pickOne, pickN, choicesWith, shuffle } from "../utils";
import ModeTabs, { LEARN_PLAY } from "../components/ModeTabs";
import ChoiceQuiz from "../components/ChoiceQuiz";

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const lower = (s) => s.toLowerCase();

function starPoints(cx, cy, outer, inner) {
  return Array.from({ length: 10 }, (_, i) => {
    const r = i % 2 === 0 ? outer : inner;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
}

export function ShapeSvg({ id, color }) {
  const common = { fill: color, stroke: "#00000014", strokeWidth: 3, strokeLinejoin: "round" };
  return <svg className="shape-svg" viewBox="0 0 100 100" aria-hidden="true">
    {id === "circle" && <circle cx="50" cy="50" r="42" {...common} />}
    {id === "square" && <rect x="10" y="10" width="80" height="80" rx="8" {...common} />}
    {id === "triangle" && <polygon points="50,8 94,88 6,88" {...common} />}
    {id === "rectangle" && <rect x="3" y="24" width="94" height="52" rx="8" {...common} />}
    {id === "star" && <polygon points={starPoints(50, 54, 46, 20)} {...common} />}
  </svg>;
}

function makeQuestion(prev) {
  const target = pickOne(shapes, prev?.target);
  if (Math.random() < 0.5) {
    return {
      target,
      prompt: `Đâu là ${lower(target.name)}?`, say: `Đâu là ${lower(target.name)}?`,
      options: choicesWith(target, shapes.filter((s) => s !== target)).map((s) => ({ id: s.id, label: s.name, content: <ShapeSvg id={s.id} color={s.color} /> })),
      answer: target.id, praise: `Đúng rồi! Đây là ${lower(target.name)}`,
    };
  }
  const right = pickOne(target.objects);
  const wrongs = pickN(shapes.filter((s) => s !== target), 2).map((s) => pickOne(s.objects));
  return {
    target,
    prompt: `Đồ vật nào có ${lower(target.name)}?`, say: `Đồ vật nào có ${lower(target.name)}?`,
    options: shuffle([right, ...wrongs]).map((o) => ({ id: o.e, label: o.n, content: o.e })),
    answer: right.e, praise: `Đúng rồi! ${cap(right.n)} có ${lower(target.name)}`,
  };
}

export default function Shapes({ speak, onCorrect }) {
  const [mode, setMode] = useState("learn");
  const [selected, setSelected] = useState(shapes[0]);

  return <section className="game-panel">
    <ModeTabs tabs={LEARN_PLAY} value={mode} onChange={setMode} />
    {mode === "learn" ? <>
      <div className="section-kicker">🔷 BÉ HỌC HÌNH DẠNG</div>
      <h2>Chạm vào hình để nghe nhé!</h2>
      <div className="info-panel" onClick={() => speak(selected.name)}>
        <span style={{ flex: "none", width: 84 }}><ShapeSvg id={selected.id} color={selected.color} /></span>
        <div>
          <h3>{selected.name}</h3>
          <div style={{ fontSize: 34 }}>
            {selected.objects.map((o) => <span key={o.e} onClick={(e) => { e.stopPropagation(); speak(`${cap(o.n)} có ${lower(selected.name)}`); }}>{o.e} </span>)}
          </div>
        </div>
      </div>
      <div className="learn-grid">
        {shapes.map((s) => <button key={s.id} className={selected === s ? "learn-card chosen" : "learn-card"}
          onClick={() => { setSelected(s); speak(s.name); }}>
          <ShapeSvg id={s.id} color={s.color} /><small>{s.name}</small>
        </button>)}
      </div>
      <p className="helper-text">Chạm vào đồ vật để nghe đồ vật đó có hình gì nhé!</p>
    </> : <ChoiceQuiz makeQuestion={makeQuestion} speak={speak} onCorrect={onCorrect} />}
  </section>;
}
