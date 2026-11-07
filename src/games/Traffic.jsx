import data from "../databases/traffic.json";
import { pickOne, shuffle, choicesWith, tierFor } from "../utils";
import LevelGame from "../components/LevelGame";
import LevelQuiz from "../components/LevelQuiz";

const COLORS = { red: "#ff5a5a", yellow: "#ffcd3c", green: "#3ddc84" };
const lower = (s) => s.toLowerCase();

export function TrafficLight({ on, small }) {
  return <svg className={small ? "traffic-light small" : "traffic-light"} viewBox="0 0 60 150" aria-hidden="true">
    <rect x="4" y="4" width="52" height="142" rx="16" fill="#3d3a4a" />
    {["red", "yellow", "green"].map((c, i) => <circle key={c} cx="30" cy={30 + i * 45} r="17" fill={COLORS[c]} opacity={c === on ? 1 : 0.18} />)}
  </svg>;
}

function Zebra() {
  return <svg className="zebra" viewBox="0 0 100 64" aria-hidden="true">
    <rect width="100" height="64" rx="8" fill="#6b6b78" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={10 + i * 17} y="8" width="9" height="48" rx="2" fill="#fff" />)}
  </svg>;
}

function makeQuestion(kind, rng, used) {
  if (kind === "light" || kind === "lightPick") {
    const L = pickOne(data.lights, undefined, rng);
    const act = data.actions[L.action];
    const praise = `Đúng rồi! ${L.name} thì ${lower(act.n)}`;
    if (kind === "light") return {
      key: kind + L.id, prompt: `${L.name} thì phải làm gì?`, say: `${L.name} thì phải làm gì?`,
      visual: <TrafficLight on={L.id} />,
      options: shuffle(Object.entries(data.actions), rng).map(([id, a]) => ({ id, label: a.n, content: <>{a.e}<small>{a.n}</small></> })),
      answer: L.action, praise,
    };
    return {
      key: kind + L.id, prompt: `Đèn nào báo “${lower(act.n)}”?`, say: `Đèn nào báo ${lower(act.n)}?`,
      options: shuffle(data.lights, rng).map((x) => ({ id: x.id, label: x.name, content: <TrafficLight on={x.id} small /> })),
      answer: L.id, praise,
    };
  }
  if (kind === "safety") {
    const S = pickOne(data.safety.filter((s) => !used.has(s.ask)), undefined, rng) || pickOne(data.safety, undefined, rng);
    return {
      key: S.ask, prompt: S.ask, say: S.ask,
      options: shuffle(S.options, rng).map((o) => ({ id: o.n, label: o.n, content: <>{o.pic === "zebra" ? <Zebra /> : o.e}<small>{o.n}</small></> })),
      answer: S.options[0].n, praise: `Đúng rồi! ${S.options[0].n}`,
    };
  }
  const G = pickOne(data.signs.filter((s) => !used.has(s.ask)), undefined, rng) || pickOne(data.signs, undefined, rng);
  return {
    key: G.ask, prompt: G.ask, say: G.ask,
    options: choicesWith(G, data.signs.filter((s) => s !== G), 3, rng).map((s) => ({ id: s.e, label: s.n, content: s.e })),
    answer: G.e, praise: `Đúng rồi! Đây là biển ${lower(G.n)}`,
  };
}

function makeLevel(level, rng) {
  const t = tierFor(data.tiers, level);
  const used = new Set();
  const questions = [];
  let kind, tries = 0;
  while (questions.length < data.questionsPerLevel) {
    kind = pickOne(t.kinds, kind, rng);
    const q = makeQuestion(kind, rng, used);
    if (used.has(q.key) && ++tries < 40) continue; // tránh lặp câu trong cùng một màn
    used.add(q.key);
    questions.push(q);
  }
  return { questions, allow: t.allow };
}

function Board({ cfg, speak, onFinish }) {
  return <LevelQuiz questions={cfg.questions} speak={speak} onFinish={onFinish} />;
}

export default function Traffic({ speak, onStars }) {
  return <LevelGame id="traffic" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars} intro="🚦 AN TOÀN GIAO THÔNG" />;
}
