# Xoài Vui Học 🌈

Website học tập tương tác cho bé 3–5 tuổi, làm bằng React + Vite. Giao diện ưu tiên điện thoại (mobile-first), chạy trên Safari iPhone và Chrome Android, deploy miễn phí lên Vercel.

- Repo GitHub: `git@github.com:levanhuy1996bn/xoaidihoc.git`
- Không cần backend, database hay biến môi trường.

---

## 1. Tính năng

**Góc học tập** – mỗi màn có 2 tab: **Học** (chạm để nghe) và **Chơi** (trả lời câu hỏi, mỗi câu đúng được 1 ⭐).

| Màn | Nội dung |
|---|---|
| 🔤 Chữ cái | 29 chữ cái tiếng Việt, đọc theo âm (a, bờ, cờ…), có hình minh họa. Tab **Nghe âm**: "Chữ nào đọc là bờ?". Tab **Nhìn hình** (cho bé đã ghép vần, có nút 💡 gợi ý âm đầu): "Mèo bắt đầu bằng chữ nào?" |
| 🔢 Con số | Số 1–20. Chơi: tìm số, bên nào nhiều/ít hơn, số nào lớn/bé hơn |
| 🎨 Màu sắc | 8 màu. Chơi: chọn màu, tìm đồ vật theo màu, pha màu |
| 🔷 Hình dạng | Tròn, vuông, tam giác, chữ nhật, ngôi sao + đồ vật tương ứng |
| 🦁 Động vật | 11 con vật: tên, tiếng kêu, nơi sống, thức ăn |
| 🥭 Rau củ, trái cây | Tên, màu, phân loại rau củ / trái cây |
| 🧒 Cơ thể bé | Chạm đúng bộ phận trên hình bạn nhỏ, "Mình dùng gì để nghe?" |
| 🌦️ Thời tiết | Nắng, mưa, gió, 4 mùa, thiên nhiên, "Trời mưa con cần mang gì?" |

**Thử thách tư duy** và **Cuộc sống quanh bé** – trò chơi có màn kiểu Candy Crush (xem mục 10).

| Màn | Nội dung | Độ khó tăng dần theo màn |
|---|---|---|
| 🔍 Ai khác biệt? | Tìm hình không cùng nhóm | 4 → 6 hình, nhóm khác hẳn → nhóm gần giống (trái cây / rau củ) |
| 👤 Tìm bóng | Kéo con vật vào đúng cái bóng | 2 → 5 bạn, khác loài → cùng loài (toàn chim, toàn côn trùng…) |
| 🔁 Tìm quy luật | Hình nào tiếp theo / còn thiếu? | AB → AAB, ABC → ABCD, thiếu ở cuối → thiếu ở giữa |
| 🧩 Ghép hình bí ẩn | Ghép mảnh để đoán hình | 2 → 4 → 6 → 9 mảnh |
| 🚂 Điền số còn thiếu | Kéo thẻ số vào ô trống của dãy số liên tiếp (đoàn tàu, con sâu, bậc thang, dãy nhà) | 1–5 có chấm gợi ý → 1–10 không bắt đầu từ 1 → 1–20; 1 → 3 ô trống, thêm thẻ thừa |
| 🪥 Việc nhỏ mỗi ngày | Xếp các bước đúng thứ tự: đánh răng, rửa tay, đi ngủ… | 3 → 4 → 5 bước |
| 🛒 Siêu thị tí hon | Mua đúng đồ và đủ số lượng trong danh sách | Nhiều món hơn, số lượng 1–3, thêm món dễ nhầm |
| 🧸 Bé dọn phòng | Kéo đồ vào hộp đồ chơi, tủ quần áo, kệ sách, thùng rác | 2 → 4 chỗ cất, 4 → 11 món |
| 🚦 Giao thông | Đèn tín hiệu, an toàn khi đi đường, biển báo | Thêm câu an toàn và biển báo |

**Trò chơi vui**

| Màn | Nội dung |
|---|---|
| 🐾 Đếm con vật | Đếm và chọn đáp án đúng |
| 🧺 Kéo thả số | Kéo số vào giỏ bằng ngón tay (Pointer Events, chạy được trên cảm ứng) |
| 🏁 Đua vui | 2 tab Động vật / Xe cộ (mỗi tab 10 tay đua). Chọn 2–5 bạn, bấm Bắt đầu là đua, ai về nhất là ngẫu nhiên |

