import { useEffect, useState } from "react";
import messages from "../databases/messages.json";

export const PRAISE = messages.praise;
export const TRY_AGAIN = messages.tryAgain;

/**
 * Bộ câu hỏi chọn đáp án dùng chung cho các màn.
 * makeQuestion(prev) trả về:
 *   { prompt, say, visual?, options: [{ id, content, label }], answer, praise?, columns?, render?, hint? }
 * - hint: câu gợi ý, hiện nút 💡 để bé nghe
 * - render({ choose, done, wrong, answer }): tự vẽ phần chọn đáp án (vd. chạm vào hình), thay cho lưới nút
 * - prompt: chữ hiển thị; say: câu đọc to; visual: hình minh họa phía trên
 * - praise: câu khen riêng khi đúng (mặc định PRAISE)
 */
export default function ChoiceQuiz({ makeQuestion, speak, onCorrect, columns = 3, big = false }) {
  const [q, setQ] = useState(() => makeQuestion(null));
  const [done, setDone] = useState(false);
  const [wrong, setWrong] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => { speak(q.say); }, []); // đọc câu hỏi đầu tiên khi mở

  function choose(option) {
    if (done) return;
    if (option.id === q.answer) {
      const praise = q.praise || PRAISE;
      setDone(true);
      setMessage(praise + " 🎉");
      speak(praise);
      onCorrect();
    } else {
      setWrong((w) => [...w, option.id]);
      setMessage(TRY_AGAIN + "! 💛");
      speak(TRY_AGAIN);
    }
  }

  function next() {
    const nq = makeQuestion(q);
    setQ(nq); setDone(false); setWrong([]); setMessage("");
    speak(nq.say);
  }

  return <div className="quiz">
    <div className="quiz-question">
      <h3>{q.prompt}</h3>
      <div className="quiz-buttons">
        {q.hint && <button className="replay-button" onClick={() => speak(q.hint)} aria-label="Nghe gợi ý">💡</button>}
        <button className="replay-button" onClick={() => speak(q.say)} aria-label="Nghe lại câu hỏi">🔊</button>
      </div>
    </div>
    {q.visual && <div className="quiz-visual">{q.visual}</div>}
    {q.render ? q.render({ choose, done, wrong, answer: q.answer }) :
    <div className={big ? "quiz-options big" : "quiz-options"} style={{ gridTemplateColumns: `repeat(${q.columns || columns}, minmax(0, 1fr))` }}>
      {q.options.map((o) => {
        const cls = done && o.id === q.answer ? "quiz-option correct" : wrong.includes(o.id) ? "quiz-option wrong" : "quiz-option";
        return <button key={o.id} className={cls} aria-label={o.label} onClick={() => choose(o)}>{o.content}</button>;
      })}
    </div>}
    <div className="feedback">{message}</div>
    <button className="primary-button" onClick={next}>Câu tiếp theo <span>→</span></button>
  </div>;
}
