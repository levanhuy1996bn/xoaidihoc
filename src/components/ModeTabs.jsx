// Thanh chuyển giữa các phần trong một màn, ví dụ: Học / Chơi
export default function ModeTabs({ tabs, value, onChange }) {
  return <div className="mode-tabs" role="tablist">
    {tabs.map((t) => <button key={t.id} role="tab" aria-selected={value === t.id}
      className={value === t.id ? "active" : ""} onClick={() => onChange(t.id)}>
      <span>{t.icon}</span>{t.label}
    </button>)}
  </div>;
}

export const LEARN_PLAY = [
  { id: "learn", icon: "📖", label: "Học" },
  { id: "play", icon: "🎯", label: "Chơi" },
];
