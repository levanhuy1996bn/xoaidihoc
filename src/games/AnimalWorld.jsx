import { useState } from "react";
import { animals, habitats, foods } from "../databases/animals.json";
import { pickOne, choicesWith, shuffle, pickN } from "../utils";
import ModeTabs, { LEARN_PLAY } from "../components/ModeTabs";
import ChoiceQuiz from "../components/ChoiceQuiz";

const short = (a) => { const s = a.name.replace(/^Con /, ""); return s[0].toUpperCase() + s.slice(1); };
const lowerName = (a) => a.name.toLowerCase();

function describe(a) {
  const s = short(a);
  const parts = [a.name + "."];
  if (a.sound) parts.push(`${s} kêu ${a.sound}.`);
  parts.push(`${s} sống ${habitats[a.habitat].say}.`);
  parts.push(`${s} thích ăn ${foods[a.food].name.toLowerCase()}.`);
  return parts.join(" ");
}

const animalOption = (a) => ({ id: a.name, label: a.name, content: a.emoji });

function makeQuestion(prev) {
  const type = pickOne(["name", "sound", "food", "habitat"], prev?.type);
  if (type === "sound") {
    const pool = animals.filter((a) => a.sound);
    const target = pickOne(pool, prev?.target);
    return {
      type, target,
      prompt: `Con nào kêu “${target.sound}”?`, say: `Con nào kêu ${target.sound}?`,
      options: choicesWith(target, pool.filter((a) => a.sound !== target.sound)).map(animalOption),
      answer: target.name, praise: `Đúng rồi! ${target.name} kêu ${target.sound}`,
    };
  }
  const target = pickOne(animals, prev?.target);
  if (type === "food") {
    const others = Object.keys(foods).filter((k) => k !== target.food);
    const ids = shuffle([target.food, ...pickN(others, 2)]);
    return {
      type, target,
      prompt: `${target.name} thích ăn gì?`, say: `${target.name} thích ăn gì?`,
      visual: <span>{target.emoji}</span>,
      options: ids.map((k) => ({ id: k, label: foods[k].name, content: <>{foods[k].emoji}<small>{foods[k].name}</small></> })),
      answer: target.food, praise: `Đúng rồi! ${target.name} thích ăn ${foods[target.food].name.toLowerCase()}`,
    };
  }
  if (type === "habitat") {
    const others = Object.keys(habitats).filter((k) => k !== target.habitat);
    const ids = shuffle([target.habitat, ...pickN(others, 2)]);
    return {
      type, target,
      prompt: `${target.name} sống ở đâu?`, say: `${target.name} sống ở đâu?`,
      visual: <span>{target.emoji}</span>,
      options: ids.map((k) => ({ id: k, label: habitats[k].name, content: <>{habitats[k].emoji}<small>{habitats[k].name}</small></> })),
      answer: target.habitat, praise: `Đúng rồi! ${target.name} sống ${habitats[target.habitat].say}`,
    };
  }
  return {
    type, target,
    prompt: `Đâu là ${lowerName(target)}?`, say: `Đâu là ${lowerName(target)}?`,
    options: choicesWith(target, animals.filter((a) => a !== target)).map(animalOption),
    answer: target.name, praise: `Đúng rồi! Đây là ${lowerName(target)}`,
  };
}

export default function AnimalWorld({ speak, onCorrect }) {
  const [mode, setMode] = useState("learn");
  const [selected, setSelected] = useState(animals[0]);
  const h = habitats[selected.habitat], f = foods[selected.food];

  return <section className="game-panel">
    <ModeTabs tabs={LEARN_PLAY} value={mode} onChange={setMode} />
    {mode === "learn" ? <>
      <div className="section-kicker">🦁 THẾ GIỚI ĐỘNG VẬT</div>
      <h2>Chạm vào bạn thú để nghe nhé!</h2>
      <div className="info-panel" onClick={() => speak(describe(selected))}>
        <span className="info-emoji">{selected.emoji}</span>
        <div>
          <h3>{selected.name}</h3>
          {selected.sound && <p>🔊 Kêu: “{selected.sound}”</p>}
          <p>{h.emoji} Sống: {h.name.toLowerCase()}</p>
          <p>{f.emoji} Thích ăn: {f.name.toLowerCase()}</p>
        </div>
      </div>
      <div className="learn-grid">
        {animals.map((a) => <button key={a.name} className={selected === a ? "learn-card chosen" : "learn-card"}
          onClick={() => { setSelected(a); speak(describe(a)); }}>
          {a.emoji}<small>{a.name}</small>
        </button>)}
      </div>
    </> : <ChoiceQuiz makeQuestion={makeQuestion} speak={speak} onCorrect={onCorrect} />}
  </section>;
}
