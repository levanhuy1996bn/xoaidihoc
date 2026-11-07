import { useEffect, useRef, useState } from "react";

// Tự lấy mọi ảnh trong src/assets/gallery — chỉ cần thả ảnh vào thư mục đó là hiện lên.
const modules = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp,gif,JPG,JPEG,PNG,WEBP,GIF}", { eager: true, import: "default" });
const photos = Object.entries(modules)
  .map(([path, src]) => ({ src, name: path.split("/").pop() }))
  .sort((a, b) => a.name.localeCompare(b.name, "vi", { numeric: true }));

// Xen kẽ tỉ lệ khung để tạo bố cục Masonry so le (ảnh vẫn xem đầy đủ khi mở to)
const RATIOS = ["3 / 4", "1 / 1", "4 / 5", "2 / 3", "1 / 1", "3 / 4", "4 / 5"];

function Lightbox({ index, onClose, onChange }) {
  const startX = useRef(null);
  const go = (step) => onChange((index + step + photos.length) % photos.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = overflow; };
  }, [index]);

  const swiped = useRef(false);
  function onPointerDown(e) { startX.current = e.clientX; swiped.current = false; }
  function onPointerUp(e) {
    if (startX.current === null) return;
    const dx = e.clientX - startX.current;
    startX.current = null;
    if (Math.abs(dx) > 50) { swiped.current = true; go(dx < 0 ? 1 : -1); } // vuốt trái: ảnh sau, vuốt phải: ảnh trước
  }
  // Đóng bằng sự kiện click (không dùng pointerup) để cú chạm không "xuyên" xuống nút phía dưới
  function onClick(e) {
    if (swiped.current) { swiped.current = false; return; }
    if (e.target === e.currentTarget) onClose(); // chạm ra nền tối để đóng
  }

  const photo = photos[index];
  return <div className="lightbox" role="dialog" aria-label="Xem ảnh"
    onPointerDown={onPointerDown} onPointerUp={onPointerUp} onClick={onClick} onPointerCancel={() => { startX.current = null; }}>
    <img src={photo.src} alt={photo.name} draggable="false" />
    <button className="lightbox-close" aria-label="Đóng" onPointerUp={(e) => e.stopPropagation()} onClick={onClose}>✕</button>
    {photos.length > 1 && <>
      <button className="lightbox-nav prev" aria-label="Ảnh trước" onPointerUp={(e) => e.stopPropagation()} onClick={() => go(-1)}>‹</button>
      <button className="lightbox-nav next" aria-label="Ảnh sau" onPointerUp={(e) => e.stopPropagation()} onClick={() => go(1)}>›</button>
    </>}
    <div className="lightbox-count">{index + 1} / {photos.length}</div>
  </div>;
}

export default function Gallery() {
  const [open, setOpen] = useState(null);

  return <section className="game-panel">
    <div className="section-kicker">🖼️ GÓC KỶ NIỆM</div>
    <h2>Những khoảnh khắc đáng yêu</h2>
    {photos.length === 0
      ? <p className="helper-text">Chưa có ảnh nào. Thêm ảnh vào thư mục <b>src/assets/gallery</b> nhé!</p>
      : <div className="masonry">
          {photos.map((p, i) => <button key={p.name} className="masonry-item" onClick={() => setOpen(i)} aria-label={`Xem ảnh ${i + 1}`}>
            <img src={p.src} alt={p.name} loading="lazy" decoding="async" style={{ aspectRatio: RATIOS[i % RATIOS.length] }} />
          </button>)}
        </div>}
    <p className="helper-text" style={{ marginTop: 12 }}>Chạm vào ảnh để xem to, vuốt sang trái/phải để xem ảnh khác.</p>
    {open !== null && <Lightbox index={open} onClose={() => setOpen(null)} onChange={setOpen} />}
  </section>;
}
