import { useEffect, useRef, useState } from "react";
import data from "../databases/adventure.json";
import { fill } from "../utils";
import { levelsCleared } from "../levels/progress";
import { getToday, track, loadSave, saveSave, islandsOpen } from "./store";

const T = data.texts;
const findPet = (id) => data.pets.find((p) => p.id === id) || data.pets[0];

/**
 * Xoài phiêu lưu: bản đồ đảo (mở bằng sao), nhiệm vụ hằng ngày (thưởng xu),
 * nuôi thú cưng, cửa hàng và huy hiệu. Mọi chữ và con số nằm trong databases/adventure.json.
 * Chạm vào bất cứ thứ gì cũng được đọc to, để bé chưa biết chữ vẫn chơi được.
 */
// tab lấy từ đường dẫn (/phieu-luu, /phieu-luu/nhiem-vu…); onTab(id) để đổi tab
export default function Adventure({ stars, completed, speak, games, onPlay, tab = "map", onTab }) {
  const [save, setSaveState] = useState(loadSave);
  const [today, setToday] = useState(getToday);
  const [toast, setToast] = useState("");
  const [picked, setPicked] = useState(null);
  const [anim, setAnim] = useState(null);
  const toastTimer = useRef(null);

  const update = (patch) => { const next = { ...save, ...patch }; setSaveState(next); saveSave(next); return next; };
  function say(text) {
    speak(text); setToast(text);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3000);
  }
  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const open = islandsOpen(stars);
  const next = data.islands.find((i) => stars < i.need);
  const prevNeed = open.length ? open[open.length - 1].need : 0;
  const pct = next ? Math.round(((stars - prevNeed) / (next.need - prevNeed)) * 100) : 100;
  const pet = findPet(save.pet);
  const petLevel = save.levels?.[pet.id] || 1;

  // Mở Adventure: chúc mừng đảo mới mở (nếu có), không thì chào
  useEffect(() => {
    const fresh = open.filter((i) => !save.seenIslands.includes(i.id));
    if (fresh.length) {
      const last = fresh[fresh.length - 1];
      update({ seenIslands: [...save.seenIslands, ...fresh.map((i) => i.id)] });
      setPicked(last.id);
      say(fill(T.islandNew, last));
    } else speak(T.welcome);
  }, []);

  function changeTab(t) { onTab(t.id); speak(t.label); window.scrollTo(0, 0); }

  // ---- Đảo
  function tapIsland(island) {
    if (stars >= island.need) { setPicked(picked === island.id ? null : island.id); speak(fill(T.islandOpen, island)); }
    else { setPicked(null); say(fill(T.islandLocked, { ...island, need: island.need - stars })); }
  }

  // ---- Nhiệm vụ
  const progressOf = (m) => Math.min(today[m.metric] || 0, m.target);
  function tapMission(m) {
    const p = progressOf(m);
    if (save.claimed.includes(m.id)) return say(fill(T.reward, { coins: m.reward }));
    say(p >= m.target ? T.missionReady : fill(T.missionTodo, { ...m, progress: p }));
  }
  function claim(m) {
    if (progressOf(m) < m.target || save.claimed.includes(m.id)) return;
    const claimed = [...save.claimed, m.id];
    update({ coins: save.coins + m.reward, claimed });
    say(fill(T.reward, { coins: m.reward }) + (claimed.length === data.missions.length ? ". " + T.allDone : ""));
  }

  // ---- Thú cưng
  function useItem(item) {
    if (!save[item.id]) return say(fill(T.noItem, { item: item.name.toLowerCase() }));
    const isGift = item.id === "gift";
    if (!isGift && today.care >= data.maxHappy) return say(fill(T.full, { pet: pet.name }));
    const patch = { [item.id]: save[item.id] - 1 };
    if (isGift) patch.levels = { ...save.levels, [pet.id]: petLevel + 1 };
    update(patch);
    track("care"); setToday(getToday());
    setAnim({ emoji: item.emoji, k: Date.now() });
    say(fill(T[item.id], { pet: pet.name, level: petLevel + 1 }));
  }
  function choosePet(p) {
    if (save.owned.includes(p.id)) { update({ pet: p.id }); return say(fill(T.choose, { pet: p.name })); }
    if (save.coins < p.price) return say(T.notEnough);
    update({ coins: save.coins - p.price, owned: [...save.owned, p.id], pet: p.id });
    setAnim({ emoji: "💖", k: Date.now() });
    say(fill(T.adopt, { pet: p.name }));
  }
  function buy(item) {
    if (save.coins < item.price) return say(T.notEnough);
    update({ coins: save.coins - item.price, [item.id]: (save[item.id] || 0) + 1 });
    say(fill(T.bought, { item: item.name.toLowerCase() }));
  }

  // ---- Huy hiệu
  const totals = {
    correct: completed, stars, levels: levelsCleared(), islands: open.length,
    pets: save.owned.length, petLevel: Math.max(1, ...Object.values(save.levels || {})), streak: today.streak,
  };

  return <div className="adventure">
    <div className="adv-hero">
      <div className="adv-hero-text">
        <span className="eyebrow">{T.kicker}</span>
        <h1>{T.title}</h1>
        <small>{next ? fill(T.nextIsland, { need: next.need - stars, name: next.name }) : T.allIslands}</small>
        <div className="adv-bar"><i style={{ width: `${pct}%` }} /></div>
      </div>
      <button className="adv-hero-pet" onClick={() => changeTab(data.tabs.find((t) => t.id === "pet"))} aria-label={pet.name}>
        <span>{pet.emoji}</span><small>Cấp {petLevel}</small>
      </button>
    </div>
    <div className="adv-stats">
      <span>⭐ {stars}</span><span>🪙 {save.coins} xu</span><span>🔥 {today.streak} ngày</span>
    </div>

    <div className="adv-tabs" role="tablist">
      {data.tabs.map((t) => <button key={t.id} role="tab" aria-selected={tab === t.id} className={tab === t.id ? "active" : ""} onClick={() => changeTab(t)}>
        <span>{t.emoji}</span><small>{t.label}</small>
      </button>)}
    </div>

    {toast && <div className="adv-toast" onClick={() => setToast("")}>{toast}</div>}

    {tab === "map" && <section className="adv-map">
      <p className="helper-text">{T.islandHint}</p>
      {data.islands.map((island, i) => {
        const isOpen = stars >= island.need;
        return <div key={island.id} className={`adv-stop ${i % 2 ? "right" : "left"}`}>
          <button className={`adv-island${isOpen ? "" : " locked"}${picked === island.id ? " picked" : ""}`} style={{ "--c": island.color }} onClick={() => tapIsland(island)}>
            <span className="adv-island-art">{isOpen ? island.emoji : "🔒"}</span>
            <span className="adv-island-text"><b>{island.name}</b><small>{isOpen ? island.description : `Cần ${island.need} ⭐`}</small></span>
          </button>
          {isOpen && picked === island.id && <div className="adv-island-games">
            {island.games.map((id) => games.find((g) => g.id === id)).filter(Boolean).map((g) =>
              <button key={g.id} className="chip" onClick={() => onPlay(g.id)}>{g.emoji} {g.title}</button>)}
          </div>}
        </div>;
      })}
    </section>}

    {tab === "missions" && <section>
      <p className="helper-text">{T.missionsHint}</p>
      {data.missions.map((m) => {
        const p = progressOf(m), done = p >= m.target, claimed = save.claimed.includes(m.id);
        return <div key={m.id} className={`adv-row${claimed ? " claimed" : done ? " ready" : ""}`} onClick={() => tapMission(m)}>
          <span className="adv-row-emoji">{m.emoji}</span>
          <div className="adv-row-body">
            <b>{m.title}</b><small>{m.text} · {p}/{m.target}</small>
            <div className="adv-bar"><i style={{ width: `${(p / m.target) * 100}%` }} /></div>
          </div>
          {claimed ? <span className="adv-done">✓</span>
            : <button className="adv-claim" disabled={!done} onClick={(e) => { e.stopPropagation(); claim(m); }}>🪙 {m.reward}</button>}
        </div>;
      })}
    </section>}

    {tab === "pet" && <section>
      <div className="adv-pet-stage">
        <span key={anim?.k} className={`adv-pet${anim ? " happy" : ""}`}>{pet.emoji}</span>
        {anim && <span key={`f${anim.k}`} className="adv-float">{anim.emoji}</span>}
        <b>{pet.name} · Cấp {petLevel}</b>
        <div className="adv-hearts" aria-label={`${Math.min(today.care, data.maxHappy)} trái tim`}>
          {Array.from({ length: data.maxHappy }, (_, i) => <span key={i} className={i < today.care ? "on" : ""}>♥</span>)}
        </div>
        <small>{fill(T.petCare, { pet: pet.name })}</small>
      </div>
      <div className="adv-actions">
        {data.items.map((item) => <button key={item.id} className="adv-action" onClick={() => useItem(item)}>
          <span>{item.emoji}</span><small>{item.description}</small><i>× {save[item.id] || 0}</i>
        </button>)}
      </div>
      {save.owned.length > 1 && <>
        <div className="sub-title">Các bạn thú cưng</div>
        <div className="adv-grid three">
          {save.owned.map(findPet).map((p) => <button key={p.id} className={`adv-card${p.id === pet.id ? " active" : ""}`} onClick={() => choosePet(p)}>
            <span>{p.emoji}</span><b>{p.name}</b>
          </button>)}
        </div>
      </>}
    </section>}

    {tab === "shop" && <section>
      <div className="level-summary"><span>🪙 Con có {save.coins} xu</span></div>
      <div className="sub-title">Đồ cho thú cưng</div>
      <div className="adv-grid three">
        {data.items.map((item) => <button key={item.id} className="adv-card" onClick={() => buy(item)}>
          <span>{item.emoji}</span><b>{item.name}</b><em className={save.coins < item.price ? "poor" : ""}>🪙 {item.price}</em>
        </button>)}
      </div>
      <div className="sub-title">Nhận nuôi thú cưng</div>
      <div className="adv-grid">
        {data.pets.map((p) => {
          const owned = save.owned.includes(p.id);
          return <button key={p.id} className={`adv-card${owned ? " owned" : ""}`} onClick={() => choosePet(p)}>
            <span>{p.emoji}</span><b>{p.name}</b><small>{p.rarity}</small>
            <em className={!owned && save.coins < p.price ? "poor" : ""}>{owned ? "Đã có ✓" : `🪙 ${p.price}`}</em>
          </button>;
        })}
      </div>
    </section>}

    {tab === "badges" && <section className="adv-grid">
      {data.badges.map((b) => {
        const ok = (totals[b.metric] || 0) >= b.target;
        return <button key={b.id} className={`adv-card badge${ok ? " owned" : " locked"}`} onClick={() => say(fill(ok ? T.badgeOk : T.badgeTodo, b))}>
          <span>{ok ? b.emoji : "🔒"}</span><b>{b.title}</b><small>{b.text}</small>
          <em>{Math.min(totals[b.metric] || 0, b.target)}/{b.target}</em>
        </button>;
      })}
    </section>}
  </div>;
}
