import { useState } from "react";
import { weather, seasons, nature, weatherGear } from "../data";
import { pickOne, choicesWith, shuffle } from "../utils";
import ModeTabs, { LEARN_PLAY } from "../components/ModeTabs";
import ChoiceQuiz from "../components/ChoiceQuiz";

const lower = (s) => s.toLowerCase();
const cardOption = (x) => ({ id: x.name, label: x.name, content: <>{x.emoji}<small>{x.name}</small></> });

function makeQuestion(prev) {
  const type = pickOne(["weather", "gear", "season"], prev?.type);
  if (type === "gear") {
    const target = pickOne(weatherGear, prev?.target);
    return {
      type, target,
      prompt: `${target.when}, con cần mang gì?`, say: `${target.when}, con cần mang gì?`,
      visual: <span>{target.emoji}</span>,
      options: shuffle(weatherGear.map((g) => g.item)).map((it) => ({ id: it.e, label: it.n, content: <>{it.e}<small>{it.n}</small></> })),
      answer: target.item.e, praise: `Đúng rồi! ${target.when} cần mang ${target.item.n}`,
    };
  }
  if (type === "season") {
    const target = pickOne(seasons, prev?.target);
    return {
      type, target, columns: 2,
      prompt: target.ask, say: target.ask,
      options: shuffle(seasons).map(cardOption),
      answer: target.name, praise: `Đúng rồi! ${target.say}`,
    };
  }
  const target = pickOne(weather, prev?.target);
  return {
    type, target,
    prompt: `Đâu là ${lower(target.name)}?`, say: `Đâu là ${lower(target.name)}?`,
    options: choicesWith(target, weather.filter((w) => w !== target)).map(cardOption),
    answer: target.name, praise: `Đúng rồi! Đây là ${lower(target.name)}`,
  };
}

const SECTIONS = [
  { title: "☁️ THỜI TIẾT", items: weather },
  { title: "🗓️ CÁC MÙA TRONG NĂM", items: seasons },
  { title: "🌳 THIÊN NHIÊN", items: nature },
];

export default function Weather({ speak, onCorrect }) {
  const [mode, setMode] = useState("learn");
  const [selected, setSelected] = useState(weather[0]);

  return <section className="game-panel">
    <ModeTabs tabs={LEARN_PLAY} value={mode} onChange={setMode} />
    {mode === "learn" ? <>
      <div className="section-kicker">🌦️ THỜI TIẾT VÀ THIÊN NHIÊN</div>
      <h2>Chạm vào hình để nghe nhé!</h2>
      <div className="info-panel" onClick={() => speak(selected.say)}>
        <span className="info-emoji">{selected.emoji}</span>
        <div><h3>{selected.name}</h3><p>{selected.say}</p></div>
      </div>
      {SECTIONS.map((sec) => <div key={sec.title}>
        <div className="sub-title">{sec.title}</div>
        <div className="learn-grid">
          {sec.items.map((x) => <button key={x.name} className={selected === x ? "learn-card chosen" : "learn-card"}
            onClick={() => { setSelected(x); speak(x.say); }}>
            {x.emoji}<small>{x.name}</small>
          </button>)}
        </div>
      </div>)}
    </> : <ChoiceQuiz makeQuestion={makeQuestion} speak={speak} onCorrect={onCorrect} />}
  </section>;
}
