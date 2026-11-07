import { useState } from "react";
import { max as MAX, countingEmojis } from "../databases/numbers.json";
import { pickOne, makeOptions, shuffle } from "../utils";
import ModeTabs, { LEARN_PLAY } from "../components/ModeTabs";
import ChoiceQuiz from "../components/ChoiceQuiz";

const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));

function twoDifferent(min, max) {
  const a = randInt(min, max);
  let b = randInt(min, max);
  while (b === a) b = randInt(min, max);
  return [a, b];
}

function Group({ n, emoji }) {
  return <div className="group-emojis">{Array.from({ length: n }, (_, i) => <span key={i}>{emoji}</span>)}</div>;
}

function makeQuestion(prev) {
  const type = pickOne(["find", "groups", "numbers"], prev?.type);
  if (type === "find") {
    const n = randInt(1, MAX);
    return {
      type, prompt: `Con hãy tìm số ${n}`, say: `Con hãy tìm số ${n}`, columns: 3,
      options: makeOptions(n, MAX).map((x) => ({ id: x, label: String(x), content: <span className="compare-num">{x}</span> })),
      answer: n, praise: `Đúng rồi! Đây là số ${n}`,
    };
  }
  const more = Math.random() < 0.5;
  const word = more ? "nhiều hơn" : "ít hơn";
  if (type === "groups") {
    const [a, b] = twoDifferent(1, 9);
    const emoji = pickOne(countingEmojis);
    const answer = more ? Math.max(a, b) : Math.min(a, b);
    const other = answer === a ? b : a;
    return {
      type, prompt: `Bên nào ${word}?`, say: `Bên nào ${word}?`,
      options: [a, b].map((x) => ({ id: x, label: `${x}`, content: <Group n={x} emoji={emoji} /> })),
      answer, praise: `Đúng rồi! ${answer} ${word} ${other}`,
    };
  }
  const [a, b] = twoDifferent(1, MAX);
  const bigger = more ? "lớn hơn" : "bé hơn";
  const answer = more ? Math.max(a, b) : Math.min(a, b);
  const other = answer === a ? b : a;
  return {
    type, prompt: `Số nào ${bigger}?`, say: `Số nào ${bigger}?`,
    options: shuffle([a, b]).map((x) => ({ id: x, label: String(x), content: <span className="compare-num">{x}</span> })),
    answer, praise: `Đúng rồi! ${answer} ${bigger} ${other}`,
  };
}

export default function Numbers({ speak, onCorrect }) {
  const [mode, setMode] = useState("learn");
  const [selected, setSelected] = useState(1);

  return <section className="game-panel">
    <ModeTabs tabs={LEARN_PLAY} value={mode} onChange={setMode} />
    {mode === "learn" ? <>
      <div className="section-kicker">🔢 BÉ HỌC ĐẾM</div>
      <h2>Những con số từ 1 đến 20</h2>
      <div className="number-display">
        <div className="number-big">{selected}</div>
        <div className="number-objects" style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(selected, 5)}, auto)`, justifyContent: "center" }}>
          {Array.from({ length: selected }, (_, i) => <span key={i}>⭐</span>)}
        </div>
        <button className="sound-button" onClick={() => speak(String(selected))}>🔊 Nghe số {selected}</button>
      </div>
      <div className="number-grid twenty">{Array.from({ length: MAX }, (_, i) => i + 1).map((n) =>
        <button key={n} className={selected === n ? "number-tile chosen" : "number-tile"} onClick={() => { setSelected(n); speak(String(n)); }}>{n}</button>)}
      </div>
      <p className="helper-text">Con hãy chạm vào một con số nhé!</p>
    </> : <ChoiceQuiz makeQuestion={makeQuestion} speak={speak} onCorrect={onCorrect} columns={2} />}
  </section>;
}
