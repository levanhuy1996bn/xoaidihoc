import { useState, useEffect } from "react";
import { ArrowLeft, Sparkles, Star, RotateCcw, Flag } from "lucide-react";
import Header from "./components/Header";
import GameCard from "./components/GameCard";
import BottomNav from "./components/BottomNav";
import { home, sections, games as gameList } from "./databases/games.json";
import { className as familyClassName } from "./databases/family.json";
import { getProgress, clearedCount, levelsCleared, resetProgress } from "./levels/progress";
import { fill } from "./utils";
import Alphabet from "./games/Alphabet";
import Numbers from "./games/Numbers";
import Colors from "./games/Colors";
import Shapes from "./games/Shapes";
import AnimalWorld from "./games/AnimalWorld";
import FruitsVeggies from "./games/FruitsVeggies";
import Body from "./games/Body";
import Weather from "./games/Weather";
import OddOneOut from "./games/OddOneOut";
import ShadowMatch from "./games/ShadowMatch";
import Patterns from "./games/Patterns";
import Jigsaw from "./games/Jigsaw";
import MissingNumbers from "./games/MissingNumbers";
import DailyRoutine from "./games/DailyRoutine";
import Supermarket from "./games/Supermarket";
import CleanRoom from "./games/CleanRoom";
import Traffic from "./games/Traffic";
import AnimalCounting from "./games/AnimalCounting";
import DragNumbers from "./games/DragNumbers";
import Race from "./games/Race";
import Gallery from "./games/Gallery";
import FamilyClass from "./family/FamilyClass";
import Adventure from "./adventure/Adventure";
import { track, resetAdventure, missionsDone, loadSave } from "./adventure/store";
import adventure from "./databases/adventure.json";

// Nối id trong games.json với component của màn. Trò có levels: true dùng bản đồ màn + 1–3 sao.
const COMPONENTS = {
  alphabet: Alphabet, numbers: Numbers, colors: Colors, shapes: Shapes, zoo: AnimalWorld,
  produce: FruitsVeggies, body: Body, weather: Weather,
  odd: OddOneOut, shadow: ShadowMatch, pattern: Patterns, jigsaw: Jigsaw, missing: MissingNumbers,
  routine: DailyRoutine, market: Supermarket, room: CleanRoom, traffic: Traffic,
  animals: AnimalCounting, drag: DragNumbers, race: Race, gallery: Gallery,
};
const LEVEL_GAMES = ["odd", "shadow", "pattern", "jigsaw", "missing", "routine", "market", "room", "traffic"];
const games = gameList.filter((g) => COMPONENTS[g.id]).map((g) => ({ ...g, Component: COMPONENTS[g.id] }));

function readNumber(key) {
  try { return Number(localStorage.getItem(key) || 0); } catch { return 0; }
}
function writeNumber(key, value) {
  try { localStorage.setItem(key, String(value)); } catch { /* bỏ qua */ }
}