**Góc kỷ niệm**

| Màn | Nội dung |
|---|---|
| 🖼️ Gallery | Ảnh của bé xếp kiểu Masonry (so le 2 cột, 3 cột trên màn hình lớn). Chạm để xem to, vuốt trái/phải để chuyển ảnh |

**🏫 Lớp Dưa Góp** – tab thứ hai ngay trên đầu trang chủ, lớp học gia đình:

| Màn | Nội dung |
|---|---|
| Lớp học | Bảng đen, bục giảng, chuông 🔔; cả nhà ngồi bàn 2 người. Chạm một người để nghe tên và bạn cùng bàn. 🔀 Đổi chỗ (chạm 2 người, hoặc chạm 1 người rồi chạm ghế trống), 🎲 Xếp ngẫu nhiên. Chỗ ngồi được nhớ lại |
| 📋 Điểm danh | Chạm ảnh để đánh dấu có mặt / vắng; người vắng mờ trong lớp và không bị gọi. Sang ngày mới tự đặt lại cả lớp có mặt |
| 🎡 Kiểm tra miệng | Vòng quay ảnh người có mặt → "Mời … lên bảng!" + câu hỏi ngẫu nhiên từ các màn học (con vật, màu, đếm, chữ cái, hình, giao thông, cơ thể, thời tiết, thử thách vui), đồng hồ 10 giây, nút xem đáp án, cả nhà chấm 👍/👎. Chế độ **Xoài làm cô giáo** (Xoài không bị gọi) |
| 👀 Ai đây? | Nhìn ảnh chọn tên, hoặc nghe tên chọn ảnh |
| 🏆 Bảng vàng | Bục 1-2-3, xếp hạng sao, 👑 lớp trưởng (hiện trên chỗ ngồi), nút "Sang tuần mới" |

**🗺️ Xoài phiêu lưu** – nút **Phiêu lưu** ở thanh dưới, hoặc chạm ô "Xoài phiêu lưu" trên trang chủ. Chạm vào bất cứ thứ gì cũng được đọc to:

| Tab | Nội dung |
|---|---|
| 🗺️ Đảo | 5 hòn đảo mở dần theo tổng số sao (0 / 15 / 40 / 80 / 150 ⭐). Chạm đảo đã mở để thấy các trò trên đảo và vào chơi ngay; chạm đảo khóa để nghe còn thiếu bao nhiêu sao. Mở đảo mới có lời chúc mừng |
| 🎯 Nhiệm vụ | 4 nhiệm vụ làm mới mỗi ngày: trả lời đúng 5 câu, vượt 2 màn, nhận 10 sao, chăm thú cưng. Xong thì bấm nhận xu 🪙 |
| 🐾 Thú cưng | Cho ăn 🍎, chơi 🧸 (tối đa 3 trái tim mỗi ngày), tặng quà 🎁 để lên cấp. Đổi bạn đồng hành |
| 🛍️ Cửa hàng | Dùng xu mua đồ cho thú cưng, nhận nuôi Cún, Thỏ, Gấu trúc, Rồng con |
| 🏆 Huy hiệu | 8 huy hiệu: câu đúng, số sao, số màn, số đảo, số thú cưng, cấp thú cưng, số ngày học liền |

