/* ============================================================
   Portfolio — interactions
   Vanilla JS, no dependencies. Everything degrades gracefully:
   the page is fully readable if JS never runs.
   ============================================================ */
(() => {
  "use strict";

  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const html = document.documentElement;

  /* ---------------- theme ---------------- */
  const THEME_KEY = "asb-theme";
  const themeToggle = $("#theme-toggle");

  const applyTheme = (theme) => {
    html.setAttribute("data-theme", theme);
    if (themeToggle) {
      themeToggle.setAttribute("aria-pressed", String(theme === "dark"));
      themeToggle.setAttribute("aria-label", theme === "dark" ? "Passer au thème clair" : "Passer au thème sombre");
    }
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0b0c0f" : "#f6f2ea");
  };

  const savedTheme = (() => {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  })();
  const initialTheme = savedTheme
    || (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
  applyTheme(initialTheme);

  themeToggle?.addEventListener("click", () => {
    const next = html.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch { /* private mode */ }
  });

  /* ---------------- mobile menu ---------------- */
  const menuBtn = $("#menu-btn");
  const nav = $("#nav");
  let navOpen = false;

  const setNav = (open) => {
    if (!nav || !menuBtn) return;
    navOpen = open;
    nav.classList.toggle("is-open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  };

  menuBtn?.addEventListener("click", () => setNav(!navOpen));
  nav?.addEventListener("click", (e) => {
    if (e.target.closest("a")) setNav(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navOpen) { setNav(false); menuBtn?.focus(); }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 820 && navOpen) setNav(false);
  });

  /* ---------------- header state + scroll progress ---------------- */
  const header = $("#site-header");
  const progress = $("#scroll-progress");
  const toTop = $("#to-top");

  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle("is-stuck", y > 8);
    toTop?.classList.toggle("is-visible", y > 600);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, (y / max) * 100) : 0;
      progress.style.width = pct + "%";
    }
    ticking = false;
  };

  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });

  toTop?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------------- reveal on scroll ---------------- */
  const revealables = $$(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealables.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });

    revealables.forEach((el, i) => {
      // stagger siblings slightly for a composed cascade
      const delay = Math.min(220, (i % 4) * 60);
      el.style.transitionDelay = delay + "ms";
      revealObserver.observe(el);
    });
  }

  /* ---------------- scroll spy ---------------- */
  const navLinks = $$("#nav a[href^='#']");
  const sections = navLinks
    .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
    .filter((item) => item.section);

  if ("IntersectionObserver" in window && sections.length) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((l) => l.classList.remove("is-active"));
        const match = sections.find((s) => s.section === entry.target);
        match?.link.classList.add("is-active");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    sections.forEach((s) => spy.observe(s.section));
  }

  /* ---------------- animated counters ---------------- */
  const counters = $$("[data-count]");

  const animateCount = (el) => {
    const target = Number(el.dataset.count);
    const suffix = el.dataset.suffix ?? "";
    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion) {
      el.textContent = target + suffix;
      return;
    }

    const duration = 1100;
    const start = performance.now();

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      el.textContent = Math.round(target * eased) + suffix;
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ("IntersectionObserver" in window) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => countObserver.observe(el));
  } else {
    counters.forEach((el) => { el.textContent = el.dataset.count + (el.dataset.suffix ?? ""); });
  }

  /* ---------------- year ---------------- */
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ---------------- graceful image chain: local → remote → monogram ---------------- */
  const showMonogram = (img) => {
    const fb = document.createElement("div");
    fb.className = "portrait-fallback";
    fb.setAttribute("role", "img");
    fb.setAttribute("aria-label", "Monogramme ASB");
    fb.innerHTML = "<span>ASB</span>";
    img.replaceWith(fb);
  };

  $$("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", function onError() {
      const remote = img.dataset.fallback;
      if (remote && img.src !== remote) {
        img.dataset.fallback = "";
        img.src = remote;          // one retry against the remote copy
        return;
      }
      img.removeEventListener("error", onError);
      showMonogram(img);
    });
  });
  $$("img:not([data-fallback])").forEach((img) => {
    img.addEventListener("error", () => showMonogram(img), { once: true });
  });

  /* mark JS as ready (helps progressive enhancement hooks) */
  html.classList.add("js-ready");
})();
