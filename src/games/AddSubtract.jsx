import data from "../databases/math.json";
import { pickOne, randInt, shuffle, tierFor, fill } from "../utils";
import LevelGame from "../components/LevelGame";
import LevelQuiz from "../components/LevelQuiz";

const SIGN = { add: "+", sub: "−" };
const WORD = { add: "cộng", sub: "trừ" };

// Hình minh họa: cộng = 2 nhóm gộp lại; trừ = các món bị bớt đi mờ dần và có dấu ✕
function Picture({ op, a, b, e }) {
  const item = (k, gone) => <span key={k} className={gone ? "math-obj gone" : "math-obj"}><i>{e}</i></span>;
  if (op === "add") {
    return <div className="math-pic">
      <span className="math-group">{Array.from({ length: a }, (_, i) => item(i))}</span>
      <b className="math-sign">+</b>
      <span className="math-group">{Array.from({ length: b }, (_, i) => item(i))}</span>
    </div>;
  }
  return <div className="math-pic">
    <span className="math-group">{Array.from({ length: a }, (_, i) => item(i, i >= a - b))}</span>
  </div>;
}

// Các đáp án: số đúng + số gần đó (1–10), xếp từ bé đến lớn
function numberOptions(answer, count, rng) {
  const near = [answer - 1, answer + 1, answer - 2, answer + 2, answer + 3, answer - 3].filter((n) => n >= 1 && n <= 10);
  const picks = [answer, ...shuffle(near, rng).slice(0, count - 1)].sort((x, y) => x - y);
  return picks.map((n) => ({ id: n, label: String(n), content: <span className="compare-num">{n}</span> }));
}

function makeQuestion(t, rng, seen) {
  let op, a, b, result, tries = 0;
  do {
    op = pickOne(t.ops, undefined, rng);
    if (op === "add") { result = randInt(2, t.max, rng); a = randInt(1, result - 1, rng); b = result - a; }
    else { a = randInt(2, t.max, rng); b = randInt(1, a - 1, rng); result = a - b; }
  } while (seen.has(`${op}${a},${b}`) && ++tries < 30);
  seen.add(`${op}${a},${b}`);

  const obj = pickOne(data.objects, undefined, rng);
  const missing = t.missing && rng() < 0.5; // dạng 2 + ? = 5
  const answer = missing ? b : result;
  const q = <span className="pat-q">?</span>;
  const say = t.pictures ? fill(data.say[op], { a, b, ...obj })
    : missing ? fill(data.say[`${op}Missing`], { a, sum: result, rest: result })
    : fill(data.say[`${op}Number`], { a, b });

  return {
    prompt: <span className="math-eq">{a} {SIGN[op]} {missing ? q : b} = {missing ? result : q}</span>,
    say,
    visual: t.pictures ? <Picture op={op} a={a} b={b} e={obj.e} /> : null,
    options: numberOptions(answer, t.options, rng),
    answer,
    praise: fill(data.say.praise, { text: `${a} ${WORD[op]} ${b} bằng ${result}` }),
    columns: t.options,
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

export default function AddSubtract({ speak, onStars }) {
  return <LevelGame id="math" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars} intro="➕ CỘNG TRỪ TRONG PHẠM VI 10" />;
}
