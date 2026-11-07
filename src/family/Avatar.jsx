// Ảnh tròn của một thành viên; focus/zoom lấy từ family.json để khuôn mặt nằm giữa
export default function Avatar({ m, size = 48, className = "" }) {
  const focus = m.focus || "50% 30%";
  return <span className={`fam-avatar ${className}`} style={{ width: size, height: size, background: m.color }}>
    {m.photo
      ? <img src={m.photo} alt={m.name} draggable="false" style={{ objectPosition: focus, transformOrigin: focus, transform: `scale(${m.zoom || 1})` }} />
      : <b style={{ fontSize: size * 0.42 }}>{m.name.split(" ").pop()[0]}</b>}
  </span>;
}
