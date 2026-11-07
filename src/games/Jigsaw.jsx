import { useEffect, useRef, useState } from "react";
import data from "../databases/jigsaw.json";
import { makeRng, shuffle, tierFor } from "../utils";
import LevelGame from "../components/LevelGame";
import useDragDrop from "../components/useDragDrop";
import { TRY_AGAIN } from "../components/ChoiceQuiz";

const SIZE = 264; // cạnh khung ghép (px)
// Nền trời – mặt trời – cỏ phía sau hình, để mảnh ghép trống vẫn có gợi ý vị trí
const BG = "radial-gradient(circle at 16% 16%, #ffd86b 0 9%, transparent 10%), linear-gradient(#bfe3ff 0%, #e6f4ff 60%, #cdeec0 60%, #b2e0a0 100%)";
// Thứ tự hình cố định: lần lượt đi hết danh sách rồi mới lặp lại
const ORDER = shuffle(data.pictures, makeRng("jigsaw-order"));

function makeLevel(level, rng) {
  const t = tierFor(data.tiers, level);
  const ids = [];
  for (let r = 0; r < t.rows; r++) for (let c = 0; c < t.cols; c++) ids.push(`${r}-${c}`);
  let tray = shuffle(ids, rng);
  if (tray.every((id, i) => id === ids[i])) tray = [...tray].reverse(); // đừng để sẵn đúng thứ tự
  return { picture: ORDER[(level - 1) % ORDER.length], rows: t.rows, cols: t.cols, tray, allow: t.allow };
}

// Một mảnh ghép: cắt một phần của hình lớn bằng overflow hidden
function Piece({ emoji, r, c, rows, cols, scale = 1 }) {
  const w = (SIZE / cols) * scale, h = (SIZE / rows) * scale, s = SIZE * scale;
  return <div className="piece" style={{ width: w, height: h }}>
    <div className="piece-art" style={{ left: -c * w, top: -r * h, width: s, height: s, fontSize: s * 0.78, lineHeight: `${s}px`, background: BG }}>{emoji}</div>
  </div>;
}

function Board({ cfg, speak, onFinish }) {
  const { picture, rows, cols } = cfg;
  const [placed, setPlaced] = useState([]);
  const [flash, setFlash] = useState(null);
  const mistakes = useRef(0);
  const complete = placed.length === rows * cols;
  const trayScale = rows * cols > 4 ? 0.72 : rows === 1 ? 0.55 : 0.75;

  useEffect(() => { speak("Con hãy ghép các mảnh vào khung để đoán xem là hình gì nhé"); }, []);

  function onDrop(pieceId, slotId) {
    if (complete || placed.includes(slotId)) return;
    if (pieceId === slotId) {
      const next = [...placed, slotId];
      setPlaced(next);
      if (next.length === rows * cols) {
        speak(`Đó là ${picture.n}!`);
        onFinish(mistakes.current);
      }
    } else {
      mistakes.current += 1;
      setFlash(slotId); setTimeout(() => setFlash(null), 450);
      speak(TRY_AGAIN);
    }
  }
  const { itemProps, dropProps, ghost, selected, dragging } = useDragDrop(onDrop);
  const w = SIZE / cols, h = SIZE / rows;

  return <div>
    <div className="quiz-question"><h3>{complete ? `🎉 Đó là ${picture.n}!` : "Ghép hình để đoán xem là gì nhé"}</h3>
      <button className="replay-button" onClick={() => speak(complete ? `Đó là ${picture.n}` : "Con hãy ghép các mảnh vào khung nhé")} aria-label="Nghe lại">🔊</button></div>
    <div className={`jigsaw-board${complete ? " complete" : ""}`} style={{ width: SIZE, height: SIZE }}>
      <div className="piece-art" style={{ left: 0, top: 0, width: SIZE, height: SIZE, background: BG, opacity: 0.35 }} />
      <div className="piece-art silhouette faint" style={{ left: 0, top: 0, width: SIZE, height: SIZE, fontSize: SIZE * 0.78, lineHeight: `${SIZE}px` }}>{picture.e}</div>
      {Array.from({ length: rows * cols }, (_, i) => {
        const r = Math.floor(i / cols), c = i % cols, id = `${r}-${c}`;
        const isPlaced = placed.includes(id);
        return <div key={id} {...dropProps(id)} className={`jigsaw-slot${isPlaced ? " placed" : ""}${flash === id ? " flash-wrong" : ""}${selected && !isPlaced ? " ready" : ""}`}
          style={{ left: c * w, top: r * h, width: w, height: h }}>
          {isPlaced && <Piece emoji={picture.e} r={r} c={c} rows={rows} cols={cols} />}
        </div>;
      })}
    </div>
    {!complete && <div className="tray jigsaw-tray">
      {cfg.tray.filter((id) => !placed.includes(id)).map((id) => {
        const [r, c] = id.split("-").map(Number);
        const p = itemProps(id, <Piece emoji={picture.e} r={r} c={c} rows={rows} cols={cols} scale={0.9} />);
        return <div key={id} {...p} className={`tray-piece${selected === id ? " selected" : ""}${dragging === id ? " dragging" : ""}`}>
          <Piece emoji={picture.e} r={r} c={c} rows={rows} cols={cols} scale={trayScale} />
        </div>;
      })}
    </div>}
    <p className="helper-text">Kéo mảnh vào khung, hoặc chạm vào mảnh rồi chạm vào ô.</p>
    {ghost}
  </div>;
}

export default function Jigsaw({ speak, onStars }) {
  return <LevelGame id="jigsaw" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars} intro="🧩 GHÉP MẢNH ĐỂ ĐOÁN HÌNH" />;
}
