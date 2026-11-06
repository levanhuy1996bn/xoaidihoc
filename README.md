# Bé Vui Học 🌈

Website học tập tương tác cho bé 3–5 tuổi, làm bằng React + Vite. Giao diện ưu tiên điện thoại (mobile-first), chạy trên Safari iPhone và Chrome Android, deploy miễn phí lên Vercel.

- Repo GitHub: `git@github.com:levanhuy1996bn/xoaidihoc.git`
- Không cần backend, database hay biến môi trường.

---

## 1. Tính năng

**Góc học tập** – mỗi màn có 2 tab: **Học** (chạm để nghe) và **Chơi** (trả lời câu hỏi, mỗi câu đúng được 1 ⭐).

| Màn | Nội dung |
|---|---|
| 🔤 Chữ cái | 29 chữ cái tiếng Việt, đọc theo âm (a, bờ, cờ…), có hình minh họa. Chơi: "Chữ nào đọc là bờ?", "Mèo bắt đầu bằng chữ nào?" |
| 🔢 Con số | Số 1–20. Chơi: tìm số, bên nào nhiều/ít hơn, số nào lớn/bé hơn |
| 🎨 Màu sắc | 8 màu. Chơi: chọn màu, tìm đồ vật theo màu, pha màu |
| 🔷 Hình dạng | Tròn, vuông, tam giác, chữ nhật, ngôi sao + đồ vật tương ứng |
| 🦁 Động vật | 11 con vật: tên, tiếng kêu, nơi sống, thức ăn |
| 🥕 Rau củ, trái cây | Tên, màu, phân loại rau củ / trái cây |
| 🧒 Cơ thể bé | Chạm đúng bộ phận trên hình bạn nhỏ, "Mình dùng gì để nghe?" |
| 🌦️ Thời tiết | Nắng, mưa, gió, 4 mùa, thiên nhiên, "Trời mưa con cần mang gì?" |

**Trò chơi vui**

| Màn | Nội dung |
|---|---|
| 🐾 Đếm con vật | Đếm và chọn đáp án đúng |
| 🧩 Kéo thả số | Kéo số vào giỏ bằng ngón tay (Pointer Events, chạy được trên cảm ứng) |

**Góc kỷ niệm**

| Màn | Nội dung |
|---|---|
| 🖼️ Gallery | Ảnh của bé xếp kiểu Masonry (so le 2 cột, 3 cột trên màn hình lớn). Chạm để xem to, vuốt trái/phải để chuyển ảnh |

**Thành tích**: số sao và số câu đúng, lưu ngay trên trình duyệt (LocalStorage).

---

## 2. Công nghệ

| Thành phần | Công nghệ |
|---|---|
| Giao diện | React 18 + Vite 6 |
| Icon | lucide-react |
| Kéo thả | Pointer Events + `touch-action: none` |
| Giọng đọc | Web Speech API (giọng tiếng Việt có sẵn trên máy) |
| Lưu tiến độ | LocalStorage |
| Hosting | Vercel (gói Hobby miễn phí) |

---

## 3. Cấu trúc thư mục

```
be-vui-hoc-react-vite/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   └── gallery/          # Ảnh cho màn Gallery (thả ảnh vào đây là tự hiện)
│   ├── components/
│   │   ├── BottomNav.jsx     # Thanh điều hướng dưới
│   │   ├── ChoiceQuiz.jsx    # Bộ câu hỏi trắc nghiệm dùng chung (đọc câu hỏi, chấm, cộng sao)
│   │   ├── GameCard.jsx      # Thẻ màn chơi ở trang chủ
│   │   ├── Header.jsx
│   │   └── ModeTabs.jsx      # Tab Học / Chơi
│   ├── games/                # Mỗi màn là 1 file
│   │   ├── Alphabet.jsx  Numbers.jsx  Colors.jsx  Shapes.jsx
│   │   ├── AnimalWorld.jsx  FruitsVeggies.jsx  Body.jsx  Weather.jsx
│   │   ├── AnimalCounting.jsx  DragNumbers.jsx
│   │   └── Gallery.jsx
│   ├── App.jsx               # Danh sách màn + trang chủ + giọng đọc + số sao
│   ├── data.js               # TOÀN BỘ nội dung học (sửa ở đây)
│   ├── utils.js              # Hàm trộn ngẫu nhiên, tạo đáp án
│   ├── main.jsx
│   └── style.css
├── index.html
├── package.json
├── vercel.json               # Mọi đường dẫn trỏ về index.html
└── vite.config.js
```

