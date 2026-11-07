# Thu nhỏ ảnh NGAY TẠI CHỖ để web nhẹ (ảnh gốc nặng sẽ bị thay thế):
#   src/assets/family  → cạnh dài tối đa 360px  (ảnh đại diện)
#   src/assets/gallery → cạnh dài tối đa 1280px (xem ảnh to)
# Ảnh .png/.webp/.heic được đổi sang .jpg và xóa file cũ. Ảnh đã nhỏ sẵn thì bỏ qua.
# Cách chạy (cần Pillow: pip3 install pillow):  python3 scripts/shrink-images.py
import os
from PIL import Image, ImageOps

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src", "assets")
TARGETS = {"family": 360, "gallery": 1280}
MAX_KB = {"family": 60, "gallery": 350}

for folder, size in TARGETS.items():
    d = os.path.join(ROOT, folder)
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        base, ext = os.path.splitext(f)
        if ext.lower() not in (".png", ".jpg", ".jpeg", ".webp", ".heic"):
            continue
        p = os.path.join(d, f)
        im = ImageOps.exif_transpose(Image.open(p))
        kb = os.path.getsize(p) // 1024
        if ext.lower() in (".jpg", ".jpeg") and max(im.size) <= size and kb <= MAX_KB[folder]:
            continue  # đã nhỏ rồi
        if im.mode in ("RGBA", "LA", "P"):
            im = im.convert("RGBA")
            bg = Image.new("RGB", im.size, (255, 255, 255))
            bg.paste(im, mask=im.split()[-1])
            im = bg
        else:
            im = im.convert("RGB")
        im.thumbnail((size, size), Image.LANCZOS)
        out = p if ext.lower() in (".jpg", ".jpeg") else os.path.join(d, base.lower() + ".jpg")
        im.save(out, "JPEG", quality=82 if folder == "family" else 80, optimize=True, progressive=True)
        if out != p:
            os.remove(p)
        print(f"{folder}/{f}: {kb}KB -> {os.path.getsize(out)//1024}KB {im.size}")
