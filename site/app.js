const app = document.querySelector("#app");
const stories = (window.STORY_LIBRARY || []).filter((story) => story.published);

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getCurrentSlug = () => new URLSearchParams(window.location.search).get("story");

const countThaiFriendlyWords = (paragraphs) => {
  const text = paragraphs.join(" ").trim();
  const spaceSeparated = text.split(/\s+/).filter(Boolean);
  if (spaceSeparated.length > 1) return spaceSeparated.length;
  return Array.from(text).filter((char) => /[\p{Letter}\p{Number}]/u.test(char)).length;
};

const renderTags = (tags) =>
  tags.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join("");

const storyCard = (story) => `
  <article class="story-card" style="--accent:${story.accent}">
    <a class="story-card-link" href="?story=${encodeURIComponent(story.slug)}">
      <img src="${escapeHtml(story.coverImage)}" alt="${escapeHtml(story.title)}" loading="lazy" />
      <div class="story-card-body">
        <div class="story-meta">
          <span>${escapeHtml(story.ageRange)} ปี</span>
          <span>${escapeHtml(story.readTime)}</span>
        </div>
        <h2>${escapeHtml(story.title)}</h2>
        <p>${escapeHtml(story.summary)}</p>
        <div class="tags">${renderTags(story.tags)}</div>
      </div>
    </a>
  </article>
`;

const renderHome = () => {
  const [featured, ...rest] = stories;
  const latest = [...stories].slice(0, 6);

  if (!featured) {
    app.innerHTML = `
      <section class="empty-state">
        <h1>กำลังเตรียมนิทานชุดแรก</h1>
        <p>เรื่องใหม่จะแสดงที่นี่เมื่อพร้อมเผยแพร่</p>
      </section>
    `;
    return;
  }

  app.innerHTML = `
    <section class="home-grid" id="latest">
      <article class="featured-story" style="--accent:${featured.accent}">
        <div class="featured-copy">
          <div class="eyebrow">เรื่องแนะนำ</div>
          <h1>${escapeHtml(featured.title)}</h1>
          <p>${escapeHtml(featured.summary)}</p>
          <div class="story-meta">
            <span>${escapeHtml(featured.ageRange)} ปี</span>
            <span>${escapeHtml(featured.readTime)}</span>
            <span>${countThaiFriendlyWords(featured.body).toLocaleString("th-TH")} คำ</span>
          </div>
          <a class="primary-action" href="?story=${encodeURIComponent(featured.slug)}">อ่านเรื่องนี้</a>
        </div>
        <img src="${escapeHtml(featured.coverImage)}" alt="${escapeHtml(featured.title)}" />
      </article>

      <section class="library-panel" aria-labelledby="library-title">
        <div class="section-heading">
          <div>
            <p class="eyebrow">เลือกอ่าน</p>
            <h2 id="library-title">รายการนิทาน</h2>
          </div>
          <label class="search-box">
            <span class="visually-hidden">ค้นหานิทาน</span>
            <input id="story-search" type="search" placeholder="ค้นหาชื่อเรื่องหรือธีม" autocomplete="off" />
          </label>
        </div>
        <div id="story-grid" class="story-grid">
          ${latest.map(storyCard).join("")}
        </div>
      </section>
    </section>
  `;

  const grid = document.querySelector("#story-grid");
  const search = document.querySelector("#story-search");
  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    const filtered = stories.filter((story) => {
      const haystack = [story.title, story.summary, story.ageRange, ...story.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
    grid.innerHTML = filtered.length
      ? filtered.map(storyCard).join("")
      : `<div class="no-results">ไม่พบนิทานที่ตรงกับคำค้น</div>`;
  });
};

const renderStory = (story) => {
  const wordCount = countThaiFriendlyWords(story.body).toLocaleString("th-TH");
  app.innerHTML = `
    <article class="reader" style="--accent:${story.accent}">
      <a class="back-link" href="./">กลับไปเลือกนิทาน</a>
      <header class="reader-header">
        <div>
          <div class="eyebrow">${escapeHtml(story.ageRange)} ปี</div>
          <h1>${escapeHtml(story.title)}</h1>
          <p>${escapeHtml(story.summary)}</p>
          <div class="story-meta">
            <span>${escapeHtml(story.readTime)}</span>
            <span>${wordCount} คำ</span>
          </div>
        </div>
        <img src="${escapeHtml(story.coverImage)}" alt="${escapeHtml(story.title)}" />
      </header>
      <div class="reader-layout">
        <section class="story-body">
          ${story.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </section>
        <aside class="illustration-strip" aria-label="ภาพประกอบ">
          ${story.gallery
            .map(
              (image, index) => `
                <img src="${escapeHtml(image)}" alt="ภาพประกอบ ${index + 1} ของ ${escapeHtml(story.title)}" loading="lazy" />
              `,
            )
            .join("")}
        </aside>
      </div>
    </article>
  `;
};

const render = () => {
  const slug = getCurrentSlug();
  const story = stories.find((item) => item.slug === slug);
  if (slug && story) {
    renderStory(story);
  } else {
    renderHome();
  }
  app.focus({ preventScroll: true });
};

window.addEventListener("popstate", render);
render();
