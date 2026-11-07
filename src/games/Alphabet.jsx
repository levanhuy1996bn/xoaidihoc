import { useState } from "react";
import { letters as alphabet } from "../databases/alphabet.json";
import { pickOne, choicesWith } from "../utils";
import ModeTabs from "../components/ModeTabs";
import ChoiceQuiz from "../components/ChoiceQuiz";

// Bỏ dấu thanh (sắc, huyền, hỏi, ngã, nặng) nhưng giữ ă, â, ê, ô, ơ, ư
function stripTones(text) {
  return text.normalize("NFD").replace(/[\u0300\u0301\u0303\u0309\u0323]/g, "").normalize("NFC");
}
// Từ bắt đầu bằng chữ ghép (qu, ch, nh…) không dùng cho câu hỏi hình vì âm đầu khác âm của chữ cái
const DIGRAPHS = ["ch", "gh", "gi", "kh", "ng", "nh", "ph", "qu", "th", "tr"];
// Những chữ có từ ví dụ bắt đầu đúng bằng chữ đó (dùng cho câu hỏi hình)
const startsWithLetter = alphabet.filter((l) => {
  const w = stripTones(l.word).toLowerCase();
  return stripTones(l.word[0]).toUpperCase() === l.upper && !DIGRAPHS.some((d) => w.startsWith(d));
});

const TABS = [
  { id: "learn", icon: "📖", label: "Học" },
  { id: "sound", icon: "👂", label: "Nghe âm" },
  { id: "picture", icon: "🖼️", label: "Nhìn hình" },
];

function letterOption(l) {
  return { id: l.upper, label: "Chữ " + l.sound, content: <span className="letter-option">{l.upper}{l.lower}</span> };
}

// Tab "Nghe âm": nghe âm rồi chọn chữ — không cần biết ghép vần
function makeSoundQuestion(prev) {
  const target = pickOne(alphabet, prev?.target);
  return {
    target,
    prompt: `Chữ nào đọc là “${target.sound}”?`,
    say: "Chữ nào đọc là " + target.sound,
    options: choicesWith(target, alphabet.filter((l) => l !== target)).map(letterOption),
    answer: target.upper,
    praise: `Đúng rồi! Đây là chữ ${target.sound}`,
  };
}

// Tab "Nhìn hình": đoán chữ đầu của từ — dành cho bé đã bắt đầu ghép vần, có gợi ý âm đầu
function makePictureQuestion(prev) {
  const target = pickOne(startsWithLetter, prev?.target);
  return {
    target,
    prompt: `${target.word} bắt đầu bằng chữ nào?`,
    say: target.word + " bắt đầu bằng chữ nào?",
    hint: `${target.word} bắt đầu bằng âm ${target.sound}`,
    visual: <span>{target.emoji}</span>,
    options: choicesWith(target, alphabet.filter((l) => l !== target)).map(letterOption),
    answer: target.upper,
    praise: `Đúng rồi! ${target.word} bắt đầu bằng chữ ${target.sound}`,
  };
}

export default function Alphabet({ speak, onCorrect }) {
  const [mode, setMode] = useState("learn");
  const [selected, setSelected] = useState(alphabet[0]);

  return <section className="game-panel">
    <ModeTabs tabs={TABS} value={mode} onChange={setMode} />
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
    </> : mode === "sound"
      ? <ChoiceQuiz key="sound" makeQuestion={makeSoundQuestion} speak={speak} onCorrect={onCorrect} />
      : <>
        <p className="helper-text" style={{ margin: "0 0 10px" }}>Dành cho bé đã bắt đầu ghép vần. Chạm 💡 để nghe gợi ý âm đầu nhé!</p>
        <ChoiceQuiz key="picture" makeQuestion={makePictureQuestion} speak={speak} onCorrect={onCorrect} />
      </>}
  </section>;
}
