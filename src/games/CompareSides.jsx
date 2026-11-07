import data from "../databases/compare.json";
import { pickOne, pickN, randInt, shuffle, tierFor, fill } from "../utils";
import LevelGame from "../components/LevelGame";
import LevelQuiz from "../components/LevelQuiz";

const S = data.say;
const COLS = 3, ROWS = 4; // ô lưới để rải con vật khi xếp lộn xộn (tối đa 12 con)

// Một bãi cỏ: xếp gọn hoặc rải lộn xộn
function Field({ side }) {
  const style = { fontSize: side.big ? 44 : 30 };
  if (!side.spots) {
    return <span className="cmp-neat">{Array.from({ length: side.n }, (_, i) => <span key={i} style={style}>{side.animal.e}</span>)}</span>;
  }
  return side.spots.map((p, i) => <span key={i} className="cmp-spot" style={{ ...style, left: `${p.x}%`, top: `${p.y}%` }}>{side.animal.e}</span>);
}

function scatter(n, rng) {
  const cells = shuffle(Array.from({ length: COLS * ROWS }, (_, i) => i), rng).slice(0, n);
  return cells.map((c) => ({
    x: Math.min(84, Math.max(16, ((c % COLS) + 0.5) / COLS * 100 + randInt(-8, 8, rng))),
    y: Math.min(88, Math.max(12, (Math.floor(c / COLS) + 0.5) / ROWS * 100 + randInt(-5, 5, rng))),
  }));
}

function makeQuestion(t, rng, seen) {
  let L, R, equal, tries = 0;
  do {
    equal = t.equal && rng() < 0.25;
    L = randInt(t.min, t.max, rng);
    R = equal ? L : randInt(t.min, t.max, rng);
  } while (((!equal && Math.abs(L - R) < t.gap) || seen.has(`${L},${R}`)) && ++tries < 50);
  seen.add(`${L},${R}`);

  const ask = pickOne(t.ask, undefined, rng);
  const [A, B] = t.mixed ? pickN(data.animals, 2, rng) : Array(2).fill(pickOne(data.animals, undefined, rng));
  const sides = [
    { id: "left", n: L, animal: A, big: t.bigFew && L < R, spots: t.scatter ? scatter(L, rng) : null },
    { id: "right", n: R, animal: B, big: t.bigFew && R < L, spots: t.scatter ? scatter(R, rng) : null },
  ];
  const answer = equal ? "equal" : (ask === "more") === (L > R) ? "left" : "right";
  const win = sides.find((s) => s.id === answer), lose = sides.find((s) => s.id !== answer);
  const praise = equal ? fill(S.praiseEqual, { a: L })
    : fill(S.praise, { a: win.n, an: win.animal.n, word: S.words[ask], b: lose.n, bn: lose.animal.n });

  const options = [...sides.map((s) => ({ id: s.id, label: `${s.n} ${s.animal.n}` })), ...(t.equal ? [{ id: "equal", label: S.equalLabel }] : [])];
  return {
    prompt: S.prompt[ask],
    say: t.equal ? S[`${ask}Equal`] : S[ask],
    options, answer, praise,
    render: ({ choose, done, wrong }) => {
      const cls = (id) => (done && id === answer ? " correct" : wrong.includes(id) ? " wrong" : "");
      return <div className="cmp">
        <div className="cmp-sides">
          {sides.map((s, i) => <button key={s.id} className={`cmp-side side-${i}${cls(s.id)}`} aria-label={i ? "Bên phải" : "Bên trái"}
            onClick={() => choose(options[i])}>
            <Field side={s} />
            {done && <span className="cmp-count">{s.n}</span>}
          </button>)}
        </div>
        {t.equal && <button className={`cmp-equal${cls("equal")}`} onClick={() => choose(options[2])}>🟰 {S.equalLabel}</button>}
      </div>;
    },
  };
}

function makeLevel(level, rng) {
  const t = tierFor(data.tiers, level);
  const seen = new Set();
  return { questions: Array.from({ length: data.questionsPerLevel }, () => makeQuestion(t, rng, seen)), allow: t.allow };
}

function Board({ cfg, speak, onFinish }) {
  return <LevelQuiz questions={cfg.questions} speak={speak} onFinish={onFinish} />;
}

export default function CompareSides({ speak, onStars }) {
  return <LevelGame id="compare" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars} intro="⚖️ BÊN NÀO NHIỀU HƠN?" />;
}
