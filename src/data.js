// =============================================================
//  DỮ LIỆU NỘI DUNG HỌC TẬP
//  Sửa nội dung ở đây, không cần động vào code các màn.
// =============================================================

// ---------- CHỮ CÁI ----------
// sound: cách đọc âm khi bé chạm vào chữ; word + emoji: từ và hình minh họa
export const alphabet = [
  { upper: "A", lower: "a", sound: "a", word: "Áo", emoji: "👕" },
  { upper: "Ă", lower: "ă", sound: "á", word: "Mặt trăng", emoji: "🌙" },
  { upper: "Â", lower: "â", sound: "ớ", word: "Ấm trà", emoji: "🫖" },
  { upper: "B", lower: "b", sound: "bờ", word: "Bướm", emoji: "🦋" },
  { upper: "C", lower: "c", sound: "cờ", word: "Cá", emoji: "🐟" },
  { upper: "D", lower: "d", sound: "dờ", word: "Dê", emoji: "🐐" },
  { upper: "Đ", lower: "đ", sound: "đờ", word: "Đèn", emoji: "💡" },
  { upper: "E", lower: "e", sound: "e", word: "Em bé", emoji: "👶" },
  { upper: "Ê", lower: "ê", sound: "ê", word: "Ếch", emoji: "🐸" },
  { upper: "G", lower: "g", sound: "gờ", word: "Gà", emoji: "🐔" },
  { upper: "H", lower: "h", sound: "hờ", word: "Hoa", emoji: "🌸" },
  { upper: "I", lower: "i", sound: "i", word: "Ti vi", emoji: "📺" },
  { upper: "K", lower: "k", sound: "ca", word: "Kẹo", emoji: "🍬" },
  { upper: "L", lower: "l", sound: "lờ", word: "Lá", emoji: "🍃" },
  { upper: "M", lower: "m", sound: "mờ", word: "Mèo", emoji: "🐱" },
  { upper: "N", lower: "n", sound: "nờ", word: "Nấm", emoji: "🍄" },
  { upper: "O", lower: "o", sound: "o", word: "Ong", emoji: "🐝" },
  { upper: "Ô", lower: "ô", sound: "ô", word: "Ô tô", emoji: "🚗" },
  { upper: "Ơ", lower: "ơ", sound: "ơ", word: "Ớt", emoji: "🌶️" },
  { upper: "P", lower: "p", sound: "pờ", word: "Pin", emoji: "🔋" },
  { upper: "Q", lower: "q", sound: "quờ", word: "Quà", emoji: "🎁" },
  { upper: "R", lower: "r", sound: "rờ", word: "Rùa", emoji: "🐢" },
  { upper: "S", lower: "s", sound: "sờ", word: "Sao", emoji: "⭐" },
  { upper: "T", lower: "t", sound: "tờ", word: "Táo", emoji: "🍎" },
  { upper: "U", lower: "u", sound: "u", word: "Cú mèo", emoji: "🦉" },
  { upper: "Ư", lower: "ư", sound: "ư", word: "Sư tử", emoji: "🦁" },
  { upper: "V", lower: "v", sound: "vờ", word: "Voi", emoji: "🐘" },
  { upper: "X", lower: "x", sound: "xờ", word: "Xe đạp", emoji: "🚲" },
  { upper: "Y", lower: "y", sound: "i dài", word: "Y tá", emoji: "👩‍⚕️" },
];

// ---------- SỐ ĐẾM ----------
export const countingEmojis = ["⭐", "🍎", "🎈", "🐟", "🌸", "🍓", "🚗", "🐞"];