---

## 4. Chạy trên máy (local)

**Yêu cầu:** Node.js 18 trở lên (khuyên dùng Node 22). Kiểm tra bằng:

```bash
node -v
```

**Cài đặt và chạy:**

```bash
cd ~/Sites/be-vui-hoc-react-vite
npm install
npm run dev
```

Mở `http://localhost:5173` trên trình duyệt. Sửa code là trang tự cập nhật.

### Thử trên điện thoại thật (cùng Wi-Fi)

```bash
npm run dev -- --host
```

Vite sẽ in ra dòng `Network: http://192.168.x.x:5173`. Mở địa chỉ đó trên điện thoại (điện thoại và Mac phải **cùng mạng Wi-Fi**).

> Nếu điện thoại không vào được: macOS có thể hỏi "Cho phép node nhận kết nối mạng" → chọn **Cho phép**. Hoặc kiểm tra *Cài đặt hệ thống → Mạng → Tường lửa*.

---

## 5. Kiểm tra bản build trước khi deploy

```bash
npm run build      # tạo thư mục dist/
npm run preview    # chạy thử bản build tại http://localhost:4173
```

Thêm `-- --host` vào lệnh `preview` nếu muốn mở thử trên điện thoại. Build lỗi ở máy thì lên Vercel cũng sẽ lỗi, nên luôn chạy bước này trước khi push.

---

## 6. Đưa code lên GitHub

Thư mục đã được `git init` và nối với repo `xoaidihoc`. File `.gitignore` đã loại `node_modules/`, `dist/`, `.idea/`, `.DS_Store`.

```bash
git status                       # xem file nào sẽ được đẩy lên
git add .
git commit -m "Bé Vui Học: các màn học và trò chơi"
git push -u origin main
```

> ⚠️ **Ảnh cá nhân:** ảnh trong `src/assets/gallery/` sẽ nằm trong repo **và** trên website. Nên để repo GitHub ở chế độ **private**. Website trên Vercel thì ai có link cũng xem được, nên chỉ chia sẻ link cho người thân.

> Lỗi `Permission denied (publickey)` khi push: máy chưa có SSH key cho GitHub. Tạo key theo hướng dẫn của GitHub, hoặc đổi sang HTTPS:
> `git remote set-url origin https://github.com/levanhuy1996bn/xoaidihoc.git`

---

## 7. Deploy lên Vercel

### Cách 1 – Qua giao diện web (khuyên dùng)

1. Vào https://vercel.com/new, đăng nhập bằng tài khoản GitHub.
2. Chọn **Import Git Repository** → chọn repo `xoaidihoc` (nếu không thấy, bấm *Adjust GitHub App Permissions* để cấp quyền cho repo).
3. Cấu hình (Vercel thường tự nhận ra Vite):

   | Mục | Giá trị |
   |---|---|
   | Framework Preset | **Vite** |
   | Root Directory | `./` |
   | Build Command | `npm run build` |
   | Output Directory | `dist` |
   | Install Command | `npm install` |
   | Environment Variables | *(không cần)* |

4. Bấm **Deploy**. Sau khoảng 1 phút sẽ có địa chỉ dạng `https://xoaidihoc.vercel.app`.

