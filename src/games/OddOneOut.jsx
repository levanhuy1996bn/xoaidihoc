import data from "../databases/odd-one-out.json";
import { pickOne, pickN, shuffle, tierFor } from "../utils";
import LevelGame from "../components/LevelGame";
import LevelQuiz from "../components/LevelQuiz";

function makeLevel(level, rng) {
  const t = tierFor(data.tiers, level);
  const questions = Array.from({ length: data.questionsPerLevel }, () => {
    let mainKey, oddKey, mainName;
    if (t.close) {
      [mainKey, oddKey] = shuffle(pickOne(data.close, undefined, rng), rng);
      mainName = data.groups[mainKey].closeName || data.groups[mainKey].name;
    } else {
      [mainKey, oddKey] = pickN(data.distant, 2, rng);
      mainName = data.groups[mainKey].name;
    }
    const mains = pickN(data.groups[mainKey].items, t.items - 1, rng);
    const odd = pickOne(data.groups[oddKey].items, undefined, rng);
    return {
      prompt: "Hình nào khác các hình còn lại?",
      say: "Hình nào không cùng nhóm với các hình còn lại?",
      options: shuffle([...mains, odd], rng).map((e) => ({ id: e, label: e, content: e })),
      answer: odd,
      praise: `Đúng rồi! Các hình kia đều là ${mainName}`,
      columns: t.items === 4 ? 2 : 3,
    };
  });
  return { questions, allow: t.allow };
}

function Board({ cfg, speak, onFinish }) {
  return <LevelQuiz questions={cfg.questions} speak={speak} onFinish={onFinish} />;
}

export default function OddOneOut({ speak, onStars }) {
  return <LevelGame id="odd" makeLevel={makeLevel} Board={Board} speak={speak} onStars={onStars} intro="🔍 TÌM HÌNH KHÔNG CÙNG NHÓM" />;
}
