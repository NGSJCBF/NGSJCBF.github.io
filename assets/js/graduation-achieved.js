(function () {
  function initGraduationAchievements() {
    const elements = document.querySelectorAll('[data-grad-achieve]');

    if (!elements.length) {
      return;
    }

    elements.forEach(function (element) {
      if (element.dataset.gaInitialized === 'true') {
        return;
      }

      element.dataset.gaInitialized = 'true';

      if (!('IntersectionObserver' in window)) {
        element.classList.add('ga-play');
        return;
      }

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) {
              return;
            }

            entry.target.classList.add('ga-play');
            observer.unobserve(entry.target);
          });
        },
        {
          threshold: 0.38,
          rootMargin: '0px 0px -8% 0px'
        }
      );

      observer.observe(element);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGraduationAchievements);
  } else {
    initGraduationAchievements();
  }
})();