export default function App() {
  const [game,setGame] = useState(null);
  const [page,setPage] = useState("home");
  const [space,setSpace] = useState(() => { try { return localStorage.getItem("be-vui-space") || "learn"; } catch { return "learn"; } });
  function changeSpace(v) { setSpace(v); try { localStorage.setItem("be-vui-space", v); } catch { /* bỏ qua */ } }
  const [stars,setStars] = useState(()=>readNumber("be-vui-stars"));
  const [completed,setCompleted] = useState(()=>readNumber("be-vui-completed"));

  useEffect(()=>{writeNumber("be-vui-stars",stars);},[stars]);
  useEffect(()=>{writeNumber("be-vui-completed",completed);},[completed]);

  function speak(text) {
    if(!("speechSynthesis" in window)) return;
    const synth = window.speechSynthesis;
    const make = (useVoice) => {
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "vi-VN"; u.rate = 0.82; u.pitch = 1.12;
      const viVoice = useVoice && synth.getVoices().find(v => v.lang?.toLowerCase().replace("_","-").startsWith("vi"));
      if (viVoice) u.voice = viVoice;
      return u;
    };
    synth.cancel();
    synth.resume(); // Chrome trên máy tính đôi khi bị "kẹt" ở trạng thái tạm dừng
    const u = make(true);
    let started = false;
    u.onstart = () => { started = true; };
    synth.speak(u);
    // Sau 1,5 giây vẫn chưa đọc được thì thử lại một lần, để trình duyệt tự chọn giọng tiếng Việt
    clearTimeout(window.__speakRetry);
    window.__speakRetry = setTimeout(() => {
      if (started || synth.speaking) return;
      synth.cancel(); synth.resume(); synth.speak(make(false));
    }, 1500);
  }
  // track(): đếm cho nhiệm vụ hằng ngày của Xoài phiêu lưu
  function correct() { setStars(s=>s+1); setCompleted(c=>c+1); track("correct"); track("stars"); }
  function addStars(n) { setStars(s=>s+n); track("stars", n); }
  function goHome() { setGame(null); setPage("home"); }
  const current = games.find(g=>g.id===game);
  useEffect(()=>{ window.scrollTo(0,0); },[game,page]);

  // Nút "Chơi ngay" của trò có màn hiện màn đang chơi tới
  const cardCta = (g) => {
    if (!LEVEL_GAMES.includes(g.id)) return g.cta;
    const done = clearedCount(getProgress(g.id));
    return done ? `Màn ${done + 1} →` : g.cta;
  };

  return <div className="app-shell">
    <Header stars={stars} onHome={goHome}/>
    <main className="main-content">
      {game ? <>
        <button className="back-button" onClick={()=>setGame(null)}><ArrowLeft size={18}/> Quay lại</button>
        <div className="game-heading"><span>{current?.emoji}</span><div><h1>{current?.title}</h1><p>{current?.group==="memory" ? current.subtitle : "Cùng học mà chơi, chơi mà học nhé!"}</p></div></div>
        {current && <current.Component key={current.id} speak={speak} onCorrect={correct} onStars={addStars}/>}
      </> : page==="adventure" ? <Adventure stars={stars} completed={completed} speak={speak} games={games} onPlay={setGame}/>
      : page==="progress" ? <>
        <div className="welcome-banner"><div><span className="eyebrow">BÉ ĐÃ LÀM ĐƯỢC</span><h1>Con thật tuyệt vời! 🌟</h1><p>Mỗi ngày học một chút, con sẽ giỏi hơn.</p></div><div className="welcome-art">🏆</div></div>
        <div className="stats-grid">
          <div className="stat-card"><Star fill="#FFB72B" color="#FFB72B"/><strong>{stars}</strong><span>Ngôi sao</span></div>
          <div className="stat-card"><Sparkles color="#8B69D8"/><strong>{completed}</strong><span>Lượt trả lời đúng</span></div>
          <div className="stat-card"><Flag color="#4ba5dc"/><strong>{levelsCleared()}</strong><span>Màn đã vượt qua</span></div>
        </div>
        <button className="primary-button" onClick={()=>{setStars(0);setCompleted(0);resetProgress();resetAdventure();}}>Đặt lại thành tích <RotateCcw size={16}/></button>
      </> : <>
        <div className="mode-tabs top-tabs" role="tablist">
          <button role="tab" aria-selected={space==="learn"} className={space==="learn"?"active":""} onClick={()=>changeSpace("learn")}><span>🥭</span>Xoài Vui Học</button>
          <button role="tab" aria-selected={space==="class"} className={space==="class"?"active":""} onClick={()=>changeSpace("class")}><span>🏫</span>Lớp {familyClassName}</button>
        </div>
        {space==="class" ? <FamilyClass speak={speak} onCorrect={correct}/> : <>
        <div className="welcome-banner">
          <div><span className="eyebrow">{home.greeting}</span><h1 style={{whiteSpace:"pre-line"}}>{home.title}</h1><p>{home.subtitle}</p></div>
          <div className="welcome-art">{home.art}</div>
          <span className="sparkle sparkle-one">✨</span><span className="sparkle sparkle-two">⭐</span>
        </div>
        <button className="daily-row adv-entry" onClick={()=>setPage("adventure")}>
          <div><span className="daily-icon">{adventure.pets.find(p=>p.id===loadSave().pet)?.emoji || home.dailyIcon}</span><div><b>{home.dailyTitle}</b><small>{fill(home.dailySubtitle, { done: missionsDone(), total: adventure.missions.length })}</small></div></div>
          <div className="daily-stars">⭐ {stars}</div>
        </button>
        {sections.map((s, i) => {
          const list = games.filter(g=>g.group===s.group);
          if (!list.length) return null;
          return <div key={s.group}>
            <div className={i ? "section-title second" : "section-title"}><div><h2>{s.title}</h2><p>{s.subtitle}</p></div><span>{s.icon}</span></div>
            <div className="games-grid">{list.map(g=><GameCard key={g.id} {...g} cta={cardCta(g)} onClick={()=>setGame(g.id)}/>)}</div>
          </div>;
        })}
        <div className="parent-note">💗 <span><b>{home.noteTitle}</b><small>{home.noteText}</small></span></div>
        </>}
      </>}
    </main>
    {!game && <BottomNav page={page} setPage={setPage}/>}
    <footer>Made with 💛 for little learners</footer>
  </div>;
}
