import { useState } from "react";
import { colors, mixes as colorMixes, white as WHITE } from "../databases/colors.json";
import { pickOne, pickN, choicesWith } from "../utils";
import ModeTabs, { LEARN_PLAY } from "../components/ModeTabs";
import ChoiceQuiz from "../components/ChoiceQuiz";

const lower = (s) => s.toLowerCase();
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const findColor = (name) => colors.find((c) => c.name === name) || WHITE;
const Swatch = ({ c, small }) => <span className={small ? "swatch small" : "swatch"} style={{ background: c.hex }} />;
const swatchOption = (c) => ({ id: c.name, label: "Màu " + lower(c.name), content: <><Swatch c={c} /><small>{c.name}</small></> });

function makeQuestion(prev) {
  const type = pickOne(["pick", "object", "mix"], prev?.type);
  if (type === "pick") {
    const target = pickOne(colors, prev?.target);
    return {
      type, target,
      prompt: `Con hãy chọn màu ${lower(target.name)}`, say: `Con hãy chọn màu ${lower(target.name)}`,
      options: choicesWith(target, colors.filter((c) => c !== target)).map((c) => ({ ...swatchOption(c), content: <Swatch c={c} /> })),
      answer: target.name, praise: `Đúng rồi! Đây là màu ${lower(target.name)}`,
    };
  }
  if (type === "object") {
    const target = pickOne(colors, prev?.target);
    const right = pickOne(target.objects);
    const wrongs = pickN(colors.filter((c) => c !== target), 2).map((c) => pickOne(c.objects));
    const opts = [right, ...wrongs].sort(() => Math.random() - 0.5);
    return {
      type, target,
      prompt: `Tìm đồ vật màu ${lower(target.name)}`, say: `Con hãy tìm đồ vật màu ${lower(target.name)}`,
      options: opts.map((o) => ({ id: o.e, label: o.n, content: o.e })),
      answer: right.e, praise: `Đúng rồi! ${cap(right.n)} màu ${lower(target.name)}`,
    };
  }
  const mix = pickOne(colorMixes, prev?.mix);
  const a = findColor(mix.a), b = findColor(mix.b), result = findColor(mix.result);
  return {
    type, mix,
    prompt: `${a.name} pha với ${lower(b.name)} thành màu gì?`, say: `Màu ${lower(a.name)} pha với màu ${lower(b.name)} thành màu gì?`,
    visual: <div className="mix-row"><Swatch c={a} />+<Swatch c={b} />=<span>❓</span></div>,
    options: choicesWith(result, colors.filter((c) => c !== result && c.name !== mix.a && c.name !== mix.b)).map(swatchOption),
    answer: result.name, praise: `Đúng rồi! ${a.name} pha ${lower(b.name)} thành màu ${lower(result.name)}`,
  };
}

export default function Colors({ onCorrect, speak }) {
  const [mode, setMode] = useState("learn");
  const [selected, setSelected] = useState(colors[0]);

  return <section className="game-panel">
    <ModeTabs tabs={LEARN_PLAY} value={mode} onChange={setMode} />
    {mode === "learn" ? <>
      <div className="section-kicker">🎨 KHÁM PHÁ MÀU SẮC</div>
      <h2>Chạm vào màu để nghe nhé!</h2>
      <div className="info-panel" onClick={() => speak("Màu " + lower(selected.name))}>
        <span className="swatch" style={{ background: selected.hex, width: 76, height: 76, flex: "none" }} />
        <div>
          <h3>Màu {lower(selected.name)}</h3>
          <div style={{ fontSize: 34 }}>
            {selected.objects.map((o) => <span key={o.e} onClick={(e) => { e.stopPropagation(); speak(o.n + " màu " + lower(selected.name)); }}>{o.e} </span>)}
          </div>
        </div>
      </div>
      <div className="learn-grid" style={{ gridTemplateColumns: "repeat(4, minmax(0, 1fr))" }}>
        {colors.map((c) => <button key={c.name} className={selected === c ? "learn-card chosen" : "learn-card"} style={{ minHeight: 88 }}
          onClick={() => { setSelected(c); speak("Màu " + lower(c.name)); }}>
          <Swatch c={c} small /><small>{c.name}</small>
        </button>)}
      </div>
      <p className="helper-text">Chạm vào đồ vật để nghe tên nhé!</p>
    </> : <ChoiceQuiz makeQuestion={makeQuestion} speak={speak} onCorrect={onCorrect} />}
  </section>;
}
