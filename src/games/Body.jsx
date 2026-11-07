import { useState } from "react";
import { parts as bodyParts, uses as bodyUses } from "../databases/body.json";
import { pickOne, choicesWith } from "../utils";
import ModeTabs, { LEARN_PLAY } from "../components/ModeTabs";
import ChoiceQuiz from "../components/ChoiceQuiz";

const C = { skin: "#FFD9B8", hair: "#6B4A3A", shirt: "#8EC9F5", pants: "#7C8BE0", shoes: "#F27C7C" };
const HIT = { fill: "#000", fillOpacity: 0 }; // vùng chạm vô hình, to hơn hình vẽ cho dễ chạm

// Vòng sáng quanh bộ phận khi được chọn
const RINGS = {
  hair: [{ cx: 120, cy: 58, rx: 56, ry: 28 }],
  eyes: [{ cx: 99, cy: 98, rx: 14, ry: 14 }, { cx: 141, cy: 98, rx: 14, ry: 14 }],
  ears: [{ cx: 62, cy: 102, rx: 19, ry: 19 }, { cx: 178, cy: 102, rx: 19, ry: 19 }],
  nose: [{ cx: 120, cy: 114, rx: 12, ry: 12 }],
  mouth: [{ cx: 120, cy: 134, rx: 21, ry: 13 }],
  hands: [{ cx: 44, cy: 232, rx: 20, ry: 20 }, { cx: 196, cy: 232, rx: 20, ry: 20 }],
  tummy: [{ cx: 120, cy: 204, rx: 48, ry: 50 }],
  feet: [{ cx: 94, cy: 306, rx: 27, ry: 17 }, { cx: 146, cy: 306, rx: 27, ry: 17 }],
};

export function BodyFigure({ highlight, good, onPart }) {
  const tap = (id) => () => onPart(id);
  return <svg className="body-figure" viewBox="0 0 240 335" role="img" aria-label="Hình bạn nhỏ">
    {/* Bụng (áo) */}
    <g className="hit" onClick={tap("tummy")}>
      <rect x="78" y="156" width="84" height="94" rx="26" fill={C.shirt} />
      <circle cx="120" cy="222" r="2.5" fill="#5d9ccc" />
    </g>
    {/* Chân */}
    <g className="hit" onClick={tap("feet")}>
      <line x1="104" y1="246" x2="100" y2="298" stroke={C.pants} strokeWidth="22" strokeLinecap="round" />
      <line x1="136" y1="246" x2="140" y2="298" stroke={C.pants} strokeWidth="22" strokeLinecap="round" />
      <ellipse cx="94" cy="306" rx="20" ry="11" fill={C.shoes} />
      <ellipse cx="146" cy="306" rx="20" ry="11" fill={C.shoes} />
      <ellipse cx="94" cy="306" rx="27" ry="18" {...HIT} />
      <ellipse cx="146" cy="306" rx="27" ry="18" {...HIT} />
    </g>
    {/* Tay */}
    <g className="hit" onClick={tap("hands")}>
      <line x1="88" y1="172" x2="48" y2="226" stroke={C.shirt} strokeWidth="18" strokeLinecap="round" />
      <line x1="152" y1="172" x2="192" y2="226" stroke={C.shirt} strokeWidth="18" strokeLinecap="round" />
      <circle cx="44" cy="232" r="13" fill={C.skin} />
      <circle cx="196" cy="232" r="13" fill={C.skin} />
      <circle cx="44" cy="232" r="23" {...HIT} />
      <circle cx="196" cy="232" r="23" {...HIT} />
    </g>
    <rect x="111" y="144" width="18" height="16" fill={C.skin} pointerEvents="none" />
    {/* Tai (vùng chạm nằm dưới khuôn mặt, mặt không nhận chạm) */}
    <g className="hit" onClick={tap("ears")}>
      <circle cx="64" cy="102" r="13" fill={C.skin} />
      <circle cx="176" cy="102" r="13" fill={C.skin} />
      <circle cx="62" cy="102" r="6" fill="#F5BF98" />
      <circle cx="178" cy="102" r="6" fill="#F5BF98" />
      <circle cx="64" cy="102" r="21" {...HIT} />
      <circle cx="176" cy="102" r="21" {...HIT} />
    </g>
    <circle cx="120" cy="100" r="56" fill={C.skin} pointerEvents="none" />
    <circle cx="88" cy="122" r="8" fill="#FFB3B3" opacity=".6" pointerEvents="none" />
    <circle cx="152" cy="122" r="8" fill="#FFB3B3" opacity=".6" pointerEvents="none" />
    {/* Tóc */}
    <g className="hit" onClick={tap("hair")}>
      <path d="M64 96 C 56 48, 92 32, 120 34 C 150 32, 186 48, 176 96 C 170 76, 152 62, 134 66 C 124 56, 100 58, 92 70 C 80 72, 68 82, 64 96 Z" fill={C.hair} />
    </g>
    {/* Mắt */}
    <g className="hit" onClick={tap("eyes")}>
      <circle cx="99" cy="98" r="7" fill="#3d3550" />
      <circle cx="141" cy="98" r="7" fill="#3d3550" />
      <circle cx="101" cy="95.5" r="2" fill="#fff" />
      <circle cx="143" cy="95.5" r="2" fill="#fff" />
      <ellipse cx="99" cy="97" rx="16" ry="12" {...HIT} />
      <ellipse cx="141" cy="97" rx="16" ry="12" {...HIT} />
    </g>
    {/* Mũi */}
    <g className="hit" onClick={tap("nose")}>
      <ellipse cx="120" cy="114" rx="6" ry="5" fill="#F2A98A" />
      <circle cx="120" cy="114" r="11" {...HIT} />
    </g>
    {/* Miệng */}
    <g className="hit" onClick={tap("mouth")}>
      <path d="M104 128 Q 120 146 136 128 Z" fill="#E8728A" />
      <ellipse cx="120" cy="134" rx="20" ry="10" {...HIT} />
    </g>
    {(highlight || []).flatMap((id) => (RINGS[id] || []).map((r, i) =>
      <ellipse key={id + i} className={good ? "ring good" : "ring"} cx={r.cx} cy={r.cy} rx={r.rx} ry={r.ry} />))}
  </svg>;
}