// ---------- MÀU SẮC ----------
// objects: đồ vật có màu đó (dùng cho câu hỏi "Tìm đồ vật màu ...")
export const colors = [
  { name: "Đỏ", hex: "#F56B6B", emoji: "🍎", objects: [{ e: "🍎", n: "quả táo" }, { e: "🍓", n: "quả dâu" }, { e: "🚒", n: "xe cứu hỏa" }] },
  { name: "Vàng", hex: "#FFD34E", emoji: "🌞", objects: [{ e: "🍌", n: "quả chuối" }, { e: "🌻", n: "hoa hướng dương" }, { e: "🐥", n: "gà con" }] },
  { name: "Xanh lá", hex: "#65C98A", emoji: "🍃", objects: [{ e: "🥦", n: "bông cải xanh" }, { e: "🐸", n: "con ếch" }, { e: "🍀", n: "cỏ bốn lá" }] },
  { name: "Xanh dương", hex: "#65B9F2", emoji: "🐳", objects: [{ e: "🐳", n: "cá voi" }, { e: "💧", n: "giọt nước" }, { e: "🫐", n: "quả việt quất" }] },
  { name: "Cam", hex: "#FF9B55", emoji: "🍊", objects: [{ e: "🍊", n: "quả cam" }, { e: "🥕", n: "củ cà rốt" }, { e: "🎃", n: "quả bí ngô" }] },
  { name: "Tím", hex: "#B28AE8", emoji: "🍇", objects: [{ e: "🍇", n: "chùm nho" }, { e: "🍆", n: "quả cà tím" }, { e: "🔮", n: "quả cầu" }] },
  { name: "Hồng", hex: "#F7A1C4", emoji: "🌸", objects: [{ e: "🌸", n: "hoa đào" }, { e: "🐷", n: "chú lợn" }, { e: "🦩", n: "chim hồng hạc" }] },
  { name: "Nâu", hex: "#A9784F", emoji: "🐻", objects: [{ e: "🐻", n: "chú gấu" }, { e: "🥔", n: "củ khoai tây" }, { e: "🍫", n: "thanh sô cô la" }] },
];

// Pha màu: a + b = result (tên màu trong danh sách colors, "Trắng" chỉ dùng ở đây)
export const colorMixes = [
  { a: "Đỏ", b: "Vàng", result: "Cam" },
  { a: "Xanh dương", b: "Vàng", result: "Xanh lá" },
  { a: "Đỏ", b: "Xanh dương", result: "Tím" },
  { a: "Đỏ", b: "Trắng", result: "Hồng" },
];
export const WHITE = { name: "Trắng", hex: "#FFFFFF" };

// ---------- HÌNH DẠNG ----------
export const shapes = [
  { id: "circle", name: "Hình tròn", color: "#F7A1C4", objects: [{ e: "⚽", n: "quả bóng" }, { e: "🍪", n: "bánh quy" }, { e: "🕐", n: "đồng hồ" }, { e: "🍩", n: "bánh vòng" }] },
  { id: "square", name: "Hình vuông", color: "#65B9F2", objects: [{ e: "🎁", n: "hộp quà" }, { e: "🧇", n: "bánh quế" }, { e: "🎲", n: "xúc xắc" }] },
  { id: "triangle", name: "Hình tam giác", color: "#FFC44D", objects: [{ e: "🍕", n: "miếng bánh pizza" }, { e: "⛺", n: "cái lều" }, { e: "📐", n: "cái thước" }] },
  { id: "rectangle", name: "Hình chữ nhật", color: "#65C98A", objects: [{ e: "📱", n: "điện thoại" }, { e: "🚪", n: "cánh cửa" }, { e: "📕", n: "quyển sách" }] },
  { id: "star", name: "Hình ngôi sao", color: "#B28AE8", objects: [{ e: "⭐", n: "ngôi sao" }, { e: "🌟", n: "ngôi sao lấp lánh" }] },
];

