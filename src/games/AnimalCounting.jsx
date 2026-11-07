import { useEffect, useState } from "react";
import { maxCount, sets as animalSets } from "../databases/animal-counting.json";
import { makeOptions } from "../utils";
import { PRAISE, TRY_AGAIN } from "../components/ChoiceQuiz";

function makeQuestion(prev) {
  const pool = animalSets.filter(s => s.name !== prev?.name); // không lặp lại con vật vừa hỏi
  const set = pool[Math.floor(Math.random()*pool.length)];
  const count = Math.floor(Math.random()*maxCount)+1;
  const choices = makeOptions(count);
  return { ...set, count, choices };
}

export default function AnimalCounting({ onCorrect, speak }) {
  const [q,setQ] = useState(() => makeQuestion());
  const [result,setResult] = useState("");
  const [done,setDone] = useState(false);
  const ask = `Có bao nhiêu bạn ${q.name} nhỉ?`;
  const say = `${ask} Con hãy đếm rồi chọn số nhé`;

  useEffect(() => { speak(say); }, [q]); // tự đọc câu hỏi khi mở và khi sang câu mới
  function answer(n) {
    if (done) return; // đã đúng rồi thì không cộng sao thêm
    if (n === q.count) {
      setDone(true); setResult(PRAISE + " 🎉"); onCorrect(); speak(PRAISE);
    } else { setResult(TRY_AGAIN + "! 💛"); speak(TRY_AGAIN); }
  }
  return <section className="game-panel">
    <div className="section-kicker">🐾 TRÒ CHƠI ĐẾM CON VẬT</div>
    <div className="quiz-question" style={{ margin: "8px 0 14px" }}><h3>{ask}</h3>
      <button className="replay-button" onClick={() => speak(say)} aria-label="Nghe lại câu hỏi">🔊</button></div>
    <div className="animal-stage">{Array.from({length:q.count},(_,i)=><span key={i}>{q.animal}</span>)}</div>
    <p className="helper-text">Con hãy đếm thật kỹ rồi chọn đáp án nhé!</p>
    <div className="answer-grid">{q.choices.map(n=><button key={n} className="answer-button" onClick={()=>answer(n)}>{n}</button>)}</div>
    {result && <div className="feedback">{result}</div>}
    <button className="primary-button" onClick={()=>{setQ(makeQuestion(q));setResult("");setDone(false);}}>Câu tiếp theo <span>→</span></button>
  </section>;
}