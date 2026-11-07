import { useState } from "react";
import Avatar from "./Avatar";
import { members } from "./store";
import { pickOne, choicesWith } from "../utils";
import ModeTabs from "../components/ModeTabs";
import ChoiceQuiz from "../components/ChoiceQuiz";

const TABS = [{ id: "photo", icon: "🖼️", label: "Nhìn ảnh, chọn tên" }, { id: "name", icon: "👂", label: "Nghe tên, chọn ảnh" }];

function photoQuestion(prev) {
  const m = pickOne(members, prev?.m);
  return {
    m, prompt: "Đây là ai?", say: "Đây là ai?",
    visual: <Avatar m={m} size={150} />,
    options: choicesWith(m, members.filter((x) => x !== m)).map((x) => ({ id: x.id, label: x.name, content: <span className="name-option">{x.name}</span> })),
    answer: m.id, columns: 1, praise: `Đúng rồi! Đây là ${m.name}`,
  };
}

function nameQuestion(prev) {
  const m = pickOne(members, prev?.m);
  return {
    m, prompt: `Đâu là ${m.name}?`, say: `Đâu là ${m.name}?`,
    options: choicesWith(m, members.filter((x) => x !== m)).map((x) => ({ id: x.id, label: x.name, content: <Avatar m={x} size={88} /> })),
    answer: m.id, columns: 3, praise: `Đúng rồi! Đây là ${m.name}`,
  };
}

export default function WhoIsIt({ speak, onCorrect }) {
  const [tab, setTab] = useState("photo");
  return <div>
    <ModeTabs tabs={TABS} value={tab} onChange={setTab} />
    <ChoiceQuiz key={tab} makeQuestion={tab === "photo" ? photoQuestion : nameQuestion} speak={speak} onCorrect={onCorrect} />
  </div>;
}