// ---------- ĐỘNG VẬT ----------
export const habitats = {
  home: { name: "Trong nhà", emoji: "🏠", say: "trong nhà" },
  farm: { name: "Trang trại", emoji: "🚜", say: "ở trang trại" },
  water: { name: "Dưới nước", emoji: "🌊", say: "dưới nước" },
  forest: { name: "Trong rừng", emoji: "🌳", say: "trong rừng" },
};
export const foods = {
  fish: { name: "Cá", emoji: "🐟" },
  bone: { name: "Xương", emoji: "🦴" },
  rice: { name: "Thóc", emoji: "🌾" },
  shrimp: { name: "Tép", emoji: "🦐" },
  grass: { name: "Cỏ", emoji: "🌿" },
  veggie: { name: "Rau", emoji: "🥬" },
  mosquito: { name: "Muỗi", emoji: "🦟" },
  worm: { name: "Giun", emoji: "🪱" },
  banana: { name: "Chuối", emoji: "🍌" },
  meat: { name: "Thịt", emoji: "🍖" },
};
// sound: tiếng kêu (để null nếu không có)
export const animals = [
  { name: "Con mèo", emoji: "🐱", sound: "meo meo", habitat: "home", food: "fish" },
  { name: "Con chó", emoji: "🐶", sound: "gâu gâu", habitat: "home", food: "bone" },
  { name: "Con gà trống", emoji: "🐓", sound: "ò ó o", habitat: "farm", food: "rice" },
  { name: "Con vịt", emoji: "🦆", sound: "cạp cạp", habitat: "farm", food: "shrimp" },
  { name: "Con bò", emoji: "🐄", sound: "ò ò", habitat: "farm", food: "grass" },
  { name: "Con lợn", emoji: "🐷", sound: "ụt ịt", habitat: "farm", food: "veggie" },
  { name: "Con cừu", emoji: "🐑", sound: "be be", habitat: "farm", food: "grass" },
  { name: "Con ếch", emoji: "🐸", sound: "ộp ộp", habitat: "water", food: "mosquito" },
  { name: "Con cá", emoji: "🐠", sound: null, habitat: "water", food: "worm" },
  { name: "Con khỉ", emoji: "🐵", sound: "khẹc khẹc", habitat: "forest", food: "banana" },
  { name: "Con sư tử", emoji: "🦁", sound: "gừ gừ", habitat: "forest", food: "meat" },
];

// Dùng cho trò "Đếm con vật"
export const animalSets = [
  { animal: "🐱", name: "mèo" },
  { animal: "🐶", name: "chó" },
  { animal: "🐰", name: "thỏ" },
  { animal: "🐥", name: "gà con" },
  { animal: "🐸", name: "ếch" },
  { animal: "🐼", name: "gấu trúc" },
];

// ---------- RAU CỦ & TRÁI CÂY ----------
// type: "fruit" = trái cây, "veg" = rau củ; color: tên màu (null nếu không hỏi về màu)
export const produce = [
  { name: "Quả táo", emoji: "🍎", type: "fruit", color: "Đỏ" },
  { name: "Quả chuối", emoji: "🍌", type: "fruit", color: "Vàng" },
  { name: "Quả cam", emoji: "🍊", type: "fruit", color: "Cam" },
  { name: "Chùm nho", emoji: "🍇", type: "fruit", color: "Tím" },
  { name: "Quả dâu tây", emoji: "🍓", type: "fruit", color: "Đỏ" },
  { name: "Quả dưa hấu", emoji: "🍉", type: "fruit", color: null },
  { name: "Quả dứa", emoji: "🍍", type: "fruit", color: "Vàng" },
  { name: "Quả lê", emoji: "🍐", type: "fruit", color: "Xanh lá" },
  { name: "Củ cà rốt", emoji: "🥕", type: "veg", color: "Cam" },
  { name: "Rau cải", emoji: "🥬", type: "veg", color: "Xanh lá" },
  { name: "Bông cải xanh", emoji: "🥦", type: "veg", color: "Xanh lá" },
  { name: "Bắp ngô", emoji: "🌽", type: "veg", color: "Vàng" },
  { name: "Củ khoai tây", emoji: "🥔", type: "veg", color: "Nâu" },
  { name: "Quả cà tím", emoji: "🍆", type: "veg", color: "Tím" },
  { name: "Quả dưa chuột", emoji: "🥒", type: "veg", color: "Xanh lá" },
];
export const produceTypes = {
  fruit: { name: "Trái cây", emoji: "🍒" },
  veg: { name: "Rau củ", emoji: "🥗" },
};

