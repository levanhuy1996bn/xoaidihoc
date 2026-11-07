import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Sparkles, Star, RotateCcw, Flag } from "lucide-react";
import Header from "./components/Header";
import GameCard from "./components/GameCard";
import BottomNav from "./components/BottomNav";
import { usePath, navigate, goUp, goBackTo } from "./router";
import { parseRoute, pathOf, gamePath, classPath, adventurePath, PATHS, LEVEL_GAMES } from "./routes";
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
import AddSubtract from "./games/AddSubtract";
import CompareSides from "./games/CompareSides";
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
import { track, resetAdventure, missionsDone } from "./adventure/store";
import adventure from "./databases/adventure.json";

// Nối id trong games.json với component của màn. Trò trong LEVEL_GAMES (routes.js) dùng bản đồ màn + 1–3 sao.
const COMPONENTS = {
  alphabet: Alphabet, numbers: Numbers, colors: Colors, shapes: Shapes, zoo: AnimalWorld,
  produce: FruitsVeggies, body: Body, weather: Weather,
  odd: OddOneOut, shadow: ShadowMatch, pattern: Patterns, jigsaw: Jigsaw, missing: MissingNumbers, math: AddSubtract, compare: CompareSides,
  routine: DailyRoutine, market: Supermarket, room: CleanRoom, traffic: Traffic,
  animals: AnimalCounting, drag: DragNumbers, race: Race, gallery: Gallery,
};
const games = gameList.filter((g) => COMPONENTS[g.id]).map((g) => ({ ...g, Component: COMPONENTS[g.id] }));

function readNumber(key) {
  try { return Number(localStorage.getItem(key) || 0); } catch { return 0; }
}
function writeNumber(key, value) {
  try { localStorage.setItem(key, String(value)); } catch { /* bỏ qua */ }
}

