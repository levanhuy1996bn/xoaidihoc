import { useState } from "react";
import { alphabet } from "../data";
import { pickOne, choicesWith } from "../utils";
import ModeTabs, { LEARN_PLAY } from "../components/ModeTabs";
import ChoiceQuiz from "../components/ChoiceQuiz";

// Bỏ dấu thanh (sắc, huyền, hỏi, ngã, nặng) nhưng giữ ă, â, ê, ô, ơ, ư
function stripTones(text) {
  return text.normalize("NFD").replace(/[̣̀́̃̉]/g, "").normalize("NFC");
}
// Những chữ có từ ví dụ bắt đầu đúng bằng chữ đó (dùng cho câu hỏi hình)
const startsWithLetter = alphabet.filter((l) => stripTones(l.word[0]).toUpperCase() === l.upper);

function letterOption(l) {
  return { id: l.upper, label: "Chữ " + l.sound, content: <span className="letter-option">{l.upper}{l.lower}</span> };
}

function makeQuestion(prev) {
  if (Math.random() < 0.5) {
    const target = pickOne(alphabet, prev?.target);
    return {
      target,
      prompt: `Chữ nào đọc là “${target.sound}”?`,
      say: "Chữ nào đọc là " + target.sound,
      options: choicesWith(target, alphabet.filter((l) => l !== target)).map(letterOption),
      answer: target.upper,
    };
  }
  const target = pickOne(startsWithLetter, prev?.target);
  return {
    target,
    prompt: `${target.word} bắt đầu bằng chữ nào?`,
    say: target.word + " bắt đầu bằng chữ nào?",
    visual: <span>{target.emoji}</span>,
    options: choicesWith(target, alphabet.filter((l) => l !== target)).map(letterOption),
    answer: target.upper,
  };
}

export default function Alphabet({ speak, onCorrect }) {
  const [mode, setMode] = useState("learn");
  const [selected, setSelected] = useState(alphabet[0]);

  return <section className="game-panel">
    <ModeTabs tabs={LEARN_PLAY} value={mode} onChange={setMode} />
    {mode === "learn" ? <>
      <div className="section-kicker">🔤 BÉ LÀM QUEN VỚI CHỮ CÁI</div>
      <h2>Chạm vào chữ để nghe nhé!</h2>
      <div className="letter-feature">
        <div className="big-letter" onClick={() => speak(selected.sound)}>{selected.upper} <small>{selected.lower}</small></div>
        <button className="letter-picture" onClick={() => speak(selected.word)}><span>{selected.emoji}</span><b>{selected.word}</b></button>
        <div><button className="sound-button" onClick={() => speak(selected.sound)}><span>🔊</span> Nghe phát âm</button></div>
      </div>
      <div className="alphabet-grid">
        {alphabet.map((item) => <button key={item.upper} className={selected.upper === item.upper ? "letter-tile chosen" : "letter-tile"}
          onClick={() => { setSelected(item); speak(item.sound); }}>
          <b>{item.upper}</b><small>{item.lower}</small>
        </button>)}
      </div>
      <p className="helper-text">Chạm vào hình để nghe từ ví dụ nhé!</p>
    </> : <ChoiceQuiz makeQuestion={makeQuestion} speak={speak} onCorrect={onCorrect} />}
  </section>;
}