**Tự động deploy:** từ đó về sau, mỗi lần `git push` lên nhánh `main`, Vercel tự build và cập nhật website. Push lên nhánh khác sẽ có một link xem thử (Preview) riêng, không ảnh hưởng bản chính.

### Cách 2 – Dùng Vercel CLI

```bash
npm install -g vercel
vercel          # lần đầu: đăng nhập + tạo project, ra link Preview
vercel --prod   # đẩy lên bản chính (Production)
```

### Tuỳ chọn thêm

- **Tên miền riêng:** Project → *Settings → Domains* → thêm tên miền và cấu hình DNS theo hướng dẫn.
- **Cố định phiên bản Node:** Project → *Settings* → mục *Node.js Version*, hoặc thêm vào `package.json`:
  ```json
  "engines": { "node": ">=22" }
  ```
- **`vercel.json`** chuyển mọi đường dẫn về `index.html`, để tải lại trang ở bất kỳ đâu cũng không bị lỗi 404.

---

## 8. Dùng trên điện thoại như một app

- **iPhone (Safari):** mở website → nút **Chia sẻ** → **Thêm vào MH chính**.
- **Android (Chrome):** mở website → menu **⋮** → **Thêm vào màn hình chính**.

Mở từ biểu tượng trên màn hình chính sẽ giống một app, và trên iPhone còn giúp Safari không tự xoá số sao sau một thời gian không dùng.

**Giọng đọc tiếng Việt trên iPhone:** *Cài đặt → Trợ năng → Nội dung được đọc → Giọng nói → Tiếng Việt*, tải giọng **Linh (Nâng cao)** để đọc rõ hơn.

---

## 9. Sửa và thêm nội dung

### Sửa nội dung có sẵn

Mọi nội dung nằm trong **`src/data.js`**, không cần động vào code các màn:

| Biến | Dùng cho |
|---|---|
| `alphabet` | Chữ cái: `sound` (cách đọc âm), `word` + `emoji` (từ và hình ví dụ) |
| `countingEmojis` | Hình dùng để đếm trong màn Con số |
| `colors`, `colorMixes` | Màu, đồ vật theo màu, các cặp pha màu |
| `shapes` | Hình dạng và đồ vật tương ứng |
| `animals`, `habitats`, `foods` | Con vật, tiếng kêu, nơi sống, thức ăn |
| `animalSets` | Trò Đếm con vật |
| `produce`, `produceTypes` | Rau củ, trái cây |
| `bodyParts`, `bodyUses` | Cơ thể bé |
| `weather`, `seasons`, `nature`, `weatherGear` | Thời tiết, các mùa, thiên nhiên |

Ví dụ thêm một con vật:

```js
// src/data.js → animals
{ name: "Con ngựa", emoji: "🐴", sound: "hí hí", habitat: "farm", food: "grass" },
```

> Câu được đọc to nên dùng "con" thay cho "bé" (một số giọng đọc phát âm "bé" thành "bớ").

### Thêm một màn mới

1. Tạo file `src/games/TenMan.jsx`, dùng lại `ModeTabs` và `ChoiceQuiz`:

   ```jsx
   import { useState } from "react";
   import ModeTabs, { LEARN_PLAY } from "../components/ModeTabs";
   import ChoiceQuiz from "../components/ChoiceQuiz";

   function makeQuestion(prev) {
     return {
       prompt: "Đâu là con mèo?",           // chữ hiển thị
       say: "Đâu là con mèo?",              // câu đọc to
       options: [
         { id: "cat", label: "Con mèo", content: "🐱" },
         { id: "dog", label: "Con chó", content: "🐶" },
       ],
       answer: "cat",
       praise: "Đúng rồi! Đây là con mèo",  // không bắt buộc
     };
   }

   export default function TenMan({ speak, onCorrect }) {
     const [mode, setMode] = useState("learn");
     return <section className="game-panel">
       <ModeTabs tabs={LEARN_PLAY} value={mode} onChange={setMode} />
       {mode === "learn"
         ? <p>Phần học…</p>
         : <ChoiceQuiz makeQuestion={makeQuestion} speak={speak} onCorrect={onCorrect} />}
     </section>;
   }
   ```

