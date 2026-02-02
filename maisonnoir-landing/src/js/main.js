const html = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
const mobileThemeToggleBtn = document.getElementById('mobile-theme-toggle');

const i18nConfig = window.I18N_CONTENT || {};
const initialLang = html.getAttribute('lang') || 'en';
const activeLanguage = i18nConfig[initialLang] || i18nConfig.en;

const getI18nString = (key) => {
  if (!activeLanguage || !activeLanguage.strings) return undefined;
  return activeLanguage.strings[key];
};

const applyI18nText = () => {
  if (!activeLanguage) return;
  html.setAttribute('dir', activeLanguage.dir || 'ltr');

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const key = element.dataset.i18n;
    const value = getI18nString(key);
    if (typeof value === 'string') {
      element.textContent = value;
    }
  });

  document.querySelectorAll('[data-i18n-attr]').forEach((element) => {
    const mappings = element.dataset.i18nAttr
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean);

    mappings.forEach((mapping) => {
      const [attribute, key] = mapping.split(':').map((part) => part.trim());
      if (!attribute || !key) return;
      const value = getI18nString(key);
      if (typeof value === 'string') {
        element.setAttribute(attribute, value);
      }
    });
  });
};

const toggleTheme = () => {
  if (html.classList.contains('dark')) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
};

if (themeToggleBtn) themeToggleBtn.addEventListener('click', toggleTheme);
if (mobileThemeToggleBtn) mobileThemeToggleBtn.addEventListener('click', toggleTheme);

applyI18nText();

const tabs = document.querySelectorAll('.project-tab');
const slides = document.querySelectorAll('.project-slide');

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((item) => {
      item.classList.remove('active');
      item.classList.add('border-transparent', 'text-gray-500');
      item.classList.remove('border-primary', 'text-neutral-dark', 'dark:text-white');
    });
    slides.forEach((slide) => slide.classList.add('hidden'));
    tab.classList.add('active');
    tab.classList.remove('border-transparent', 'text-gray-500');
    tab.classList.add('border-primary', 'text-neutral-dark', 'dark:text-white');
    const index = tab.getAttribute('data-index');
    slides[index].classList.remove('hidden');
  });
});

let activeSliderElement = null;

const updateSlider = (event, pageX) => {
  if (!activeSliderElement) return;
  const rect = activeSliderElement.getBoundingClientRect();
  const handle = activeSliderElement.querySelector('.slider-handle');
  const beforeImg = activeSliderElement.querySelector('.before-image');
  const leftLabel = activeSliderElement.querySelector('.left-label');
  const rightLabel = activeSliderElement.querySelector('.right-label');
  let pos = ((pageX - rect.left) / rect.width) * 100;

  if (pos < 0) pos = 0;
  if (pos > 100) pos = 100;

  handle.style.left = `${pos}%`;
  beforeImg.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;

  if (pos < 15) {
    leftLabel.style.opacity = '0';
  } else if (pos > 85) {
    rightLabel.style.opacity = '0';
  } else {
    leftLabel.style.opacity = '1';
    rightLabel.style.opacity = '1';
  }
};

document.querySelectorAll('.before-after-slider').forEach((slider) => {
  slider.addEventListener('mousedown', (event) => {
    activeSliderElement = slider;
    updateSlider(event, event.pageX);
  });
  slider.addEventListener('touchstart', (event) => {
    activeSliderElement = slider;
    updateSlider(event, event.touches[0].pageX);
  });
});

window.addEventListener('mouseup', () => {
  activeSliderElement = null;
});
window.addEventListener('touchend', () => {
  activeSliderElement = null;
});
window.addEventListener('mousemove', (event) => {
  if (activeSliderElement) {
    event.preventDefault();
    updateSlider(event, event.pageX);
  }
});
window.addEventListener('touchmove', (event) => {
  if (activeSliderElement) {
    updateSlider(event, event.touches[0].pageX);
  }
});

window.addEventListener('scroll', () => {
  const parallaxBgs = document.querySelectorAll('.parallax-bg');
  parallaxBgs.forEach((bg) => {
    const parent = bg.closest('.parallax-container');
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const shift = (window.innerHeight - rect.top) * 0.05;
      bg.style.transform = `translateY(${shift}px) scale(1.1)`;
    }
  });

  const reveals = document.querySelectorAll('.reveal-text');
  reveals.forEach((element) => {
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      element.classList.add('active');
    }
  });
});

window.dispatchEvent(new Event('scroll'));
