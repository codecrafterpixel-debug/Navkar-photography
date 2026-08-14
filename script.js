const $ = (s) => document.querySelector(s),
  $$ = (s) => document.querySelectorAll(s);

/* Robust preloader: never gets stuck on normal navigation, Back/Forward, bfcache, or mobile. */
const pre = $("#preloader");
if (pre) {
  const bar = pre.querySelector(".loadbar span");
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    if (bar) bar.style.width = "100%";
    pre.classList.add("done");
    document.documentElement.classList.remove("loading");
  };
  document.documentElement.classList.add("loading");
  requestAnimationFrame(() => {
    if (bar) bar.style.width = "45%";
  });
  setTimeout(() => {
    if (bar) bar.style.width = "100%";
  }, 260);
  setTimeout(finish, 620);
  window.addEventListener("load", finish, { once: true });
  window.addEventListener("pageshow", finish, { once: true });
}

const header = $("#header");
addEventListener(
  "scroll",
  () => header?.classList.toggle("scrolled", scrollY > 30),
  { passive: true },
);
const ham = $("#hamb"),
  mn = $("#mobileNav"),
  mnClose = $("#mobileNavClose");
function setMenu(open) {
  if (!mn) return;
  mn.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
  ham?.classList.toggle("is-open", open);
  ham?.setAttribute("aria-expanded", String(open));
  ham?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  if (open) mn.scrollTop = 0;
}
ham?.addEventListener("click", () => setMenu(!mn.classList.contains("open")));
mnClose?.addEventListener("click", () => setMenu(false));
$$("\.mobile-nav a").forEach((a) =>
  a.addEventListener("click", () => setMenu(false)),
);
addEventListener("keydown", (e) => {
  if (e.key === "Escape" && mn?.classList.contains("open")) setMenu(false);
});

/* Hero automatic fade slider */
const hs = $$(".hero-slide");
if (hs.length) {
  let i = 0,
    hb = $("#heroBar"),
    hc = $("#heroCount");
  function go(n) {
    hs.forEach((x) => x.classList.remove("active"));
    hs[n].classList.add("active");
    if (hc)
      hc.textContent = `0${n + 1} / ${String(hs.length).padStart(2, "0")}`;
    if (hb) {
      hb.style.transition = "none";
      hb.style.width = "0";
      requestAnimationFrame(() => {
        hb.style.transition = "width 6s linear";
        hb.style.width = "100%";
      });
    }
    i = n;
  }
  go(0);
  setInterval(() => go((i + 1) % hs.length), 6000);
}

/* Featured story slider */
const fs = $$(".feature-slide");
if (fs.length) {
  let i = 0,
    fc = $("#fc");
  function fg(n) {
    fs.forEach((x) => x.classList.remove("active"));
    fs[n].classList.add("active");
    if (fc) fc.textContent = `0${n + 1} / 0${fs.length}`;
    i = n;
  }
  $("#fn")?.addEventListener("click", () => fg((i + 1) % fs.length));
  $("#fp")?.addEventListener("click", () =>
    fg((i + fs.length - 1) % fs.length),
  );
  setInterval(() => fg((i + 1) % fs.length), 7500);
}

/* Contact form demo */
$("#form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = $("#msg");
  if (msg) msg.textContent = "Thank you — we will contact you shortly.";
  e.target.reset();
});

/* Video cards: custom play button + native controls. */
$$(".video-play").forEach((btn) =>
  btn.addEventListener("click", () => {
    const video = btn.parentElement.querySelector("video");
    if (!video) return;
    if (video.paused) {
      video.play();
      btn.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
    } else {
      video.pause();
      btn.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';
    }
  }),
);
$$(".video-card video").forEach((video) =>
  video.addEventListener("play", () => {
    const b = video.parentElement.querySelector(".video-play");
    if (b) b.innerHTML = '<i class="fa-solid fa-pause" aria-hidden="true"></i>';
  }),
);
$$(".video-card video").forEach((video) =>
  video.addEventListener("pause", () => {
    const b = video.parentElement.querySelector(".video-play");
    if (b) b.innerHTML = '<i class="fa-solid fa-play" aria-hidden="true"></i>';
  }),
);

/* Scroll progress */
const progress = $("#scrollProgress");
function updateProgress() {
  if (!progress) return;
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.width =
    (max > 0 ? Math.min(100, (scrollY / max) * 100) : 0) + "%";
}
addEventListener("scroll", updateProgress, { passive: true });
addEventListener("resize", updateProgress);
updateProgress();

/* Smooth cross-page transition. Short and non-blocking. */
const transition = $("#pageTransition");
if (transition) {
  requestAnimationFrame(() => transition.classList.add("is-enter"));
  setTimeout(() => transition.classList.remove("is-enter"), 430);
  $$(".page-link").forEach((a) =>
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (
        !href ||
        href.startsWith("#") ||
        a.target === "_blank" ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return;
      e.preventDefault();
      transition.classList.remove("is-enter", "is-leave");
      void transition.offsetWidth;
      transition.classList.add("is-leave");
      setTimeout(() => {
        location.href = url.href;
      }, 300);
    }),
  );
}

/* Lightbox */
const lb = $("#lightbox");
if (lb) {
  const triggers = [...$$(".lightbox-trigger")],
    image = $("#lightboxImage"),
    meta = $("#lightboxMeta");
  let li = 0;
  function openLightbox(index) {
    li = (index + triggers.length) % triggers.length;
    const t = triggers[li];
    image.src = t.currentSrc || t.src;
    image.alt = t.alt || "";
    if (meta)
      meta.textContent = `${String(li + 1).padStart(2, "0")} / ${String(triggers.length).padStart(2, "0")} · ${t.dataset.lightbox || "Gallery"}`;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  triggers.forEach((t, n) =>
    t.addEventListener("click", () => openLightbox(n)),
  );
  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  $("#lightboxPrev")?.addEventListener("click", () => openLightbox(li - 1));
  $("#lightboxNext")?.addEventListener("click", () => openLightbox(li + 1));
  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(li - 1);
    if (e.key === "ArrowRight") openLightbox(li + 1);
  });
}

