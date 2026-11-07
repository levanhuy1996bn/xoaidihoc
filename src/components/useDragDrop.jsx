import { useRef, useState } from "react";

/**
 * Kéo thả dùng chung, chạy được bằng ngón tay (Pointer Events).
 * - Kéo một món rồi thả lên ô đích  → onDrop(idMon, idDich)
 * - Hoặc chạm vào món (được chọn) rồi chạm vào ô đích → onDrop(idMon, idDich)
 * Dùng: <div {...itemProps(id, hinhKhiKeo)}> cho món, <div {...dropProps(idDich)}> cho ô đích, và render {ghost}.
 */
export default function useDragDrop(onDrop) {
  const [drag, setDrag] = useState(null);
  const [selected, setSelected] = useState(null);
  const current = useRef(null);

  function itemProps(id, content) {
    return {
      "data-drag": id,
      style: { touchAction: "none" },
      onPointerDown(e) {
        if (e.button > 0) return;
        e.preventDefault();
        e.currentTarget.setPointerCapture?.(e.pointerId);
        current.current = { id, content, sx: e.clientX, sy: e.clientY, moved: false };
        setDrag({ ...current.current, x: e.clientX, y: e.clientY });
      },
      onPointerMove(e) {
        const d = current.current;
        if (!d || d.id !== id) return;
        if (!d.moved && Math.hypot(e.clientX - d.sx, e.clientY - d.sy) > 8) d.moved = true;
        setDrag({ ...d, x: e.clientX, y: e.clientY });
      },
      onPointerUp(e) {
        const d = current.current;
        current.current = null;
        setDrag(null);
        if (!d || d.id !== id) return;
        if (d.moved) {
          const target = document.elementFromPoint(e.clientX, e.clientY)?.closest("[data-drop]");
          setSelected(null);
          if (target) onDrop(id, target.getAttribute("data-drop"));
        } else {
          setSelected((s) => (s === id ? null : id)); // chạm = chọn món
        }
      },
      onPointerCancel() { current.current = null; setDrag(null); },
    };
  }

  function dropProps(targetId) {
    return {
      "data-drop": targetId,
      onClick() {
        if (selected === null) return;
        const id = selected;
        setSelected(null);
        onDrop(id, targetId);
      },
    };
  }

  const ghost = drag?.moved ? <div className="drag-ghost-item" style={{ left: drag.x, top: drag.y }}>{drag.content}</div> : null;
  return { itemProps, dropProps, ghost, selected, dragging: drag?.moved ? drag.id : null };
}
