import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import Classroom from "./Classroom";
import Attendance from "./Attendance";
import OralTest from "./OralTest";
import WhoIsIt from "./WhoIsIt";
import Ranking, { rankMembers } from "./Ranking";
import { loadSeats, saveSeats, loadPresent, savePresent, loadStars, saveStars } from "./store";

const TITLES = { attendance: "📋 Điểm danh", wheel: "🎡 Kiểm tra miệng", who: "👀 Ai đây?", ranking: "🏆 Bảng vàng" };

// Tab "Lớp Dưa Góp": màn lớp học + 4 màn con
export default function FamilyClass({ speak, onCorrect }) {
  const [screen, setScreen] = useState("room");
  const [seats, setSeatsState] = useState(loadSeats);
  const [present, setPresentState] = useState(loadPresent);
  const [stars, setStarsState] = useState(loadStars);

  const setSeats = (s) => { setSeatsState(s); saveSeats(s); };
  const setPresent = (p) => { setPresentState(p); savePresent(p); };
  const setStars = (s) => { setStarsState(s); saveStars(s); };
  const go = (s) => setScreen(s);
  useEffect(() => { window.scrollTo(0, 0); }, [screen]);

  const top = rankMembers(stars)[0];
  const monitorId = top && (stars[top.id] || 0) > 0 ? top.id : null;

  if (screen === "room") return <Classroom seats={seats} setSeats={setSeats} present={present} monitorId={monitorId} speak={speak} go={go} />;

  return <div>
    <button className="back-button" onClick={() => setScreen("room")}><ArrowLeft size={18} /> Lớp Dưa Góp</button>
    <section className="game-panel">
      <div className="section-kicker">{TITLES[screen]}</div>
      {screen === "attendance" && <Attendance present={present} setPresent={setPresent} speak={speak} go={go} />}
      {screen === "wheel" && <OralTest present={present} stars={stars} setStars={setStars} speak={speak} go={go} />}
      {screen === "who" && <WhoIsIt speak={speak} onCorrect={onCorrect} />}
      {screen === "ranking" && <Ranking stars={stars} setStars={setStars} speak={speak} />}
    </section>
  </div>;
}
