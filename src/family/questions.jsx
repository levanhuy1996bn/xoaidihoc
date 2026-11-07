// Câu hỏi kiểm tra miệng: lấy ngẫu nhiên từ nội dung các màn học có sẵn
import { animals } from "../databases/animals.json";
import { items as produce } from "../databases/produce.json";
import { letters } from "../databases/alphabet.json";
import { shapes } from "../databases/shapes.json";
import { lights, actions } from "../databases/traffic.json";
import { parts, uses } from "../databases/body.json";
import { gear } from "../databases/weather.json";
import { countingEmojis } from "../databases/numbers.json";
import { pickOne, randInt } from "../utils";
import { ShapeSvg } from "../games/Shapes";
import { TrafficLight } from "../games/Traffic";
import { classInfo } from "./store";

const lower = (s) => s.toLowerCase();

const MAKERS = {
  animal: () => {
    const a = pickOne(animals.filter((x) => x.sound));
    return { topic: "Động vật", visual: <span>{a.emoji}</span>, text: `${a.name} kêu thế nào?`, answer: `“${a.sound}”` };
  },
  color: () => {
    const p = pickOne(produce.filter((x) => x.color));
    return { topic: "Màu sắc", visual: <span>{p.emoji}</span>, text: `${p.name} màu gì?`, answer: `Màu ${lower(p.color)}` };
  },
  count: () => {
    const n = randInt(1, 10), e = pickOne(countingEmojis);
    return { topic: "Đếm số", visual: <div className="count-row">{Array.from({ length: n }, (_, i) => <span key={i}>{e}</span>)}</div>, text: "Đếm xem có mấy hình?", answer: `${n}` };
  },
  letter: () => {
    const l = pickOne(letters);
    return { topic: "Chữ cái", visual: <b className="big-glyph">{l.upper}{l.lower}</b>, text: "Chữ này đọc là gì?", answer: `“${l.sound}”` };
  },
  shape: () => {
    const s = pickOne(shapes);
    return { topic: "Hình dạng", visual: <span className="q-shape"><ShapeSvg id={s.id} color={s.color} /></span>, text: "Đây là hình gì?", answer: s.name };
  },
  traffic: () => {
    const L = pickOne(lights);
    return { topic: "Giao thông", visual: <TrafficLight on={L.id} small />, text: `${L.name} thì phải làm gì?`, answer: actions[L.action].n };
  },
  body: () => {
    const u = pickOne(uses);
    const p = parts.find((x) => x.id === u.part);
    return { topic: "Cơ thể", visual: <span>🧒</span>, text: u.ask, answer: p.name };
  },
  weather: () => {
    const g = pickOne(gear);
    return { topic: "Thời tiết", visual: <span>{g.emoji}</span>, text: `${g.when} thì cần mang gì?`, answer: g.item.n };
  },
  fun: () => {
    const f = pickOne(classInfo.funQuestions);
    return { topic: "Thử thách vui", visual: <span>{f.e}</span>, text: f.text, answer: "Cả nhà chấm nhé!" };
  },
};

export function makeQuestion(prevTopic) {
  const key = pickOne(Object.keys(MAKERS), prevTopic);
  return { key, ...MAKERS[key]() };
}
