import { useEffect, useLayoutEffect, useRef, useState } from "react";
import data from "../databases/missing-numbers.json";
import { pickN, shuffle, randInt, tierFor } from "../utils";
import LevelGame from "../components/LevelGame";
import useDragDrop from "../components/useDragDrop";
import { TRY_AGAIN } from "../components/ChoiceQuiz";

// Giá trị trong JSON có thể là số hoặc [a, b] (chọn ngẫu nhiên trong khoảng)
const val = (v, rng) => (Array.isArray(v) ? randInt(v[0], v[1], rng) : v);

function makeLevel(level, rng) {
  const t = tierFor(data.tiers, level);
  const length = val(t.length, rng);
  const start = t.startAtOne ? 1 : randInt(t.min, Math.max(t.min, t.max - length + 1), rng);
  const seq = Array.from({ length }, (_, i) => start + i); // luôn là số liên tiếp tăng dần
  // chọn ô trống, không để 2 ô trống liền nhau (bé luôn nhìn được số đứng trước hoặc sau)
  const want = Math.min(val(t.blanks, rng), Math.ceil(length / 2));
  let blanks = [];
  for (let tries = 0; tries < 50 && blanks.length < want; tries++) {
    const candidate = pickN(seq.map((_, i) => i), want, rng).sort((a, b) => a - b);
    if (candidate.every((x, k) => k === 0 || x - candidate[k - 1] > 1)) blanks = candidate;
  }
  if (!blanks.length) blanks = [Math.floor(length / 2)];
  // thẻ: đáp án + thẻ thừa (số sát ô trống hoặc ngay ngoài dãy), luôn có ít nhất 2 thẻ thừa để con phải chọn
  const answers = blanks.map((i) => seq[i]);
  const near = [...answers.flatMap((a) => [a - 1, a + 1, a + 2, a - 2]), start - 1, start + length];
  const pool = shuffle([...new Set(near)].filter((n) => n >= 1 && n <= 20 && !answers.includes(n)), rng);
  const extras = pool.slice(0, Math.max(2, val(t.extra, rng)));
  const cards = shuffle([...answers, ...extras], rng).map((n, k) => ({ id: `c${k}`, n }));
  const theme = data.themes[(level - 1) % data.themes.length];
  return { seq, blanks, cards, theme, dots: t.dots, allow: t.allow };
}

function Dots({ n }) {
  return <span className="mn-dots">{"●".repeat(Math.min(n, 10))}</span>;
}

function Board({ cfg, speak, onFinish }) {
  const { seq, blanks, cards, theme, dots } = cfg;
  const [filled, setFilled] = useState({}); // vị trí → số đã điền
  const [used, setUsed] = useState([]);    // id thẻ đã dùng
  const [flash, setFlash] = useState(null);
  const mistakes = useRef(0);
  const done = blanks.every((i) => filled[i] !== undefined);
  const say = () => speak(theme.ask); // chỉ đọc câu hỏi, không đọc cả dãy số

  useEffect(() => { say(); }, []);

  function onDrop(cardId, slot) {
    const i = Number(slot), card = cards.find((c) => c.id === cardId);
    if (!card || done || !blanks.includes(i) || filled[i] !== undefined) return;
    if (card.n === seq[i]) {
      const next = { ...filled, [i]: card.n };
      setFilled(next); setUsed((u) => [...u, cardId]);
      speak(String(card.n));
      if (blanks.every((b) => next[b] !== undefined)) onFinish(mistakes.current); // lời khen đọc ở màn hình sao
    } else {
      mistakes.current += 1;
      setFlash(i); setTimeout(() => setFlash(null), 450);
      speak(TRY_AGAIN);
    }
  }
  const { itemProps, dropProps, ghost, selected, dragging } = useDragDrop(onDrop, (id) => speak(String(cards.find((c) => c.id === id).n)));

  // kích thước ô theo bề ngang thật của khung, để vừa cả điện thoại nhỏ
  const sceneRef = useRef(null);
  const [width, setWidth] = useState(300);
  useLayoutEffect(() => {
    const measure = () => sceneRef.current && setWidth(sceneRef.current.clientWidth);
    measure(); window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const size = Math.max(26, Math.min(48, Math.floor((width - 56) / seq.length) - 4));
  // dãy dài trên máy rất hẹp: thu nhỏ cả hàng cho vừa khung
  const rowRef = useRef(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const natural = [...row.children].reduce((w, c) => w + c.offsetWidth + 4, -4); // 4 = khoảng cách giữa các ô
    setScale(Math.min(1, (width - 8) / natural));
  }, [width, size, seq.length]);
  const color = (i) => data.colors[i % data.colors.length];

  function renderCell(i) {
    const n = seq[i], isBlank = blanks.includes(i), value = isBlank ? filled[i] : n;
    const empty = value === undefined;
    const style = { width: size, height: theme.id === "stairs" ? size + i * 7 : size, fontSize: size * 0.48, background: empty ? undefined : color(i) };
    const cls = `mn-cell mn-${theme.id}${empty ? " blank" : ""}${isBlank && !empty ? " filled" : ""}${flash === i ? " flash-wrong" : ""}${empty && selected ? " ready" : ""}`;
    const props = isBlank && empty ? dropProps(String(i)) : {};
    return <div key={i} {...props} className={cls} style={style}>
      {dots && n <= 10 && <Dots n={n} />}
      {empty ? "?" : value}
    </div>;
  }

  return <div>
    <div className="quiz-question"><h3>{theme.ask}</h3>
      <button className="replay-button" onClick={say} aria-label="Nghe lại câu hỏi">🔊</button></div>
    <div ref={sceneRef} className={`mn-scene mn-scene-${theme.id}${done ? " go" : ""}`}>
      <div style={scale < 1 ? { transform: `scale(${scale})` } : undefined}><div ref={rowRef} className="mn-row">
        {theme.id === "train" && <span className="mn-icon flip">{theme.icon}</span>}
        {seq.map((_, i) => renderCell(i))}
        {theme.id !== "train" && <span className="mn-icon">{theme.icon}</span>}
      </div></div>
    </div>
    <div className="mn-cards">
      {cards.filter((c) => !used.includes(c.id)).map((c, k) => {
        const p = itemProps(c.id, <span className="mn-card ghost-card">{c.n}</span>);
        return <div key={c.id} {...p} className={`mn-card${selected === c.id ? " selected" : ""}${dragging === c.id ? " dragging" : ""}`}
          style={{ ...p.style, "--c": data.colors[(k + 2) % data.colors.length] }}>{c.n}</div>;
      })}
      {done && <div className="feedback">Đúng hết rồi! 🎉</div>}
    </div>
    <p className="helper-text">Kéo số vào ô trống, hoặc chạm số rồi chạm ô · chạm số để nghe</p>
    {ghost}
  </div>;
}

export default function MissingNumbers({ speak, onStars }) {
  return <LevelGame id="missing" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars}
    intro="🚂 ĐIỀN SỐ CÒN THIẾU VÀO DÃY" />;
}
