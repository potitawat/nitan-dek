# นิทานเด็ก

เว็บไซต์รวม **นิทานเด็ก** สำหรับเลือกอ่านหลายเรื่อง เพิ่มเรื่องใหม่ได้เรื่อย ๆ ผ่านไฟล์ข้อมูลใน `site/stories.js`

## Run locally

```sh
python3 -m http.server 4173 --directory site
```

เปิด `http://localhost:4173`

## Add a story

1. เพิ่มไฟล์ภาพประกอบไว้ใน `site/assets/illustrations/`
2. เพิ่ม object ใหม่ใน `window.STORY_LIBRARY` ที่ `site/stories.js`
3. ใส่ `published: true` เมื่อพร้อมให้แสดงบนเว็บไซต์

โครงเรื่องหนึ่งเรื่อง:

```js
{
  slug: "unique-story-slug",
  title: "ชื่อเรื่อง",
  ageRange: "4-7",
  readTime: "8 นาที",
  summary: "คำโปรยสั้น ๆ",
  tags: ["ความกล้า", "มิตรภาพ"],
  accent: "#247ba0",
  coverImage: "assets/illustrations/cover.svg",
  gallery: ["assets/illustrations/scene.svg"],
  published: true,
  body: [
    "ย่อหน้าแรก...",
    "ย่อหน้าถัดไป..."
  ]
}
```

## Deploy

โปรเจกต์นี้มี GitHub Actions สำหรับ GitHub Pages อยู่ที่ `.github/workflows/pages.yml` เมื่อ push เข้า `main` แล้ว workflow จะเผยแพร่เนื้อหาในโฟลเดอร์ `site/`
