
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menu-toggle");
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const themeToggle = document.getElementById("theme-toggle");
  const yearElement = document.getElementById("year");

  // Current year in footer
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Mobile navigation
  if (menuToggle && navbar) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navbar.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation menu" : "Open navigation menu"
      );
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navbar.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        menuToggle.textContent = "☰";
      });
    });
  }

  // Light and dark theme
  const updateThemeButton = () => {
    if (!themeToggle) return;

    const isLight = document.body.classList.contains("light-mode");
    themeToggle.textContent = isLight ? "Dark Mode" : "Light Mode";
    themeToggle.setAttribute(
      "aria-label",
      isLight ? "Switch to dark mode" : "Switch to light mode"
    );
    themeToggle.setAttribute("aria-pressed", String(isLight));
  };

  try {
    if (localStorage.getItem("portfolio-theme") === "light") {
      document.body.classList.add("light-mode");
    }
  } catch (error) {
    // Theme still works if local storage is unavailable.
  }

  updateThemeButton();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");

      const theme = document.body.classList.contains("light-mode")
        ? "light"
        : "dark";

      try {
        localStorage.setItem("portfolio-theme", theme);
      } catch (error) {
        // Ignore storage errors.
      }

      updateThemeButton();
    });
  }

  // Welcome screen
  const welcomeScreen = document.getElementById("welcome-screen");

  if (welcomeScreen) {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    window.setTimeout(() => {
      welcomeScreen.classList.add("is-leaving");

      window.setTimeout(
        () => welcomeScreen.remove(),
        reducedMotion ? 0 : 650
      );
    }, reducedMotion ? 800 : 2200);
  }

  // Typing animation
  const typingText = document.getElementById("typing-text");
  const typingTitles = [
    "Computer Engineering Student",
    "Future Computer Engineer",
    "Technology Enthusiast",
    "Aspiring Developer"
  ];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (typingText && !reducedMotion) {
    let titleIndex = 0;
    let characterIndex = typingTitles[0].length;
    let deleting = true;

    function typeNextTitle() {
      const currentTitle = typingTitles[titleIndex];

      if (deleting) {
        characterIndex--;
        typingText.textContent = currentTitle.slice(0, characterIndex);

        if (characterIndex <= 0) {
          deleting = false;
          titleIndex = (titleIndex + 1) % typingTitles.length;
          window.setTimeout(typeNextTitle, 350);
          return;
        }

        window.setTimeout(typeNextTitle, 45);
      } else {
        const nextTitle = typingTitles[titleIndex];
        characterIndex++;
        typingText.textContent = nextTitle.slice(0, characterIndex);

        if (characterIndex >= nextTitle.length) {
          deleting = true;
          window.setTimeout(typeNextTitle, 1800);
          return;
        }

        window.setTimeout(typeNextTitle, 75);
      }
    }

    window.setTimeout(typeNextTitle, 1800);
  }

  // Scroll reveal
  const revealElements = document.querySelectorAll(
    ".section-heading, .about-card, .skill-card, " +
    ".project-card, .gallery-card, .contact-card"
  );

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => element.classList.add("visible"));
  } else {
    revealElements.forEach((element) => element.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach((element) => revealObserver.observe(element));
  }

  // Local image previews are temporary and are never uploaded or saved.
  const motorcycleInput = document.getElementById("motorcycle-photo-input");
  const motorcyclePreview = document.getElementById("motorcycle-preview");
  const motorcycleGallery = document.getElementById("motorcycle-gallery");
  let motorcyclePreviewUrl = null;

  if (motorcycleInput && motorcyclePreview && motorcycleGallery) {
    motorcycleInput.addEventListener("change", () => {
      if (motorcyclePreviewUrl) URL.revokeObjectURL(motorcyclePreviewUrl);
      motorcyclePreviewUrl = null;
      motorcyclePreview.replaceChildren();
      motorcyclePreview.hidden = true;
      const file = motorcycleInput.files?.[0];
      if (!file) return;
      if (!file.type.startsWith("image/")) {
        motorcycleInput.value = "";
        motorcyclePreview.textContent = "Please choose an image file.";
        motorcyclePreview.classList.add("upload-error");
        motorcyclePreview.hidden = false;
        return;
      }

      motorcyclePreview.classList.remove("upload-error");
      motorcyclePreviewUrl = URL.createObjectURL(file);
      const image = document.createElement("img");
      image.src = motorcyclePreviewUrl;
      image.alt = `Preview of ${file.name}`;
      const actions = document.createElement("div");
      actions.className = "preview-actions";
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.className = "btn btn-primary";
      addButton.textContent = "Add preview to gallery";
      const cancelButton = document.createElement("button");
      cancelButton.type = "button";
      cancelButton.className = "btn btn-outline";
      cancelButton.textContent = "Cancel";
      actions.append(addButton, cancelButton);
      motorcyclePreview.append(image, actions);
      motorcyclePreview.hidden = false;

      addButton.addEventListener("click", () => {
        const figure = document.createElement("figure");
        figure.className = "motorcycle-photo temporary-photo";
        const galleryImage = document.createElement("img");
        galleryImage.src = URL.createObjectURL(file);
        galleryImage.alt = `Motorcycle photo: ${file.name}`;
        const caption = document.createElement("figcaption");
        caption.textContent = file.name;
        figure.append(galleryImage, caption);
        motorcycleGallery.appendChild(figure);
        motorcyclePreview.hidden = true;
        motorcycleInput.value = "";
      });
      cancelButton.addEventListener("click", () => {
        URL.revokeObjectURL(motorcyclePreviewUrl);
        motorcyclePreviewUrl = null;
        motorcyclePreview.replaceChildren();
        motorcyclePreview.hidden = true;
        motorcycleInput.value = "";
      });
    });
  }

  // Allow a browser-only preview of a local audio file supplied by the visitor.
  const musicInput = document.getElementById("music-file-input");
  const musicPlayer = document.getElementById("music-player");
  const musicStatus = document.getElementById("music-file-status");
  let musicPreviewUrl = null;
  if (musicInput && musicPlayer && musicStatus) {
    musicInput.addEventListener("change", () => {
      if (musicPreviewUrl) URL.revokeObjectURL(musicPreviewUrl);
      musicPreviewUrl = null;
      musicPlayer.pause();
      musicPlayer.removeAttribute("src");
      musicPlayer.hidden = true;
      const file = musicInput.files?.[0];
      if (!file) {
        musicStatus.textContent = "No song selected yet. Choose a local audio file to preview it here.";
        return;
      }
      if (!file.type.startsWith("audio/")) {
        musicInput.value = "";
        musicStatus.textContent = "Please choose an audio file.";
        return;
      }
      musicPreviewUrl = URL.createObjectURL(file);
      musicPlayer.src = musicPreviewUrl;
      musicPlayer.hidden = false;
      musicStatus.textContent = `Previewing locally: ${file.name}`;
    });
  }

  // Game-style menu: each item opens one portfolio panel.
  const panels = Array.from(document.querySelectorAll("main > section[id]"));

  function activatePanel(id, options = {}) {
    const panel = panels.find((item) => item.id === id) || panels[0];
    if (!panel) return;

    document.body.classList.add("panel-mode");
    panels.forEach((item) => {
      const isActive = item === panel;
      item.hidden = !isActive;
      item.classList.toggle("panel-active", isActive);
      item.setAttribute("aria-hidden", String(!isActive));
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${panel.id}`;
      link.classList.toggle("active", isActive);
      if (isActive) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    if (options.updateHistory) {
      window.history.pushState({ panel: panel.id }, "", `#${panel.id}`);
    }
    window.scrollTo({
      top: 0,
      behavior: reducedMotion ? "auto" : "smooth"
    });

    if (options.focus) {
      const heading = panel.querySelector("h1, h2");
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({ preventScroll: true });
      }
    }
  }

  const initialPanel = window.location.hash.slice(1) || "home";
  activatePanel(initialPanel);

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;

    const id = link.getAttribute("href").slice(1);
    if (!panels.some((panel) => panel.id === id)) return;

    event.preventDefault();
    activatePanel(id, { updateHistory: true, focus: true });
  });

  window.addEventListener("popstate", () => {
    activatePanel(window.location.hash.slice(1) || "home");
  });

  if (navbar) {
    navbar.addEventListener("keydown", (event) => {
      const currentIndex = Array.from(navLinks).indexOf(event.target);
      if (currentIndex < 0) return;

      let nextIndex = currentIndex;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") nextIndex++;
      else if (event.key === "ArrowUp" || event.key === "ArrowLeft") nextIndex--;
      else return;

      event.preventDefault();
      nextIndex = (nextIndex + navLinks.length) % navLinks.length;
      navLinks[nextIndex].focus();
      activatePanel(navLinks[nextIndex].getAttribute("href").slice(1), {
        updateHistory: true
      });
    });
  }

  // Scroll progress bar and Back to Top button
  const progressBar = document.getElementById("scroll-progress");
  const backToTop = document.getElementById("back-to-top");

  function updateScrollUI() {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    const progress = scrollableHeight > 0
      ? (window.scrollY / scrollableHeight) * 100
      : 0;

    if (progressBar) {
      progressBar.style.width = `${progress}%`;
    }

    if (backToTop) {
      backToTop.classList.toggle("show", window.scrollY > 350);
    }
  }

  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  if (backToTop) {
    backToTop.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion ? "auto" : "smooth"
      });
    });
  }

  // Animated skill bars
  const skillMeters = document.querySelectorAll(".skill-meter-track span");

  if ("IntersectionObserver" in window && !reducedMotion) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    skillMeters.forEach((meter) => skillsObserver.observe(meter));
  } else {
    skillMeters.forEach((meter) => meter.classList.add("animate"));
  }

  // AutoCAD gallery lightbox
  const galleryCards = document.querySelectorAll(".gallery-card");

  const lightbox = document.createElement("div");
  lightbox.className = "gallery-lightbox";
  lightbox.setAttribute("role", "dialog");
  lightbox.setAttribute("aria-modal", "true");
  lightbox.setAttribute("aria-label", "Gallery preview");
  lightbox.hidden = true;
  lightbox.innerHTML = `
    <div class="lightbox-panel">
      <button class="lightbox-close" type="button" aria-label="Close preview">×</button>
      <div class="lightbox-content"></div>
    </div>
  `;

  document.body.appendChild(lightbox);

  const lightboxContent = lightbox.querySelector(".lightbox-content");
  const lightboxClose = lightbox.querySelector(".lightbox-close");
  let lastFocusedElement = null;

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.classList.remove("lightbox-open");

    if (lastFocusedElement) lastFocusedElement.focus();
  }

  galleryCards.forEach((card) => {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", "Open gallery preview");

    function openPreview() {
      const image = card.querySelector("img");
      const title = card.querySelector("h3")?.textContent || "Portfolio work";
      const description =
        card.querySelector(".gallery-info p")?.textContent || "";

      lastFocusedElement = card;
      lightboxContent.replaceChildren();

      if (image) {
        const largeImage = document.createElement("img");
        largeImage.src = image.src;
        largeImage.alt = image.alt || title;
        lightboxContent.appendChild(largeImage);
      } else {
        const placeholder = card.querySelector(".gallery-placeholder");

        if (placeholder) {
          const preview = placeholder.cloneNode(true);
          preview.classList.add("lightbox-placeholder");
          lightboxContent.appendChild(preview);
        }
      }

      const heading = document.createElement("h2");
      heading.textContent = title;

      const caption = document.createElement("p");
      caption.textContent = description;

      lightboxContent.append(heading, caption);
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      lightboxClose.focus();
    }

    card.addEventListener("click", (event) => {
      if (event.target.closest("a, button")) return;
      openPreview();
    });

    card.addEventListener("keydown", (event) => {
      if (event.target !== card) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openPreview();
      }
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) {
      closeLightbox();
    }
  });
});
