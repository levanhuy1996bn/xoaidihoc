import { useEffect, useRef, useState } from "react";
import { PRAISE, TRY_AGAIN } from "./ChoiceQuiz";

/**
 * Một màn gồm nhiều câu hỏi chọn đáp án. Đếm số lần sai; trả lời đúng câu cuối là gọi onFinish(soLanSai) ngay.
 * Mỗi câu: { prompt, say, visual?, options: [{ id, content, label }], answer, praise?, columns? }
 */
export default function LevelQuiz({ questions, speak, onFinish }) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState([]);
  const [message, setMessage] = useState("");
  const mistakes = useRef(0);
  const q = questions[index];
  const last = index === questions.length - 1;

  useEffect(() => { speak(q.say); }, [index]);

  function choose(option) {
    if (done) return;
    if (option.id === q.answer) {
      const praise = q.praise || PRAISE;
      setDone(true); setMessage(praise + " 🎉"); speak(praise);
      if (last) onFinish(mistakes.current); // lưu kết quả ngay, không cần bấm thêm nút
    } else {
      mistakes.current += 1;
      setWrong((w) => [...w, option.id]); setMessage(TRY_AGAIN + "! 💛"); speak(TRY_AGAIN);
    }
  }

  function next() {
    setIndex(index + 1); setDone(false); setWrong([]); setMessage("");
  }

  const cols = q.columns || Math.min(q.options.length, 3);
  return <div className="quiz">
    <div className="quiz-dots">{questions.map((_, i) => <span key={i} className={i < index || (i === index && done) ? "on" : i === index ? "now" : ""} />)}</div>
    <div className="quiz-question">
      <h3>{q.prompt}</h3>
      <button className="replay-button" onClick={() => speak(q.say)} aria-label="Nghe lại câu hỏi">🔊</button>
    </div>
    {q.visual && <div className="quiz-visual">{q.visual}</div>}
    <div className="quiz-options" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {q.options.map((o) => {
        const cls = done && o.id === q.answer ? "quiz-option correct" : wrong.includes(o.id) ? "quiz-option wrong" : "quiz-option";
        return <button key={o.id} className={cls} aria-label={o.label} onClick={() => choose(o)}>{o.content}</button>;
      })}
    </div>
    <div className="feedback">{message}</div>
    {done && !last && <button className="primary-button" onClick={next}>Câu tiếp theo <span>→</span></button>}
  </div>;
}
