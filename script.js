// ===== Voltex Protocol — interactions =====

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const navMobile = document.getElementById('navMobile');
  if (navToggle && navMobile) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMobile.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
    });
    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMobile.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');
  if (prefersReducedMotion) {
    revealEls.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  }

  /* Animated stat counters */
  const statNums = document.querySelectorAll('.stat-num');
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const prefix = el.dataset.prefix || '';
    const suffix = el.dataset.suffix || '';
    const isDecimal = String(el.dataset.count).includes('.');
    const duration = 1400;
    const start = performance.now();

    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = prefix + (isDecimal ? value.toFixed(1) : Math.round(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    if (prefersReducedMotion) {
      el.textContent = prefix + (isDecimal ? target.toFixed(1) : target) + suffix;
    } else {
      requestAnimationFrame(step);
    }
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  statNums.forEach(el => statObserver.observe(el));

  /* Vault dial charge animation */
  const dialProgress = document.getElementById('dialProgress');
  const dialFigure = document.getElementById('dialFigure');
  const circumference = 2 * Math.PI * 205; // r=205
  const targetPercent = 100;

  const chargeDial = () => {
    if (!dialProgress) return;
    const offset = circumference - (circumference * targetPercent) / 100;
    dialProgress.style.strokeDashoffset = prefersReducedMotion ? offset : circumference;
    if (!prefersReducedMotion) {
      requestAnimationFrame(() => {
        dialProgress.style.strokeDashoffset = offset;
      });
    }

    // Animate the percentage figure
    let current = 0;
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      current = Math.round(targetPercent * (1 - Math.pow(1 - progress, 3)));
      if (dialFigure) dialFigure.textContent = current + '%';
      if (progress < 1) requestAnimationFrame(step);
    };
    if (prefersReducedMotion) {
      if (dialFigure) dialFigure.textContent = targetPercent + '%';
    } else {
      requestAnimationFrame(step);
    }
  };

  const dialEl = document.querySelector('.hero-visual');
  if (dialEl) {
    const dialObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          chargeDial();
          dialObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    dialObserver.observe(dialEl);
  }

  /* Position orbiting nodes around the dial */
  document.querySelectorAll('.orbit-node').forEach(node => {
    const angle = parseFloat(node.dataset.angle) * (Math.PI / 180);
    const radius = 205;
    const cx = 220 + radius * Math.cos(angle);
    const cy = 220 + radius * Math.sin(angle);
    node.setAttribute('transform', `translate(${cx - 220} ${cy - 220})`);
  });

  /* Sticky nav shadow on scroll */
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 8) {
        nav.style.boxShadow = '0 8px 24px -12px rgba(0,0,0,0.5)';
      } else {
        nav.style.boxShadow = 'none';
      }
    });
  }
});
