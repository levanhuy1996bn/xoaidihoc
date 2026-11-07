import { useEffect, useRef, useState } from "react";
import data from "../databases/shadows.json";
import { pickOne, pickN, shuffle, tierFor } from "../utils";
import LevelGame from "../components/LevelGame";
import useDragDrop from "../components/useDragDrop";
import { TRY_AGAIN } from "../components/ChoiceQuiz";

function makeLevel(level, rng) {
  const t = tierFor(data.tiers, level);
  const keys = Object.keys(data.groups);
  let items;
  if (t.similar) {
    const key = pickOne(keys.filter((k) => data.groups[k].length >= t.count), undefined, rng);
    items = pickN(data.groups[key], t.count, rng);
  } else {
    // mỗi bạn lấy từ một nhóm khác nhau → bóng khác hẳn nhau, dễ hơn
    items = pickN(keys, Math.min(t.count, keys.length), rng).map((k) => pickOne(data.groups[k], undefined, rng));
  }
  return { targets: shuffle(items, rng), tray: shuffle(items, rng), allow: t.allow };
}

function Board({ cfg, speak, onFinish }) {
  const [matched, setMatched] = useState([]);
  const [flash, setFlash] = useState(null);
  const mistakes = useRef(0);
  const finished = matched.length === cfg.targets.length;

  useEffect(() => { speak("Con hãy kéo mỗi bạn vào đúng cái bóng nhé"); }, []);

  function onDrop(itemE, targetE) {
    if (matched.includes(targetE) || finished) return;
    if (itemE === targetE) {
      const next = [...matched, targetE];
      setMatched(next);
      const item = cfg.targets.find((x) => x.e === itemE);
      speak(item.n[0].toUpperCase() + item.n.slice(1));
      if (next.length === cfg.targets.length) onFinish(mistakes.current);
    } else {
      mistakes.current += 1;
      setFlash(targetE); setTimeout(() => setFlash(null), 450);
      speak(TRY_AGAIN);
    }
  }
  const { itemProps, dropProps, ghost, selected, dragging } = useDragDrop(onDrop);
  const cols = cfg.targets.length <= 3 ? cfg.targets.length : 3;

  return <div>
    <div className="quiz-question"><h3>Kéo mỗi bạn vào đúng cái bóng</h3>
      <button className="replay-button" onClick={() => speak("Con hãy kéo mỗi bạn vào đúng cái bóng nhé")} aria-label="Nghe lại">🔊</button></div>
    <div className="shadow-grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
      {cfg.targets.map((x) => {
        const done = matched.includes(x.e);
        return <div key={x.e} {...dropProps(x.e)} className={`shadow-slot${done ? " done" : ""}${flash === x.e ? " flash-wrong" : ""}${selected && !done ? " ready" : ""}`}>
          <span className={done ? "" : "silhouette"}>{x.e}</span>
          {done && <small>{x.n}</small>}
        </div>;
      })}
    </div>
    <div className="tray">
      {cfg.tray.filter((x) => !matched.includes(x.e)).map((x) => {
        const p = itemProps(x.e, <span>{x.e}</span>);
        return <div key={x.e} {...p} className={`tray-item${selected === x.e ? " selected" : ""}${dragging === x.e ? " dragging" : ""}`}>{x.e}</div>;
      })}
      {finished && <div className="feedback">Giỏi quá! 🎉</div>}
    </div>
    <p className="helper-text">Kéo bạn vào bóng, hoặc chạm vào bạn rồi chạm vào bóng.</p>
    {ghost}
  </div>;
}

export default function ShadowMatch({ speak, onStars }) {
  return <LevelGame id="shadow" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars} intro="👤 KÉO MỖI BẠN VÀO ĐÚNG CÁI BÓNG" />;
}
