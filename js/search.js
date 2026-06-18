// =============================================
// BRIGHT FUTURE – Site Search
// =============================================

const SITE_CONTENT = [
  {
    page: "Home",
    url: "index.html",
    sections: [
      { title: "Welcome", text: "We help learners improve their academic performance and confidence." },
      { title: "Why choose us", text: "Experienced and qualified tutors. Friendly, supportive learning environment. Affordable tutoring at only R250 per month. Proven improvement in academic results." },
      { title: "Our goal", text: "Our goal is to help every learner reach their full academic potential by providing quality education support and guidance." },
    ]
  },
  {
    page: "About",
    url: "about.html",
    sections: [
      { title: "Who we are", text: "Bright Future Youth Tutoring Centre is an educational support organisation that provides tutoring and academic guidance to high school learners." },
      { title: "Mission", text: "To support students by providing quality tutoring and learning resources that help them succeed academically." },
      { title: "Vision", text: "A future where every learner has access to the support and knowledge they need to reach their full potential." },
      { title: "Our history", text: "Bright Future Youth Tutoring Centre was established to help learners who struggle with their schoolwork. Over time the centre has helped many students improve their results and confidence." },
      { title: "Our values", text: "Commitment to excellence. Respect for all learners. Hard work and dedication. Continuous improvement." },
      { title: "Target audience", text: "Our services are aimed at high school learners who need extra support in their academic work." },
      { title: "Meet our team", text: "Manager Pretty Vengwa. CEO Mela Mcesi. COO Andiswa Hlophe." },
    ]
  },
  {
    page: "Services",
    url: "services.html",
    sections: [
      { title: "Subjects we offer", text: "Mathematics, English, Life Sciences, Computer Studies." },
      { title: "Age group supported", text: "Our tutoring services are designed for high school learners mainly from Grade 8 to Grade 12." },
      { title: "Teaching method", text: "We use interactive teaching methods such as one-on-one tutoring, group sessions and practical exercises." },
      { title: "After-school programmes", text: "We offer after-school programmes where learners can receive extra lessons, complete homework and prepare for exams in a supportive environment." },
      { title: "Additional services", text: "Homework assistance, exam preparation sessions, study skills training, assignment support." },
      { title: "Pricing", text: "R250 per month. 2 sessions per week. Grades 8 to 12. All subjects covered. Exam preparation included." },
    ]
  },
  {
    page: "Contact",
    url: "contact.html",
    sections: [
      { title: "Get in touch", text: "Call or WhatsApp 063 916 8209. Email brightfuture@gmail.com. Location Mbizana, Eastern Cape, South Africa." },
      { title: "Business hours", text: "Monday to Friday 14:00 to 18:00. Saturday 09:00 to 13:00. Sunday closed." },
    ]
  },
  {
    page: "Enquiry",
    url: "enquiry.html",
    sections: [
      { title: "Make an enquiry", text: "Fill in the form to contact Bright Future Youth Tutoring Centre. Our team will respond within 24 hours." },
      { title: "Why contact us", text: "Qualified and experienced tutors. Affordable tutoring services R250 per month. Proven improvement in academic performance." },
    ]
  },
];

// ---- Flatten into searchable records ----
const INDEX = [];
SITE_CONTENT.forEach(({ page, url, sections }) => {
  sections.forEach(({ title, text }) => {
    INDEX.push({ page, url, title, text: text.toLowerCase(), titleLower: title.toLowerCase() });
  });
});

function search(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const words = q.split(/\s+/);
  return INDEX.filter(item =>
    words.every(w => item.titleLower.includes(w) || item.text.includes(w))
  );
}

// ---- UI ----
function buildSearchUI() {
  // Overlay
  const overlay = document.createElement('div');
  overlay.id = 'search-overlay';
  overlay.innerHTML = `
    <div id="search-modal">
      <div id="search-modal-header">
        <input id="search-input" type="search" placeholder="Search the site… e.g. maths, pricing, hours" autocomplete="off" autofocus>
        <button id="search-close" aria-label="Close search">✕</button>
      </div>
      <div id="search-results"></div>
    </div>
  `;
  document.body.appendChild(overlay);

  const input = overlay.querySelector('#search-input');
  const resultsEl = overlay.querySelector('#search-results');
  const closeBtn = overlay.querySelector('#search-close');

  input.addEventListener('input', () => {
    const q = input.value;
    const results = search(q);
    renderResults(results, q, resultsEl);
  });

  closeBtn.addEventListener('click', closeSearch);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeSearch(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSearch(); });
}

function renderResults(results, query, container) {
  if (!query.trim()) {
    container.innerHTML = '<p class="search-hint">Start typing to search across all pages.</p>';
    return;
  }
  if (results.length === 0) {
    container.innerHTML = `<p class="search-hint">No results for "<strong>${escHtml(query)}</strong>". Try a different keyword.</p>`;
    return;
  }
  const html = results.map(r => `
    <a href="${r.url}" class="search-result-item">
      <span class="sr-page">${r.page}</span>
      <span class="sr-title">${highlight(r.title, query)}</span>
      <span class="sr-snippet">${highlight(truncate(r.text, 100), query)}</span>
    </a>
  `).join('');
  container.innerHTML = `<p class="search-count">${results.length} result${results.length !== 1 ? 's' : ''}</p>` + html;
}

function highlight(text, query) {
  const words = query.trim().split(/\s+/).filter(Boolean);
  let out = escHtml(text);
  words.forEach(w => {
    const re = new RegExp(`(${w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
    out = out.replace(re, '<mark>$1</mark>');
  });
  return out;
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) + '…' : str;
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function openSearch() {
  document.getElementById('search-overlay').classList.add('active');
  setTimeout(() => document.getElementById('search-input').focus(), 60);
  const resultsEl = document.getElementById('search-results');
  resultsEl.innerHTML = '<p class="search-hint">Start typing to search across all pages.</p>';
}

function closeSearch() {
  const overlay = document.getElementById('search-overlay');
  if (overlay) overlay.classList.remove('active');
}

document.addEventListener('DOMContentLoaded', () => {
  buildSearchUI();

  // Wire up any search trigger buttons
  document.querySelectorAll('.search-trigger').forEach(btn => {
    btn.addEventListener('click', openSearch);
  });

  // Keyboard shortcut: /
  document.addEventListener('keydown', e => {
    if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      openSearch();
    }
  });
});
