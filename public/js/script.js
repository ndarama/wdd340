// public/js/script.js
document.addEventListener('DOMContentLoaded', () => {
  // ===== Review Carousel =====
  const reviews = Array.from(document.querySelectorAll('.reviews-list li'));
  let currentReview = 0;

  function showReview(index) {
    reviews.forEach((li, i) => {
      li.style.display = i === index ? 'list-item' : 'none';
    });
  }

  // initialize & rotate every 5s
  if (reviews.length > 0) {
    showReview(currentReview);
    setInterval(() => {
      currentReview = (currentReview + 1) % reviews.length;
      showReview(currentReview);
    }, 5000);
  }

  // ===== Smooth‐scroll “Own Today” to Upgrades Section =====
  const ownBtn = document.querySelector('.btn-primary');
  const upgradesSection = document.querySelector('section.upgrades');
  if (ownBtn && upgradesSection) {
    ownBtn.addEventListener('click', e => {
      e.preventDefault();
      upgradesSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // ===== Upgrade Links Placeholder =====
  document.querySelectorAll('.upgrade-item a').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const name = link.querySelector('p')?.textContent || 'this upgrade';
      alert(`🚧 You selected the ${name}. Feature coming soon!`);
    });
  });

  // ===== Lazy‐load all images (if supported) =====
  document.querySelectorAll('img').forEach(img => {
    if ('loading' in HTMLImageElement.prototype) {
      img.setAttribute('loading', 'lazy');
    }
  });
});
