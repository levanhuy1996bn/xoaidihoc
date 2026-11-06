import { useState } from "react";
import { animalSets } from "../data";
import { makeOptions } from "../utils";

function makeQuestion() {
  const set = animalSets[Math.floor(Math.random()*animalSets.length)];
  const count = Math.floor(Math.random()*5)+1;
  const choices = makeOptions(count);
  return { ...set, count, choices };
}

export default function AnimalCounting({ onCorrect, speak }) {
  const [q,setQ] = useState(makeQuestion);
  const [result,setResult] = useState("");
  const [done,setDone] = useState(false);
  function answer(n) {
    if (done) return; // đã đúng rồi thì không cộng sao thêm
    if (n === q.count) {
      setDone(true); setResult("Đúng rồi! Con giỏi quá! 🎉"); onCorrect(); speak("Đúng rồi! Con giỏi quá!");
    } else { setResult("Chưa đúng, mình thử lại nhé! 💛"); speak("Chưa đúng, mình thử lại nhé"); }
  }
  return <section className="game-panel">
    <div className="section-kicker">🐾 TRÒ CHƠI ĐẾM CON VẬT</div>
    <h2>Có bao nhiêu bạn {q.name} nhỉ?</h2>
    <div className="animal-stage">{Array.from({length:q.count},(_,i)=><span key={i}>{q.animal}</span>)}</div>
    <p className="helper-text">Con hãy đếm thật kỹ rồi chọn đáp án nhé!</p>
    <div className="answer-grid">{q.choices.map(n=><button key={n} className="answer-button" onClick={()=>answer(n)}>{n}</button>)}</div>
    {result && <div className="feedback">{result}</div>}
    <button className="primary-button" onClick={()=>{setQ(makeQuestion());setResult("");setDone(false);}}>Câu tiếp theo <span>→</span></button>
  </section>;
}