/* v14 interaction layer: reveal animations + robust mobile menu state */
document.addEventListener("DOMContentLoaded", () => {
  const revealTargets = [
    ".approach > .mini-label",
    ".approach-grid",
    ".approach-stats",
    ".section-head",
    ".preview",
    ".feature",
    ".films .section-head",
    ".film-card",
    ".team-photo",
    ".team-copy",
    ".services .service-intro",
    ".service",
    ".contact > div",
    ".booking-form",
    "footer .footer-top > div",
    "footer .footer-bottom",
    ".gallery-hero",
    ".category-card",
    ".gallery-title",
    ".masonry img",
  ];
  let order = 0;
  revealTargets.forEach((selector) => {
    $$(selector).forEach((el) => {
      if (el.dataset.revealBound) return;
      el.dataset.revealBound = "1";
      el.classList.add("reveal-ready");
      if (order % 4) el.classList.add(`reveal-delay-${order % 4}`);
      order++;
    });
  });

  const revealObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -7% 0px" },
        )
      : null;
  $$(".reveal-ready").forEach((el) =>
    revealObserver
      ? revealObserver.observe(el)
      : el.classList.add("is-visible"),
  );

  // Mobile menu: lock only the document, never the menu's own scroll area.
  const menu = $("#mobileNav");
  const menuButton = $("#hamb");
  const closeButton = $("#mobileNavClose");
  const setMobileMenu = (open) => {
    if (!menu) return;
    menu.classList.toggle("open", open);
    document.body.classList.toggle("menu-open", open);
    menuButton?.classList.toggle("is-open", open);
    menuButton?.setAttribute("aria-expanded", String(open));
    menuButton?.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (open) menu.scrollTop = 0;
  };
  closeButton?.addEventListener("click", () => setMobileMenu(false));
  menu?.addEventListener("click", (e) => {
    if (e.target === menu) setMobileMenu(false);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMobileMenu(false);
  });
});

/* Supabase Gallery Loader */
async function loadGalleryFromSupabase(bucketName) {
  // Ensure Supabase API is loaded
  if (!window.SupabaseAPI) {
    console.error(
      "Supabase API not loaded. Make sure supabase-config.js is included.",
    );
    return;
  }

  try {
    // Get images from the specified bucket
    const images = await window.SupabaseAPI.getImagesFromBucket(bucketName);

    // Find all gallery containers that match this bucket
    const galleryContainers = document.querySelectorAll(
      `[data-bucket="${bucketName}"]`,
    );

    galleryContainers.forEach((container) => {
      // Clear existing content
      container.innerHTML = "";

      // Add images to the gallery
      if (images.length === 0) {
        container.innerHTML =
          '<p style="text-align: center; color: #999; padding: 40px;">No images available in this gallery yet.</p>';
        return;
      }

      images.forEach((img, index) => {
        const img_el = document.createElement("img");
        img_el.src = img.url;
        img_el.alt = `Gallery image ${index + 1}`;
        img_el.className = "lightbox-trigger";
        img_el.dataset.lightbox = bucketName;
        img_el.loading = "lazy";
        img_el.style.cursor = "pointer";

        container.appendChild(img_el);
      });

      // Reinitialize lightbox for new images
      reinitializeLightbox();
    });
  } catch (error) {
    console.error("Error loading gallery from Supabase:", error);
  }
}

/* Reinitialize lightbox with new images */
function reinitializeLightbox() {
  const lb = $("#lightbox");
  if (!lb) return;

  const triggers = [...document.querySelectorAll(".lightbox-trigger")];
  if (triggers.length === 0) return;

  const image = $("#lightboxImage");
  const meta = $("#lightboxMeta");
  let li = 0;

  function openLightbox(index) {
    li = (index + triggers.length) % triggers.length;
    const t = triggers[li];
    image.src = t.currentSrc || t.src;
    image.alt = t.alt || "";
    if (meta)
      meta.textContent = `${String(li + 1).padStart(2, "0")} / ${String(triggers.length).padStart(2, "0")} · ${t.dataset.lightbox || "Gallery"}`;
    lb.classList.add("open");
    lb.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Remove old listeners by cloning elements
  triggers.forEach((t) => {
    const newT = t.cloneNode(true);
    t.replaceWith(newT);
  });

  // Get fresh triggers
  const freshTriggers = [...document.querySelectorAll(".lightbox-trigger")];

  freshTriggers.forEach((t, n) =>
    t.addEventListener("click", () => openLightbox(n)),
  );

  $("#lightboxClose")?.addEventListener("click", closeLightbox);
  $("#lightboxPrev")?.addEventListener("click", () => openLightbox(li - 1));
  $("#lightboxNext")?.addEventListener("click", () => openLightbox(li + 1));

  lb.addEventListener("click", (e) => {
    if (e.target === lb) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") openLightbox(li - 1);
    if (e.key === "ArrowRight") openLightbox(li + 1);
  });
}

/* Auto-load galleries on page load */
document.addEventListener("DOMContentLoaded", () => {
  // Check if page has gallery containers with data-bucket attribute
  const galleryContainers = document.querySelectorAll("[data-bucket]");
  galleryContainers.forEach((container) => {
    const bucket = container.dataset.bucket;
    if (bucket) {
      loadGalleryFromSupabase(bucket);
    }
  });
});
