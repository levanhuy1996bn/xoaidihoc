import { useEffect, useRef, useState } from "react";
import data from "../databases/clean-room.json";
import { pickOne, shuffle, randInt, tierFor } from "../utils";
import LevelGame from "../components/LevelGame";
import useDragDrop from "../components/useDragDrop";
import { TRY_AGAIN } from "../components/ChoiceQuiz";

function makeLevel(level, rng) {
  const t = tierFor(data.tiers, level);
  const pool = shuffle(data.items.filter((x) => t.bins.includes(x.bin)), rng);
  // mỗi chỗ cất có ít nhất 1 món, phần còn lại lấy ngẫu nhiên
  const picked = t.bins.map((b) => pickOne(pool.filter((x) => x.bin === b), undefined, rng));
  for (const x of pool) if (picked.length < t.items && !picked.includes(x)) picked.push(x);
  const items = shuffle(picked, rng).map((x, i) => ({ ...x, id: String(i), tilt: randInt(-18, 18, rng) }));
  return { bins: t.bins, items, allow: t.allow };
}

function Board({ cfg, speak, onFinish }) {
  const [stored, setStored] = useState({}); // id món → khóa chỗ cất
  const [flash, setFlash] = useState(null);
  const mistakes = useRef(0);
  const left = cfg.items.filter((x) => !stored[x.id]);
  const intro = "Phòng bừa quá! Con hãy cất mỗi món đồ vào đúng chỗ nhé";

  useEffect(() => { speak(intro); }, []);

  function onDrop(itemId, binKey) {
    const item = cfg.items.find((x) => x.id === itemId);
    if (!item || stored[itemId]) return;
    if (item.bin === binKey) {
      const next = { ...stored, [itemId]: binKey };
      setStored(next);
      speak(`${item.n} ${data.bins[binKey].say}`);
      if (Object.keys(next).length === cfg.items.length) {
        setTimeout(() => speak(data.done), 1000);
        onFinish(mistakes.current);
      }
    } else {
      mistakes.current += 1;
      setFlash(binKey); setTimeout(() => setFlash(null), 450);
      speak(TRY_AGAIN);
    }
  }
  const { itemProps, dropProps, ghost, selected, dragging } = useDragDrop(onDrop);

  return <div>
    <div className="quiz-question"><h3>Cất đồ vào đúng chỗ nhé</h3>
      <button className="replay-button" onClick={() => speak(intro)} aria-label="Nghe lại">🔊</button></div>
    <div className="room-floor">
      {left.length === 0 ? <div className="room-clean">✨ {data.done} ✨</div> :
        left.map((x) => {
          const p = itemProps(x.id, <span>{x.e}</span>);
          return <div key={x.id} {...p} style={{ ...p.style, transform: `rotate(${x.tilt}deg)` }}
            className={`room-item${selected === x.id ? " selected" : ""}${dragging === x.id ? " dragging" : ""}`} aria-label={x.n}>{x.e}</div>;
        })}
    </div>
    <div className="bins" style={{ gridTemplateColumns: `repeat(${cfg.bins.length}, minmax(0, 1fr))` }}>
      {cfg.bins.map((k) => {
        const b = data.bins[k];
        const inside = cfg.items.filter((x) => stored[x.id] === k);
        return <div key={k} {...dropProps(k)} className={`bin${flash === k ? " flash-wrong" : ""}${selected ? " ready" : ""}`} style={{ background: b.color }}>
          <span className="bin-icon">{b.icon}</span>
          <small>{b.name}</small>
          <span className="bin-inside">{inside.map((x) => <i key={x.id}>{x.e}</i>)}</span>
        </div>;
      })}
    </div>
    <p className="helper-text">Kéo đồ vào đúng chỗ, hoặc chạm vào đồ rồi chạm vào chỗ cất.</p>
    {ghost}
  </div>;
}

export default function CleanRoom({ speak, onStars }) {
  return <LevelGame id="room" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars} intro="🧸 CẤT ĐỒ VÀO ĐÚNG CHỖ" />;
}