**Thành tích**: số sao, số câu đúng và số màn đã vượt qua, lưu ngay trên trình duyệt (LocalStorage).

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
│   ├── favicon.svg           # Icon quả xoài (tab trình duyệt)
│   ├── icon-32.png, apple-touch-icon.png, icon-192.png, icon-512.png  # Icon cho trình duyệt, màn hình chính iPhone/Android
│   └── manifest.webmanifest  # Tên và icon khi "Thêm vào màn hình chính"
├── src/
│   ├── assets/
│   │   ├── gallery/          # Ảnh cho màn Gallery (thả ảnh vào đây là tự hiện)
│   │   └── family/           # Ảnh đại diện Lớp Dưa Góp (<id>.jpg, ~360px)
│   ├── databases/            # TOÀN BỘ dữ liệu nội dung dạng JSON (sửa ở đây, xem mục 9)
│   ├── family/               # Lớp Dưa Góp: lớp học, điểm danh, vòng quay, Ai đây?, bảng vàng
│   ├── adventure/            # Xoài phiêu lưu: Adventure.jsx (giao diện), store.js (xu, thú cưng, nhiệm vụ trong ngày)
│   ├── components/
│   │   ├── BottomNav.jsx     # Thanh điều hướng dưới
│   │   ├── ChoiceQuiz.jsx    # Câu hỏi trắc nghiệm của các màn học (mỗi câu đúng 1 sao)
│   │   ├── GameCard.jsx      # Thẻ màn chơi ở trang chủ
│   │   ├── Header.jsx
│   │   ├── LevelGame.jsx     # Bản đồ màn, chấm 1–3 sao, mở khóa màn sau
│   │   ├── LevelQuiz.jsx     # Một màn gồm nhiều câu hỏi (dùng cho trò có màn)
│   │   ├── ModeTabs.jsx      # Tab Học / Chơi
│   │   ├── sounds.js         # Tiếng "ting" khi đúng, "bụp" khi sai, nhạc chúc mừng khi xong màn (Web Audio, không cần file)
│   │   └── useDragDrop.jsx   # Kéo thả bằng ngón tay dùng chung
│   ├── levels/
│   │   └── progress.js       # Lưu số sao từng màn
│   ├── games/                # Mỗi màn là 1 file
│   │   ├── Alphabet.jsx  Numbers.jsx  Colors.jsx  Shapes.jsx
│   │   ├── AnimalWorld.jsx  FruitsVeggies.jsx  Body.jsx  Weather.jsx
│   │   ├── OddOneOut.jsx  ShadowMatch.jsx  Patterns.jsx  Jigsaw.jsx  MissingNumbers.jsx
│   │   ├── DailyRoutine.jsx  Supermarket.jsx  CleanRoom.jsx  Traffic.jsx
│   │   ├── AnimalCounting.jsx  DragNumbers.jsx
│   │   └── Gallery.jsx
│   ├── App.jsx               # Trang chủ, nối id màn với component, giọng đọc, số sao
│   ├── utils.js              # Hàm ngẫu nhiên (có seed theo số màn), tạo đáp án
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
git commit -m "Xoài Vui Học: các màn học và trò chơi"
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

Mọi nội dung nằm trong thư mục **`src/databases/`**, mỗi màn một file JSON. Component chỉ đọc dữ liệu, không khai báo nội dung bên trong.

| File | Dùng cho |
|---|---|
| `games.json` | Trang chủ (lời chào, hình 🥭), các nhóm, danh sách màn: tên, emoji, màu thẻ |
| `messages.json` | Câu khen, câu nhắc khi sai, câu báo hoàn thành màn |
| `alphabet.json` | Chữ cái: `sound` (cách đọc âm), `word` + `emoji` (từ và hình ví dụ) |
| `numbers.json` | Số lớn nhất, hình dùng để đếm |
| `colors.json` | Màu, đồ vật theo màu, các cặp pha màu |
| `shapes.json` | Hình dạng và đồ vật tương ứng |
| `animals.json` | Con vật, tiếng kêu, nơi sống, thức ăn |
| `produce.json` | Rau củ, trái cây |
| `body.json` | Bộ phận cơ thể, câu hỏi "Mình dùng gì để…?" |
| `weather.json` | Thời tiết, các mùa, thiên nhiên, đồ cần mang |
| `odd-one-out.json`, `shadows.json`, `patterns.json`, `jigsaw.json`, `missing-numbers.json` | Các trò Thử thách tư duy |
| `routines.json`, `supermarket.json`, `clean-room.json`, `traffic.json` | Các trò Cuộc sống quanh bé |
| `animal-counting.json`, `drag-numbers.json`, `race.json` | Đếm con vật, Kéo thả số, Đua vui |

Mỗi file có dòng `_ghi_chu` giải thích ý nghĩa các trường. Ví dụ thêm một con vật vào `animals.json`:

```json
{ "name": "Con ngựa", "emoji": "🐴", "sound": "hí hí", "habitat": "farm", "food": "grass" }
```

**Lưu ý khi sửa JSON** (sai cú pháp là website không build được):

- Chuỗi dùng dấu nháy kép `"…"`, không dùng nháy đơn.
- Không có dấu phẩy sau phần tử cuối cùng.
- Không viết chú thích `//` trong file JSON.
- Câu được đọc to nên dùng "con" thay cho "bé" (một số giọng đọc phát âm "bé" thành "bớ").

### Chỉnh độ khó các trò có màn

