/* AgenC vault lightbox — 12 character-locked stills. Esc / backdrop closes, ←/→ step. */
(() => {
  const grid = document.getElementById('vaultGrid'), box = document.getElementById('vbox');
  if (!grid || !box) return;
  const img = document.getElementById('vboxImg'), cap = document.getElementById('vboxCap');
  const links = Array.from(grid.querySelectorAll('.v-open'));
  let i = 0, last = null;
  const show = (n) => {
    i = (n + links.length) % links.length;
    const a = links[i], t = a.querySelector('img');
    img.src = a.getAttribute('href'); img.alt = t.alt;
    cap.textContent = (t.alt || '').replace(/^AgenC\s*/, '') + '  ·  ' + (i + 1) + ' / ' + links.length;
  };
  const open = (n) => { last = document.activeElement; show(n); box.hidden = false; document.documentElement.classList.add('v-lock'); requestAnimationFrame(() => box.classList.add('on')); box.querySelector('.v-x').focus(); };
  const close = () => { box.classList.remove('on'); box.hidden = true; document.documentElement.classList.remove('v-lock'); img.src = ''; if (last) last.focus(); };
  links.forEach((a, n) => a.addEventListener('click', (e) => { e.preventDefault(); open(n); }));
  box.addEventListener('click', (e) => {
    const v = e.target.closest('[data-v]')?.dataset.v;
    if (v === 'close') close(); else if (v === 'prev') show(i - 1); else if (v === 'next') show(i + 1);
    else if (e.target === box || e.target.classList.contains('v-stage')) close();
  });
  document.addEventListener('keydown', (e) => {
    if (box.hidden) return;
    if (e.key === 'Escape') close(); else if (e.key === 'ArrowLeft') show(i - 1); else if (e.key === 'ArrowRight') show(i + 1);
  });
})();
