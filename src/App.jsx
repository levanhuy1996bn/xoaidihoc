import { useState, useEffect } from "react";
import { ArrowLeft, Volume2, Sparkles, Star, RotateCcw } from "lucide-react";
import Header from "./components/Header";
import GameCard from "./components/GameCard";
import BottomNav from "./components/BottomNav";
import Alphabet from "./games/Alphabet";
import Numbers from "./games/Numbers";
import AnimalCounting from "./games/AnimalCounting";
import DragNumbers from "./games/DragNumbers";
import Colors from "./games/Colors";
import Shapes from "./games/Shapes";
import AnimalWorld from "./games/AnimalWorld";
import FruitsVeggies from "./games/FruitsVeggies";
import Body from "./games/Body";
import Weather from "./games/Weather";
import Gallery from "./games/Gallery";

// Danh sách màn: group "learn" = Góc học tập, "play" = Trò chơi vui, "memory" = Góc kỷ niệm
const games = [
  { id:"alphabet", group:"learn", emoji:"🔤", title:"Chữ cái", subtitle:"Nghe âm, xem hình", color:"#FFF0D9", Component: Alphabet },
  { id:"numbers", group:"learn", emoji:"🔢", title:"Con số", subtitle:"Số 1–20, lớn và bé", color:"#E2F4FF", Component: Numbers },
  { id:"colors", group:"learn", emoji:"🎨", title:"Màu sắc", subtitle:"Tìm màu, pha màu", color:"#FFE8EF", Component: Colors },
  { id:"shapes", group:"learn", emoji:"🔷", title:"Hình dạng", subtitle:"Tròn, vuông, tam giác", color:"#E6F0FF", Component: Shapes },
  { id:"zoo", group:"learn", emoji:"🦁", title:"Động vật", subtitle:"Tiếng kêu, nơi sống", color:"#FFF3D6", Component: AnimalWorld },
  { id:"produce", group:"learn", emoji:"🥕", title:"Rau củ, trái cây", subtitle:"Tên gọi và màu sắc", color:"#E8F7E4", Component: FruitsVeggies },
  { id:"body", group:"learn", emoji:"🧒", title:"Cơ thể bé", subtitle:"Mắt, mũi, tay, chân", color:"#FFEDE3", Component: Body },
  { id:"weather", group:"learn", emoji:"🌦️", title:"Thời tiết", subtitle:"Nắng, mưa và các mùa", color:"#E4F4FA", Component: Weather },
  { id:"animals", group:"play", emoji:"🐾", title:"Đếm con vật", subtitle:"Cùng đếm bạn thú", color:"#E5F8E9", Component: AnimalCounting },
  { id:"drag", group:"play", emoji:"🧩", title:"Kéo thả số", subtitle:"Đưa số vào chiếc giỏ", color:"#F3E8FF", Component: DragNumbers },
  { id:"gallery", group:"memory", emoji:"🖼️", title:"Gallery", subtitle:"Ảnh kỷ niệm của bé", color:"#FFF4E0", cta:"Xem ảnh →", Component: Gallery },
];

export default function App() {
  const [game,setGame] = useState(null);
  const [page,setPage] = useState("home");
  const [stars,setStars] = useState(()=>Number(localStorage.getItem("be-vui-stars")||0));
  const [completed,setCompleted] = useState(()=>Number(localStorage.getItem("be-vui-completed")||0));

  useEffect(()=>{localStorage.setItem("be-vui-stars",String(stars));},[stars]);
  useEffect(()=>{localStorage.setItem("be-vui-completed",String(completed));},[completed]);

  function speak(text) {
    if(!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "vi-VN"; utterance.rate = 0.82; utterance.pitch = 1.12;
    const viVoice = window.speechSynthesis.getVoices().find(v => v.lang?.toLowerCase().replace("_","-").startsWith("vi"));
    if (viVoice) utterance.voice = viVoice;
    window.speechSynthesis.speak(utterance);
  }
  function correct() { setStars(s=>s+1); setCompleted(c=>c+1); }
  function goHome() { setGame(null); setPage("home"); }
  const current = games.find(g=>g.id===game);
  useEffect(()=>{ window.scrollTo(0,0); },[game,page]);

  return <div className="app-shell">
    <Header stars={stars} onHome={goHome}/>
    <main className="main-content">
      {game ? <>
        <button className="back-button" onClick={()=>setGame(null)}><ArrowLeft size={18}/> Quay lại</button>
        <div className="game-heading"><span>{current?.emoji}</span><div><h1>{current?.title}</h1><p>{current?.group==="memory" ? current.subtitle : "Cùng học mà chơi, chơi mà học nhé!"}</p></div></div>
        {current && <current.Component key={current.id} speak={speak} onCorrect={correct}/>}
      </> : page==="progress" ? <>
        <div className="welcome-banner"><div><span className="eyebrow">BÉ ĐÃ LÀM ĐƯỢC</span><h1>Con thật tuyệt vời! 🌟</h1><p>Mỗi ngày học một chút, con sẽ giỏi hơn.</p></div><div className="welcome-art">🏆</div></div>
        <div className="stats-grid"><div className="stat-card"><Star fill="#FFB72B" color="#FFB72B"/><strong>{stars}</strong><span>Ngôi sao</span></div><div className="stat-card"><Sparkles color="#8B69D8"/><strong>{completed}</strong><span>Lượt trả lời đúng</span></div></div>
        <button className="primary-button" onClick={()=>{setStars(0);setCompleted(0);}}>Đặt lại thành tích <RotateCcw size={16}/></button>
      </> : <>
        <div className="welcome-banner">
          <div><span className="eyebrow">XIN CHÀO BÉ YÊU 👋</span><h1>Hôm nay mình<br/>học gì nhỉ?</h1><p>Chơi vui, học giỏi mỗi ngày!</p></div>
          <div className="welcome-art">🦊</div>
          <span className="sparkle sparkle-one">✨</span><span className="sparkle sparkle-two">⭐</span>
        </div>
        <div className="daily-row"><div><span className="daily-icon">🌻</span><div><b>Bé chăm học</b><small>Mỗi trò chơi là một khám phá!</small></div></div><div className="daily-stars">⭐ {stars}</div></div>
        <div className="section-title"><div><h2>Góc học tập của bé</h2><p>Học bằng hình ảnh và âm thanh</p></div><span>📚</span></div>
        <div className="games-grid">{games.filter(g=>g.group==="learn").map(g=><GameCard key={g.id} {...g} onClick={()=>setGame(g.id)}/>)}</div>
        <div className="section-title second"><div><h2>Trò chơi vui</h2><p>Chơi mà học, học mà chơi</p></div><span>🎈</span></div>
        <div className="games-grid">{games.filter(g=>g.group==="play").map(g=><GameCard key={g.id} {...g} onClick={()=>setGame(g.id)}/>)}</div>
        <div className="section-title second"><div><h2>Góc kỷ niệm</h2><p>Những bức ảnh đáng yêu của bé</p></div><span>📸</span></div>
        <div className="games-grid">{games.filter(g=>g.group==="memory").map(g=><GameCard key={g.id} {...g} onClick={()=>setGame(g.id)}/>)}</div>
        <div className="parent-note">💗 <span><b>Dành cho bé 3–5 tuổi</b><small>Nội dung đơn giản, hình ảnh vui nhộn và thao tác dễ dàng.</small></span></div>
      </>}
    </main>
    {!game && <BottomNav page={page} setPage={setPage}/>}
    <footer>Made with 💛 for little learners</footer>
  </div>;
}