2. Mở `src/App.jsx`, import và thêm 1 dòng vào mảng `games`:

   ```js
   { id:"tenman", group:"learn", emoji:"🐱", title:"Tên màn", subtitle:"Mô tả ngắn", color:"#FFF0D9", Component: TenMan },
   ```

   `group: "learn"` hiện ở *Góc học tập*, `group: "play"` hiện ở *Trò chơi vui*.

### Thêm ảnh vào Gallery

1. Chép ảnh vào thư mục `src/assets/gallery/` (hỗ trợ `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`).
2. Ảnh tự hiện trong màn Gallery, sắp xếp theo tên file (`anh01.jpg`, `anh02.jpg`… để điều khiển thứ tự).
3. Mẹo:
   - Đặt tên file **không dấu, không khoảng trắng** (vd. `xoai-sinh-nhat.jpg`), tránh lỗi khi build trên Vercel.
   - Ảnh từ điện thoại nên thu nhỏ còn khoảng 1000–1600px chiều dài, dưới 500KB/ảnh để mở nhanh trên 4G.
   - Ảnh ở lưới được cắt khung so le để tạo bố cục Masonry; khi chạm mở to sẽ thấy đầy đủ ảnh gốc.

### Quy trình cập nhật website

```bash
npm run dev          # sửa và thử trên máy / điện thoại
npm run build        # chắc chắn build không lỗi
git add . && git commit -m "Mô tả thay đổi"
git push             # Vercel tự deploy bản mới
```

---

## 10. Dữ liệu và tiến độ

- Số sao lưu trong LocalStorage của trình duyệt với 2 khoá: `be-vui-stars`, `be-vui-completed`.
- Mỗi máy, mỗi trình duyệt, mỗi địa chỉ (localhost / Vercel) có bộ số riêng, không đồng bộ.
- Mất khi xoá dữ liệu trình duyệt hoặc dùng tab ẩn danh. Đặt lại trong tab **Thành tích**.
- Muốn đồng bộ nhiều máy hoặc theo dõi nhiều bé → cần thêm backend (ví dụ Supabase, Firebase).

---

## 11. Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| `npm install` báo lỗi phiên bản | Kiểm tra `node -v`, cài Node 22 (qua nvm hoặc nodejs.org) |
| Điện thoại không mở được link `Network` | Cùng Wi-Fi, chạy với `--host`, cho phép node qua tường lửa macOS |
| Không có tiếng | Tăng âm lượng, tắt chế độ im lặng, cài giọng Tiếng Việt; bé cần chạm vào màn hình ít nhất 1 lần trước khi app đọc được |
| Máy đọc sai một từ | Do giọng đọc của thiết bị; đổi cách viết câu trong `data.js` hoặc thay bằng file âm thanh thu sẵn |
| Vercel build lỗi `Could not resolve "./games/..."` | Tên file sai chữ hoa/thường. macOS không phân biệt nhưng Vercel (Linux) có, ví dụ `body.jsx` ≠ `Body.jsx` |
| Tải lại trang bị 404 | Kiểm tra `vercel.json` có trong repo |
| Push bị từ chối (`publickey`) | Xem mục 6 |

---

## 12. Hướng phát triển tiếp

- Màn chơi tương tác: Tìm đúng bóng, Lật thẻ tìm cặp, Nghe âm thanh đoán hình, Ghép hình, Tô màu, Phân loại đồ vật, Tìm đường.
- File âm thanh thu sẵn (`public/audio/*.mp3`) cho chữ cái, số và câu khen, để mọi máy đọc giống nhau.
- Cấp độ: hoàn thành cấp 1 mới mở cấp 2.
- Khu vực phụ huynh: thời gian học, màn đã chơi, số câu đúng.