// ---------- CƠ THỂ BÉ ----------
// id khớp với các vùng chạm trên hình bạn nhỏ (Body.jsx)
export const bodyParts = [
  { id: "hair", name: "Mái tóc", short: "tóc", emoji: "💇", use: "Tóc mọc trên đầu" },
  { id: "eyes", name: "Đôi mắt", short: "mắt", emoji: "👀", use: "Mắt để nhìn" },
  { id: "ears", name: "Đôi tai", short: "tai", emoji: "👂", use: "Tai để nghe" },
  { id: "nose", name: "Cái mũi", short: "mũi", emoji: "👃", use: "Mũi để ngửi" },
  { id: "mouth", name: "Cái miệng", short: "miệng", emoji: "👄", use: "Miệng để ăn và nói" },
  { id: "hands", name: "Đôi tay", short: "tay", emoji: "✋", use: "Tay để cầm nắm" },
  { id: "tummy", name: "Cái bụng", short: "bụng", emoji: "🍚", use: "Bụng no khi con ăn cơm" },
  { id: "feet", name: "Đôi chân", short: "chân", emoji: "🦶", use: "Chân để đi và chạy" },
];
// Câu hỏi "Mình dùng gì để ...?"
export const bodyUses = [
  { ask: "Mình dùng gì để nhìn?", part: "eyes" },
  { ask: "Mình dùng gì để nghe?", part: "ears" },
  { ask: "Mình dùng gì để ngửi?", part: "nose" },
  { ask: "Mình dùng gì để ăn?", part: "mouth" },
  { ask: "Mình dùng gì để cầm đồ chơi?", part: "hands" },
  { ask: "Mình dùng gì để đi?", part: "feet" },
];

// ---------- THỜI TIẾT & THIÊN NHIÊN ----------
export const weather = [
  { name: "Trời nắng", emoji: "☀️", say: "Trời nắng, ông mặt trời chiếu sáng" },
  { name: "Trời mưa", emoji: "🌧️", say: "Trời mưa, nhớ mang ô nhé" },
  { name: "Trời nhiều mây", emoji: "☁️", say: "Trời nhiều mây, mây trắng bay bay" },
  { name: "Trời có gió", emoji: "🌬️", say: "Trời có gió, lá cây đung đưa" },
  { name: "Cầu vồng", emoji: "🌈", say: "Cầu vồng có bảy màu thật đẹp" },
  { name: "Sấm sét", emoji: "⛈️", say: "Có sấm sét, con ở trong nhà nhé" },
];
export const seasons = [
  { name: "Mùa xuân", emoji: "🌸", say: "Mùa xuân hoa nở, cả nhà đón Tết", ask: "Mùa nào hoa nở, cả nhà đón Tết?" },
  { name: "Mùa hè", emoji: "🏖️", say: "Mùa hè nắng nóng, được đi tắm biển", ask: "Mùa nào nắng nóng, được đi tắm biển?" },
  { name: "Mùa thu", emoji: "🍂", say: "Mùa thu lá vàng rơi, có Tết Trung thu", ask: "Mùa nào lá vàng rơi?" },
  { name: "Mùa đông", emoji: "🧣", say: "Mùa đông trời lạnh, con mặc áo ấm", ask: "Mùa nào trời lạnh, phải mặc áo ấm?" },
];
export const nature = [
  { name: "Cây xanh", emoji: "🌳", say: "Cây xanh cho bóng mát" },
  { name: "Bông hoa", emoji: "🌼", say: "Bông hoa thơm và đẹp" },
  { name: "Ngọn núi", emoji: "⛰️", say: "Ngọn núi rất cao" },
  { name: "Biển", emoji: "🌊", say: "Biển rộng có nhiều sóng" },
];
// Câu hỏi "Trời ... bé cần mang gì?"
export const weatherGear = [
  { when: "Trời mưa", emoji: "🌧️", item: { e: "☂️", n: "cái ô" } },
  { when: "Trời nắng", emoji: "☀️", item: { e: "🧢", n: "mũ" } },
  { when: "Trời lạnh", emoji: "🥶", item: { e: "🧣", n: "khăn len" } },
];