Mỗi file của trò có màn có mảng `tiers`. Từ màn `from` trở đi sẽ dùng cấu hình đó, ví dụ trong `shadows.json`:

```json
"tiers": [
  { "from": 1, "count": 2, "similar": false, "allow": 1 },
  { "from": 4, "count": 3, "similar": false, "allow": 1 },
  { "from": 11, "count": 4, "similar": true, "allow": 2 }
]
```

- Màn 1–3: ghép 2 bạn; màn 4–10: 3 bạn; từ màn 11: 4 bạn cùng nhóm (khó hơn).
- `allow`: số lần sai tối đa để vẫn được 2 sao (không sai lần nào: 3 sao; sai nhiều hơn: 1 sao).
- Muốn thêm nấc khó: thêm một dòng mới với `from` lớn hơn.

### Thêm một màn mới

1. Thêm dữ liệu vào một file mới trong `src/databases/`, ví dụ `ten-man.json`.
2. Tạo `src/games/TenMan.jsx`:
   - **Màn học** (tab Học/Chơi, mỗi câu đúng 1 sao): dùng `ModeTabs` + `ChoiceQuiz`, xem mẫu ở `Shapes.jsx`.
   - **Trò có màn** (bản đồ màn, 1–3 sao): viết `makeLevel(soMan, rng)` trả về cấu hình màn, rồi dùng `LevelGame`. Trò dạng câu hỏi dùng `LevelQuiz` (xem `OddOneOut.jsx`), trò kéo thả dùng `useDragDrop` (xem `ShadowMatch.jsx`).
3. Thêm thẻ vào `games` trong `games.json`:

   ```json
   { "id": "tenman", "group": "think", "emoji": "🐱", "title": "Tên màn", "subtitle": "Mô tả ngắn", "color": "#FFF0D9" }
   ```

4. Mở `src/App.jsx`, import component và thêm `tenman: TenMan` vào `COMPONENTS`. Nếu là trò có màn, thêm `"tenman"` vào `LEVEL_GAMES` để thẻ hiện "Màn X →".

### Thêm ảnh vào Gallery

1. Chép ảnh vào thư mục `src/assets/gallery/` (hỗ trợ `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`).
2. Ảnh tự hiện trong màn Gallery, sắp xếp theo tên file (`anh01.jpg`, `anh02.jpg`… để điều khiển thứ tự).
3. Mẹo:
   - Đặt tên file **không dấu, không khoảng trắng** (vd. `xoai-sinh-nhat.jpg`), tránh lỗi khi build trên Vercel.
   - Chép ảnh xong chạy `python3 scripts/shrink-images.py` để thu nhỏ còn cạnh dài 1280px (~100–300KB/ảnh), mở nhanh trên 4G.
   - Ảnh ở lưới được cắt khung so le để tạo bố cục Masonry; khi chạm mở to sẽ thấy đầy đủ ảnh gốc.

### Thêm / sửa thành viên Lớp Dưa Góp

1. Chép ảnh vào `src/assets/family/`, đặt tên file không dấu, ví dụ `minh.jpg`.
2. Thu nhỏ ảnh (ảnh điện thoại 2–7MB → khoảng 20–40KB, thay luôn file gốc):

   ```bash
   pip3 install pillow          # chỉ cần lần đầu
   python3 scripts/shrink-images.py
   ```

3. Thêm vào `members` trong `src/databases/family.json`:

   ```json
   { "id": "minh", "name": "Chú Minh", "color": "#e3f0ff" }
   ```

   - `id` trùng tên file (không có đuôi).
   - Mặt nhỏ hoặc lệch thì thêm `"focus": "50% 30%"` (vị trí mặt theo chiều ngang, dọc) và `"zoom": 1.6` (phóng to).
   - Thứ tự trong `members` là chỗ ngồi mặc định.
4. Câu "thử thách vui" ở Kiểm tra miệng sửa trong `funQuestions` của cùng file.

### Quy trình cập nhật website

```bash
npm run dev          # sửa và thử trên máy / điện thoại
npm run build        # chắc chắn build không lỗi
git add . && git commit -m "Mô tả thay đổi"
git push             # Vercel tự deploy bản mới
```

---

## 10. Hệ thống màn chơi

Các trò **Thử thách tư duy** và **Cuộc sống quanh bé** chơi theo màn, giống Candy Crush:

