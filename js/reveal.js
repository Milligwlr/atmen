/* Atmen — Reveal-on-scroll con IntersectionObserver. Sin GSAP. */
(function () {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal-up').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal-up').forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal-up').forEach(function (el) { obs.observe(el); });

  /* Navbar mobile toggler */
  var toggler = document.querySelector('.navbar__toggler');
  var menu = document.querySelector('.navbar__menu');
  if (toggler && menu) {
    toggler.addEventListener('click', function () {
      var expanded = toggler.getAttribute('aria-expanded') === 'true';
      toggler.setAttribute('aria-expanded', expanded ? 'false' : 'true');
      menu.classList.toggle('is-open');
    });
  }
})();
