const pageTitles = {
  'why-scanner': 'Why Scanner?',
  'why-hp':      'Why HP?',
  'choose':      'Choose the Right Scanner',
  'products':    'Product Lineups',
  'software':    'Software & Solutions',
  'usecases':    'Use Cases',
  'faq':         'FAQ',
};

async function loadPage(page) {
  const area = document.getElementById('content-area');

  try {
    const res = await fetch(`content/${page}.html`);
    if (!res.ok) throw new Error();
    area.innerHTML = await res.text();
  } catch {
    area.innerHTML = `
      <p class="article-title">${pageTitles[page]}</p>
      <p class="article-subtitle">เนื้อหากำลังจัดทำ...</p>
    `;
  }

  // Update active nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Init FAQ accordion (one open at a time)
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // Init software feature accordion
  if (page === 'software') initFeatureAccordion();

  closeSidebar();
  window.scrollTo(0, 0);
}

function initFeatureAccordion() {
  document.querySelectorAll('.feature-item').forEach(item => {
    const btn = item.querySelector('.feature-toggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all others in same accordion
      const siblings = item.closest('.feature-accordion').querySelectorAll('.feature-item');
      siblings.forEach(s => s.classList.remove('open'));
      // Toggle clicked
      if (!isOpen) item.classList.add('open');
    });
  });
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('overlay').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('overlay').classList.remove('open');
}

// Nav clicks
document.querySelectorAll('.nav-item').forEach(el => {
  el.addEventListener('click', e => {
    e.preventDefault();
    loadPage(el.dataset.page);
  });
});

// Load default page
loadPage('why-scanner');