- **Bản đồ màn:** qua màn trước mới mở khóa màn sau. Mỗi 10 màn có một mốc thưởng 🎁.
- **Lưu ngay khi xong màn:** kết quả được lưu đúng lúc bé làm xong, thoát ra ngay cũng không mất.
- **Xong màn:** phát nhạc chúc mừng ngay, rồi đọc "Giỏi quá! Con hoàn thành màn …". Từng trò không tự đọc câu khen lúc xong màn để tiếng không bị chồng nhau. Trò kéo thả liên tục (Bé dọn phòng) chỉ kêu "ting" khi đặt đúng, không đọc.
- **1–3 sao mỗi màn:** không sai lần nào được 3 sao, sai ít (trong mức `allow`) được 2 sao, còn lại 1 sao. Chơi lại chỉ cộng thêm phần sao tăng lên, không cộng trùng.
- **Màn vô tận:** không cần tạo sẵn từng màn. `makeLevel` sinh màn từ số màn và bảng `tiers` trong JSON. Mỗi số màn dùng một hạt giống ngẫu nhiên cố định, nên "màn 7" lần nào chơi cũng giống nhau.
- **Tăng độ khó** bằng số lượng hình, mức độ giống nhau và số bước, không bằng cách bấm giờ (phù hợp bé 3–5 tuổi).

---

## 11. Dữ liệu và tiến độ

- Số sao lưu trong LocalStorage của trình duyệt với các khoá: `be-vui-stars`, `be-vui-completed` và `be-vui-levels` (số sao từng màn).
- Lớp Dưa Góp lưu riêng: `dua-gop-seats` (chỗ ngồi), `dua-gop-attendance` (điểm danh trong ngày), `dua-gop-stars` (sao của từng người).
- Xoài phiêu lưu: `be-vui-adventure` (xu, thú cưng, đồ, nhiệm vụ đã nhận) và `be-vui-today` (đếm câu đúng, sao, màn, lần chăm thú cưng trong ngày và chuỗi ngày học). Đảo, nhiệm vụ, giá, huy hiệu, câu đọc đều sửa trong `src/databases/adventure.json`.
- Mỗi máy, mỗi trình duyệt, mỗi địa chỉ (localhost / Vercel) có bộ số riêng, không đồng bộ.
- Mất khi xoá dữ liệu trình duyệt hoặc dùng tab ẩn danh. Đặt lại trong tab **Thành tích**.
- Muốn đồng bộ nhiều máy hoặc theo dõi nhiều bé → cần thêm backend (ví dụ Supabase, Firebase).

---

## 12. Xử lý sự cố

| Hiện tượng | Cách xử lý |
|---|---|
| `npm install` báo lỗi phiên bản | Kiểm tra `node -v`, cài Node 22 (qua nvm hoặc nodejs.org) |
| Điện thoại không mở được link `Network` | Cùng Wi-Fi, chạy với `--host`, cho phép node qua tường lửa macOS |
| Không có tiếng | Tăng âm lượng, tắt chế độ im lặng, cài giọng Tiếng Việt; bé cần chạm vào màn hình ít nhất 1 lần trước khi app đọc được |
| Máy đọc sai một từ | Do giọng đọc của thiết bị; đổi cách viết câu trong `src/databases/*.json` hoặc thay bằng file âm thanh thu sẵn |
| Build lỗi sau khi sửa JSON | Kiểm tra dấu phẩy, dấu nháy kép (xem mục 9) |
| Vercel build lỗi `Could not resolve "./games/..."` | Tên file sai chữ hoa/thường. macOS không phân biệt nhưng Vercel (Linux) có, ví dụ `body.jsx` ≠ `Body.jsx` |
| Tải lại trang bị 404 | Kiểm tra `vercel.json` có trong repo |
| Push bị từ chối (`publickey`) | Xem mục 6 |

---

## 13. Hướng phát triển tiếp

- Trò sáng tạo: Tô màu, Nhà thiết kế nhí, Nhạc sĩ nhí, Lắp ráp robot.
- Lật thẻ tìm cặp, Nghe âm thanh đoán hình, Tìm đường về nhà.
- Bộ sưu tập sticker, Sách truyện tương tác.
- File âm thanh thu sẵn (`public/audio/*.mp3`) cho chữ cái, số và câu khen, để mọi máy đọc giống nhau.
- Khu vực phụ huynh: thời gian học, màn đã chơi, số câu đúng.