export default function App() {
  // Màn hình hiện tại lấy từ đường dẫn (xem routes.js); đường dẫn lạ thì sửa lại / về trang chủ
  const path = usePath();
  const route = parseRoute(path) || { name: "home" };
  useEffect(() => { if (pathOf(route) !== path) navigate(pathOf(route), { replace: true }); }, [path]);
  useEffect(() => { window.scrollTo(0, 0); }, [path]);

  // Trình duyệt chỉ cho đọc to sau khi người dùng chạm vào trang. Tải lại / mở link thẳng vào trò thì
  // câu hỏi đầu chưa đọc được: giữ lại, chạm lần đầu (mà không phải chạm vào đáp án) thì đọc.
  const voice = useRef({ unlocked: false, pending: null, count: 0 });
  useEffect(() => {
    function unlock() {
      const v = voice.current;
      v.unlocked = true;
      try { const u = new SpeechSynthesisUtterance(" "); u.volume = 0; window.speechSynthesis.speak(u); } catch { /* bỏ qua */ }
      const before = v.count;
      setTimeout(() => { if (v.pending && v.count === before) speak(v.pending); v.pending = null; }, 0);
    }
    window.addEventListener("click", unlock, { capture: true, once: true });
    return () => window.removeEventListener("click", unlock, { capture: true });
  }, []);
  const [stars,setStars] = useState(()=>readNumber("be-vui-stars"));
  const [completed,setCompleted] = useState(()=>readNumber("be-vui-completed"));

  useEffect(()=>{writeNumber("be-vui-stars",stars);},[stars]);
  useEffect(()=>{writeNumber("be-vui-completed",completed);},[completed]);

  function speak(text) {
    if(!("speechSynthesis" in window)) return;
    const v = voice.current;
    v.count += 1;
    if (!v.unlocked) { v.pending = text; return; } // chưa chạm vào trang: đọc sau

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
  const current = route.name === "game" ? games.find(g=>g.id===route.id) : null;
  // Nút "Quay lại" trong trò: ra hẳn khỏi trò, về nơi đã mở trò (trang chủ, Xoài phiêu lưu…)
  const exitGame = () => {
    const base = gamePath(route.id);
    goBackTo((p) => p !== base, PATHS.home);
  };
  const openGame = (id) => navigate(gamePath(id));
  const tab = route.name === "class" ? "class" : "learn"; // 2 tab trên đầu trang chủ
  const nav = { home: () => goUp(PATHS.home), adventure: () => navigate(PATHS.adventure), progress: () => navigate(PATHS.progress) };
  const navActive = route.name === "adventure" ? "adventure" : route.name === "progress" ? "progress" : route.name === "game" ? null : "home";

  // Nút "Chơi ngay" của trò có màn hiện màn đang chơi tới
  const cardCta = (g) => {
    if (!LEVEL_GAMES.includes(g.id)) return g.cta;
    const done = clearedCount(getProgress(g.id));
    return done ? `Màn ${done + 1} →` : g.cta;
  };

  return <div className="app-shell">
    <Header stars={stars} onHome={nav.home}/>
    <main className="main-content">
      {current ? <>
        <button className="back-button" onClick={exitGame}><ArrowLeft size={18}/> Quay lại</button>
        <div className="game-heading"><span>{current.emoji}</span><div><h1>{current.title}</h1><p>{current.group==="memory" ? current.subtitle : "Cùng học mà chơi, chơi mà học nhé!"}</p></div></div>
        <current.Component key={current.id} speak={speak} onCorrect={correct} onStars={addStars}/>
      </> : route.name==="adventure" ? <Adventure stars={stars} completed={completed} speak={speak} games={games} onPlay={openGame}
          tab={route.tab} onTab={(t)=>navigate(adventurePath(t), { replace: true })}/>
      : route.name==="progress" ? <>
        <div className="welcome-banner"><div><span className="eyebrow">BÉ ĐÃ LÀM ĐƯỢC</span><h1>Con thật tuyệt vời! 🌟</h1><p>Mỗi ngày học một chút, con sẽ giỏi hơn.</p></div><div className="welcome-art">🏆</div></div>
        <div className="stats-grid">
          <div className="stat-card"><Star fill="#FFB72B" color="#FFB72B"/><strong>{stars}</strong><span>Ngôi sao</span></div>
          <div className="stat-card"><Sparkles color="#8B69D8"/><strong>{completed}</strong><span>Lượt trả lời đúng</span></div>
          <div className="stat-card"><Flag color="#4ba5dc"/><strong>{levelsCleared()}</strong><span>Màn đã vượt qua</span></div>
        </div>
        <button className="primary-button" onClick={()=>{setStars(0);setCompleted(0);resetProgress();resetAdventure();}}>Đặt lại thành tích <RotateCcw size={16}/></button>
      </> : <>
        <div className="mode-tabs top-tabs" role="tablist">
          <button role="tab" aria-selected={tab==="learn"} className={tab==="learn"?"active":""} onClick={()=>navigate(PATHS.home, { replace: true })}><span>🥭</span>Xoài Vui Học</button>
          <button role="tab" aria-selected={tab==="class"} className={tab==="class"?"active":""} onClick={()=>navigate(PATHS.class, { replace: true })}><span>🏫</span>Lớp {familyClassName}</button>
        </div>
        {tab==="class" ? <FamilyClass screen={route.screen} speak={speak} onCorrect={correct}
          go={(s)=> s==="room" ? goUp(PATHS.class) : navigate(classPath(s))}/> : <>
        <div className="welcome-banner">
          <div><span className="eyebrow">{home.greeting}</span><h1 style={{whiteSpace:"pre-line"}}>{home.title}</h1><p>{home.subtitle}</p></div>
          <div className="welcome-art">{home.art}</div>
          <span className="sparkle sparkle-one">✨</span><span className="sparkle sparkle-two">⭐</span>
        </div>
        <button className="daily-row adv-entry" onClick={nav.adventure}>
          <div><span className="daily-icon">{home.dailyIcon}</span><div><b>{home.dailyTitle}</b><small>{fill(home.dailySubtitle, { done: missionsDone(), total: adventure.missions.length })}</small></div></div>
          <div className="daily-stars">⭐ {stars}</div>
        </button>
        {sections.map((s, i) => {
          const list = games.filter(g=>g.group===s.group);
          if (!list.length) return null;
          return <div key={s.group}>
            <div className={i ? "section-title second" : "section-title"}><div><h2>{s.title}</h2><p>{s.subtitle}</p></div><span>{s.icon}</span></div>
            <div className="games-grid">{list.map(g=><GameCard key={g.id} {...g} cta={cardCta(g)} onClick={()=>openGame(g.id)}/>)}</div>
          </div>;
        })}
        <div className="parent-note">💗 <span><b>{home.noteTitle}</b><small>{home.noteText}</small></span></div>
        </>}
      </>}
    </main>
    {navActive !== null && <BottomNav active={navActive} onNav={(n)=>nav[n]()}/>}
    <footer>{home.footer}</footer>
  </div>;
}
