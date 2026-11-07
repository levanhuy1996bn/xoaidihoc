import data from "../databases/patterns.json";
import { pickOne, pickN, shuffle, randInt, tierFor } from "../utils";
import LevelGame from "../components/LevelGame";
import LevelQuiz from "../components/LevelQuiz";
import { ShapeSvg } from "./Shapes";

// Mỗi phần tử trong bộ hình có id riêng: màu/hình dùng id, emoji dùng chính emoji
const idOf = (el) => el.id || el.e;

function Item({ kind, el }) {
  if (kind === "color") return <span className="pat-swatch" style={{ background: el.hex }} />;
  if (kind === "shape") return <span className="pat-shape"><ShapeSvg id={el.id} color={el.color} /></span>;
  return <span className="pat-emoji">{el.e}</span>;
}

function makeQuestion(t, rng) {
  const template = pickOne(t.templates, undefined, rng);
  const kind = pickOne(t.sets, undefined, rng);
  const letters = [...new Set(template)];
  const chosen = pickN(data.sets[kind], letters.length, rng);
  const map = Object.fromEntries(letters.map((l, i) => [l, chosen[i]]));
  const length = Math.max(t.length, template.length * 2 + 1);
  const seq = Array.from({ length }, (_, i) => map[template[i % template.length]]);
  const missing = t.missing === "end" ? length - 1 : randInt(1, length - 1, rng);
  const answer = seq[missing];
  // phương án sai: ưu tiên các hình đang có trong dãy (dễ nhầm hơn), sau đó lấy thêm từ bộ hình
  const inPattern = shuffle(chosen.filter((x) => x !== answer), rng);
  const rest = shuffle(data.sets[kind].filter((x) => !chosen.includes(x)), rng);
  const options = shuffle([answer, ...[...inPattern, ...rest].slice(0, t.options - 1)], rng);
  const end = t.missing === "end";
  return {
    prompt: end ? "Hình nào tiếp theo?" : "Hình nào còn thiếu?",
    say: end ? "Theo quy luật, hình nào tiếp theo?" : "Theo quy luật, hình nào còn thiếu?",
    visual: <div className="pattern-row">{seq.map((el, i) => i === missing
      ? <span key={i} className="pat-q">?</span>
      : <Item key={i} kind={kind} el={el} />)}</div>,
    options: options.map((el) => ({ id: idOf(el), label: el.n, content: <Item kind={kind} el={el} /> })),
    answer: idOf(answer),
    praise: `Đúng rồi! Là ${answer.n}`,
    columns: options.length === 4 ? 2 : options.length,
  };
}

function makeLevel(level, rng) {
  const t = tierFor(data.tiers, level);
  return { questions: Array.from({ length: data.questionsPerLevel }, () => makeQuestion(t, rng)), allow: t.allow };
}

function Board({ cfg, speak, onFinish }) {
  return <LevelQuiz questions={cfg.questions} speak={speak} onFinish={onFinish} />;
}

export default function Patterns({ speak, onStars }) {
  return <LevelGame id="pattern" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars} intro="🔁 NHÌN DÃY HÌNH, TÌM QUY LUẬT" />;
}
