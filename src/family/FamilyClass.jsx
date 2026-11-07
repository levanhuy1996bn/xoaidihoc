import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Classroom from "./Classroom";
import Attendance from "./Attendance";
import OralTest from "./OralTest";
import WhoIsIt from "./WhoIsIt";
import Ranking, { rankMembers } from "./Ranking";
import { loadSeats, saveSeats, loadPresent, savePresent, loadStars, saveStars } from "./store";
import { screens, className } from "../databases/family.json";

// Tab "Lớp Dưa Góp": màn lớp học + 4 màn con. screen lấy từ đường dẫn (/lop, /lop/diem-danh…), go(tên màn) để chuyển.
export default function FamilyClass({ screen, go, speak, onCorrect }) {
  const [seats, setSeatsState] = useState(loadSeats);
  const [present, setPresentState] = useState(loadPresent);
  const [stars, setStarsState] = useState(loadStars);

  const setSeats = (s) => { setSeatsState(s); saveSeats(s); };
  const setPresent = (p) => { setPresentState(p); savePresent(p); };
  const setStars = (s) => { setStarsState(s); saveStars(s); };

  const top = rankMembers(stars)[0];
  const monitorId = top && (stars[top.id] || 0) > 0 ? top.id : null;

  if (screen === "room") return <Classroom seats={seats} setSeats={setSeats} present={present} monitorId={monitorId} speak={speak} go={go} />;

  const info = screens[screen];
  return <div>
    <button className="back-button" onClick={() => go("room")}><ArrowLeft size={18} /> Lớp {className}</button>
    <section className="game-panel">
    <div className="section-kicker">{info.icon} {info.title}</div>
    {screen === "attendance" && <Attendance present={present} setPresent={setPresent} speak={speak} go={go} />}
    {screen === "wheel" && <OralTest present={present} stars={stars} setStars={setStars} speak={speak} go={go} />}
    {screen === "who" && <WhoIsIt speak={speak} onCorrect={onCorrect} />}
    {screen === "ranking" && <Ranking stars={stars} setStars={setStars} speak={speak} />}
    </section>
  </div>;
}
