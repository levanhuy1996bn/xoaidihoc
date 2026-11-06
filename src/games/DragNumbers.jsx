import { useState, useRef, useMemo } from "react";
import { makeOptions } from "../utils";

const rounds = [
  { count: 2, emoji: "🍓", label: "quả dâu" },
  { count: 3, emoji: "🍎", label: "quả táo" },
  { count: 4, emoji: "🐣", label: "chú gà" },
  { count: 5, emoji: "🦋", label: "con bướm" }
];

export default function DragNumbers({ onCorrect, speak }) {
  const [round,setRound] = useState(0);
  const [placed,setPlaced] = useState(null);
  const [message,setMessage] = useState("Kéo một con số vào chiếc giỏ nhé!");
  const [dragging,setDragging] = useState(null);
  const [point,setPoint] = useState({x:0,y:0});
  const targetRef = useRef(null);
  const current = rounds[round];
  const options = useMemo(() => makeOptions(current.count), [round]);

  function startDrag(e,n) {
    if(placed!==null) return; // đã đúng rồi thì không cộng sao thêm
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(n);
    setPoint({x:e.clientX,y:e.clientY});
  }
  function moveDrag(e) { if(dragging!==null) setPoint({x:e.clientX,y:e.clientY}); }
  function endDrag(e) {
    if(dragging===null) return;
    const rect = targetRef.current?.getBoundingClientRect();
    const inside = rect && e.clientX >= rect.left-25 && e.clientX <= rect.right+25 && e.clientY >= rect.top-25 && e.clientY <= rect.bottom+25;
    if(inside) {
      if(dragging===current.count) {
        setPlaced(dragging); setMessage("Chính xác! Con giỏi lắm! 🌟"); onCorrect(); speak("Chính xác! Con giỏi lắm!");
      } else { setMessage("Chưa đúng, mình thử lại nhé! 💛"); speak("Chưa đúng, mình thử lại nhé"); }
    }
    setDragging(null);
  }
  function next() { setRound((round+1)%rounds.length); setPlaced(null); setMessage("Kéo một con số vào chiếc giỏ nhé!"); }

  return <section className="game-panel">
    <div className="section-kicker">🧩 BÉ TẬP KÉO THẢ</div>
    <h2>Đếm rồi kéo số vào giỏ!</h2>
    <div className="drag-instruction">Có bao nhiêu {current.label}?</div>
    <div className="drag-objects">{Array.from({length:current.count},(_,i)=><span key={i}>{current.emoji}</span>)}</div>
    <div ref={targetRef} className={placed!==null?"drop-zone success":"drop-zone"}>
      <span className="basket">🧺</span>
      <span>{placed!==null?placed:"Thả số vào đây"}</span>
    </div>
    <div className="drag-options" onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={()=>setDragging(null)}>
      {options.map(n=><button key={n} className="drag-number" style={{touchAction:"none"}} onPointerDown={e=>startDrag(e,n)}>{n}</button>)}
    </div>
    {dragging!==null && <div className="drag-ghost" style={{left:point.x,top:point.y}}>{dragging}</div>}
    <div className="feedback">{message}</div>
    <button className="primary-button" onClick={next}>Màn tiếp theo <span>→</span></button>
    <p className="tiny-note">Mẹo: Chạm giữ số, di chuyển đến giỏ rồi thả tay.</p>
  </section>;
}