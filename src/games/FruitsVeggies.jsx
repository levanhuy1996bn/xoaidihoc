import { useState } from "react";
import { produce, produceTypes } from "../data";
import { pickOne, choicesWith } from "../utils";
import ModeTabs, { LEARN_PLAY } from "../components/ModeTabs";
import ChoiceQuiz from "../components/ChoiceQuiz";

const lower = (s) => s.toLowerCase();

function describe(p) {
  const type = produceTypes[p.type].name.toLowerCase();
  return p.color ? `${p.name}. Đây là ${type}, màu ${lower(p.color)}` : `${p.name}. Đây là ${type}`;
}

const itemOption = (p) => ({ id: p.name, label: p.name, content: p.emoji });

function makeQuestion(prev) {
  const type = pickOne(["classify", "find", "color"], prev?.type);
  if (type === "classify") {
    const target = pickOne(produce, prev?.target);
    return {
      type, target, columns: 2,
      prompt: `${target.name} là rau củ hay trái cây?`, say: `${target.name} là rau củ hay trái cây?`,
      visual: <span>{target.emoji}</span>,
      options: ["veg", "fruit"].map((k) => ({ id: k, label: produceTypes[k].name, content: <>{produceTypes[k].emoji}<small>{produceTypes[k].name}</small></> })),
      answer: target.type, praise: `Đúng rồi! ${target.name} là ${lower(produceTypes[target.type].name)}`,
    };
  }
  if (type === "color") {
    const colored = produce.filter((p) => p.color);
    const target = pickOne(colored, prev?.target);
    // phương án sai: khác màu với đáp án, và khác màu nhau
    const others = [];
    for (const p of colored.sort(() => Math.random() - 0.5)) {
      if (p.color !== target.color && !others.some((o) => o.color === p.color)) others.push(p);
      if (others.length === 2) break;
    }
    return {
      type, target,
      prompt: `Tìm rau quả màu ${lower(target.color)}`, say: `Con hãy tìm rau quả màu ${lower(target.color)}`,
      options: [target, ...others].sort(() => Math.random() - 0.5).map(itemOption),
      answer: target.name, praise: `Đúng rồi! ${target.name} màu ${lower(target.color)}`,
    };
  }
  const target = pickOne(produce, prev?.target);
  return {
    type, target,
    prompt: `Đâu là ${lower(target.name)}?`, say: `Đâu là ${lower(target.name)}?`,
    options: choicesWith(target, produce.filter((p) => p !== target)).map(itemOption),
    answer: target.name, praise: `Đúng rồi! Đây là ${lower(target.name)}`,
  };
}

export default function FruitsVeggies({ speak, onCorrect }) {
  const [mode, setMode] = useState("learn");
  const [selected, setSelected] = useState(produce[0]);
  const group = (type) => produce.filter((p) => p.type === type);

  return <section className="game-panel">
    <ModeTabs tabs={LEARN_PLAY} value={mode} onChange={setMode} />
    {mode === "learn" ? <>
      <div className="section-kicker">🥕 RAU CỦ VÀ TRÁI CÂY</div>
      <h2>Chạm vào để nghe tên nhé!</h2>
      <div className="info-panel" onClick={() => speak(describe(selected))}>
        <span className="info-emoji">{selected.emoji}</span>
        <div>
          <h3>{selected.name}</h3>
          <p>{produceTypes[selected.type].emoji} {produceTypes[selected.type].name}</p>
          {selected.color && <p>🎨 Màu {lower(selected.color)}</p>}
        </div>
      </div>
      {["fruit", "veg"].map((t) => <div key={t}>
        <div className="sub-title">{produceTypes[t].emoji} {produceTypes[t].name.toUpperCase()}</div>
        <div className="learn-grid">
          {group(t).map((p) => <button key={p.name} className={selected === p ? "learn-card chosen" : "learn-card"}
            onClick={() => { setSelected(p); speak(describe(p)); }}>
            {p.emoji}<small>{p.name}</small>
          </button>)}
        </div>
      </div>)}
    </> : <ChoiceQuiz makeQuestion={makeQuestion} speak={speak} onCorrect={onCorrect} />}
  </section>;
}
