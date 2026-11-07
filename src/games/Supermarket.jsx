import { useEffect, useRef, useState } from "react";
import data from "../databases/supermarket.json";
import { pickN, shuffle, randInt, tierFor } from "../utils";
import LevelGame from "../components/LevelGame";
import { TRY_AGAIN } from "../components/ChoiceQuiz";

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const byEmoji = (e) => data.products.find((p) => p.e === e);

function makeLevel(level, rng) {
  const t = tierFor(data.tiers, level);
  const list = pickN(data.products, t.items, rng).map((p) => ({ ...p, qty: randInt(1, t.maxQty, rng) }));
  const inList = (e) => list.some((x) => x.e === e);
  const shelf = [...list.map((x) => byEmoji(x.e))];
  if (t.similar) {
    // thêm món dễ nhầm với món trong danh sách (vd. táo đỏ ↔ táo xanh)
    for (const [a, b] of data.similar) {
      const twin = inList(a) ? b : inList(b) ? a : null;
      if (twin && !inList(twin) && !shelf.some((p) => p.e === twin) && shelf.length < t.shelf) shelf.push(byEmoji(twin));
    }
  }
  const others = shuffle(data.products.filter((p) => !shelf.includes(p)), rng);
  while (shelf.length < t.shelf && others.length) shelf.push(others.shift());
  return { list, shelf: shuffle(shelf, rng), allow: t.allow };
}

function Board({ cfg, speak, onFinish }) {
  const [basket, setBasket] = useState({});
  const [note, setNote] = useState("");
  const [shake, setShake] = useState(null);
  const mistakes = useRef(0);
  const listText = cfg.list.map((x) => `${x.qty} ${x.n}`).join(", ");
  const doneCount = (x) => basket[x.e] || 0;
  const finished = cfg.list.every((x) => doneCount(x) >= x.qty);

  useEffect(() => { speak(`${data.intro}: ${listText}`); }, []);

  function wrong(p, text) {
    mistakes.current += 1;
    setShake(p.e); setTimeout(() => setShake(null), 400);
    setNote(text); speak(TRY_AGAIN);
  }

  function take(p) {
    if (finished) return;
    const need = cfg.list.find((x) => x.e === p.e);
    if (!need) return wrong(p, `${cap(p.n)} không có trong danh sách 💛`);
    if (doneCount(need) >= need.qty) return wrong(p, `Đủ ${need.qty} ${need.n} rồi 💛`);
    const next = { ...basket, [p.e]: doneCount(need) + 1 };
    setBasket(next);
    setNote("");
    speak(cap(p.n));
    if (cfg.list.every((x) => (next[x.e] || 0) >= x.qty)) {
      setTimeout(() => speak("Con mua đủ rồi! Giỏi quá!"), 800);
      onFinish(mistakes.current);
    }
  }

  return <div>
    <div className="shopping-list">
      <div className="list-head"><b>📝 Danh sách đi chợ</b>
        <button className="replay-button" onClick={() => speak(`${data.intro}: ${listText}`)} aria-label="Nghe lại danh sách">🔊</button></div>
      {cfg.list.map((x) => {
        const got = doneCount(x), ok = got >= x.qty;
        return <button key={x.e} className={ok ? "list-row ok" : "list-row"} onClick={() => speak(`${x.qty} ${x.n}`)}>
          <span className="list-emoji">{Array.from({ length: x.qty }, (_, i) => <span key={i} className={i < got ? "got" : ""}>{x.e}</span>)}</span>
          <small>{x.qty} {x.n}</small>
          <i>{ok ? "✅" : `${got}/${x.qty}`}</i>
        </button>;
      })}
    </div>
    <div className="sub-title">🏪 KỆ HÀNG — CHẠM ĐỂ BỎ VÀO GIỎ</div>
    <div className="shelf" style={{ gridTemplateColumns: `repeat(${cfg.shelf.length > 9 ? 4 : 3}, minmax(0, 1fr))` }}>
      {cfg.shelf.map((p) => <button key={p.e} className={shake === p.e ? "shelf-item wrong-shake" : "shelf-item"} onClick={() => take(p)} aria-label={p.n}>{p.e}</button>)}
    </div>
    <div className="basket">🧺 {Object.entries(basket).flatMap(([e, n]) => Array.from({ length: n }, (_, i) => <span key={e + i}>{e}</span>))}</div>
    <div className="feedback">{finished ? "Mua đủ rồi! 🎉" : note}</div>
  </div>;
}

export default function Supermarket({ speak, onStars }) {
  return <LevelGame id="market" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars} intro="🛒 MUA ĐÚNG ĐỒ TRONG DANH SÁCH" />;
}