const lower = (s) => s.toLowerCase();
const partById = (id) => bodyParts.find((p) => p.id === id);
const describe = (p) => `${p.name}. ${p.use}`;

function makeQuestion(prev) {
  if (Math.random() < 0.6) {
    const target = pickOne(bodyParts, prev?.target);
    return {
      target,
      prompt: `Chạm vào ${lower(target.name)} nào!`, say: `Con hãy chạm vào ${lower(target.name)}`,
      answer: target.id, praise: `Đúng rồi! Đây là ${lower(target.name)}`,
      render: ({ choose, done, answer }) => <BodyFigure highlight={done ? [answer] : []} good onPart={(id) => choose({ id })} />,
    };
  }
  const target = pickOne(bodyUses, prev?.target);
  const part = partById(target.part);
  const others = bodyUses.map((u) => partById(u.part)).filter((p) => p !== part);
  return {
    target,
    prompt: target.ask, say: target.ask,
    options: choicesWith(part, others).map((p) => ({ id: p.id, label: p.name, content: <>{p.emoji}<small>{p.short}</small></> })),
    answer: part.id, praise: `Đúng rồi! ${part.use}`,
  };
}

export default function Body({ speak, onCorrect }) {
  const [mode, setMode] = useState("learn");
  const [selected, setSelected] = useState(null);
  function pick(id) { const p = partById(id); setSelected(p); speak(describe(p)); }

  return <section className="game-panel">
    <ModeTabs tabs={LEARN_PLAY} value={mode} onChange={setMode} />
    {mode === "learn" ? <>
      <div className="section-kicker">🧒 CƠ THỂ CỦA BÉ</div>
      <h2>Chạm vào bạn nhỏ để nghe nhé!</h2>
      <div className="feedback" style={{ fontSize: 16 }}>{selected ? `${selected.emoji} ${selected.name}: ${lower(selected.use)}` : "Bé chạm vào mắt, mũi, tay, chân… nhé!"}</div>
      <BodyFigure highlight={selected ? [selected.id] : []} onPart={pick} />
      <div className="chip-row">
        {bodyParts.map((p) => <button key={p.id} className={selected === p ? "chip chosen" : "chip"} onClick={() => pick(p.id)}>
          <span>{p.emoji}</span>{p.short}
        </button>)}
      </div>
    </> : <ChoiceQuiz makeQuestion={makeQuestion} speak={speak} onCorrect={onCorrect} />}
  </section>;
}
